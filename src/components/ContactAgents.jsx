import React, { useState } from 'react';
import { agentsData } from '../data/agents';

const ContactAgents = () => {
    // We track mouse position for each card to create the 3D tilt effect
    const [tilt, setTilt] = useState({});

    const handleMouseMove = (e, id) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Calculate rotation based on cursor position relative to center
        // Center is (0,0), Top-Left is (-X, +Y) rotation wise
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10; // Invert Y for correct feel
        const rotateY = ((x - centerX) / centerX) * 10;

        setTilt(prev => ({
            ...prev,
            [id]: { rotateX, rotateY }
        }));
    };

    const handleMouseLeave = (id) => {
        setTilt(prev => ({
            ...prev,
            [id]: { rotateX: 0, rotateY: 0 } // Reset to flat
        }));
    };

    return (
        <div id="contact-section" style={{
            position: 'relative',
            width: '100vw',
            minHeight: '100vh',
            background: '#050505',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '100px 20px',
            overflow: 'hidden'
        }}>
            {/* Background Grid */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, width: '100%', height: '100%',
                backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
                pointerEvents: 'none'
            }}></div>

            {/* Header */}
            <h2 style={{
                fontFamily: 'var(--font-main)',
                fontSize: 'clamp(2rem, 5vw, 4rem)',
                color: 'white',
                marginBottom: '60px',
                letterSpacing: '10px',
                textAlign: 'center',
                zIndex: 2
            }}>
                AGENCY_CONTACT
            </h2>

            {/* Cards Container */}
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '50px',
                justifyContent: 'center',
                zIndex: 10,
                perspective: '1000px' // Essential for 3D effect
            }}>
                {agentsData.map((agent) => (
                    <div
                        key={agent.id}
                        onMouseMove={(e) => handleMouseMove(e, agent.id)}
                        onMouseLeave={() => handleMouseLeave(agent.id)}
                        style={{
                            width: '320px',
                            height: '450px',
                            background: 'rgba(20, 20, 20, 0.6)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid #333',
                            borderRadius: '20px',
                            padding: '30px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            cursor: 'pointer',
                            transition: 'transform 0.1s ease-out, box-shadow 0.3s ease',
                            transform: `perspective(1000px) rotateX(${tilt[agent.id]?.rotateX || 0}deg) rotateY(${tilt[agent.id]?.rotateY || 0}deg) translateY(${tilt[agent.id]?.rotateX ? '-20px' : '0'})`,
                            boxShadow: tilt[agent.id]?.rotateX
                                ? `0 20px 40px rgba(0,0,0,0.5), 0 0 30px ${agent.color}40`
                                : '0 10px 20px rgba(0,0,0,0.3)',
                        }}
                    >
                        {/* Agent Photo */}
                        <div style={{
                            width: '120px',
                            height: '120px',
                            borderRadius: '50%',
                            border: `2px solid ${agent.color}`,
                            overflow: 'hidden',
                            marginBottom: '30px',
                            boxShadow: `0 0 20px ${agent.color}40`
                        }}>
                            <img
                                src={agent.image}
                                alt={agent.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>

                        {/* Agent Info */}
                        <h3 style={{
                            fontFamily: 'var(--font-main)',
                            fontSize: '1.8rem',
                            color: 'white',
                            margin: '0 0 5px 0',
                            letterSpacing: '2px'
                        }}>
                            {agent.name}
                        </h3>
                        <p style={{
                            fontFamily: 'var(--font-tech)',
                            fontSize: '0.8rem',
                            color: agent.color,
                            marginTop: '0',
                            marginBottom: '40px',
                            letterSpacing: '2px'
                        }}>
                            {agent.title}
                        </p>

                        {/* Social Links */}
                        <div style={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '15px'
                        }}>
                            {agent.socials.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'block',
                                        background: 'rgba(255,255,255,0.05)',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        textAlign: 'center',
                                        textDecoration: 'none',
                                        color: '#ccc',
                                        fontFamily: 'var(--font-tech)',
                                        fontSize: '0.9rem',
                                        transition: 'all 0.3s'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = agent.color;
                                        e.currentTarget.style.color = 'black';
                                        e.currentTarget.style.fontWeight = 'bold';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                        e.currentTarget.style.color = '#ccc';
                                        e.currentTarget.style.fontWeight = 'normal';
                                    }}
                                >
                                    {social.platform}
                                </a>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ContactAgents;
