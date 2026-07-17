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
    question: "Can MedExplaiN AI replace my medical doctor?",
    answer: "No, absolutely not. MedExplaiN AI is strictly an educational tool designed to help patients understand complex reports, terminology, and medicine structures. It is not an active diagnostic platform and is never a replacement for a licensed healthcare professional's assessment, diagnostic reasoning, or treatment recommendations."
  },
  {
    question: "Is my personal medical data safe on this platform?",
    answer: "Yes, privacy is our highest priority. All image and report processing happens in high-security, server-side containers. Your files and base64 strings are never stored or logged in databases, and are immediately deleted upon completing the analysis request."
  },
  {
    question: "What types of documents can I upload?",
    answer: "You can upload JPEG, PNG images, and digital documents containing prescriptions, lab blood reports, urine panels, medical discharge letters, and over-the-counter medicine containers or boxes."
  },
  {
    question: "Does the AI support languages other than English?",
    answer: "Yes, we support deep translation. You can receive explanations, dosage instructions, and physician questions fully translated into Spanish, French, German, Hindi, Arabic, Chinese, and many more, with clinical terminology preserved correctly."
  },
  {
    question: "Are blood pressure and heart rate ranges standardized?",
    answer: "Yes, we use internationally recognized clinical references from sources like the AHA (American Heart Association), WHO, and NIH to label reference flags (High, Low, Normal). However, personal target levels should always be finalized by your doctor."
  }
];
