import React from "react";
import { Link } from "react-router-dom";

export default function Hub() {
    const courses = [
        {
            code: "ANA 211",
            title: "Gross Anatomy",
            dept: "Anatomy",
            desc: "Upper Limb & Thorax structures, brachial plexus, and musculoskeletal relationships.",
            icon: "fa-bone",
            color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20"
        },
        {
            code: "ANA 213",
            title: "Embryology Array",
            dept: "Anatomy",
            desc: "Developmental stages, weeks of twos/threes, body axis formation, and systemic specialization.",
            icon: "fa-dna",
            color: "text-purple-400 bg-purple-500/10 border-purple-500/20"
        },
        {
            code: "PHS 211",
            title: "Blood & Muscle Physio",
            dept: "Physiology",
            desc: "Erythropoiesis, plasma composition, hemostasis, and skeletal muscle excitation contraction.",
            icon: "fa-droplet",
            color: "text-rose-400 bg-rose-500/10 border-rose-500/20"
        },
        {
            code: "PHS 212",
            title: "Cardiovascular Physio",
            dept: "Physiology",
            desc: "Cardiac cycle, hemodynamics, arterial blood pressure regulation, and ECG interpretation.",
            icon: "fa-heart-pulse",
            color: "text-amber-400 bg-amber-500/10 border-amber-500/20"
        },
        {
            code: "PHS 213",
            title: "Respiratory Physio",
            dept: "Physiology",
            desc: "Pulmonary ventilation, gas transport, diffusion capacity, and central chemical regulation.",
            icon: "fa-lungs",
            color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
        },
        {
            code: "PHS 214",
            title: "Renal Physiology",
            dept: "Physiology",
            desc: "Glomerular filtration, tubular reabsorption, countercurrent system, and acid-base buffers.",
            icon: "fa-kidneys",
            color: "text-blue-400 bg-blue-500/10 border-blue-500/20"
        }
    ];

    return (
        <div className="max-w-4xl w-full mx-auto p-4 space-y-6">
            
            {/* Header Title */}
            <div className="text-center space-y-2 py-4">
                <span className="text-[10px] font-bold text-cyan-400 font-mono tracking-widest uppercase">
                    // CENTRAL COURSE SELECTION
                </span>
                <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
                    Assessment Library
                </h1>
                <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                    Select a course track to initiate the diagnostic CBT progression matrix.
                </p>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-4">
                {courses.map((course) => (
                    <div 
                        key={course.code}
                        className="glass-card rounded-2xl p-6 border border-white/5 flex flex-col justify-between h-56 hover:border-white/10 transition-all hover:-translate-y-1 relative"
                    >
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                                    course.dept === "Anatomy" 
                                        ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400" 
                                        : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                                }`}>
                                    {course.dept}
                                </span>
                                <span className="text-[10px] font-bold text-slate-500 font-mono">
                                    {course.code}
                                </span>
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-base font-bold text-white group-hover:text-cyan-400 leading-snug">
                                    {course.title}
                                </h2>
                                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                                    {course.desc}
                                </p>
                            </div>
                        </div>
                        
                        <Link 
                            to={`/cbt/levels?course=${encodeURIComponent(course.code)}&title=${encodeURIComponent(course.title)}`}
                            className="btn-primary py-2.5 w-full rounded-xl text-[10px] font-bold uppercase tracking-widest text-center shadow-lg"
                        >
                            Open Track
                        </Link>
                    </div>
                ))}
            </div>

        </div>
    );
}
