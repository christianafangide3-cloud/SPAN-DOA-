import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";

export default function CbtHub() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const courseCode = searchParams.get("course") || "ANA 211";
    const courseTitle = searchParams.get("title") || `${courseCode} Track`;

    const [unlocked, setUnlocked] = useState({
        beginner: true,
        intermediate: false,
        advanced: false
    });

    useEffect(() => {
        // Load progression from localStorage
        const passedLevel1 = localStorage.getItem(`${courseCode}_beginner_passed`) === "true";
        const passedLevel2 = localStorage.getItem(`${courseCode}_intermediate_passed`) === "true";

        setUnlocked({
            beginner: true,
            intermediate: passedLevel1,
            advanced: passedLevel2
        });
    }, [courseCode]);

    const handleStartQuiz = (levelName) => {
        navigate(`/quiz?course=${encodeURIComponent(courseCode)}&level=${levelName}`);
    };

    return (
        <div className="max-w-2xl w-full mx-auto p-4 space-y-6">
            
            {/* Header Navigation */}
            <div className="flex items-center justify-between pb-4 border-b border-white/5">
                <div className="flex items-center gap-4">
                    <Link to="/cbt" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-slate-400 flex items-center justify-center hover:text-cyan-400 hover:border-cyan-400/30 transition-all">
                        <i className="fas fa-arrow-left text-sm"></i>
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-white font-head leading-tight">Assessment Engine</h1>
                        <p className="text-[9px] text-cyan-400 font-mono tracking-widest uppercase mt-0.5">Progression Matrix</p>
                    </div>
                </div>
                <div className="text-[10px] font-black text-cyan-400 border border-cyan-500/25 bg-cyan-500/10 px-3 py-1.5 rounded-lg font-mono">
                    {courseCode}
                </div>
            </div>

            <div className="text-center space-y-2 py-4">
                <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">{courseTitle}</h2>
                <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Clear preceding modules to unlock the Distinction level.</p>
            </div>

            {/* Level Matrix */}
            <div className="space-y-4">
                
                {/* Level 1: Beginner */}
                <div 
                    onClick={() => handleStartQuiz("beginner")}
                    className="glass-card p-6 rounded-2xl border border-white/5 border-l-4 border-l-cyan-400 relative overflow-hidden transition-all hover:-translate-y-1 shadow-lg group cursor-pointer"
                >
                    <div className="flex justify-between items-center relative z-10">
                        <div>
                            <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest font-mono">Level 1</span>
                            <h3 className="font-extrabold text-lg text-white mt-3 tracking-tight font-head">Beginner</h3>
                            <p className="text-xs text-slate-400 mt-1 font-medium">Foundation Concepts & Terminology</p>
                        </div>
                        <div className="h-12 w-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-lg border border-cyan-500/20 group-hover:bg-cyan-400 group-hover:text-slate-950 transition-colors shadow-lg">
                            <i className="fas fa-play ml-0.5"></i>
                        </div>
                    </div>
                </div>

                {/* Level 2: Intermediate */}
                {unlocked.intermediate ? (
                    <div 
                        onClick={() => handleStartQuiz("intermediate")}
                        className="glass-card p-6 rounded-2xl border border-white/5 border-l-4 border-l-cyan-400 relative overflow-hidden transition-all hover:-translate-y-1 shadow-lg group cursor-pointer"
                    >
                        <div className="flex justify-between items-center relative z-10">
                            <div>
                                <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest font-mono">Level 2</span>
                                <h3 className="font-extrabold text-lg text-white mt-3 tracking-tight font-head">Intermediate</h3>
                                <p className="text-xs text-slate-400 mt-1 font-medium">Advanced Mechanisms & Pathways</p>
                            </div>
                            <div className="h-12 w-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-lg border border-cyan-500/20 group-hover:bg-cyan-400 group-hover:text-slate-950 transition-colors shadow-lg">
                                <i className="fas fa-play ml-0.5"></i>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="glass-card p-6 rounded-2xl border border-white/5 border-l-4 border-l-slate-700 relative overflow-hidden opacity-40 grayscale select-none">
                        <div className="flex justify-between items-center">
                            <div>
                                <span className="bg-white/5 text-slate-400 border border-white/10 text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest font-mono">Level 2</span>
                                <h3 className="font-extrabold text-lg text-slate-400 mt-3 tracking-tight font-head">Intermediate</h3>
                                <p className="text-xs text-slate-500 mt-1 font-medium">Advanced Mechanisms & Pathways</p>
                            </div>
                            <div className="h-12 w-12 rounded-xl bg-white/5 text-slate-500 flex items-center justify-center text-lg border border-white/10">
                                <i className="fas fa-lock"></i>
                            </div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 backdrop-blur-[2px] z-20">
                            <span className="bg-slate-900 border border-white/5 text-slate-300 text-[9px] font-mono font-bold px-4 py-2 rounded-xl uppercase tracking-widest flex items-center gap-2">
                                <i className="fas fa-shield-alt text-slate-500"></i> Clear Level 1 to Unlock
                            </span>
                        </div>
                    </div>
                )}

                {/* Level 3: Advanced */}
                {unlocked.advanced ? (
                    <div 
                        onClick={() => handleStartQuiz("advanced")}
                        className="glass-card p-6 rounded-2xl border border-white/5 border-l-4 border-l-cyan-400 relative overflow-hidden transition-all hover:-translate-y-1 shadow-lg group cursor-pointer"
                    >
                        <div className="flex justify-between items-center relative z-10">
                            <div>
                                <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest font-mono">Final Phase</span>
                                <h3 className="font-extrabold text-lg text-white mt-3 tracking-tight font-head">Advanced</h3>
                                <p className="text-xs text-slate-400 mt-1 font-medium">Clinical Diagnostics & Application</p>
                            </div>
                            <div className="h-12 w-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-lg border border-cyan-500/20 group-hover:bg-cyan-400 group-hover:text-slate-950 transition-colors shadow-lg">
                                <i className="fas fa-play ml-0.5"></i>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="glass-card p-6 rounded-2xl border border-white/5 border-l-4 border-l-slate-700 relative overflow-hidden opacity-40 grayscale select-none">
                        <div className="flex justify-between items-center">
                            <div>
                                <span className="bg-white/5 text-slate-400 border border-white/10 text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest font-mono">Final Phase</span>
                                <h3 className="font-extrabold text-lg text-slate-400 mt-3 tracking-tight font-head">Advanced</h3>
                                <p className="text-xs text-slate-500 mt-1 font-medium">Clinical Diagnostics & Application</p>
                            </div>
                            <div className="h-12 w-12 rounded-xl bg-white/5 text-slate-500 flex items-center justify-center text-lg border border-white/10">
                                <i className="fas fa-lock"></i>
                            </div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 backdrop-blur-[2px] z-20">
                            <span className="bg-slate-900 border border-white/5 text-slate-300 text-[9px] font-mono font-bold px-4 py-2 rounded-xl uppercase tracking-widest flex items-center gap-2">
                                <i className="fas fa-shield-alt text-slate-500"></i> Clear Level 2 to Unlock
                            </span>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
