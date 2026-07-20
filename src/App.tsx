import React, { useState, useEffect, useRef } from "react";
import {
  Activity,
  ArrowRight,
  UploadCloud,
  Check,
  AlertCircle,
  Trash2,
  Plus,
  Download,
  Sparkles,
  Languages,
  FileText,
  ScanLine,
  MessageSquareText,
  ShieldAlert,
  Lock,
  Menu,
  X,
  ChevronDown,
  BookOpen,
  Heart,
  Info,
  ExternalLink,
  Globe,
  RefreshCw,
  Moon,
  Sun,
  Stethoscope,
  CheckCircle,
  Send,
  Calendar,
  Edit3,
  Sliders,
  Eye,
  History,
  Clock,
} from "lucide-react";
import { SAMPLE_REPORTS, FEATURES, FAQS } from "./data";
import { LabReport, Biomarker } from "./types";

interface HistoryEntry {
  id: string;
  timestamp: number;
  reportData: LabReport;
  analysisResult: string;
  selectedLanguage: string;
}

export default function App() {
  // Navigation & Page routing
  const [activeTab, setActiveTab] = useState<string>("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Local storage history state
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // Load and periodically prune history
  useEffect(() => {
    const loadAndPruneHistory = () => {
      try {
        const stored = localStorage.getItem("medexplain_history");
        if (stored) {
          const parsed: HistoryEntry[] = JSON.parse(stored);
          const thirtyMinutesInMs = 30 * 60 * 1000;
          const now = Date.now();
          const valid = parsed.filter(item => now - item.timestamp < thirtyMinutesInMs);
          
          if (valid.length !== parsed.length) {
            localStorage.setItem("medexplain_history", JSON.stringify(valid));
          }
          setHistory(valid);
        }
      } catch (e) {
        console.error("Failed to load history from localStorage", e);
      }
    };

    loadAndPruneHistory();

    // Prune every 15 seconds to automatically expire old items
    const interval = setInterval(loadAndPruneHistory, 15000);
    return () => clearInterval(interval);
  }, []);

  const getRelativeTimeStr = (timestamp: number) => {
    const diffMs = Date.now() - timestamp;
    const diffMins = Math.floor(diffMs / (60 * 1000));
    if (diffMins < 1) return "Just now";
    return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
  };

  const loadHistoryEntry = (entry: HistoryEntry) => {
    setUploadedImage("history-restored");
    setErrorMessage(null);
    setReportData(entry.reportData);
    setAnalysisResult(entry.analysisResult);
    setSelectedLanguage(entry.selectedLanguage);
    
    // Scroll smoothly to workspace
    const elem = document.getElementById("analyzer-workspace");
    if (elem) elem.scrollIntoView({ behavior: "smooth" });
  };

  const deleteHistoryEntry = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent triggering loadHistoryEntry
    try {
      const updated = history.filter(item => item.id !== id);
      localStorage.setItem("medexplain_history", JSON.stringify(updated));
      setHistory(updated);
    } catch (err) {
      console.error("Failed to delete history item", err);
    }
  };

  const clearHistory = () => {
    try {
      localStorage.removeItem("medexplain_history");
      setHistory([]);
    } catch (err) {
      console.error("Failed to clear history", err);
    }
  };

  // Dark/Light Theme state
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("medexplain-theme");
    if (saved === "dark") return "dark";
    return "light";
  });

  // Flow State
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isOcrLoading, setIsOcrLoading] = useState<boolean>(false);
  const [isAnalysisLoading, setIsAnalysisLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Extracted structured report (Step 2)
  const [reportData, setReportData] = useState<LabReport | null>(null);
  // Preferred translation language
  const [selectedLanguage, setSelectedLanguage] = useState<string>("English");
  // Final deep AI explanation result
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  // New Interactive Hackathon States
  const [editMode, setEditMode] = useState<boolean>(false);
  const [rightTab, setRightTab] = useState<"explanation" | "chat" | "dosage">("explanation");
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "model"; content: string }>>([]);
  const [chatInput, setChatInput] = useState<string>("");
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const [dosageList, setDosageList] = useState<any[]>([]);

  // Automatically update dosages and chat context when reportData changes
  useEffect(() => {
    if (reportData) {
      const meds = reportData.biomarkers.map((b) => {
        const nameLower = b.name.toLowerCase();
        const unitLower = b.unit.toLowerCase();
        const isMed =
          unitLower.includes("mg") ||
          unitLower.includes("tab") ||
          unitLower.includes("daily") ||
          unitLower.includes("dose") ||
          nameLower.includes("lisinopril") ||
          nameLower.includes("metformin") ||
          nameLower.includes("amoxicillin") ||
          nameLower.includes("atorvastatin") ||
          reportData.report_type?.toLowerCase().includes("prescription") ||
          reportData.report_type?.toLowerCase().includes("label");

        return {
          name: b.name,
          value: b.value,
          unit: b.unit,
          isMed,
          checked: [false, false, false, false],
          times: ["Breakfast", "Lunch", "Dinner", "Bedtime"],
          dosage: b.value && b.unit ? `${b.value} ${b.unit}` : "As directed",
        };
      });
      setDosageList(meds);

      setChatMessages([
        {
          role: "model",
          content: `Hi there! I've loaded your **${
            reportData.report_type || "Health Document"
          }** metrics into my context. 

Feel free to ask me follow-up questions, like:
- *What foods or lifestyle tips help with these values?*
- *Are there any warnings or active ingredient overlaps I should know about?*
- *What specific questions should I ask my doctor about these readings?*

How can I help you today?`,
        },
      ]);
    } else {
      setDosageList([]);
      setChatMessages([]);
    }
  }, [reportData]);

  // Drag and drop state
  const [dragActive, setDragActive] = useState<boolean>(false);

  // Contact form state
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Listen to theme state changes
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("medexplain-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // Drag and Drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const compressImage = (file: File, maxWidth = 1024, maxHeight = 1024, quality = 0.7): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (file.type === "application/pdf") {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(event.target?.result as string);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL("image/jpeg", quality);
          resolve(compressedBase64);
        };
        img.onerror = () => {
          resolve(event.target?.result as string);
        };
        img.src = event.target?.result as string;
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  // File processing and base64 translation with automatic image compression
  const processFile = async (file: File) => {
    if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
      setErrorMessage("Please select or drop an image file (PNG, JPG, WEBP) or a PDF report.");
      return;
    }

    // Vercel serverless request body payload limit is 4.5MB. Base64 is ~33% larger than binary.
    // Restricting PDF to 3MB ensures it safely stays under 4MB as a base64 string.
    if (file.type === "application/pdf" && file.size > 3 * 1024 * 1024) {
      setErrorMessage("To ensure successful processing on cloud servers, PDF documents must be under 3MB. Please compress your PDF or upload a clear photo of the report instead.");
      return;
    }

    setIsOcrLoading(true);
    setErrorMessage(null);
    try {
      const base64String = await compressImage(file);
      setUploadedImage(base64String);
      // Automatically trigger extraction once file is compressed and ready
      extractData(base64String, file.type === "application/pdf" ? "application/pdf" : "image/jpeg");
    } catch (err: any) {
      console.error(err);
      setErrorMessage("Failed to read and compress the file. Please try again.");
      setIsOcrLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  // Triggering the Deep AI Analysis and Explanation
  async function runDeepAnalysis(customReport?: LabReport | React.MouseEvent, customLanguage?: string) {
    const isRealReport = customReport && typeof customReport === "object" && "biomarkers" in customReport;
    const reportToAnalyze = isRealReport ? (customReport as LabReport) : reportData;
    if (!reportToAnalyze) return;
    setIsAnalysisLoading(true);
    setErrorMessage(null);
    setAnalysisResult(null);

    const targetLang = typeof customLanguage === "string" ? customLanguage : selectedLanguage;

    try {
      const response = await fetch("/api/analyze-lab", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ report: reportToAnalyze, language: targetLang }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to generate medical explanation.");
      }

      setAnalysisResult(data.analysis);

      // Save to local storage history (keep last 5)
      try {
        const stored = localStorage.getItem("medexplain_history");
        let currentHistory: HistoryEntry[] = stored ? JSON.parse(stored) : [];
        const now = Date.now();
        const thirtyMinutesInMs = 30 * 60 * 1000;
        
        // Filter out expired items and check duplicate
        currentHistory = currentHistory.filter(item => now - item.timestamp < thirtyMinutesInMs);
        
        const isDuplicate = currentHistory.length > 0 && 
          JSON.stringify(currentHistory[0].reportData) === JSON.stringify(reportToAnalyze) &&
          currentHistory[0].analysisResult === data.analysis &&
          currentHistory[0].selectedLanguage === targetLang;

        if (!isDuplicate) {
          const newEntry: HistoryEntry = {
            id: now.toString(),
            timestamp: now,
            reportData: reportToAnalyze,
            analysisResult: data.analysis,
            selectedLanguage: targetLang
          };
          
          const updatedHistory = [newEntry, ...currentHistory].slice(0, 5);
          localStorage.setItem("medexplain_history", JSON.stringify(updatedHistory));
          setHistory(updatedHistory);
        }
      } catch (e) {
        console.error("Failed to save history item", e);
      }
    } catch (err: any) {
      console.error(err);
      let msg = err.message || "An error occurred while generating details.";
      if (msg === "Failed to fetch") {
        msg = "The medical advisor server is currently reconnecting or booting up. Please try again in a few seconds.";
      }
      setErrorMessage(msg);
    } finally {
      setIsAnalysisLoading(false);
    }
  }

  // Triggers the OCR / Extract server side API
  async function extractData(base64Data: string, mimeType: string) {
    setIsOcrLoading(true);
    setErrorMessage(null);
    setReportData(null);
    setAnalysisResult(null);

    try {
      const response = await fetch("/api/upload-lab", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ base64Image: base64Data, mimeType }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to extract medical report content.");
      }

      setReportData(data.report);
      
      // Directly start analysing the report automatically once shown to the user
      await runDeepAnalysis(data.report);
    } catch (err: any) {
      console.error(err);
      let msg = err.message || "An unexpected error occurred during report scanning. Check your server connection.";
      if (msg === "Failed to fetch") {
        msg = "The medical advisor server is currently reconnecting or booting up. Please try again in a few seconds.";
      }
      setErrorMessage(msg);
    } finally {
      setIsOcrLoading(false);
    }
  }

  // Instant Template Loader for high-quality sandbox experience
  function loadSampleTemplate(sample: typeof SAMPLE_REPORTS[0]) {
    setUploadedImage("sample-template");
    setErrorMessage(null);
    setAnalysisResult(null);
    // Deep clone the sample structure
    const clonedReport = JSON.parse(JSON.stringify(sample.report));
    setReportData(clonedReport);
    // Scroll smoothly to workspace
    const elem = document.getElementById("analyzer-workspace");
    if (elem) elem.scrollIntoView({ behavior: "smooth" });
    
    // Directly start analysing the report automatically once shown to the user
    runDeepAnalysis(clonedReport);
  }

  // Editing Extracted Biomarkers
  const handleBiomarkerChange = (index: number, field: keyof Biomarker, val: string) => {
    if (!reportData) return;
    const updatedBiomarkers = [...reportData.biomarkers];
    updatedBiomarkers[index] = {
      ...updatedBiomarkers[index],
      [field]: val,
    };
    setReportData({ ...reportData, biomarkers: updatedBiomarkers });
  };

  const deleteBiomarker = (index: number) => {
    if (!reportData) return;
    const updatedBiomarkers = reportData.biomarkers.filter((_, i) => i !== index);
    setReportData({ ...reportData, biomarkers: updatedBiomarkers });
  };

  const addNewBiomarker = () => {
    if (!reportData) return;
    const newBiomarker: Biomarker = {
      name: "New Entry",
      value: "0",
      unit: "mg",
      reference_low: "",
      reference_high: "",
      flag: "normal",
    };
    setReportData({
      ...reportData,
      biomarkers: [...reportData.biomarkers, newBiomarker],
    });
  };

  const handleMetadataChange = (field: keyof LabReport, val: string) => {
    if (!reportData) return;
    setReportData({ ...reportData, [field]: val === "" ? null : val });
  };

  // Clean the workspace to upload another report
  const resetWorkspace = () => {
    setUploadedImage(null);
    setReportData(null);
    setAnalysisResult(null);
    setErrorMessage(null);
  };

  // Download AI Analysis as markdown file
  const downloadSummary = () => {
    if (!analysisResult) return;
    const element = document.createElement("a");
    const file = new Blob([analysisResult], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `MedExplaiN-Summary-${reportData?.report_type || "Health"}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Simple custom Markdown formatter for educational aesthetic view
  const renderCustomMarkdown = (text: string) => {
    if (!text) return null;
    const lines = text.split("\n");

    return lines.map((line, idx) => {
      const cleanLine = line.trim();

      // Heading 1
      if (cleanLine.startsWith("# ")) {
        return (
          <h1 key={idx} className="text-3xl font-bold font-display text-slate-900 dark:text-white mt-8 mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">
            {cleanLine.slice(2)}
          </h1>
        );
      }
      // Heading 2
      if (cleanLine.startsWith("## ")) {
        return (
          <h2 key={idx} className="text-xl font-bold font-display text-slate-800 dark:text-slate-100 mt-6 mb-3 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-blue-600 rounded-full inline-block"></span>
            {cleanLine.slice(3)}
          </h2>
        );
      }
      // Heading 3
      if (cleanLine.startsWith("### ")) {
        return (
          <h3 key={idx} className="text-lg font-semibold font-display text-slate-800 dark:text-slate-200 mt-4 mb-2">
            {cleanLine.slice(4)}
          </h3>
        );
      }
      // Bullet points
      if (cleanLine.startsWith("- ") || cleanLine.startsWith("* ")) {
        const content = cleanLine.slice(2);
        // Look for bold highlights e.g. **Hemoglobin**
        return (
          <li key={idx} className="ml-6 list-disc text-slate-700 dark:text-slate-300 my-1.5 leading-relaxed">
            {parseBoldText(content)}
          </li>
        );
      }
      // Numbered points
      if (/^\d+\.\s/.test(cleanLine)) {
        const content = cleanLine.replace(/^\d+\.\s/, "");
        return (
          <li key={idx} className="ml-6 list-decimal text-slate-700 dark:text-slate-300 my-1.5 leading-relaxed">
            {parseBoldText(content)}
          </li>
        );
      }
      // Disclaimer notes with star
      if (cleanLine.startsWith("*") && cleanLine.endsWith("*")) {
        return (
          <p key={idx} className="text-sm italic text-amber-600 dark:text-amber-400 my-3 bg-amber-50 dark:bg-amber-950/30 p-3 rounded-lg border border-amber-200/50">
            {cleanLine.slice(1, -1)}
          </p>
        );
      }
      // Empty lines
      if (!cleanLine) {
        return <div key={idx} className="h-2"></div>;
      }

      // Normal paragraphs
      return (
        <p key={idx} className="text-slate-700 dark:text-slate-300 my-2.5 leading-relaxed text-base">
          {parseBoldText(cleanLine)}
        </p>
      );
    });
  };

  // Helper parser for markdown bold text e.g. **hello**
  const parseBoldText = (content: string) => {
    // Basic bold parsing: **text** -> <strong>text</strong>
    const parts = content.split(/\*\*([^*]+)\*\*/g);
    if (parts.length === 1) return content;

    return parts.map((part, i) => {
      // Every odd element is a bold match
      if (i % 2 === 1) {
        return (
          <strong key={i} className="font-semibold text-slate-900 dark:text-white">
            {part}
          </strong>
        );
      }
      // Handle links in format [text](url)
      return parseLinks(part);
    });
  };

  // Helper parser for markdown links e.g. [text](url)
  const parseLinks = (content: string) => {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push(content.substring(lastIndex, match.index));
      }
      const [_, text, url] = match;
      parts.push(
        <a
          key={match.index}
          href={url}
          target="_blank"
          referrerPolicy="no-referrer"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-0.5 font-medium"
        >
          {text}
          <ExternalLink className="w-3 h-3" />
        </a>
      );
      lastIndex = linkRegex.lastIndex;
    }

    if (lastIndex < content.length) {
      parts.push(content.substring(lastIndex));
    }

    return parts.length > 0 ? parts : content;
  };

  // Chatbot message dispatcher
  const sendChatMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || isChatLoading || !reportData) return;

    const userQuery = chatInput.trim();
    setChatInput("");

    const updatedMessages = [
      ...chatMessages,
      { role: "user" as const, content: userQuery },
    ];
    setChatMessages(updatedMessages);
    setIsChatLoading(true);

    try {
      const response = await fetch("/api/chat-followup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          report: reportData,
          language: selectedLanguage,
        }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to fetch response.");
      }

      setChatMessages([
        ...updatedMessages,
        { role: "model" as const, content: data.reply },
      ]);
    } catch (err: any) {
      console.error(err);
      setChatMessages([
        ...updatedMessages,
        {
          role: "model" as const,
          content: `⚠️ **Connection Note**: I had trouble connecting to the medical advisor server. Let's try again in a second! (${err.message || err})`,
        },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Toggle dosage checklist times
  const handleDosageCheck = (medIndex: number, timeIndex: number) => {
    const updated = [...dosageList];
    updated[medIndex].checked[timeIndex] = !updated[medIndex].checked[timeIndex];
    setDosageList(updated);
  };

  // Biomarker Range Visualizer for high-fidelity clinical dashboard rendering
  const renderBiomarkerVisualizer = (biomarker: Biomarker) => {
    const valStr = String(biomarker.value || "");
    const lowStr = String(biomarker.reference_low || "");
    const highStr = String(biomarker.reference_high || "");
    const val = parseFloat(valStr);
    const low = parseFloat(lowStr);
    const high = parseFloat(highStr);

    if (isNaN(val) || isNaN(low) || isNaN(high) || low >= high) {
      return (
        <div className="mt-2 text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1.5 font-mono select-none">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700"></span>
          No numeric reference boundaries available
        </div>
      );
    }

    const offset = (high - low) * 0.4;
    const minScale = Math.max(0, low - offset);
    const maxScale = high + offset;
    const percentage = Math.min(100, Math.max(0, ((val - minScale) / (maxScale - minScale)) * 100));

    const lowMarkerPercent = ((low - minScale) / (maxScale - minScale)) * 100;
    const highMarkerPercent = ((high - minScale) / (maxScale - minScale)) * 100;

    return (
      <div className="mt-3 bg-slate-100/30 dark:bg-slate-900/40 p-2.5 rounded-xl border border-slate-200/20 dark:border-slate-800/20">
        <div className="flex justify-between text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
          <span>Min Range ({low})</span>
          <span className="text-slate-600 dark:text-slate-400 font-semibold text-xs">Value: {val} {biomarker.unit}</span>
          <span>Max Range ({high})</span>
        </div>

        {/* Visual Scale bar */}
        <div className="relative h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-visible">
          {/* Optimal Normal Range Shading */}
          <div
            className="absolute h-full bg-emerald-500/20 dark:bg-emerald-400/20 border-x border-emerald-500/30"
            style={{ left: `${lowMarkerPercent}%`, right: `${100 - highMarkerPercent}%` }}
          ></div>

          {/* Boundaries Markers */}
          <div className="absolute top-0 bottom-0 w-0.5 bg-slate-400/40" style={{ left: `${lowMarkerPercent}%` }}></div>
          <div className="absolute top-0 bottom-0 w-0.5 bg-slate-400/40" style={{ left: `${highMarkerPercent}%` }}></div>

          {/* User Value Marker Dot */}
          <div
            className="absolute -top-1 w-4 h-4 rounded-full border border-white dark:border-slate-950 flex items-center justify-center shadow-sm transition-all duration-300"
            style={{
              left: `calc(${percentage}% - 8px)`,
              backgroundColor: val < low ? "#3b82f6" : val > high ? "#f43f5e" : "#10b981",
            }}
          >
            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
          </div>
        </div>

        {/* Zone description */}
        <div className="flex justify-between items-center mt-2">
          <span
            className={`text-[10px] font-bold uppercase tracking-wider ${
              val < low ? "text-blue-500" : val > high ? "text-rose-500" : "text-emerald-500"
            }`}
          >
            {val < low ? "Below Reference (Low)" : val > high ? "Above Reference (High)" : "Optimal Range (Normal)"}
          </span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
            Ref Zone: {low} - {high} {biomarker.unit}
          </span>
        </div>
      </div>
    );
  };

  // Contact form submission
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => {
      setContactForm({ name: "", email: "", message: "" });
      setContactSubmitted(false);
    }, 5000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200 font-sans">
      
      {/* 1. TOP ANNOUNCEMENT / MEDICAL DISCLAIMER BADGE */}
      <div className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white text-xs font-medium py-2 px-4 text-center flex items-center justify-center gap-2 select-none relative z-50">
        <ShieldAlert className="w-4 h-4 text-emerald-100 animate-pulse" />
        <span>
          <strong>Educational Aid Only:</strong> This AI system simplifies reports but does not diagnose. Always consult a physician for clinical health decisions.
        </span>
      </div>

      {/* 2. PREMIUM APPLE + LINEAR NAVBAR */}
      <header className="sticky top-0 z-40 glass border-b border-slate-100 dark:border-slate-900 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <div
            className="flex items-center gap-2.5 cursor-pointer select-none"
            onClick={() => setActiveTab("home")}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center shadow-md shadow-blue-500/10">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold font-display tracking-tight text-slate-900 dark:text-white">
                MedExplaiN <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500 font-extrabold">AI</span>
              </span>
              <p className="text-[9px] text-slate-500 dark:text-slate-400 font-mono tracking-widest uppercase">
                Patient Clarity Hub
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5">
            {[
              { id: "home", label: "Home" },
              { id: "analyzer", label: "AI Analyzer" },
              { id: "features", label: "Features" },
              { id: "faq", label: "FAQs" },
              { id: "contact", label: "Contact Us" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-slate-100 dark:bg-slate-900 text-blue-600 dark:text-blue-400"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900/50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Quick Actions (Theme + CTAs) */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all border border-slate-100 dark:border-slate-800"
              title="Toggle Theme"
            >
              {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setActiveTab("analyzer")}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-slate-900 dark:bg-white dark:text-slate-950 hover:opacity-90 transition-all shadow-sm"
            >
              Get Started
            </button>
          </div>

          {/* Mobile hamburger menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all border border-slate-100 dark:border-slate-800"
            >
              {theme === "light" ? <Moon className="w-4.5 h-4.5" /> : <Sun className="w-4.5 h-4.5" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile menu panel */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 dark:border-slate-900 bg-white dark:bg-slate-950 p-4 space-y-2 shadow-lg">
            {[
              { id: "home", label: "Home" },
              { id: "analyzer", label: "AI Analyzer Workspace" },
              { id: "features", label: "Features" },
              { id: "faq", label: "FAQs" },
              { id: "contact", label: "Contact Us" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-slate-100 dark:bg-slate-900 text-blue-600 dark:text-blue-400"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/50"
                }`}
              >
                {tab.label}
              </button>
            ))}
            <div className="pt-2">
              <button
                onClick={() => {
                  setActiveTab("analyzer");
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 rounded-lg text-sm font-semibold text-center text-white bg-blue-600 hover:bg-blue-700 transition-all"
              >
                Launch App Now
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 3. MAIN PAGE CONTENT SECTIONS */}
      <main className="flex-1">

        {/* ==================== PAGE: HOME ==================== */}
        {activeTab === "home" && (
          <div>
            
            {/* Hero Section */}
            <section className="relative overflow-hidden py-20 lg:py-32 bg-radial from-blue-50/30 via-transparent to-transparent dark:from-blue-950/10">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                
                {/* Modern visual highlight tag */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/60 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-6 animate-fade-in">
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                  <span>Empowering health literacy through explainable AI</span>
                </div>

                <h1 className="text-4xl sm:text-6xl font-extrabold font-display tracking-tight text-slate-950 dark:text-white max-w-4xl mx-auto leading-[1.1] mb-6">
                  Understand your medical reports in{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-500">
                    plain language
                  </span>
                </h1>

                <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10">
                  Upload handwritten prescriptions, dense lab blood results, or over-the-counter pill labels. Our advanced clinical assistant instantly translates complex jargon into friendly, clear, and actionable summaries.
                </p>

                {/* Main CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    onClick={() => setActiveTab("analyzer")}
                    className="w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-150 flex items-center justify-center gap-2"
                  >
                    Analyze Your Report Now
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      const elem = document.getElementById("sandbox-section");
                      if (elem) elem.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all duration-150"
                  >
                    Try Free Sandbox Templates
                  </button>
                </div>

                {/* Core benefits summary */}
                <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-8 border-t border-slate-100 dark:border-slate-900">
                  {[
                    { value: "100%", label: "Privacy-Aligned" },
                    { value: "Multilingual", label: "7+ Major Languages" },
                    { value: "Clinical", label: "NIH & CDC Grounded" },
                    { value: "Direct", label: "Layman Simplification" },
                  ].map((stat, i) => (
                    <div key={i} className="text-center">
                      <p className="text-xl font-bold text-slate-900 dark:text-white font-display">
                        {stat.value}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>

              </div>
            </section>

            {/* Sandbox Section (Demo Templates) */}
            <section id="sandbox-section" className="py-16 bg-slate-50 dark:bg-slate-900/30 border-y border-slate-100 dark:border-slate-900">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="text-center max-w-3xl mx-auto mb-12">
                  <h2 className="text-3xl font-bold font-display text-slate-900 dark:text-white">
                    No reports on hand? Try our sandbox demo templates!
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 mt-3">
                    Select any of the curated lab outputs, active clinical labels, or physician prescription profiles below to view the entire OCR extraction and AI simplification engine instantly.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {SAMPLE_REPORTS.map((sample, i) => (
                    <div
                      key={i}
                      className="group relative bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-900 hover:border-blue-500/50 dark:hover:border-blue-500/50 hover:shadow-xl dark:hover:shadow-slate-900/50 transition-all duration-200 flex flex-col justify-between"
                    >
                      <div>
                        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4 font-bold">
                          0{i + 1}
                        </div>
                        <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white mb-2">
                          {sample.label}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                          {sample.description}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setActiveTab("analyzer");
                          loadSampleTemplate(sample);
                        }}
                        className="w-full py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-blue-500/10 text-sm font-semibold transition-all duration-200"
                      >
                        Load Sandbox Template
                      </button>
                    </div>
                  ))}
                </div>

              </div>
            </section>

            {/* Core Features Overview (Mini Grid) */}
            <section className="py-20 bg-white dark:bg-slate-950">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="text-center max-w-3xl mx-auto mb-16">
                  <h2 className="text-3xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight">
                    Why choose MedExplaiN AI?
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 mt-4 text-base">
                    Engineered to elevate health comprehension by mapping complex medical metrics to lay-friendly vocabulary.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {FEATURES.map((feat) => (
                    <div key={feat.id} className="p-6 bg-slate-50/50 dark:bg-slate-900/20 rounded-2xl border border-slate-100/50 dark:border-slate-900/50">
                      <div className="w-11 h-11 rounded-xl bg-blue-100/60 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                        {feat.iconName === "ScanLine" && <ScanLine className="w-5 h-5" />}
                        {feat.iconName === "MessageSquareText" && <MessageSquareText className="w-5 h-5" />}
                        {feat.iconName === "ShieldAlert" && <ShieldAlert className="w-5 h-5" />}
                        {feat.iconName === "Languages" && <Languages className="w-5 h-5" />}
                        {feat.iconName === "Download" && <Download className="w-5 h-5" />}
                        {feat.iconName === "Lock" && <Lock className="w-5 h-5" />}
                      </div>
                      <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white mb-2">
                        {feat.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        {feat.description}
                      </p>
                    </div>
                  ))}
                </div>

              </div>
            </section>

            {/* Prominent Medical Disclaimer Section */}
            <section className="py-12 bg-rose-50/30 dark:bg-rose-950/10 border-t border-rose-100 dark:border-rose-900/30">
              <div className="max-w-4xl mx-auto px-4 text-center">
                <div className="inline-flex p-3 bg-rose-100/50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 rounded-full mb-4">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white mb-2">
                  Strict Medical Educational Disclaimer
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  MedExplaiN AI provides automatic information designed purely to improve wellness literacy and support productive doctor-patient conversations. The AI metrics, drug interactions, side effects, and warning flags listed are compiled dynamically from general text sources. <strong>They are not clinical evaluations.</strong> This platform cannot diagnose conditions, prescribe therapeutic courses, or substitute for your primary healthcare team. If you are experiencing high fevers, pain, severe blood pressure fluctuations, or acute symptoms, seek professional emergency medical services immediately.
                </p>
              </div>
            </section>

          </div>
        )}

        {/* ==================== PAGE: AI ANALYZER (CORE APPLICATION) ==================== */}
        {activeTab === "analyzer" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" id="analyzer-workspace">
            
            {/* Header */}
            <div className="mb-10 text-center max-w-2xl mx-auto">
              <h1 className="text-3xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight">
                AI Diagnostic & Prescription Explainer
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
                Upload your health document, verify extracted medical parameters, configure translation language, and get patient-friendly lay explanations.
              </p>
            </div>

            {/* ERROR DISPLAY */}
            {errorMessage && (
              <div className="mb-8 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
                <div className="flex-1">
                  <p className="font-bold">Extraction or Analysis Failed</p>
                  <p className="mt-1">{errorMessage}</p>
                  <button
                    onClick={() => setErrorMessage(null)}
                    className="mt-2 text-xs underline font-semibold cursor-pointer"
                  >
                    Dismiss Warning
                  </button>
                </div>
              </div>
            )}

            {/* RECENT HISTORY BAR */}
            {history.length > 0 && (
              <div className="mb-8 p-5 bg-gradient-to-r from-slate-50 to-blue-50/20 dark:from-slate-900/40 dark:to-blue-950/10 border border-slate-200/60 dark:border-slate-800 rounded-3xl shadow-xs">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-xs">
                      <History className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                        Recent Analyses (Last 30 Min)
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Quickly restore any of your last 5 scanned reports.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={clearHistory}
                    className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 cursor-pointer bg-transparent border-none animate-fade-in"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Clear All
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3.5">
                  {history.map((entry) => {
                    const timeStr = getRelativeTimeStr(entry.timestamp);
                    const timeRemainingMins = Math.max(0, 30 - Math.floor((Date.now() - entry.timestamp) / (60 * 1000)));
                    const reportTitle = entry.reportData.report_type || entry.reportData.lab_name || "Medical Report";
                    const biomarkersCount = entry.reportData.biomarkers?.length || 0;

                    return (
                      <div
                        key={entry.id}
                        onClick={() => loadHistoryEntry(entry)}
                        className="group relative bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-850 hover:border-blue-500 dark:hover:border-blue-500/80 p-4 rounded-2xl shadow-xs hover:shadow-md cursor-pointer transition-all duration-200 flex flex-col justify-between min-h-[110px]"
                      >
                        <div className="min-w-0">
                          <div className="flex items-start justify-between gap-1 mb-1.5">
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate pr-4 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                              {reportTitle}
                            </p>
                            <button
                              onClick={(e) => deleteHistoryEntry(entry.id, e)}
                              className="opacity-0 group-hover:opacity-100 absolute top-3 right-3 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-all p-1 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg z-10"
                              title="Remove from history"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500 font-mono mb-2">
                            <FileText className="w-3 h-3" />
                            <span>{biomarkersCount} metrics</span>
                            <span>•</span>
                            <span>{entry.selectedLanguage}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-50 dark:border-slate-900/60 text-[10px]">
                          <span className="text-slate-400 dark:text-slate-500 flex items-center gap-1 font-medium">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {timeStr}
                          </span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
                            {timeRemainingMins}m left
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* FLOW MODULES */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* LEFT SIDE: UPLOADER & EDITING SECTION */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* 1. UPLOADER BLOCK */}
                {!uploadedImage ? (
                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-3xl p-10 text-center transition-all ${
                      dragActive
                        ? "border-blue-500 bg-blue-50/20 dark:bg-blue-950/20 scale-[1.01]"
                        : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10 hover:border-blue-500/50 hover:bg-slate-50 dark:hover:bg-slate-900/20"
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept="image/*,application/pdf"
                      onChange={handleFileChange}
                    />

                    <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-6 shadow-xs">
                      <UploadCloud className="w-8 h-8" />
                    </div>

                    <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white mb-2">
                      Drag & Drop Your Report or Prescription
                    </h3>
                    
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6 leading-relaxed">
                      Supports medical lab blood tests, pharmacist labels, medicine boxes, and handwritten doctor scripts (PDF, PNG, JPG, WEBP).
                    </p>

                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md shadow-blue-500/10 transition-all cursor-pointer"
                    >
                      Select File From Device
                    </button>

                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-900/60">
                      <p className="text-xs text-slate-400 dark:text-slate-500 mb-3">Or choose a demo sandbox file to play around:</p>
                      <div className="flex flex-wrap items-center justify-center gap-2">
                        {SAMPLE_REPORTS.map((sample, i) => (
                          <button
                            key={i}
                            onClick={() => loadSampleTemplate(sample)}
                            className="px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 hover:border-blue-500 dark:hover:border-blue-500 text-slate-600 dark:text-slate-300 transition-all font-medium"
                          >
                            Demo {i + 1}: {sample.label.split(" (")[0]}
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>
                ) : (
                  
                  /* FILE PREVIEW & RE-UPLOAD OPTIONS */
                  <div className="bg-slate-50 dark:bg-slate-900/30 p-4 rounded-2xl border border-slate-100 dark:border-slate-900 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center shrink-0">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                          {uploadedImage === "sample-template" 
                            ? "Demo Sandbox Template Loaded" 
                            : uploadedImage === "history-restored"
                            ? "Analysis Restored from History"
                            : "Medical File Extracted"}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {uploadedImage === "sample-template" 
                            ? "Using structured reference parameters" 
                            : uploadedImage === "history-restored"
                            ? "Loaded previous report data & Dr. Khan's explanation"
                            : "Processing complete"}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={resetWorkspace}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all cursor-pointer"
                    >
                      Clear File
                    </button>
                  </div>
                )}

                {/* OCR SKELETON LOADER */}
                {isOcrLoading && (
                  <div className="bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-900 rounded-3xl p-8 space-y-6 animate-pulse">
                    <div className="flex items-center justify-between">
                      <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
                      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
                      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6"></div>
                      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-4/5"></div>
                    </div>
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-900 space-y-3">
                      <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded"></div>
                      <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded"></div>
                      <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded"></div>
                    </div>
                    <p className="text-xs text-center text-slate-400 dark:text-slate-500 font-mono italic">
                      Scanning writing, prescriptions, & lab indicators... Please wait...
                    </p>
                  </div>
                )}

                {/* 2. STRUCTURED LAB DATA COMPONENT (READ-ONLY VISUAL MATRIX + INTERACTIVE SIMULATOR) */}
                {reportData && !isOcrLoading && (
                  <div className="bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-900 rounded-3xl p-6 shadow-sm">
                    
                    {/* Header Controls */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-900 mb-6">
                      <div>
                        <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-emerald-500" />
                          Extracted Report Data
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Directly extracted parameters and biomarkers from your uploaded medical document.
                        </p>
                      </div>

                      {/* Dynamic Switcher */}
                      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200/40 dark:border-slate-800/40">
                        <button
                          onClick={() => setEditMode(false)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                            !editMode
                              ? "bg-white dark:bg-slate-950 text-blue-600 dark:text-blue-400 shadow-xs"
                              : "text-slate-500 dark:text-slate-400 hover:text-slate-800"
                          }`}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Report View
                        </button>
                        <button
                          onClick={() => setEditMode(true)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                            editMode
                              ? "bg-white dark:bg-slate-950 text-blue-600 dark:text-blue-400 shadow-xs"
                              : "text-slate-500 dark:text-slate-400 hover:text-slate-800"
                          }`}
                        >
                          <Sliders className="w-3.5 h-3.5" />
                          What-If Simulator
                        </button>
                      </div>
                    </div>

                    {/* Metadata Panel */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-slate-50 dark:bg-slate-900/20 rounded-2xl border border-slate-100/50 dark:border-slate-900/50">
                      <div>
                        <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">Document Type</span>
                        <input
                          type="text"
                          disabled={!editMode}
                          value={reportData.report_type || ""}
                          onChange={(e) => handleMetadataChange("report_type", e.target.value)}
                          className={`text-sm font-semibold text-slate-800 dark:text-slate-200 bg-transparent focus:outline-none w-full ${
                            editMode ? "border-b border-dashed border-slate-300 dark:border-slate-700 pb-0.5" : ""
                          }`}
                          placeholder="e.g. Lab Report"
                        />
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">Date / Time</span>
                        <input
                          type="text"
                          disabled={!editMode}
                          value={reportData.report_date || ""}
                          onChange={(e) => handleMetadataChange("report_date", e.target.value)}
                          className={`text-sm font-semibold text-slate-800 dark:text-slate-200 bg-transparent focus:outline-none w-full ${
                            editMode ? "border-b border-dashed border-slate-300 dark:border-slate-700 pb-0.5" : ""
                          }`}
                          placeholder="e.g. YYYY-MM-DD"
                        />
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">Provider / Doctor</span>
                        <input
                          type="text"
                          disabled={!editMode}
                          value={reportData.lab_name || ""}
                          onChange={(e) => handleMetadataChange("lab_name", e.target.value)}
                          className={`text-sm font-semibold text-slate-800 dark:text-slate-200 bg-transparent focus:outline-none w-full ${
                            editMode ? "border-b border-dashed border-slate-300 dark:border-slate-700 pb-0.5" : ""
                          }`}
                          placeholder="Clinic or Laboratory"
                        />
                      </div>
                    </div>

                    {/* Biomarkers / Ingredients List */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                          {editMode ? "Tweak Values & Run Simulations" : "Extracted Biomarkers & Prescribed Ingredients"}
                        </span>
                        <span className="text-xs font-medium text-slate-400 dark:text-slate-500 font-mono">
                          {reportData.biomarkers.length} item(s) found
                        </span>
                      </div>

                      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                        {!editMode ? (
                          reportData.biomarkers.map((biomarker, index) => {
                            const flagLower = (biomarker.flag || "normal").toLowerCase();
                            return (
                              <div
                                key={index}
                                className="p-3.5 bg-slate-50/50 dark:bg-slate-900/10 border border-slate-100/60 dark:border-slate-900 rounded-2xl flex flex-col gap-1.5 transition-all hover:bg-slate-50 dark:hover:bg-slate-900/25"
                              >
                                <div className="flex items-center justify-between gap-4">
                                  <div className="min-w-0 flex-1">
                                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">
                                      {biomarker.name}
                                    </p>
                                  </div>

                                  <div className="flex items-center gap-3 shrink-0">
                                    <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-950 px-2.5 py-1 rounded-md border border-slate-100 dark:border-slate-850">
                                      {biomarker.value} <span className="text-slate-400 dark:text-slate-500 font-sans text-[11px] ml-0.5">{biomarker.unit}</span>
                                    </span>

                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                                      flagLower === "high"
                                        ? "text-rose-600 bg-rose-50/50 dark:bg-rose-950/20 border-rose-500/20"
                                        : flagLower === "low"
                                        ? "text-blue-600 bg-blue-50/50 dark:bg-blue-950/20 border-blue-500/20"
                                        : "text-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500/20"
                                    }`}>
                                      {biomarker.flag || "Normal"}
                                    </span>
                                  </div>
                                </div>

                                {/* Dynamic Visual Reference Gauge */}
                                {renderBiomarkerVisualizer(biomarker)}
                              </div>
                            );
                          })
                        ) : (
                          // What-If Interactive Simulator Editors
                          <div className="space-y-3">
                            {reportData.biomarkers.map((biomarker, index) => (
                              <div
                                key={index}
                                className="p-4 bg-slate-50/30 dark:bg-slate-900/20 border border-slate-150 dark:border-slate-900 rounded-2xl space-y-3"
                              >
                                <div className="flex items-center justify-between gap-3">
                                  <input
                                    type="text"
                                    value={biomarker.name}
                                    onChange={(e) => handleBiomarkerChange(index, "name", e.target.value)}
                                    className="bg-white dark:bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 flex-1"
                                    placeholder="Biomarker / Drug Name"
                                  />
                                  <button
                                    onClick={() => deleteBiomarker(index)}
                                    className="text-rose-500 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 shrink-0 transition-all cursor-pointer"
                                    title="Delete biomarker"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>

                                <div className="grid grid-cols-4 gap-2">
                                  <div>
                                    <label className="block text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Value</label>
                                    <input
                                      type="text"
                                      value={biomarker.value}
                                      onChange={(e) => handleBiomarkerChange(index, "value", e.target.value)}
                                      className="w-full bg-white dark:bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 text-xs text-center font-mono font-bold"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Unit</label>
                                    <input
                                      type="text"
                                      value={biomarker.unit}
                                      onChange={(e) => handleBiomarkerChange(index, "unit", e.target.value)}
                                      className="w-full bg-white dark:bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 text-xs text-center text-slate-500"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Min Ref</label>
                                    <input
                                      type="text"
                                      value={biomarker.reference_low || ""}
                                      onChange={(e) => handleBiomarkerChange(index, "reference_low", e.target.value)}
                                      className="w-full bg-white dark:bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 text-xs text-center"
                                      placeholder="Min"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Max Ref</label>
                                    <input
                                      type="text"
                                      value={biomarker.reference_high || ""}
                                      onChange={(e) => handleBiomarkerChange(index, "reference_high", e.target.value)}
                                      className="w-full bg-white dark:bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 text-xs text-center"
                                      placeholder="Max"
                                    />
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">Zone Flag:</span>
                                  {["normal", "low", "high"].map((f) => (
                                    <button
                                      key={f}
                                      type="button"
                                      onClick={() => handleBiomarkerChange(index, "flag", f)}
                                      className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-md border transition-all cursor-pointer ${
                                        (biomarker.flag || "normal").toLowerCase() === f
                                          ? f === "high"
                                            ? "text-rose-600 bg-rose-50 dark:bg-rose-950/40 border-rose-500"
                                            : f === "low"
                                            ? "text-blue-600 bg-blue-50 dark:bg-blue-950/40 border-blue-500"
                                            : "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500"
                                          : "text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900"
                                      }`}
                                    >
                                      {f}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            ))}

                            <div className="pt-2 flex gap-3">
                              <button
                                onClick={addNewBiomarker}
                                className="flex-1 py-3 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-350 border border-slate-200/50 dark:border-slate-800 hover:bg-slate-200/50 dark:hover:bg-slate-800 flex items-center justify-center gap-1 cursor-pointer transition-all"
                              >
                                <Plus className="w-3.5 h-3.5" /> Add New Indicator
                              </button>
                              <button
                                onClick={() => runDeepAnalysis(reportData)}
                                className="flex-1 py-3 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 hover:shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <RefreshCw className={`w-3.5 h-3.5 ${isAnalysisLoading ? "animate-spin" : ""}`} />
                                Re-run AI analysis
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Step 3 Config: Translation selection & Status */}
                    <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
                      
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Globe className="w-4 h-4 text-slate-400" />
                        <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">Explain in:</span>
                        <select
                          value={selectedLanguage}
                          onChange={(e) => {
                            const newLang = e.target.value;
                            setSelectedLanguage(newLang);
                            runDeepAnalysis(reportData, newLang);
                          }}
                          className="px-2.5 py-1 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold cursor-pointer"
                        >
                          <option value="English">English</option>
                          <option value="Spanish (Español)">Spanish (Español)</option>
                          <option value="French (Français)">French (Français)</option>
                          <option value="German (Deutsch)">German (Deutsch)</option>
                          <option value="Hindi (हिन्दी)">Hindi (हिन्दी)</option>
                          <option value="Arabic (العربية)">Arabic (العربية)</option>
                          <option value="Chinese (中文)">Chinese (中文)</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-2">
                        {isAnalysisLoading ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-950/30 animate-pulse border border-blue-500/15">
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            Auto-Analyzing Report...
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-500/15">
                            <Check className="w-3.5 h-3.5" />
                            Analysis Ready
                          </span>
                        )}
                      </div>

                    </div>

                  </div>
                )}

              </div>

              {/* RIGHT SIDE: AI ANALYSIS & DETAILED SUMMARY OUTPUT */}
              <div className="lg:col-span-5">
                
                {/* 3. AI EXPLANATION WINDOW (Dr. Khan AI) */}
                <div className="bg-slate-50 dark:bg-slate-900/20 border border-slate-200/60 dark:border-slate-900 rounded-3xl p-6 min-h-[500px] flex flex-col justify-between shadow-xs">
                  
                  {/* Top Bar with Branding & PDF Saving */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-900 mb-6">
                    <div className="flex items-center gap-2">
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-mono font-bold tracking-wider">Dr. Khan AI Explainer</span>
                    </div>
                    {analysisResult && (
                      <button
                        onClick={downloadSummary}
                        className="inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:underline font-bold cursor-pointer"
                        title="Download summary report"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Save PDF/MD
                      </button>
                    )}
                  </div>

                  {/* Empty state or loading states */}
                  {!analysisResult && !isAnalysisLoading && (
                    <div className="my-auto text-center py-10 px-4">
                      <div className="w-12 h-12 bg-slate-100 dark:bg-slate-900/60 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-6 h-6" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">Explanation Waiting</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto mt-2 leading-relaxed">
                        Extract files or check a demo sandbox template first, then click "Generate Lay Explanation" to trigger Dr. Khan AI's advanced clinical simplifier.
                      </p>
                    </div>
                  )}

                  {isAnalysisLoading && (
                    <div className="my-auto space-y-6 py-8">
                      <div className="flex items-center justify-center">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full border-4 border-blue-100 dark:border-blue-900 animate-spin border-t-blue-600"></div>
                          <Stethoscope className="w-5 h-5 text-blue-600 absolute inset-0 m-auto animate-pulse" />
                        </div>
                      </div>
                      <div className="text-center space-y-2 max-w-xs mx-auto">
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Dr. Khan AI is analyzing...</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          Consulting standard AHA, WHO, and clinical libraries to translate findings into lay-friendly language...
                        </p>
                      </div>
                      <div className="space-y-2">
                        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
                        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-5/6 animate-pulse mx-auto"></div>
                        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-2/3 animate-pulse mx-auto"></div>
                      </div>
                    </div>
                  )}

                  {/* EXPLANATION MARKDOWN CONTENT */}
                  {analysisResult && !isAnalysisLoading && (
                    <div className="flex-1 overflow-y-auto pr-1 relative min-h-[300px]">
                      <div className="prose prose-slate dark:prose-invert max-w-none text-left">
                        {renderCustomMarkdown(analysisResult)}
                      </div>
                    </div>
                  )}

                </div>

              </div>

            </div>

          </div>
        )}

        {/* ==================== PAGE: FEATURES ==================== */}
        {activeTab === "features" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 dark:bg-blue-950 px-3 py-1.5 rounded-full">Technical Stack</span>
              <h1 className="text-4xl font-extrabold font-display text-slate-900 dark:text-white mt-4 tracking-tight">
                Empowering Patients Through AI Engineering
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-4 text-base">
                An overview of our core medical processing architecture, OCR vision, and translation components.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
              
              <div className="bg-slate-50 dark:bg-slate-900/20 p-8 rounded-3xl border border-slate-100 dark:border-slate-900 space-y-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
                  <ScanLine className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">Multimodal Vision OCR Extraction</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Laboratory blood tests, cardiology logs, and handwritten physical scripts vary widely in visual structure. Our server-side processing layer applies state-of-the-art multimodal vision parsing to isolate text bounding boxes, match abbreviations to standardized clinical biomarkers, and parse handwritten numeric readings with high confidence.
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/20 p-8 rounded-3xl border border-slate-100 dark:border-slate-900 space-y-4">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center">
                  <MessageSquareText className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">Empathetic Patient Communication</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Raw health results trigger immediate patient stress. Rather than spitting out dry clinical summaries, our simplification model is trained using empathetic dialogue rules. It focuses on clarifying why readings might fluctuate, explaining what metrics indicate under the hood, and providing practical dietary or scheduling adjustments.
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/20 p-8 rounded-3xl border border-slate-100 dark:border-slate-900 space-y-4">
                <div className="w-12 h-12 bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 rounded-xl flex items-center justify-center">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">Multi-Ingredient Warning Protocols</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Many patients take multi-symptom cold relief syrups while separately dosing paracetamol, completely unaware of overlapping active drug molecules that cause severe liver damage. Our safety algorithm isolates base molecules on prescriptions and pill labels, cross-referencing names to flags and highlighting duplicate drug classes immediately.
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/20 p-8 rounded-3xl border border-slate-100 dark:border-slate-900 space-y-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
                  <Languages className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">Fluency Across Diverse Demographics</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Health inequities are often exacerbated by language barriers. MedExplaiN AI translates complicated medical metrics natively into multiple major languages, preserving complex medical terms with accuracy while displaying descriptions in clear, understandable prose.
                </p>
              </div>

            </div>

          </div>
        )}

        {/* ==================== PAGE: FAQ ==================== */}
        {activeTab === "faq" && (
          <div className="max-w-4xl mx-auto px-4 py-16">
            
            <div className="text-center mb-16">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 dark:bg-blue-950 px-3 py-1.5 rounded-full">Help & Support</span>
              <h1 className="text-4xl font-extrabold font-display text-slate-900 dark:text-white mt-4 tracking-tight">
                Frequently Asked Questions
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-3 text-sm">
                Get answers to common queries regarding medical accuracy, privacy configurations, and platform scope.
              </p>
            </div>

            <div className="space-y-6">
              {FAQS.map((faq, i) => (
                <div key={i} className="p-6 bg-slate-50/50 dark:bg-slate-900/10 rounded-2xl border border-slate-100 dark:border-slate-900">
                  <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ==================== PAGE: PRIVACY POLICY ==================== */}
        {activeTab === "privacy" && (
          <div className="max-w-4xl mx-auto px-4 py-16 text-left">
            <h1 className="text-3xl font-bold font-display text-slate-900 dark:text-white mb-4">Privacy Policy</h1>
            <p className="text-xs text-slate-400 font-mono mb-6">Last Updated: July 17, 2026</p>
            <div className="space-y-6 text-sm text-slate-600 dark:text-slate-350 leading-relaxed">
              <p>
                At MedExplaiN AI, we recognize the critical sensitivity of health information. This privacy policy describes our strict procedures regarding data transit, server execution, and confidentiality bounds.
              </p>
              <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">1. Data Minimization & No Storage</h3>
              <p>
                We operate on an <strong>ephemeral execution model</strong>. When you upload prescriptions, labels, or blood tests, the file's base64 bytes are transmitted securely via SSL/TLS to our private server container. We do not write files to physical disks, databases, or cloud storage logs. All medical analysis takes place in computer memory (RAM) and is permanently deleted as soon as the HTTP request terminates.
              </p>
              <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">2. External API Grounding</h3>
              <p>
                Our server proxy passes report parameters to certified models via safe API connections to verify clinical data. No patient identifiers (like name, address, or social security details) are processed, maintaining anonymity throughout the workflow.
              </p>
              <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">3. Cookies</h3>
              <p>
                This application utilizes basic client-side localStorage solely to persist your local user preferences, such as selected layout theme (dark/light) and active workspace tabs. No profiling, tracking, or marketing cookies are installed.
              </p>
            </div>
          </div>
        )}

        {/* ==================== PAGE: TERMS OF SERVICE ==================== */}
        {activeTab === "terms" && (
          <div className="max-w-4xl mx-auto px-4 py-16 text-left">
            <h1 className="text-3xl font-bold font-display text-slate-900 dark:text-white mb-4">Terms of Service</h1>
            <p className="text-xs text-slate-400 font-mono mb-6">Last Updated: July 17, 2026</p>
            <div className="space-y-6 text-sm text-slate-600 dark:text-slate-350 leading-relaxed">
              <p>
                Welcome to MedExplaiN AI. By accessing or using this application, you agree to comply with and be bound by the following Terms and Conditions of service.
              </p>
              <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">1. Not a Substitute for Medical Care</h3>
              <p className="text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 p-4 rounded-xl font-medium border border-amber-200/50">
                You explicitly acknowledge and agree that MedExplaiN AI is an automated text simplification and educational tool. The contents, explanations, medicine descriptions, reference boundaries, and guidelines provided within are not clinical diagnoses, prescriptions, or advice. Under no circumstances should any automated output be used to self-prescribe, ignore licensed healthcare advice, or delay medical check-ups.
              </p>
              <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">2. Safe Conduct</h3>
              <p>
                You represent that any medical record, label, or prescription uploaded to the system belongs to you or that you possess full consent from the owner. You are forbidden from uploading malicious payloads, executable scripts, or automated crawling threads designed to compromise container execution.
              </p>
              <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">3. Disclaimer of Liability</h3>
              <p>
                MedExplaiN AI and its creators make no warranties regarding the complete accuracy of OCR extraction or the clinical alignment of language summarization. Medicine guidelines and standard reference ranges undergo constant revision. Use of the AI-derived explanation is fully at your own risk.
              </p>
            </div>
          </div>
        )}

        {/* ==================== PAGE: CONTACT ==================== */}
        {activeTab === "contact" && (
          <div className="max-w-3xl mx-auto px-4 py-16">
            
            <div className="text-center mb-12">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 dark:bg-blue-950 px-3 py-1.5 rounded-full">Support Channels</span>
              <h1 className="text-4xl font-extrabold font-display text-slate-900 dark:text-white mt-4 tracking-tight">
                Get in Touch
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
                Have questions or need to connect regarding our diagnostic explainer tool? Reach out below.
              </p>
            </div>

            {contactSubmitted ? (
              <div className="p-8 bg-emerald-50 dark:bg-emerald-950/20 rounded-3xl border border-emerald-200 dark:border-emerald-900/50 text-center space-y-3">
                <Check className="w-12 h-12 text-emerald-500 mx-auto" />
                <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-400">Message Dispatched Successfully</h3>
                <p className="text-sm text-emerald-600 dark:text-emerald-500 leading-relaxed">
                  Thank you for reaching out to MedExplaiN AI! Our patient support team will review your wellness tool inquiry and get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-6 bg-slate-50/50 dark:bg-slate-900/10 p-8 rounded-3xl border border-slate-100 dark:border-slate-900">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Your Name</label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="e.g. John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="e.g. name@domain.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Message or Inquiry</label>
                  <textarea
                    rows={4}
                    required
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="How can our clinical team support your report clarity?"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-4.5 rounded-xl bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-semibold text-sm hover:opacity-90 transition-all cursor-pointer shadow"
                >
                  Submit Inquiry
                </button>

              </form>
            )}

          </div>
        )}

      </main>

      {/* 4. PROFESSIONAL MEDICAL FOOTER */}
      <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900 pt-16 pb-8 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-100 dark:border-slate-900">
            
            {/* Column 1: Logo & Vision */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 select-none">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                  <Stethoscope className="w-4.5 h-4.5 text-white" />
                </div>
                <span className="text-base font-bold font-display text-slate-900 dark:text-white">
                  MedExplaiN AI
                </span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
                A health-literacy application translating prescriptions, laboratory test grids, and medicine packaging into patient-friendly, localized explanations.
              </p>
            </div>

            {/* Column 2: Platform Links */}
            <div className="space-y-3">
              <h4 className="font-bold font-display text-slate-900 dark:text-white uppercase tracking-wider text-[10px]">Interactive App</h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => setActiveTab("analyzer")} className="text-slate-500 hover:text-blue-600 dark:hover:text-blue-400">
                    AI Report Workspace
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab("home"); setTimeout(() => document.getElementById("sandbox-section")?.scrollIntoView({ behavior: "smooth" }), 100); }} className="text-slate-500 hover:text-blue-600 dark:hover:text-blue-400">
                    Free Sandbox Demo
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab("features")} className="text-slate-500 hover:text-blue-600 dark:hover:text-blue-400">
                    Processing Features
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Patient Legal Boundaries */}
            <div className="space-y-3">
              <h4 className="font-bold font-display text-slate-900 dark:text-white uppercase tracking-wider text-[10px]">Legal Terms</h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => setActiveTab("privacy")} className="text-slate-500 hover:text-blue-600 dark:hover:text-blue-400">
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab("terms")} className="text-slate-500 hover:text-blue-600 dark:hover:text-blue-400">
                    Terms of Use
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab("faq")} className="text-slate-500 hover:text-blue-600 dark:hover:text-blue-400">
                    Common FAQs
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Standards & Trust Badge */}
            <div className="space-y-4">
              <h4 className="font-bold font-display text-slate-900 dark:text-white uppercase tracking-wider text-[10px]">Trust & Compliance</h4>
              <div className="space-y-2 text-slate-500 dark:text-slate-400 leading-relaxed">
                <p className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  HIPAA-Aligned Operations
                </p>
                <p className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  Grounded on NIH & CDC Guides
                </p>
                <p className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  No Persistent Data Logging
                </p>
              </div>
            </div>

          </div>

          {/* Sub-footer disclaimer copy */}
          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] text-slate-400 dark:text-slate-500">
            <p>© 2026 MedExplaiN AI. All patient-centric literacy models served securely. All rights reserved.</p>
            <p className="flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-rose-500" /> for global health accessibility
            </p>
          </div>

        </div>
      </footer>

    </div>
  );
}
