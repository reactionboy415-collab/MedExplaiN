import { LabReport } from "./types";

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export const SAMPLE_REPORTS: { label: string; description: string; report: LabReport }[] = [
  {
    label: "Lab Report (Acute Fever)",
    description: "Sample blood test with hyperpyrexia (severe high fever) and borderline blood pressure.",
    report: {
      report_date: "2026-06-22",
      lab_name: "Metropolitan Wellness Lab",
      report_type: "Laboratory Report",
      biomarkers: [
        {
          name: "Blood pressure",
          value: "140",
          unit: "mmHg",
          reference_low: "90",
          reference_high: "120",
          flag: "high"
        },
        {
          name: "Pulse",
          value: "76",
          unit: "bpm",
          reference_low: "60",
          reference_high: "100",
          flag: "normal"
        },
        {
          name: "Respiratory rate",
          value: "16",
          unit: "/min",
          reference_low: "12",
          reference_high: "20",
          flag: "normal"
        },
        {
          name: "Temperature",
          value: "42.8",
          unit: "°C",
          reference_low: "36.5",
          reference_high: "37.5",
          flag: "high"
        }
      ]
    }
  },
  {
    label: "Chronic Disease Prescription",
    description: "Sample prescription listing medications for high blood pressure and type-2 diabetes.",
    report: {
      report_date: "2026-07-10",
      lab_name: "Dr. Clara Mercer, MD - City Cardiology",
      report_type: "Prescription",
      biomarkers: [
        {
          name: "Lisinopril (Blood Pressure)",
          value: "10",
          unit: "mg - Once daily in the morning",
          reference_low: null,
          reference_high: null,
          flag: null
        },
        {
          name: "Metformin (Blood Sugar)",
          value: "500",
          unit: "mg - Twice daily with meals",
          reference_low: null,
          reference_high: null,
          flag: null
        },
        {
          name: "Atorvastatin (Cholesterol)",
          value: "20",
          unit: "mg - Once daily at bedtime",
          reference_low: null,
          reference_high: null,
          flag: null
        }
      ]
    }
  },
  {
    label: "OTC Medicine Label",
    description: "Active ingredients list of an over-the-counter multi-symptom cold syrup.",
    report: {
      report_date: null,
      lab_name: "MedExpress Apothecary",
      report_type: "Medicine Label",
      biomarkers: [
        {
          name: "Acetaminophen (Pain Reliever)",
          value: "325",
          unit: "mg per 15mL dose",
          reference_low: null,
          reference_high: null,
          flag: null
        },
        {
          name: "Dextromethorphan HBr (Cough Suppressant)",
          value: "10",
          unit: "mg per 15mL dose",
          reference_low: null,
          reference_high: null,
          flag: null
        },
        {
          name: "Phenylephrine HCl (Decongestant)",
          value: "5",
          unit: "mg per 15mL dose",
          reference_low: null,
          reference_high: null,
          flag: null
        }
      ]
    }
  }
];

export const FEATURES: FeatureItem[] = [
  {
    id: "ocr",
    title: "Advanced Medical OCR",
    description: "State-of-the-art vision models scan cursive medical prescriptions, dense laboratory reports, and tiny medicine containers with high fidelity.",
    iconName: "ScanLine"
  },
  {
    id: "layman",
    title: "Simplification Engine",
    description: "Instantly translates confusing medical abbreviations, chemical complexes, and laboratory metrics into plain, jargon-free explanations.",
    iconName: "MessageSquareText"
  },
  {
    id: "warning",
    title: "Safety & Contraindications",
    description: "Highlights key drug timing rules, overlapping active ingredients to prevent accidental double-dosing, and critical emergency red-flags.",
    iconName: "ShieldAlert"
  },
  {
    id: "language",
    title: "Multilingual Explanations",
    description: "Explain medical summaries fluently in your language of comfort, including Spanish, French, German, Hindi, Arabic, and simplified Chinese.",
    iconName: "Languages"
  },
  {
    id: "pdf",
    title: "Exportable Patient Summaries",
    description: "Generate structured, clean PDF reports and medical logs that you can print, save, or show to your general practitioner in your next check-up.",
    iconName: "Download"
  },
  {
    id: "privacy",
    title: "HIPAA-Aligned Privacy First",
    description: "Your health records are processed fully server-side with no persistent storage, maintaining maximum user data confidentiality and safety.",
    iconName: "Lock"
  }
];

