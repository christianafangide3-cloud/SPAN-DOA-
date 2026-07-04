import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Clinical() {
    const [mode, setMode] = useState("CBT"); // "CBT" or "OSCE"
    const [cbtStarted, setCbtStarted] = useState(false);
    const [osceStarted, setOsceStarted] = useState(false);

    // OSCE State
    const [osceIndex, setOsceIndex] = useState(0);
    const [draftAnswer, setDraftAnswer] = useState("");
    const [revealed, setRevealed] = useState(false);

    const subjectiveVault = [
        {
            title: "Station 1: Animal Ethics & Biostatistics",
            scenario: "You are defending your experimental design to the ethical committee regarding the use of Wistar rats.",
            question: "State the primary ethical rule for animal handling. Explain the relationship between the number of animals used and statistical analysis.",
            markingScheme: [
                "Golden Rule: Animals must not be tortured.",
                "Organ Harvesting: Harvested organs must be kept safe in a chemical preservative (e.g., chloroform) within a strict timeframe.",
                "Statistical Power: Statistical analysis is a function of the number of animals.",
                "Key Phrase: 'The lesser the number of animals, the lower the precision of the prediction'."
            ],
            trapAlert: "Prof. Jimmy specifically looks for the 'precision of the prediction' keyword regarding statistics."
        },
        {
            title: "Station 2: Tyrode's Solution & Mixing",
            scenario: "You are required to formulate Tyrode's solution for a mammalian intestine experiment.",
            question: "Outline the N-K-C dissolution rule. Why must CaCl2 be handled carefully when NaHCO3 is present?",
            markingScheme: [
                "Dissolve NaCl, KCl, and NaHCO3 in about 80% of the distilled water first because they are highly soluble.",
                "The Calcium Trap: ALWAYS dissolve CaCl2 separately or add it LAST and slowly.",
                "Reaction: If Calcium meets Bicarbonate in high concentration, they precipitate as Calcium Carbonate (Chalk).",
                "Result: This turns the solution cloudy and renders it useless."
            ],
            trapAlert: "Remember Tyrode's contains Glucose for energy and MUST be aerated at 37°C."
        },
        {
            title: "Station 3: Measurement of Gastric Acid",
            scenario: "Gastric contents from a 24-hour fasted rat are harvested and titrated against 0.02N NaOH using Silverton & Baker (1983) method.",
            question: "State the formula for calculating HCl concentration. What is the clinical significance of hyperchlorhydria?",
            markingScheme: [
                "Formula: Concentration = (Average Titer * 0.02 * 40) / 5ml.",
                "Endpoint: Titrate until a persistent light pink color is observed (phenolphthalein indicator).",
                "Clinical Correlate: Hyperchlorhydria is seen in Zollinger-Ellison Syndrome (gastrinoma) and Peptic Ulcers."
            ],
            trapAlert: "Achlorhydria (low acid) is seen in Pernicious Anaemia due to parietal cell atrophy."
        },
        {
            title: "Station 4: Clinical Instrumentation (Analysis)",
            scenario: "Specimen A is a weighted glass float. Specimen B is a corrugated rubber tube.",
            question: "Identify both instruments. What is the normal physiological range for the fluid measured by Specimen A?",
            markingScheme: [
                "Specimen A: Urinometer.",
                "Function A: Measures the Specific Gravity of urine.",
                "Normal Range A: 1.005 to 1.030.",
                "Specimen B: Stethograph (Pneumograph).",
                "Function B: Records respiratory movements of the chest."
            ],
            trapAlert: "Do not approximate the specific gravity. Write exactly 1.005 - 1.030."
        },
        {
            title: "Station 5: Basal Salivary Secretion",
            scenario: "A subject spits pooled saliva into a cylinder for a set time without chewing.",
            question: "Define the basal rate and state its normal value. Name a clinical condition associated with decreased secretion.",
            markingScheme: [
                "Basal Rate: The continuous, unstimulated secretion of saliva to keep the oral mucosa moist.",
                "Calculation: Flow Rate = Total Volume / Time.",
                "Normal Value: ~0.3-0.5 ml/min.",
                "Clinical Correlate: Hyposalivation (Xerostomia / Dry Mouth) caused by anticholinergic drugs or dehydration."
            ],
            trapAlert: "Hypersalivation is called Sialorrhea (caused by parasympathetic overstimulation)."
        }
    ];

    const currentOsce = subjectiveVault[osceIndex];

    const handleNextOsce = () => {
        setRevealed(false);
        setDraftAnswer("");
        if (osceIndex < subjectiveVault.length - 1) {
            setOsceIndex((prev) => prev + 1);
        } else {
            alert("Subjective practical session complete!");
            setOsceStarted(false);
            setOsceIndex(0);
        }
    };

    return (
        <div className="max-w-2xl w-full mx-auto p-4 space-y-6 relative z-10">
            
            {/* Header Navigation */}
            <div className="flex items-center justify-between pb-4 border-b border-white/5">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-white font-head leading-tight">THE UNIFIED VAULT</h1>
                    <p className="text-[9px] text-cyan-400 font-mono tracking-widest uppercase mt-0.5">Multi-Engine Simulator</p>
                </div>
                <Link to="/dashboard" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-slate-400 flex items-center justify-center hover:text-rose-400 hover:border-rose-400/30 transition-all">
                    <i className="fas fa-times text-sm"></i>
                </Link>
            </div>

            {/* Tab Selector */}
            {!cbtStarted && !osceStarted && (
                <div className="flex p-1 bg-slate-950/20 backdrop-blur-md rounded-2xl border border-white/5 shadow-lg">
                    <button 
                        onClick={() => setMode("CBT")}
                        className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest rounded-xl transition-all font-mono ${
                            mode === "CBT" 
                                ? "bg-slate-900 border border-cyan-500/20 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]" 
                                : "text-slate-400 hover:text-slate-200"
                        }`}
                    >
                        <i className="fas fa-check-circle text-[10px] mr-1"></i> Objective (CBT)
                    </button>
                    <button 
                        onClick={() => setMode("OSCE")}
                        className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest rounded-xl transition-all font-mono ${
                            mode === "OSCE" 
                                ? "bg-slate-900 border border-rose-500/20 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.15)]" 
                                : "text-slate-400 hover:text-slate-200"
                        }`}
                    >
                        <i className="fas fa-microscope text-[10px] mr-1"></i> Subjective (OSCE)
                    </button>
                </div>
            )}

            {/* CBT Core View */}
            {mode === "CBT" && (
                <div className="glass-card rounded-3xl p-6 text-center border border-white/5 space-y-6">
                    <div className="space-y-2">
                        <h2 className="text-xl font-bold text-white">Select Objective Module</h2>
                        <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">Click a module to load questions directly from our central vault.</p>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 pt-2">
                        <Link 
                            to="/quiz?course=PHS%20211&level=beginner"
                            className="bg-slate-950/30 border border-white/5 hover:border-rose-500/30 rounded-2xl p-6 transition-all text-center group"
                        >
                            <div className="text-rose-400 text-2xl mb-3 group-hover:scale-110 transition-transform"><i className="fas fa-heartbeat"></i></div>
                            <h3 className="text-white font-bold text-xs font-mono">PHS 211</h3>
                        </Link>
                        <Link 
                            to="/quiz?course=ANA%20213&level=intermediate"
                            className="bg-slate-950/30 border border-white/5 hover:border-blue-500/30 rounded-2xl p-6 transition-all text-center group"
                        >
                            <div className="text-blue-400 text-2xl mb-3 group-hover:scale-110 transition-transform"><i className="fas fa-dna"></i></div>
                            <h3 className="text-white font-bold text-xs font-mono">ANA 213</h3>
                        </Link>
                        <Link 
                            to="/quiz?course=ANA%20211&level=advanced"
                            className="bg-slate-950/30 border border-white/5 hover:border-emerald-500/30 rounded-2xl p-6 transition-all text-center group"
                        >
                            <div className="text-emerald-400 text-2xl mb-3 group-hover:scale-110 transition-transform"><i className="fas fa-bone"></i></div>
                            <h3 className="text-white font-bold text-xs font-mono">ANA 211</h3>
                        </Link>
                    </div>
                </div>
            )}

            {/* OSCE Core View */}
            {mode === "OSCE" && !osceStarted && (
                <div className="glass-card rounded-3xl p-6 text-center border border-white/5 space-y-6">
                    <div className="space-y-2">
                        <h2 className="text-xl font-bold text-white">Practical Laboratory Simulator</h2>
                        <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">Subjective analysis and marking guides extracted from Prof. Jimmy's protocols.</p>
                    </div>
                    
                    <button 
                        onClick={() => setOsceStarted(true)} 
                        className="px-10 py-4 btn-primary text-white font-bold rounded-xl shadow-lg tracking-widest text-xs uppercase"
                    >
                        LAUNCH PHS 214 PRACTICAL <i className="fas fa-microscope ml-1"></i>
                    </button>
                </div>
            )}

            {/* Active OSCE Session */}
            {osceStarted && (
                <div className="space-y-6">
                    
                    <div className="flex justify-between items-center bg-slate-950/40 p-3 rounded-xl border border-white/5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                            PHS 214: LAB PHYSIOLOGY
                        </span>
                        <span className="text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded-lg font-mono">
                            Setup {osceIndex + 1} / {subjectiveVault.length}
                        </span>
                    </div>

                    <div className="glass-card p-6 md:p-8 rounded-3xl border border-white/5 shadow-xl space-y-6">
                        <h2 className="text-base font-bold text-white flex items-center gap-2">
                            <i className="fas fa-microscope text-rose-400"></i> {currentOsce.title}
                        </h2>

                        <div className="bg-slate-950/30 p-4 rounded-xl border border-white/5 text-slate-300 text-xs leading-relaxed">
                            <strong className="text-rose-400 uppercase tracking-widest text-[9px] font-mono block mb-1">
                                SCENARIO:
                            </strong>
                            {currentOsce.scenario}
                        </div>

                        <h3 className="text-white font-bold text-xs md:text-sm leading-relaxed">
                            {currentOsce.question}
                        </h3>

                        <textarea 
                            value={draftAnswer}
                            onChange={(e) => setDraftAnswer(e.target.value)}
                            className="w-full bg-slate-950/20 border border-white/10 focus:border-rose-500/50 rounded-xl p-4 text-slate-200 outline-none h-32 resize-none text-xs transition-all" 
                            placeholder="Draft your answer here to compare with the key..."
                        ></textarea>

                        {!revealed ? (
                            <button 
                                onClick={() => setRevealed(true)}
                                className="w-full py-3.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-xl uppercase text-xs tracking-wider transition-colors flex items-center justify-center gap-2"
                            >
                                <i className="fas fa-eye text-[10px]"></i> Reveal Director's Guide
                            </button>
                        ) : (
                            <div className="bg-rose-950/10 border border-rose-500/25 rounded-2xl p-6 animate-fade-in space-y-4">
                                <ul className="list-none space-y-3">
                                    {currentOsce.markingScheme.map((point, index) => (
                                        <li key={index} className="pl-3 border-l-2 border-rose-500 text-xs font-semibold text-slate-300 leading-relaxed">
                                            {point}
                                        </li>
                                    ))}
                                </ul>
                                <div className="bg-red-500/10 border border-red-500/25 p-3 rounded-xl text-[9px] text-red-400 leading-relaxed font-mono">
                                    <strong className="text-red-400 font-bold uppercase tracking-wider block mb-1">EXAM TRAP:</strong> 
                                    {currentOsce.trapAlert}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between items-center">
                        <button 
                            onClick={() => {
                                if (osceIndex > 0) {
                                    setOsceIndex((prev) => prev - 1);
                                    setRevealed(false);
                                    setDraftAnswer("");
                                }
                            }}
                            disabled={osceIndex === 0}
                            className="px-5 py-3 bg-white/5 text-slate-400 hover:text-white rounded-xl text-xs uppercase font-bold tracking-wider border border-white/5 transition-colors disabled:opacity-30"
                        >
                            PREV
                        </button>
                        <button 
                            onClick={handleNextOsce}
                            className="px-8 py-3 bg-rose-500/10 border border-rose-500/25 hover:bg-rose-500/20 text-rose-400 font-bold rounded-xl text-xs uppercase tracking-wider transition-colors"
                        >
                            {osceIndex === subjectiveVault.length - 1 ? "FINISH" : "NEXT"}
                        </button>
                    </div>

                </div>
            )}

        </div>
    );
}
