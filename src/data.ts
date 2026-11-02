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
    label: "Sample Dengue CBC",
    description: "Acute viral hemogram demonstrating severe thrombocytopenia, leukopenia, and hemoconcentration.",
    report: {
      report_date: "2026-08-14",
      lab_name: "Apex Central Pathology Labs",
      report_type: "Complete Blood Count (CBC)",
      biomarkers: [
        {
          name: "Platelets (PLT)",
          value: "48",
          unit: "×10³/µL",
          reference_low: "150",
          reference_high: "450",
          flag: "low"
        },
        {
          name: "Total Leukocyte Count (WBC)",
          value: "2.4",
          unit: "×10³/µL",
          reference_low: "4.0",
          reference_high: "11.0",
          flag: "low"
        },
        {
          name: "Hemoglobin (Hb)",
          value: "10.4",
          unit: "g/dL",
          reference_low: "12.0",
          reference_high: "17.5",
          flag: "low"
        },
        {
          name: "Hematocrit (PCV)",
          value: "48.2",
          unit: "%",
          reference_low: "36.0",
          reference_high: "46.0",
          flag: "high"
        }
      ]
    }
  },
  {
    label: "Lipid Profile",
    description: "Fasting lipid panel presenting atherogenic dyslipidemia with elevated LDL and triglycerides.",
    report: {
      report_date: "2026-07-29",
      lab_name: "Metropolitan Cardiometabolic Center",
      report_type: "Lipid Panel",
      biomarkers: [
        {
          name: "Total Cholesterol",
          value: "248",
          unit: "mg/dL",
          reference_low: "120",
          reference_high: "200",
          flag: "high"
        },
        {
          name: "LDL Cholesterol ('Bad')",
          value: "162",
          unit: "mg/dL",
          reference_low: "0",
          reference_high: "100",
          flag: "high"
        },
        {
          name: "HDL Cholesterol ('Good')",
          value: "38",
          unit: "mg/dL",
          reference_low: "40",
          reference_high: "60",
          flag: "low"
        },
        {
          name: "Triglycerides",
          value: "240",
          unit: "mg/dL",
          reference_low: "0",
          reference_high: "150",
          flag: "high"
        },
        {
          name: "VLDL Cholesterol",
          value: "48",
          unit: "mg/dL",
          reference_low: "5",
          reference_high: "30",
          flag: "high"
        }
      ]
    }
  },
  {
    label: "Thyroid Panel",
    description: "Serum chemiluminescence profile indicative of primary autoimmune hypothyroidism.",
    report: {
      report_date: "2026-08-02",
      lab_name: "Endocrine Diagnostic Institute",
      report_type: "Thyroid Function Test",
      biomarkers: [
        {
          name: "Thyroid Stimulating Hormone (TSH)",
          value: "7.85",
          unit: "mIU/L",
          reference_low: "0.40",
          reference_high: "4.50",
          flag: "high"
        },
        {
          name: "Free Thyroxine (Free T4)",
          value: "0.68",
          unit: "ng/dL",
          reference_low: "0.80",
          reference_high: "1.80",
          flag: "low"
        },
        {
          name: "Free Triiodothyronine (Free T3)",
          value: "2.10",
          unit: "pg/mL",
          reference_low: "2.30",
          reference_high: "4.20",
          flag: "low"
        },
        {
          name: "Anti-Thyroid Peroxidase (Anti-TPO)",
          value: "148",
          unit: "IU/mL",
          reference_low: "0",
          reference_high: "34",
          flag: "high"
        }
      ]
    }
  },
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
  }
];

export const FEATURES: FeatureItem[] = [
  {
    id: "ocr",
    title: "Layer 1: OCR & Biomarker Isolation",
    description: "High-precision optical extraction of clinical units (mg/dL, g/dL, fL, mmol/L, mEq/L) and reported integers from paper tests and digital PDFs.",
    iconName: "ScanLine"
  },
  {
    id: "layman",
    title: "Layer 2: Demographic & Range Normalization",
    description: "Cross-referencing reported numbers against standard biological reference bands (Adult Male, Adult Female, Pediatric variations) across testing platforms.",
    iconName: "MessageSquareText"
  },
  {
    id: "triage",
    title: "Layer 3: Doctor-Ready Consultation Brief",
    description: "Automated creation of prioritized, scientifically framed questions to prepare the patient for an empowering, time-effective physician consultation.",
    iconName: "Stethoscope"
  },
  {
    id: "warning",
    title: "Rx Duplicate Compound Detection",
    description: "Highlights key drug timing rules, overlapping active chemical molecules (like acetaminophen overdose risks), and critical emergency red flags.",
    iconName: "ShieldAlert"
  },
  {
    id: "language",
    title: "Multilingual Medical Explanations",
    description: "Explain medical findings fluently in your language of comfort, including Spanish, French, German, Hindi, Arabic, and simplified Chinese.",
    iconName: "Languages"
  },
  {
    id: "privacy",
    title: "Zero-Knowledge In-Memory Parsing",
    description: "No persistent patient databases or tracking cookies. All document telemetry is parsed ephemerally in volatile memory and purged immediately.",
    iconName: "Lock"
  }
];

