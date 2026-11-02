import React, { useState } from "react";
import { BookOpen, Search, CheckCircle2 } from "lucide-react";

interface AcronymItem {
  acronym: string;
  fullName: string;
  clinicalPurpose: string;
  typicalUtility: string;
}

const ACRONYM_DATABASE: AcronymItem[] = [
  {
    acronym: "CBC",
    fullName: "Complete Blood Count",
    clinicalPurpose:
      "Comprehensive panel evaluating red blood cells, white blood cell lines, and platelets to evaluate hematologic equilibrium.",
    typicalUtility:
      "Investigating anemia, acute bacterial or viral infections, bone marrow dyscrasias, and leukemia screening."
  },
  {
    acronym: "LFT",
    fullName: "Liver Function Tests (Hepatic Panel)",
    clinicalPurpose:
      "Battery of biochemical assays measuring hepatic transaminases, bilirubin clearance, and protein synthesis (albumin).",
    typicalUtility:
      "Detecting liver injury, metabolic steatosis, viral hepatitis, biliary obstruction, and monitoring medication safety."
  },
  {
    acronym: "KFT / RFT",
    fullName: "Kidney / Renal Function Tests",
    clinicalPurpose:
      "Biochemical profile comprising serum creatinine, blood urea nitrogen (BUN), uric acid, and glomerular clearance formulas.",
    typicalUtility:
      "Assessing acute kidney injury, chronic renal disease staging, fluid-electrolyte stability, and medication dosing."
  },
  {
    acronym: "TSH",
    fullName: "Thyroid Stimulating Hormone (Thyrotropin)",
    clinicalPurpose:
      "Anterior pituitary glycoprotein hormone regulating follicular thyroid cell secretion of thyroxine (T4) and triiodothyronine (T3).",
    typicalUtility:
      "First-line screening for primary hypothyroidism (elevated) and thyrotoxicosis/hyperthyroidism (suppressed)."
  },
  {
    acronym: "HbA1c",
    fullName: "Glycated Hemoglobin A1c",
    clinicalPurpose:
      "Non-enzymatic condensation product of glucose with the N-terminal valine of the hemoglobin beta chain.",
    typicalUtility:
      "Gold standard index of average glycemic exposure across the preceding 90–120 day erythrocyte lifespan."
  },
  {
    acronym: "CRP",
    fullName: "C-Reactive Protein (hs-CRP)",
    clinicalPurpose:
      "Pentraxin family acute-phase reactant synthesized by hepatocytes in response to interleukin-6 stimulation.",
    typicalUtility:
      "High-sensitivity marker for systemic bacterial infection, occult vascular inflammation, and coronary disease risk."
  },
  {
    acronym: "ESR",
    fullName: "Erythrocyte Sedimentation Rate",
    clinicalPurpose:
      "The rate at which anticoagulated red blood cells settle in standard vertical Westergren glass tubes over 1 hour.",
    typicalUtility:
      "Indirect indicator of acute-phase reactant proteins (fibrinogen, immunoglobulins) in autoimmune and inflammatory diseases."
  },
  {
    acronym: "MCV",
    fullName: "Mean Corpuscular Volume",
    clinicalPurpose:
      "Average biological volume of an individual circulating red blood cell, expressed in femtoliters (fL).",
    typicalUtility:
      "Categorizing anemia morphology: microcytic (<80 fL: iron deficiency, thalassemia) vs macrocytic (>100 fL: B12/folate deficit)."
  },
  {
    acronym: "MCH",
    fullName: "Mean Corpuscular Hemoglobin",
    clinicalPurpose:
      "The average absolute mass of hemoglobin packed inside each individual erythrocyte, measured in picograms (pg).",
    typicalUtility:
      "Differentiating hypochromic microcytic states from normochromic forms alongside red cell indices."
  },
  {
    acronym: "RDW",
    fullName: "Red Cell Distribution Width",
    clinicalPurpose:
      "Statistical coefficient of variation or standard deviation of circulating red blood cell volumes (anisocytosis).",
    typicalUtility:
      "Distinguishing early iron deficiency (elevated RDW) from uncomplicated thalassemia trait (typically normal RDW)."
  },
  {
    acronym: "BUN",
    fullName: "Blood Urea Nitrogen",
    clinicalPurpose:
      "Concentration of nitrogen derived from urea, the principal waste product of hepatic dietary and endogenous protein breakdown.",
    typicalUtility:
      "Evaluating renal excretory integrity and hydration status via the BUN-to-creatinine ratio."
  },
  {
    acronym: "SGPT",
    fullName: "Serum Glutamic Pyruvic Transaminase (ALT)",
    clinicalPurpose:
      "Cytosolic aminotransferase enzyme predominantly concentrated in hepatic parenchymal cells.",
    typicalUtility:
      "Sensitive marker for hepatocellular necroinflammation, drug-induced liver toxicity, and non-alcoholic steatohepatitis."
  },
  {
    acronym: "SGOT",
    fullName: "Serum Glutamic Oxaloacetic Transaminase (AST)",
    clinicalPurpose:
      "Mitochondrial and cytosolic transaminase present in liver, cardiac myocardium, skeletal muscle, and kidneys.",
    typicalUtility:
      "Assessing tissue injury; an AST:ALT ratio > 2:1 is suggestive of alcoholic hepatitis or deep hepatic fibrosis."
  },
  {
    acronym: "ALP",
    fullName: "Alkaline Phosphatase",
    clinicalPurpose:
      "Zinc metalloenzyme cleaving phosphate groups under basic conditions, present in biliary canalicular membranes and osteoblasts.",
    typicalUtility:
      "Investigating biliary stasis (cholestasis, cholelithiasis) and high bone-turnover states (Paget's disease, osteomalacia)."
  },
  {
    acronym: "HDL",
    fullName: "High-Density Lipoprotein Cholesterol",
    clinicalPurpose:
      "Dense, apolipoprotein A-I rich lipoprotein responsible for reverse cholesterol transport from vascular beds to the liver.",
    typicalUtility:
      "Evaluating anti-atherogenic cardiovascular protection; higher levels correlate with reduced ischemic heart risk."
  },
  {
    acronym: "LDL",
    fullName: "Low-Density Lipoprotein Cholesterol",
    clinicalPurpose:
      "Apolipoprotein B-100 bearing cholesterol-rich particles prone to sub-endothelial retention and oxidation in arterial walls.",
    typicalUtility:
      "Primary therapeutic target in atherosclerotic cardiovascular disease (ASCVD) risk stratification and statin management."
  },
  {
    acronym: "VLDL",
    fullName: "Very Low-Density Lipoprotein",
    clinicalPurpose:
      "Hepatically secreted lipoprotein particle rich in endogenous triglycerides and apolipoprotein C/E.",
    typicalUtility:
      "Marker of atherogenic remnant lipoproteins, metabolic syndrome, insulin resistance, and pancreatitis risk."
  },
  {
    acronym: "eGFR",
    fullName: "Estimated Glomerular Filtration Rate",
    clinicalPurpose:
      "Mathematical index calculating milliliters of blood filtered across glomerular capillaries per minute per 1.73 m² BSA.",
    typicalUtility:
      "Staging chronic kidney disease (CKD Stages 1 through 5) and adjusting renal medication dosages."
  },
  {
    acronym: "PT / INR",
    fullName: "Prothrombin Time / International Normalized Ratio",
    clinicalPurpose:
      "Standardized assay assessing the extrinsic and common pathways of blood coagulation factor kinetics (Factors I, II, V, VII, X).",
    typicalUtility:
      "Monitoring warfarin vitamin K antagonist therapy, screening for hepatic coagulopathy, and preoperative clotting checks."
  },
  {
    acronym: "Ferritin",
    fullName: "Serum Ferritin (Iron Storage Protein)",
    clinicalPurpose:
      "Spherical intracellular iron storage protein complex whose circulating concentration reflects total body iron reserves.",
    typicalUtility:
      "Diagnosing iron deficiency anemia (levels < 30 ng/mL) versus iron overload syndromes (hemochromatosis) and inflammation."
  }
];

