import React, { useState, useEffect } from "react";

export default function Outline() {
    const sections = [
        {
            title: "ANATOMY: UPPER LIMB",
            items: [
                { id: "ana_1", label: "Pectoral & Scapular Regions (Muscles & Attachments)" },
                { id: "ana_2", label: "Axilla (Boundaries, Contents, & Axillary Artery branches)" },
                { id: "ana_3", label: "Brachial Plexus (Roots, Trunks, Divisions, Cords, & Branches)" },
                { id: "ana_4", label: "Arm & Cubital Fossa (Boundaries & Contents)" },
                { id: "ana_5", label: "Forearm & Hand (Muscles, Innervations, & Arterial arches)" },
                { id: "ana_6", label: "Joints: Shoulder, Elbow, & Radio-ulnar complex" }
            ]
        },
        {
            title: "ANATOMY: EMBRYOLOGY",
            items: [
                { id: "emb_1", label: "Gametogenesis (Spermatogenesis & Oogenesis steps)" },
                { id: "emb_2", label: "Weeks 1 & 2 (Fertilization, Cleavage, Blastocyst & Twos)" },
                { id: "emb_3", label: "Week 3 Gastrulation (Trilaminar Disc & Body Axes)" },
                { id: "emb_4", label: "Organogenesis (Ectoderm, Mesoderm, & Endoderm derivatives)" },
                { id: "emb_5", label: "Systemic Dev: Heart Tube, Pharyngeal arches, & Gut rotation" }
            ]
        },
        {
            title: "PHYSIOLOGY: BLOOD & MUSCLE",
            items: [
                { id: "phy_1", label: "Blood: Erythropoiesis, Hemoglobin synthesis, & Anemias" },
                { id: "phy_2", label: "Hemostasis: Platelet plug, Clotting cascade, & Fibrinolysis" },
                { id: "phy_3", label: "Excitation-Contraction Coupling in skeletal muscle" },
                { id: "phy_4", label: "Cardiovascular: Cardiac cycle, Hemodynamics, & ECG segments" },
                { id: "phy_5", label: "Respiratory: Ventilation, Gas transport, & Chemical control" }
            ]
        }
    ];

    const [checkedItems, setCheckedItems] = useState({});

    // Load initial states from localStorage
    useEffect(() => {
        const stored = {};
        sections.forEach(sec => {
            sec.items.forEach(item => {
                const val = localStorage.getItem(`outline_checked_${item.id}`);
                if (val === "true") {
                    stored[item.id] = true;
                }
            });
        });
        setCheckedItems(stored);
    }, []);

    const handleToggle = (id) => {
        const nextState = !checkedItems[id];
        const updated = { ...checkedItems, [id]: nextState };
        setCheckedItems(updated);
        
        if (nextState) {
            localStorage.setItem(`outline_checked_${id}`, "true");
        } else {
            localStorage.removeItem(`outline_checked_${id}`);
        }
    };

    // Calculate progress
    const totalItems = sections.reduce((acc, curr) => acc + curr.items.length, 0);
    const completedItems = Object.keys(checkedItems).filter(k => checkedItems[k]).length;
    const progressPct = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

    return (
        <div className="max-w-2xl w-full mx-auto p-4 space-y-6 relative z-10">
            
            {/* Title */}
            <div className="text-center space-y-2 mt-4">
                <span className="text-[10px] font-bold text-cyan-400 font-mono tracking-widest uppercase">
                    // BENCHMARK CHECKLIST
                </span>
                <h1 className="text-3xl font-extrabold text-white tracking-tight">Syllabus Tracker</h1>
                <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                    Track your curriculum targets and prepare systematically for final examinations.
                </p>
            </div>

            {/* Progress Card */}
            <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-3">
                <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Curriculum progress</span>
                    <span className="text-xs font-black font-mono text-cyan-400">{progressPct}% Completed ({completedItems}/{totalItems})</span>
                </div>
                <div className="w-full bg-slate-950/80 rounded-full h-2.5 border border-white/5 overflow-hidden p-0.5">
                    <div 
                        className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-full rounded-full transition-all duration-300"
                        style={{ width: `${progressPct}%` }}
                    ></div>
                </div>
            </div>

            {/* Checklist Blocks */}
            <div className="space-y-6">
                {sections.map((sec, secIdx) => (
                    <div key={secIdx} className="glass-card rounded-2xl p-6 border border-white/5 space-y-4">
                        <h3 className="text-xs font-bold text-cyan-400 font-mono tracking-wider uppercase border-b border-white/5 pb-2">
                            {sec.title}
                        </h3>
                        <div className="space-y-3">
                            {sec.items.map((item) => {
                                const isChecked = !!checkedItems[item.id];
                                return (
                                    <div 
                                        key={item.id}
                                        onClick={() => handleToggle(item.id)}
                                        className="flex items-center gap-3.5 p-3 hover:bg-white/5 rounded-xl cursor-pointer transition-colors group select-none"
                                    >
                                        <div className={`
                                            w-5 h-5 rounded-md border flex items-center justify-center transition-all flex-shrink-0
                                            ${isChecked 
                                                ? "border-emerald-500 bg-emerald-500/10 text-emerald-400" 
                                                : "border-slate-700 bg-slate-950/20 text-transparent group-hover:border-slate-500"}
                                        `}>
                                            <i className="fas fa-check text-[10px]"></i>
                                        </div>
                                        <span className={`text-xs md:text-sm font-semibold transition-all ${
                                            isChecked ? "text-slate-500 line-through" : "text-slate-300"
                                        }`}>
                                            {item.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}
