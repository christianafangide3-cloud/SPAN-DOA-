import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function DashboardLayout({ children }) {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navItems = [
        { path: "/dashboard", label: "Dashboard", icon: "fa-columns-solid fa-gauge-high" },
        { path: "/cbt", label: "CBT Simulator", icon: "fa-laptop-code" },
        { path: "/clinical", label: "Objective Vault", icon: "fa-notes-medical" },
        { path: "/flashcards", label: "Flashcards", icon: "fa-layer-group" },
        { path: "/calculator", label: "GP Forecaster", icon: "fa-calculator" },
        { path: "/map", label: "Embryology Map", icon: "fa-dna" },
        { path: "/notes", label: "Resource Library", icon: "fa-book-open" },
        { path: "/outline", label: "Syllabus Tracker", icon: "fa-list-check" },
        { path: "/profile", label: "Student ID Pass", icon: "fa-id-card-clip" },
        { path: "/testimonials", label: "Student Voices", icon: "fa-comment-dots" },
        { path: "/leaderboard", label: "Academic Honor Roll", icon: "fa-award" }
    ];

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/");
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-[#030712] text-slate-100 overflow-x-hidden">
            {/* Ambient Background & Flares */}
            <div className="ambient-bg"></div>
            <div className="ambient-flare-1"></div>
            <div className="ambient-flare-2"></div>

            {/* Mobile Header Bar */}
            <header className="md:hidden flex items-center justify-between p-4 bg-slate-950/80 border-b border-white/5 backdrop-filter backdrop-blur-lg fixed top-0 left-0 right-0 z-50">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white">
                        <i className="fas fa-graduation-cap text-xs"></i>
                    </div>
                    <span className="font-bold text-sm tracking-wider font-head uppercase text-cyan-400">Splendid's</span>
                </div>
                <button 
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 active:scale-95 transition-all"
                >
                    <i className={`fas ${sidebarOpen ? "fa-xmark" : "fa-bars"} text-sm`}></i>
                </button>
            </header>

            {/* Sidebar Navigation */}
            <aside className={`
                w-64 border-r border-white/5 bg-slate-950/40 backdrop-filter backdrop-blur-2xl flex flex-col justify-between
                fixed md:sticky top-0 bottom-0 left-0 z-40 transition-transform duration-300 md:translate-x-0
                ${sidebarOpen ? "translate-x-0 pt-20" : "-translate-x-full md:translate-x-0"}
            `}>
                <div className="p-5 space-y-6 flex-grow overflow-y-auto">
                    {/* Brand Logo */}
                    <div className="hidden md:flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-cyan-500/10">
                            <i className="fas fa-graduation-cap"></i>
                        </div>
                        <div>
                            <div className="font-extrabold text-base tracking-wider font-head text-white leading-none">Splendid's Academy</div>
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono">DOA Study Portal</span>
                        </div>
                    </div>

                    {/* Nav Links */}
                    <nav className="space-y-1.5 pt-2">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`
                                        flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200
                                        ${isActive 
                                            ? "bg-cyan-500/10 border border-cyan-500/25 text-cyan-400" 
                                            : "border border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5"}
                                    `}
                                >
                                    <span className="w-5 text-center flex items-center justify-center">
                                        <i className={`fas ${item.icon} text-sm`}></i>
                                    </span>
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Footer User Profile & Sign Out */}
                <div className="p-4 border-t border-white/5 bg-slate-950/60 backdrop-filter backdrop-blur-md space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-black text-xs font-mono">
                            {user?.displayName ? user.displayName.split(" ").map(n=>n[0]).join("").toUpperCase().slice(0,2) : "S"}
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="text-xs font-bold text-white truncate leading-tight">
                                {user?.displayName || "Student User"}
                            </div>
                            <span className="text-[9px] text-slate-500 font-mono truncate block">
                                {user?.email}
                            </span>
                        </div>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="w-full bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 rounded-xl py-2 text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 active:scale-95"
                    >
                        <i className="fas fa-right-from-bracket"></i>
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 pt-16 md:pt-0">
                <main className="flex-grow p-4 md:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