export default function ClinicalAcronymsIndex() {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = ACRONYM_DATABASE.filter(
    (item) =>
      item.acronym.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.clinicalPurpose.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section
      id="acronym-index"
      aria-label="Common Clinical Acronyms Reference Index"
      className="w-full max-w-6xl mx-auto my-16 px-4"
    >
      <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl p-6 sm:p-10 text-white">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-teal-500/10 text-teal-400 border border-teal-500/20 mb-3">
              <BookOpen className="w-3.5 h-3.5 text-teal-400" />
              TOPICAL AUTHORITY EXPLOIT • 20 CRITICAL LAB ABBREVIATIONS
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
              The Common Clinical Acronyms Index
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-3xl leading-relaxed">
              Medical reports are saturated with dense laboratory abbreviations that create unnecessary anxiety. Review these 20 high-frequency clinical acronyms with their expanded biological roles and diagnostic utility.
            </p>
          </div>

          {/* Quick Acronym Search */}
          <div className="w-full md:w-72">
            <label htmlFor="acronym-search-input" className="sr-only">
              Search Acronym Index
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="acronym-search-input"
                type="text"
                placeholder="Filter acronyms (e.g. eGFR, HbA1c)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-slate-800/80 text-white placeholder-slate-400"
              />
            </div>
          </div>
        </div>

        {/* 2-Column Crawlable Reference Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item, idx) => (
            <article
              key={item.acronym}
              className="bg-slate-800/60 rounded-2xl border border-slate-700/70 p-5 hover:border-teal-500/50 hover:bg-slate-800/90 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl font-extrabold text-teal-400 font-mono tracking-wide">
                      {item.acronym}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      #{idx + 1}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                    Clinical Standard
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-200 mb-2">
                  {item.fullName}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed mb-3">
                  <strong className="text-slate-300 font-semibold">Physiological Mechanism: </strong>
                  {item.clinicalPurpose}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-700/50 text-xs text-teal-300/90 flex items-start gap-1.5 bg-teal-950/20 -mx-2 -mb-2 p-2.5 rounded-xl border border-teal-800/30">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong className="text-teal-200 font-semibold">Diagnostic Utility: </strong>
                  {item.typicalUtility}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
