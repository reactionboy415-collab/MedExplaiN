import React, { useState } from "react";
import { Stethoscope, CheckSquare, Square, Copy, Check, Printer, HelpCircle, FileText, Share2, Sparkles } from "lucide-react";

export default function DoctorPrepKit() {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([
    "Abnormal Blood Test Results",
    "Fatigue & Low Energy"
  ]);
  const [customNotes, setCustomNotes] = useState("");
  const [copied, setCopied] = useState(false);

  const topicOptions = [
    { id: "Abnormal Blood Test Results", label: "Abnormal Blood Lab Flags (High/Low)", questions: ["What underlying condition might be causing this specific biomarker to sit outside normal range?", "Is this an acute temporary fluctuation or indicative of a chronic trend?", "Should we order a follow-up confirmatory test in 4 to 8 weeks?"] },
    { id: "Fatigue & Low Energy", label: "Unexplained Fatigue & Exhaustion", questions: ["Could my hemoglobin, ferritin, vitamin D, or thyroid (TSH) levels explain my constant tiredness?", "Do I need an iron panel or sleep study to rule out sleep apnea?"] },
    { id: "Blood Pressure & Heart", label: "Elevated Blood Pressure or Heart Rate", questions: ["What is my target systolic and diastolic goal based on my age and cardiovascular risk?", "Are dietary changes (DASH diet, sodium reduction) sufficient or is antihypertensive medication needed?", "Should I log home blood pressure readings morning and evening?"] },
    { id: "Cholesterol & Lipids", label: "High Cholesterol or Triglycerides", questions: ["What is my 10-year ASCVD risk score for heart attack and stroke?", "Do my LDL and non-HDL levels warrant starting a statin or PCSK9 inhibitor?", "Would an Apolipoprotein B (ApoB) or Coronary Calcium (CAC) scan clarify my plaque risk?"] },
    { id: "Kidney Function & Creatinine", label: "Elevated Creatinine or Decreased eGFR", questions: ["What stage of kidney function does my eGFR correspond to?", "Are my current medications (like NSAIDs, ACE inhibitors) safe for my kidneys?", "Do we need a urine albumin-to-creatinine ratio to test for microscopic protein leakage?"] },
    { id: "Blood Sugar & HbA1c", label: "Elevated Glucose or HbA1c (Prediabetes)", questions: ["Is my HbA1c in the prediabetes or diabetes range?", "What specific nutritional and resistance training plan will lower my A1c by 0.5%–1.0%?", "Would a continuous glucose monitor (CGM) or Metformin be appropriate?"] },
    { id: "Medication Side Effects", label: "Prescription Tolerability & Side Effects", questions: ["Are my symptoms (dizziness, cough, muscle aches) known adverse reactions to my prescription?", "Can we adjust the dosing schedule or switch to an alternate generic class?", "Are there any food or supplement interactions (like grapefruit or potassium) to avoid?"] }
  ];

  const toggleTopic = (id: string) => {
    if (selectedTopics.includes(id)) {
      setSelectedTopics(selectedTopics.filter((t) => t !== id));
    } else {
      setSelectedTopics([...selectedTopics, id]);
    }
  };

  const getCombinedQuestions = () => {
    const list: string[] = [];
    topicOptions.forEach((opt) => {
      if (selectedTopics.includes(opt.id)) {
        list.push(...opt.questions);
      }
    });
    if (customNotes.trim()) {
      list.push(`Personal Concern: ${customNotes.trim()}`);
    }
    return list;
  };

  const allQuestions = getCombinedQuestions();

  const handleCopy = () => {
    const textToCopy = `MEDEXPLAIN AI - DOCTOR APPOINTMENT PREPARATION CHECKLIST\nGenerated on: ${new Date().toLocaleDateString()}\n\nTOPICS TO DISCUSS:\n${selectedTopics.map((t) => `- ${t}`).join("\n")}\n\nQUESTIONS TO ASK MY PHYSICIAN:\n${allQuestions.map((q, i) => `${i + 1}. ${q}`).join("\n")}\n\nPATIENT NOTES:\n${customNotes || "None specified."}\n\nDisclaimer: Prepared for patient educational literacy. Consult your licensed doctor for clinical decisions.`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-3">
          <Stethoscope className="w-3.5 h-3.5" />
          <span>Patient Advocacy & Clinical Communication Kit</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight">
          Doctor Visit Question Checklist Generator
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-3 text-sm sm:text-base leading-relaxed">
          Studies show patients forget over 60% of their intended questions during a rushed 15-minute clinical consultation. Select your symptoms and abnormal test categories to generate an organized, prioritized question checklist for your doctor.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Column: Selectors */}
        <div className="md:col-span-5 space-y-5">
          <div className="bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-blue-600" />
              1. Select Topics of Concern
            </h3>

            <div className="space-y-2">
              {topicOptions.map((opt) => {
                const isChecked = selectedTopics.includes(opt.id);
                return (
                  <div
                    key={opt.id}
                    onClick={() => toggleTopic(opt.id)}
                    className={`p-3 rounded-xl border text-xs font-medium cursor-pointer transition-all flex items-start gap-2.5 ${
                      isChecked
                        ? "bg-blue-50/70 dark:bg-blue-950/40 border-blue-400 text-slate-900 dark:text-white"
                        : "bg-slate-50/50 dark:bg-slate-900/30 border-slate-200/60 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                    }`}
                  >
                    <span className="mt-0.5 text-blue-600 shrink-0">
                      {isChecked ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 text-slate-400" />}
                    </span>
                    <span>{opt.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Additional Notes Box */}
          <div className="bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              2. Add Your Personal Notes or Symptoms
            </h3>
            <textarea
              rows={3}
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder="e.g., Felt lightheaded after starting Lisinopril, or pain started 3 weeks ago..."
              className="w-full p-3 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Right Column: Generated Printable Checklist */}
        <div className="md:col-span-7">
          <div className="bg-white dark:bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100 dark:border-slate-900">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Doctor Visit Prep Sheet
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  My Appointment Question Checklist
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied!" : "Copy"}
                </button>
                <button
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all cursor-pointer shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Sheet
                </button>
              </div>
            </div>

            {/* Questions List */}
            {allQuestions.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-sm">
                Select one or more topics on the left to generate customized questions.
              </div>
            ) : (
              <div className="space-y-4">
                <ol className="space-y-3">
                  {allQuestions.map((q, idx) => (
                    <li key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                      <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="flex-1 font-medium">{q}</span>
                    </li>
                  ))}
                </ol>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-900 text-[11px] text-slate-400 space-y-1">
                  <p><strong>Clinical Advice:</strong> Hand this checklist to your nurse or physician at the start of your consultation so they know your key priorities.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
