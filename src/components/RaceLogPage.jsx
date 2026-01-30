import React, { useState, useEffect, useRef } from 'react';

const RaceLogPage = () => {
    const [scratchedLogos, setScratchedLogos] = useState({});


    const victoryList = [
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
    ];

    const [driverLogs, setDriverLogs] = useState([
        { id: 1, type: 'MAINTENANCE', date: '2026.02.01', km: '142.500', loc: 'GARAGE', note: 'Yağ bakımı (Motul 5W-30) ve yağ filtresi değişimi yapıldı.' },
        { id: 2, type: 'RACE', date: '2026.01.28', km: '142.100', loc: 'ISTANBUL_PARK', note: 'Lastik ısısı kritik seviyedeydi ama virajda tutuş kaybetmedim.' },
        { id: 3, type: 'MAINTENANCE', date: '2026.01.25', km: '141.850', loc: 'SERVICE', note: 'Sol ön aks körüğü değiştirildi. Rot ayarı kontrol edildi.' }
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLog, setEditingLog] = useState(null);
    const [formData, setFormData] = useState({ type: 'MAINTENANCE', date: '', km: '', loc: '', note: '' });

    const handleAddNew = () => {
        setModalMode('LOG');
        setEditingLog(null);
        setFormData({ type: 'MAINTENANCE', date: new Date().toISOString().slice(0, 10).replace(/-/g, '.'), km: '', loc: '', note: '' });
        setIsModalOpen(true);
    };

    const handleEdit = (log) => {
        setModalMode('LOG');
        setEditingLog(log);
        setFormData({ ...log });
        setIsModalOpen(true);
    };

    const handleSave = () => {
        if (!formData.note || !formData.km) return; // Simple validation

        if (editingLog) {
            setDriverLogs(prev => prev.map(l => l.id === editingLog.id ? { ...formData, id: l.id } : l));
        } else {
            setDriverLogs(prev => [{ ...formData, id: Date.now() }, ...prev]);
        }
        setIsModalOpen(false);
    };

    /* ... */

    /* In render: */
    /* RIGHT: DRIVER LOG */
    /* <div className="driver-log-panel">
        <h3 className="panel-header">LOGBOOK // MAINTENANCE</h3>
        <div className="log-entries">
            {driverLogs.map(log => (
                <div key={log.id} className={`log-entry ${log.type === 'MAINTENANCE' ? 'log-maintenance' : ''}`}>
                    <div className="log-meta">
                        <span className="log-date">{log.date}</span>
                        <span className="log-km">{log.km} KM</span>
                        <span className="log-loc">{log.loc}</span>
                    </div>
                    <p className="log-text">{log.note}</p>
                </div>
            ))}
        </div>
    </div> */

    const fileInputRef = useRef(null);

    // Modal States
    const [modalMode, setModalMode] = useState('LOG'); // 'LOG' or 'MEDIA'

    // Media Form State
    const [editingMedia, setEditingMedia] = useState(null);
    const [mediaForm, setMediaForm] = useState({ note: '', date: '', location: '' });

    const [mediaItems, setMediaItems] = useState([
        { id: 101, type: 'video', src: '/assets/race_clip_1.mp4', thumbnail: '/assets/thumb_1.jpg', note: 'BMW M4 - 240 KM/H', date: '2025.11.02', location: 'E5' },
        { id: 102, type: 'image', src: '/assets/race_photo_1.jpg', thumbnail: '/assets/thumb_2.jpg', note: 'Lastik Yakma', date: '2026.01.20', location: 'KÖRFEZ' },
    ]);

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const url = URL.createObjectURL(file);
        const type = file.type.startsWith('video') ? 'video' : 'image';

        const newItem = {
            id: Date.now(),
            type,
            src: url,
            note: 'YENİ KANIT',
            date: new Date().toISOString().slice(0, 10).replace(/-/g, '.'),
            location: 'KONUM GIRIN'
        };

        setMediaItems(prev => [newItem, ...prev]);

        // Immediately open edit modal for the new item
        handleEditMedia(newItem);

        // Reset input
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
        <div className="racelog-container">
            <div className="racelog-bg"></div>

            <div className="racelog-content">

                {/* Header / Speedometer Vibe */}
                <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                    <h1 className="track-records-title">TRACK_RECORDS</h1>
                </div>

                <div className="dashboard-grid">

                    {/* LEFT: VICTORY LIST */}
                    <div className="victory-panel">
                        <h3 className="panel-header">VICTORY_LOG</h3>
                        <div className="victory-list">
                            {victoryList.map(item => (
                                <div
                                    key={item.id}
                                    className={`victory-item ${scratchedLogos[item.id] ? 'scratched' : ''}`}
                                    onClick={() => toggleScratch(item.id)}
                                >
                                    <span className="brand-name">{item.brand}</span>
                                    <span className="model-name">{item.model}</span>
                                    <div className="scratch-mark">X</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CENTER: TELEMETRY & SIGNATURE */}
                    <div className="telemetry-center">
                        <div className="signature-area">
                            <span className="project-name">FIAT COUPE</span>
                            <span className="alias">// 55 NM 686</span>
                        </div>

                        {/* EVIDENCE UPLOAD BUTTON (FLOATING OR CENTERED) */}
                        <div className="upload-section">
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                                accept="image/*,video/*"
                            />
                            <button className="upload-evidence-btn" onClick={handleUploadClick}>
                                <span className="plus-icon">+</span> UPLOAD_EVIDENCE
                            </button>
                        </div>

                        {/* MEDIA GALLERY */}
                        <div className="media-gallery-grid">
                            {mediaItems.map(item => (
                                <div key={item.id} className="media-card" onClick={() => handleEditMedia(item)}>
                                    <div className="media-content">
                                        {/* Placeholder for visuals since we don't have real files yet */}
                                        <div className="media-placeholder" style={{ background: `linear-gradient(45deg, #111, #222)` }}>
                                            {item.type === 'video' && <span className="play-icon">▶</span>}
                                            <span className="media-type-label">{item.type.toUpperCase()}</span>
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
                            ))}
                        </div>


                    </div>

                    {/* RIGHT: DRIVER LOG */}
                    <div className="driver-log-panel">
                        <div className="panel-header-wrapper">
                            <h3 className="panel-header-text">LOGBOOK // MAINTENANCE</h3>
                            <button className="icon-btn add-btn" title="Add Log" onClick={handleAddNew}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                            </button>
                        </div>

                        <div className="log-entries">
                            {driverLogs.map(log => (
                                <div key={log.id} className={`log-entry ${log.type === 'MAINTENANCE' ? 'log-maintenance' : ''}`}>
                                    <div className="log-header-row">
                                        <div className="log-meta">
                                            <span className="log-date">{log.date}</span>
                                            <span className="log-km">{log.km} KM</span>
                                            <span className="log-loc">{log.loc}</span>
                                        </div>
                                        <button className="icon-btn edit-btn" title="Edit Log" onClick={() => handleEdit(log)}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                        </button>
                                    </div>
                                    <p className="log-text">{log.note}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

            {/* MODAL */}
            {/* MODAL */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>
                            {modalMode === 'LOG'
                                ? (editingLog ? 'EDIT LOG' : 'NEW LOG')
                                : 'EDIT EVIDENCE'
                            }
                        </h3>

                        {/* FORM FOR DRIVER LOGS */}
                        {modalMode === 'LOG' && (
                            <>
                                <div className="form-group">
                                    <label>TYPE</label>
                                    <select
                                        value={formData.type}
                                        onChange={e => setFormData({ ...formData, type: e.target.value })}
                                    >
                                        <option value="MAINTENANCE">MAINTENANCE</option>
                                        <option value="RACE">RACE / TRACK</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>DATE</label>
                                    <input
                                        type="text"
                                        value={formData.date}
                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                        placeholder="YYYY.MM.DD"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>KM</label>
                                    <input
                                        type="text"
                                        value={formData.km}
                                        onChange={e => setFormData({ ...formData, km: e.target.value })}
                                        placeholder="142.xxx"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>LOCATION</label>
                                    <input
                                        type="text"
                                        value={formData.loc}
                                        onChange={e => setFormData({ ...formData, loc: e.target.value.toUpperCase() })}
                                        placeholder="GARAGE / ISTANBUL_PARK"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>NOTE</label>
                                    <textarea
                                        value={formData.note}
                                        onChange={e => setFormData({ ...formData, note: e.target.value })}
                                        rows="3"
                                        placeholder="Details..."
                                    />
                                </div>
                            </>
                        )}

                        {/* FORM FOR MEDIA EVIDENCE */}
                        {modalMode === 'MEDIA' && (
                            <>
                                <div className="media-preview-container">
                                    {editingMedia?.type === 'video' ? (
                                        <video src={editingMedia.src} style={{ width: '100%', borderRadius: '4px' }} />
                                    ) : (
                                        <img src={editingMedia?.src} alt="Preview" style={{ width: '100%', borderRadius: '4px' }} />
                                    )}
                                </div>

                                <div className="form-group">
                                    <label>NOTE / CAPTION</label>
                                    <input
                                        type="text"
                                        value={mediaForm.note}
                                        onChange={e => setMediaForm({ ...mediaForm, note: e.target.value })}
                                        placeholder="e.g. Lastik Yakma"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>LOCATION</label>
                                    <input
                                        type="text"
                                        value={mediaForm.location}
                                        onChange={e => setMediaForm({ ...mediaForm, location: e.target.value.toUpperCase() })}
                                        placeholder="e.g. KÖRFEZ"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>DATE</label>
                                    <input
                                        type="text"
                                        value={mediaForm.date}
                                        onChange={e => setMediaForm({ ...mediaForm, date: e.target.value })}
                                        placeholder="YYYY.MM.DD"
                                    />
                                </div>
                            </>
                        )}

                        <div className="modal-actions">
                            <button onClick={() => setIsModalOpen(false)} className="cancel-btn">CANCEL</button>
                            <button
                                onClick={modalMode === 'LOG' ? handleSave : handleSaveMedia}
                                className="save-btn"
                            >
                                SAVE
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
            /* MODAL STYLES */
            .modal-overlay {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0,0,0,0.8);
                display: flex; justify-content: center; align-items: center;
                z-index: 100;
                backdrop-filter: blur(5px);
            }
            .modal-content {
                background: #111;
                border: 2px solid var(--color-red);
                padding: 30px;
                width: 90%; max-width: 400px;
                box-shadow: 0 0 30px rgba(255, 0, 51, 0.3);
            }
            .modal-content h3 {
                font-family: var(--font-main);
                margin-top: 0;
                text-align: center;
                color: white;
                margin-bottom: 20px;
            }
            .form-group { margin-bottom: 15px; }
            .form-group label {
                 display: block; font-size: 10px; color: #888; margin-bottom: 5px; 
                 font-family: monospace;
            }
            .form-group input, .form-group select, .form-group textarea {
                width: 100%;
                background: #000;
                border: 1px solid #333;
                color: white;
                padding: 10px;
                font-family: var(--font-tech);
                font-size: 14px;
            }
            .form-group input:focus, .form-group textarea:focus {
                border-color: var(--color-red);
                outline: none;
            }
            
            .modal-actions { display: flex; gap: 10px; margin-top: 20px; }
            .modal-actions button { flex: 1; padding: 10px; cursor: pointer; border: none; font-weight: bold; }
            .cancel-btn { background: #333; color: #aaa; }
            .save-btn { background: var(--color-red); color: white; }
            .cancel-btn:hover { background: #444; }
            .save-btn:hover { background: red; box-shadow: 0 0 15px red; }

            .racelog-container {
                position: fixed;
                top: 0; left: 0; width: 100%; height: 100%;
                z-index: 50;
                color: white;
                font-family: var(--font-tech);
                overflow: hidden;
            }

            .racelog-bg {
                position: absolute;
                top: 0; left: 0; width: 100%; height: 100%;
                background-image: url('/assets/racelog_final_bg.png');
                background-size: cover;
                background-position: center bottom;
                z-index: 0;
            }

            .racelog-content {
                position: relative;
                z-index: 1;
                width: 100%; height: 100%;
                overflow-y: auto;
                padding: 100px 40px 40px 40px;
                background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.8));
                backdrop-filter: blur(2px);
            }

            .track-records-title {
                font-family: var(--font-main);
                font-size: clamp(2rem, 4vw, 4rem);
                letter-spacing: -2px;
                color: transparent;
                -webkit-text-stroke: 1px white;
                animation: vibrateEntry 0.5s ease-out forwards;
            }

            @keyframes vibrateEntry {
                0% { transform: scale(1.5); opacity: 0; letter-spacing: 20px; }
                80% { transform: scale(0.9); opacity: 1; letter-spacing: -5px; }
                100% { transform: scale(1); letter-spacing: -2px; }
            }

            .dashboard-grid {
                display: grid;
                grid-template-columns: 1fr 2fr 1fr;
                gap: 40px;
                max-width: 1400px;
                margin: 0 auto;
                height: 60vh;
            }
            @media (max-width: 1024px) {
                .dashboard-grid { grid-template-columns: 1fr; height: auto; }
            }

            /* PANELS */
            .panel-header-wrapper {
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 2px solid var(--color-red);
                padding-bottom: 10px;
                margin-bottom: 20px;
            }
            .panel-header-text {
                font-family: var(--font-main);
                font-size: 1.5rem;
                margin: 0;
                color: #ccc;
            }
            .panel-header {
                font-family: var(--font-main);
                font-size: 1.5rem;
                border-bottom: 2px solid var(--color-red);
                padding-bottom: 10px;
                margin-bottom: 20px;
                color: #ccc;
            }
                background: none;
                border: none;
                color: #555;
                cursor: pointer;
                transition: all 0.3s;
                padding: 5px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .icon-btn:hover {
                color: var(--color-red);
                transform: scale(1.1);
            }
            .add-btn {
                border: 1px solid #333;
                border-radius: 4px;
            }
            .add-btn:hover {
                border-color: var(--color-red);
                background: rgba(255, 0, 51, 0.1);
            }
            
            .log-header-row {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
            }

            /* VICTORY LIST */
            .victory-list {
                max-height: 400px;
                overflow-y: auto;
                padding-right: 10px;
            }
            .victory-list::-webkit-scrollbar { width: 3px; }
            .victory-list::-webkit-scrollbar-thumb { background: #333; }

            .victory-item {
                display: flex;
                justify-content: space-between;
                padding: 15px;
                background: rgba(0,0,0,0.5);
                border: 1px solid #333;
                margin-bottom: 10px;
                cursor: pointer;
                position: relative;
                overflow: hidden;
            }
            .victory-item:hover { border-color: #666; }

            .brand-name { font-weight: bold; font-family: sans-serif; }
            .model-name { color: #888; font-size: 12px; }

            .scratch-mark {
                position: absolute;
                top: 50%; left: 50%;
                transform: translate(-50%, -50%) scale(0);
                font-size: 100px;
                color: var(--color-red);
                pointer-events: none;
                font-family: 'Courier New', monospace; 
                opacity: 0;
                transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                text-shadow: 0 0 20px var(--color-red);
            }

            .victory-item.scratched .scratch-mark {
                transform: translate(-50%, -50%) scale(1) rotate(-15deg);
                opacity: 0.8;
            }
            .victory-item.scratched .brand-name, 
            .victory-item.scratched .model-name {
                opacity: 0.3;
                filter: blur(1px);
            }

            /* CENTER TELEMETRY */
            .telemetry-center {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                border: 1px solid rgba(255,255,255,0.1);
                background: rgba(0,0,0,0.3);
                position: relative;
            }
            
            /* Decorative corners */
            .telemetry-center::before {
                content: ''; position: absolute; top: -1px; left: -1px; width: 20px; height: 20px;
                border-top: 2px solid var(--color-red); border-left: 2px solid var(--color-red);
            }
            .telemetry-center::after {
                content: ''; position: absolute; bottom: -1px; right: -1px; width: 20px; height: 20px;
                border-bottom: 2px solid var(--color-red); border-right: 2px solid var(--color-red);
            }

            .signature-area {
                text-align: center;
                margin-bottom: 40px;
            }
            .project-name {
                font-family: 'Cedarville Cursive', cursive; /* Need to import a script font or use generic */
                font-family: serif; font-style: italic; /* Fallback for now */
                font-size: 3rem;
                display: block;
                color: white;
                text-shadow: 0 0 10px white;
            }
            .alias {
                font-family: var(--font-main);
                color: var(--color-red);
                font-size: 1.5rem;
                letter-spacing: 2px;
            }

            .telemetry-data {
                display: flex;
                gap: 40px;
            }
            .data-box {
                text-align: center;
            }
            .data-box .label {
                display: block;
                font-size: 10px;
                color: #555;
                letter-spacing: 2px;
            }
            .data-box .value {
                font-family: monospace;
                font-size: 2.5rem;
                color: var(--color-red);
                text-shadow: 0 0 10px var(--color-red);
            }
            .data-box .value small { font-size: 1rem; color: #888; }


            /* UPLOAD BUTTON */
            .upload-section {
                margin-top: 20px;
                margin-bottom: 30px;
                text-align: center;
            }
            .upload-evidence-btn {
                background: rgba(0,0,0,0.6);
                border: 1px solid var(--color-red);
                color: var(--color-red);
                padding: 10px 20px;
                font-family: var(--font-tech);
                font-size: 1.2rem;
                cursor: pointer;
                transition: all 0.3s;
                text-shadow: 0 0 5px var(--color-red);
                box-shadow: 0 0 10px rgba(255, 0, 51, 0.2);
                display: inline-flex;
                align-items: center;
                gap: 10px;
            }
            .upload-evidence-btn:hover {
                background: var(--color-red);
                color: black;
                box-shadow: 0 0 30px var(--color-red);
            }
            .plus-icon { font-size: 1.5rem; font-weight: bold; }

            /* GALLERY GRID */
            .media-gallery-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
                gap: 15px;
                width: 100%;
                max-width: 600px;
                max-height: 400px;
                overflow-y: auto;
                padding-right: 5px;
            }
            .media-gallery-grid::-webkit-scrollbar { width: 3px; }
            .media-gallery-grid::-webkit-scrollbar-thumb { background: var(--color-red); }

            .media-card {
                position: relative;
                aspect-ratio: 9/16; /* Vertical format as requested */
                border: 1px solid #333;
                overflow: hidden;
                cursor: pointer;
                transition: transform 0.2s;
                background: #000;
            }
            .media-card:hover {
                transform: scale(1.05);
                border-color: var(--color-red);
                z-index: 10;
            }

            .media-content, .media-placeholder {
                width: 100%; height: 100%;
                display: flex; justify-content: center; align-items: center;
                position: relative;
            }
            .play-icon {
                font-size: 2rem; color: white; opacity: 0.8;
                text-shadow: 0 0 10px black;
            }
            .media-type-label {
                position: absolute; bottom: 5px; right: 5px;
                font-size: 8px; color: #666; font-family: monospace;
            }

            .media-overlay {
                position: absolute;
                bottom: 0; left: 0; width: 100%;
                background: rgba(0,0,0,0.8);
                padding: 10px;
                transform: translateY(100%);
                transition: transform 0.3s ease;
                border-top: 2px solid var(--color-red);
            }
            .media-card:hover .media-overlay {
                transform: translateY(0);
            }
            
            .media-note {
                display: block;
                font-size: 12px;
                color: white;
                margin-bottom: 5px;
                font-weight: bold;
            }
            .media-meta {
                display: flex; justify-content: space-between;
                font-size: 9px;
                color: var(--color-red);
                font-family: monospace;
            }
            .media-preview {
                width: 100%; height: 100%; object-fit: cover;
                transition: opacity 0.3s;
            }
            .edit-overlay-icon {
                position: absolute; top: 5px; right: 5px;
                background: rgba(0,0,0,0.5); color: white;
                width: 20px; height: 20px; border-radius: 50%;
                display: flex; justify-content: center; align-items: center;
                font-size: 10px; cursor: pointer;
                opacity: 0; transition: opacity 0.2s;
            }
            .media-card:hover .edit-overlay-icon { opacity: 1; }
            .media-preview-container {
                margin-bottom: 20px;
                text-align: center;
            }
                max-height: 400px;
                overflow-y: auto;
                padding-right: 10px;
            }
            .log-entries::-webkit-scrollbar { width: 3px; }
            .log-entries::-webkit-scrollbar-thumb { background: #333; }

            .log-entry {
                margin-bottom: 20px;
                border-bottom: 1px solid #222;
                padding-bottom: 10px;
            }
            .log-meta {
                display: flex;
                justify-content: space-between;
                font-size: 10px;
                margin-bottom: 5px;
                color: #666;
            }
            .log-text {
                font-size: 14px;
                color: #ccc;
                line-height: 1.5;
            }

            .log-meta {
                display: flex;
                justify-content: space-between;
                font-size: 10px;
                margin-bottom: 5px;
                color: #666;
                font-family: monospace;
                flex-grow: 1;
                margin-right: 10px;
            }
            .log-km {
                color: var(--color-red);
                font-weight: bold;
            }
            .log-loc {
                color: #888;
            }
            .log-maintenance {
                border-left: 2px solid var(--color-red);
                padding-left: 10px;
                background: rgba(255, 0, 51, 0.05);
            }
            .log-maintenance .log-text {
                color: #aaa;
                font-style: italic;
            }
            
        `}</style>
        </div>
    );
};

export default RaceLogPage;
