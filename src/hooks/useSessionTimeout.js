import { useEffect, useRef } from 'react';
import { useOperative } from '../context/OperativeContext';

export const useSessionTimeout = (timeoutDuration = 600000) => { // Default: 10 mins (600,000 ms)
    const { logout, currentUser } = useOperative();
    const timeoutRef = useRef(null);

    const resetTimer = () => {
        if (!currentUser) return; // Only track if logged in

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            handleLogout();
        }, timeoutDuration);
    };

    const handleLogout = () => {
        if (currentUser) {
            console.warn('🔒 SESSION EXPIRED: AUTOMATIC LOGOUT INITIATED');
            alert("⚠️ SECURITY ALERT: SESSION EXPIRED DUE TO INACTIVITY.");
            logout();
            window.location.reload();
        }
    };

    useEffect(() => {
        // Events to track activity
        const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'mousemove'];

        const handleActivity = () => {
            resetTimer();
        };

        if (currentUser) {
            // Attach listeners
            events.forEach(event => {
                document.addEventListener(event, handleActivity);
            });

            // Start initial timer
            resetTimer();
        }

        return () => {
            // Cleanup
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            events.forEach(event => {
                document.removeEventListener(event, handleActivity);
            });
        };
    }, [currentUser, logout, timeoutDuration]);

    return;
};
