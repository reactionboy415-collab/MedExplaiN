import React from "react";
import { FileText, Download, CheckCircle, ArrowRight, ShieldCheck, Stethoscope, Sparkles } from "lucide-react";

export default function DoctorSummaryShowcase() {
  const scrollToDropzone = () => {
    const elem = document.getElementById("analyzer-workspace");
    if (elem) elem.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      aria-label="One-Click Doctor Summary Sheet Feature Showcase"
      className="w-full max-w-6xl mx-auto my-16 px-4"
    >
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-teal-950 border border-slate-700/80 shadow-2xl p-6 sm:p-12 overflow-hidden text-white">
        {/* Decorative background aura */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text Explanation (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-teal-500/10 text-teal-400 border border-teal-500/20 self-start">
              <Stethoscope className="w-3.5 h-3.5 text-teal-400" />
              PATIENT-PHYSICIAN BRIDGING INSTRUMENT
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-slate-100 tracking-tight leading-tight">
              One-Click "Doctor Summary Sheet" Feature Showcase
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Medical appointments often average only 15 minutes. MedExplain AI automatically converts dense 10-page pathology printouts into a single, clean, high-priority summary sheet optimized specifically for your physician's clinical workflow.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <CheckCircle className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-white block font-semibold">Triage Stratification:</strong>
                  <span className="text-slate-400">Abnormal biomarkers are flagged first with percentage variance from biological baselines.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <CheckCircle className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-white block font-semibold">Scientifically Framed Questions:</strong>
                  <span className="text-slate-400">Pre-generates evidence-based inquiries to ensure no symptom or risk factor is overlooked.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <CheckCircle className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-white block font-semibold">Rx Cross-Contamination Alert:</strong>
                  <span className="text-slate-400">Detects duplicate active compounds across prescriptions and over-the-counter bottles.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <CheckCircle className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-white block font-semibold">Zero-Metadata Cryptographic Safety:</strong>
                  <span className="text-slate-400">Exported files strip hospital barcodes and tracking cookies for HIPAA-level in-memory privacy.</span>
                </div>
              </div>
            </div>

            <div className="pt-3 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={scrollToDropzone}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold bg-teal-500 hover:bg-teal-400 text-slate-950 transition-all shadow-lg shadow-teal-500/20 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Generate Your 1-Page Summary Now
                <ArrowRight className="w-4 h-4" />
              </button>
              <span className="text-xs text-slate-400">
                Available in Markdown (.md), Clean Print, or Text formats
              </span>
            </div>
          </div>

          {/* Right Visual Simulation Mockup (5 cols) */}
          <div className="lg:col-span-5 bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-2xl relative">
            {/* Header simulated paper */}
            <div className="border-b border-slate-800 pb-3 mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-400" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                  CLINICAL CONSULTATION BRIEF (PREVIEW)
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/50">
                READY FOR PRINT
              </span>
            </div>

            <div className="space-y-3 text-[11px] font-mono text-slate-300">
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[10px]">PATIENT VISIT FOCUS:</span>
                <span className="text-white font-semibold">Routine Wellness Check & Laboratory Follow-Up</span>
              </div>

              {/* Biomarkers flagged */}
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 space-y-1.5">
                <span className="text-slate-500 block text-[10px]">TRIAGED BIOMARKER FLAGS (REQUIRING REVIEW):</span>
                <div className="flex items-center justify-between text-rose-300 bg-rose-950/30 px-2 py-1 rounded border border-rose-900/30">
                  <span>Platelets (PLT)</span>
                  <span className="font-bold">84,000 /µL (LOW)</span>
                </div>
                <div className="flex items-center justify-between text-amber-300 bg-amber-950/30 px-2 py-1 rounded border border-amber-900/30">
                  <span>SGPT / ALT</span>
                  <span className="font-bold">68 U/L (ELEVATED)</span>
                </div>
              </div>

              {/* Questions */}
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 space-y-1">
                <span className="text-slate-500 block text-[10px]">SCIENTIFICALLY FRAMED QUESTIONS:</span>
                <p className="text-slate-300">1. Does the acute drop in platelets correlate with recent febrile illness?</p>
                <p className="text-slate-300">2. Would liver ultrasound or repeating ALT in 6 weeks be appropriate?</p>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                <span>Timestamp: Ephemeral In-Memory</span>
                <span>HIPAA Aligned • Zero Tracking</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
