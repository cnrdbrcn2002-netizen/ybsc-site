import React, { useState, useEffect, useRef } from 'react';
import { machinesData } from '../data/machinesData';
import { useOperative } from '../context/OperativeContext';

const VehicleDetailPage = ({ machineId, onBack }) => {
    const { currentUser } = useOperative();
    // DEBUG: Check what currentUser is
    console.log("VehicleDetailPage CurrentUser:", currentUser);
    console.log("Is Guest?", currentUser?.idName === 'GUEST' || currentUser?.role === 'VISITOR');

    const [machine, setMachine] = useState(null);
    const [scratchedLogos, setScratchedLogos] = useState({});

    // Default Mock Data (In a real app, this comes from machine.driverLogs etc)
    const [driverLogs, setDriverLogs] = useState([]);
    const [mediaItems, setMediaItems] = useState([]);
    const [victoryList, setVictoryList] = useState([]);

    // Modal States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('LOG');
    const [editingLog, setEditingLog] = useState(null);
    const [formData, setFormData] = useState({ type: 'MAINTENANCE', date: '', km: '', loc: '', note: '' });
    const [editingMedia, setEditingMedia] = useState(null);
    const [mediaForm, setMediaForm] = useState({ note: '', date: '', location: '' });

    const fileInputRef = useRef(null);

    useEffect(() => {
        const foundMachine = machinesData.find(m => m.id === machineId);
        setMachine(foundMachine);

        if (foundMachine) {
            // Load specific data based on ID (Simulated)
            if (foundMachine.id === 1) { // Fiat Coupe
                setVictoryList([
                    { id: 1, brand: 'SEAT', model: 'Leon 1.5 FR', date: '2025.11.02' },
                    { id: 2, brand: 'VW', model: 'Passat 1.4 TSI', date: '2025.12.10' },
                    { id: 3, brand: 'MERCEDES', model: 'A180d AMG', date: '2026.01.05' },
                    { id: 4, brand: 'RENAULT', model: 'Clio 1.2', date: '2026.01.20' },
                    { id: 5, brand: 'TOYOTA', model: 'Corolla 1.6', date: '2026.01.22' },
                    { id: 6, brand: 'MINI', model: 'Cooper 1.5', date: '2026.01.25' },
                    { id: 7, brand: 'RENAULT', model: 'Megane 1.3', date: '2026.01.26' },
                    { id: 8, brand: 'FORD', model: 'Focus 1.6 TDCi', date: '2026.01.27' },
                    { id: 9, brand: 'FORD', model: 'Fiesta 1.4', date: '2026.01.28' },
                    { id: 10, brand: 'TOYOTA', model: 'Auris 1.4 D-4D', date: '2026.01.29' }
                ]);
                setDriverLogs([
                    { id: 1, type: 'MAINTENANCE', date: '2026.02.01', km: '142.500', loc: 'GARAGE', note: 'Yağ bakımı (Motul 5W-30) ve yağ filtresi değişimi yapıldı.' },
                    { id: 2, type: 'RACE', date: '2026.01.28', km: '142.100', loc: 'ISTANBUL_PARK', note: 'Lastik ısısı kritik seviyedeydi ama virajda tutuş kaybetmedim.' },
                    { id: 3, type: 'MAINTENANCE', date: '2026.01.25', km: '141.850', loc: 'SERVICE', note: 'Sol ön aks körüğü değiştirildi. Rot ayarı kontrol edildi.' }
                ]);
                setMediaItems([
                    { id: 101, type: 'video', src: '/assets/race_clip_1.mp4', thumbnail: '/assets/thumb_1.jpg', note: 'BMW M4 - 240 KM/H', date: '2025.11.02', location: 'E5' },
                    { id: 102, type: 'image', src: '/assets/race_photo_1.jpg', thumbnail: '/assets/thumb_2.jpg', note: 'Lastik Yakma', date: '2026.01.20', location: 'KÖRFEZ' },
                ]);
            } else {
                // Others
                setVictoryList([]);
                setDriverLogs([]);
                setMediaItems([]);
            }
        }
    }, [machineId]);

    if (!machine) return <div>LOADING UNIT...</div>;

    // --- HANDLERS ---
    const handleAddNewLog = () => {
        setModalMode('LOG');
        setEditingLog(null);
        setFormData({ type: 'MAINTENANCE', date: new Date().toISOString().slice(0, 10).replace(/-/g, '.'), km: '', loc: '', note: '' });
        setIsModalOpen(true);
    };

    const handleEditLog = (log) => {
        setModalMode('LOG');
        setEditingLog(log);
        setFormData({ ...log });
        setIsModalOpen(true);
    };

    const handleSaveLog = () => {
        if (!formData.note) return;
        if (editingLog) {
            setDriverLogs(prev => prev.map(l => l.id === editingLog.id ? { ...formData, id: l.id } : l));
        } else {
            setDriverLogs(prev => [{ ...formData, id: Date.now() }, ...prev]);
        }
        setIsModalOpen(false);
    };

    const handleUploadClick = () => fileInputRef.current.click();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        const type = file.type.startsWith('video') ? 'video' : 'image';
        const newItem = {
            id: Date.now(),
            type,
            src: url,
            note: 'RAW_DATA_UPLOAD',
            date: new Date().toISOString().slice(0, 10).replace(/-/g, '.'),
            location: 'UNKNOWN_LOC'
        };
        setMediaItems(prev => [newItem, ...prev]);
        handleEditMedia(newItem);
        e.target.value = null;
    };

    const handleEditMedia = (item) => {
        setModalMode('MEDIA');
        setEditingMedia(item);
        setMediaForm({ note: item.note, date: item.date, location: item.location });
        setIsModalOpen(true);
    };

    const handleSaveMedia = () => {
        if (!editingMedia) return;
        setMediaItems(prev => prev.map(m => m.id === editingMedia.id ? { ...m, ...mediaForm } : m));
        setIsModalOpen(false);
    };

    const toggleScratch = (id) => {
        setScratchedLogos(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className="vehicle-detail-container">
            {/* BACKGROUND */}
            <div className="detail-bg" style={{ backgroundImage: `url(${machine.background})` }}></div>
            <div className="detail-overlay"></div>

            {/* BACK BUTTON */}
            <button className="back-btn" onClick={onBack}>
                &lt; FLEET_COMMAND
            </button>

            <div className="detail-content">

                {/* HEADER: NAME & SPECS */}
                <div className="vehicle-header">
                    <h1 className="vehicle-name">{machine.name}</h1>
                    <span className="vehicle-plate">// {machine.plate}</span>

                    {/* SCROLLING SPECS */}
                    <div className="specs-marquee">
                        <div className="marquee-content">
                            {Object.entries(machine.specs).map(([key, value]) => (
                                <span key={key} className="spec-item">
                                    <span className="spec-key">{key}:</span>
                                    <span className="spec-val">{value}</span>
                                </span>
                            ))}
                            {/* Duplicate for smooth loop */}
                            {Object.entries(machine.specs).map(([key, value]) => (
                                <span key={`dup-${key}`} className="spec-item">
                                    <span className="spec-key">{key}:</span>
                                    <span className="spec-val">{value}</span>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="dashboard-grid">

                    {/* LEFT: VICTORY LIST (Conditional) or MODS */}
                    <div className="panel left-panel">
                        {machine.isRacer ? (
                            <>
                                <h3 className="panel-header">VICTORY_LOG</h3>
                                <div className="victory-list">
                                    {victoryList.map(item => (
                                        <div
                                            key={item.id}
                                            className={`victory-item ${scratchedLogos[item.id] ? 'scratched' : ''} ${currentUser?.idName === 'GUEST' || currentUser?.role === 'VISITOR' ? 'no-pointer' : ''}`}
                                            onClick={() => (currentUser?.idName !== 'GUEST' && currentUser?.role !== 'VISITOR') && toggleScratch(item.id)}
                                        >
                                            <span className="brand-name">{item.brand}</span>
                                            <span className="model-name">{item.model}</span>
                                            <div className="scratch-mark">X</div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <>
                                <h3 className="panel-header">MODIFICATIONS</h3>
                                <div className="mods-list">
                                    {machine.mods.map((mod, i) => (
                                        <div key={i} className="mod-item">
                                            {mod}
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* CENTER: EVIDENCE UPLOAD & GALLERY */}
                    <div className="panel center-panel">
                        {/* RESTRICT UPLOAD FOR GUEST */}
                        {currentUser?.idName !== 'GUEST' && currentUser?.role !== 'VISITOR' && (
                            <div className="upload-section">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    onChange={handleFileChange}
                                    accept="image/*,video/*"
                                />
                                <button className="upload-evidence-btn" onClick={handleUploadClick}>
                                    <span className="plus-icon">+</span> UPLOAD_RAW_DATA
                                </button>
                            </div>
                        )}

                        <div className="media-gallery-grid">
                            {mediaItems.length > 0 ? (
                                mediaItems.map(item => (
                                    <div key={item.id} className={`media-card ${currentUser?.idName === 'GUEST' || currentUser?.role === 'VISITOR' ? 'no-pointer' : ''}`} onClick={() => (currentUser?.idName !== 'GUEST' && currentUser?.role !== 'VISITOR') && handleEditMedia(item)}>
                                        <div className="media-content">
                                            <div className="media-placeholder" style={{ background: `linear-gradient(45deg, #111, #222)` }}>
                                                {item.type === 'video' && <span className="play-icon">▶</span>}
                                                {item.src && (item.type === 'video' ?
                                                    <video src={item.src} className="media-preview" muted /> :
                                                    <img src={item.src} className="media-preview" alt="evidence" />
                                                )}
                                            </div>
                                        </div>
                                        <div className="media-overlay">
                                            <span className="media-note">{item.note}</span>
                                            <div className="media-meta">
                                                <span>{item.location}</span>
                                                <span>{item.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="no-media">NO_DATA_AVAILABLE</div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT: DRIVER LOGS or CHAT */}
                    <div className="panel right-panel">
                        <div className="panel-header-wrapper">
                            <h3 className="panel-header-text">SYSTEM_LOGS</h3>
                            {currentUser?.idName !== 'GUEST' && currentUser?.role !== 'VISITOR' && (
                                <button className="icon-btn add-btn" title="Add Log" onClick={handleAddNewLog}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                </button>
                            )}
                        </div>

                        <div className="log-entries">
                            {driverLogs.length > 0 ? driverLogs.map(log => (
                                <div key={log.id} className={`log-entry ${log.type === 'MAINTENANCE' ? 'log-maintenance' : ''}`}>
                                    <div className="log-header-row">
                                        <div className="log-meta">
                                            <span className="log-date">{log.date}</span>
                                            {log.km && <span className="log-km">{log.km} KM</span>}
                                            {log.loc && <span className="log-loc">{log.loc}</span>}
                                        </div>
                                        {currentUser?.idName !== 'GUEST' && currentUser?.role !== 'VISITOR' && (
                                            <button className="icon-btn edit-btn" title="Edit Log" onClick={() => handleEditLog(log)}>
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                            </button>
                                        )}
                                    </div>

                                    <p className="log-text">{log.note}</p>
                                </div>
                            )) : (
                                <div className="log-text" style={{ textAlign: 'center', opacity: 0.5 }}>SYSTEM NORMAL</div>
                            )}
                        </div>
                    </div>

                </div>
            </div>

            {/* MODAL (Reused logic) */}
            {
                isModalOpen && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h3>{modalMode === 'LOG' ? (editingLog ? 'EDIT LOG' : 'NEW LOG') : 'EDIT EVIDENCE'}</h3>

                            {modalMode === 'LOG' && (
                                <>
                                    <div className="form-group">
                                        <label>TYPE</label>
                                        <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                                            <option value="MAINTENANCE">MAINTENANCE</option>
                                            <option value="RACE">RACE / TRACK</option>
                                            <option value="CHAT">CHAT / NOTE</option>
                                        </select>
                                    </div>
                                    <div className="form-group"><label>DATE</label><input type="text" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} placeholder="YYYY.MM.DD" /></div>
                                    <div className="form-group"><label>NOTE</label><textarea value={formData.note} onChange={e => setFormData({ ...formData, note: e.target.value })} rows="3" placeholder="Details..." /></div>
                                </>
                            )}
                            {modalMode === 'MEDIA' && (
                                <>
                                    <div className="media-preview-container">
                                        {editingMedia?.type === 'video' ? <video src={editingMedia.src} style={{ width: '100%', borderRadius: '4px' }} /> : <img src={editingMedia?.src} alt="Preview" style={{ width: '100%', borderRadius: '4px' }} />}
                                    </div>
                                    <div className="form-group"><label>NOTE</label><input type="text" value={mediaForm.note} onChange={e => setMediaForm({ ...mediaForm, note: e.target.value })} /></div>
                                    <div className="form-group"><label>LOCATION</label><input type="text" value={mediaForm.location} onChange={e => setMediaForm({ ...mediaForm, location: e.target.value })} /></div>
                                </>
                            )}

                            <div className="modal-actions">
                                <button onClick={() => setIsModalOpen(false)} className="cancel-btn">CANCEL</button>
                                <button onClick={modalMode === 'LOG' ? handleSaveLog : handleSaveMedia} className="save-btn">SAVE</button>
                            </div>
                        </div>
                    </div>
                )
            }

            <style>{`
                .vehicle-detail-container {
                     position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                     color: white; font-family: var(--font-tech); overflow: hidden;
                }
                .detail-bg {
                    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    background-size: cover; background-position: center; z-index: 0;
                }
                .detail-overlay {
                    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    background: linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.95));
                    backdrop-filter: blur(5px); z-index: 1;
                }
                .detail-content {
                    position: relative; z-index: 10; width: 100%; height: 100%;
                    overflow-y: auto; padding: 20px;
                }
                .back-btn {
                    position: absolute; top: 90px; left: 40px; z-index: 20;
                    background: transparent; border: 1px solid #333; color: #888;
                    padding: 5px 15px; font-family: var(--font-tech); cursor: pointer;
                    transition: all 0.3s;
                }
                .back-btn:hover { border-color: var(--color-red); color: white; }

                /* HEADER */
                .vehicle-header { text-align: center; margin-top: 40px; margin-bottom: 30px; }
                .vehicle-name {
                    font-family: var(--font-main);
                    font-weight: 800;
                    font-style: italic;
                    text-transform: uppercase;
                    font-size: 4rem; 
                    margin: 0;
                    color: white;
                    text-shadow: 0 0 15px rgba(255, 255, 255, 0.6);
                    letter-spacing: -2px;
                    transform: scaleX(1.1);
                }
                .vehicle-plate {
                    font-family: var(--font-main); color: var(--color-red);
                    font-size: 1.5rem; letter-spacing: 2px;
                }

                /* MARQUEE */
                .specs-marquee {
                    margin-top: 20px; overflow: hidden; white-space: nowrap;
                    border-top: 1px solid #333; border-bottom: 1px solid #333;
                    padding: 10px 0; background: rgba(0,0,0,0.5);
                }
                .marquee-content {
                    display: inline-block; animation: marquee 20s linear infinite;
                }
                .spec-item { margin-right: 50px; font-family: monospace; font-size: 0.9rem; }
                .spec-key { color: #666; margin-right: 10px; }
                .spec-val { color: var(--color-red); }
                @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

                /* GRID */
                .dashboard-grid {
                    display: grid; grid-template-columns: 1fr 2fr 1fr; gap: 30px;
                    max-width: 1400px; margin: 0 auto; height: 60vh;
                }
                @media (max-width: 1024px) { .dashboard-grid { grid-template-columns: 1fr; height: auto; } }

                .panel { background: rgba(0,0,0,0.3); border: 1px solid #222; padding: 20px; }
                .panel-header, .panel-header-text {
                    font-family: var(--font-main); color: #888; border-bottom: 2px solid var(--color-red);
                    padding-bottom: 5px; margin-bottom: 15px;
                }
                
                /* LISTS */
                .victory-list, .log-entries { max-height: 400px; overflow-y: auto; }
                .victory-item { 
                    display: grid; 
                    grid-template-columns: 1fr 60px 1fr; /* 3 columns: Brand, Gap for X, Model */
                    align-items: center;
                    padding: 15px; 
                    border-bottom: 1px solid #222; 
                    cursor: pointer; 
                    position: relative; 
                    transition: all 0.3s; 
                }
                .victory-item:hover { background: rgba(255, 0, 51, 0.05); border-color: #555; }

                .brand-name { text-align: left; font-weight: bold; }
                .model-name { text-align: right; color: #888; font-size: 12px; }
                
                .scratch-mark { 
                    position: absolute; 
                    top: 50%; left: 50%; 
                    /* Initial State: Hidden and 'far away' */
                    transform: translate(-50%, -50%) perspective(400px) rotateY(90deg) scale(0.5); 
                    font-size: 60px; 
                    color: var(--color-red); 
                    opacity: 0; 
                    pointer-events: none;
                    text-shadow: 2px 2px 10px rgba(255, 0, 51, 0.8);
                    font-family: 'Courier New', monospace;
                    font-weight: 900;
                    letter-spacing: -5px;
                    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); /* Elastic snap effect */
                }
                
                .victory-item.scratched .scratch-mark { 
                    /* Final State: Wrapped around cylinder */
                    transform: translate(-50%, -50%) perspective(400px) rotateY(0deg) scale(1.2) rotateZ(-5deg); 
                    opacity: 1;
                    /* Simulating curved surface reflection/shadow */
                    background: linear-gradient(90deg, transparent 45%, rgba(255,0,51,0.4) 50%, transparent 55%);
                    -webkit-background-clip: text;
                    /* Note: Background clip on text might override color, strictly shadows are safer for 3D feel */
                    text-shadow: 
                        0 0 5px var(--color-red),
                        3px 0 0px rgba(100,0,0,0.8), /* Depth side */
                        -3px 0 0px rgba(100,0,0,0.8); /* Depth side */
                }
                
                .victory-item.scratched .brand-name,
                .victory-item.scratched .model-name {
                    opacity: 0.4;
                    filter: blur(0.5px);
                }

                /* Add a vertical line in the middle to emphasize the "column/cylinder" axis optionally */
                .victory-item::after {
                    content: '';
                    position: absolute; left: 50%; top: 10%; bottom: 10%;
                    width: 1px; background: #333;
                    transform: translateX(-50%);
                    z-index: 0;
                    opacity: 0.3;
                }

                .mod-item { padding: 10px; border-bottom: 1px solid #222; color: #ccc; font-family: monospace; }

                /* UPLOAD & GALLERY */
                .upload-section { text-align: center; margin-bottom: 20px; }
                .upload-evidence-btn {
                    background: transparent; border: 1px solid var(--color-red); color: white;
                    padding: 10px 20px; font-family: var(--font-tech); cursor: pointer;
                    display: inline-flex; align-items: center; gap: 10px;
                    box-shadow: 0 0 10px rgba(255,0,51,0.1);
                    text-shadow: 0 0 5px white; /* Neon for text */
                }
                .upload-evidence-btn:hover { background: var(--color-red); color: black; box-shadow: 0 0 20px var(--color-red); text-shadow: none; }
                
                .plus-icon {
                    font-size: 1.2rem;
                    font-weight: bold;
                    color: white;
                    text-shadow: 0 0 10px white; /* Neon for symbol */
                }
                
                .media-gallery-grid {
                    display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 10px;
                    max-height: 500px; overflow-y: auto;
                }
                .media-card { aspect-ratio: 9/16; border: 1px solid #333; position: relative; cursor: pointer; overflow: hidden; }
                .media-card:hover { border-color: var(--color-red); transform: scale(1.02); z-index: 5; }
                .media-preview { width: 100%; height: 100%; object-fit: cover; }
                .media-overlay {
                    position: absolute; bottom: 0; left: 0; width: 100%; background: rgba(0,0,0,0.8);
                    padding: 5px; transform: translateY(100%); transition: transform 0.3s;
                    border-top: 2px solid var(--color-red);
                }
                .media-card:hover .media-overlay { transform: translateY(0); }
                .media-note { display: block; font-size: 10px; color: white; margin-bottom: 3px; }
                .media-meta { display: flex; justify-content: space-between; font-size: 8px; color: var(--color-red); }

                /* LOG ENTRY */
                .log-entry { margin-bottom: 10px; border-bottom: 1px solid #222; padding-bottom: 5px; }
                .log-header-row { display: flex; justify-content: space-between; }
                .log-text { font-size: 12px; color: #aaa; margin-top: 5px; }

                /* MODAL */
                .modal-overlay { position: fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:100; display:flex; justify-content:center; align-items:center; }
                .modal-content { background: #111; border: 2px solid var(--color-red); padding: 30px; width: 90%; max-width: 400px; box-shadow: 0 0 30px rgba(255,0,51,0.2); }
                .modal-content h3 { color:white; text-align:center; margin-top:0; margin-bottom:20px; font-family:var(--font-main); }
                .form-group { margin-bottom:15px; }
                .form-group label { display:block; font-size:10px; color:#888; font-family:monospace; margin-bottom:5px; }
                .form-group input, .form-group textarea, .form-group select { width:100%; background:#000; border:1px solid #333; color:white; padding:10px; font-family:var(--font-tech); }
                .form-group input:focus { border-color:var(--color-red); outline:none; }
                .modal-actions { display:flex; gap:10px; margin-top:20px; }
                .modal-actions button { flex:1; padding:10px; cursor:pointer; border:none; font-weight:bold; }
                .save-btn { background:var(--color-red); color:white; }
                .cancel-btn { background:#333; color:#aaa; }

                /* ICON BUTTONS */
                .icon-btn {
                    background: none; border: none; cursor: pointer; padding: 5px;
                    color: white;
                    transition: all 0.3s ease;
                    filter: drop-shadow(0 0 2px white); /* Neon glow */
                }
                .icon-btn:hover {
                    color: var(--color-red);
                    filter: drop-shadow(0 0 5px var(--color-red));
                    transform: scale(1.1);
                }

                /* SCROLLBARS */
                ::-webkit-scrollbar { width: 4px; }
                ::-webkit-scrollbar-track { background: #111; }
                ::-webkit-scrollbar-thumb { background: #333; }
                ::-webkit-scrollbar-thumb:hover { background: var(--color-red); }

                .no-pointer { pointer-events: none !important; }
            `}</style>
        </div >
    );
};

export default VehicleDetailPage;
