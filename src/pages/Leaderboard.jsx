import React, { useState, useEffect } from "react";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

export default function Leaderboard() {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Query top 20 scores sorted by score descending, then by timestamp descending
        const q = query(
            collection(db, "scores"),
            orderBy("score", "desc"),
            orderBy("timestamp", "desc"),
            limit(20)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const list = [];
            snapshot.forEach((doc) => {
                list.push({ id: doc.id, ...doc.data() });
            });
            setLeaderboard(list);
            setLoading(false);
        }, (error) => {
            console.error("Failed to fetch leaderboard: ", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const getRankStyle = (index) => {
        if (index === 0) return "text-amber-400 font-extrabold text-sm"; // Gold
        if (index === 1) return "text-slate-300 font-extrabold text-sm"; // Silver
        if (index === 2) return "text-amber-600 font-extrabold text-sm"; // Bronze
        return "text-slate-500 font-semibold text-xs";
    };

    const getMedalIcon = (index) => {
        if (index === 0) return <i className="fas fa-trophy text-amber-400 mr-1.5 text-xs animate-bounce"></i>;
        if (index === 1) return <i className="fas fa-medal text-slate-300 mr-1.5 text-xs"></i>;
        if (index === 2) return <i className="fas fa-medal text-amber-600 mr-1.5 text-xs"></i>;
        return null;
    };

    return (
        <div className="max-w-4xl w-full mx-auto p-4 space-y-6 relative z-10">
            
            {/* Title Header */}
            <div className="text-center space-y-2 mt-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-white/5">
                    <span className="text-[9px] font-bold tracking-widest uppercase text-amber-400 font-mono">
                        <i className="fas fa-crown mr-1"></i> Live Honor Roll
                    </span>
                </div>
                <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight font-sans">
                    Academic Honor Roll
                </h1>
                <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                    Celebrating real-time test scores and student achievements across all tracks.
                </p>
            </div>

            {/* Leaderboard Table Card */}
            <div className="glass-card rounded-3xl border border-white/5 shadow-xl overflow-hidden mt-6">
                <div className="bg-slate-950/40 px-6 py-4 border-b border-white/5 flex items-center justify-between">
                    <h2 className="text-xs font-bold text-slate-300 uppercase tracking-widest font-mono">
                        // TOP PERFORMERS
                    </h2>
                    <span className="text-[9px] font-bold text-cyan-400 font-mono tracking-widest uppercase bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded">
                        Firestore synced
                    </span>
                </div>

                {loading ? (
                    <div className="text-center py-16 text-slate-500 font-mono text-xs uppercase tracking-widest">
                        <i className="fas fa-circle-notch animate-spin text-cyan-400 text-lg mb-2 block"></i> Loading scores...
                    </div>
                ) : leaderboard.length === 0 ? (
                    <div className="text-center py-16 text-slate-500 font-mono text-xs uppercase tracking-widest space-y-2">
                        <i className="fas fa-award text-slate-700 text-2xl mb-1 block"></i>
                        <div>No student scores logged yet.</div>
                        <p className="text-[9px] text-slate-600 normal-case">Be the first to complete a quiz and claim rank #1!</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono">
                                    <th className="px-6 py-4 text-center w-16">Rank</th>
                                    <th className="px-6 py-4">Student</th>
                                    <th className="px-6 py-4">Course Track</th>
                                    <th className="px-6 py-4">Difficulty</th>
                                    <th className="px-6 py-4 text-right">Score</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {leaderboard.map((row, index) => (
                                    <tr 
                                        key={row.id}
                                        className="hover:bg-white/5 transition-colors duration-150 group"
                                    >
                                        <td className="px-6 py-4 text-center font-mono font-bold">
                                            <span className={getRankStyle(index)}>
                                                #{index + 1}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-bold text-xs text-slate-300 font-mono">
                                                    {row.displayName.split(" ").map(n=>n[0]).join("").toUpperCase().slice(0,2) || "S"}
                                                </div>
                                                <div>
                                                    <div className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors flex items-center">
                                                        {getMedalIcon(index)}
                                                        {row.displayName}
                                                    </div>
                                                    <span className="text-[9px] text-slate-500 block font-mono">
                                                        {row.timestamp ? new Date(row.timestamp.seconds * 1000).toLocaleDateString() : "Just now"}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-semibold text-slate-300">
                                                {row.course}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                                                row.level === "beginner" ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
                                                : row.level === "intermediate" ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                                                : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                                            }`}>
                                                {row.level}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-sm font-black font-mono text-emerald-400">
                                                {row.score}%
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

        </div>
    );
}
