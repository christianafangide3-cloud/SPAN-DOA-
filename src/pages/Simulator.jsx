import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { QUESTION_VAULT } from "../data/questions";

export default function Simulator() {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Screen State: "NAME" (for entering name if not logged in - bypassed), "DASHBOARD", "EXAM", "RESULT"
    const [screen, setScreen] = useState("DASHBOARD"); 
    const [candidateName, setCandidateName] = useState("");

    // Selected Course
    const [selectedCourse, setSelectedCourse] = useState("");
    const [questions, setQuestions] = useState([]);
    
    // Exam Session State
    const [currentQ, setCurrentQ] = useState(0);
    const [userAnswers, setUserAnswers] = useState([]);
    const [flagged, setFlagged] = useState([]);
    const [timeLeft, setTimeLeft] = useState(2100); // 35 Minutes
    const [autoAdvance, setAutoAdvance] = useState(true);
    const [timeElapsed, setTimeElapsed] = useState(0);

    // Result State
    const [scorePct, setScorePct] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);

    const timerRef = useRef(null);

    // Auto bypass name screen if logged in
    useEffect(() => {
        if (user) {
            setCandidateName(user.displayName || "Scholar");
            setScreen("DASHBOARD");
        } else {
            setScreen("NAME");
        }
    }, [user]);

    // Timer control
    useEffect(() => {
        if (screen !== "EXAM") return;

        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    handleFinalizeExam();
                    return 0;
                }
                return prev - 1;
            });
            setTimeElapsed((prev) => prev + 1);
        }, 1000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [screen]);

    const handleEnterVault = (e) => {
        e?.preventDefault();
        if (candidateName.trim()) {
            setScreen("DASHBOARD");
        }
    };

    const handleIgniteExam = (courseCode) => {
        setSelectedCourse(courseCode);
        
        // Grab questions (simulator pulls a mix or default to intermediate/advanced)
        let pool = [];
        if (QUESTION_VAULT[courseCode]) {
            const vault = QUESTION_VAULT[courseCode];
            pool = [...(vault.beginner || []), ...(vault.intermediate || []), ...(vault.advanced || [])];
        }

        if (pool.length === 0) {
            alert("No questions found in this course vault.");
            return;
        }

        // Select exactly 35 random questions
        const shuffled = pool.sort(() => Math.random() - 0.5).slice(0, 35);
        setQuestions(shuffled);
        setUserAnswers(new Array(shuffled.length).fill(null));
        setFlagged(new Array(shuffled.length).fill(false));
        setTimeLeft(2100);
        setTimeElapsed(0);
        setCurrentQ(0);
        setScreen("EXAM");
    };

    const handleSelectOption = (idx) => {
        const updated = [...userAnswers];
        updated[currentQ] = idx;
        setUserAnswers(updated);

        if (autoAdvance && currentQ < questions.length - 1) {
            setTimeout(() => {
                setCurrentQ((prev) => prev + 1);
            }, 250);
        }
    };

    const handleToggleFlag = () => {
        const updated = [...flagged];
        updated[currentQ] = !updated[currentQ];
        setFlagged(updated);
    };

    const getCorrectIndex = (q) => {
        if (q.correctAnswer !== undefined) return Number(q.correctAnswer);
        if (q.a !== undefined) return Number(q.a);
        if (q.answer !== undefined) return q.answer.trim().toUpperCase().charCodeAt(0) - 65;
        return -1;
    };

    const handleFinalizeExam = async () => {
        if (timerRef.current) clearInterval(timerRef.current);

        let correct = 0;
        questions.forEach((q, i) => {
            const correctIdx = getCorrectIndex(q);
            if (userAnswers[i] === correctIdx) correct++;
        });

        const pct = Math.round((correct / questions.length) * 100);
        setScorePct(pct);
        setCorrectCount(correct);

        // Write score to Firestore
        if (user) {
            try {
                await addDoc(collection(db, "scores"), {
                    uid: user.uid,
                    displayName: user.displayName || candidateName,
                    email: user.email || "local@student.edu",
                    course: selectedCourse,
                    level: "Pro-Simulator",
                    score: pct,
                    timestamp: serverTimestamp()
                });
            } catch (err) {
                console.error("Failed to write simulator score to Firestore: ", err);
            }
        }

        setScreen("RESULT");
    };

    const getClassification = () => {
        if (scorePct >= 70) return { label: "Distinction", cls: "bg-emerald-500/10 border-emerald-500 text-emerald-400" };
        if (scorePct >= 60) return { label: "Merit", cls: "bg-cyan-500/10 border-cyan-500 text-cyan-400" };
        if (scorePct >= 50) return { label: "Pass", cls: "bg-amber-500/10 border-amber-500 text-amber-400" };
        return { label: "Fail", cls: "bg-rose-500/10 border-rose-500 text-rose-400" };
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, "0");
        const s = (seconds % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };

    const formatElapsedTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}m ${s}s`;
    };

    const coursesList = [
        { code: "ANA 211", label: "Gross Anatomy", icon: "fa-bone", color: "text-emerald-400 border-l-emerald-500" },
        { code: "ANA 213", label: "Embryology", icon: "fa-dna", color: "text-purple-400 border-l-purple-500" },
        { code: "PHS 211", label: "General Physio", icon: "fa-droplet", color: "text-rose-400 border-l-rose-500" },
        { code: "PHS 212", label: "Cardiovascular", icon: "fa-heart-pulse", color: "text-amber-400 border-l-amber-500" },
        { code: "PHS 213", label: "Respiratory", icon: "fa-lungs", color: "text-cyan-400 border-l-cyan-500" },
        { code: "PHS 214", label: "Renal Physiology", icon: "fa-kidneys", color: "text-blue-400 border-l-blue-500" }
    ];

    return (
        <div className="relative min-h-[85vh] flex flex-col justify-center items-center w-full">
            
            {/* NAME SCREEN (BYPASSED IF LOGGED IN) */}
            {screen === "NAME" && (
                <div className="max-w-md w-full glass-card rounded-3xl p-8 border border-white/5 text-center space-y-6">
                    <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-2xl text-cyan-400 mx-auto">
                        <i className="fas fa-bolt"></i>
                    </div>
                    <div className="space-y-1">
                        <h2 className="text-xl font-bold text-white tracking-wide font-head uppercase">Pro Simulator Session</h2>
                        <p className="text-xs text-slate-400 leading-relaxed">Please input your authorization credentials or login to proceed.</p>
                    </div>
                    <form onSubmit={handleEnterVault} className="space-y-4">
                        <input 
                            type="text"
                            required
                            placeholder="Input Candidate Display Name"
                            value={candidateName}
                            onChange={(e) => setCandidateName(e.target.value)}
                            className="w-full bg-slate-950/40 border border-white/10 rounded-xl py-3 px-4 text-xs text-center text-white outline-none focus:border-cyan-400/50 transition-colors"
                        />
                        <button 
                            type="submit"
                            className="w-full btn-primary py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider"
                        >
                            Enter Simulation Vault
                        </button>
                    </form>
                </div>
            )}

            {/* DASHBOARD COURSE SELECTION */}
            {screen === "DASHBOARD" && (
                <div className="max-w-3xl w-full mx-auto space-y-6">
                    <div className="text-center space-y-2">
                        <span className="text-[9px] font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1.5 rounded-full uppercase tracking-wider font-mono inline-block">
                            <i className="fas fa-bolt mr-1"></i> Pro Simulator v3.0
                        </span>
                        <h1 className="text-3xl font-extrabold text-white tracking-tight font-head uppercase">Select Exam Module</h1>
                        <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                            Simulates professional examinations. Extracted random 35-question subsets, strictly timed.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4">
                        {coursesList.map((c) => (
                            <div 
                                key={c.code}
                                onClick={() => handleIgniteExam(c.code)}
                                className={`glass-card p-5 rounded-2xl border border-white/5 border-l-4 ${c.color} cursor-pointer hover:border-white/10 hover:-translate-y-1 transition-all flex flex-col justify-between`}
                            >
                                <div className="space-y-4">
                                    <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-sm">
                                        <i className={`fas ${c.icon}`}></i>
                                    </div>
                                    <div>
                                        <h3 className="font-extrabold text-base text-white">{c.code}</h3>
                                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono mt-0.5">{c.label}</p>
                                    </div>
                                </div>
                                <span className="text-[8px] font-bold text-slate-500 font-mono mt-4 block">35 QUESTIONS • 35 MINS</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ACTIVE EXAM SESSION */}
            {screen === "EXAM" && questions.length > 0 && (
                <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-4 gap-6 pt-16 relative">
                    
                    {/* Floating Header Banner */}
                    <div className="fixed top-0 left-0 right-0 h-16 bg-[#0a0f1e]/90 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 z-30">
                        <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white"><i className="fas fa-bolt text-xs"></i></span>
                            <div>
                                <h2 className="text-xs font-bold text-white leading-none font-head uppercase">{selectedCourse}</h2>
                                <span className="text-[8px] font-mono text-cyan-400 tracking-widest uppercase">PRO SIMULATION VAULT</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            {/* Auto Advance Toggle */}
                            <div className="flex items-center gap-2 cursor-pointer select-none" onClick={() => setAutoAdvance(!autoAdvance)}>
                                <span className="text-[8px] font-bold tracking-wider text-slate-500 font-mono uppercase">AUTO ADVANCE</span>
                                <div className={`w-8 h-4 rounded-full border relative transition-all ${autoAdvance ? "bg-cyan-500/10 border-cyan-400" : "bg-white/5 border-white/10"}`}>
                                    <div className={`w-2.5 h-2.5 rounded-full absolute top-[2px] transition-all ${autoAdvance ? "left-[16px] bg-cyan-400" : "left-[3px] bg-slate-500"}`}></div>
                                </div>
                            </div>
                            {/* Timer */}
                            <div className={`px-3 py-1.5 rounded-xl border font-mono font-bold text-xs tracking-wider flex items-center gap-1.5 ${
                                timeLeft <= 120 ? "border-rose-500/40 bg-rose-950/20 text-rose-400 animate-pulse" : "border-white/5 bg-slate-950/40 text-white"
                            }`}>
                                <i className="fas fa-clock text-xs"></i>
                                <span>{formatTime(timeLeft)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Left side Sidebar Navigation (Questions Grid) */}
                    <div className="md:col-span-1 hidden md:block space-y-4">
                        <div className="glass-card rounded-2xl p-4 border border-white/5 sticky top-20 max-h-[80vh] overflow-y-auto space-y-4">
                            <div className="text-[9px] font-bold text-cyan-400 font-mono tracking-widest uppercase border-b border-white/5 pb-2">
                                // NAVIGATE QUESTIONS
                            </div>
                            <div className="grid grid-cols-5 gap-1.5">
                                {questions.map((_, i) => {
                                    const isCurrent = currentQ === i;
                                    const isAnswered = userAnswers[i] !== null;
                                    const isFlagged = flagged[i];

                                    let cellClass = "bg-white/5 border-transparent text-slate-500";
                                    if (isAnswered) cellClass = "bg-cyan-500/10 border-cyan-500/25 text-cyan-400";
                                    if (isFlagged) cellClass = "bg-amber-500/10 border-amber-500/25 text-amber-400";
                                    if (isCurrent) cellClass += " border-white ring-1 ring-white/20 scale-105 shadow-md";

                                    return (
                                        <button 
                                            key={i}
                                            onClick={() => setCurrentQ(i)}
                                            className={`aspect-square rounded-lg flex items-center justify-center font-bold text-[10px] font-mono border transition-all ${cellClass}`}
                                        >
                                            {i + 1}
                                        </button>
                                    );
                                })}
                            </div>
                            <div className="border-t border-white/5 pt-3 space-y-1.5 text-[8px] font-bold text-slate-500 uppercase tracking-widest font-mono">
                                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-sm bg-white/5"></div> Unanswered</div>
                                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-sm bg-cyan-500/10 border border-cyan-500/20"></div> Answered</div>
                                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-sm bg-amber-500/10 border border-amber-500/20"></div> Flagged</div>
                            </div>
                        </div>
                    </div>

                    {/* Question Card Panel */}
                    <div className="md:col-span-3 space-y-4">
                        <div className="glass-card rounded-3xl overflow-hidden border border-white/5">
                            <div className="p-6 md:p-8 space-y-6">
                                <div className="flex justify-between items-center">
                                    <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[9px] font-bold px-3 py-1.5 rounded-xl uppercase tracking-widest font-mono">
                                        Question {currentQ + 1} / {questions.length}
                                    </span>
                                    <button 
                                        onClick={handleToggleFlag}
                                        className={`px-3 py-1.5 rounded-xl border text-[9px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 font-mono ${
                                            flagged[currentQ] 
                                                ? "bg-amber-500/10 border-amber-400 text-amber-400" 
                                                : "border-white/5 text-slate-500 hover:text-amber-400 hover:border-amber-400/20"
                                        }`}
                                    >
                                        <i className="fas fa-flag"></i> Flag
                                    </button>
                                </div>

                                <h2 className="text-base md:text-lg font-bold text-white leading-relaxed tracking-tight">
                                    {questions[currentQ].question || questions[currentQ].q}
                                </h2>

                                <div className="space-y-3 pt-2">
                                    {questions[currentQ].options.map((opt, index) => {
                                        const isSelected = userAnswers[currentQ] === index;
                                        return (
                                            <div 
                                                key={index}
                                                onClick={() => handleSelectOption(index)}
                                                className={`p-4 rounded-xl text-slate-300 flex items-center gap-4 border cursor-pointer transition-all hover:translate-x-1 ${
                                                    isSelected 
                                                        ? "bg-cyan-500/10 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]" 
                                                        : "bg-white/2--02 border-white/5 hover:border-white/10"
                                                }`}
                                            >
                                                <div className={`h-6 w-6 rounded-full border flex items-center justify-center text-[10px] font-bold font-mono ${
                                                    isSelected ? "border-cyan-400 text-cyan-400 bg-cyan-400/10" : "border-slate-600 text-slate-400"
                                                }`}>
                                                    {String.fromCharCode(65 + index)}
                                                </div>
                                                <span className="text-xs md:text-sm font-semibold leading-relaxed">{opt}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="bg-slate-950/30 p-5 border-t border-white/5 flex justify-between items-center">
                                <button 
                                    onClick={handlePrev} 
                                    disabled={currentQ === 0}
                                    className="px-5 py-3 rounded-xl text-slate-400 font-bold hover:text-white hover:bg-white/5 transition-all text-xs uppercase tracking-widest font-mono disabled:opacity-30"
                                >
                                    <i className="fas fa-arrow-left mr-1"></i> Prev
                                </button>
                                <button 
                                    onClick={handleNext}
                                    className={`px-8 py-3 rounded-xl text-white font-bold uppercase tracking-widest text-xs flex items-center shadow-lg transition-transform hover:scale-[1.02] active:scale-95 ${
                                        currentQ === questions.length - 1 
                                            ? "bg-gradient-to-r from-emerald-500 to-teal-500 border border-emerald-400/30" 
                                            : "btn-primary"
                                    }`}
                                >
                                    {currentQ === questions.length - 1 ? (
                                        <>Finalize <i className="fas fa-fingerprint ml-1.5"></i></>
                                    ) : (
                                        <>Next <i className="fas fa-arrow-right ml-1.5"></i></>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            )}

            {/* RESULTS VIEW */}
            {screen === "RESULT" && (
                <div className="max-w-3xl w-full mx-auto space-y-6 pt-4 pb-20 animate-fade-in relative z-10">
                    
                    {/* Ring score card */}
                    <div className="glass-card rounded-[2rem] p-8 text-center border border-white/5 relative overflow-hidden flex flex-col items-center space-y-4">
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono">// EXAM FINAL DIAGNOSTIC</span>
                        
                        <div className="relative w-32 h-32 flex items-center justify-center">
                            {/* SVG circular progress */}
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="64" cy="64" r="50" className="stroke-slate-950/80 fill-none stroke-[8px]"></circle>
                                <circle 
                                    cx="64" 
                                    cy="64" 
                                    r="50" 
                                    className={`fill-none stroke-[8px] transition-all duration-1000 ${
                                        scorePct >= 50 ? "stroke-emerald-400" : "stroke-rose-400"
                                    }`}
                                    strokeDasharray="314.16"
                                    strokeDashoffset={314.16 - (314.16 * scorePct) / 100}
                                    strokeLinecap="round"
                                ></circle>
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
                                <span className={`text-2xl font-black ${scorePct >= 50 ? "text-emerald-400" : "text-rose-400"}`}>{scorePct}%</span>
                                <span className="text-[8px] text-slate-500 uppercase tracking-widest font-bold">Accuracy</span>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl font-extrabold text-white leading-tight">{candidateName}</h2>
                            <p className="text-xs text-slate-400 font-medium mt-1">Course Track: <span className="font-bold text-slate-200">{selectedCourse}</span></p>
                        </div>

                        <span className={`px-4 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${getClassification().cls}`}>
                            Classification: {getClassification().label}
                        </span>
                    </div>

                    {/* Stats Box Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5 text-center">
                            <div className="text-[8px] text-slate-500 uppercase tracking-widest font-mono">Time Elapsed</div>
                            <div className="text-lg font-bold text-white mt-1">{formatElapsedTime(timeElapsed)}</div>
                        </div>
                        <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5 text-center">
                            <div className="text-[8px] text-slate-500 uppercase tracking-widest font-mono">Total Questions</div>
                            <div className="text-lg font-bold text-white mt-1">{questions.length}</div>
                        </div>
                        <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5 text-center">
                            <div className="text-[8px] text-slate-500 uppercase tracking-widest font-mono">Correct Keys</div>
                            <div className="text-lg font-bold text-emerald-400 mt-1">{correctCount}</div>
                        </div>
                        <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5 text-center">
                            <div className="text-[8px] text-slate-500 uppercase tracking-widest font-mono">Incorrect/Skipped</div>
                            <div className="text-lg font-bold text-rose-400 mt-1">{questions.length - correctCount}</div>
                        </div>
                    </div>

                    {/* Questions review */}
                    <div className="space-y-4 pt-4">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">// SESSION DEEP REVIEW</h3>
                        <div className="space-y-3">
                            {questions.map((q, i) => {
                                const userChoice = userAnswers[i];
                                const correctIdx = getCorrectIndex(q);
                                const isCorrect = userChoice === correctIdx;

                                return (
                                    <div 
                                        key={i}
                                        className={`glass-card p-5 rounded-2xl border border-white/5 border-l-4 ${
                                            isCorrect ? "border-l-emerald-500" : "border-l-rose-500"
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-4 mb-3">
                                            <div className="flex items-start gap-3">
                                                <span className={`text-[8px] font-bold ${
                                                    isCorrect ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : "text-rose-400 bg-rose-500/10 border-rose-500/20"
                                                } px-2 py-0.5 rounded border font-mono`}>Q{i+1}</span>
                                                <h4 className="text-xs md:text-sm font-bold text-white leading-snug">{q.question || q.q}</h4>
                                            </div>
                                            <span className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                                                isCorrect ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                                            }`}>{isCorrect ? "Correct" : "Wrong"}</span>
                                        </div>
                                        <div className="pl-0 md:pl-8 space-y-2 text-xs">
                                            <div className="flex items-center gap-2 text-slate-400">
                                                <span className="font-mono text-[9px] uppercase tracking-wider text-slate-500">Your Selection:</span>
                                                <span className={isCorrect ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                                                    {userChoice !== null ? String.fromCharCode(65 + userChoice) + ". " + q.options[userChoice] : "[No Selection]"}
                                                </span>
                                            </div>
                                            {!isCorrect && (
                                                <div className="flex items-center gap-2 text-slate-400">
                                                    <span className="font-mono text-[9px] uppercase tracking-wider text-slate-500">Correct Key:</span>
                                                    <span className="text-emerald-400 font-bold">
                                                        {String.fromCharCode(65 + correctIdx)}. {q.options[correctIdx]}
                                                    </span>
                                                </div>
                                            )}
                                            {q.explanation && (
                                                <div className="bg-slate-950/20 border border-white/5 rounded-lg p-3 text-[10px] text-slate-400 leading-normal mt-2">
                                                    <strong className="text-cyan-400 font-bold mr-1">EXPLANATION:</strong> {q.explanation}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Actions footer */}
                    <div className="fixed bottom-0 left-0 w-full p-4 bg-slate-950/90 backdrop-blur-xl border-t border-white/5 flex justify-center gap-4 z-20">
                        <button 
                            onClick={() => setScreen("DASHBOARD")}
                            className="bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl py-3 px-8 text-xs font-bold uppercase tracking-wider active:scale-95 transition-all"
                        >
                            Retake Simulator
                        </button>
                        <button 
                            onClick={() => navigate("/dashboard")}
                            className="btn-primary text-white rounded-xl py-3 px-8 text-xs font-bold uppercase tracking-wider active:scale-95 transition-all"
                        >
                            Return to Dashboard
                        </button>
                    </div>

                </div>
            )}

        </div>
    );
}
