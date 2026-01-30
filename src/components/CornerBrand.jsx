import React from 'react';

const CornerBrand = ({ onBeatClick, isBeatOpen, activeCategory }) => {
  return (
    <>
      {/* Top Left - Hamburger & BEAT Trigger */
        /* When activeCategory === 'BEAT', we show the BEAT text next to hamburger.
           Otherwise, just the hamburger. */
      }
      <div
        onClick={onBeatClick}
        className="nav-trigger"
        style={{
          position: 'fixed',
          top: '40px',
          left: '40px',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          cursor: 'pointer',
          mixBlendMode: 'difference'
        }}
      >
        {/* Hamburger Icon */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '24px',
          width: '30px'
        }}>
          <span className={`burger-line ${isBeatOpen ? 'open-1' : ''}`}></span>
          <span className={`burger-line ${isBeatOpen ? 'open-2' : ''}`}></span>
          <span className={`burger-line ${isBeatOpen ? 'open-3' : ''}`}></span>
        </div>

        {/* Category Indicator Text */}
        <span style={{
          fontFamily: 'var(--font-tech), sans-serif',
          fontWeight: '700',
          fontSize: '18px',
          letterSpacing: '0.3em',
          color: 'var(--color-white)',
          transition: 'all 0.3s ease',
          opacity: activeCategory ? 1 : 0,
          transform: activeCategory ? 'translateX(0)' : 'translateX(-20px)',
          pointerEvents: activeCategory ? 'auto' : 'none'
        }} className="beat-text">
          {activeCategory === 'BEAT' && 'BEAT'}
          {activeCategory === 'MEDIA' && 'MEDIA'}
          {activeCategory === 'MACHINES' && 'MACHINES'}
          {activeCategory === 'CONTACT' && 'CONTACT'}
          {activeCategory === 'SHOP' && 'SHOP'}
        </span>
      </div>

      {/* Bottom Left - YBSC */}
      <div style={{
        position: 'fixed',
        bottom: '40px',
        left: '40px',
        zIndex: 100,
        fontFamily: 'var(--font-tech)',
        fontWeight: 'bold',
        fontSize: '14px',
        letterSpacing: '2px',
        color: 'var(--color-white)',
        cursor: 'pointer',
        mixBlendMode: 'difference'
      }}>
        YBSC
      </div>

      <style>{`
        .burger-line {
          display: block;
          width: 100%;
          height: 4px; /* Thick lines */
          background-color: var(--color-white);
          transition: all 0.3s ease;
        }

        /* Hover Effects */
        .nav-trigger:hover .burger-line {
          background-color: var(--color-red);
          box-shadow: 0 0 10px var(--color-red);
        }
        
        /* Apply neon glow to text on hover */
        .nav-trigger:hover .beat-text {
          color: var(--color-red) !important;
          text-shadow: 0 0 15px var(--color-red);
        }

        .beat-text {
           /* Ensure generic style matches the request */
           text-transform: uppercase;
        }

        /* Open State Transformations */
        .burger-line.open-1 {
          transform: rotate(45deg) translate(8px, 8px);
          background-color: var(--color-red);
        }
        .burger-line.open-2 {
          opacity: 0;
        }
        .burger-line.open-3 {
          transform: rotate(-45deg) translate(7px, -7px);
          background-color: var(--color-red);
        }
      `}</style>
    </>
  );
};

export default CornerBrand;
