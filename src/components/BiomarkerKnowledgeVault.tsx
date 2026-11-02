import React, { useState } from "react";
import {
  Activity,
  Droplet,
  Flame,
  Dna,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Search,
  CheckCircle,
  HelpCircle,
  AlertTriangle
} from "lucide-react";

interface VaultBiomarker {
  name: string;
  code: string;
  interval: string;
  causesDeviation: string;
  questionsToAsk: string[];
}

interface VaultPanel {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  biomarkers: VaultBiomarker[];
}

const VAULT_PANELS: VaultPanel[] = [
  {
    id: "panel-a",
    title: "Panel A: Hematology & Cell Kinetics",
    subtitle: "Circulating cellular elements, erythroid kinetics, leukocyte defense, and inflammatory sedimentation",
    icon: "Activity",
    biomarkers: [
      {
        name: "Hemoglobin",
        code: "Hb / Hgb",
        interval: "Adult Males: 13.8 – 17.2 g/dL | Adult Females: 12.1 – 15.1 g/dL",
        causesDeviation:
          "Low (Anemia): Iron deficiency, active blood loss, chronic kidney disease (erythropoietin deficit), hemoglobinopathies (thalassemia), bone marrow aplasia. High (Polycythemia): Severe dehydration, chronic obstructive pulmonary disease (COPD), high altitude residence, smoking-related hypoxemia, polycythemia vera.",
        questionsToAsk: [
          "Could my current fatigue, cold intolerance, or exertion breathlessness be attributed to this hemoglobin level?",
          "Do you recommend checking serum ferritin, iron saturation, or vitamin B12 to differentiate the underlying etiology?",
          "Should we recheck this following therapeutic dietary modification or iron supplementation in 8 to 12 weeks?"
        ]
      },
      {
        name: "Platelets (Thrombocytes)",
        code: "PLT",
        interval: "150,000 – 450,000 /µL (150 – 450 ×10³/µL)",
        causesDeviation:
          "Low (Thrombocytopenia): Viral infections (Dengue, Epstein-Barr, HIV), immune thrombocytopenic purpura (ITP), drug-induced marrow toxicity, hypersplenism, liver cirrhosis. High (Thrombocytosis): Reactive response to acute systemic infection, iron deficiency anemia, occult tissue inflammation, post-splenectomy, essential thrombocythemia.",
        questionsToAsk: [
          "Does my platelet count put me at risk of spontaneous bruising, gingival bleeding, or microvascular thrombosis?",
          "Is this drop temporary post-viral marrow suppression, or does it require an autoimmune workup?",
          "Are any of my current over-the-counter NSAIDs (ibuprofen, aspirin) contraindicated at this platelet tier?"
        ]
      },
      {
        name: "Total Leukocyte Count (White Blood Cells)",
        code: "TLC / WBC",
        interval: "4,000 – 11,000 /µL (4.0 – 11.0 ×10³/µL)",
        causesDeviation:
          "High (Leukocytosis): Pyogenic bacterial infection, systemic tissue trauma, burns, acute physical/emotional stress, corticosteroid therapy, leukemoid reactions. Low (Leukopenia): Severe overwhelming sepsis, viral infections (influenza, viral hepatitis), autoimmune disorders (systemic lupus erythematosus), cytotoxic chemotherapy, bone marrow exhaustion.",
        questionsToAsk: [
          "Does the white cell count indicate an acute bacterial pathology needing targeted intervention, or viral defense?",
          "What does my differential count (neutrophils vs. lymphocytes) show regarding the immune response stage?",
          "Should we perform repeat testing once acute clinical symptoms resolve?"
        ]
      },
      {
        name: "Absolute Neutrophil Count",
        code: "ANC",
        interval: "1,500 – 8,000 /µL (1.5 – 8.0 ×10³/µL)",
        causesDeviation:
          "Low (Neutropenia): Severe drug-induced agranulocytosis, post-chemotherapy nadir, aplastic anemia, myelodysplasia, severe viral syndromes. Critical threshold is < 500/µL (febrile neutropenia risk). High (Neutrophilia): Acute bacterial infections, myocardial infarction, acute gouty arthritis, acute tissue necrosis.",
        questionsToAsk: [
          "Is my absolute neutrophil count adequate to safeguard against opportunistic bacterial pathogens?",
          "Do I need to follow neutropenic dietary or hygiene precautions while this count recovers?",
          "Could any maintenance prescription I am taking be suppressing neutrophil maturation in the bone marrow?"
        ]
      },
      {
        name: "Erythrocyte Sedimentation Rate",
        code: "ESR (Westergren)",
        interval: "Men (<50 yrs): 0 – 15 mm/hr | Women (<50 yrs): 0 – 20 mm/hr",
        causesDeviation:
          "High (Elevated Sed Rate): Systemic inflammation, rheumatoid arthritis, polymyalgia rheumatica, giant cell arteritis, chronic bacterial infections (osteomyelitis, tuberculosis), paraproteinemias (multiple myeloma). Low: Polycythemia, extreme leukocytosis, sickle cell disease, congestive heart failure.",
        questionsToAsk: [
          "Does my elevated sed rate warrant an autoimmune serology screen (ANA, Rheumatoid Factor, anti-CCP)?",
          "Is this sedimentation rate consistent with a transient post-infectious inflammatory response?",
          "Would a high-sensitivity CRP (hs-CRP) provide a more kinetic follow-up of inflammation resolution?"
        ]
      }
    ]
  },
  {
    id: "panel-b",
    title: "Panel B: Renal Function & Electrolytes",
    subtitle: "Glomerular filtration clearance, nitrogenous waste elimination, and electrolyte balance",
    icon: "Droplet",
    biomarkers: [
      {
        name: "Serum Creatinine",
        code: "Cr / SCr",
        interval: "Adult Men: 0.74 – 1.35 mg/dL | Adult Women: 0.59 – 1.04 mg/dL",
        causesDeviation:
          "High: Reduced glomerular clearance, acute kidney injury (AKI), chronic kidney disease (CKD), rhabdomyolysis, severe volume contraction/dehydration, high dietary cooked meat or creatine supplementation. Low: Severe skeletal muscle wasting, malnutrition, advanced hepatic parenchymal disease.",
        questionsToAsk: [
          "Is this creatinine rise indicative of temporary dehydration or parenchymal renal tissue injury?",
          "Do any of my prescribed medications (ACE inhibitors, ARBs, diuretics, or NSAIDs) need dose titrations?",
          "Should we confirm this measurement with a repeat sample and a 24-hour urine protein or spot albumin-to-creatinine ratio?"
        ]
      },
      {
        name: "Blood Urea Nitrogen",
        code: "BUN",
        interval: "7 – 20 mg/dL (2.5 – 7.1 mmol/L)",
        causesDeviation:
          "High (Azotemia): Prerenal azotemia (dehydration, congestive heart failure, upper GI bleeding, high protein diet), renal parenchymal failure, urinary tract obstruction. High BUN-to-Creatinine ratio (>20:1) strongly suggests prerenal volume deficit. Low: Severe hepatic failure, low protein diet, overhydration.",
        questionsToAsk: [
          "Does the ratio between my BUN and creatinine suggest that simple oral rehydration could normalize my numbers?",
          "Are my dietary protein consumption habits contributing to this elevated urea concentration?",
          "Does this require an abdominal ultrasound to rule out post-renal urinary outflow obstruction?"
        ]
      },
      {
        name: "Estimated Glomerular Filtration Rate",
        code: "eGFR (CKD-EPI equation)",
        interval: "> 90 mL/min/1.73 m² (Normal baseline filtration)",
        causesDeviation:
          "Decreased: 60–89 indicates mildly decreased function; 30–59 indicates moderate reduction (CKD Stage 3); 15–29 indicates severe loss (CKD Stage 4); < 15 indicates kidney failure (CKD Stage 5). Driven by long-standing diabetic nephropathy, hypertensive vascular injury, glomerulonephritis, and recurrent pyelonephritis.",
        questionsToAsk: [
          "Based on my age and persistent eGFR trends, what stage of kidney function does this represent?",
          "What are my targeted blood pressure and glycemic goals to preserve remaining renal filtration reserve?",
          "Should I consult a board-certified nephrologist for specialized tubular and glomerular assessment?"
        ]
      },
      {
        name: "Sodium / Potassium Electrolyte Dynamic",
        code: "Na⁺ / K⁺ Ratio",
        interval: "Serum Na: 135 – 145 mEq/L | Serum K: 3.5 – 5.0 mEq/L",
        causesDeviation:
          "Hyponatremia (<135): SIADH, thiazide diuretics, heart failure, polydipsia. Hyperkalemia (>5.0): Impaired renal excretion, potassium-sparing diuretics, ACEi/ARBs, cellular lysis; carries urgent cardiac dysrhythmia risks. Hypokalemia (<3.5): Loop diuretics, severe vomiting/diarrhea, alkalosis; provokes muscle weakness and QT prolongation.",
        questionsToAsk: [
          "Are my electrolyte levels safe from precipitating cardiac conduction delays or neuromuscular irritability?",
          "Should we perform an electrocardiogram (ECG) to inspect T-wave configuration given this potassium level?",
          "Do my blood pressure medications require potassium supplement adjustments?"
        ]
      }
    ]
  },
  {
    id: "panel-c",
    title: "Panel C: Hepatic & Metabolic Profile",
    subtitle: "Hepatocellular integrity, microsomal detoxification, cholestatic clearance, and biliary enzymes",
    icon: "Flame",
    biomarkers: [
      {
        name: "Bilirubin (Direct & Total)",
        code: "TBIL / DBIL",
        interval: "Total Bilirubin: 0.2 – 1.2 mg/dL | Direct (Conjugated): 0.0 – 0.3 mg/dL",
        causesDeviation:
          "Elevated Unconjugated (Indirect): Accelerated hemolysis (hemolytic anemia), Gilbert syndrome (benign glucuronosyltransferase deficiency provoked by fasting or stress). Elevated Conjugated (Direct): Biliary duct stones (choledocholithiasis), pancreatic head mass, viral hepatitis, drug-induced cholestasis, primary biliary cholangitis.",
        questionsToAsk: [
          "Is the bilirubin elevation predominantly indirect (suggesting hemolysis or Gilbert syndrome) or direct (biliary duct obstruction)?",
          "Do you recommend a right-upper-quadrant abdominal ultrasound to visualize the gallbladder and bile ducts?",
          "Are there any visible signs of scleral icterus or jaundice I should monitor at home?"
        ]
      },
      {
        name: "SGPT / ALT (Alanine Aminotransferase)",
        code: "ALT / SGPT",
        interval: "7 – 56 U/L (Male reference often up to 45 U/L; Females up to 34 U/L)",
        causesDeviation:
          "Elevated: Metabolic dysfunction-associated steatotic liver disease (MASLD / fatty liver), acute viral hepatitis (A, B, C, E), acetaminophen or statin hepatotoxicity, alcohol-related liver injury, ischemic hepatitis ('shock liver'). ALT is highly concentrated in liver parenchymal hepatocytes.",
        questionsToAsk: [
          "Does this ALT level indicate reversible hepatic fat accumulation or active inflammatory steatohepatitis?",
          "Should I temporarily pause or adjust the dosages of any hepatically metabolized medications or statins?",
          "Would a comprehensive viral hepatitis panel (HBsAg, Anti-HCV) be appropriate for definitive exclusion?"
        ]
      },
      {
        name: "SGOT / AST (Aspartate Aminotransferase)",
        code: "AST / SGOT",
        interval: "8 – 48 U/L",
        causesDeviation:
          "Elevated: Alcoholic liver disease (where AST:ALT ratio frequently exceeds 2:1), acute hepatic injury, acute coronary syndromes, strenuous unaccustomed weightlifting, skeletal muscle trauma, rhabdomyolysis. Present in cardiac muscle, skeletal muscle, brain, and liver.",
        questionsToAsk: [
          "How does the AST to ALT ratio help explain whether this is coming from muscular exertion or liver stress?",
          "Could my recent intense workouts or muscular soreness have temporarily influenced this AST elevation?",
          "Do we need a serum creatine kinase (CK) to rule out skeletal muscle origin?"
        ]
      },
      {
        name: "Alkaline Phosphatase",
        code: "ALP",
        interval: "44 – 147 U/L (Higher in growing adolescents and pregnant women)",
        causesDeviation:
          "Elevated: Extrahepatic or intrahepatic biliary obstruction, primary sclerosing cholangitis, bone diseases with high osteoblastic turnover (Paget's disease of bone, osteomalacia, healing fractures, bony metastases), third-trimester placental production. Low: Hypophosphatasia, severe zinc deficiency, severe malnutrition.",
        questionsToAsk: [
          "Should we order a Gamma-Glutamyl Transferase (GGT) test to confirm whether the ALP elevation is hepatic or bone in origin?",
          "Does this suggest any biliary duct stagnation or gallstone presence?",
          "If the GGT is normal, should we examine bone mineral density or bone turnover markers?"
        ]
      }
    ]
  },
  {
    id: "panel-d",
    title: "Panel D: Endocrine & Glycemic Indices",
    subtitle: "Pancreatic islet beta-cell dynamics, sustained erythrocyte glycation, and pituitary-thyroid axes",
    icon: "Dna",
    biomarkers: [
      {
        name: "Fasting Blood Glucose",
        code: "FBG",
        interval: "Normal: 70 – 99 mg/dL | Impaired (Prediabetes): 100 – 125 mg/dL | Diabetes: ≥ 126 mg/dL",
        causesDeviation:
          "High: Insulin resistance, pancreatic beta-cell dysfunction, Cushing syndrome, hypercortisolemia, acute physiological stress, high-dose corticosteroid treatment. Low (<70): Insulin overdose, sulfonylurea therapy, insulinoma, Addisonian crisis, prolonged starvation, alcohol ingestion without carbohydrates.",
        questionsToAsk: [
          "Did I meet strict 8 to 12 hour fasting conditions prior to blood draw, or should this be repeated?",
          "Does this fasting level place me in the prediabetes category, and what nutritional changes are prioritized?",
          "Would continuous glucose monitoring (CGM) or an oral glucose tolerance test (OGTT) be beneficial?"
        ]
      },
      {
        name: "Hemoglobin A1c (Glycated Hemoglobin)",
        code: "HbA1c",
        interval: "Normal: < 5.7% | Prediabetes: 5.7% – 6.4% | Diabetes Mellitus: ≥ 6.5%",
        causesDeviation:
          "High: Chronic sustained hyperglycemia reflecting average blood glucose levels across the preceding 90–120 days through irreversible non-enzymatic glycation of hemoglobin beta chains. False decreases: Hemolytic anemia, recent blood transfusion, high-dose erythropoietin. False increases: Iron-deficiency anemia (prolonged erythrocyte survival).",
        questionsToAsk: [
          "What is my estimated average glucose (eAG) in mg/dL corresponding to this HbA1c percentage?",
          "What is our realistic 3-month target HbA1c goal to prevent microvascular and macrovascular complications?",
          "Could any red blood cell survival variations (such as anemia or hemoglobinopathy) be skewing this percentage?"
        ]
      },
      {
        name: "Thyroid Stimulating Hormone",
        code: "TSH (3rd Generation)",
        interval: "0.40 – 4.50 mIU/L (Optimal functional ranges often cited as 0.5 – 2.5 mIU/L)",
        causesDeviation:
          "High (Hypothyroidism): Primary thyroid failure (Hashimoto's thyroiditis), subacute thyroiditis recovery phase, iodine deficiency, subtherapeutic levothyroxine dose. Low (Hyperthyroidism): Graves' disease, toxic multinodular goiter, thyroiditis release phase, overreplacement with exogenous levothyroxine, secondary hypopituitarism.",
        questionsToAsk: [
          "Does this TSH level indicate subclinical hypothyroidism requiring thyroid hormone replacement?",
          "Should we measure Free T4, Free T3, and anti-TPO antibodies to assess for autoimmune thyroiditis?",
          "How might my thyroid status be influencing my lipid panel, resting metabolic rate, and weight management?"
        ]
      },
      {
        name: "Free Triiodothyronine & Free Thyroxine",
        code: "Free T3 & Free T4",
        interval: "Free T4: 0.8 – 1.8 ng/dL | Free T3: 2.3 – 4.2 pg/mL",
        causesDeviation:
          "Elevated: Overt thyrotoxicosis, toxic adenoma, amiodarone-induced thyrotoxicosis. Decreased: Overt myxedema/hypothyroidism, severe non-thyroidal illness ('euthyroid sick syndrome' where T3 falls due to impaired peripheral 5'-deiodinase conversion).",
        questionsToAsk: [
          "Are my active circulating thyroid hormone fractions harmonized with my pituitary TSH signal?",
          "Does my Free T3 level show adequate peripheral conversion from T4?",
          "Do any morning supplements (calcium, iron, biotin) interfere with thyroid hormone testing or absorption?"
        ]
      }
    ]
  }
];

