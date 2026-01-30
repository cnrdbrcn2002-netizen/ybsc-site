import React, { useState, useEffect } from 'react';
import { networkData } from '../data/networkData';

const NetworkPage = () => {
    const [selectedMember, setSelectedMember] = useState(null);

    const handleMemberClick = (member) => {
        setSelectedMember(member);
    };

    const handleBack = () => {
        setSelectedMember(null);
    };

    return (
        <div className="network-page-container">
            {/* BACKGROUND TEXT */}
            <div className="network-bg-text">CREW // CREW // CREW</div>

            {!selectedMember ? (
                // LOBBY VIEW
                <div className="network-content">
                    <h1 className="page-title">THE CREW</h1>

                    <div className="members-grid">
                        {networkData.map(member => (
                            <div
                                key={member.id}
                                className="member-card"
                                onClick={() => handleMemberClick(member)}
                            >
                                <div className="card-inner">
                                    <div className="image-frame">
                                        {member.profileImg ? (
                                            <img src={member.profileImg} alt={member.name} />
                                        ) : (
                                            <div className="placeholder">?</div>
                                        )}
                                        <div className="overlay"></div>
                                    </div>
                                    <div className="card-info">
                                        <h3>{member.nickname || member.name}</h3>
                                        <div className="role">{member.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                // DETAIL VIEW
                <div className="member-detail">
                    <button className="back-button" onClick={handleBack}>&lt; BACK</button>

                    <div className="detail-cols">
                        <div className="col-left">
                            <div className="big-image">
                                {selectedMember.profileImg ? (
                                    <img src={selectedMember.profileImg} alt={selectedMember.name} />
                                ) : (
                                    <div className="placeholder-big">?</div>
                                )}
                            </div>
                        </div>
                        <div className="col-right">
                            <h1>{selectedMember.nickname}</h1>
                            <h2>{selectedMember.role}</h2>
                            <p>"{selectedMember.slogan}"</p>

                            <div className="stats">
                                <div className="stat">
                                    <label>EXPERTISE</label>
                                    <span>{selectedMember.expertise}</span>
                                </div>
                                <div className="stat">
                                    <label>MAHLUKAT LEVEL</label>
                                    <span>{selectedMember.mahlukatlık}</span>
                                </div>
                                <div className="stat">
                                    <label>FAV RHYTHM</label>
                                    <span>{selectedMember.favoriteRhythm}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .network-page-container {
                    min-height: 100vh;
                    background: #000;
                    color: white;
                    position: relative;
                    padding: 100px 50px;
                    font-family: var(--font-tech);
                }
                .network-bg-text {
                    position: absolute; top: 10%; left: -5%;
                    font-size: 20rem; color: #111; font-weight: bold;
                    z-index: 0; white-space: nowrap; pointer-events: none;
                }
                .network-content {
                    position: relative; z-index: 2;
                }
                .page-title {
                    font-family: var(--font-main); font-size: 4rem; margin-bottom: 50px;
                    text-align: center; color: white;
                }
                .members-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 40px;
                    max-width: 1200px; margin: 0 auto;
                }
                
                .member-card {
                    cursor: pointer;
                    transition: transform 0.3s;
                }
                .member-card:hover {
                    transform: translateY(-10px);
                }
                .image-frame {
                    height: 400px; border: 1px solid #333; position: relative;
                    background: #050505;
                }
                .image-frame img { width: 100%; height: 100%; object-fit: cover; filter: grayscale(100%); transition: filter 0.3s; }
                .member-card:hover img { filter: grayscale(0%); }
                
                .card-info {
                    padding: 20px 0; border-top: 2px solid #333; margin-top: -2px; position: relative; z-index: 2;
                    background: #000; transition: border-color 0.3s;
                }
                .member-card:hover .card-info { border-color: var(--color-red); }
                
                .card-info h3 { margin: 0; font-family: var(--font-main); font-size: 1.5rem; color: #ccc; }
                .card-info .role { color: #666; font-size: 0.9rem; margin-top: 5px; }

                .placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 4rem; color: #333; }

                /* DETAIL */
                .member-detail { position: relative; z-index: 10; animation: fadeIn 0.5s; }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                
                .back-button {
                    background: none; border: none; color: #888; font-size: 1.2rem; cursor: pointer; margin-bottom: 30px;
                }
                .back-button:hover { color: white; }

                .detail-cols { display: flex; gap: 50px; }
                .col-left { flex: 1; }
                .big-image { width: 100%; height: 600px; border: 1px solid #333; }
                .big-image img { width: 100%; height: 100%; object-fit: cover; }
                
                .col-right { flex: 1; display: flex; flex-direction: column; justify-content: center; }
                .col-right h1 { font-family: var(--font-main); font-size: 4rem; margin: 0; line-height: 1; }
                .col-right h2 { color: var(--color-red); margin-bottom: 20px; font-size: 2rem; }
                .col-right p { font-size: 1.2rem; color: #aaa; font-style: italic; margin-bottom: 40px; border-left: 2px solid #333; padding-left: 20px; }
                
                .stat { margin-bottom: 15px; border-bottom: 1px solid #222; padding-bottom: 5px; }
                .stat label { display: block; color: #555; font-size: 0.8rem; margin-bottom: 5px; }
                .stat span { font-size: 1.1rem; color: white; }
                
                @media(max-width: 768px) {
                    .detail-cols { flex-direction: column; }
                    .big-image { height: 400px; }
                }
            `}</style>
        </div>
    );
};

export default NetworkPage;
