import React, { useState } from "react";
import { RX_ABBREVIATIONS, RxCode } from "../rxAbbreviations";
import { Search, Pill, ShieldAlert, Sparkles, Clock, AlertCircle, ArrowRight, HelpCircle, CheckCircle } from "lucide-react";

export default function RxSigDecoder() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [customSigInput, setCustomSigInput] = useState("Amoxicillin 500mg PO TID PC x 7 days");

  const categories = ["All", "Frequency & Timing", "Route of Administration", "Special Instructions", "Quantity & Dosing"];

  const filteredRx = RX_ABBREVIATIONS.filter((item) => {
    const matchesCat = selectedCategory === "All" || item.category === selectedCategory;
    const query = searchTerm.toLowerCase();
    const matchesQuery =
      item.code.toLowerCase().includes(query) ||
      item.latin.toLowerCase().includes(query) ||
      item.english.toLowerCase().includes(query) ||
      item.patientGuidance.toLowerCase().includes(query);
    return matchesCat && matchesQuery;
  });

  // Simple heuristic decoder for custom entered Sig line
  const decodeCustomSig = (text: string) => {
    if (!text.trim()) return null;
    const tokens = text.split(/[\s,]+/);
    const decodedParts: { word: string; meaning: string }[] = [];

    tokens.forEach((t) => {
      const clean = t.toUpperCase().replace(/[^A-Z]/g, "");
      const match = RX_ABBREVIATIONS.find((rx) => rx.code.split(" ")[0].toUpperCase() === clean);
      if (match) {
        decodedParts.push({ word: t, meaning: `${match.english} (${match.latin})` });
      }
    });

    return decodedParts;
  };

  const decodedResult = decodeCustomSig(customSigInput);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-3">
          <Pill className="w-3.5 h-3.5" />
          <span>Prescription Latin Sig & Medicine Label Decoder</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight">
          Doctor Prescription Latin Abbreviations & Dosing Guide
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-3 text-sm sm:text-base leading-relaxed">
          Decipher cryptic doctor shorthand and pharmacy directions on pill bottles. Understand what PO, BID, TID, PRN, AC, and QHS mean for your medication timing and meal schedules.
        </p>
      </div>

      {/* Interactive Sig Script Decoder Box */}
      <div className="bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-slate-50 dark:from-slate-900/50 dark:via-blue-950/20 dark:to-slate-900/40 border border-blue-200/70 dark:border-slate-800 rounded-3xl p-6 sm:p-8 mb-12 shadow-xs">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-500" />
              Live Prescription Shorthand Translator
            </span>
            <span className="text-[11px] text-slate-400">Try typing your prescription line</span>
          </div>

          <div className="relative">
            <input
              type="text"
              value={customSigInput}
              onChange={(e) => setCustomSigInput(e.target.value)}
              placeholder="e.g. Metformin 500mg PO BID PC, or Lisinopril 10mg PO QD..."
              className="w-full px-4 py-3.5 rounded-xl border border-blue-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm sm:text-base"
            />
          </div>

          {/* Quick preset examples */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-slate-400 text-[11px]">Popular Prescriptions:</span>
            {[
              "Lisinopril 10mg PO QD",
              "Metformin 500mg PO BID PC",
              "Atorvastatin 20mg PO QHS",
              "Ibuprofen 400mg PO Q6H PRN"
            ].map((preset) => (
              <button
                key={preset}
                onClick={() => setCustomSigInput(preset)}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-blue-400 text-[11px] font-mono cursor-pointer transition-all"
              >
                {preset}
              </button>
            ))}
          </div>

          {/* Decoded Output Card */}
          {decodedResult && decodedResult.length > 0 && (
            <div className="mt-4 p-4 rounded-2xl bg-white dark:bg-slate-950 border border-blue-100 dark:border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                Decoded Prescription Instructions:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {decodedResult.map((part, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-start gap-2">
                    <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-mono text-xs font-bold">
                      {part.word}
                    </span>
                    <span className="text-xs text-slate-700 dark:text-slate-300 leading-snug">
                      = <strong>{part.meaning}</strong>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Search and Filters for Glossary */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search abbreviation (e.g., PO, BID, PRN, QHS)..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100 placeholder-slate-400"
            />
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Showing <strong className="text-slate-900 dark:text-white">{filteredRx.length}</strong> medical sig codes
          </div>
        </div>

        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Rx Abbreviation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredRx.map((item) => (
          <div
            key={item.code}
            className="p-5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200/70 dark:border-slate-800 hover:border-emerald-400/50 dark:hover:border-emerald-600/50 transition-all flex flex-col justify-between shadow-xs"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-lg font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                  {item.code}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded">
                  {item.category}
                </span>
              </div>

              <div className="text-xs text-slate-400 italic mb-2">
                Latin: <span className="text-slate-600 dark:text-slate-300">{item.latin}</span>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                {item.english}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                {item.patientGuidance}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-900 text-xs">
              <span className="text-slate-400 text-[10px] block font-mono">Example Script:</span>
              <span className="font-mono text-[11px] font-medium text-slate-800 dark:text-slate-200">
                "{item.example}"
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Critical Drug Safety Advisory Section */}
      <div className="mt-16 bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/60 rounded-3xl p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Critical Warning: Accidental Active Ingredient Double-Dosing
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              Pharmaceutical manufacturers market medications under hundreds of different brand names that contain identical generic molecules. For example:
            </p>
            <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5 list-disc pl-4">
              <li><strong>Acetaminophen / Paracetamol:</strong> Found in Tylenol, DayQuil, NyQuil, Excedrin, Percocet, and Alka-Seltzer Plus. Taking cold medication while taking a headache pill frequently exceeds the toxic liver ceiling of 4,000 mg/day.</li>
              <li><strong>NSAIDs (Anti-inflammatories):</strong> Ibuprofen (Advil, Motrin) and Naproxen (Aleve) should never be doubled up, as combining them severely damages stomach mucosa and kidneys.</li>
              <li><strong>Blood Pressure Medications:</strong> Lisinopril, Losartan, and Spironolactone all elevate potassium levels. Combining them without physician monitoring can induce cardiac dysrhythmias.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
