import React, { useState } from 'react';
import { machinesData } from '../data/machinesData';

const MachinesPage = ({ onSelectMachine }) => {
    const [hoveredMachine, setHoveredMachine] = useState(null);

    return (
        <div className="machines-container">
            {/* BACKGROUND LAYERS */}
            <div className="bg-layer hangar-bg"></div>

            {/* DYNAMIC HOVER BACKGROUND */}
            <div
                className={`bg-layer blueprint-bg ${hoveredMachine ? 'active' : ''}`}
                style={{
                    backgroundImage: `url(${hoveredMachine ? hoveredMachine.background : ''})`
                }}
            ></div>
            <div className="bg-overlay"></div>

            <div className="content-wrapper">
                {/* VERTICAL DECORATION LINES */}
                <div className="vertical-lines">
                    <div className="line line-1"></div>
                    <div className="line line-2"></div>
                    <div className="line line-3"></div>
                    <h2 className="fleet-title">YB_MOTORS</h2>
                </div>

                {/* ANIMATED HEADER */}
                <div className="header-section">
                    <h1 className="select-unit-text" data-text="SELECT_UNIT">SELECT_UNIT</h1>
                </div>

                {/* UNIT LIST */}
                <div className="unit-list">
                    {machinesData.map((machine, index) => (
                        <div
                            key={machine.id}
                            className="unit-item"
                            onMouseEnter={() => setHoveredMachine(machine)}
                            onMouseLeave={() => setHoveredMachine(null)}
                            onClick={() => onSelectMachine(machine.id)}
                        >
                            <span className="unit-index">{(index + 1).toString().padStart(2, '0')}</span>
                            <div className="unit-info">
                                <span className="unit-name">{machine.name}</span>
                                <span className="unit-model">{machine.model}</span>
                            </div>
                            <div className="unit-status">
                                <span className="status-dot"></span>
                                ONLINE
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                .machines-container {
                    position: fixed;
                    top: 0; left: 0; width: 100%; height: 100%;
                    overflow: hidden;
                    background: #000;
                    color: white;
                    font-family: var(--font-tech);
                }

                /* BACKGROUNDS */
                .bg-layer {
                    position: absolute;
                    top: 0; left: 0; width: 100%; height: 100%;
                    background-size: cover;
                    background-position: center;
                    transition: opacity 0.5s ease;
                }
                .hangar-bg {
                    background-image: url('/assets/hangar_bg.png');
                    opacity: 0.4;
                    z-index: 0;
                }
                .blueprint-bg {
                    opacity: 0;
                    z-index: 1;
                    filter: grayscale(100%) contrast(150%);
                    mix-blend-mode: hard-light;
                    transition: opacity 0.3s ease;
                }
                .blueprint-bg.active {
                    opacity: 0.35;
                }
                .bg-overlay {
                    position: absolute;
                    top: 0; left: 0; width: 100%; height: 100%;
                    background: radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.8) 100%);
                    pointer-events: none;
                    z-index: 2;
                }

                .content-wrapper {
                    position: relative;
                    z-index: 10;
                    width: 100%; height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    padding-left: 15%;
                }

                /* DECORATION */
                .vertical-lines {
                    position: absolute;
                    top: 100px; left: 48px; /* Aligned with burger (40px pad + ~8px half width) or just below */
                    bottom: 80px; /* Leave space for YBSC (bottom 40px) */
                    height: auto; /* Use top/bottom instead of height % */
                    display: flex;
                    flex-direction: column;
                    align-items: center; /* Center content horizontally relative to the line */
                    gap: 10px;
                }
                .line {
                    width: 4px;
                    background: var(--color-red);
                    box-shadow: 0 0 10px var(--color-red);
                }
                .line-1 { height: 100px; }
                .line-2 { height: 300px; flex-grow: 1; opacity: 0.5; }
                .line-3 { height: 50px; }
                .fleet-title {
                    writing-mode: vertical-rl;
                    transform: rotate(180deg);
                    font-family: var(--font-main);
                    letter-spacing: 5px;
                    color: transparent;
                    -webkit-text-stroke: 1px rgba(255,255,255,0.5);
                    margin-top: 20px;
                    font-size: 1.5rem;
                }

                /* HEADER */
                .select-unit-text {
                    font-family: var(--font-main);
                    font-size: clamp(2rem, 4vw, 5rem);
                    color: white;
                    /* -webkit-text-stroke: 2px white; Removed for cleaner look */
                    text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
                    margin: 0;
                    position: relative;
                    animation: glitchText 3s infinite;
                }
                .select-unit-text::before {
                    content: attr(data-text);
                    position: absolute; top: 0; left: 2px;
                    color: var(--color-red);
                    opacity: 0.5;
                    mix-blend-mode: overlay;
                    animation: glitch-anim 2s infinite linear alternate-reverse;
                }

                /* LIST */
                .unit-list {
                    margin-top: 50px;
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
                .unit-item {
                    display: flex;
                    align-items: center;
                    gap: 30px;
                    cursor: pointer;
                    padding: 20px;
                    border-left: 2px solid transparent;
                    background: linear-gradient(90deg, transparent, transparent);
                    transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
                    width: fit-content;
                }
                .unit-item:hover {
                    border-left: 5px solid var(--color-red);
                    background: linear-gradient(90deg, rgba(255, 0, 51, 0.1), transparent);
                    padding-left: 40px;
                }

                .unit-index {
                    font-family: monospace;
                    font-size: 1.5rem;
                    color: #555;
                }
                .unit-item:hover .unit-index { color: var(--color-red); }

                .unit-info {
                    display: flex;
                    flex-direction: column;
                }
                .unit-name {
                    font-family: var(--font-main);
                    font-size: 2.5rem;
                    line-height: 1;
                    color: #ccc;
                    transition: color 0.3s;
                }
                .unit-item:hover .unit-name { color: white; text-shadow: 0 0 10px white; }

                .unit-model {
                    font-family: monospace;
                    font-size: 0.8rem;
                    color: #666;
                    letter-spacing: 2px;
                }

                .unit-status {
                    margin-left: 50px;
                    font-family: monospace;
                    font-size: 0.8rem;
                    color: var(--color-red);
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    opacity: 0;
                    transform: translateX(-20px);
                    transition: all 0.3s;
                }
                .unit-item:hover .unit-status { opacity: 1; transform: translateX(0); }
                
                .status-dot {
                    width: 6px; height: 6px;
                    background: var(--color-red);
                    border-radius: 50%;
                    box-shadow: 0 0 10px var(--color-red);
                    animation: pulse 1s infinite;
                }

                @keyframes pulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.3; }
                    100% { opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default MachinesPage;
