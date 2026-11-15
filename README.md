<h1 align="center">
  🏥 MedExplaiN - AI Medical Document Analyzer
</h1>

<p align="center">
  <strong>Demystifying prescriptions and complex medical reports for everyone. Built for social impact.</strong>
</p>

<p align="center">
  <a href="[https://medexplain-ai-two.vercel.app/](https://medexplain-ai-two.vercel.app/)" target="_blank">
    <img src="[https://img.shields.io/badge/](https://img.shields.io/badge/)🟢_Live_Demo-Website-10B981?style=for-the-badge" alt="Live Demo" />
  </a>
  <a href="#-100-free-api">
    <img src="[https://img.shields.io/badge/](https://img.shields.io/badge/)⚡_Free_API-Available-3B82F6?style=for-the-badge" alt="Free API" />
  </a>
  <a href="[https://github.com/reactionboy415-collab/MedExplaiN/stargazers](https://github.com/reactionboy415-collab/MedExplaiN/stargazers)">
    <img src="[https://img.shields.io/github/stars/reactionboy415-collab/MedExplaiN?style=for-the-badge&color=F59E0B](https://img.shields.io/github/stars/reactionboy415-collab/MedExplaiN?style=for-the-badge&color=F59E0B)" alt="Stars" />
  </a>
  <img src="[https://img.shields.io/badge/Open_Source-](https://img.shields.io/badge/Open_Source-)❤️-E11D48?style=for-the-badge" alt="Open Source" />
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

url = "https://medexplain-ai-two.vercel.app/api/analyze" # Replace with actual API endpoint
payload = {
    "text": "Rx: Paracetamol 500mg BD x 5 days. Patient has mild pyrexia.",
    "language": "english" 
}

response = requests.post(url, json=payload)
print(response.json())
```

### JavaScript / Node.js Example (`fetch`)
```javascript
const analyzeReport = async () => {
  const response = await fetch("https://medexplain-ai-two.vercel.app/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: "HbA1c level is 7.2%. Suggest clinical correlation.",
      language: "english"
    })
  });
  
  const data = await response.json();
  console.log(data);
};

analyzeReport();
```

---

## 💻 Local Setup & Installation

Want to run MedExplaiN on your own machine or contribute? It takes less than 2 minutes.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/reactionboy415-collab/MedExplaiN.git
   cd MedExplaiN
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the server:**
   ```bash
   uvicorn main:app --reload
   ```
   Open `http://localhost:8000` in your browser.

---

## 🛠️ Tech Stack
- **Backend:** Python, FastAPI
- **AI/LLM:** Google Gemini AI
- **Database:** Supabase
- **Deployment:** Vercel

## 🤝 Contributing
Since this is an open-source tool for social impact, contributions are highly welcome! 
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🙋‍♂️ About the Creator
Built with ❤️ by **Chirag Rathi** (14yo Developer). 
I build micro-SaaS, AI agents, and open-source tools. 

- 📺 **YouTube:** [@BuildWithChirag09-x1](https://www.youtube.com/@BuildWithChirag09-x1)
- 📸 **Instagram:** [@the.chiragrathi](https://instagram.com/the.chiragrathi)
- 📧 **Email:** developer9301@gmail.com

---
*If this project helped you understand a medical report or build your own app, please consider giving it a ⭐!*
