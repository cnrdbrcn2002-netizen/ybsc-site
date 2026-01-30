import React, { useState, useEffect, useRef } from 'react';
import { authorizedPersonnel } from '../data/authorizedPersonnel';
import EnrolOperative from './EnrolOperative';

const SystemAccessLogin = ({ onAccessGranted, onCancel }) => {
    // STATES
    const [phase, setPhase] = useState('ID_ENTRY'); // ID_ENTRY, SCANNING, CODE_ENTRY, LOCKED, SUCCESS
    const [idName, setIdName] = useState('');
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [activeIndex, setActiveIndex] = useState(0);
    const [error, setError] = useState(null);
    const [logs, setLogs] = useState(['>> SYSTEM_INIT...', '>> WAITING_FOR_INPUT...']);
    const [showEnrol, setShowEnrol] = useState(false);
    const [customIntro, setCustomIntro] = useState(null); // 'ALPI', 'ARZ', 'ADMIN'

    // REFS
    const idInputRef = useRef(null);

    // --- KEYBOARD SUPPORT ---
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Ignore if Enrol Modal is open
            if (showEnrol) return;

            // GLOBAL ESCAPE
            if (e.key === 'Escape') {
                if (phase === 'CODE_ENTRY') handleCancel();
            }

            // PHASE 1: ID ENTRY
            if (phase === 'ID_ENTRY') {
                if (e.key === 'Enter' && idName.length > 2) {
                    handleIdSubmit();
                }
                // Focus input if user starts typing letters and input is not focused
                if (/^[a-zA-Z0-9]$/.test(e.key) && document.activeElement !== idInputRef.current) {
                    idInputRef.current?.focus();
                }
            }
            // PHASE 3: CODE ENTRY
            else if (phase === 'CODE_ENTRY') {
                // NUMBERS (Main row 0-9 and Numpad 0-9)
                if ((e.key >= '0' && e.key <= '9')) {
                    handleNumberInput(e.key);
                }
                // BACKSPACE
                else if (e.key === 'Backspace') {
                    handleBackspace();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [phase, idName, activeIndex, code, showEnrol]);

    // --- LOGIC ---

    const addLog = (msg) => {
        setLogs(prev => [...prev.slice(-4), `>> ${msg}`]);
    };

    // Helper to normalize Turkish characters and case
    const normalizeId = (str) => {
        if (!str) return '';
        return str.replace(/ı/g, 'i').replace(/İ/g, 'i').toLowerCase();
    };

    const handleIdSubmit = () => {
        if (!idName) return;
        setPhase('SCANNING');
        addLog(`SCANNING_DATABASE_FOR: ${idName.toUpperCase()}`);

        // Fake scan delay
        setTimeout(() => {
            // Robust normalization for comparison
            const user = authorizedPersonnel.find(u => normalizeId(u.idName) === normalizeId(idName));
            if (user) {
                addLog('IDENTITY_CONFIRMED');
                addLog('MANUAL_ENTRY_DISABLED_FOR_SECURITY');
                addLog('PLEASE_USE_BIOMETRIC_AUTH_BELOW');

                // Force user to use Google Auth
                setError('USE_GOOGLE_AUTH');
                triggerShake();
                setTimeout(() => {
                    setPhase('ID_ENTRY');
                    setError(null);
                }, 2000);
            } else {
                addLog('Warning: UNKNOWN_ENTITY');
                setError('ID_NOT_FOUND');
                triggerShake();
                setTimeout(() => {
                    setPhase('ID_ENTRY');
                    setError(null);
                }, 1500);
            }
        }, 1200);
    };

    const handleNumberInput = (num) => {
        // Deprecated - Keypad Disabled
    };

    const handleBackspace = () => {
        // Deprecated - Keypad Disabled
    };

    const verifyCode = (enteredCode, currentId) => {
        // Deprecated - Local Auth Disabled
    };

    const handleCancel = () => {
        setPhase('ID_ENTRY');
        setCode(['', '', '', '', '', '']);
        setActiveIndex(0);
        setError(null);
        setIdName('');
        addLog('SESSION_ABORTED');
    };

    const handleGuestLogin = () => {
        const guestUser = authorizedPersonnel.find(u => u.idName === 'GUEST');
        if (guestUser) {
            setPhase('SCANNING');
            addLog('INITIATING_GUEST_PROTOCOL...');

            // Trigger Animation
            setTimeout(() => {
                setCustomIntro('GUEST');
            }, 1000);

            setTimeout(() => {
                addLog('ACCESS_GRANTED: VISITOR_MODE');
                localStorage.setItem('operative_data', JSON.stringify(guestUser)); // Persist Session
                onAccessGranted(guestUser);
            }, 4000); // Wait for animation
        }
    };

    const triggerShake = () => {
        const container = document.querySelector('.system-access-container');
        if (container) {
            container.classList.add('shake-anim');
            setTimeout(() => container.classList.remove('shake-anim'), 500);
        }
    };

    // --- RENDER ---

    return (
        <div className="system-access-container">
            {/* Background Grid/Scanlines */}
            <div className="bg-grid"></div>
            <div className="scanlines"></div>

            {/* ERROR OVERLAY */}
            {error && <div className="error-overlay">{error}</div>}

            <div className="content-wrapper">
                {/* LEFT: TERMINAL LOG */}
                <div className="terminal-panel">
                    <div className="panel-header">SYS_LOG // V.4.0.1</div>
                    <div className="log-content">
                        {logs.map((log, i) => (
                            <div key={i} className="log-line">{log}</div>
                        ))}
                        <span className="blinking-cursor">_</span>
                    </div>
                </div>

                {/* RIGHT: INTERACTION */}
                <div className="interaction-panel">
                    <div className="panel-header">
                        {phase === 'ID_ENTRY' ? 'STEP_1: IDENTIFICATION' :
                            phase === 'SCANNING' ? 'PROCESSING...' :
                                'STEP_2: SECURITY_CLEARANCE'}
                    </div>

                    {/* PHASE 1: ID ENTRY */}
                    {phase === 'ID_ENTRY' && (
                        <div className="id-entry-box">
                            <input
                                ref={idInputRef}
                                type="text"
                                className="main-input"
                                placeholder="ENTER_CALLSIGN"
                                value={idName}
                                onChange={(e) => setIdName(e.target.value)}
                                autoFocus
                            />
                            <button className="confirm-btn" onClick={handleIdSubmit}>
                                PROCEED &gt;
                            </button>
                            <div className="hint-text">Use Keyboard or Touch</div>

                            {/* GOOGLE AUTH BUTTON (CUSTOM) */}
                            <div className="auth-separator">
                                <span>OR AUTHORIZE VIA</span>
                            </div>

                            <button
                                className="google-auth-btn"
                                onClick={async () => {
                                    // Simulated Mechanical Click Sound
                                    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                                    const oscillator = audioCtx.createOscillator();
                                    const gainNode = audioCtx.createGain();

                                    oscillator.type = 'square';
                                    oscillator.frequency.setValueAtTime(150, audioCtx.currentTime);
                                    oscillator.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.1);

                                    gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
                                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);

                                    oscillator.connect(gainNode);
                                    gainNode.connect(audioCtx.destination);

                                    oscillator.start();
                                    oscillator.stop(audioCtx.currentTime + 0.1);

                                    // REAL FIREBASE LOGIC
                                    try {
                                        // Dynamic imports to avoid issues if firebase isn't fully set up yet
                                        const { auth, googleProvider, db } = await import('../firebase');

                                        // CHECK: Is Firebase initialized?
                                        if (!auth) {
                                            throw new Error("auth/configuration-not-found");
                                        }

                                        const { signInWithPopup } = await import('firebase/auth');
                                        const { doc, getDoc } = await import('firebase/firestore');

                                        const result = await signInWithPopup(auth, googleProvider);
                                        const user = result.user;

                                        addLog(`AUTH_SUCCESS: ${user.email}`);
                                        addLog("CHECKING_OPERATIVE_DOSSIER...");

                                        const docRef = doc(db, "operatives", user.uid);
                                        const docSnap = await getDoc(docRef);

                                        if (docSnap.exists()) {
                                            const userData = docSnap.data();
                                            addLog(`WELCOME_BACK_OPERATIVE: ${userData.idName || 'UNKNOWN'}`);
                                            setTimeout(() => onAccessGranted(userData), 1000);
                                        } else {
                                            addLog("NEW_ENTITY_DETECTED >> INITIATING_ENROLMENT");
                                            setTimeout(() => setShowEnrol(true), 1000);
                                        }

                                    } catch (error) {
                                        console.error("GOOGLE AUTH ERROR:", error);
                                        const errorCode = error.code || error.message || "UNKNOWN_ERROR";

                                        // Handle Permission Denied (Firestore Rules Locked) -> Fallback to Local
                                        if (errorCode.includes("permission-denied")) {
                                            addLog("DB_ACCESS_DENIED: USING_LOCAL_OVERRIDE");
                                            setError("CLOUD_DB_LOCKED_SWITCHING_TO_LOCAL");

                                            // Fallback Logic
                                            setTimeout(() => {
                                                const localUser = JSON.parse(localStorage.getItem('operative_data'));
                                                if (localUser && localUser.email === auth.currentUser?.email) {
                                                    onAccessGranted(localUser);
                                                } else {
                                                    setShowEnrol(true);
                                                }
                                            }, 2000);
                                            return;
                                        }

                                        // Other Errors
                                        let displayMsg = "HANDSHAKE_FAILED";
                                        if (errorCode.includes("auth/invalid-api-key")) displayMsg = "ERROR: INVALID_API_KEY";
                                        else if (errorCode.includes("auth/configuration-not-found")) displayMsg = "ERROR: FIREBASE_CONFIG_MISSING";
                                        else if (errorCode.includes("auth/popup-closed-by-user")) displayMsg = "HANDSHAKE_ABORTED_BY_USER";
                                        else if (errorCode.includes("auth/unauthorized-domain")) displayMsg = "ERROR: UNAUTHORIZED_DOMAIN";

                                        addLog(`AUTH_FAILED: ${errorCode}`);
                                        setError(`${displayMsg}\n[${errorCode}]`); // Show code for debugging
                                        triggerShake();
                                        setTimeout(() => setError(null), 5000); // 5 sec to read
                                    }
                                }}
                            >
                                <div className="g-icon">
                                    <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                                        <path fill="currentColor" d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" />
                                    </svg>
                                </div>
                                <span className="btn-text">AUTHORIZE_VIA_GMAIL</span>
                                <div className="glitch-layer"></div>
                            </button>

                            {/* GUEST ACCESS BUTTON */}
                            <div className="auth-separator" style={{ marginTop: '20px', marginBottom: '10px' }}>
                                <span>-- OR --</span>
                            </div>

                            <button
                                onClick={handleGuestLogin}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    background: 'transparent',
                                    border: '1px solid #0ff',
                                    color: '#0ff',
                                    fontFamily: 'var(--font-tech)',
                                    fontSize: '0.8rem',
                                    letterSpacing: '2px',
                                    cursor: 'pointer',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    transition: 'all 0.3s ease',
                                    textTransform: 'uppercase'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(0, 255, 255, 0.1)';
                                    e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 255, 255, 0.3)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                [ BROWSE_AS_GUEST ]
                            </button>
                        </div>
                    )}

                    {/* PHASE 2: SCANNING ANIMATION */}
                    {phase === 'SCANNING' && (
                        <div className="scanning-box">
                            <div className="scanner-bar"></div>
                            <div className="tech-text">SEARCHING_DB_NODES...</div>
                            <div className="tech-text">VERIFYING_HASH...</div>
                        </div>
                    )}

                    {/* PHASE 3: CODE ENTRY */}
                    {(phase === 'CODE_ENTRY' || phase === 'SUCCESS') && (
                        <div className="code-entry-box">
                            <div className="user-readout">TARGET: {idName}</div>
                            <div className="code-slots">
                                {code.map((digit, i) => (
                                    <div key={i} className={`slot ${i === activeIndex ? 'active' : ''} ${digit ? 'filled' : ''}`}>
                                        {digit ? '●' : ''}
                                    </div>
                                ))}
                            </div>
                            <div className="keypad-hint">[ NUMPAD ACTIVE ]</div>

                            {/* Visual Keypad for Clickers */}
                            <div className="visual-keypad">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                                    <button key={n} onClick={() => handleNumberInput(n.toString())}>{n}</button>
                                ))}
                                <button className="cancel" onClick={handleCancel}>X</button>
                                <button onClick={() => handleNumberInput('0')}>0</button>
                                <button className="back" onClick={handleBackspace}>&lt;</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ENROL & FOOTER */}
            {!showEnrol && !customIntro && (
                <div className="bottom-bar">
                    <div className="enrol-btn" onClick={() => setShowEnrol(true)}>[ REQUEST_NEW_ID ]</div>
                    <div className="sys-id">SEC_LAYER_V4 // Y.B.S.C.</div>
                </div>
            )}

            {showEnrol && <div className="modal-overlay"><EnrolOperative onCancel={() => setShowEnrol(false)} /></div>}

            {/* CUSTOM INTRO OVERLAY */}
            {customIntro && (
                <div className="custom-intro-overlay">
                    {/* ALPI ANIMATION */}
                    {customIntro === 'ALPI' && (
                        <div className="intro-alpi">
                            <img src="/assets/pixel_alpi_full_body_painter.png" alt="DESIGNER" className="alpi-pixel-avatar" />
                            <div className="alpi-glitch">VISUAL_GOD</div>
                        </div>
                    )}

                    {/* ARZ ANIMATION */}
                    {customIntro === 'ARZ' && (
                        <div className="intro-arz">
                            <img src="/assets/pixel_arz_walking_avatar.png" alt="PRODUCER" className="arz-pixel-avatar" />
                            <div className="arz-glitch">AUDIO_MASTER</div>
                        </div>
                    )}

                    {/* GORKEM ANIMATION */}
                    {customIntro === 'GORKEM' && (
                        <div className="intro-gorkem">
                            <img src="/assets/pixel_unicorn_avatar.png" alt="UNICORN" className="unicorn-pixel-avatar" />
                            <div className="gorkem-glitch">SITE_MODERATOR</div>
                        </div>
                    )}

                    {/* ADMIN ANIMATION */}
                    {customIntro === 'ADMIN' && (
                        <div className="intro-admin">
                            <img src="/assets/pixel_laughing_devil.png" alt="DEVIL" className="pixel-devil" />
                            <div className="admin-glitch">SYSTEM_OVERLORD</div>
                        </div>
                    )}

                    {/* GUEST ANIMATION */}
                    {customIntro === 'GUEST' && (
                        <div className="intro-guest">
                            <img src="/assets/pixel_guest_cute_tuxedo.png" alt="VISITOR" className="guest-pixel-avatar" />
                            <div className="guest-glitch">POTENTIAL_CLIENT</div>
                        </div>
                    )}
                </div>
            )
            }

            <style>{`
                .system-access-container {
                    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                    background: #000; color: #fff; z-index: 999;
                    display: flex; align-items: center; justify-content: center;
                    font-family: var(--font-tech, monospace);
                    overflow: hidden;
                }
                .bg-grid {
                    position: absolute; width: 200%; height: 200%;
                    background: linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
                    background-size: 40px 40px;
                    transform: perspective(500px) rotateX(60deg) translateY(-100px) translateZ(-200px);
                    animation: gridMove 20s linear infinite;
                    pointer-events: none;
                }
                @keyframes gridMove { 0% { transform: perspective(500px) rotateX(60deg) translateY(0); } 100% { transform: perspective(500px) rotateX(60deg) translateY(40px); } }
                
                .scanlines {
                    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    background: repeating-linear-gradient(0deg, rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 1px, transparent 1px, transparent 2px);
                    pointer-events: none; opacity: 0.5;
                }

                .content-wrapper {
                    display: flex; gap: 40px; z-index: 10; width: 90%; max-width: 900px;
                    flex-wrap: wrap; justify-content: center;
                }

                /* PANELS */
                .terminal-panel, .interaction-panel {
                    border: 1px solid #333; background: rgba(0,0,0,0.8);
                    padding: 2px; display: flex; flex-direction: column;
                    box-shadow: 0 0 20px rgba(0,0,0,0.8);
                }
                .terminal-panel { width: 300px; height: 400px; }
                .interaction-panel { width: 400px; min-height: 400px; border-color: #555; }
                
                .panel-header {
                    background: #222; color: #888; padding: 5px 10px; font-size: 0.7rem; letter-spacing: 2px;
                    border-bottom: 1px solid #333;
                }

                /* LOGS */
                .log-content { padding: 20px; font-size: 0.8rem; color: #0f0; opacity: 0.7; flex: 1; display: flex; flex-direction: column; justify-content: flex-end; }
                .log-line { margin-bottom: 5px; }
                .blinking-cursor { animation: blink 1s infinite; }
                @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

                /* ID ENTRY */
                .id-entry-box { padding: 40px; display: flex; flex-direction: column; gap: 20px; align-items: center; justify-content: center; height: 100%; }
                .main-input {
                    background: transparent; border: none; border-bottom: 2px solid var(--color-red, red);
                    color: white; font-size: 2rem; text-align: center; width: 100%; font-family: var(--font-main, sans-serif);
                    text-transform: uppercase; outline: none;
                }
                .confirm-btn {
                    background: #222; border: 1px solid #444; color: white; padding: 10px 30px; cursor: pointer;
                    transition: all 0.2s;
                }
                .confirm-btn:hover { background: var(--color-red, red); border-color: var(--color-red, red); color: black; }
                .hint-text { color: #555; font-size: 0.7rem; margin-top: 10px; }

                /* GOOGLE AUTH STYLES */
                .auth-separator {
                    width: 100%; border-bottom: 1px solid #333; line-height: 0.1em; margin: 30px 0 20px; text-align: center;
                }
                .auth-separator span { background: #000; padding: 0 10px; color: #444; font-size: 0.6rem; letter-spacing: 2px; }

                .google-auth-btn {
                    width: 100%;
                    padding: 15px;
                    background: transparent;
                    border: 1px solid var(--color-red);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 15px;
                    cursor: pointer;
                    position: relative;
                    overflow: hidden;
                    transition: all 0.2s;
                    text-decoration: none;
                }

                .google-auth-btn:hover {
                    box-shadow: 0 0 15px rgba(255, 0, 51, 0.3);
                    background: rgba(255, 0, 51, 0.05);
                }

                .g-icon { color: white; transition: color 0.3s; }
                .google-auth-btn:hover .g-icon { color: var(--color-red); }

                .btn-text {
                    font-family: var(--font-main); /* Akira */
                    letter-spacing: 2px;
                    font-size: 0.9rem;
                    z-index: 2;
                }

                .glitch-layer {
                    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    background: transparent;
                    z-index: 1;
                    opacity: 0;
                }

                .google-auth-btn:hover .btn-text {
                    animation: textGlitch 0.3s infinite;
                }

                @keyframes textGlitch {
                    0% { transform: translate(0); }
                    20% { transform: translate(-2px, 1px); }
                    40% { transform: translate(2px, -1px); }
                    60% { transform: translate(-1px, -1px); }
                    80% { transform: translate(1px, 2px); }
                    100% { transform: translate(0); }
                }

                /* SCANNING */
                .scanning-box { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; gap: 20px; }
                .scanner-bar {
                    width: 80%; height: 4px; background: #333; position: relative; overflow: hidden;
                }
                .scanner-bar::after {
                    content: ''; position: absolute; top: 0; left: 0; width: 30%; height: 100%;
                    background: var(--color-red, red); animation: scan 1s ease-in-out infinite alternate;
                }
                @keyframes scan { from { left: 0; } to { left: 70%; } }
                .tech-text { font-size: 0.8rem; color: #888; letter-spacing: 1px; }

                /* CODE ENTRY */
                .code-entry-box { padding: 30px; display: flex; flex-direction: column; items: center; width: 100%; }
                .user-readout { text-align: center; color: #888; font-size: 0.8rem; margin-bottom: 20px; letter-spacing: 2px; }
                .code-slots { display: flex; justify-content: center; gap: 10px; margin-bottom: 30px; }
                .slot {
                    width: 40px; height: 50px; border: 1px solid #444; display: flex; align-items: center; justify-content: center; color: var(--color-red, red); font-size: 2rem;
                }
                .slot.active { border-color: var(--color-red, red); box-shadow: 0 0 10px rgba(255,0,0,0.3); }
                .visual-keypad {
                    display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; max-width: 250px; margin: 0 auto;
                }
                .visual-keypad button {
                    background: #111; border: 1px solid #333; color: white; padding: 15px; font-size: 1.2rem; cursor: pointer;
                }
                .visual-keypad button:hover { border-color: #666; }
                .visual-keypad button:active { background: #333; }
                .keypad-hint { text-align: center; font-size: 0.6rem; color: #444; margin-bottom: 10px; }
                .visual-keypad .cancel { color: red; border-color: #500; }

                /* ERROR OVERLAY */
                .error-overlay {
                    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(255, 0, 0, 0.2); pointer-events: none; z-index: 100;
                    display: flex; align-items: center; justify-content: center; color: red; font-size: 3rem; font-weight: 900;
                    text-shadow: 0 0 20px red; animation: flash 0.2s;
                }
                @keyframes flash { from { opacity: 0; } to { opacity: 1; } }
                .shake-anim { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; }
                @keyframes shake { 10%, 90% { transform: translate3d(-2px, 0, 0); } 20%, 80% { transform: translate3d(4px, 0, 0); } 30%, 50%, 70% { transform: translate3d(-6px, 0, 0); } 40%, 60% { transform: translate3d(6px, 0, 0); } }

                /* BOTTOM BAR */
                .bottom-bar {
                    position: absolute; bottom: 20px; width: 100%; display: flex; justify-content: space-between; padding: 0 40px; font-size: 0.7rem; color: #555; z-index: 20;
                }
                .enrol-btn { cursor: pointer; transition: color 0.3s; }
                .enrol-btn:hover { color: var(--color-red, red); }
                
                .modal-overlay {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 1000;
                }

                /* --- CUSTOM INTRO STYLES --- */
                .custom-intro-overlay {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: #000; z-index: 2000;
                    display: flex; align-items: center; justify-content: center;
                    animation: fadeOut 0.5s ease forwards 3.5s;
                }
                @keyframes fadeOut { to { opacity: 0; visibility: hidden; } }

                /* ALPI Intro */
                .intro-alpi { text-align: center; }

                /* GUEST Intro */
                .intro-guest { text-align: center; }
                .guest-pixel-avatar {
                    width: 250px; image-rendering: pixelated;
                    animation: waveHello 0.5s infinite alternate;
                    filter: drop-shadow(0 0 10px gold);
                }
                .guest-glitch {
                    font-family: var(--font-main); color: gold; font-size: 2rem; margin-top: 15px;
                    animation: textGlitch 0.2s infinite;
                    text-shadow: 2px 2px 0px #fff;
                }
                @keyframes waveHello {
                    0% { transform: rotate(-5deg); }
                    100% { transform: rotate(5deg); }
                }
                .alpi-pixel-avatar {
                    width: 250px; image-rendering: pixelated;
                    animation: floatAnim 3s ease-in-out infinite;
                    filter: drop-shadow(0 0 10px cyan);
                }
                .alpi-glitch {
                    font-family: var(--font-main); color: cyan; font-size: 3rem; margin-top: 20px;
                    animation: textGlitch 0.3s infinite reverse;
                    text-shadow: 2px 2px 0px blue;
                }
                @keyframes floatAnim {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-15px); }
                }

                /* ARZ Intro */
                .intro-arz { text-align: center; }
                .arz-pixel-avatar {
                    width: 300px; image-rendering: pixelated;
                    animation: walkBob 0.6s infinite linear;
                    filter: drop-shadow(0 0 10px lime);
                }
                .arz-glitch {
                    font-family: var(--font-main); color: #39ff14; font-size: 3rem; margin-top: 20px;
                    animation: textGlitch 0.2s infinite;
                    text-shadow: 2px 2px 0px green;
                }
                @keyframes walkBob {
                    0% { transform: translateY(0); }
                    25% { transform: translateY(-5px); }
                    50% { transform: translateY(0); }
                    75% { transform: translateY(5px); }
                    100% { transform: translateY(0); }
                }

                /* ADMIN Intro */
                .intro-admin { text-align: center;  }
                .pixel-devil {
                    width: 200px; image-rendering: pixelated;
                    animation: devilLaugh 0.2s infinite alternate;
                }
                .admin-glitch {
                    font-family: var(--font-main); color: red; font-size: 3rem; margin-top: 20px;
                    animation: textGlitch 0.2s infinite;
                }
                @keyframes devilLaugh {
                    from { transform: translateY(0) scale(1); }
                    to { transform: translateY(-10px) scale(1.1); }
                }

                /* GORKEM Intro */
                .intro-gorkem { text-align: center; }
                .unicorn-pixel-avatar {
                    width: 300px; image-rendering: pixelated;
                    animation: prance 0.6s infinite alternate;
                    filter: drop-shadow(0 0 20px magenta);
                }
                .gorkem-glitch {
                    font-family: var(--font-main); color: #ff00ff; font-size: 3rem; margin-top: 20px;
                    animation: textGlitch 0.2s infinite;
                    text-shadow: 2px 2px 0px cyan;
                    background: linear-gradient(90deg, red, yellow, lime, cyan, blue, magenta, red);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-size: 200% auto;
                    animation: textGlitch 0.2s infinite, rainbowFlow 2s linear infinite;
                }
                @keyframes prance {
                    from { transform: translateY(0) rotate(-5deg); }
                    to { transform: translateY(-15px) rotate(5deg); }
                }
                @keyframes rainbowFlow {
                    to { background-position: 200% center; }
                }

 
                 @media(max-width: 600px) {
                     .content-wrapper { flex-direction: column; align-items: center; }
                     .terminal-panel { display: none; } /* Hide log on mobile */
                     .interaction-panel { width: 100%; }
                 }
             `}</style>
        </div >
    );
};

export default SystemAccessLogin;
