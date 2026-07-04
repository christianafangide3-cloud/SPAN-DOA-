import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "../firebase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const inactivityTimer = useRef(null);

    const INACTIVITY_LIMIT = 15 * 60 * 1000; // 15 Minutes

    const resetInactivityTimer = () => {
        if (inactivityTimer.current) {
            clearTimeout(inactivityTimer.current);
        }
        if (auth.currentUser) {
            inactivityTimer.current = setTimeout(() => {
                logout();
                localStorage.setItem("session_timeout", "true");
            }, INACTIVITY_LIMIT);
        }
    };

    const logout = () => {
        return firebaseSignOut(auth).then(() => {
            setUser(null);
        });
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);

            if (currentUser) {
                resetInactivityTimer();
                // Add event listeners for inactivity tracking
                const events = ["click", "mousemove", "keypress", "scroll", "touchstart"];
                events.forEach(evt => 
                    document.addEventListener(evt, resetInactivityTimer, { passive: true })
                );

                return () => {
                    events.forEach(evt => 
                        document.removeEventListener(evt, resetInactivityTimer)
                    );
                    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
                };
            } else {
                if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
            }
        });

        return () => unsubscribe();
    }, []);

    const value = {
        user,
        loading,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
