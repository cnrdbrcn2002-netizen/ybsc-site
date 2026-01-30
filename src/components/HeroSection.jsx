import React from 'react';

const HeroSection = () => {
    return (
        <section style={{
            height: '100vh',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden',
            background: 'var(--color-bg)',
            perspective: '1000px'
        }}>
            {/* Blueprint Grid Background */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: `
          linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
          linear-gradient(rgba(255, 255, 255, 0.01) 0.5px, transparent 0.5px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.01) 0.5px, transparent 0.5px)
        `,
                backgroundSize: '100px 100px, 100px 100px, 20px 20px, 20px 20px',
                zIndex: 0
            }}></div>

            {/* Dramatic Lighting/Vignette */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'radial-gradient(circle at center, transparent 0%, rgba(5,5,5,0.8) 80%)',
                zIndex: 1,
                pointerEvents: 'none'
            }}></div>

            {/* Hero Content */}
            <div style={{ zIndex: 10, textAlign: 'center', position: 'relative' }}>

                <div className="hero-title-wrapper" style={{ position: 'relative', cursor: 'pointer', maxWidth: '100vw', padding: '0 20px' }}>
                    <h1 className="font-akira hero-text" style={{
                        fontSize: 'clamp(40px, 10vw, 150px)',
                        color: 'transparent',
                        WebkitTextStroke: '2px white',
                        lineHeight: 0.85,
                        margin: 0,
                        whiteSpace: 'nowrap',
                        transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)'
                    }}>
                        JUANFRUAN
                    </h1>
                </div>

                {/* Subtitle */}
                <div style={{
                    marginTop: '2rem',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '20px',
                    fontFamily: 'var(--font-tech)',
                    letterSpacing: '4px',
                    fontSize: 'clamp(10px, 1vw, 14px)',
                    color: 'var(--color-white)',
                    opacity: 0.8
                }}>
                    <span>JFR-UNIT</span>
                    <span style={{ color: 'var(--color-red)' }}>//</span>
                    <span>Y.B.S.C</span>
                </div>
            </div>

            {/* Technical Metadata Corners - Shifted down to avoid burger menu */}
            <div style={{
                position: 'absolute',
                top: '90px',
                left: '40px',
                fontFamily: 'var(--font-tech)',
                fontSize: '12px',
                color: '#666',
                letterSpacing: '1px',
                zIndex: 20
            }}>
                PROJECT-01 <br />
                <span style={{ color: 'var(--color-red)' }}>INITIALIZATION</span>
            </div>

            <div style={{
                position: 'absolute',
                bottom: '40px',
                right: '40px',
                fontFamily: 'var(--font-tech)',
                fontSize: '12px',
                color: '#666',
                letterSpacing: '1px',
                textAlign: 'right',
                zIndex: 20
            }}>
                EST. 2026 <br />
                <span style={{ color: 'var(--color-white)' }}>ISTANBUL // TR</span>
            </div>

            {/* CSS Styles for this component */}
            <style>{`
        .hero-title-wrapper:hover .hero-text {
          color: var(--color-red); /* Fill with Pininfarina Red */
          WebkitTextStroke: 0px transparent;
          text-shadow: 
            0 0 20px var(--color-red),
            0 0 40px var(--color-red),
            0 0 80px rgba(255, 0, 51, 0.5); /* Pulse Glow */
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0% { text-shadow: 0 0 20px var(--color-red), 0 0 40px var(--color-red); }
          50% { text-shadow: 0 0 30px var(--color-red), 0 0 60px var(--color-red), 0 0 100px var(--color-red); }
          100% { text-shadow: 0 0 20px var(--color-red), 0 0 40px var(--color-red); }
        }
      `}</style>
        </section>
    );
};

export default HeroSection;
