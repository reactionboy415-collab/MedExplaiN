import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Simple in-memory rate limiter to prevent abuse (expert-level protection)
interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitStore: Record<string, RateLimitRecord> = {};

function rateLimiter(limit: number, windowMs: number) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // Extract IP safely from proxy and socket headers
    const rawIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "127.0.0.1";
    const ip = typeof rawIp === "string" ? rawIp.split(",")[0].trim() : String(rawIp);
    const now = Date.now();

    if (!rateLimitStore[ip]) {
      rateLimitStore[ip] = {
        count: 1,
        resetTime: now + windowMs,
      };
      return next();
    }

    const record = rateLimitStore[ip];
    if (now > record.resetTime) {
      record.count = 1;
      record.resetTime = now + windowMs;
      return next();
    }

    record.count++;
    if (record.count > limit) {
      console.warn(`[Rate Limit Exceeded] IP: ${ip} exceeded limits. count: ${record.count}`);
      return res.status(429).json({
        success: false,
        error: "Too many requests. Please wait a moment before trying again.",
      });
    }

    next();
  };
}

// Increase payloads limit for base64 uploads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Lazy initializer for Google Gen AI
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === "MY_GEMINI_API_KEY") {
      throw new Error(
        "GEMINI_API_KEY environment variable is required. Please set it in Settings > Secrets."
      );
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Helper to parse strings to numbers or null for API compatibility
function parseToNumberOrNull(val: any): number | null {
  if (val === undefined || val === null) return null;
  if (typeof val === "number") {
    return isNaN(val) ? null : val;
  }
  const str = String(val).trim();
  if (str === "" || str.toLowerCase() === "null" || str.toLowerCase() === "none") return null;
  const cleaned = str.replace(/,/g, "");
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? null : parsed;
}

interface GeminiCallResult {
  response: any;
  model: string;
}

// Robust retry and fallback wrapper to handle 503/UNAVAILABLE/429/RESOURCE_EXHAUSTED spikes automatically
async function generateContentWithRetryAndFallback(
  params: any,
  retries = 3,
  delayMs = 1500
): Promise<GeminiCallResult> {
  const ai = getAiClient();
  let attempt = 0;
  let currentModel = params.model || "gemini-3.5-flash";

  while (true) {
    try {
      const callParams = { ...params, model: currentModel };
      const response = await ai.models.generateContent(callParams);
      return { response, model: currentModel };
    } catch (error: any) {
      attempt++;
      const errorMessage = String(error.message || "");
      const isTransientOrQuota =
        errorMessage.includes("503") ||
        errorMessage.includes("UNAVAILABLE") ||
        errorMessage.includes("high demand") ||
        errorMessage.includes("429") ||
        errorMessage.includes("quota") ||
        errorMessage.includes("Quota") ||
        errorMessage.includes("RESOURCE_EXHAUSTED") ||
        error.status === 503 ||
        error.code === 503 ||
        error.status === 429 ||
        error.code === 429;

      if (isTransientOrQuota) {
        if (attempt <= retries) {
          console.warn(
            `[Gemini Retry] Model ${currentModel} received temporary error/429. Retrying attempt ${attempt}/${retries} in ${delayMs}ms...`
          );
          await new Promise((resolve) => setTimeout(resolve, delayMs));
          delayMs *= 2; // Exponential backoff
          continue;
        } else if (currentModel === "gemini-3.5-flash") {
          console.warn(
            `[Gemini Fallback] Model gemini-3.5-flash exhausted retries. Falling back to gemini-3.1-flash-lite...`
          );
          currentModel = "gemini-3.1-flash-lite";
          attempt = 0; // Reset attempts for the fallback model
          delayMs = 1500; // Reset delay
          continue;
        }
      }
      throw error;
    }
  }
}

// 0. Server Health Check API
app.get("/api/health", (req, res) => {
  res.json({ success: true, status: "healthy", timestamp: new Date().toISOString() });
});

// Limit upload endpoint: Max 15 uploads per minute per IP
const uploadRateLimiter = rateLimiter(15, 60 * 1000);

// 1. Upload & OCR Lab Report / Prescription / Label
app.post("/api/upload-lab", uploadRateLimiter, async (req, res) => {
  try {
    const { base64Image, mimeType } = req.body;
    if (!base64Image) {
      return res.status(400).json({ success: false, error: "Missing base64Image parameter" });
    }

    // Supports data:image/png;base64, data:application/pdf;base64, etc.
    const base64Cleaned = base64Image.replace(/^data:[^;]+;base64,/, "");

    // Prepare headers exactly mimicking the curl request provided by the user to avoid blocks
    const headers = {
      "Content-Type": "application/json",
      "User-Agent": "Mozilla/5.0 (Linux; Android 12; LAVA Blaze Build/SP1A.210812.016; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/150.0.7871.46 Mobile Safari/537.36",
      "origin": "https://drkhan.ai",
      "sec-ch-ua-platform": '"Android"',
      "sec-ch-ua": '"Not;A=Brand";v="8", "Chromium";v="150", "Android WebView";v="150"',
      "sec-ch-ua-mobile": "?1",
      "x-requested-with": "mark.via.gp",
      "sec-fetch-site": "same-origin",
      "sec-fetch-mode": "cors",
      "sec-fetch-dest": "empty",
      "accept-language": "en-IN,en-US;q=0.9,en;q=0.8",
      "priority": "u=1, i"
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15-second timeout

    try {
      console.log("[DrKhan API] Attempting to call https://drkhan.ai/api/upload-lab...");
      const externalResponse = await fetch("https://drkhan.ai/api/upload-lab", {
        method: "POST",
        headers,
        body: JSON.stringify({ base64Image: base64Cleaned, mimeType: mimeType || "image/jpeg" }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (externalResponse.ok) {
        const data = await externalResponse.json();
        console.log("[DrKhan API] Successfully fetched from drkhan.ai upload-lab API.");
        return res.json(data);
      } else {
        const errText = await externalResponse.text();
        console.error(`[DrKhan API Error] upload-lab status ${externalResponse.status}: ${errText}`);
        return res.status(externalResponse.status).json({
          success: false,
          error: `Dr. Khan AI was unable to parse the medical document. Please make sure the image is clear and try again. [Details: ${errText}]`
        });
      }
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      console.error(`[DrKhan API Connection Error] Connection note on upload-lab:`, fetchError);
      return res.status(502).json({
        success: false,
        error: `Failed to connect to Dr. Khan AI OCR server. Please try again. [Error: ${fetchError.message}]`
      });
    }
  } catch (error: any) {
    console.error("Error in /api/upload-lab:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "An error occurred during report extraction.",
    });
  }
});

// Limit analyze endpoint: Max 25 requests per minute per IP
const analyzeRateLimiter = rateLimiter(25, 60 * 1000);

// 2. Deep Medical Explanation & Simplifier
app.post("/api/analyze-lab", analyzeRateLimiter, async (req, res) => {
  try {
    const { report, language } = req.body;
    if (!report) {
      return res.status(400).json({ success: false, error: "Missing report data" });
    }

    const biomarkers = report.biomarkers || [];
    const hasBiomarkers = Array.isArray(biomarkers) && biomarkers.length > 0;

    if (!hasBiomarkers) {
      return res.status(400).json({
        success: false,
        error: "No active medical biomarkers or prescription items were found in the parsed document. Please upload a clearer document or check your scanner settings."
      });
    }

    // Prepare headers exactly mimicking the curl request provided by the user to avoid blocks
    const headers = {
      "Content-Type": "application/json",
      "User-Agent": "Mozilla/5.0 (Linux; Android 12; LAVA Blaze Build/SP1A.210812.016; wv) AppleWebKit/537.36 (KHTML, http://g.co/clean) Version/4.0 Chrome/150.0.7871.46 Mobile Safari/537.36",
      "origin": "https://drkhan.ai",
      "sec-ch-ua-platform": '"Android"',
      "sec-ch-ua": '"Not;A=Brand";v="8", "Chromium";v="150", "Android WebView";v="150"',
      "sec-ch-ua-mobile": "?1",
      "x-requested-with": "mark.via.gp",
      "sec-fetch-site": "same-origin",
      "sec-fetch-mode": "cors",
      "sec-fetch-dest": "empty",
      "accept-language": "en-IN,en-US;q=0.9,en;q=0.8",
      "priority": "u=1, i"
    };

    // Sanitize biomarkers to ensure drkhan.ai receives number types
    const sanitizedBiomarkers = biomarkers.map((b: any) => ({
      ...b,
      value: parseToNumberOrNull(b.value),
      reference_low: parseToNumberOrNull(b.reference_low),
      reference_high: parseToNumberOrNull(b.reference_high)
    }));

    const sanitizedReport = {
      ...report,
      biomarkers: sanitizedBiomarkers
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15-second timeout

    try {
      console.log("[DrKhan API] Attempting to call https://drkhan.ai/api/analyze-lab with sanitized report...");
      const externalResponse = await fetch("https://drkhan.ai/api/analyze-lab", {
        method: "POST",
        headers,
        body: JSON.stringify({ report: sanitizedReport, stream: false, language: language || "English" }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (externalResponse.ok) {
        const data = await externalResponse.json();
        console.log("[DrKhan API] Successfully fetched from drkhan.ai analyze-lab API.");
        return res.json(data);
      } else {
        const errText = await externalResponse.text();
        console.error(`[DrKhan API Error] analyze-lab status ${externalResponse.status}: ${errText}`);
        return res.status(externalResponse.status).json({
          success: false,
          error: `Dr. Khan AI was unable to generate the explanation. [Details: ${errText}]`
        });
      }
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      console.error(`[DrKhan API Connection Error] Connection note on analyze-lab:`, fetchError);
      return res.status(502).json({
        success: false,
        error: `Failed to connect to Dr. Khan AI analysis server. [Error: ${fetchError.message}]`
      });
    }
  } catch (error: any) {
    console.error("Error in /api/analyze-lab:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "An error occurred during report analysis.",
    });
  }
});

// 3. Interactive Follow-up Chat with Clinical AI Sidekick
app.post("/api/chat-followup", async (req, res) => {
  try {
    const { messages, report, language } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ success: false, error: "Missing or invalid messages array" });
    }
    if (!report) {
      return res.status(400).json({ success: false, error: "Missing report context for chat" });
    }

    const targetLanguage = language || "English";
    const chatHistoryText = messages
      .map((msg: any) => `${msg.role === "user" ? "Patient" : "Assistant"}: ${msg.content}`)
      .join("\n\n");

    const chatPrompt = `You are an expert, empathetic medical AI health coach and clinical literacy sidekick. 
The patient has uploaded a medical document with the following extracted parameters:
Document Type: ${report.report_type || "Medical Report"}
Date: ${report.report_date || "Unknown Date"}
Provider/Lab: ${report.lab_name || "Unknown Provider"}
Parsed Biomarkers/Active Ingredients:
${JSON.stringify(report.biomarkers, null, 2)}

Provide clear, supportive, and educational answers in "${targetLanguage}". Keep explanations simple, reassuring, and completely jargon-free.
If they ask about lifestyle or diet changes, provide highly actionable yet safe suggestions (e.g., fiber, hydration, moderate walking) but do not recommend starting or stopping medications.

Dialogue History:
${chatHistoryText}

Assistant:`;

    const { response, model } = await generateContentWithRetryAndFallback({
      model: "gemini-3.5-flash",
      contents: chatPrompt,
      config: {
        systemInstruction: `You are a world-class health literacy companion. Explain all findings in patient-friendly language. Always maintain complete medical safety boundaries. Output answers using beautiful Markdown with elegant spacing and headers. Always include a brief disclaimer at the end stating that this is educational only.`,
      },
    });

    const replyText = response.text || "I was unable to process an answer. Please ask another way.";

    return res.json({
      success: true,
      reply: replyText,
      metadata: {
        model,
      },
    });
  } catch (error: any) {
    console.error("Error in /api/chat-followup:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "An error occurred during conversational chat follow-up.",
    });
  }
});

// Serve frontend build static files & mount Vite middleware
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[MedExplaiN Server] Running on http://localhost:${PORT}`);
  });
}

setupServer();
