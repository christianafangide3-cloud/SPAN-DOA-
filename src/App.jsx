import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import DashboardLayout from "./components/DashboardLayout";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Hub from "./pages/Hub";
import CbtHub from "./pages/CbtHub";
import QuizRunner from "./pages/QuizRunner";
import Leaderboard from "./pages/Leaderboard";
import Calculator from "./pages/Calculator";
import Flashcards from "./pages/Flashcards";
import Outline from "./pages/Outline";
import Profile from "./pages/Profile";
import Notes from "./pages/Notes";
import Clinical from "./pages/Clinical";
import MapPage from "./pages/Map";
import Testimonials from "./pages/Testimonials";

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[#030712] text-slate-500 font-mono text-xs uppercase tracking-wider">
                <i className="fas fa-circle-notch animate-spin mr-2"></i> Confirming authorization...
            </div>
        );
    }
    
    if (!user) {
        return <Navigate to="/" replace />;
    }
    
    return <DashboardLayout>{children}</DashboardLayout>;
};

export default function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public Route */}
                    <Route path="/" element={<Login />} />

                    {/* Protected Routes wrapped in DashboardLayout */}
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/cbt" element={<ProtectedRoute><Hub /></ProtectedRoute>} />
                    <Route path="/cbt/levels" element={<ProtectedRoute><CbtHub /></ProtectedRoute>} />
                    <Route path="/quiz" element={<ProtectedRoute><QuizRunner /></ProtectedRoute>} />
                    <Route path="/clinical" element={<ProtectedRoute><Clinical /></ProtectedRoute>} />
                    <Route path="/flashcards" element={<ProtectedRoute><Flashcards /></ProtectedRoute>} />
                    <Route path="/calculator" element={<ProtectedRoute><Calculator /></ProtectedRoute>} />
                    <Route path="/map" element={<ProtectedRoute><MapPage /></ProtectedRoute>} />
                    <Route path="/notes" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
                    <Route path="/outline" element={<ProtectedRoute><Outline /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    <Route path="/testimonials" element={<ProtectedRoute><Testimonials /></ProtectedRoute>} />
                    <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}
