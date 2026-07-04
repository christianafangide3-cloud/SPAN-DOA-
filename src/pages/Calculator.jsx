import React, { useState, useEffect } from "react";

export default function Calculator() {
    const [currentCgpa, setCurrentCgpa] = useState("");
    const [unitsCovered, setUnitsCovered] = useState("");
    const [targetCgpa, setTargetCgpa] = useState("");

    const [courses, setCourses] = useState([
        { code: "", unit: 3, grade: 5 },
        { code: "", unit: 3, grade: 5 },
        { code: "", unit: 3, grade: 5 }
    ]);

    const [result, setResult] = useState(null);

    useEffect(() => {
        const savedGoal = localStorage.getItem("gpa_target_goal");
        if (savedGoal) {
            setTargetCgpa(parseFloat(savedGoal).toString());
        }
    }, []);

    const addCourseRow = () => {
        setCourses((prev) => [...prev, { code: "", unit: 3, grade: 5 }]);
    };

    const handleCourseChange = (index, field, value) => {
        const updated = [...courses];
        updated[index] = { ...updated[index], [field]: value };
        setCourses(updated);
    };

    const calculateFate = () => {
        const cgpa = parseFloat(currentCgpa) || 0;
        const units = parseFloat(unitsCovered) || 0;
        const target = parseFloat(targetCgpa) || 0;

        let semesterUnits = 0;
        let semesterPoints = 0;

        courses.forEach((c) => {
            const u = parseInt(c.unit);
            const g = parseInt(c.grade);
            semesterUnits += u;
            semesterPoints += u * g;
        });

        const semesterGPA = semesterUnits > 0 ? semesterPoints / semesterUnits : 0;
        const previousPoints = cgpa * units;
        const newCGPA = (units + semesterUnits) > 0 
            ? (previousPoints + semesterPoints) / (units + semesterUnits) 
            : 0;

        let forecastMessage = "";
        if (target > 0) {
            const totalUnits = units + semesterUnits;
            const requiredTotalPoints = target * totalUnits;
            const pointsNeeded = requiredTotalPoints - previousPoints;
            const requiredGPA = semesterUnits > 0 ? pointsNeeded / semesterUnits : 0;

            if (requiredGPA > 5.0) {
                forecastMessage = `[IMPOSSIBLE TARGET] You would need a ${requiredGPA.toFixed(2)} GPA this semester`;
            } else if (requiredGPA <= 0) {
                forecastMessage = `[TARGET SECURED] Just pass your courses!`;
            } else {
                forecastMessage = `Need a ${requiredGPA.toFixed(2)} GPA this semester to reach ${target.toFixed(2)}`;
            }

            // Save goal back to shared storage
            localStorage.setItem("gpa_target_goal", target.toString());
            // Dispatch a storage event so Dashboard receives it instantly
            window.dispatchEvent(new Event("storage"));
        }

        setResult({
            gpa: semesterGPA.toFixed(2),
            cgpa: newCGPA.toFixed(2),
            forecast: forecastMessage,
            impossible: forecastMessage.includes("IMPOSSIBLE"),
            secured: forecastMessage.includes("SECURED")
        });
    };

    return (
        <div className="max-w-2xl w-full mx-auto p-4 space-y-6 relative z-10">
            
            {/* Title */}
            <div className="text-center space-y-2 mt-4">
                <h1 className="text-3xl font-extrabold text-white font-sans tracking-tight">GP Forecaster</h1>
                <p className="text-slate-400 text-xs tracking-wider uppercase font-mono">Don't guess. Calculate your fate.</p>
            </div>

            {/* Standing Card */}
            <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-4">
                <h3 className="font-bold text-white flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400">
                    <i className="fas fa-user-graduate text-cyan-400"></i> Step 1: Current Standing
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono block mb-2">Current CGPA</label>
                        <input 
                            type="number" 
                            placeholder="e.g. 3.50" 
                            step="0.01" 
                            value={currentCgpa}
                            onChange={(e) => setCurrentCgpa(e.target.value)}
                            className="w-full p-3.5 bg-slate-950/30 rounded-xl border border-white/10 font-bold text-white outline-none focus:border-cyan-400/50 transition-colors"
                        />
                    </div>
                    <div>
                        <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono block mb-2">Units Covered</label>
                        <input 
                            type="number" 
                            placeholder="e.g. 40" 
                            value={unitsCovered}
                            onChange={(e) => setUnitsCovered(e.target.value)}
                            className="w-full p-3.5 bg-slate-950/30 rounded-xl border border-white/10 font-bold text-white outline-none focus:border-cyan-400/50 transition-colors"
                        />
                    </div>
                </div>
            </div>

            {/* The Goal Card */}
            <div className="glass-card glow-cyan rounded-2xl p-6 border border-cyan-500/20 space-y-4 bg-cyan-950/5">
                <h3 className="font-bold text-white flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400">
                    <i className="fas fa-bullseye"></i> Step 2: The Goal
                </h3>
                <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono block mb-2">Target CGPA</label>
                    <div className="flex items-center gap-4">
                        <input 
                            type="number" 
                            placeholder="5.00" 
                            step="0.01" 
                            value={targetCgpa}
                            onChange={(e) => setTargetCgpa(e.target.value)}
                            className="w-full p-3.5 bg-slate-950/40 rounded-xl border border-white/10 font-bold text-white outline-none focus:border-cyan-400/50 transition-colors"
                        />
                        <div className="text-3xl">🚀</div>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-2">Enter the CGPA you want to graduate with.</p>
                </div>
            </div>

            {/* Current Semester Card */}
            <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="font-bold text-white flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400">
                        <i className="fas fa-book text-emerald-400"></i> Step 3: This Semester
                    </h3>
                    <button 
                        onClick={addCourseRow}
                        className="text-[9px] bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 font-bold px-3 py-1.5 rounded-lg hover:bg-cyan-500/20 transition-all font-mono uppercase tracking-wider"
                    >
                        + Add Course
                    </button>
                </div>
                
                <div className="space-y-3">
                    {courses.map((course, index) => (
                        <div key={index} className="grid grid-cols-3 gap-3 animate-fade-in">
                            <input 
                                type="text" 
                                placeholder="Course Code" 
                                value={course.code}
                                onChange={(e) => handleCourseChange(index, "code", e.target.value)}
                                className="p-3 bg-slate-950/20 rounded-xl border border-white/10 text-xs font-semibold text-white outline-none focus:border-cyan-400/50"
                            />

                            <select 
                                value={course.unit}
                                onChange={(e) => handleCourseChange(index, "unit", parseInt(e.target.value))}
                                className="p-3 bg-slate-900 rounded-xl border border-white/10 text-xs font-semibold text-slate-300 outline-none focus:border-cyan-400/50"
                            >
                                <option value={1}>1 Unit</option>
                                <option value={2}>2 Units</option>
                                <option value={3}>3 Units</option>
                                <option value={4}>4 Units</option>
                            </select>

                            <select 
                                value={course.grade}
                                onChange={(e) => handleCourseChange(index, "grade", parseInt(e.target.value))}
                                className="p-3 bg-slate-900 rounded-xl border border-white/10 text-xs font-semibold text-slate-300 outline-none focus:border-cyan-400/50"
                            >
                                <option value={5}>A</option>
                                <option value={4}>B</option>
                                <option value={3}>C</option>
                                <option value={2}>D</option>
                                <option value={1}>E</option>
                                <option value={0}>F</option>
                            </select>
                        </div>
                    ))}
                </div>
            </div>

            {/* Calculate Button */}
            <button 
                onClick={calculateFate}
                className="w-full btn-primary text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
            >
                Predict My Results <i className="fas fa-crystal-ball"></i>
            </button>

            {/* Prediction Result Box */}
            {result && (
                <div className="glass-card glow-cyan rounded-2xl p-6 text-center border border-cyan-500/20 bg-slate-900/40 animate-fade-in">
                    <h3 className="text-base font-bold text-cyan-400 mb-4 font-head tracking-wider uppercase">
                        The Oracle Speaks 🔮
                    </h3>
                    <div className="grid grid-cols-2 gap-4 border-b border-white/5 pb-4 mb-4">
                        <div>
                            <div className="text-[9px] text-slate-500 uppercase font-mono tracking-widest">Semester GPA</div>
                            <div className="text-2xl font-bold font-mono text-white mt-1">{result.gpa}</div>
                        </div>
                        <div>
                            <div className="text-[9px] text-slate-500 uppercase font-mono tracking-widest">Projected CGPA</div>
                            <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">{result.cgpa}</div>
                        </div>
                    </div>
                    {result.forecast && (
                        <div className={`font-bold mt-2 text-xs font-mono uppercase tracking-wider ${
                            result.impossible ? "text-rose-400" 
                            : result.secured ? "text-emerald-400" 
                            : "text-cyan-400"
                        }`}>
                            {result.forecast}
                        </div>
                    )}
                </div>
            )}

        </div>
    );
}
