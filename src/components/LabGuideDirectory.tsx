import React, { useState } from "react";
import { BIOMARKER_DATABASE, MEDICAL_CATEGORIES, BiomarkerKnowledge } from "../biomarkerData";
import { Search, Filter, Stethoscope, AlertTriangle, HelpCircle, ArrowRight, Activity, CheckCircle, Info } from "lucide-react";

interface LabGuideDirectoryProps {
  onLoadIntoAnalyzer: (biomarker: BiomarkerKnowledge, testValue?: string) => void;
}

export default function LabGuideDirectory({ onLoadIntoAnalyzer }: LabGuideDirectoryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedBiomarker, setSelectedBiomarker] = useState<BiomarkerKnowledge | null>(BIOMARKER_DATABASE[0]);
  const [simulatorValue, setSimulatorValue] = useState<string>("");

  const filteredBiomarkers = BIOMARKER_DATABASE.filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      item.name.toLowerCase().includes(query) ||
      item.shortDescription.toLowerCase().includes(query) ||
      item.aliases.some((alias) => alias.toLowerCase().includes(query)) ||
      item.category.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  const getEvaluationStatus = (item: BiomarkerKnowledge, valStr: string) => {
    const val = parseFloat(valStr);
    if (isNaN(val)) return null;

    if (val < item.standardRange.low) {
      return { status: "LOW", color: "text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800", message: `Value is below the standard biological interval (${item.standardRange.low} ${item.unit}).` };
    }
    if (val > item.standardRange.high) {
      return { status: "HIGH", color: "text-rose-600 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800", message: `Value is above the standard biological interval (${item.standardRange.high} ${item.unit}).` };
    }
    return { status: "NORMAL", color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800", message: `Value sits inside standard clinical range (${item.standardRange.low} – ${item.standardRange.high} ${item.unit}).` };
  };

  const currentEval = selectedBiomarker && simulatorValue ? getEvaluationStatus(selectedBiomarker, simulatorValue) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-3">
          <Activity className="w-3.5 h-3.5" />
          <span>Clinical Reference Library & Diagnostic Directory</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight">
          Blood Lab Biomarkers & Reference Interval Directory
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-3 text-sm sm:text-base leading-relaxed">
          Search over 50 essential laboratory tests across Complete Blood Count (CBC), Comprehensive Metabolic Panels (CMP), Lipid Profiles, Kidney, and Liver metrics. Review normal ranges, understand causes of high/low readings, and prepare questions for your doctor.
        </p>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by test name, acronym (e.g. TSH, ALT, HbA1c, eGFR)..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 placeholder-slate-400"
            />
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Showing <strong className="text-slate-900 dark:text-white">{filteredBiomarkers.length}</strong> clinical biomarkers
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
          {MEDICAL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Biomarker Cards List */}
        <div className="lg:col-span-5 space-y-3 max-h-[820px] overflow-y-auto pr-2">
          {filteredBiomarkers.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 dark:bg-slate-900/30 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500">
              No matching biomarkers found. Try searching by generic acronym like "CBC", "Glucose", or "Potassium".
            </div>
          ) : (
            filteredBiomarkers.map((item) => {
              const isSelected = selectedBiomarker?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedBiomarker(item);
                    setSimulatorValue("");
                  }}
                  className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? "bg-blue-50/70 dark:bg-blue-950/40 border-blue-500 shadow-sm"
                      : "bg-white dark:bg-slate-950 border-slate-200/70 dark:border-slate-800/80 hover:border-blue-300 dark:hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-100/60 dark:bg-blue-950/80 px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                        {item.name}
                      </h3>
                    </div>
                    <div className="text-right text-xs">
                      <span className="text-slate-400 block text-[10px]">Reference</span>
                      <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                        {item.standardRange.low} – {item.standardRange.high} {item.unit}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {item.shortDescription}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-900">
                    <span>Aliases: {item.aliases.join(", ")}</span>
                    <span className="text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1">
                      View Clinical Guide <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Deep Encyclopedic Inspector + Interactive Gauge Simulator */}
        <div className="lg:col-span-7">
          {selectedBiomarker ? (
            <div className="bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-900">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    {selectedBiomarker.category}
                  </span>
                  <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                    {selectedBiomarker.name}
                  </h2>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {selectedBiomarker.aliases.map((alias) => (
                      <span key={alias} className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-mono">
                        {alias}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => onLoadIntoAnalyzer(selectedBiomarker, simulatorValue || String(selectedBiomarker.standardRange.high * 1.1))}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow transition-all cursor-pointer whitespace-nowrap"
                >
                  <Stethoscope className="w-4 h-4" />
                  Load into AI Analyzer
                </button>
              </div>

              {/* Interactive Value Evaluator Widget */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-blue-500" />
                    Interactive Result Simulator
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    Normal Range: <strong>{selectedBiomarker.standardRange.low} – {selectedBiomarker.standardRange.high} {selectedBiomarker.unit}</strong>
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <div className="relative flex-1 w-full">
                    <input
                      type="number"
                      step="any"
                      value={simulatorValue}
                      onChange={(e) => setSimulatorValue(e.target.value)}
                      placeholder={`Enter your lab reading (e.g. ${(selectedBiomarker.standardRange.high * 1.05).toFixed(1)})...`}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                    />
                    <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">
                      {selectedBiomarker.unit}
                    </span>
                  </div>

                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => setSimulatorValue(String(selectedBiomarker.standardRange.low * 0.85))}
                      className="flex-1 sm:flex-none px-2.5 py-2 text-[11px] font-semibold rounded-lg bg-amber-100/70 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 hover:bg-amber-200"
                    >
                      Try Low
                    </button>
                    <button
                      onClick={() => setSimulatorValue(String((selectedBiomarker.standardRange.low + selectedBiomarker.standardRange.high) / 2))}
                      className="flex-1 sm:flex-none px-2.5 py-2 text-[11px] font-semibold rounded-lg bg-emerald-100/70 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-200"
                    >
                      Try Normal
                    </button>
                    <button
                      onClick={() => setSimulatorValue(String(selectedBiomarker.standardRange.high * 1.25))}
                      className="flex-1 sm:flex-none px-2.5 py-2 text-[11px] font-semibold rounded-lg bg-rose-100/70 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 hover:bg-rose-200"
                    >
                      Try High
                    </button>
                  </div>
                </div>

                {/* Instant Evaluation Feedback */}
                {currentEval && (
                  <div className={`p-3 rounded-xl border flex items-center justify-between text-xs font-medium ${currentEval.color}`}>
                    <div className="flex items-center gap-2">
                      {currentEval.status === "NORMAL" ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                      )}
                      <span>
                        Status: <strong>{currentEval.status}</strong> — {currentEval.message}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Clinical Significance */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
                  Clinical Significance & Purpose
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {selectedBiomarker.clinicalSignificance}
                </p>
              </div>

              {/* Two-Column Causes Grid: High vs Low */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Potential Causes of High Levels
                  </h4>
                  <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5 list-disc pl-4">
                    {selectedBiomarker.causesHigh.map((cause, idx) => (
                      <li key={idx}>{cause}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5" />
                    Potential Causes of Low Levels
                  </h4>
                  <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5 list-disc pl-4">
                    {selectedBiomarker.causesLow.map((cause, idx) => (
                      <li key={idx}>{cause}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Symptoms to Monitor */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Symptoms & Physical Signs to Monitor
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedBiomarker.symptomsToMonitor.map((symp, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-medium">
                      {symp}
                    </span>
                  ))}
                </div>
              </div>

              {/* Doctor Questions Checklist */}
              <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5" />
                  Key Questions to Ask Your Doctor About This Result
                </h4>
                <ol className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5 list-decimal pl-4">
                  {selectedBiomarker.doctorQuestions.map((q, idx) => (
                    <li key={idx} className="leading-relaxed">{q}</li>
                  ))}
                </ol>
              </div>

              {/* Disclaimer */}
              <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed border-t border-slate-100 dark:border-slate-900 pt-4">
                * Note: Reference ranges can fluctuate slightly between different clinical laboratories (e.g., Quest, Labcorp, Mayo Clinic) depending on calibration instruments and reagent batches. Always refer to the reference interval printed on your specific laboratory paper.
              </p>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400">
              Select any biomarker from the list to view comprehensive clinical guidance.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
