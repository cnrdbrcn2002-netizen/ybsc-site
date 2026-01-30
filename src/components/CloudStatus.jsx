import React from 'react';
import { useOperative } from '../context/OperativeContext';

const CloudStatus = () => {
    const { syncStatus } = useOperative();

    const getStatusColor = () => {
        switch (syncStatus) {
            case 'SECURE_CLOUD_ACTIVE': return 'var(--color-red)';
            case 'SYNCING_PACKETS': return '#ffff00';
            case 'CONNECTION_SEVERED': return '#555';
            case 'WAITING_FOR_HANDSHAKE': return '#333';
            default: return 'var(--color-red)';
        }
    };

    return (
        <div className="cloud-status-container">
            <div className="status-indicator"></div>
            <div className="status-text">
                SYNC_STATUS: <span style={{ color: getStatusColor() }}>{syncStatus}</span>
            </div>

            <style>{`
                .cloud-status-container {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    z-index: 1000;
                    font-family: var(--font-tech);
                    font-size: 10px;
                    background: rgba(0,0,0,0.9);
                    padding: 8px 12px;
                    border: 1px solid #333;
                    pointer-events: none;
                    white-space: nowrap; /* Prevent text wrapping */
                }
                .status-indicator {
                    width: 6px;
                    height: 6px;
                    background: ${getStatusColor()};
                    border-radius: 50%;
                    box-shadow: 0 0 8px ${getStatusColor()};
                    animation: pulse 2s infinite;
                }
                .status-text {
                    color: #777;
                    letter-spacing: 1px;
                }
                @keyframes pulse {
                    0% { opacity: 0.5; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.2); }
                    100% { opacity: 0.5; transform: scale(1); }
                }
            `}</style>
        </div>
    );
};

export default CloudStatus;
