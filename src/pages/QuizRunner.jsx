import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { QUESTION_VAULT } from "../data/questions";

export default function QuizRunner() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const courseCode = searchParams.get("course") || "ANA 211";
    const level = searchParams.get("level") || "beginner";

    const [questions, setQuestions] = useState([]);
    const [currentQ, setCurrentQ] = useState(0);
    const [userAnswers, setUserAnswers] = useState([]);
    const [timeLeft, setTimeLeft] = useState(600); // 10 Minutes
    const [isFinished, setIsFinished] = useState(false);
    const [isReviewMode, setIsReviewMode] = useState(false);
    const [score, setScore] = useState(0);
    
    const timerRef = useRef(null);

    // Initialize Questions
    useEffect(() => {
        let rawQuestions = [];
        if (QUESTION_VAULT[courseCode] && QUESTION_VAULT[courseCode][level]) {
            rawQuestions = QUESTION_VAULT[courseCode][level];
        } else {
            rawQuestions = [{ q: "Database link error. Course/Level data not found.", options: ["Back"], a: 0 }];
        }

        // Shuffle questions
        const shuffled = [...rawQuestions].sort(() => Math.random() - 0.5);
        setQuestions(shuffled);
        setUserAnswers(new Array(shuffled.length).fill(null));
        setTimeLeft(600);
        setIsFinished(false);
        setIsReviewMode(false);
    }, [courseCode, level]);

    // Timer Interval Hook
    useEffect(() => {
        if (isFinished || isReviewMode || questions.length === 0) return;

        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    handleSubmitQuiz();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isFinished, isReviewMode, questions]);

    const handleSelectOption = (optionIndex) => {
        const updated = [...userAnswers];
        updated[currentQ] = optionIndex;
        setUserAnswers(updated);
    };

    const handleNext = () => {
        if (currentQ < questions.length - 1) {
            setCurrentQ((prev) => prev + 1);
        } else {
            handleSubmitQuiz();
        }
    };

    const handlePrev = () => {
        if (currentQ > 0) {
            setCurrentQ((prev) => prev - 1);
        }
    };

    const handleSubmitQuiz = async () => {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsFinished(true);

        let correct = 0;
        questions.forEach((q, i) => {
            const actualAnswer = q.correctAnswer !== undefined ? q.correctAnswer : q.a;
            if (userAnswers[i] === actualAnswer) correct++;
        });

        const percentScore = Math.round((correct / questions.length) * 100);
        setScore(percentScore);

        // Progression check
        if (percentScore >= 50) {
            localStorage.setItem(`${courseCode}_${level}_passed`, "true");
        }

        // Write score to Firestore
        if (user) {
            try {
                await addDoc(collection(db, "scores"), {
                    uid: user.uid,
                    displayName: user.displayName || "Anonymous Student",
                    email: user.email,
                    course: courseCode,
                    level: level,
                    score: percentScore,
                    timestamp: serverTimestamp()
                });
            } catch (err) {
                console.error("Failed to write score to Firestore: ", err);
            }
        }
    };

    const getTimerClass = () => {
        if (timeLeft <= 60) {
            return "border-rose-500/50 bg-rose-950/20 text-rose-400";
        }
        return "border-white/5 bg-slate-950/40 text-white";
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, "0");
        const s = (seconds % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };

    if (questions.length === 0) {
        return (
            <div className="flex justify-center items-center h-64 text-slate-500 font-mono text-xs uppercase tracking-wider">
                <i className="fas fa-circle-notch animate-spin mr-2"></i> Initializing Exam Session...
            </div>
        );
    }

    const currentQuestion = questions[currentQ];
    const progressPct = ((currentQ + 1) / questions.length) * 100;

    return (
        <div className="space-y-6 pt-16 max-w-3xl mx-auto w-full relative z-10">
            
            {/* Top Navigation */}
            <div className="fixed top-0 left-0 right-0 h-16 bg-[#0a0f1e]/90 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 z-30">
                <div>
                    <h1 className="text-[9px] font-bold text-cyan-400 uppercase tracking-widest font-mono leading-none">
                        {courseCode} • {level.toUpperCase()}
                    </h1>
                    <div className="font-bold text-white text-sm tracking-tight font-sans mt-1">Active Assessment</div>
                </div>
                {!isReviewMode && !isFinished && (
                    <div className={`px-4 py-2 rounded-xl flex items-center gap-2 border shadow-inner transition-colors font-mono font-bold text-sm tracking-wider ${getTimerClass()}`}>
                        <i className={`fas fa-clock ${timeLeft <= 60 ? "text-rose-500 animate-pulse" : "text-cyan-400"} text-sm`}></i>
                        <span>{formatTime(timeLeft)}</span>
                    </div>
                )}
            </div>

            {/* Progress Bar */}
            {!isReviewMode && (
                <div className="fixed top-16 left-0 right-0 h-1 bg-slate-950/40 border-b border-white/5 z-30">
                    <div 
                        className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-full transition-all duration-300 shadow-[0_0_10px_rgba(6,182,212,0.8)]" 
                        style={{ width: `${progressPct}%` }}
                    ></div>
                </div>
            )}

            {/* Quiz Card */}
            {!isReviewMode && !isFinished && (
                <div className="glass-card rounded-3xl overflow-hidden border border-white/5">
                    <div className="p-6 md:p-10 space-y-6">
                        <div className="flex justify-between items-center">
                            <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 text-[10px] md:text-xs font-bold px-3 py-1.5 rounded-xl uppercase tracking-widest font-mono">
                                Q: {currentQ + 1} / {questions.length}
                            </span>
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest bg-slate-950/40 px-3 py-1.5 rounded-xl border border-white/5 font-mono">
                                Exam Protocol
                            </span>
                        </div>

                        <h2 className="text-base md:text-lg font-bold text-white leading-relaxed tracking-tight">
                            {currentQuestion.question || currentQuestion.q}
                        </h2>

                        <div className="space-y-3 pt-2">
                            {currentQuestion.options.map((opt, index) => {
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
                            className="px-5 py-3 rounded-xl text-slate-400 font-bold hover:text-white hover:bg-white/5 transition-all text-xs uppercase tracking-widest font-mono disabled:opacity-30 disabled:hover:bg-transparent"
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
            )}

            {/* Review Area */}
            {isReviewMode && (
                <div className="space-y-6 pb-20 animate-fade-in">
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-extrabold text-white tracking-tight">
                            <i className="fas fa-search text-cyan-400 mr-1"></i> Deep Review Analysis
                        </h2>
                        <p className="text-slate-400 font-mono uppercase tracking-wider text-xs">Evaluate your performance against the master key.</p>
                    </div>

                    <div className="space-y-4">
                        {questions.map((q, i) => {
                            const userChoice = userAnswers[i];
                            const actualAnswer = q.correctAnswer !== undefined ? q.correctAnswer : q.a;
                            const isCorrect = userChoice === actualAnswer;

                            return (
                                <div 
                                    key={i}
                                    className={`glass-card p-6 md:p-8 rounded-3xl border border-white/5 border-l-4 ${
                                        isCorrect ? "border-l-emerald-500" : "border-l-rose-500"
                                    }`}
                                >
                                    <div className="flex items-start gap-4 mb-4">
                                        <span className={`text-[9px] font-bold ${
                                            isCorrect 
                                                ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" 
                                                : "text-rose-400 bg-rose-500/10 border-rose-500/20"
                                        } px-2.5 py-1 rounded-lg border flex-shrink-0 font-mono`}>
                                            Q{i + 1}
                                        </span>
                                        <h3 className="font-bold text-white text-sm md:text-base leading-snug">{q.question || q.q}</h3>
                                    </div>
                                    <div className="pl-0 md:pl-10 space-y-2.5">
                                        {q.options.map((opt, idx) => {
                                            let classes = "p-4 rounded-xl border border-white/5 text-xs md:text-sm text-slate-400 bg-slate-950/20 flex items-center";
                                            let iconHtml = (
                                                <div className="w-5 h-5 rounded-full border border-slate-600 flex items-center justify-center text-[9px] mr-3 flex-shrink-0 font-mono">
                                                    {String.fromCharCode(65 + idx)}
                                                </div>
                                            );

                                            if (idx === actualAnswer) {
                                                classes = "p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs md:text-sm flex items-center font-bold";
                                                iconHtml = <i className="fas fa-check-circle mr-3 text-sm flex-shrink-0"></i>;
                                            } else if (idx === userChoice && !isCorrect) {
                                                classes = "p-4 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-400 text-xs md:text-sm flex items-center font-bold";
                                                iconHtml = <i className="fas fa-times-circle mr-3 text-sm flex-shrink-0"></i>;
                                            }

                                            return (
                                                <div key={idx} className={classes}>
                                                    {iconHtml}
                                                    <span>{opt}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="fixed bottom-0 left-0 w-full p-4 bg-slate-950/90 backdrop-blur-xl border-t border-white/5 flex justify-center z-20">
                        <button 
                            onClick={() => navigate(`/cbt/levels?course=${encodeURIComponent(courseCode)}`)} 
                            className="btn-primary px-10 py-4 rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg flex items-center gap-2 active:scale-95 transition-all"
                        >
                            <i className="fas fa-check-double text-[10px]"></i> Conclude Review
                        </button>
                    </div>
                </div>
            )}

            {/* Result Modal */}
            {isFinished && !isReviewMode && (
                <div className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center backdrop-blur-md p-4 animate-fade-in">
                    <div className="glass-card rounded-[2rem] p-8 md:p-10 max-w-md w-full text-center relative overflow-hidden border border-cyan-500/25 shadow-2xl">
                        <div className="absolute -right-10 -top-10 text-[10rem] opacity-[0.02] text-white rotate-12"><i class="fas fa-chart-pie"></i></div>
                        
                        <div className="relative z-10 space-y-6">
                            <div className={`h-20 w-20 rounded-full flex items-center justify-center text-3xl mx-auto shadow-lg ${
                                score >= 50 
                                    ? "bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-emerald-500/20" 
                                    : "bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-red-500/20"
                            }`}>
                                <i className={`fas ${score >= 50 ? "fa-shield-check" : "fa-times"}`}></i>
                            </div>

                            <div>
                                <h2 className="text-2xl font-extrabold text-white tracking-tight">
                                    {score >= 50 ? "Protocol Cleared" : "Protocol Failed"}
                                </h2>
                                <p className="text-slate-400 text-xs mt-1 font-mono uppercase tracking-wider">
                                    Diagnostic Score: 
                                    <span className={`font-extrabold text-lg ml-1 font-mono ${score >= 50 ? "text-emerald-400" : "text-rose-400"}`}>
                                        {score}%
                                    </span>
                                </p>
                            </div>

                            {score >= 50 && (
                                <div className="bg-emerald-500/10 border border-emerald-500/25 p-4 rounded-2xl">
                                    <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center justify-center gap-2 font-mono">
                                        <i className="fas fa-unlock-alt text-sm"></i> Progression Unlocked
                                    </p>
                                </div>
                            )}

                            <div className="space-y-3 pt-2">
                                <button 
                                    onClick={() => setIsReviewMode(true)} 
                                    className="w-full py-3.5 bg-white/5 border border-white/10 text-white rounded-xl font-bold hover:bg-white/10 transition-colors flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                                >
                                    <i className="fas fa-search text-[10px]"></i> Deep Review
                                </button>
                                <button 
                                    onClick={() => navigate(`/cbt/levels?course=${encodeURIComponent(courseCode)}`)} 
                                    className="w-full py-3.5 btn-primary text-white rounded-xl font-bold uppercase tracking-widest text-xs"
                                >
                                    Return to Hub
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
