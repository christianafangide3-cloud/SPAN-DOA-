import React, { useState } from "react";

export default function Notes() {
    const resources = [
        { title: "Upper Limb Osteology Guide", category: "Anatomy", file: "ANA_211_Osteology.pdf", desc: "Clavicle, scapula, humerus, radius, and ulna bony markings.", size: "4.2 MB", icon: "fa-bone", color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" },
        { title: "Brachial Plexus Blueprint", category: "Anatomy", file: "ANA_211_Plexus.pdf", desc: "Detailed breakdown of roots, trunks, divisions, cords, and terminal nerves.", size: "2.1 MB", icon: "fa-network-wired", color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" },
        { title: "Weeks 1 & 2 Embryology Summary", category: "Anatomy", file: "ANA_213_Weeks1_2.pdf", desc: "Complete timeline from fertilization to the bilaminar disc.", size: "3.5 MB", icon: "fa-dna", color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
        { title: "Gastrulation & Germ Layers", category: "Anatomy", file: "ANA_213_Gastrulation.pdf", desc: "Invagination, FGF8 signaling, and definitive trilaminar disc derivatives.", size: "1.8 MB", icon: "fa-layer-group", color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
        { title: "Plasma & Hematopoiesis Notes", category: "Physiology", file: "PHS_211_Blood.pdf", desc: "Erythropoiesis feedback regulation and anemia classification indices.", size: "2.8 MB", icon: "fa-droplet", color: "text-rose-400 bg-rose-500/10 border-rose-500/20" },
        { title: "ECG Waveform Analysis Sheet", category: "Physiology", file: "PHS_212_ECG.pdf", desc: "P-wave, QRS-complex, and T-wave pathology vectors.", size: "5.4 MB", icon: "fa-heart-pulse", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
        { title: "Pulmonary Ventilation Mechanics", category: "Physiology", file: "PHS_213_Respiration.pdf", desc: "Intrapleural pressure, compliance curves, and spirometry volumes.", size: "3.1 MB", icon: "fa-lungs", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
        { title: "Renal Clearance Formulas", category: "Physiology", file: "PHS_214_Renal.pdf", desc: "GFR, reabsorption ratio, and countercurrent multipliers.", size: "1.6 MB", icon: "fa-calculator", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" }
    ];

    const [search, setSearch] = useState("");
    const [activeFilter, setActiveFilter] = useState("All");

    const categories = ["All", "Anatomy", "Physiology"];

    const filteredResources = resources.filter((res) => {
        const matchesSearch = res.title.toLowerCase().includes(search.toLowerCase()) || 
                              res.desc.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = activeFilter === "All" || res.category === activeFilter;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="max-w-4xl w-full mx-auto p-4 space-y-6 relative z-10">
            
            {/* Title */}
            <div className="text-center space-y-2 py-4">
                <span className="text-[10px] font-bold text-cyan-400 font-mono tracking-widest uppercase">
                    // CENTRAL STUDY REPOSITORY
                </span>
                <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">Resource Library</h1>
                <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                    Search and download note archives, slide blueprints, and curriculum worksheets.
                </p>
            </div>

            {/* Filters & Search Row */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-900/40 p-4 rounded-2xl border border-white/5 backdrop-filter backdrop-blur-md">
                
                {/* Categories */}
                <div className="flex gap-2">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveFilter(cat)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-bold tracking-widest uppercase font-mono transition-all ${
                                activeFilter === cat 
                                    ? "bg-cyan-500/10 border border-cyan-500/25 text-cyan-400" 
                                    : "bg-white/5 border border-white/10 text-slate-400 hover:text-slate-200"
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Search Input */}
                <div className="relative w-full sm:w-72">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 text-xs">
                        <i className="fas fa-magnifying-glass"></i>
                    </span>
                    <input 
                        type="text" 
                        placeholder="Search resources..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-slate-950/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400/50 transition-colors"
                    />
                </div>
            </div>

            {/* Resources Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredResources.map((res, index) => (
                    <div 
                        key={index}
                        className="glass-card rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all flex justify-between gap-4"
                    >
                        <div className="flex gap-4">
                            <div className={`w-10 h-10 rounded-xl border flex-shrink-0 flex items-center justify-center ${res.color}`}>
                                <i className={`fas ${res.icon} text-sm`}></i>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-xs font-bold text-white group-hover:text-cyan-400 leading-tight">
                                    {res.title}
                                </h3>
                                <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                                    {res.desc}
                                </p>
                                <span className="text-[9px] text-slate-500 font-mono tracking-wide block pt-1.5">
                                    {res.file} ({res.size})
                                </span>
                            </div>
                        </div>
                        <a 
                            href={`https://cortex-hub-seven.vercel.app/notes?topic=${encodeURIComponent(res.title)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-400/30 transition-all active:scale-90 flex-shrink-0 self-center"
                            title="Read Securely on Cortex Hub"
                        >
                            <i className="fas fa-eye text-xs"></i>
                        </a>
                    </div>
                ))}
            </div>

            {filteredResources.length === 0 && (
                <div className="text-center py-16 text-slate-500 font-mono text-xs uppercase tracking-widest">
                    <i className="fas fa-folder-open text-slate-700 text-2xl mb-1 block"></i> No resources match search filters.
                </div>
            )}

        </div>
    );
}
