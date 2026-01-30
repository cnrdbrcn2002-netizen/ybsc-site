import React, { useState, useRef } from 'react';

import { useOperative } from '../context/OperativeContext';

const BeatProduction = ({ beats, setBeats }) => {
    const { currentUser } = useOperative();
    // const [beats, setBeats] = useState([]); // Now receiving from props
    const [playingState, setPlayingState] = useState({ id: null, isPlaying: false });

    const audioRefs = useRef({});

    // Handle Beat Upload
    const handleUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const newBeat = {
                id: Date.now(),
                title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
                url: URL.createObjectURL(file), // Local preview url
                comments: [
                    { user: 'SYSTEM', text: 'ANALYZING WAVEFORM... COMPLETE.', time: 'NOW' }
                ]
            };
            setBeats(prev => [newBeat, ...prev]);
        }
    };

    // Toggle Play/Pause
    const togglePlay = (id) => {
        const audio = audioRefs.current[id];
        if (!audio) return;

        if (playingState.id === id && playingState.isPlaying) {
            audio.pause();
            setPlayingState({ id, isPlaying: false });
        } else {
            // Pause others
            if (playingState.id && playingState.id !== id && audioRefs.current[playingState.id]) {
                audioRefs.current[playingState.id].pause();
            }
            audio.play();
            setPlayingState({ id, isPlaying: true });
        }
    };

    // Handle New Comment
    const handleAddComment = (beatId, text) => {
        if (!text.trim()) return;
        setBeats(prev => prev.map(beat => {
            if (beat.id === beatId) {
                return {
                    ...beat,
                    comments: [...beat.comments, { user: 'GUEST_USER', text: text, time: 'JUST NOW' }]
                };
            }
            return beat;
        }));
    };

    return (
        <div className="beat-production-container">
            {/* Background */}
            <div className="studio-bg"></div>

            {/* Overlay & Content */}
            <div className="content-overlay">

                {/* Header */}
                <div className="beat-header">
                    <div style={{ position: 'relative', width: 'fit-content' }}>
                        <h2>STUDIO_SESSION_01 // <span style={{ color: 'var(--color-red)' }}>ACTIVE</span></h2>
                        <div style={{
                            position: 'absolute',
                            bottom: '-10px',
                            left: '100%',
                            marginLeft: '10px',
                            fontFamily: '"Courier New", monospace',
                            fontWeight: '100',
                            fontSize: '0.85rem',
                            color: '#fff',
                            letterSpacing: '1px',
                            whiteSpace: 'nowrap',
                            opacity: 0.8
                        }}>
                            // Prod. by Arz
                        </div>
                    </div>
                    <div className="stats">
                        <span>LOADED_TRACKS: {beats.length}</span>
                    </div>
                </div>

                {/* Beats List or Empty State */}
                <div className="beats-scroll-area">
                    {beats.length === 0 ? (
                        <div className="empty-upload-zone">
                            {currentUser?.idName !== 'GUEST' && currentUser?.role !== 'VISITOR' ? (
                                <>
                                    <input
                                        type="file"
                                        id="beat-upload"
                                        accept=".mp3, .wav, .flac, .ogg, audio/*"
                                        style={{ display: 'none' }}
                                        onChange={handleUpload}
                                    />
                                    <label htmlFor="beat-upload" className="upload-trigger">
                                        <div className="plus-icon">+</div>
                                        <div className="upload-label">UPLOAD_BEAT_TO_CONSOLE</div>
                                    </label>
                                </>
                            ) : (
                                <div className="upload-label" style={{ opacity: 0.5 }}>NO_ACTIVE_SESSIONS // LISTENING_MODE_ONLY</div>
                            )}
                        </div>
                    ) : (
                        <div className="beats-list">
                            {/* Always show upload button at top compact */}
                            {currentUser?.idName !== 'GUEST' && currentUser?.role !== 'VISITOR' && (
                                <div className="compact-upload">
                                    <input type="file" id="beat-upload-compact" accept="audio/*" style={{ display: 'none' }} onChange={handleUpload} />
                                    <label htmlFor="beat-upload-compact" className="compact-btn">+ NEW_TRACK</label>
                                </div>
                            )}

                            {beats.map(beat => (
                                <div key={beat.id} className="beat-card">
                                    {/* Player Section */}
                                    <div className="player-row">
                                        <button className="play-btn" onClick={() => togglePlay(beat.id)}>
                                            {playingState.id === beat.id && playingState.isPlaying ? '❚❚' : '▶'}
                                        </button>
                                        <div className="waveform-visual">
                                            {/* Fake waveform bars */}
                                            {[...Array(20)].map((_, i) => (
                                                <div
                                                    key={i}
                                                    className={`bar ${playingState.id === beat.id && playingState.isPlaying ? 'animating' : ''}`}
                                                    style={{ animationDelay: `${i * 0.05}s`, height: `${Math.random() * 100}%` }}
                                                ></div>
                                            ))}
                                        </div>
                                        <div className="track-info">
                                            <h3>{beat.title}</h3>
                                            <audio
                                                ref={el => audioRefs.current[beat.id] = el}
                                                src={beat.url}
                                                onEnded={() => setPlayingState({ id: beat.id, isPlaying: false })}
                                            />
                                        </div>
                                    </div>

                                    {/* Comments Section */}
                                    <div className="comments-section">
                                        {beat.comments.map((c, i) => (
                                            <div key={i} className="comment-row">
                                                <span className="user">{c.user}:</span>
                                                <span className="text">{c.text}</span>
                                                <span className="time">{c.time}</span>
                                            </div>
                                        ))}

                                        {currentUser?.idName !== 'GUEST' && currentUser?.role !== 'VISITOR' && (
                                            <div className="add-comment-row">
                                                <input
                                                    type="text"
                                                    placeholder="ADD_FEEDBACK..."
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            handleAddComment(beat.id, e.target.value);
                                                            e.target.value = '';
                                                        }
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>

            <style>{`
        .beat-production-container {
           position: fixed;
           top: 0; left: 0; width: 100%; height: 100%;
           z-index: 50; /* Below nav but above base content */
           color: white;
           font-family: var(--font-tech);
        }

        .studio-bg {
           position: absolute;
           top: 0; left: 0; width: 100%; height: 100%;
           background-image: url('/assets/beat_studio.png');
           background-size: cover;
           background-position: center;
           filter: brightness(0.4) contrast(1.2);
        }

        .content-overlay {
           position: relative;
           z-index: 2;
           width: 100%; height: 100%;
           background: rgba(0,0,0,0.4);
           backdrop-filter: blur(2px);
           display: flex;
           flex-direction: column;
           padding: 100px 40px 40px 40px;
        }

        .beat-header {
           border-bottom: 2px solid var(--color-red);
           padding-bottom: 20px;
           margin-bottom: 40px;
           display: flex;
           justify-content: space-between;
           align-items: flex-end;
        }

        .beat-header h2 {
           font-family: var(--font-main);
           font-size: 3rem;
           margin: 0;
           letter-spacing: -1px;
        }

        /* Empty State */
        .empty-upload-zone {
           flex: 1;
           display: flex;
           align-items: center;
           justify-content: center;
        }

        .upload-trigger {
           cursor: pointer;
           text-align: center;
           transition: transform 0.3s;
        }
        .upload-trigger:hover {
           transform: scale(1.05);
        }

        .plus-icon {
           font-size: 150px;
           line-height: 1;
           font-weight: 100;
           color: var(--color-white);
           text-shadow: 0 0 20px var(--color-red);
        }

        .upload-label {
           font-size: 14px;
           letter-spacing: 3px;
           color: var(--color-red);
           margin-top: 20px;
        }

        /* Beats List */
        .beats-scroll-area {
           flex: 1;
           overflow-y: auto;
           padding-right: 20px;
        }

        /* Custom Scrollbar */
        .beats-scroll-area::-webkit-scrollbar {
            width: 5px;
        }
        .beats-scroll-area::-webkit-scrollbar-thumb {
            background: var(--color-red);
        }

        .compact-upload {
           margin-bottom: 40px;
           text-align: right;
        }
        .compact-btn {
           border: 1px solid var(--color-white);
           padding: 10px 20px;
           cursor: pointer;
           font-size: 12px;
           transition: all 0.3s;
        }
        .compact-btn:hover {
           background: var(--color-red);
           border-color: var(--color-red);
           color: black;
        }

        .beat-card {
           background: rgba(10, 10, 10, 0.85);
           border-left: 4px solid var(--color-red);
           padding: 20px;
           margin-bottom: 30px;
           /* Glass interface look */
           box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
           backdrop-filter: blur(5px);
           border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .player-row {
           display: flex;
           align-items: center;
           gap: 20px;
           margin-bottom: 20px;
        }

        .play-btn {
           background: transparent;
           border: 1px solid var(--color-red);
           color: var(--color-red);
           width: 50px; height: 50px;
           border-radius: 50%;
           font-size: 20px;
           cursor: pointer;
           display: flex;
           align-items: center;
           justify-content: center;
           transition: all 0.3s;
        }
        .play-btn:hover {
           background: var(--color-red);
           color: black;
           box-shadow: 0 0 15px var(--color-red);
        }

        .waveform-visual {
           flex: 1;
           height: 40px;
           display: flex;
           align-items: center;
           gap: 2px;
        }
        .bar {
           width: 4px;
           background: #333;
           transition: height 0.2s;
        }
        .bar.animating {
           background: var(--color-red);
           animation: bounce 0.5s infinite ease-in-out alternate;
        }
        @keyframes bounce {
           to { height: 10%; }
        }

        .track-info h3 {
           font-family: var(--font-main);
           font-size: 1.5rem;
           margin: 0;
           text-transform: uppercase;
        }

        /* Comments */
        .comments-section {
           border-top: 1px solid #333;
           padding-top: 15px;
           font-size: 12px;
        }
        .comment-row {
           margin-bottom: 8px;
           display: flex;
           gap: 10px;
           color: #aaa;
        }
        .comment-row .user {
           color: var(--color-white);
           font-weight: bold;
        }
        .comment-row .time {
           color: #555;
           margin-left: auto;
        }

        .add-comment-row input {
           width: 100%;
           background: transparent;
           border: none;
           border-bottom: 1px solid #333;
           color: white;
           padding: 10px 0;
           font-family: var(--font-tech);
           outline: none;
           transition: border-color 0.3s;
        }
        .add-comment-row input:focus {
           border-bottom-color: var(--color-red);
        }
        .add-comment-row input::placeholder {
           color: #555;
        }
      `}</style>
        </div>
    );
};

export default BeatProduction;