export default function BiomarkerKnowledgeVault() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedBiomarker, setExpandedBiomarker] = useState<string | null>("panel-a-0");

  const filteredPanels = VAULT_PANELS.map((panel) => {
    const matchingBiomarkers = panel.biomarkers.filter(
      (b) =>
        b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.causesDeviation.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return { ...panel, biomarkers: matchingBiomarkers };
  }).filter((panel) => panel.biomarkers.length > 0);

  return (
    <section
      id="biomarker-vault"
      aria-label="The Biomarker Knowledge Vault"
      className="w-full max-w-6xl mx-auto my-16 px-4"
    >
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden p-6 sm:p-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-teal-50 text-teal-700 border border-teal-200 mb-3">
              <Activity className="w-3.5 h-3.5 text-teal-600" />
              CLINICAL TAXONOMY & REFERENCE INTERVAL MATRIX
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              The Biomarker Knowledge Vault
            </h2>
            <p className="text-base text-slate-600 mt-2 max-w-3xl leading-relaxed">
              Explore exhaustive, crawlable clinical reference guides across 4 foundational diagnostic panels. Cross-check your reported figures against biological standards, underlying pathophysiological drivers, and physician questions.
            </p>
          </div>

          {/* Quick Search */}
          <div className="w-full md:w-72">
            <label htmlFor="vault-search-input" className="sr-only">
              Search Biomarker Vault
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="vault-search-input"
                type="text"
                placeholder="Search biomarker or code (e.g. ALT, Hb, ESR)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50/50"
              />
            </div>
          </div>
        </div>

        {/* Panels Matrix */}
        <div className="mt-8 space-y-10">
          {filteredPanels.map((panel) => (
            <div key={panel.id} className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-xl bg-slate-900 text-teal-400 font-mono text-sm">
                  {panel.id.toUpperCase().replace("-", " ")}
                </span>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {panel.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500">
                    {panel.subtitle}
                  </p>
                </div>
              </div>

              {/* Biomarkers in this panel */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {panel.biomarkers.map((biomarker, idx) => {
                  const itemKey = `${panel.id}-${idx}`;
                  const isExpanded = expandedBiomarker === itemKey;

                  return (
                    <article
                      key={itemKey}
                      className={`rounded-2xl border transition-all p-5 flex flex-col justify-between ${
                        isExpanded
                          ? "bg-slate-50/80 border-teal-500/40 shadow-md ring-1 ring-teal-500/20"
                          : "bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-sm"
                      }`}
                    >
                      <div>
                        {/* Title & Badge */}
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div>
                            <h4 className="text-lg font-bold text-slate-900 tracking-tight">
                              {biomarker.name}
                            </h4>
                            <span className="inline-block text-xs font-mono font-bold text-teal-700 bg-teal-100/70 px-2 py-0.5 rounded border border-teal-200/60 mt-1">
                              {biomarker.code}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              setExpandedBiomarker(isExpanded ? null : itemKey)
                            }
                            aria-expanded={isExpanded}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                            aria-label={`Toggle details for ${biomarker.name}`}
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-5 h-5" />
                            ) : (
                              <ChevronDown className="w-5 h-5" />
                            )}
                          </button>
                        </div>

                        {/* Reference Interval */}
                        <div className="mt-2.5 p-3 rounded-xl bg-slate-100/80 border border-slate-200/60 text-xs">
                          <span className="font-semibold text-slate-700 block mb-0.5">
                            Standard Reference Interval:
                          </span>
                          <span className="font-mono text-slate-900 font-medium">
                            {biomarker.interval}
                          </span>
                        </div>

                        {/* Causes of Deviation */}
                        <div className="mt-3 text-xs leading-relaxed text-slate-600">
                          <span className="font-semibold text-slate-900 block mb-1">
                            Common Causes for Pathophysiological Deviation:
                          </span>
                          <p>{biomarker.causesDeviation}</p>
                        </div>
                      </div>

                      {/* Expandable Doctor Questions */}
                      <div className="mt-4 pt-3 border-t border-slate-200/60">
                        {isExpanded ? (
                          <div className="space-y-2">
                            <span className="text-xs font-bold text-teal-800 flex items-center gap-1.5 uppercase tracking-wide">
                              <HelpCircle className="w-3.5 h-3.5" />
                              Prioritized Questions for Your Doctor:
                            </span>
                            <ul className="space-y-1.5 text-xs text-slate-700">
                              {biomarker.questionsToAsk.map((q, qIdx) => (
                                <li
                                  key={qIdx}
                                  className="flex items-start gap-2 bg-white p-2 rounded-lg border border-slate-200"
                                >
                                  <span className="text-teal-600 font-bold font-mono">
                                    Q{qIdx + 1}:
                                  </span>
                                  <span>{q}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setExpandedBiomarker(itemKey)}
                            className="text-xs font-semibold text-teal-600 hover:text-teal-700 inline-flex items-center gap-1"
                          >
                            Show 3 Consultation Questions <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
