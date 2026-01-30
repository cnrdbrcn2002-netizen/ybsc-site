import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";

const OperativeContext = createContext();

export const useOperative = () => useContext(OperativeContext);

export const OperativeProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [operativeData, setOperativeData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [syncStatus, setSyncStatus] = useState("WAITING_FOR_HANDSHAKE");

    useEffect(() => {
        // Check if API keys are missing to fallback to demo mode gracefully or warn
        if (!import.meta.env.VITE_FIREBASE_API_KEY) {
            console.warn("⚠️ Firebase keys missing. Running in disconnected mode.");
            setSyncStatus("DEMO_MODE_ACTIVE");
            setLoading(false);
            return;
        }

        try {
            if (!auth) {
                console.warn("Firebase Auth not initialized. Running in Offline/Demo Mode.");
                setSyncStatus("DEMO_MODE_ACTIVE");
                setLoading(false);
                return;
            }

            const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
                setCurrentUser(user);

                if (user) {
                    setSyncStatus("CONNECTING_TO_SHELTER");
                    const docRef = doc(db, "operatives", user.uid);
                    const unsubscribeDoc = onSnapshot(docRef, (doc) => {
                        if (doc.exists()) {
                            setSyncStatus("SECURE_CLOUD_ACTIVE");
                            setOperativeData(doc.data());
                        } else {
                            console.log("No operative dossier found - New user needs enrolment");
                            setSyncStatus("DOSSIER_MISSING");
                            setOperativeData(null);
                        }
                        setLoading(false); // <--- Ensure loading stops on success
                    },
                        (error) => {
                            console.error("Sync Error:", error);

                            // Permission Denied Fallback
                            if (error.code === 'permission-denied' || error.message.includes('permission-denied')) {
                                console.warn("Firestore Locked -> Switching to Offline Mode");
                                setSyncStatus("OFFLINE_MODE_ACTIVE");

                                const localData = localStorage.getItem('operative_data');
                                if (localData) {
                                    setOperativeData(JSON.parse(localData));
                                }
                            } else {
                                setSyncStatus("CONNECTION_SEVERED");
                            }
                            setLoading(false); // <--- Ensure loading stops on error
                        }
                    );
                    return () => unsubscribeDoc();
                } else {
                    // Start of Change: Check LocalStorage Fallback for Guest/Manual Sessions
                    const localData = localStorage.getItem('operative_data');
                    if (localData) {
                        console.log("Restoring session from local operational cache...");
                        setOperativeData(JSON.parse(localData));
                        setSyncStatus("OFFLINE_PERSISTENCE_ACTIVE");

                        // Pseudo-user for context compatibility if needed, or rely on operativeData
                        // But App.jsx checks 'currentUser' or 'isAuthenticated' gate.
                        // We need to set currentUser essentially or ensure App.jsx logic holds.
                        // Actually App.jsx uses context's currentUser. 
                        // Firebase 'user' object is complex. We stored our local 'operativeData' object.
                        // Let's set that object as currentUser too if it helps, or handle it.
                        // The 'user' param from auth is Firebase User. 'operativeData' is our DB object.
                        // OperativeContext exposes 'currentUser' (Firebase) and 'operativeData' (DB).
                        // Manual login users don't have Firebase User.
                        // So for them, 'currentUser' is null usually? 
                        // Wait, SystemAccessLogin calls onAccessGranted(user) -> App.jsx sets setIsAuthenticated(true).
                        // But context provider state 'currentUser' remains null for manual login?
                        // Let's see OperativeContext lines 33-74.
                        // If I load page, useEffect runs. onAuthStateChanged returns null.
                        // I set operativeData from local.
                        // But 'currentUser' state (line 11) is still null.
                        // App.jsx: const { currentUser } = useOperative(); ... useEffect checks currentUser.
                        // IF currentUser is null, App.jsx might show Login.
                        // So I MUST set 'currentUser' to something truthy here for the context consumers.
                        setCurrentUser(JSON.parse(localData));
                    } else {
                        setOperativeData(null);
                        setCurrentUser(null);
                        setSyncStatus("WAITING_FOR_HANDSHAKE");
                    }
                    // End of Change
                }
                setLoading(false);
            });

            return unsubscribeAuth;
        } catch (err) {
            console.error("Firebase Init Failed:", err);
            setSyncStatus("SYSTEM_FAILURE");
            setLoading(false);
        }

        // FAILSAFE: Force app to load if Firebase hangs more than 1.5s
        const safetyTimeout = setTimeout(() => {
            setLoading((prev) => {
                if (prev) {
                    console.warn("⚠️ Firebase took too long. Forcing app load.");
                    setSyncStatus("TIMEOUT_FORCED_ENTRY");
                    return false;
                }
                return prev;
            });
        }, 1500);

        return () => clearTimeout(safetyTimeout);
    }, []);

    const logout = async () => {
        try {
            if (auth) await auth.signOut();
            setCurrentUser(null);
            setOperativeData(null);
            localStorage.removeItem('operative_data'); // Clear local fallback
        } catch (error) {
            console.error("Logout Failed", error);
        }
    };

    const value = {
        currentUser,
        operativeData,
        syncStatus,
        loading,
        logout
    };

    return (
        <OperativeContext.Provider value={value}>
            {loading ? (
                <div style={{
                    height: '100vh',
                    background: '#000',
                    color: '#333',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'monospace',
                    flexDirection: 'column'
                }}>
                    <div style={{ color: 'red', fontSize: '2rem', marginBottom: '10px' }}>SYSTEM_BOOT_SEQUENCE</div>
                    <div>INITIALIZING... [{syncStatus}]</div>
                </div>
            ) : (
                children
            )}
        </OperativeContext.Provider>
    );
};