export const FAQS: FAQItem[] = [
  {
    question: "Can MedExplaiN AI replace my medical doctor or diagnostic physician?",
    answer: "No, absolutely not. MedExplaiN AI is strictly an educational tool designed to help patients understand complex reports, terminology, reference ranges, and medicine structures. It is not an active diagnostic platform and is never a replacement for a licensed healthcare professional's clinical assessment, diagnostic reasoning, or treatment recommendations."
  },
  {
    question: "Is my personal medical data safe, private, and confidential on this platform?",
    answer: "Yes, privacy is our highest priority. All image and report processing happens in high-security, ephemeral server-side containers. Your uploaded images and base64 strings are never stored or logged in permanent databases, and are immediately deleted upon completing the analysis request. No personal identifiers (like SSN, insurance IDs, or home address) are collected or tracked."
  },
  {
    question: "What types of medical documents can I upload for AI explanation?",
    answer: "You can upload JPEG, PNG images, smartphone camera photos, and digital documents containing outpatient laboratory blood panels (CBC, CMP, Lipid panel, Thyroid panel), urine tests, hospital discharge summaries, medication bottle labels, and handwritten doctor prescription slips."
  },
  {
    question: "Does the AI support languages other than English?",
    answer: "Yes, we support comprehensive multilingual medical translation. You can receive clinical explanations, dosage instructions, and physician questions fully translated into Spanish (Español), French (Français), German (Deutsch), Hindi (हिन्दी), Arabic (العربية), Chinese (中文), and more, with complex pharmacological terminology preserved accurately."
  },
  {
    question: "What do the 'High', 'Low', or 'Flag' notations mean on my lab report?",
    answer: "Laboratories establish standard biological reference intervals derived from 95% of healthy populations. A value labeled 'High' or 'Low' simply means your numeric metric sits outside that statistical 95% bell curve. It is a signpost for clinical correlation—not an automatic sign of disease. Mild variances can stem from hydration status, recent intense exercise, sleep patterns, or temporary viral infections."
  },
  {
    question: "Can taking two over-the-counter medicines cause an accidental drug overdose?",
    answer: "Yes, this is an extremely common safety risk known as duplicate active ingredient toxicity. For example, acetaminophen (paracetamol) is found in hundreds of branded products (Tylenol, DayQuil, NyQuil, Excedrin, Percocet). Taking cold syrup alongside headache pills can easily exceed the safe 4,000 mg daily liver threshold. MedExplaiN AI specifically scans for active chemical molecules to alert you to overlapping duplicate ingredients."
  },
  {
    question: "Why does my fasting glucose or lipid profile require 8 to 12 hours of fasting?",
    answer: "Consuming carbohydrates or fats immediately triggers digestion, causing temporary surges in blood glucose and circulating chylomicron triglycerides. Fasting for 8–12 hours allows circulating nutrients to reach baseline homeostasis, providing your physician an accurate baseline measurement of metabolic health and insulin sensitivity."
  },
  {
    question: "Can severe dehydration cause abnormal blood lab test numbers?",
    answer: "Yes! Dehydration causes hemoconcentration—a decrease in blood plasma volume that makes circulating cells and molecules appear artificially concentrated. Dehydration frequently causes elevated hematocrit, elevated serum sodium, high blood urea nitrogen (BUN), and elevated total protein."
  },
  {
    question: "Why might my serum creatinine test come back elevated after heavy exercise?",
    answer: "Creatinine is a natural metabolic breakdown byproduct of phosphocreatine in skeletal muscle tissue. Strenuous weightlifting, crossfit, marathon running, or taking dietary creatine monohydrate supplements temporarily increases circulating creatinine without implying underlying renal kidney damage."
  },
  {
    question: "What does HbA1c measure compared to a daily fingerstick blood glucose test?",
    answer: "A standard fingerstick or fasting glucose test measures the exact sugar level in your bloodstream at that specific minute. In contrast, Hemoglobin A1c (HbA1c) measures the percentage of red blood cells coated with glucose over their 90 to 120-day natural lifespan, providing a stable 3-month panoramic view of glycemic control."
  },
  {
    question: "What do doctor prescription abbreviations like PO, BID, PRN, and QHS mean?",
    answer: "These are standard Latin medical shorthand codes: 'PO' (Per Os) means orally by mouth; 'BID' (Bis In Die) means twice a day (roughly 12 hours apart); 'PRN' (Pro Re Nata) means take only as needed when symptoms appear; 'AC' means before meals, 'PC' means after meals, and 'QHS' means take at bedtime."
  },
  {
    question: "What should I do if my blood pressure reading is in the red hypertensive crisis zone?",
    answer: "If your systolic blood pressure exceeds 180 mmHg or diastolic exceeds 120 mmHg, rest quietly for 5 minutes and re-measure. If readings remain at or above 180/120 mmHg, and you experience warning symptoms like chest pain, shortness of breath, back pain, numbness, or vision changes, this is an emergency requiring immediate 911 or emergency room medical attention."
  },
  {
    question: "Can I download and print the AI explanation to bring to my doctor's appointment?",
    answer: "Yes! Once Dr. Khan AI finishes analyzing your report, simply click the 'Save PDF/MD' button at the top of the explanation card. This exports a structured, cleanly formatted summary featuring your test findings, potential discussion topics, and prioritized questions for your physician."
  },
  {
    question: "Can MedExplaiN AI read messy cursive handwritten doctor scripts?",
    answer: "Yes, our server uses multimodal vision OCR tailored to decipher complex medical handwriting, Latin doctor sig abbreviations, apothecary units, and tiny medicine packaging text with high clinical confidence."
  },
  {
    question: "How can I prepare the most productive questions for my doctor's visit?",
    answer: "Review your abnormal indicators, write down your current symptoms and when they began, bring all prescription bottles and vitamins you take, and ask three core questions: 'What might be causing this value to be abnormal?', 'Do we need a follow-up confirmatory test?', and 'What lifestyle or medication changes should we consider first?'"
  }
];

