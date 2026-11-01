import React, { useState } from "react";
import { BIOMARKER_DATABASE, BiomarkerKnowledge } from "../biomarkerData";
import { Activity, ArrowRight, CheckCircle, AlertTriangle, ShieldCheck, Stethoscope } from "lucide-react";

interface QuickBiomarkerEvaluatorProps {
  onGoToAnalyzer: (biomarker: BiomarkerKnowledge, val: string) => void;
  onExploreDirectory: () => void;
}

export default function QuickBiomarkerEvaluator({ onGoToAnalyzer, onExploreDirectory }: QuickBiomarkerEvaluatorProps) {
  const featured = BIOMARKER_DATABASE.slice(0, 8); // Top 8 most searched tests
  const [selectedId, setSelectedId] = useState<string>("fasting-glucose");
  const currentTest = BIOMARKER_DATABASE.find((b) => b.id === selectedId) || BIOMARKER_DATABASE[0];
  const [inputValue, setInputValue] = useState<string>("108");

  const numVal = parseFloat(inputValue);
  let status: "LOW" | "NORMAL" | "HIGH" | null = null;
  let statusText = "";
  let statusBg = "";

  if (!isNaN(numVal)) {
    if (numVal < currentTest.standardRange.low) {
      status = "LOW";
      statusText = `Low (${inputValue} ${currentTest.unit}) — below standard minimum ${currentTest.standardRange.low} ${currentTest.unit}`;
      statusBg = "bg-amber-500";
    } else if (numVal > currentTest.standardRange.high) {
      status = "HIGH";
      statusText = `High (${inputValue} ${currentTest.unit}) — above standard threshold ${currentTest.standardRange.high} ${currentTest.unit}`;
      statusBg = "bg-rose-500";
    } else {
      status = "NORMAL";
      statusText = `Normal (${inputValue} ${currentTest.unit}) — inside healthy interval ${currentTest.standardRange.low} – ${currentTest.standardRange.high} ${currentTest.unit}`;
      statusBg = "bg-emerald-500";
    }
  }

  // Calculate percentage gauge position
  const rangeSpan = (currentTest.standardRange.high - currentTest.standardRange.low) * 2;
  const minVisual = Math.max(0, currentTest.standardRange.low - (currentTest.standardRange.high - currentTest.standardRange.low) * 0.5);
  const maxVisual = currentTest.standardRange.high * 1.5;
  const clampedVal = Math.min(Math.max(numVal || 0, minVisual), maxVisual);
  const percent = Math.min(100, Math.max(0, ((clampedVal - minVisual) / (maxVisual - minVisual)) * 100));

  return (
    <section className="py-16 bg-gradient-to-b from-white via-slate-50 to-white dark:from-slate-950 dark:via-slate-900/40 dark:to-slate-950 border-y border-slate-100 dark:border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 dark:bg-blue-950 px-3 py-1.5 rounded-full inline-flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" /> Interactive Clinical Evaluator
          </span>
          <h2 className="text-3xl font-extrabold font-display text-slate-900 dark:text-white mt-4 tracking-tight">
            Check Your Blood Test Range in Real Time
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm sm:text-base">
            Select an analyte and type your lab result number to see where it lands on the biological bell-curve.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white dark:bg-slate-950 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-10 shadow-lg shadow-slate-200/50 dark:shadow-none">
          
          {/* Biomarker Selector Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 scrollbar-thin">
            {featured.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedId(item.id);
                  setInputValue(String((item.standardRange.low + item.standardRange.high) / 2));
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedId === item.id
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-xs"
                    : "bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
                }`}
              >
                {item.name.split(" ")[0]} ({item.aliases[0] || item.name})
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Input & Unit */}
            <div className="md:col-span-5 space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  {currentTest.category}
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {currentTest.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {currentTest.shortDescription}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Your Laboratory Value ({currentTest.unit})
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full px-4 py-3 text-lg font-mono font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="absolute right-4 top-3.5 text-xs font-bold text-slate-400 font-mono">
                    {currentTest.unit}
                  </span>
                </div>
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>Standard Range:</span>
                <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                  {currentTest.standardRange.low} – {currentTest.standardRange.high} {currentTest.unit}
                </span>
              </div>
            </div>

            {/* Gauge Visualization & Analysis */}
            <div className="md:col-span-7 bg-slate-50 dark:bg-slate-900/40 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 space-y-5">
              
              {/* Gauge Bar */}
              <div>
                <div className="flex justify-between text-[10px] font-bold font-mono text-slate-400 mb-1">
                  <span>LOW (&lt;{currentTest.standardRange.low})</span>
                  <span className="text-emerald-600 dark:text-emerald-400">NORMAL ({currentTest.standardRange.low} – {currentTest.standardRange.high})</span>
                  <span>HIGH (&gt;{currentTest.standardRange.high})</span>
                </div>

                <div className="relative h-4 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden flex">
                  <div className="w-1/4 bg-amber-300/80 dark:bg-amber-800/60" title="Low Zone"></div>
                  <div className="w-2/4 bg-emerald-400/80 dark:bg-emerald-600/60" title="Healthy Normal Zone"></div>
                  <div className="w-1/4 bg-rose-400/80 dark:bg-rose-800/60" title="High Zone"></div>
                </div>

                {/* Marker pointer */}
                <div className="relative h-5">
                  <div
                    className="absolute -top-1 -ml-2 transition-all duration-300 flex flex-col items-center"
                    style={{ left: `${percent}%` }}
                  >
                    <div className="w-4 h-4 rounded-full bg-slate-900 dark:bg-white border-2 border-white dark:border-slate-950 shadow-md"></div>
                    <span className="text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300 mt-0.5 whitespace-nowrap">
                      {inputValue || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              {status && (
                <div className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                  status === "NORMAL"
                    ? "bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300"
                    : status === "HIGH"
                    ? "bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300"
                    : "bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300"
                }`}>
                  {status === "NORMAL" ? (
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                  )}
                  <span>{statusText}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                <button
                  onClick={() => onGoToAnalyzer(currentTest, inputValue)}
                  className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  <Stethoscope className="w-3.5 h-3.5" />
                  Explain This Reading with AI
                </button>
                <button
                  onClick={onExploreDirectory}
                  className="py-3 px-4 rounded-xl bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 font-semibold text-xs transition-all cursor-pointer"
                >
                  View 50+ Lab Tests
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
