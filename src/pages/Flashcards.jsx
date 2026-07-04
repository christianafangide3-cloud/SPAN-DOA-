import React, { useState } from "react";

export default function Flashcards() {
    const defaultDeck = [
        { q: "What oocyte stage is held in Prophase I until puberty?", a: "Primary Oocyte (Diplotene/Dictyotene stage)" },
        { q: "Which enzyme penetrates the zona pellucida during fertilization?", a: "Acrosin (released from the acrosome)" },
        { q: "What is the genetic cause of Prader-Willi Syndrome?", a: "Paternal deletion on Chromosome 15q11-q13" },
        { q: "How many days does spermatogenesis take?", a: "Exactly 74 days" },
        { q: "What hormone triggers ovulation?", a: "Luteinizing Hormone (LH) surge" },
        { q: "What is the master gene for left-sidedness?", a: "PITX2 homeobox gene" },
        { q: "Which pharyngeal arch forms the malleus and incus?", a: "First Pharyngeal Arch (Meckel's cartilage)" },
        { q: "Where do Primordial Germ Cells originate?", a: "In the Epiblast, before migrating to the yolk sac" }
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [score, setScore] = useState({ know: 0, dont: 0 });
    const [sessionDone, setSessionDone] = useState(false);

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    const handleFeedback = (knowsIt) => {
        setIsFlipped(false);
        setScore((prev) => ({
            know: prev.know + (knowsIt ? 1 : 0),
            dont: prev.dont + (knowsIt ? 0 : 1)
        }));

        if (currentIndex < defaultDeck.length - 1) {
            setCurrentIndex((prev) => prev + 1);
        } else {
            setSessionDone(true);
        }
    };

    const resetDeck = () => {
        setCurrentIndex(0);
        setIsFlipped(false);
        setScore({ know: 0, dont: 0 });
        setSessionDone(false);
    };

    const currentCard = defaultDeck[currentIndex];
    const progressPct = ((currentIndex + 1) / defaultDeck.length) * 100;

    return (
        <div className="max-w-md w-full mx-auto p-4 space-y-6 relative z-10 flex flex-col justify-center min-h-[75vh]">
            
            {/* Header Title */}
            <div className="text-center space-y-1">
                <h1 className="text-2xl font-extrabold text-white tracking-tight">Active Recall Arena</h1>
                <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">
                    Card {currentIndex + 1} of {defaultDeck.length}
                </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-950/80 rounded-full h-1 border border-white/5 overflow-hidden">
                <div 
                    className="bg-cyan-400 h-full rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(6,182,212,0.8)]" 
                    style={{ width: `${progressPct}%` }}
                ></div>
            </div>

            {!sessionDone ? (
                <div className="space-y-6">
                    {/* 3D Flashcard flip-card */}
                    <div 
                        onClick={handleFlip}
                        className="flip-card w-full h-72 cursor-pointer select-none"
                    >
                        <div className={`flip-card-inner w-full h-full relative rounded-3xl border border-white/5 shadow-2xl glass-card flex items-center justify-center p-8 text-center transition-transform ${isFlipped ? "flipped" : ""}`}>
                            
                            {/* Card Front */}
                            <div className="flip-card-front absolute inset-0 w-full h-full flex flex-col justify-between p-6">
                                <span className="text-[8px] text-cyan-400 uppercase tracking-widest font-mono font-bold">Question</span>
                                <div className="text-base md:text-lg font-bold text-white leading-relaxed font-sans flex-grow flex items-center justify-center">
                                    {currentCard.q}
                                </div>
                                <span className="text-[9px] text-slate-500 font-mono tracking-wider">Tap to Flip & Reveal</span>
                            </div>

                            {/* Card Back */}
                            <div className="flip-card-back absolute inset-0 w-full h-full flex flex-col justify-between p-6 bg-slate-900/60 rounded-3xl border border-cyan-400/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
                                <span className="text-[8px] text-emerald-400 uppercase tracking-widest font-mono font-bold">Solution</span>
                                <div className="text-base md:text-lg font-bold text-emerald-400 leading-relaxed font-sans flex-grow flex items-center justify-center">
                                    {currentCard.a}
                                </div>
                                <span className="text-[9px] text-slate-500 font-mono tracking-wider">Tap again to see question</span>
                            </div>

                        </div>
                    </div>

                    {/* Active Controls */}
                    <div className="grid grid-cols-2 gap-4">
                        <button 
                            onClick={() => handleFeedback(false)}
                            className="bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 text-rose-400 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 active:scale-95"
                        >
                            <i className="fas fa-times-circle"></i> Don't Know
                        </button>
                        <button 
                            onClick={() => handleFeedback(true)}
                            className="bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 text-emerald-400 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 active:scale-95"
                        >
                            <i className="fas fa-check-circle"></i> Got It!
                        </button>
                    </div>
                </div>
            ) : (
                /* Completed Screen */
                <div className="glass-card rounded-[2rem] p-8 text-center border border-emerald-500/20 bg-slate-900/40 animate-fade-in space-y-6">
                    <div className="h-20 w-20 bg-gradient-to-br from-emerald-400 to-teal-500 text-white rounded-full flex items-center justify-center text-3xl mx-auto shadow-lg shadow-emerald-500/25">
                        <i className="fas fa-trophy"></i>
                    </div>

                    <div className="space-y-1">
                        <h2 className="text-2xl font-extrabold text-white tracking-tight">Arena Complete</h2>
                        <p className="text-slate-400 text-xs font-mono uppercase tracking-wider">Session Statistics</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5">
                            <div className="text-2xl font-black font-mono text-emerald-400">{score.know}</div>
                            <div className="text-[8px] text-slate-500 uppercase tracking-widest font-mono mt-1">Mastered</div>
                        </div>
                        <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5">
                            <div className="text-2xl font-black font-mono text-rose-400">{score.dont}</div>
                            <div className="text-[8px] text-slate-500 uppercase tracking-widest font-mono mt-1">Review Needed</div>
                        </div>
                    </div>

                    <button 
                        onClick={resetDeck}
                        className="w-full btn-primary py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg flex items-center justify-center gap-2"
                    >
                        <i className="fas fa-rotate-right text-[10px]"></i> Restart Blitz
                    </button>
                </div>
            )}

        </div>
    );
}
