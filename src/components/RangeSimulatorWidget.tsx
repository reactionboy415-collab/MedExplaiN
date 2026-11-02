import React, { useState } from "react";
import { Sliders, AlertTriangle, CheckCircle2, AlertOctagon, ArrowDownCircle, Info, Sparkles } from "lucide-react";

export type ParameterKey = "plt" | "hb" | "fbg";

interface ParameterConfig {
  id: ParameterKey;
  name: string;
  abbreviation: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  zones: {
    criticalLow?: number;
    lowThreshold: number;
    highThreshold: number;
    criticalHigh?: number;
  };
  evaluate: (val: number) => {
    zone: "Critical Alert" | "Low" | "Normal Reference" | "Elevated";
    badgeColor: string;
    description: string;
  };
}

const PARAMETERS: Record<ParameterKey, ParameterConfig> = {
  plt: {
    id: "plt",
    name: "Platelet Count",
    abbreviation: "PLT",
    unit: "×10³/µL",
    min: 10,
    max: 750,
    step: 5,
    defaultValue: 225,
    zones: {
      criticalLow: 50,
      lowThreshold: 150,
      highThreshold: 450,
      criticalHigh: 600,
    },
    evaluate: (val: number) => {
      if (val < 50) {
        return {
          zone: "Critical Alert",
          badgeColor: "bg-rose-500/10 text-rose-500 border-rose-500/30",
          description:
            "Severe thrombocytopenia presents an urgent risk of spontaneous mucosal or microvascular hemorrhage. Platelets maintain primary hemostatic plug formation; levels under 50,000/µL require immediate clinical surveillance.",
        };
      }
      if (val < 150) {
        return {
          zone: "Low",
          badgeColor: "bg-amber-500/10 text-amber-500 border-amber-500/30",
          description:
            "Mild to moderate thrombocytopenia may reflect peripheral platelet consumption, viral suppression (such as Dengue or Epstein-Barr), or splenic sequestration. Primary vascular clot retraction remains partially functional but warrants evaluation.",
        };
      }
      if (val <= 450) {
        return {
          zone: "Normal Reference",
          badgeColor: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
          description:
            "Physiologic megakaryocyte thrombopoiesis is balanced within standard biological limits. Circulating platelets adequately sustain primary hemostasis and endothelial wall integrity without thrombotic excess.",
        };
      }
      if (val <= 600) {
        return {
          zone: "Elevated",
          badgeColor: "bg-amber-500/10 text-amber-500 border-amber-500/30",
          description:
            "Secondary or reactive thrombocytosis is commonly driven by acute-phase cytokines (IL-6), systemic infection, chronic tissue inflammation, or occult iron deficiency. The bone marrow responds adaptively to systemic stimuli.",
        };
      }
      return {
        zone: "Critical Alert",
        badgeColor: "bg-rose-500/10 text-rose-500 border-rose-500/30",
        description:
          "Marked thrombocytosis exceeding 600,000/µL elevates microvascular sludging and paradoxically increases paradoxical bleeding or thrombosis. This necessitates formal hematologic evaluation to exclude autonomous myeloproliferative neoplasms.",
      };
    },
  },
  hb: {
    id: "hb",
    name: "Hemoglobin",
    abbreviation: "Hb",
    unit: "g/dL",
    min: 4.0,
    max: 22.0,
    step: 0.1,
    defaultValue: 14.2,
    zones: {
      criticalLow: 7.0,
      lowThreshold: 12.0,
      highThreshold: 17.5,
      criticalHigh: 19.0,
    },
    evaluate: (val: number) => {
      if (val < 7.0) {
        return {
          zone: "Critical Alert",
          badgeColor: "bg-rose-500/10 text-rose-500 border-rose-500/30",
          description:
            "Severe symptomatic anemia falls beneath standard hospital transfusion alert thresholds, compromising cellular oxygen delivery to vital organs. Cardiac compensatory tachycardia and tissue hypoxia become prominent risks.",
        };
      }
      if (val < 12.0) {
        return {
          zone: "Low",
          badgeColor: "bg-amber-500/10 text-amber-500 border-amber-500/30",
          description:
            "Microcytic or normocytic anemia indicates impaired erythropoiesis, commonly linked to nutritional iron deficiency, chronic blood loss, or inflammation of chronic disease. Oxygen-carrying capacity of red blood cells is diminished.",
        };
      }
      if (val <= 17.5) {
        return {
          zone: "Normal Reference",
          badgeColor: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
          description:
            "Erythrocytic hemoglobin saturation is optimal for systemic aerobic metabolism and tissue perfusion. Renal erythropoietin feedback mechanisms are functioning in physiological equilibrium.",
        };
      }
      if (val <= 19.0) {
        return {
          zone: "Elevated",
          badgeColor: "bg-amber-500/10 text-amber-500 border-amber-500/30",
          description:
            "Erythrocytosis or hemoconcentration commonly stems from intravascular volume depletion, high-altitude acclimatization, or chronic alveolar hypoventilation. Increased red cell mass elevates whole-blood viscosity.",
        };
      }
      return {
        zone: "Critical Alert",
        badgeColor: "bg-rose-500/10 text-rose-500 border-rose-500/30",
        description:
          "Critical polycythemia sharply accelerates peripheral vascular resistance and thromboembolic hazard due to hyperviscosity syndrome. Clinical workup for polycythemia vera or secondary hypoxic drivers is indicated.",
      };
    },
  },
  fbg: {
    id: "fbg",
    name: "Fasting Blood Glucose",
    abbreviation: "FBG",
    unit: "mg/dL",
    min: 40,
    max: 350,
    step: 1,
    defaultValue: 88,
    zones: {
      criticalLow: 54,
      lowThreshold: 70,
      highThreshold: 100,
      criticalHigh: 250,
    },
    evaluate: (val: number) => {
      if (val < 54) {
        return {
          zone: "Critical Alert",
          badgeColor: "bg-rose-500/10 text-rose-500 border-rose-500/30",
          description:
            "Clinically significant Level 2 neuroglycopenia imperils central nervous system glucose metabolism. Counter-regulatory surges cause diaphoresis and tremor; urgent oral simple carbohydrates or glucagon rescue is mandated.",
        };
      }
      if (val < 70) {
        return {
          zone: "Low",
          badgeColor: "bg-amber-500/10 text-amber-500 border-amber-500/30",
          description:
            "Mild fasting hypoglycemia triggers autonomic epinephrine and glucagon secretion to mobilize hepatic glycogen stores. Symptoms can include palpitations, cold sweats, mild confusion, or lightheadedness.",
        };
      }
      if (val < 100) {
        return {
          zone: "Normal Reference",
          badgeColor: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
          description:
            "Basal pancreatic beta-cell insulin release and hepatic gluconeogenesis maintain optimal euglycemic homeostasis following an 8–12 hour fast. Peripheral insulin receptor sensitivity is preserved.",
        };
      }
      if (val <= 125) {
        return {
          zone: "Elevated",
          badgeColor: "bg-amber-500/10 text-amber-500 border-amber-500/30",
          description:
            "Impaired Fasting Glucose (prediabetes criteria) highlights emerging peripheral insulin resistance and progressive beta-cell secretory lag. Early lifestyle and dietary interventions significantly delay progression to overt diabetes.",
        };
      }
      if (val <= 250) {
        return {
          zone: "Elevated",
          badgeColor: "bg-orange-500/10 text-orange-500 border-orange-500/30",
          description:
            "Fasting hyperglycemia at or above 126 mg/dL meets clinical diagnostic criteria for diabetes mellitus upon repeated confirmatory testing. Glucotoxicity and osmotic diuresis gradually accelerate without medical management.",
        };
      }
      return {
        zone: "Critical Alert",
        badgeColor: "bg-rose-500/10 text-rose-500 border-rose-500/30",
        description:
          "Severe acute hyperglycemia risks hyperosmolar hyperglycemic state (HHS) or diabetic ketoacidosis (DKA) with profound cellular dehydration and electrolyte shifting. Immediate medical evaluation is required.",
      };
    },
  },
};

