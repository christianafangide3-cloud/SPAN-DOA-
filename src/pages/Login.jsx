import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    updateProfile, 
    signInWithPopup, 
    GoogleAuthProvider 
} from "firebase/auth";
import { auth } from "../firebase";

export default function Login() {
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [timeoutMessage, setTimeoutMessage] = useState(false);

    // Countdown State
    const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        if (user) {
            navigate("/dashboard");
        }
        if (localStorage.getItem("session_timeout") === "true") {
            setTimeoutMessage(true);
            localStorage.removeItem("session_timeout");
        }
    }, [user, navigate]);

    // Dynamic countdown shifting logic
    useEffect(() => {
        const getNextExamDate = () => {
            const now = new Date();
            let currentYear = now.getFullYear();
            
            // Core target: March 23
            let targetDate = new Date(`March 23, ${currentYear} 09:00:00`);
            
            if (now > targetDate) {
                // If past March 23, shift to next year
                targetDate = new Date(`March 23, ${currentYear + 1} 09:00:00`);
            }
            return targetDate;
        };

        const target = getNextExamDate();

        const updateTimer = () => {
            const now = new Date().getTime();
            const distance = target.getTime() - now;

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

        updateTimer();
        const timerId = setInterval(updateTimer, 1000);
        return () => clearInterval(timerId);
    }, []);

    const handleAuth = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            if (isRegister) {
                if (!displayName.trim()) {
                    throw new Error("Display name is required.");
                }
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                await updateProfile(userCredential.user, { displayName });
            } else {
                await signInWithEmailAndPassword(auth, email, password);
            }
            navigate("/dashboard");
        } catch (err) {
            setError(err.message.replace("Firebase: ", ""));
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setError("");
        setLoading(true);
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            navigate("/dashboard");
        } catch (err) {
            setError(err.message.replace("Firebase: ", ""));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex flex-col justify-center items-center p-4 overflow-hidden">
            {/* Ambient Background */}
            <div className="ambient-bg"></div>
            <div className="ambient-flare-1"></div>
            <div className="ambient-flare-2"></div>

            <main className="max-w-md w-full relative z-10 space-y-6">
                
                {/* Header Logo */}
                <div className="text-center space-y-2">
                    <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-cyan to-brand-blue items-center justify-center text-white text-2xl shadow-lg shadow-cyan-500/20 glow-cyan">
                        <i className="fas fa-graduation-cap"></i>
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-white font-sans mt-3">
                        Splendid's Academy
                    </h1>
                    <p className="text-xs text-slate-400 font-mono tracking-widest uppercase">
                        DOA STUDY PREP PORTAL
                    </p>
                </div>

                {/* Session Timeout Banner */}
                {timeoutMessage && (
                    <div className="glass-card rounded-2xl p-4 border-rose-500/20 bg-rose-950/20 text-rose-300 text-xs text-center font-medium animate-fade-in">
                        <i className="fas fa-exclamation-triangle mr-2"></i> Session expired due to 15 minutes of inactivity. Please log in again.
                    </div>
                )}

                {/* Form Card */}
                <div className="glass-card rounded-3xl p-8 border border-white/5 shadow-2xl relative">
                    <h2 className="text-lg font-bold text-white mb-6 font-mono tracking-wide">
                        {isRegister ? "// CREATE ACCOUNT" : "// AUTHORIZE SESSION"}
                    </h2>

                    {error && (
                        <div className="mb-4 text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 p-3.5 rounded-xl">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleAuth} className="space-y-4">
                        {isRegister && (
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                                    Display Name
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 text-xs">
                                        <i className="fas fa-user"></i>
                                    </span>
                                    <input 
                                        type="text" 
                                        required 
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                        placeholder="Dr. John Doe"
                                        className="w-full bg-slate-900/60 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/40 transition-all font-medium"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                                Email Address
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 text-xs">
                                    <i className="fas fa-envelope"></i>
                                </span>
                                <input 
                                    type="email" 
                                    required 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="yourname@student.edu"
                                    className="w-full bg-slate-900/60 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/40 transition-all font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                                Password
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 text-xs">
                                    <i className="fas fa-lock"></i>
                                </span>
                                <input 
                                    type="password" 
                                    required 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-slate-900/60 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/40 transition-all font-medium"
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full btn-primary text-white py-3.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider font-sans mt-4 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <i className="fas fa-circle-notch animate-spin text-sm"></i>
                            ) : (
                                <>
                                    <i className="fas fa-shield-halved"></i>
                                    {isRegister ? "Sign Up & Initialize" : "Verify & Access"}
                                </>
                            )}
                        </button>
                    </form>

                    <div className="relative flex py-4 items-center">
                        <div className="flex-grow border-t border-white/5"></div>
                        <span className="flex-shrink mx-4 text-[9px] font-bold text-slate-600 uppercase tracking-wider font-mono">or</span>
                        <div className="flex-grow border-t border-white/5"></div>
                    </div>

                    <button 
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                        className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl py-3 text-xs font-bold text-white tracking-wide transition-all flex items-center justify-center gap-2"
                    >
                        <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24">
                            <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.466 0-6.277-2.85-6.277-6.36s2.81-6.36 6.277-6.36c1.558 0 2.973.57 4.07 1.5l3.057-3.057C18.995 2.215 15.82 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c5.84 0 10.74-4.2 10.74-10.435 0-.676-.08-1.328-.24-1.93l-10.5 1.17z"/>
                        </svg>
                        Sign in with Google
                    </button>

                    <div className="mt-6 text-center">
                        <button 
                            onClick={() => {
                                setIsRegister(!isRegister);
                                setError("");
                            }}
                            className="text-xs text-slate-400 hover:text-cyan-400 transition-colors font-medium"
                        >
                            {isRegister ? "Already registered? Sign In" : "Need credentials? Request Access"}
                        </button>
                    </div>
                </div>

                {/* Exam Countdown Widget */}
                <div className="glass-card rounded-2xl p-5 border border-white/5 text-center">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono mb-3">
                        <i className="fas fa-hourglass-half text-cyan-400 mr-1.5"></i> Countdown to Profs Exam
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                        <div className="bg-slate-950/60 p-2.5 rounded-xl border border-white/5">
                            <div className="text-xl font-bold font-mono text-cyan-400 leading-none">{countdown.days}</div>
                            <div className="text-[8px] text-slate-500 uppercase tracking-widest font-mono mt-1">Days</div>
                        </div>
                        <div className="bg-slate-950/60 p-2.5 rounded-xl border border-white/5">
                            <div className="text-xl font-bold font-mono text-cyan-400 leading-none">{countdown.hours}</div>
                            <div className="text-[8px] text-slate-500 uppercase tracking-widest font-mono mt-1">Hours</div>
                        </div>
                        <div className="bg-slate-950/60 p-2.5 rounded-xl border border-white/5">
                            <div className="text-xl font-bold font-mono text-cyan-400 leading-none">{countdown.minutes}</div>
                            <div className="text-[8px] text-slate-500 uppercase tracking-widest font-mono mt-1">Mins</div>
                        </div>
                        <div className="bg-slate-950/60 p-2.5 rounded-xl border border-white/5">
                            <div className="text-xl font-bold font-mono text-cyan-400 leading-none">{countdown.seconds}</div>
                            <div className="text-[8px] text-slate-500 uppercase tracking-widest font-mono mt-1">Secs</div>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}
