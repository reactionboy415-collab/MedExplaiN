export interface RxCode {
  code: string;
  latin: string;
  english: string;
  category: "Frequency & Timing" | "Route of Administration" | "Quantity & Dosing" | "Special Instructions";
  example: string;
  patientGuidance: string;
}

export const RX_ABBREVIATIONS: RxCode[] = [
  {
    code: "PO",
    latin: "Per os",
    english: "By mouth / Orally",
    category: "Route of Administration",
    example: "Take 1 tablet PO daily",
    patientGuidance: "Swallow the medication with water unless instructed as sublingual or chewable. Do not crush sustained-release (ER/XR) pills."
  },
  {
    code: "BID",
    latin: "Bis in die",
    english: "Twice a day",
    category: "Frequency & Timing",
    example: "Metformin 500mg PO BID",
    patientGuidance: "Take roughly 10–12 hours apart (e.g., 8:00 AM breakfast and 8:00 PM dinner) to keep blood drug concentration stable."
  },
  {
    code: "TID",
    latin: "Ter in die",
    english: "Three times a day",
    category: "Frequency & Timing",
    example: "Amoxicillin 500mg PO TID x 7 days",
    patientGuidance: "Space doses evenly every 8 hours (or morning, afternoon, and bedtime). Finish the entire course even if feeling better."
  },
  {
    code: "QID",
    latin: "Quater in die",
    english: "Four times a day",
    category: "Frequency & Timing",
    example: "Take 1 capsule PO QID",
    patientGuidance: "Take approximately every 6 hours around the clock during waking hours."
  },
  {
    code: "QD / Daily",
    latin: "Quaque die",
    english: "Once every day",
    category: "Frequency & Timing",
    example: "Lisinopril 10mg PO QD",
    patientGuidance: "Take at the exact same hour every single day to establish a steady biological rhythm and avoid missed doses."
  },
  {
    code: "QHS",
    latin: "Quaque hora somni",
    english: "Every night at bedtime",
    category: "Frequency & Timing",
    example: "Atorvastatin 20mg PO QHS",
    patientGuidance: "Take 30 minutes before sleep. Many cholesterol medications work best at night when hepatic cholesterol synthesis peaks."
  },
  {
    code: "PRN",
    latin: "Pro re nata",
    english: "As needed / when necessary",
    category: "Special Instructions",
    example: "Ibuprofen 400mg PO Q6H PRN severe pain",
    patientGuidance: "Only take when specific symptoms occur (like pain or nausea). Do NOT take routinely if symptom is absent."
  },
  {
    code: "AC",
    latin: "Ante cibum",
    english: "Before meals",
    category: "Special Instructions",
    example: "Omeprazole 20mg PO AC",
    patientGuidance: "Take 30 to 60 minutes before eating food so the medicine is properly absorbed or activates before stomach acid surges."
  },
  {
    code: "PC",
    latin: "Post cibum",
    english: "After meals",
    category: "Special Instructions",
    example: "Aspirin 81mg PO PC",
    patientGuidance: "Take after eating food or with milk to protect your stomach lining from ulcers, gastritis, and digestive upset."
  },
  {
    code: "NPO",
    latin: "Nil per os",
    english: "Nothing by mouth",
    category: "Special Instructions",
    example: "Patient NPO after midnight for blood draw / surgery",
    patientGuidance: "Do not eat or drink anything (including water, coffee, or gum) prior to your surgical anesthesia or fasting lab tests."
  },
  {
    code: "STAT",
    latin: "Statim",
    english: "Immediately / Without delay",
    category: "Frequency & Timing",
    example: "Administer 1 dose STAT",
    patientGuidance: "Urgent medication requirement needed instantly for acute symptom relief or emergency intervention."
  },
  {
    code: "SL",
    latin: "Sub lingualis",
    english: "Under the tongue",
    category: "Route of Administration",
    example: "Nitroglycerin 0.4mg SL PRN chest pain",
    patientGuidance: "Place under tongue until completely dissolved. Absorbs straight into blood vessels, bypassing liver first-pass metabolism."
  },
  {
    code: "GTT",
    latin: "Guttae",
    english: "Drops",
    category: "Quantity & Dosing",
    example: "Instill 2 GTT into right eye TID",
    patientGuidance: "Carefully instill the exact number of liquid drops into the eye or ear canal as specified by your doctor."
  },
  {
    code: "TOP",
    latin: "Topicus",
    english: "Topical / Apply to skin",
    category: "Route of Administration",
    example: "Apply thin layer TOP BID to affected rash",
    patientGuidance: "Wash and dry hands before and after applying. For external cutaneous application only."
  }
];
