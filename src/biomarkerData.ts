export interface BiomarkerKnowledge {
  id: string;
  name: string;
  category: "CBC" | "Metabolic Panel (CMP)" | "Lipid Profile" | "Endocrine & Thyroid" | "Renal & Kidney" | "Liver Function" | "Vitamins & Minerals";
  aliases: string[];
  unit: string;
  standardRange: {
    low: number;
    high: number;
    male?: { low: number; high: number };
    female?: { low: number; high: number };
  };
  shortDescription: string;
  clinicalSignificance: string;
  causesHigh: string[];
  causesLow: string[];
  symptomsToMonitor: string[];
  doctorQuestions: string[];
}

export const BIOMARKER_DATABASE: BiomarkerKnowledge[] = [
  // --- CBC (Complete Blood Count) ---
  {
    id: "hemoglobin",
    name: "Hemoglobin (Hb)",
    category: "CBC",
    aliases: ["Hgb", "Total Hemoglobin", "Blood Hb"],
    unit: "g/dL",
    standardRange: {
      low: 12.0,
      high: 17.5,
      male: { low: 13.8, high: 17.2 },
      female: { low: 12.1, high: 15.1 }
    },
    shortDescription: "The vital iron-rich protein inside red blood cells responsible for transporting oxygen from lungs to all organs.",
    clinicalSignificance: "Crucial for aerobic cellular metabolism. Low hemoglobin indicates clinical anemia or chronic blood loss, while elevated levels may signal chronic hypoxia, sleep apnea, smoking, or polycythemia vera.",
    causesHigh: ["Chronic dehydration", "Chronic smoking / lung disease (COPD)", "High altitude adaptation", "Polycythemia vera (bone marrow overproduction)", "Congenital heart disease"],
    causesLow: ["Iron deficiency anemia", "Active bleeding (menorrhagia, ulcer, colon polyp)", "Vitamin B12 or Folate deficiency", "Chronic kidney disease (low erythropoietin)", "Bone marrow suppression"],
    symptomsToMonitor: ["Fatigue and generalized weakness", "Pale conjunctiva and nail beds", "Shortness of breath on mild exertion", "Cold hands and feet", "Dizziness or orthostatic lightheadedness"],
    doctorQuestions: [
      "Could my hemoglobin level explain my fatigue?",
      "Do I need an iron panel (ferritin, TIBC) or stool occult blood test to find the root cause?",
      "Should I take an iron supplement, and what dietary changes will boost absorption safely?"
    ]
  },
  {
    id: "wbc",
    name: "White Blood Cell Count (WBC)",
    category: "CBC",
    aliases: ["Leukocytes", "Total Leukocyte Count (TLC)", "White Cells"],
    unit: "x10³/µL",
    standardRange: { low: 4.0, high: 11.0 },
    shortDescription: "The primary cellular soldiers of the immune system defending against bacteria, viruses, fungal pathogens, and bodily inflammation.",
    clinicalSignificance: "Leukocytosis (high WBC) generally marks acute microbial infections, systemic inflammation, severe emotional or physical stress, or hematologic malignancies. Leukopenia (low WBC) leaves patients vulnerable to opportunistic infections.",
    causesHigh: ["Bacterial or viral infections", "Systemic inflammatory disorders (rheumatoid arthritis, IBD)", "Tissue damage (burns, surgery, trauma)", "Corticosteroid medication use", "Leukemia or myeloproliferative disorders"],
    causesLow: ["Viral infections (HIV, Epstein-Barr, Parvovirus)", "Autoimmune conditions (Lupus)", "Bone marrow failure or aplastic anemia", "Chemotherapy or immunosuppressant therapies", "Severe sepsis (consumption of white cells)"],
    symptomsToMonitor: ["Fever, chills, or night sweats", "Localized redness, swelling, or purulent drainage", "Sore throat or persistent cough", "Unexplained bruising or petechiae", "Persistent exhaustion"],
    doctorQuestions: [
      "Is my elevated or lowered WBC due to an active infection or medication side effect?",
      "Do I need a differential count to see which specific white cells (neutrophils, lymphocytes) are shifted?",
      "Should we repeat this complete blood count in 2 to 4 weeks to monitor trend?"
    ]
  },
  {
    id: "platelets",
    name: "Platelets (Thrombocytes)",
    category: "CBC",
    aliases: ["PLT", "Platelet Count", "Thrombocyte Count"],
    unit: "x10³/µL",
    standardRange: { low: 150, high: 450 },
    shortDescription: "Cell fragments essential for normal blood clotting, hemostasis, and wound healing.",
    clinicalSignificance: "Thrombocytopenia (low platelets) drastically increases bleeding and hemorrhagic risks. Thrombocytosis (high platelets) can predispose to vascular thrombosis or indicate reactive inflammation.",
    causesHigh: ["Reactive thrombocytosis (iron deficiency, infection, post-surgery)", "Chronic inflammation (ulcerative colitis, Crohn's)", "Essential thrombocythemia (myeloproliferative disorder)", "Splenectomy (removal of the spleen)"],
    causesLow: ["Immune thrombocytopenic purpura (ITP)", "Medication-induced (heparin, antibiotics, NSAIDs)", "Cirrhosis and portal hypertension with enlarged spleen", "B12/Folate deficiency", "Dengue or acute viral viral illnesses"],
    symptomsToMonitor: ["Easy bruising (ecchymosis)", "Pinpoint red spots on skin (petechiae)", "Prolonged bleeding from minor cuts", "Frequent nosebleeds or bleeding gums", "Heavy menstrual cycles"],
    doctorQuestions: [
      "Are my platelet levels safe for upcoming dental or surgical procedures?",
      "Could any of my current prescription medications or OTC supplements be suppressing my platelets?",
      "Do I need an ultrasound of my spleen or an autoimmune workup?"
    ]
  },
  {
    id: "hematocrit",
    name: "Hematocrit (Hct)",
    category: "CBC",
    aliases: ["Packed Cell Volume (PCV)", "Hct"],
    unit: "%",
    standardRange: {
      low: 36.0,
      high: 50.0,
      male: { low: 41.0, high: 50.0 },
      female: { low: 36.0, high: 46.0 }
    },
    shortDescription: "The percentage proportion of total whole blood volume occupied by oxygen-carrying red blood cells.",
    clinicalSignificance: "Rises in hemoconcentration and dehydration; drops in hemorrhage, dilution, or defective erythropoiesis.",
    causesHigh: ["Severe dehydration", "Chronic obstructive pulmonary disease (COPD)", "Living at high altitudes", "Sleep apnea syndrome"],
    causesLow: ["Acute or chronic blood loss", "Nutritional deficiencies (iron, B12)", "Hemolysis (breakdown of red blood cells)", "Overhydration with intravenous fluids"],
    symptomsToMonitor: ["Headaches and flushed skin (if high)", "Lethargy and poor exercise tolerance (if low)", "Cold extremities"],
    doctorQuestions: [
      "Does my hematocrit ratio indicate true red cell deficiency or dehydration?",
      "How does this relate to my hemoglobin value?"
    ]
  },

  // --- CMP (Comprehensive Metabolic Panel) ---
  {
    id: "fasting-glucose",
    name: "Fasting Blood Glucose",
    category: "Metabolic Panel (CMP)",
    aliases: ["Blood Sugar", "FBS", "Fasting Plasma Glucose"],
    unit: "mg/dL",
    standardRange: { low: 70, high: 99 },
    shortDescription: "The concentration of simple carbohydrate glucose in systemic circulation after at least 8 hours of fasting.",
    clinicalSignificance: "The cornerstone biomarker for identifying prediabetes (100–125 mg/dL) and diabetes mellitus (≥126 mg/dL on two independent tests). Hypoglycemia (<70 mg/dL) can impair brain neuroglycopenia.",
    causesHigh: ["Type 1 or Type 2 Diabetes Mellitus", "Prediabetes / Insulin Resistance", "Acute physical stress (infection, trauma, stroke)", "Corticosteroid therapy (Prednisone, Dexamethasone)", "Cushing syndrome or pancreatic dysfunction"],
    causesLow: ["Insulin or sulfonylurea overdose in diabetic treatment", "Prolonged starvation or extreme fasting", "Excessive alcohol consumption without carbohydrate intake", "Insulinoma (pancreatic neuroendocrine tumor)", "Adrenal insufficiency (Addison's disease)"],
    symptomsToMonitor: ["Excessive thirst (polydipsia)", "Frequent urination (polyuria)", "Shakiness, diaphoresis, and anxiety (hypoglycemia)", "Blurred vision", "Slow-healing wounds or cuts"],
    doctorQuestions: [
      "Do I qualify for an HbA1c test to determine my 90-day average blood sugar?",
      "Are my readings indicative of prediabetes, and what lifestyle interventions can reverse it?",
      "Should I utilize a continuous glucose monitor (CGM) or home glucometer?"
    ]
  },
  {
    id: "creatinine",
    name: "Serum Creatinine",
    category: "Renal & Kidney",
    aliases: ["Cr", "Blood Creatinine", "Serum Cr"],
    unit: "mg/dL",
    standardRange: {
      low: 0.6,
      high: 1.3,
      male: { low: 0.7, high: 1.3 },
      female: { low: 0.5, high: 1.1 }
    },
    shortDescription: "A waste byproduct of normal skeletal muscle breakdown that is filtered completely by the kidneys and excreted into urine.",
    clinicalSignificance: "The primary clinical surrogate for glomerular filtration efficiency. Rising levels directly correlate with declining kidney filtration capacity, acute kidney injury (AKI), or chronic kidney disease (CKD).",
    causesHigh: ["Dehydration and pre-renal hypoperfusion", "Chronic kidney disease (hypertensive or diabetic nephropathy)", "Nephrotoxic drugs (NSAIDs like Ibuprofen, aminoglycosides, contrast dye)", "Urinary tract obstruction (kidney stones, benign prostatic hyperplasia)", "Rhabdomyolysis (severe muscle injury or extreme crossfit exertion)"],
    causesLow: ["Very low muscle mass or sarcopenia", "Advanced liver disease (decreased creatine synthesis)", "Severe protein malnutrition", "Pregnancy (hyperfiltration)"],
    symptomsToMonitor: ["Decreased urine output or dark/foamy urine", "Swelling (edema) in ankles, feet, or under eyes", "Metallic taste in mouth or nausea", "Shortness of breath from fluid retention", "Uncontrolled hypertension"],
    doctorQuestions: [
      "What is my estimated Glomerular Filtration Rate (eGFR) calculated from this creatinine?",
      "Should I stop taking over-the-counter NSAIDs (Advil, Aleve, Ibuprofen) to safeguard my kidneys?",
      "Do we need a spot urine microalbumin-to-creatinine ratio to check for early protein leakage?"
    ]
  },
  {
    id: "egfr",
    name: "Estimated Glomerular Filtration Rate (eGFR)",
    category: "Renal & Kidney",
    aliases: ["GFR", "Estimated GFR", "CKD-EPI Rate"],
    unit: "mL/min/1.73m²",
    standardRange: { low: 60, high: 120 },
    shortDescription: "A mathematical estimate of how many milliliters of blood your kidneys' microscopic nephrons filter clean every minute.",
    clinicalSignificance: "Used worldwide to stage Chronic Kidney Disease. eGFR > 90 is normal, 60–89 is mild reduction, 30–59 is moderate reduction (Stage 3 CKD), and <15 indicates kidney failure requiring dialysis or transplant.",
    causesHigh: ["Normal young healthy physiology", "Early diabetic hyperfiltration (compensatory phase)"],
    causesLow: ["Long-standing uncontrolled hypertension", "Diabetic nephropathy", "Glomerulonephritis or interstitial nephritis", "Cardiorenal syndrome (heart failure)", "Vascular atherosclerosis of renal arteries"],
    symptomsToMonitor: ["Peripheral edema and leg heaviness", "Changes in urinary frequency at night (nocturia)", "Fatigue and cognitive fog", "Pruritus (generalized itchy skin from uremic toxins)"],
    doctorQuestions: [
      "What stage of kidney function does my eGFR correspond to?",
      "Are my blood pressure and blood sugar tightly controlled to prevent further decline?",
      "Do I need to see a nephrologist for specialized kidney care?"
    ]
  },
  {
    id: "potassium",
    name: "Serum Potassium (K⁺)",
    category: "Metabolic Panel (CMP)",
    aliases: ["K", "Blood Potassium", "Electrolyte Potassium"],
    unit: "mEq/L",
    standardRange: { low: 3.5, high: 5.2 },
    shortDescription: "The vital intracellular cation responsible for resting electrical membrane potential across myocardial (heart) and nervous tissue.",
    clinicalSignificance: "Even minor deviations can trigger fatal cardiac arrhythmias. Hyperkalemia (>5.5 mEq/L) can cause peaked T-waves, heart block, or asystole. Hypokalemia (<3.5 mEq/L) causes weakness, muscle cramps, and ventricular ectopy.",
    causesHigh: ["Kidney failure (inability to excrete potassium)", "Medications: ACE inhibitors (Lisinopril), ARBs (Losartan), Spironolactone", "Hemolysis of the blood tube sample (false high)", "Excessive potassium supplements or salt substitutes"],
    causesLow: ["Diuretic use (Furosemide/Lasix, Hydrochlorothiazide)", "Prolonged vomiting or severe diarrhea", "Inadequate dietary intake", "Hyperaldosteronism"],
    symptomsToMonitor: ["Heart palpitations or skipped beats", "Severe muscle weakness or paralysis", "Muscle twitching or cramps in calves", "Nausea or abdominal cramping"],
    doctorQuestions: [
      "Could my blood pressure medication be elevating my potassium?",
      "Was my sample hemolyzed, and should we re-draw a confirmatory tube?",
      "Do I need an immediate ECG to check cardiac electrical stability?"
    ]
  },
  {
    id: "alt",
    name: "Alanine Aminotransferase (ALT)",
    category: "Liver Function",
    aliases: ["SGPT", "Serum Glutamic-Pyruvic Transaminase", "ALT Enzyme"],
    unit: "U/L",
    standardRange: { low: 7, high: 56 },
    shortDescription: "An intracellular enzyme concentrated primarily inside liver hepatocytes; leaks into blood during liver inflammation or necrosis.",
    clinicalSignificance: "The most specific standard biomarker for hepatic parenchymal injury. Elevated levels point toward viral hepatitis, metabolic dysfunction-associated steatotic liver disease (MASLD / fatty liver), medication toxicity, or alcohol injury.",
    causesHigh: ["Non-alcoholic fatty liver disease (hepatic steatosis)", "Medication-induced liver injury (Acetaminophen/Tylenol overdose, Statins)", "Viral hepatitis (Hepatitis A, B, C)", "Alcoholic liver disease", "Biliary tract obstruction"],
    causesLow: ["Generally clinically insignificant", "Severe vitamin B6 deficiency (rare)"],
    symptomsToMonitor: ["Right upper quadrant abdominal discomfort", "Jaundice (yellowing of eyes and skin)", "Dark tea-colored urine", "Pale or clay-colored stools", "Unexplained chronic fatigue"],
    doctorQuestions: [
      "Does this elevation warrant a liver abdominal ultrasound or FibroScan?",
      "Could any prescription drugs, herbs, or OTC supplements be stressing my liver?",
      "Do I need screening for viral hepatitis or metabolic fatty liver?"
    ]
  },
  {
    id: "ast",
    name: "Aspartate Aminotransferase (AST)",
    category: "Liver Function",
    aliases: ["SGOT", "Serum Glutamic-Oxaloacetic Transaminase"],
    unit: "U/L",
    standardRange: { low: 8, high: 48 },
    shortDescription: "An enzyme found in liver, cardiac muscle, skeletal muscle, and kidneys.",
    clinicalSignificance: "When both AST and ALT are elevated, calculating the AST/ALT ratio provides diagnostic clues. A ratio > 2:1 is classically associated with alcoholic liver disease, while ratio < 1 is typical of viral hepatitis or fatty liver.",
    causesHigh: ["Liver damage or acute hepatitis", "Heavy strenuous muscle workouts / rhabdomyolysis", "Myocardial infarction (heart damage)", "Alcohol-induced hepatotoxicity", "Celiac disease"],
    causesLow: ["Normal finding; clinical irrelevance"],
    symptomsToMonitor: ["Muscle aches, joint pain, abdominal fullness, dark urine"],
    doctorQuestions: [
      "Is my AST elevation originating from muscle strain or my liver?",
      "What is my AST-to-ALT ratio and what does it suggest?"
    ]
  },

  // --- Lipid Profile ---
  {
    id: "total-cholesterol",
    name: "Total Cholesterol",
    category: "Lipid Profile",
    aliases: ["Serum Cholesterol", "Total Lipids"],
    unit: "mg/dL",
    standardRange: { low: 125, high: 200 },
    shortDescription: "The aggregate measure of all sterol lipid particles carried in the bloodstream, including HDL, LDL, and VLDL fractions.",
    clinicalSignificance: "Used in clinical ASCVD risk calculators to predict 10-year probability of myocardial infarction (heart attack) and ischemic stroke.",
    causesHigh: ["Familial hypercholesterolemia (genetic mutations)", "Diets high in saturated and trans fats", "Hypothyroidism", "Cushing disease", "Sedentary lifestyle"],
    causesLow: ["Malnutrition and malabsorption", "Hyperthyroidism", "Advanced liver failure"],
    symptomsToMonitor: ["Generally completely silent (asymptomatic) until vascular plaque manifests", "Xanthelasma (cholesterol deposits around eyelids)"],
    doctorQuestions: [
      "What is my 10-year cardiovascular risk score based on this lipid profile?",
      "Would statin therapy or dietary modifications be recommended for my target profile?"
    ]
  },
  {
    id: "ldl-cholesterol",
    name: "LDL Cholesterol (Low-Density Lipoprotein)",
    category: "Lipid Profile",
    aliases: ["Bad Cholesterol", "LDL-C", "Direct LDL"],
    unit: "mg/dL",
    standardRange: { low: 0, high: 99 },
    shortDescription: "Atherogenic lipoprotein particles that penetrate the endothelial lining of arteries, oxidizing and forming atherosclerotic plaques.",
    clinicalSignificance: "The primary therapeutic target in cardiovascular risk reduction. Optimal levels are <100 mg/dL for low-risk individuals, and <70 mg/dL (or even <55 mg/dL) for those with established coronary disease or diabetes.",
    causesHigh: ["Genetic APOB or LDLR variants", "High saturated fat intake", "Diabetes and metabolic syndrome", "Low physical activity"],
    causesLow: ["Aggressive statin / PCSK9 inhibitor therapy (therapeutic goal)", "Severe chronic illness"],
    symptomsToMonitor: ["Chest tightness or angina on exertion", "Shortness of breath on stairs", "Claudication (calf pain when walking)"],
    doctorQuestions: [
      "What is my individual target LDL goal based on my personal health history?",
      "Should we measure Apolipoprotein B (ApoB) or Coronary Artery Calcium (CAC) score for deeper precision?"
    ]
  },
  {
    id: "hdl-cholesterol",
    name: "HDL Cholesterol (High-Density Lipoprotein)",
    category: "Lipid Profile",
    aliases: ["Good Cholesterol", "HDL-C", "Cardioprotective Lipoprotein"],
    unit: "mg/dL",
    standardRange: {
      low: 40,
      high: 80,
      male: { low: 40, high: 80 },
      female: { low: 50, high: 90 }
    },
    shortDescription: "Protective lipid scavenger particles that transport excess arterial cholesterol back to the liver for excretion (reverse cholesterol transport).",
    clinicalSignificance: "Higher levels are epidemiologically associated with reduced atheroma burden, while low HDL (<40 mg/dL in men, <50 mg/dL in women) is an independent risk factor for metabolic syndrome and premature heart disease.",
    causesHigh: ["Regular vigorous aerobic exercise", "Healthy monounsaturated fat diet (olive oil, avocados)", "Moderate alcohol intake (though not recommended as therapy)"],
    causesLow: ["Smoking and tobacco use", "Metabolic syndrome and insulin resistance", "Sedentary lifestyle", "High refined carbohydrate diet", "Anabolic steroid usage"],
    symptomsToMonitor: ["Asymptomatic; checked through periodic lipid panel screening"],
    doctorQuestions: [
      "What targeted cardiovascular exercises and dietary changes can raise my HDL naturally?",
      "What is my Total-to-HDL cholesterol ratio?"
    ]
  },
  {
    id: "triglycerides",
    name: "Serum Triglycerides",
    category: "Lipid Profile",
    aliases: ["TG", "Blood Triglycerides", "Fasting Lipids"],
    unit: "mg/dL",
    standardRange: { low: 0, high: 149 },
    shortDescription: "The predominant storage form of fat in the body, synthesized from surplus dietary calories, sugars, and simple starches.",
    clinicalSignificance: "Elevations (>150 mg/dL) contribute to arterial hardening and metabolic syndrome. Extreme elevations (>500–1000 mg/dL) create an emergency risk of acute necrotizing pancreatitis.",
    causesHigh: ["Excessive intake of refined sugars, alcohol, and refined carbohydrates", "Poorly controlled diabetes mellitus", "Obesity and physical inactivity", "Hypothyroidism", "Familial hypertriglyceridemia"],
    causesLow: ["Very low-fat diet", "Hyperthyroidism", "Malabsorption disorders"],
    symptomsToMonitor: ["Severe mid-epigastric abdominal pain radiating to back (sign of pancreatitis if TG > 500)", "Eruptive xanthomas (small skin bumps)"],
    doctorQuestions: [
      "If my triglycerides are elevated, does it indicate insulin resistance?",
      "Would omega-3 fatty acid supplementation (EPA/DHA) or carbohydrate reduction be beneficial?"
    ]
  },

  // --- Endocrine & Thyroid ---
  {
    id: "tsh",
    name: "Thyroid Stimulating Hormone (TSH)",
    category: "Endocrine & Thyroid",
    aliases: ["Thyrotropin", "Serum TSH", "Thyroid Panel TSH"],
    unit: "µIU/mL",
    standardRange: { low: 0.4, high: 4.5 },
    shortDescription: "Pituitary hormone that commands the thyroid gland in your neck to synthesize and release thyroid hormones (T3 and T4).",
    clinicalSignificance: "The most sensitive frontline test for thyroid disorders. Elevated TSH indicates Primary Hypothyroidism (the pituitary is shouting because the thyroid is underperforming). Suppressed TSH indicates Hyperthyroidism (the thyroid is overproducing).",
    causesHigh: ["Hashimoto's autoimmune thyroiditis", "Surgical removal or radioiodine ablation of thyroid", "Iodine deficiency", "Subclinical hypothyroidism"],
    causesLow: ["Graves' disease (autoimmune hyperthyroidism)", "Toxic multinodular goiter", "Excessive levothyroxine thyroid medication dosage", "Pituitary failure (central hypothyroidism)"],
    symptomsToMonitor: [
      "If High (Hypothyroid): Weight gain, constipation, dry brittle skin, cold intolerance, depression, brain fog",
      "If Low (Hyperthyroid): Unexplained weight loss, rapid racing heart rate (tachycardia), anxiety, heat intolerance, hand tremors"
    ],
    doctorQuestions: [
      "Should we check Free T4 and thyroid peroxidase (TPO) antibodies to verify Hashimoto's?",
      "Does my current thyroid hormone replacement dose (e.g. Levothyroxine) need micro-adjustment?",
      "Are my non-specific symptoms of fatigue and weight change linked to this result?"
    ]
  },
  {
    id: "hba1c",
    name: "Hemoglobin A1c (HbA1c)",
    category: "Endocrine & Thyroid",
    aliases: ["Glycated Hemoglobin", "A1c", "Glycohemoglobin"],
    unit: "%",
    standardRange: { low: 4.0, high: 5.6 },
    shortDescription: "Measures the percentage of red blood cell hemoglobin chemically bonded with glucose over their 90 to 120-day lifespan.",
    clinicalSignificance: "The clinical gold standard for diagnosing and managing diabetes mellitus. Normal: <5.7%. Prediabetes: 5.7%–6.4%. Diabetes: ≥6.5%. Unlike fasting glucose, it cannot be skewed by temporary meals eaten the night before.",
    causesHigh: ["Chronic hyperglycemia from Type 1 or Type 2 Diabetes", "Insulin resistance", "Metabolic syndrome", "Iron deficiency anemia (falsely prolongs RBC lifespan)"],
    causesLow: ["Hemolytic anemia (rapid red cell turnover)", "Recent heavy blood transfusion", "Hemoglobinopathies (Sickle cell, Thalassemia - requires alternative fructosamine testing)"],
    symptomsToMonitor: ["Slow healing of cuts and scrapes", "Tingling or numbness in toes and fingers (diabetic peripheral neuropathy)", "Blurry eyesight", "Frequent urinary tract or yeast infections"],
    doctorQuestions: [
      "What is my personalized HbA1c goal (e.g. <7.0% or <6.5%)?",
      "Can we create a nutrition and resistance training plan to lower this by 0.5%–1.0% in 3 months?",
      "Are medications like Metformin, GLP-1 receptor agonists, or SGLT2 inhibitors indicated for my cardiovascular protection?"
    ]
  },
  {
    id: "vitamin-d",
    name: "Vitamin D (25-Hydroxy Vitamin D)",
    category: "Vitamins & Minerals",
    aliases: ["25-OH Vitamin D", "Calcifediol", "Total 25-OH D"],
    unit: "ng/mL",
    standardRange: { low: 30, high: 100 },
    shortDescription: "The circulating precursor hormone synthesized in skin under sunlight exposure and absorbed from dietary sources.",
    clinicalSignificance: "Critical for intestinal calcium absorption, bone mineralization (preventing osteoporosis and rickets), cellular immunity, muscle power, and neuromodulation. Levels <20 ng/mL represent clinical deficiency.",
    causesHigh: ["Excessive mega-dose supplementation (Vitamin D toxicity)", "Granulomatous diseases (Sarcoidosis, Tuberculosis)"],
    causesLow: ["Inadequate sunlight exposure (indoor work, northern latitudes)", "Darker skin pigmentation reducing cutaneous synthesis", "Malabsorption (Celiac disease, Crohn's, gastric bypass)", "Chronic kidney or liver disease impeding conversion"],
    symptomsToMonitor: ["Deep bone or lower back ache", "Skeletal muscle weakness", "Frequent colds or respiratory tract infections", "Low mood or seasonal affective symptoms"],
    doctorQuestions: [
      "What daily or weekly dose of Vitamin D3 (Cholecalciferol) is appropriate for repletion?",
      "Should I take Vitamin K2 and Magnesium alongside Vitamin D to ensure calcium is directed to bone rather than arteries?",
      "When should we retest to verify my blood level has reached the 40–60 ng/mL sweet spot?"
    ]
  },
  {
    id: "vitamin-b12",
    name: "Vitamin B12 (Cobalamin)",
    category: "Vitamins & Minerals",
    aliases: ["Cyanocobalamin", "Serum B12", "Cobalamin"],
    unit: "pg/mL",
    standardRange: { low: 200, high: 900 },
    shortDescription: "Water-soluble vitamin essential for myelin sheath integrity around nerves, DNA replication, and red blood cell maturation.",
    clinicalSignificance: "Deficiency causes irreversible subacute combined spinal cord degeneration, peripheral neuropathy, and megaloblastic anemia (high MCV). Levels in the 200–300 pg/mL range are often 'gray zone' and warrant methylmalonic acid (MMA) testing.",
    causesHigh: ["High-dose B-complex supplementation", "Liver disease or myeloproliferative disorders"],
    causesLow: ["Strict vegan or vegetarian diet without supplementation", "Pernicious anemia (autoantibodies against gastric intrinsic factor)", "Atrophic gastritis or long-term acid-blocker use (Omeprazole, Pantoprazole)", "Long-term Metformin therapy", "Ileal resection or Crohn's disease"],
    symptomsToMonitor: ["Pins-and-needles tingling in hands and feet", "Memory lapses, irritability, and balance imbalance", "Smooth, sore red tongue (glossitis)", "Megaloblastic anemia fatigue"],
    doctorQuestions: [
      "Would checking Methylmalonic Acid (MMA) and Homocysteine clarify if my cellular B12 is deficient?",
      "Do I need sublingual B12 or intramuscular injections due to stomach absorption issues?",
      "Could my long-term acid reflux medicine be causing poor vitamin B12 absorption?"
    ]
  }
];

export const MEDICAL_CATEGORIES = [
  "All",
  "CBC",
  "Metabolic Panel (CMP)",
  "Lipid Profile",
  "Endocrine & Thyroid",
  "Renal & Kidney",
  "Liver Function",
  "Vitamins & Minerals"
] as const;
