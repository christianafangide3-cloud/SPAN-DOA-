import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
    const { user } = useAuth();
    const [targetCgpa, setTargetCgpa] = useState("4.50");
    const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [progressPercent, setProgressPercent] = useState(0);

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

    // Exam countdown & progress timeline shifting engine
    useEffect(() => {
        const getDates = () => {
            const now = new Date();
            let currentYear = now.getFullYear();
            
            // March 23 is the target exam date
            let targetDate = new Date(`March 23, ${currentYear} 09:00:00`);
            let semesterStart = new Date(`November 1, ${currentYear - 1} 08:00:00`);
            
            if (now > targetDate) {
                targetDate = new Date(`March 23, ${currentYear + 1} 09:00:00`);
                semesterStart = new Date(`November 1, ${currentYear} 08:00:00`);
            }
            return { start: semesterStart, target: targetDate };
        };

        const { start, target } = getDates();

        const updateTimelineAndTimer = () => {
            const now = new Date();
            const totalDuration = target.getTime() - start.getTime();
            const elapsed = now.getTime() - start.getTime();
            
            // Calculate progress percentage
            let percent = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
            setProgressPercent(Math.round(percent));

            // Calculate countdown
            const distance = target.getTime() - now.getTime();
            if (distance < 0) {
                setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            } else {
                setCountdown({
                    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((distance % (1000 * 60)) / 1000)
                });
            }
        };

        updateTimelineAndTimer();
        const intervalId = setInterval(updateTimelineAndTimer, 1000);
        return () => clearInterval(intervalId);
    }, []);

    const greeting = () => {
        const hr = new Date().getHours();
        if (hr < 12) return "Good morning";
        if (hr < 18) return "Good afternoon";
        return "Good evening";
    };

    const modules = [
        { path: "/cbt", label: "CBT Simulator", desc: "Interactive computer-based testing arena.", icon: "fa-laptop-code", color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" },
        { path: "/clinical", label: "Objective Vault", desc: "Interactive OSCE clinical mock desk.", icon: "fa-notes-medical", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
        { path: "/flashcards", label: "Flashcards Arena", desc: "Spaced-repetition active recall decks.", icon: "fa-layer-group", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
        { path: "/calculator", label: "GP Forecaster", desc: "Project grades and forecast CGPA trajectory.", icon: "fa-calculator", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
        { path: "/map", label: "Embryology Map", desc: "Interactive D3.js embryology core map.", icon: "fa-dna", color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
        { path: "/notes", label: "Resource Library", desc: "Search notes, slide reviews, and checklists.", icon: "fa-book-open", color: "text-rose-400 bg-rose-500/10 border-rose-500/20" },
        { path: "/outline", label: "Syllabus Tracker", desc: "Track course benchmarks and syllabus checklists.", icon: "fa-list-check", color: "text-slate-400 bg-slate-500/10 border-slate-500/20" },
        { path: "/leaderboard", label: "Honor Roll", desc: "Community active scholars leaderboard.", icon: "fa-award", color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20" }
    ];

    return (
        <div className="space-y-6">
            
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

            {/* Timelines block */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Countdown Card */}
                <div className="glass-card p-6 rounded-2xl border border-white/5 text-center flex flex-col justify-center space-y-4">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">
                        <i className="fas fa-hourglass-half text-cyan-400 mr-1.5"></i> Target Profs Countdown
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                        <div className="bg-slate-950/60 p-3 rounded-xl border border-white/5">
                            <div className="text-2xl font-black font-mono text-cyan-400 leading-none">{countdown.days}</div>
                            <div className="text-[8px] text-slate-500 uppercase tracking-widest font-mono mt-1">Days</div>
                        </div>
                        <div className="bg-slate-950/60 p-3 rounded-xl border border-white/5">
                            <div className="text-2xl font-black font-mono text-cyan-400 leading-none">{countdown.hours}</div>
                            <div className="text-[8px] text-slate-500 uppercase tracking-widest font-mono mt-1">Hours</div>
                        </div>
                        <div className="bg-slate-950/60 p-3 rounded-xl border border-white/5">
                            <div className="text-2xl font-black font-mono text-cyan-400 leading-none">{countdown.minutes}</div>
                            <div className="text-[8px] text-slate-500 uppercase tracking-widest font-mono mt-1">Mins</div>
                        </div>
                        <div className="bg-slate-950/60 p-3 rounded-xl border border-white/5">
                            <div className="text-2xl font-black font-mono text-cyan-400 leading-none">{countdown.seconds}</div>
                            <div className="text-[8px] text-slate-500 uppercase tracking-widest font-mono mt-1">Secs</div>
                        </div>
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono tracking-wider">Target: March 23 (Next Profs Exam Session)</p>
                </div>

                {/* Progress bar timeline */}
                <div className="glass-card p-6 rounded-2xl border border-white/5 md:col-span-2 flex flex-col justify-between space-y-4">
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                                Semester Progress timeline
                            </span>
                            <span className="text-xs font-black font-mono text-cyan-400">{progressPercent}% Completed</span>
                        </div>
                        <div className="w-full bg-slate-950/80 rounded-full h-3 border border-white/5 overflow-hidden p-0.5">
                            <div 
                                className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full transition-all duration-500" 
                                style={{ width: `${progressPercent}%` }}
                            ></div>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 text-center text-[9px] font-bold text-slate-500 font-mono tracking-wider">
                        <div>
                            <div>NOV 1</div>
                            <div className="text-[8px] text-slate-600 mt-0.5">SEMESTER START</div>
                        </div>
                        <div>
                            <div className="text-slate-400">ACTIVE PROGRESS</div>
                            <div className="text-[8px] text-cyan-500 mt-0.5">CURRENT INTERVAL</div>
                        </div>
                        <div>
                            <div>MAR 23</div>
                            <div className="text-[8px] text-slate-600 mt-0.5">FINAL PROFS EXAM</div>
                        </div>
                    </div>
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
