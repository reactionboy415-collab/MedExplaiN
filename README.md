<h1 align="center">
  🏥 MedExplaiN - AI Medical Document Analyzer
</h1>

<p align="center">
  <strong>Demystifying prescriptions and complex medical reports for everyone. Built for social impact.</strong>
</p>

<p align="center">
  <a href="https://medexplain-ai-two.vercel.app/" target="_blank">
    <img src="https://img.shields.io/badge/🟢_Live_Demo-Website-10B981?style=for-the-badge" alt="Live Demo" />
  </a>
  <a href="#-100-free-api">
    <img src="https://img.shields.io/badge/⚡_Free_API-Available-3B82F6?style=for-the-badge" alt="Free API" />
  </a>
  <a href="https://github.com/reactionboy415-collab/MedExplaiN/stargazers">
    <img src="https://img.shields.io/github/stars/reactionboy415-collab/MedExplaiN?style=for-the-badge&color=F59E0B" alt="Stars" />
  </a>
  <img src="https://img.shields.io/badge/Open_Source-❤️-E11D48?style=for-the-badge" alt="Open Source" />
</p>

---

## 💡 The Problem & Solution

Have you ever looked at a doctor's prescription or a lab report and felt completely lost? Medical jargon is confusing, and consulting a doctor just to understand a basic report isn't always possible. 

**MedExplaiN** is an open-source, AI-powered tool that acts as your personal medical translator. You upload a document (or image), and the AI breaks it down into simple, easy-to-understand language. 

No hidden fees. No paywalls. Just tech built for social impact. 🌍

## ✨ Key Features
- **📄 Smart Document OCR:** Instantly reads handwritten prescriptions and complex PDF lab reports.
- **🧠 AI Simplification:** Converts heavy medical jargon into plain, understandable language.
- **⚡ 100% Free Developer API:** Build your own health-tech apps without paying for expensive AI tokens.
- **🔒 Privacy First:** We do not store your personal medical data.

---

## 🚀 100% FREE API (No API Key Required!)

Are you a developer building a health-tech app, a hackathon project, or a WhatsApp bot? We provide a **completely free API** for you to integrate MedExplaiN's core AI into your own projects. 

*If you use our API, please drop a ⭐️ on this repository to keep the servers running!*

### Python Example (`requests`)
```python
import requests

url = "[https://medexplain-ai-two.vercel.app/api/analyze](https://medexplain-ai-two.vercel.app/api/analyze)" # Replace with actual API endpoint if different
payload = {
    "text": "Rx: Paracetamol 500mg BD x 5 days. Patient has mild pyrexia.",
    "language": "english" 
}

response = requests.post(url, json=payload)
print(response.json())

🩺 MedExplaiN AI

«Making healthcare information understandable with AI.»

MedExplaiN AI is an AI-powered web application that transforms complex prescriptions, medicine labels, and medical reports into simple, easy-to-understand explanations. It helps users better understand their medications through OCR, multilingual translation, and AI-generated summaries.

---

✨ Features

- 📄 Upload prescriptions, medicine labels, or medical reports (Image/PDF)
- 🤖 AI-powered medical explanation in simple language
- 🌍 Multilingual translation
- 💊 Medicine purpose, dosage, and timing
- ⚠️ Common side effects and precautions
- 🚨 Important warnings and safety highlights
- 📥 Downloadable AI summary
- 📱 Fully responsive design
- ⚡ Fast, lightweight, and optimized for performance

---

🛠️ Tech Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- shadcn/ui
- AI API
- OCR Engine
- Vercel

---

🎯 Problem

Medical prescriptions and reports often contain complex terminology that is difficult for patients to understand. This can lead to confusion and improper medication use.

---

💡 Solution

MedExplaiN AI converts medical documents into clear, patient-friendly explanations using AI while supporting multiple languages for better accessibility.

---

🚀 Getting Started

git clone https://github.com/reactionboy415-collab/MedExplaiN

cd medexplain-ai

npm install

npm run dev

Open "http://localhost:3000" in your browser.

---

📸 Demo

- Live Demo: https://medexplain-ai-two.vercel.app
- Demo Video: https://youtu.be/QvipKoZT2j4?si=pgYQQALleieyiPIf

---

📂 Project Structure

app/
components/
public/
lib/
hooks/
styles/

---

🌍 Accessibility

Designed with accessibility and responsiveness in mind, ensuring a smooth experience across desktop, tablet, and mobile devices.

---

🔒 Privacy

MedExplaiN AI is designed to respect user privacy. Uploaded files are processed only for generating explanations and should not be treated as permanent medical records.

---

⚠️ Disclaimer

MedExplaiN AI is an informational tool only. It does not replace professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional before making medical decisions.

---

📄 License

This project is licensed under the MIT License.

---

❤️ Built For

Hackathons • AI for Social Good • Healthcare Innovation
