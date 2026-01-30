import { useEffect } from 'react';

export const useSiteProtection = () => {
    useEffect(() => {
        // 1. Disable Right Click
        const handleContextMenu = (e) => {
            e.preventDefault();
            return false;
        };

        // 2. Disable Specific Keyboard Shortcuts (Inspect, View Source, Save)
        const handleKeyDown = (e) => {
            // F12 (DevTools)
            if (e.key === 'F12') {
                e.preventDefault();
                return false;
            }

            // Ctrl/Cmd + Shift + I (DevTools)
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i')) {
                e.preventDefault();
                return false;
            }

            // Ctrl/Cmd + Shift + J (Console)
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'J' || e.key === 'j')) {
                e.preventDefault();
                return false;
            }

            // Ctrl/Cmd + Shift + C (Inspect Element)
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'C' || e.key === 'c')) {
                e.preventDefault();
                return false;
            }

            // Ctrl/Cmd + U (View Source)
            if ((e.ctrlKey || e.metaKey) && (e.key === 'U' || e.key === 'u')) {
                e.preventDefault();
                return false;
            }

            // Ctrl/Cmd + S (Save Page)
            if ((e.ctrlKey || e.metaKey) && (e.key === 'S' || e.key === 's')) {
                e.preventDefault();
                return false;
            }
        };

        // 3. Clear Console (Annoyance for attackers)
        const clearConsole = setInterval(() => {
            console.clear();
            console.log('%c STOP ', 'color: red; font-size: 50px; font-weight: bold; text-shadow: 2px 2px 0px black;');
            console.log('%c This is a restricted area. Access is monitored.', 'color: white; font-size: 16px; background: black; padding: 5px;');
        }, 2000);

        // Events
        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);

        // Prevent dragging images
        document.querySelectorAll('img').forEach(img => {
            img.setAttribute('draggable', 'false');
        });

        // Cleanup
        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
            clearInterval(clearConsole);
        };
    }, []);
};
