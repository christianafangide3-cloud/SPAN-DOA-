import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
    const { user } = useAuth();
    const [targetCgpa, setTargetCgpa] = useState("4.50");
    const [showBanner, setShowBanner] = useState(true);

    // Load Local Storage targets
    useEffect(() => {
        const storedGoal = localStorage.getItem("gpa_target_goal");
        if (storedGoal) {
            setTargetCgpa(parseFloat(storedGoal).toFixed(2));
        }

        // Listen for storage changes
        const handleStorageChange = () => {
            const currentGoal = localStorage.getItem("gpa_target_goal");
            if (currentGoal) setTargetCgpa(parseFloat(currentGoal).toFixed(2));
        };
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    const greeting = () => {
        const hr = new Date().getHours();
        if (hr < 12) return "Good morning";
        if (hr < 18) return "Good afternoon";
        return "Good evening";
    };

    const modules = [
        { path: "/cbt", label: "CBT Simulator", desc: "Interactive computer-based testing arena.", icon: "fa-laptop-code", color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" },
        { path: "/clinical", label: "Exam Springs", desc: "Interactive OSCE clinical mock desk.", icon: "fa-notes-medical", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
        { path: "/flashcards", label: "Flashcards Arena", desc: "Spaced-repetition active recall decks.", icon: "fa-layer-group", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
        { path: "/calculator", label: "GP Forecaster", desc: "Project grades and forecast CGPA trajectory.", icon: "fa-calculator", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
        { path: "/map", label: "Embryology Map", desc: "Interactive D3.js embryology core map.", icon: "fa-dna", color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
        { path: "/notes", label: "Resource Library", desc: "Search notes, slide reviews, and checklists.", icon: "fa-book-open", color: "text-rose-400 bg-rose-500/10 border-rose-500/20" },
        { path: "/outline", label: "Syllabus Tracker", desc: "Track course benchmarks and syllabus checklists.", icon: "fa-list-check", color: "text-slate-400 bg-slate-500/10 border-slate-500/20" },
        { path: "/leaderboard", label: "Honor Roll", desc: "Community active scholars leaderboard.", icon: "fa-award", color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20" }
    ];

    return (
        <div className="space-y-6">
            
            {/* Cortex Hub Migration Alert */}
            {showBanner && (
                <div className="relative overflow-hidden bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/25 p-5 rounded-3xl flex flex-col sm:flex-row justify-between items-center gap-4 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 flex-shrink-0 animate-pulse">
                            <i className="fas fa-satellite-dish"></i>
                        </div>
                        <div className="space-y-0.5">
                            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Platform Migration Notice</h3>
                            <p className="text-[11px] text-slate-400 max-w-xl leading-relaxed">
                                Cortex Hub is an intelligent and adaptive academic workspace filled with a whole lot of things, far better than what this is. Check out the secure reader portal now.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <a 
                            href="https://cortex-hub-seven.vercel.app" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-purple-500/20 border border-purple-500/30 hover:bg-purple-500/30 text-purple-300 font-bold px-4 py-2 rounded-xl text-[10px] uppercase tracking-wider transition-all flex items-center gap-1.5"
                        >
                            Open Cortex Hub <i className="fas fa-external-link-alt text-[9px]"></i>
                        </a>
                        <button 
                            onClick={() => setShowBanner(false)}
                            className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 hover:border-rose-500/30 hover:text-rose-400 flex items-center justify-center text-slate-400 transition-all text-xs"
                            title="Dismiss notification"
                        >
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            )}

            {/* Header / Welcome box */}
            <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/5 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2 relative z-10">
                    <span className="text-[10px] font-bold text-cyan-400 font-mono tracking-widest uppercase">
                        // SECURE SESSION INITIATED
                    </span>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                        {greeting()}, {user?.displayName ? user.displayName.split(" ")[0] : "Scholar"}!
                    </h2>
                    <p className="text-xs text-slate-400 max-w-md leading-relaxed">
                        Welcome to your Command Center. Review embryology maps, test your recall limits, and track your GP target.
                    </p>
                </div>
                <div className="flex gap-3 relative z-10">
                    <Link to="/cbt" className="btn-primary py-3 px-6 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg">
                        <i className="fas fa-play text-[10px] mr-1"></i> Start Mock Test
                    </Link>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="glass-card p-5 rounded-2xl border border-white/5 flex items-center justify-between">
                    <div>
                        <span className="text-[9px] text-slate-500 uppercase tracking-widest font-mono">Academic Track</span>
                        <div className="text-xl font-extrabold text-white mt-1">200 Level</div>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                        <i className="fas fa-graduation-cap"></i>
                    </div>
                </div>
                <div className="glass-card p-5 rounded-2xl border border-white/5 flex items-center justify-between">
                    <div>
                        <span className="text-[9px] text-slate-500 uppercase tracking-widest font-mono">Target GPA Goal</span>
                        <div className="text-xl font-extrabold text-amber-400 mt-1">{targetCgpa}</div>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                        <i className="fas fa-crosshairs"></i>
                    </div>
                </div>
                <div className="glass-card p-5 rounded-2xl border border-white/5 flex items-center justify-between">
                    <div>
                        <span className="text-[9px] text-slate-500 uppercase tracking-widest font-mono">Active Streak</span>
                        <div className="text-xl font-extrabold text-emerald-400 mt-1">12 Days 🔥</div>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <i className="fas fa-fire"></i>
                    </div>
                </div>
            </div>

            {/* Workspace Overview Box */}
            <div className="glass-card p-6 rounded-3xl border border-white/5 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2 max-w-xl">
                    <div className="text-[10px] font-bold text-cyan-400 font-mono tracking-widest uppercase">// ACADEMIC WORKSPACE</div>
                    <h3 className="text-xl font-bold text-white tracking-tight">Active Learning Tracks</h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-medium">
                        Welcome to Year 2. Focus on systematic review of Musculoskeletal Anatomy, Embryonic development vectors, and Organ System physiology. Explore checklists and practice mocks to cement your knowledge.
                    </p>
                </div>
                <div className="flex gap-3 flex-shrink-0">
                    <Link to="/outline" className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/20 hover:bg-cyan-500/5 text-slate-300 hover:text-cyan-400 font-bold transition-all text-xs uppercase tracking-wider flex items-center gap-1.5 font-mono">
                        <i className="fas fa-list-check"></i> Outline Checkpoints
                    </Link>
                </div>
            </div>

            {/* Bento Module Cards */}
            <div className="space-y-4 pt-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">
                    // PLATFORM BENTO MODULES
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {modules.map((m) => (
                        <Link 
                            key={m.path} 
                            to={m.path}
                            className="glass-card rounded-2xl p-5 border border-white/5 group hover:border-white/15 flex flex-col justify-between h-40"
                        >
                            <div className="space-y-3">
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${m.color}`}>
                                    <i className={`fas ${m.icon} text-sm`}></i>
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-white leading-snug group-hover:text-cyan-400 transition-colors">
                                        {m.label}
                                    </h4>
                                    <p className="text-[11px] text-slate-400 mt-1 leading-normal font-medium">
                                        {m.desc}
                                    </p>
                                </div>
                            </div>
                            <div className="text-[9px] font-bold text-cyan-500 uppercase tracking-widest font-mono flex items-center gap-1 group-hover:gap-1.5 transition-all mt-3">
                                Launch Module <i className="fas fa-arrow-right text-[8px]"></i>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

        </div>
    );
}
