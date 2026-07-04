import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { updateProfile } from "firebase/auth";
import { auth } from "../firebase";

export default function Profile() {
    const { user } = useAuth();
    
    const [name, setName] = useState("");
    const [dept, setDept] = useState("Medicine & Surgery");
    const [goalCgpa, setGoalCgpa] = useState("4.50");
    const [photo, setPhoto] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // Load states on load
    useEffect(() => {
        if (user) {
            setName(user.displayName || "");
        }
        const savedDept = localStorage.getItem("student_dept");
        if (savedDept) setDept(savedDept);

        const savedGoal = localStorage.getItem("gpa_target_goal");
        if (savedGoal) setGoalCgpa(savedGoal);

        const savedPhoto = localStorage.getItem("student_photo_base64");
        if (savedPhoto) setPhoto(savedPhoto);
    }, [user]);

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                setPhoto(base64String);
                localStorage.setItem("student_photo_base64", base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);

        try {
            // Update Firebase Display Name
            if (user && name.trim()) {
                await updateProfile(auth.currentUser, { displayName: name });
            }
            
            // Save local configurations
            localStorage.setItem("student_dept", dept);
            localStorage.setItem("gpa_target_goal", parseFloat(goalCgpa).toFixed(2));
            
            // Dispatch storage event to alert dashboard
            window.dispatchEvent(new Event("storage"));

            setMessage("Profile updated successfully!");
        } catch (error) {
            console.error(error);
            setMessage("Failed to update profile: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl w-full mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10 pt-4">
            
            {/* Left: Holographic ID Badge */}
            <div className="flex flex-col items-center justify-center space-y-4">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">
                    // DIGITAL ID BADGE
                </div>
                
                {/* ID Badge container */}
                <div className="relative w-80 h-[450px] rounded-3xl border border-white/10 shadow-2xl glass-card overflow-hidden flex flex-col justify-between p-6 bg-gradient-to-b from-slate-900/60 to-slate-950/80 group">
                    {/* Gloss shimmers */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/5 via-transparent to-purple-500/5 pointer-events-none"></div>
                    <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 group-hover:left-full transition-all duration-1000 ease-out pointer-events-none"></div>

                    {/* ID Badge Header */}
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                        <div>
                            <div className="text-xs font-black text-white font-head tracking-wide">SPLENDID'S ACADEMY</div>
                            <span className="text-[7px] font-bold text-cyan-400 font-mono tracking-widest uppercase">DEPARTMENT OF ANATOMY</span>
                        </div>
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-[10px]">
                            <i className="fas fa-graduation-cap"></i>
                        </div>
                    </div>

                    {/* Passport upload/view */}
                    <div className="flex-grow flex flex-col items-center justify-center space-y-4 py-6">
                        <label className="relative w-28 h-28 rounded-2xl border border-white/10 bg-slate-950/40 flex items-center justify-center overflow-hidden cursor-pointer hover:border-cyan-400/40 group/photo transition-all shadow-inner">
                            {photo ? (
                                <img src={photo} alt="Passport" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-center space-y-1 text-slate-500 group-hover/photo:text-cyan-400 transition-colors">
                                    <i className="fas fa-camera text-lg"></i>
                                    <div className="text-[8px] uppercase tracking-wider font-mono">Upload Photo</div>
                                </div>
                            )}
                            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                        </label>

                        <div className="text-center space-y-1.5">
                            <h2 className="text-base font-bold text-white font-head tracking-wide">
                                {name || "STUDENT USER"}
                            </h2>
                            <p className="text-[8px] text-slate-500 uppercase tracking-widest font-mono">
                                ID: {user?.uid ? user.uid.substring(0, 10).toUpperCase() : "200LVL-DOA"}
                            </p>
                        </div>
                    </div>

                    {/* ID Badge Footer */}
                    <div className="border-t border-white/5 pt-4 space-y-2">
                        <div className="grid grid-cols-2 text-left gap-1">
                            <div>
                                <div className="text-[7px] text-slate-500 uppercase tracking-widest font-mono">Department</div>
                                <div className="text-[9px] font-bold text-slate-300 truncate">{dept}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-[7px] text-slate-500 uppercase tracking-widest font-mono">Target GP</div>
                                <div className="text-[9px] font-bold text-cyan-400 font-mono">{parseFloat(goalCgpa || 0).toFixed(2)}</div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between text-[7px] text-slate-600 font-mono tracking-widest uppercase mt-2">
                            <span>Diagnostic Clearance</span>
                            <span className="text-emerald-500 font-bold">● Operational</span>
                        </div>
                    </div>

                </div>
            </div>

            {/* Right: Update Profile Settings */}
            <div className="flex flex-col justify-center">
                <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/5 shadow-xl space-y-6">
                    <div>
                        <h2 className="text-lg font-bold text-white font-mono tracking-wide">// SETTINGS UTILITY</h2>
                        <p className="text-xs text-slate-400 mt-1">Configure your profile attributes, target GPA goal, and passport upload.</p>
                    </div>

                    {message && (
                        <div className={`text-xs font-semibold p-3.5 rounded-xl border ${
                            message.includes("success") 
                                ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400" 
                                : "bg-rose-500/10 border-rose-500/25 text-rose-400"
                        }`}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">Display Name</label>
                            <input 
                                type="text" 
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Student Fullname"
                                className="w-full bg-slate-950/30 border border-white/10 rounded-xl py-3 px-4 text-xs text-white outline-none focus:border-cyan-400/50 transition-colors font-medium"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">Department</label>
                            <input 
                                type="text" 
                                required
                                value={dept}
                                onChange={(e) => setDept(e.target.value)}
                                placeholder="e.g. Medicine & Surgery"
                                className="w-full bg-slate-950/30 border border-white/10 rounded-xl py-3 px-4 text-xs text-white outline-none focus:border-cyan-400/50 transition-colors font-medium"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">Target GPA Goal</label>
                            <input 
                                type="number" 
                                step="0.01"
                                required
                                value={goalCgpa}
                                onChange={(e) => setGoalCgpa(e.target.value)}
                                placeholder="e.g. 4.50"
                                className="w-full bg-slate-950/30 border border-white/10 rounded-xl py-3 px-4 text-xs text-white outline-none focus:border-cyan-400/50 transition-colors font-medium"
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full btn-primary text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider mt-2 flex items-center justify-center gap-2 active:scale-95"
                        >
                            {loading ? <i className="fas fa-circle-notch animate-spin"></i> : <><i className="fas fa-floppy-disk"></i> Save Configurations</>}
                        </button>
                    </form>
                </div>
            </div>

        </div>
    );
}
