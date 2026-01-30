import React, { useState, useEffect } from 'react';

const WelcomeSplash = ({ onComplete }) => {
    const [phase, setPhase] = useState('loading'); // loading, expanding, complete
    const [terminalLines, setTerminalLines] = useState([]);
    const [showLogo, setShowLogo] = useState(false);
    const [glitchActive, setGlitchActive] = useState(false);
    const [audioReady, setAudioReady] = useState(false);


    const terminalSequence = [
        '>> [SYSTEM]: ENCRYPTED_HANDSHAKE_SUCCESSFUL',
        '>> [IDENT]: OPERATIVE_ID_RECOGNIZED // CONFIRMED',
        '>> [STATUS]: SHELTER_PROTOCOLS_ENGAGED',
        '>> [SYNC]: LOADING_FLEET_&_CREW_DATABASE...',
        '>> [WARNING]: UNLEASHING_MAHLUKAT_VIBE...'
    ];

    // Enable audio on first interaction
    const enableAudio = () => {
        if (!audioReady) {
            console.log('Audio enabled by user interaction');
            setAudioReady(true);
        }
    };

    useEffect(() => {
        // Logo glitch entrance
        setTimeout(() => {
            setShowLogo(true);
            setGlitchActive(true);

            setTimeout(() => setGlitchActive(false), 1000);
        }, 300);

        // Terminal lines animation (faster)
        terminalSequence.forEach((line, index) => {
            setTimeout(() => {
                setTerminalLines(prev => [...prev, line]);
            }, 1200 + (index * 300));
        });

        // Start expansion phase with audio
        const expansionDelay = 1200 + (terminalSequence.length * 300) + 400;
        setTimeout(() => {
            setPhase('expanding');

            console.log('🔊 Attempting to play audio...');

            const playProceduralAudio = (audioContext) => {
                console.log('🎹 Playing procedural fallback audio...');
                try {
                    // Create compressor for punch
                    const compressor = audioContext.createDynamicsCompressor();
                    compressor.threshold.setValueAtTime(-20, audioContext.currentTime);
                    compressor.knee.setValueAtTime(10, audioContext.currentTime);
                    compressor.ratio.setValueAtTime(12, audioContext.currentTime);
                    compressor.attack.setValueAtTime(0.003, audioContext.currentTime);
                    compressor.release.setValueAtTime(0.25, audioContext.currentTime);
                    compressor.connect(audioContext.destination);

                    // 1. DEEP Sub-Bass Layer (Netflix-style)
                    const subBass = audioContext.createOscillator();
                    const subGain = audioContext.createGain();
                    subBass.type = 'sine';
                    subBass.frequency.setValueAtTime(35, audioContext.currentTime);
                    subBass.frequency.exponentialRampToValueAtTime(25, audioContext.currentTime + 0.5);
                    subGain.gain.setValueAtTime(1.2, audioContext.currentTime);
                    subGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
                    subBass.connect(subGain);
                    subGain.connect(compressor);
                    subBass.start(audioContext.currentTime);
                    subBass.stop(audioContext.currentTime + 0.5);

                    // 2. Mid-Bass Layer (body)
                    const midBass = audioContext.createOscillator();
                    const midGain = audioContext.createGain();
                    midBass.type = 'triangle';
                    midBass.frequency.setValueAtTime(80, audioContext.currentTime);
                    midBass.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.4);
                    midGain.gain.setValueAtTime(0.8, audioContext.currentTime);
                    midGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
                    midBass.connect(midGain);
                    midGain.connect(compressor);
                    midBass.start(audioContext.currentTime);
                    midBass.stop(audioContext.currentTime + 0.4);

                    // 3. Harmonic Layer (richness)
                    const harmonic = audioContext.createOscillator();
                    const harmonicGain = audioContext.createGain();
                    harmonic.type = 'sawtooth';
                    harmonic.frequency.setValueAtTime(160, audioContext.currentTime);
                    harmonic.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.3);
                    harmonicGain.gain.setValueAtTime(0.3, audioContext.currentTime);
                    harmonicGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                    harmonic.connect(harmonicGain);
                    harmonicGain.connect(compressor);
                    harmonic.start(audioContext.currentTime);
                    harmonic.stop(audioContext.currentTime + 0.3);

                    // 4. Transient Click (attack)
                    const click = audioContext.createOscillator();
                    const clickGain = audioContext.createGain();
                    const clickFilter = audioContext.createBiquadFilter();
                    clickFilter.type = 'highpass';
                    clickFilter.frequency.setValueAtTime(2000, audioContext.currentTime);
                    click.type = 'square';
                    click.frequency.setValueAtTime(1000, audioContext.currentTime);
                    clickGain.gain.setValueAtTime(0.4, audioContext.currentTime);
                    clickGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
                    click.connect(clickFilter);
                    clickFilter.connect(clickGain);
                    clickGain.connect(compressor);
                    click.start(audioContext.currentTime);
                    click.stop(audioContext.currentTime + 0.05);

                    // 5. Rumble Tail (analog warmth)
                    const rumbleSize = audioContext.sampleRate * 1.2;
                    const rumbleBuffer = audioContext.createBuffer(1, rumbleSize, audioContext.sampleRate);
                    const rumbleData = rumbleBuffer.getChannelData(0);
                    for (let i = 0; i < rumbleSize; i++) {
                        rumbleData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (audioContext.sampleRate * 0.3));
                    }
                    const rumble = audioContext.createBufferSource();
                    rumble.buffer = rumbleBuffer;
                    const rumbleGain = audioContext.createGain();
                    const rumbleFilter = audioContext.createBiquadFilter();
                    rumbleFilter.type = 'lowpass';
                    rumbleFilter.frequency.setValueAtTime(150, audioContext.currentTime + 0.3);
                    rumbleFilter.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 1.5);
                    rumbleGain.gain.setValueAtTime(0.25, audioContext.currentTime + 0.3);
                    rumbleGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.5);
                    rumble.connect(rumbleFilter);
                    rumbleFilter.connect(rumbleGain);
                    rumbleGain.connect(compressor);
                    rumble.start(audioContext.currentTime + 0.3);
                    rumble.stop(audioContext.currentTime + 1.5);

                    console.log('✅ Procedural audio generated successfully!');
                } catch (err) {
                    console.error('❌ Procedural audio generation error:', err);
                }
            };

            // Main Audio Logic
            try {
                const AudioContextClass = window.AudioContext || window.webkitAudioContext;
                if (!AudioContextClass) {
                    console.error('❌ AudioContext not supported');
                    return;
                }

                const audioContext = new AudioContextClass();
                console.log('✅ AudioContext created, state:', audioContext.state);

                if (audioContext.state === 'suspended') {
                    audioContext.resume().then(() => console.log('✅ AudioContext resumed'));
                }

                // Try to play file first
                const audioFile = new Audio('/assets/jfr_thud.mp3');

                // Set volume if needed, but HTML5 Audio is separate from Web Audio Context usually,
                // unless piped in. For simple playback, direct play is fine. 
                // However, to ensure it syncs well and we don't block the UI, we use promise handling.

                const playPromise = audioFile.play();

                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        console.log('🎵 Playing audio file: /assets/jfr_thud.mp3');
                    }).catch(error => {
                        console.warn('⚠️ Audio file failed or missing, using procedural fallback.', error);
                        playProceduralAudio(audioContext);
                    });
                }

            } catch (err) {
                console.error('❌ Audio initialization error:', err);
            }
        }, expansionDelay);

        // Complete (1.8 seconds after expansion starts)
        setTimeout(() => {
            setPhase('complete');
            onComplete();
        }, expansionDelay + 1800);
    }, []);

    if (phase === 'complete') return null;

    return (
        <div className={`welcome-splash ${phase}`} onClick={enableAudio}>
            {/* Scanlines & Film Grain */}
            <div className="scanlines"></div>
            <div className="film-grain"></div>

            {/* Main Logo */}
            <div className={`logo-container ${showLogo ? 'visible' : ''} ${glitchActive ? 'glitch' : ''}`}>
                <h1 className="ybsc-logo">Y.B.S.C</h1>
            </div>

            {/* Terminal Output */}
            <div className="terminal-output">
                {terminalLines.map((line, index) => (
                    <div key={index} className="terminal-line">
                        {line}
                    </div>
                ))}
            </div>

            {/* Expanding Red Dot */}
            {phase === 'expanding' && (
                <div className="red-dot-expand"></div>
            )}

            <style>{`
                .welcome-splash {
                    position: fixed;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    background: #000;
                    z-index: 9999;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                }

                /* Scanlines Effect */
                .scanlines {
                    position: absolute;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    background: repeating-linear-gradient(
                        0deg,
                        rgba(0, 0, 0, 0.15),
                        rgba(0, 0, 0, 0.15) 1px,
                        transparent 1px,
                        transparent 2px
                    );
                    pointer-events: none;
                    z-index: 3;
                }

                /* Film Grain */
                .film-grain {
                    position: absolute;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
                    opacity: 0.05;
                    pointer-events: none;
                    z-index: 2;
                    animation: grainShift 0.5s steps(10) infinite;
                }

                @keyframes grainShift {
                    0%, 100% { transform: translate(0, 0); }
                    10% { transform: translate(-5%, -5%); }
                    20% { transform: translate(-10%, 5%); }
                    30% { transform: translate(5%, -10%); }
                    40% { transform: translate(-5%, 15%); }
                    50% { transform: translate(-10%, 5%); }
                    60% { transform: translate(15%, 0); }
                    70% { transform: translate(0, 10%); }
                    80% { transform: translate(-15%, 0); }
                    90% { transform: translate(10%, 5%); }
                }

                /* Logo Container */
                .logo-container {
                    position: relative;
                    z-index: 5;
                    opacity: 0;
                    transform: scale(0.8);
                    transition: opacity 0.3s, transform 0.3s;
                }

                .logo-container.visible {
                    opacity: 1;
                    transform: scale(1);
                }

                .logo-container.glitch {
                    animation: strobeGlitch 1s;
                }

                @keyframes strobeGlitch {
                    0%, 10%, 20%, 30%, 40%, 100% {
                        opacity: 1;
                        filter: none;
                    }
                    5%, 15%, 25%, 35% {
                        opacity: 0.3;
                        filter: hue-rotate(90deg) brightness(2);
                    }
                }

                /* Y.B.S.C Logo */
                .ybsc-logo {
                    font-family: var(--font-main);
                    font-size: clamp(4rem, 15vw, 12rem);
                    font-weight: 900;
                    letter-spacing: 20px;
                    margin: 0;
                    color: transparent;
                    -webkit-text-stroke: 3px white;
                    text-shadow: 
                        0 0 20px rgba(255, 0, 51, 0.6),
                        0 0 40px rgba(255, 0, 51, 0.4),
                        0 0 60px rgba(255, 0, 51, 0.2);
                    position: relative;
                }

                .ybsc-logo::before {
                    content: 'Y.B.S.C';
                    position: absolute;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    color: rgba(255, 0, 51, 0.3);
                    -webkit-text-stroke: 0;
                    filter: blur(8px);
                    z-index: -1;
                }

                /* Terminal Output */
                .terminal-output {
                    position: absolute;
                    bottom: 30%;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 90%;
                    max-width: 800px;
                    z-index: 4;
                }

                .terminal-line {
                    font-family: var(--font-tech);
                    font-size: clamp(0.7rem, 1.5vw, 1rem);
                    color: var(--color-red);
                    margin: 8px 0;
                    letter-spacing: 1px;
                    opacity: 0;
                    animation: terminalFadeIn 0.3s forwards;
                    text-shadow: 0 0 5px rgba(255, 0, 51, 0.5);
                }

                @keyframes terminalFadeIn {
                    from {
                        opacity: 0;
                        transform: translateX(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                /* Red Dot Expansion */
                .red-dot-expand {
                    position: absolute;
                    top: 50%; left: 50%;
                    width: 4px; height: 4px;
                    background: var(--color-red);
                    border-radius: 50%;
                    transform: translate(-50%, -50%);
                    box-shadow: 
                        0 0 20px rgba(255, 0, 51, 1),
                        0 0 40px rgba(255, 0, 51, 0.8),
                        0 0 60px rgba(255, 0, 51, 0.6);
                    animation: expandDot 1.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
                    z-index: 10;
                }

                @keyframes expandDot {
                    0% {
                        width: 4px;
                        height: 4px;
                        opacity: 1;
                        box-shadow: 
                            0 0 20px rgba(255, 0, 51, 1),
                            0 0 40px rgba(255, 0, 51, 0.8);
                    }
                    30% {
                        width: 150vw;
                        height: 150vw;
                        opacity: 1;
                        box-shadow: 
                            0 0 100px rgba(255, 0, 51, 1),
                            0 0 200px rgba(255, 0, 51, 0.8);
                    }
                    70% {
                        width: 250vw;
                        height: 250vw;
                        opacity: 0.9;
                    }
                    100% {
                        width: 300vw;
                        height: 300vw;
                        opacity: 0;
                    }
                }

                /* Phase: Expanding */
                .welcome-splash.expanding .logo-container,
                .welcome-splash.expanding .terminal-output {
                    opacity: 0;
                    transition: opacity 0.5s;
                }

                @media (max-width: 768px) {
                    .ybsc-logo {
                        letter-spacing: 10px;
                    }
                    .terminal-output {
                        bottom: 20%;
                    }
                }
            `}</style>
        </div>
    );
};

export default WelcomeSplash;