export default function RangeSimulatorWidget() {
  const [activeParam, setActiveParam] = useState<ParameterKey>("plt");
  const [values, setValues] = useState<Record<ParameterKey, number>>({
    plt: PARAMETERS.plt.defaultValue,
    hb: PARAMETERS.hb.defaultValue,
    fbg: PARAMETERS.fbg.defaultValue,
  });

  const param = PARAMETERS[activeParam];
  const currentValue = values[activeParam];
  const evalResult = param.evaluate(currentValue);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseFloat(e.target.value);
    setValues((prev) => ({ ...prev, [activeParam]: num }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val)) {
      const clamped = Math.max(param.min, Math.min(param.max, val));
      setValues((prev) => ({ ...prev, [activeParam]: clamped }));
    }
  };

  const scrollToDropzone = () => {
    const elem = document.getElementById("analyzer-workspace");
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      aria-label="Instant Lab Value Benchmark Simulator"
      className="w-full max-w-5xl mx-auto my-10 px-4"
    >
      <div className="relative rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden p-6 sm:p-8 text-white">
        {/* Glow ambient accent */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-teal-500/10 text-teal-400 border border-teal-500/20 mb-2">
                <Sliders className="w-3.5 h-3.5" />
                RETENTION HOOK • REAL-TIME BENCHMARKING
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
                Instant Lab Value Benchmark Simulator
              </h2>
              <p className="text-sm text-slate-400 mt-1 max-w-2xl">
                Test and observe real-time biological reference stratifications across standard pathology intervals before uploading your complete diagnostic panel.
              </p>
            </div>

            {/* Quick 3-Parameter Selector */}
            <div className="flex bg-slate-800/90 p-1.5 rounded-xl border border-slate-700/70 self-start md:self-auto">
              <button
                type="button"
                onClick={() => setActiveParam("plt")}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeParam === "plt"
                    ? "bg-teal-600 text-white shadow-md shadow-teal-900/40"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                }`}
              >
                Platelets (PLT)
              </button>
              <button
                type="button"
                onClick={() => setActiveParam("hb")}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeParam === "hb"
                    ? "bg-teal-600 text-white shadow-md shadow-teal-900/40"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                }`}
              >
                Hemoglobin (Hb)
              </button>
              <button
                type="button"
                onClick={() => setActiveParam("fbg")}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeParam === "fbg"
                    ? "bg-teal-600 text-white shadow-md shadow-teal-900/40"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                }`}
              >
                Fasting Glucose (FBG)
              </button>
            </div>
          </div>

          {/* Interactive Core */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Slider & Input Controls (7 cols) */}
            <div className="lg:col-span-7 bg-slate-800/60 p-5 sm:p-6 rounded-xl border border-slate-700/60 flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                    Selected Parameter
                  </span>
                  <div className="text-lg font-bold text-white flex items-center gap-2">
                    {param.name}
                    <span className="text-xs text-teal-400 font-mono bg-teal-950/60 px-2 py-0.5 rounded border border-teal-800/40">
                      {param.abbreviation}
                    </span>
                  </div>
                </div>

                {/* Direct Number Input */}
                <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700">
                  <input
                    type="number"
                    min={param.min}
                    max={param.max}
                    step={param.step}
                    value={currentValue}
                    onChange={handleInputChange}
                    className="w-20 bg-transparent text-right font-mono text-lg font-extrabold text-teal-300 focus:outline-none"
                    aria-label={`Enter ${param.name} numerical value`}
                  />
                  <span className="text-xs font-medium text-slate-400">
                    {param.unit}
                  </span>
                </div>
              </div>

              {/* Slider Input */}
              <div className="flex flex-col gap-2">
                <input
                  type="range"
                  min={param.min}
                  max={param.max}
                  step={param.step}
                  value={currentValue}
                  onChange={handleSliderChange}
                  className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-500 focus:outline-none"
                  aria-label={`Adjust ${param.name} slider`}
                />
                <div className="flex justify-between text-[11px] font-mono text-slate-400 px-1">
                  <span>Min: {param.min} {param.unit}</span>
                  <span className="text-slate-300 font-semibold">
                    Normal Reference: {param.zones.lowThreshold} – {param.zones.highThreshold} {param.unit}
                  </span>
                  <span>Max: {param.max} {param.unit}</span>
                </div>
              </div>

              {/* Quick preset buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-700/50">
                <span className="text-xs text-slate-400">Jump to:</span>
                {param.zones.criticalLow && (
                  <button
                    type="button"
                    onClick={() => setValues((p) => ({ ...p, [activeParam]: param.zones.criticalLow! - (param.step * 2) }))}
                    className="text-xs px-2.5 py-1 rounded bg-rose-950/40 text-rose-300 hover:bg-rose-900/50 border border-rose-800/40 transition-colors"
                  >
                    Critical Alert
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setValues((p) => ({ ...p, [activeParam]: (param.zones.lowThreshold + param.zones.highThreshold) / 2 }))}
                  className="text-xs px-2.5 py-1 rounded bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/50 border border-emerald-800/40 transition-colors"
                >
                  Normal Reference
                </button>
                {param.zones.criticalHigh && (
                  <button
                    type="button"
                    onClick={() => setValues((p) => ({ ...p, [activeParam]: param.zones.criticalHigh! + (param.step * 4) }))}
                    className="text-xs px-2.5 py-1 rounded bg-amber-950/40 text-amber-300 hover:bg-amber-900/50 border border-amber-800/40 transition-colors"
                  >
                    Elevated / Alert
                  </button>
                )}
              </div>
            </div>

            {/* Live Clinical Stratification Result (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between h-full bg-slate-950/80 p-5 sm:p-6 rounded-xl border border-slate-800 shadow-inner">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                    Clinical Stratification
                  </span>
                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${evalResult.badgeColor}`}
                  >
                    {evalResult.zone === "Critical Alert" && <AlertOctagon className="w-3.5 h-3.5" />}
                    {evalResult.zone === "Low" && <AlertTriangle className="w-3.5 h-3.5" />}
                    {evalResult.zone === "Normal Reference" && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {evalResult.zone === "Elevated" && <AlertTriangle className="w-3.5 h-3.5" />}
                    {evalResult.zone}
                  </div>
                </div>

                <div className="text-3xl font-black text-white tracking-tight mb-2 font-mono">
                  {currentValue} <span className="text-sm font-normal text-slate-400">{param.unit}</span>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-900/70 p-3 rounded-lg border border-slate-800">
                  {evalResult.description}
                </p>
              </div>

              {/* Dwell-Time CTA Hook */}
              <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-slate-300 font-medium">
                  Need full contextual analysis with your complete report?
                </div>
                <button
                  type="button"
                  onClick={scrollToDropzone}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-teal-500 hover:bg-teal-400 text-slate-950 transition-all shadow-md shadow-teal-500/20 whitespace-nowrap"
                >
                  <ArrowDownCircle className="w-4 h-4" />
                  Drop file below
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
