import React, { useState, useEffect } from "react";

export default function Testimonials() {
    const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR4AB6QedzFfEmg3N8vu7Ds-5HyZQAm5dy-wshxwI84C4l5yeTR8y1OsdgiYHh-V0TR_0ZH3gO26Dlj/pub?gid=1368247944&single=true&output=csv";

    const [allTestimonials, setAllTestimonials] = useState([]);
    const [activeFilter, setActiveFilter] = useState("ALL");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [stats, setStats] = useState({ total: 0, avg: 0, fiveStar: 0 });

    const parseCSV = (text) => {
        const rows = [];
        const lines = text.split("\n");
        for (const line of lines) {
            if (!line.trim()) continue;
            const cols = [];
            let cur = "", inQ = false;
            for (let i = 0; i < line.length; i++) {
                const c = line[i];
                if (c === '"' && !inQ) { inQ = true; }
                else if (c === '"' && inQ && line[i+1] === '"') { cur += '"'; i++; }
                else if (c === '"' && inQ) { inQ = false; }
                else if (c === "," && !inQ) { cols.push(cur.trim()); cur = ""; }
                else { cur += c; }
            }
            cols.push(cur.trim());
            rows.push(cols);
        }
        return rows;
    };

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const res = await fetch(SHEET_CSV_URL);
                if (!res.ok) throw new Error("Network response error");
                const csv = await res.text();
                const rows = parseCSV(csv);
                
                const list = rows.slice(1).map(r => {
                    let rawFeedback = "";
                    if (r[9] && r[9].length > 3 && r[9].toLowerCase() !== "yes") rawFeedback += r[9] + ". ";
                    if (r[14]) rawFeedback += r[14];
                    
                    return {
                        timestamp: r[0] || "",
                        name:      r[1] || r[13] || "Anonymous", 
                        course:    r[2] || "Student",            
                        rating:    parseInt(r[12]) || 5,         
                        feedback:  rawFeedback.trim()
                    };
                }).filter(t => t.feedback.length > 5).reverse(); 

                setAllTestimonials(list);
                
                // Calculate Stats
                const total = list.length;
                const avg = total ? (list.reduce((a, t) => a + t.rating, 0) / total).toFixed(1) : "0.0";
                const fiveStar = list.filter(t => t.rating === 5).length;
                
                setStats({ total, avg, fiveStar });
                setLoading(false);
            } catch (err) {
                console.error("Testimonial fetch error: ", err);
                setError(true);
                setLoading(false);
            }
        };

        fetchTestimonials();
    }, []);

    const filteredList = activeFilter === "ALL" 
        ? allTestimonials 
        : allTestimonials.filter(t => t.course.toUpperCase().replace(/\s/g, "").includes(activeFilter.replace(/\s/g, "")));

    return (
        <div className="max-w-4xl w-full mx-auto p-4 space-y-8 relative z-10">
            
            {/* Title Header */}
            <div className="text-center space-y-4 mt-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-white/5">
                    <span className="text-[9px] font-bold tracking-widest uppercase text-cyan-400 font-mono">
                        <i className="fas fa-comment-dots mr-1"></i> Student Voices
                    </span>
                </div>
                <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
                    What Students Say About <em>Splendid's Academy</em>
                </h1>
                <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                    Real feedback from medical students who prepared for their exams using this platform.
                </p>
                <a 
                    href="https://docs.google.com/forms/d/e/1FAIpQLSegu788mPLfm1pgg_L5YEnYTmtJvnf9ZfD6-p0xU3IzLq-uFw/viewform?usp=header" 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex btn-primary text-white font-bold py-3.5 px-8 rounded-xl text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all"
                >
                    <i className="fas fa-pen text-[10px] mr-1"></i> Leave Your Feedback
                </a>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-4">
                <div className="glass-card p-4 rounded-2xl border border-white/5 text-center">
                    <div className="text-2xl font-bold font-mono text-cyan-400 mt-1" id="stat-total">{stats.total}</div>
                    <div className="text-[9px] text-slate-500 uppercase tracking-widest font-mono mt-1">Total Reviews</div>
                </div>
                <div className="glass-card p-4 rounded-2xl border border-white/5 text-center">
                    <div className="text-2xl font-bold font-mono text-amber-400 mt-1" id="stat-avg">{stats.avg} ★</div>
                    <div className="text-[9px] text-slate-500 uppercase tracking-widest font-mono mt-1">Average Rating</div>
                </div>
                <div className="glass-card p-4 rounded-2xl border border-white/5 text-center">
                    <div className="text-2xl font-bold font-mono text-emerald-400 mt-1" id="stat-five">{stats.fiveStar}</div>
                    <div className="text-[9px] text-slate-500 uppercase tracking-widest font-mono mt-1">5-Star Reviews</div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 flex-wrap justify-center">
                {["ALL", "PHYSIOLOGY", "ANATOMY"].map((dept) => (
                    <button 
                        key={dept}
                        onClick={() => setActiveFilter(dept)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-bold tracking-widest uppercase transition-all font-mono ${
                            activeFilter === dept 
                                ? "bg-cyan-500/10 border border-cyan-500/20 text-cyan-400" 
                                : "bg-white/5 border border-white/10 text-slate-400"
                        }`}
                    >
                        {dept} Reviews
                    </button>
                ))}
            </div>

            {/* Cards Container */}
            {loading ? (
                <div className="text-center py-12 text-slate-500 font-mono text-xs uppercase tracking-widest">
                    <i className="fas fa-circle-notch animate-spin text-cyan-400 text-lg mb-2 block"></i> Loading reviews...
                </div>
            ) : error ? (
                <div className="glass-card rounded-2xl p-6 border border-white/5 text-center text-rose-400 font-mono text-xs uppercase tracking-widest">
                    <i className="fas fa-plug text-lg mb-1 block"></i> Could not load testimonials. Database sync failed.
                </div>
            ) : filteredList.length === 0 ? (
                <div className="glass-card rounded-2xl p-6 border border-white/5 text-center text-slate-500 font-mono text-xs uppercase tracking-widest">
                    <i className="fas fa-comment-slash text-lg mb-1 block"></i> No reviews collected yet.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredList.map((t, index) => {
                        const initials = t.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "?";
                        const stars = Array.from({ length: 5 }, (_, i) => (
                            <span key={i} className={`text-[10px] ${i < t.rating ? "text-amber-400" : "text-slate-700"}`}>
                                <i className="fas fa-star"></i>
                            </span>
                        ));

                        let badgeText = t.course.toUpperCase();
                        if (badgeText.includes("PHYSIOLOGY")) badgeText = "PHYSIOLOGY";

                        return (
                            <div key={index} className="glass-card rounded-2xl p-6 border border-white/5 relative flex flex-col justify-between group">
                                <span className="absolute top-4 right-4 text-[8px] font-mono bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-2 py-1 rounded font-bold">{badgeText}</span>
                                <div className="space-y-4">
                                    <div className="text-4xl text-cyan-400 opacity-20 font-bold leading-none select-none">“</div>
                                    <div className="text-xs text-slate-300 leading-relaxed font-medium">{t.feedback}</div>
                                </div>
                                <div className="flex items-center justify-between pt-6 mt-4 border-t border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-xs font-black text-cyan-400">{initials}</div>
                                        <div>
                                            <div className="text-xs font-bold text-white leading-tight">{t.name}</div>
                                            <div className="text-[9px] text-slate-500 uppercase tracking-widest font-mono mt-0.5">{t.course}</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-0.5">{stars}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

        </div>
    );
}
