import React from 'react';
import { archiveData } from '../data/photos';

const MediaTeaser = ({ onOpenArchive }) => {
    // Take only first 3 items
    const teaserItems = archiveData.slice(0, 3);

    return (
        <section className="container" style={{ marginBottom: '150px' }}>

            <div style={{
                borderBottom: '1px solid #333',
                paddingBottom: '20px',
                marginBottom: '40px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'end'
            }}>
                <h2 style={{
                    fontSize: 'clamp(20px, 3vw, 40px)',
                    color: '#555',
                    fontFamily: 'var(--font-main)',
                    letterSpacing: '-1px'
                }}>
                    RECENT_INPUTS <span style={{ color: 'var(--color-red)' }}>/ /</span>
                </h2>
            </div>

            {/* Teaser Grid */}
            <div className="teaser-grid">
                {teaserItems.map((item, index) => (
                    <div key={item.id} className="teaser-item" onClick={onOpenArchive}>
                        <div className="teaser-inner">
                            {/* Placeholder or Image */}
                            <div className="teaser-bg"></div>

                            <div className="teaser-overlay">
                                <span className="teaser-id">00{index + 1}</span>
                                <span className="teaser-icon">+</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
            .view-all-btn {
                font-family: var(--font-tech);
                font-size: 12px;
                color: var(--color-red);
                cursor: pointer;
                border: none;
                padding: 10px 20px;
                transition: all 0.3s;
                letter-spacing: 2px;
            }
            .view-all-btn:hover {
                background: var(--color-red);
                color: black;
                box-shadow: 0 0 15px var(--color-red);
            }

            .teaser-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 20px;
            }
            @media (max-width: 768px) {
                .teaser-grid { grid-template-columns: 1fr; }
            }

            .teaser-item {
                height: 300px;
                background: #080808;
                border: 1px solid #222;
                cursor: pointer;
                position: relative;
                overflow: hidden;
            }
            
            .teaser-inner {
                width: 100%; height: 100%;
                transition: transform 0.5s;
            }
            
            .teaser-item:hover {
                border-color: var(--color-white);
            }
            .teaser-item:hover .teaser-inner {
                transform: scale(0.95);
            }

            .teaser-bg {
                width: 100%; height: 100%;
                background: #111;
                /* Add a pattern or slight gradient */
                background-image: radial-gradient(circle at center, #1a1a1a 0%, #000 100%);
                filter: blur(5px);
                transition: filter 0.3s;
            }
            .teaser-item:hover .teaser-bg {
                filter: blur(0px);
            }

            .teaser-overlay {
                position: absolute;
                top: 0; left: 0; width: 100%; height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                pointer-events: none;
            }

            .teaser-id {
                position: absolute;
                top: 10px; left: 10px;
                font-family: var(--font-tech);
                color: #333;
                font-size: 10px;
            }

            .teaser-icon {
                font-size: 40px;
                color: #333;
                transition: color 0.3s;
            }
            .teaser-item:hover .teaser-icon {
                color: var(--color-white);
                text-shadow: 0 0 10px white;
            }

        `}</style>
        </section>
    );
}

export default MediaTeaser;
