import React, { useState, useRef } from 'react';
import GalleryGrid from './GalleryGrid';
import { archiveData } from '../data/photos';
import { useOperative } from '../context/OperativeContext';

const MediaPage = () => {
    const { currentUser } = useOperative();
    const [activeTab, setActiveTab] = useState('PHOTOS'); // 'PHOTOS' | 'VIDEOS'
    const [uploadedVideos, setUploadedVideos] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentVideo, setCurrentVideo] = useState(null);
    const [videoForm, setVideoForm] = useState({ title: '', location: '', date: '' });
    const fileInputRef = useRef(null);

    // Filter items based on tab
    const filteredItems = archiveData.filter(item => {
        if (activeTab === 'PHOTOS') {
            return item.type === 'photo' || item.type === 'empty';
        } else if (activeTab === 'VIDEOS') {
            return item.type === 'video';
        }
        return true;
    });

    // Merge uploaded videos with archive data for VIDEOS tab
    const displayItems = activeTab === 'VIDEOS'
        ? [...uploadedVideos, ...filteredItems]
        : filteredItems;

    // Upload handlers
    const handleUploadClick = () => fileInputRef.current?.click();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file || !file.type.startsWith('video')) return;

        const videoUrl = URL.createObjectURL(file);
        const now = new Date();
        const dateStr = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`;

        setCurrentVideo({
            id: Date.now(),
            type: 'video',
            src: videoUrl,
            title: file.name,
            location: 'UNKNOWN_LOC',
            date: dateStr
        });
        setVideoForm({ title: file.name, location: 'UNKNOWN_LOC', date: dateStr });
        setIsModalOpen(true);
        e.target.value = null;
    };

    const handleSaveVideo = () => {
        if (!currentVideo) return;
        const newVideo = {
            ...currentVideo,
            title: videoForm.title || 'UNTITLED',
            location: videoForm.location || 'UNKNOWN',
            date: videoForm.date
        };
        setUploadedVideos(prev => [newVideo, ...prev]);
        setIsModalOpen(false);
        setCurrentVideo(null);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentVideo(null);
    };

    return (
        <div className="media-page-container">

            {/* Background */}
            <div className="media-bg"></div>

            {/* Content Content - Centered and Scrolled */}
            <div className="media-content">

                {/* Header / Title */}
                <div style={{ textAlign: 'center', marginBottom: '40px', overflow: 'hidden' }}>
                    <h1 className="media-title-anim" style={{
                        fontFamily: 'var(--font-main)',
                        fontSize: 'clamp(3rem, 5vw, 5rem)',
                        color: 'transparent',
                        WebkitTextStroke: '2px var(--color-white)',
                        letterSpacing: '-2px',
                        margin: 0,
                        paddingBottom: '10px' // Space for glitch
                    }}>
                        GÖRSEL_KAYITLAR
                    </h1>
                </div>

                {/* Tab Navigation */}
                <div className="media-tabs-container">
                    <div
                        className={`media-tab ${activeTab === 'PHOTOS' ? 'active' : ''}`}
                        onClick={() => setActiveTab('PHOTOS')}
                    >
                        PHOTOS
                    </div>
                    <div className="tab-separator">//</div>
                    <div
                        className={`media-tab ${activeTab === 'VIDEOS' ? 'active' : ''}`}
                        onClick={() => setActiveTab('VIDEOS')}
                    >
                        VIDEOS
                    </div>
                </div>

                {/* Upload Button (VIDEOS Only) - RESTRICTED FOR GUESTS */}
                {activeTab === 'VIDEOS' && currentUser?.idName !== 'GUEST' && (
                    <>
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            accept="video/*"
                            onChange={handleFileChange}
                        />
                        <div className="upload-section">
                            <button className="upload-footage-btn" onClick={handleUploadClick}>
                                <span className="upload-icon">+</span>
                                UPLOAD_RAW_FOOTAGE
                            </button>
                        </div>
                    </>
                )}

                {/* Filtered Grid */}
                <GalleryGrid items={displayItems} />
            </div>

            {/* Upload Modal */}
            {isModalOpen && currentVideo && (
                <div className="upload-modal-overlay" onClick={handleCloseModal}>
                    <div className="upload-modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3 className="modal-title">RAW_FOOTAGE_UPLOAD</h3>

                        <div className="video-preview-box">
                            <video
                                src={currentVideo.src}
                                controls
                                autoPlay
                                muted
                                className="modal-video-preview"
                            />
                        </div>

                        <div className="modal-form">
                            <div className="form-field">
                                <label>TITLE</label>
                                <input
                                    type="text"
                                    value={videoForm.title}
                                    onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                                    placeholder="Enter title..."
                                />
                            </div>
                            <div className="form-field">
                                <label>LOCATION</label>
                                <input
                                    type="text"
                                    value={videoForm.location}
                                    onChange={(e) => setVideoForm({ ...videoForm, location: e.target.value })}
                                    placeholder="Enter location..."
                                />
                            </div>
                            <div className="form-field">
                                <label>DATE</label>
                                <input
                                    type="text"
                                    value={videoForm.date}
                                    onChange={(e) => setVideoForm({ ...videoForm, date: e.target.value })}
                                    placeholder="YYYY.MM.DD"
                                />
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button className="modal-btn cancel-btn" onClick={handleCloseModal}>
                                CANCEL
                            </button>
                            <button className="modal-btn save-btn" onClick={handleSaveVideo}>
                                SAVE_FOOTAGE
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
            .media-page-container {
                position: fixed;
                top: 0; left: 0; width: 100%; height: 100%;
                z-index: 50; /* Same layer logic as Beat Page */
                color: white;
                font-family: var(--font-tech);
                overflow: hidden; /* Handle inner scroll */
            }

            .media-bg {
                position: absolute;
                top: 0; left: 0; width: 100%; height: 100%;
                background-image: url('/assets/media_bg.png');
                background-size: cover;
                background-position: center;
                filter: brightness(0.4) contrast(1.1);
                z-index: 0;
            }

            .media-content {
                position: relative;
                z-index: 1;
                width: 100%; height: 100%;
                overflow-y: auto;
                padding: 100px 40px 40px 40px;
                background: rgba(0,0,0,0.6); /* Darker overlay */
                backdrop-filter: blur(3px);
            }

            /* Custom Scrollbar */
            .media-content::-webkit-scrollbar {
                width: 5px;
            }
            .media-content::-webkit-scrollbar-thumb {
                background: var(--color-red);
            }

            .media-title-anim {
                animation: slideInGlitch 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
                opacity: 0;
                transform: translateX(-50px);
            }

            @keyframes slideInGlitch {
                0% { opacity: 0; transform: translateX(-50px); clip-path: inset(0 100% 0 0); }
                20% { opacity: 1; transform: translateX(10px); clip-path: inset(0 0 0 0); }
                40% { transform: translateX(-5px); text-shadow: 2px 0 red, -2px 0 blue; }
                60% { transform: translateX(2px); text-shadow: none; }
                80% { transform: translateX(0); }
                100% { opacity: 1; transform: translateX(0); }
            }

            .media-tabs-container {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 20px;
                font-family: var(--font-tech);
                font-size: 24px;
                letter-spacing: 2px;
            }

            .media-tab {
                cursor: pointer;
                opacity: 0.5;
                transition: all 0.3s;
                border-bottom: 2px solid transparent;
                padding-bottom: 5px;
            }

            .media-tab:hover {
                opacity: 0.8;
                color: var(--color-white);
            }

            .media-tab.active {
                opacity: 1;
                color: var(--color-red);
                border-bottom-color: var(--color-red);
                text-shadow: 0 0 10px rgba(255, 0, 51, 0.5);
            }

            .tab-separator {
                color: #333;
                font-size: 20px;
            }

            /* UPLOAD SECTION */
            .upload-section {
                text-align: center;
                margin: 40px 0;
                padding: 20px 0;
                border-top: 1px solid #222;
                border-bottom: 1px solid #222;
            }

            .upload-footage-btn {
                background: transparent;
                border: 2px solid var(--color-red);
                color: white;
                font-family: var(--font-tech);
                font-size: 14px;
                letter-spacing: 3px;
                padding: 15px 40px;
                cursor: pointer;
                display: inline-flex;
                align-items: center;
                gap: 15px;
                transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
                text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
                box-shadow: 0 0 10px rgba(255, 0, 51, 0.2);
                position: relative;
                overflow: hidden;
            }

            .upload-footage-btn::before {
                content: '';
                position: absolute;
                top: 0; left: -100%;
                width: 100%; height: 100%;
                background: var(--color-red);
                transition: left 0.4s;
                z-index: -1;
            }

            .upload-footage-btn:hover::before {
                left: 0;
            }

            .upload-footage-btn:hover {
                color: black;
                transform: scale(1.05);
                box-shadow: 0 0 30px var(--color-red);
                text-shadow: none;
            }

            .upload-icon {
                font-size: 24px;
                font-weight: bold;
                color: var(--color-red);
                transition: color 0.3s;
            }

            .upload-footage-btn:hover .upload-icon {
                color: black;
            }

            /* UPLOAD MODAL */
            .upload-modal-overlay {
                position: fixed;
                top: 0; left: 0;
                width: 100%; height: 100%;
                background: rgba(0, 0, 0, 0.95);
                z-index: 200;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: fadeIn 0.3s;
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            .upload-modal-content {
                background: #0a0a0a;
                border: 3px solid var(--color-red);
                padding: 30px;
                width: 90%;
                max-width: 600px;
                box-shadow: 0 0 50px rgba(255, 0, 51, 0.4);
                animation: glitchSlideIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                position: relative;
            }

            @keyframes glitchSlideIn {
                0% { transform: translateY(-100px) scale(0.8); opacity: 0; }
                50% { transform: translateY(10px) scale(1.05); }
                100% { transform: translateY(0) scale(1); opacity: 1; }
            }

            .modal-title {
                font-family: var(--font-main);
                color: var(--color-red);
                text-align: center;
                font-size: 24px;
                letter-spacing: 2px;
                margin: 0 0 20px 0;
                text-shadow: 0 0 10px rgba(255, 0, 51, 0.5);
            }

            .video-preview-box {
                width: 100%;
                background: #000;
                border: 1px solid #333;
                margin-bottom: 20px;
                position: relative;
                overflow: hidden;
            }

            .modal-video-preview {
                width: 100%;
                display: block;
                max-height: 300px;
                object-fit: contain;
            }

            .modal-form {
                display: flex;
                flex-direction: column;
                gap: 15px;
                margin-bottom: 20px;
            }

            .form-field {
                display: flex;
                flex-direction: column;
                gap: 5px;
            }

            .form-field label {
                font-family: var(--font-tech);
                font-size: 10px;
                color: #888;
                letter-spacing: 2px;
            }

            .form-field input {
                background: #000;
                border: 1px solid #333;
                color: white;
                padding: 12px;
                font-family: monospace;
                font-size: 14px;
                transition: border-color 0.3s;
            }

            .form-field input:focus {
                outline: none;
                border-color: var(--color-red);
                box-shadow: 0 0 10px rgba(255, 0, 51, 0.3);
            }

            .modal-actions {
                display: flex;
                gap: 15px;
            }

            .modal-btn {
                flex: 1;
                padding: 12px;
                font-family: var(--font-tech);
                font-size: 12px;
                letter-spacing: 2px;
                cursor: pointer;
                border: none;
                transition: all 0.3s;
            }

            .cancel-btn {
                background: #222;
                color: #888;
            }

            .cancel-btn:hover {
                background: #333;
                color: white;
            }

            .save-btn {
                background: var(--color-red);
                color: black;
                font-weight: bold;
            }

            .save-btn:hover {
                background: white;
                box-shadow: 0 0 20px var(--color-red);
            }
        `}</style>
        </div>
    );
};

export default MediaPage;