export const FAQS: FAQItem[] = [
  {
    question: "How does MedExplain AI normalize laboratory reference ranges across different testing methods?",
    answer: "Different clinical laboratories (e.g., Labcorp, Quest Diagnostics, hospital analyzers) employ distinct biochemical assays, photometric reagents, and instrumentation platforms (such as chemiluminescent immunoassay, enzymatic photometry, or electrical impedance cell counters). MedExplain AI extracts both the reported patient metric AND the specific laboratory-printed biological reference interval from your document. The engine evaluates deviation relative to the reporting facility's specific calibration bands before cross-referencing against peer-reviewed consensus guidelines (such as WHO, ADA, KDIGO, and AACE standards)."
  },
  {
    question: "What are standard reference limits for Complete Blood Count (CBC) and Differential counts?",
    answer: "A standard adult Complete Blood Count (CBC) typically includes: Hemoglobin (Adult Males: 13.8–17.2 g/dL, Adult Females: 12.1–15.1 g/dL), Hematocrit (Males: 40.7%–50.3%, Females: 36.1%–44.3%), Platelets (150,000–450,000/µL), and Total White Blood Cells (4,000–11,000/µL). The white cell differential spans Neutrophils (40%–70% or 1.5–8.0 ×10³/µL), Lymphocytes (20%–40% or 1.0–4.0 ×10³/µL), Monocytes (2%–8%), Eosinophils (1%–4%), and Basophils (0.5%–1%). Minor variations occur across individual laboratories."
  },
  {
    question: "Why do SGPT/ALT levels elevate during temporary hepatic stress?",
    answer: "Alanine Aminotransferase (ALT / SGPT) is a cytosolic transaminase enzyme predominantly localized inside the cytoplasm of functional hepatocytes. When liver cell membranes experience transient metabolic stress—provoked by acute viral infection, high alcohol consumption, acetaminophen metabolism, statin initiation, strenuous unaccustomed weight training, or hepatic steatosis (MASLD)—increased membrane permeability or microcellular necrosis causes ALT to leak into the systemic blood circulation, resulting in elevated serum measurements."
  },
  {
    question: "How does the system ensure zero data persistence and absolute HIPAA-level cryptographic privacy?",
    answer: "MedExplain AI enforces a zero-knowledge architecture. Uploaded diagnostic images and PDF documents are held exclusively in volatile RAM for the duration of the parsing request. No patient medical records, identifiable clinical summaries, or uploaded image buffers are ever written to persistent disk storage, external databases, or third-party training pipelines. Once the explanation payload is transmitted back to your browser session, the server-side memory buffer is immediately scrubbed and deallocated."
  },
  {
    question: "What is the difference between an educational interpretation and an actionable medical diagnosis?",
    answer: "An educational interpretation demystifies diagnostic terminology, explains biological reference ranges, highlights statistical variance, and suggests prioritized discussion topics to improve patient health literacy. In contrast, an actionable medical diagnosis requires a comprehensive physical examination, personal and family medical history review, symptom correlation, and physician clinical judgment. MedExplain AI serves solely as an educational instrument to empower doctor-patient dialogue."
  },
  {
    question: "Can this platform parse complex imaging summaries (MRI, CT Scan, Ultrasound impression sections)?",
    answer: "Yes. In addition to quantitative blood and urine laboratory panels, MedExplain AI's clinical multimodal engine can ingest and translate qualitative diagnostic radiology summaries, including the 'Findings' and 'Impression' sections of Magnetic Resonance Imaging (MRI), Computed Tomography (CT), Abdominal Ultrasound, and Chest X-Rays, explaining complex radiological terminology (e.g., 'stenosis', 'effusion', 'hypodensity', 'degenerative disc desiccation') into clear language."
  },
  {
    question: "Can MedExplain AI replace my medical doctor or diagnostic physician?",
    answer: "No, absolutely not. MedExplain AI is strictly an educational tool designed to help patients understand complex reports, terminology, reference ranges, and medicine structures. It is not an active diagnostic platform and is never a replacement for a licensed healthcare professional's clinical assessment, diagnostic reasoning, or treatment recommendations."
  },
  {
    question: "Can taking two over-the-counter medicines cause an accidental drug overdose?",
    answer: "Yes, this is an extremely common safety risk known as duplicate active ingredient toxicity. For example, acetaminophen (paracetamol) is found in hundreds of branded products (Tylenol, DayQuil, NyQuil, Excedrin, Percocet). Taking cold syrup alongside headache pills can easily exceed the safe 4,000 mg daily liver threshold. MedExplain AI specifically scans for active chemical molecules to alert you to overlapping duplicate ingredients."
  },
  {
    question: "What do doctor prescription abbreviations like PO, BID, PRN, and QHS mean?",
    answer: "These are standard Latin medical shorthand codes: 'PO' (Per Os) means orally by mouth; 'BID' (Bis In Die) means twice a day (roughly 12 hours apart); 'PRN' (Pro Re Nata) means take only as needed when symptoms appear; 'AC' means before meals, 'PC' means after meals, and 'QHS' means take at bedtime."
  },
  {
    question: "What does HbA1c measure compared to a daily fingerstick blood glucose test?",
    answer: "A standard fingerstick or fasting glucose test measures the exact sugar level in your bloodstream at that specific minute. In contrast, Hemoglobin A1c (HbA1c) measures the percentage of red blood cells coated with glucose over their 90 to 120-day natural lifespan, providing a stable 3-month panoramic view of glycemic control."
  }
];
