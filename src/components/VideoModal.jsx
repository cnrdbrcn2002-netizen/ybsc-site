import React, { useState } from 'react';

const VideoModal = ({ item, onClose }) => {
    if (!item) return null;

    const [comments, setComments] = useState([
        { user: 'JFR_FAN_01', text: 'Bu an inanılmazdı! 🔥' },
        { user: 'Bora', text: 'Ne komikti o an gerçekten hahaha' },
    ]);
    const [newComment, setNewComment] = useState('');

    const handleSend = (e) => {
        e.preventDefault();
        if (newComment.trim()) {
            setComments([...comments, { user: 'GUEST_USER', text: newComment }]);
            setNewComment('');
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(5, 5, 5, 0.95)',
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backdropFilter: 'blur(10px)'
        }} onClick={onClose}>
            <div style={{
                width: '90%',
                maxWidth: '1200px',
                height: '80vh',
                backgroundColor: '#000',
                border: '1px solid var(--color-gray)',
                display: 'flex',
                flexDirection: 'column', // Mobile first approach, can be row on desktop
                overflow: 'hidden',
                position: 'relative'
            }} onClick={e => e.stopPropagation()}>

                {/* Close Button */}
                <button onClick={onClose} style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    color: 'var(--color-white)',
                    fontSize: '24px',
                    zIndex: 10,
                    background: 'rgba(0,0,0,0.5)',
                    padding: '10px'
                }}>✕</button>

                <div style={{ display: 'flex', flex: 1, height: '100%', flexDirection: 'row' }} className="modal-content">
                    {/* Media Content */}
                    <div style={{ flex: 2, background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                        {/* Simulating Video Player */}
                        <div style={{
                            width: '100%',
                            height: '100%',
                            backgroundImage: `url(${item.src})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            opacity: 0.6
                        }}></div>
                        <div style={{
                            position: 'absolute',
                            color: 'white',
                            fontSize: '2rem',
                            border: '2px solid white',
                            borderRadius: '50%',
                            width: '80px',
                            height: '80px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>▶</div>
                    </div>

                    {/* Comments Section */}
                    <div style={{ flex: 1, borderLeft: '1px solid var(--color-gray)', padding: '20px', display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{ borderBottom: '1px solid var(--color-red)', paddingBottom: '10px', marginBottom: '20px' }}>
                            JFR MEMORIES // COMMENTS
                        </h3>

                        <div style={{ flex: 1, overflowY: 'auto', marginBottom: '20px', fontFamily: 'var(--font-tech)' }}>
                            {comments.map((c, i) => (
                                <div key={i} style={{ marginBottom: '15px' }}>
                                    <div style={{ color: 'var(--color-red)', fontSize: '0.8rem', fontWeight: 'bold' }}>{c.user} //</div>
                                    <div style={{ color: '#ccc', fontSize: '0.9rem' }}>{c.text}</div>
                                </div>
                            ))}
                        </div>

                        <form onSubmit={handleSend} style={{ display: 'flex', borderTop: '1px solid #333', paddingTop: '15px' }}>
                            <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="WRITE A COMMENT..."
                                style={{
                                    flex: 1,
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'white',
                                    fontFamily: 'var(--font-tech)',
                                    outline: 'none'
                                }}
                            />
                            <button type="submit" style={{ color: 'var(--color-red)', fontWeight: 'bold' }}>SEND</button>
                        </form>
                    </div>
                </div>
            </div>
            <style>{`
        @media (max-width: 768px) {
          .modal-content {
            flex-direction: column !important;
          }
        }
      `}</style>
        </div>
    );
};

export default VideoModal;
