import React, { useEffect, useState } from 'react';

const BeatSection = ({ isOpen, onClose, onSelectCategory }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 500); // Wait for exit animation
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(5, 5, 5, 0.95)',
      zIndex: 900, // Below the nav button (which should be 1000)
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      opacity: isOpen ? 1 : 0,
      transition: 'opacity 0.5s cubic-bezier(0.19, 1, 0.22, 1)',
      backdropFilter: 'blur(10px)'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
        {/* HOME Option */}
        <div
          className="menu-item glitch-beat"
          data-text="HOME"
          onClick={() => {
            if (onSelectCategory) onSelectCategory(null); // Return to home
            onClose();
          }}
          style={{ animationDelay: '0s' }}
        >
          HOME
        </div>

        <div
          className="menu-item glitch-beat"
          data-text="BEATLER"
          onClick={() => {
            if (onSelectCategory) onSelectCategory('BEAT');
            onClose();
          }}
          style={{ animationDelay: '0.1s' }}
        >
          BEATLER
        </div>

        <div
          className="menu-item glitch-beat"
          data-text="MEDIA"
          onClick={() => {
            if (onSelectCategory) onSelectCategory('MEDIA');
            onClose();
          }}
          style={{ animationDelay: '0.2s' }}
        >
          MEDIA
        </div>



        <div
          className="menu-item glitch-beat"
          data-text="MACHINES"
          onClick={() => {
            if (onSelectCategory) onSelectCategory('MACHINES');
            onClose();
          }}
          style={{ animationDelay: '0.3s' }}
        >
          MACHINES
        </div>

        {/* Dummy Categories */}
        <div
          className="menu-item glitch-beat"
          data-text="CONTACT"
          onClick={() => {
            if (onSelectCategory) onSelectCategory('CONTACT');
            onClose();
          }}
          style={{ animationDelay: '0.4s' }}
        >
          CONTACT
        </div>

        <div
          className="menu-item glitch-beat"
          data-text="SHOP"
          onClick={() => {
            if (onSelectCategory) onSelectCategory('SHOP');
            onClose();
          }}
          style={{ animationDelay: '0.5s' }}
        >
          SHOP
        </div>
      </div>

      <style>{`
        .menu-item {
          font-family: var(--font-main);
          font-size: clamp(30px, 6vw, 80px);
          font-weight: 800;
          font-style: italic; /* Akira vibe */
          transform: scaleX(1.2); /* Extended look */
          color: transparent;
          -webkit-text-stroke: 2px var(--color-white); /* Thicker stroke for impact */
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
          text-transform: uppercase;
          letter-spacing: -3px;
          margin: 10px 0; /* Add spacing due to scaleX */
        }

        .menu-item:hover {
          color: var(--color-white);
          -webkit-text-stroke: 0;
          text-shadow: 0 0 20px var(--color-white);
        }

        .menu-item.disabled {
          opacity: 0.3;
          pointer-events: none;
          font-size: clamp(20px, 5vw, 60px);
        }

        .glitch-beat {
          color: var(--color-white); /* Active item initial state */
          -webkit-text-stroke: 0;
          position: relative;
          margin: 0;
          animation: slideIn 0.8s cubic-bezier(0.19, 1, 0.22, 1) forwards;
        }

        /* Glitch Effect Layers */
        .glitch-beat::before,
        .glitch-beat::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: var(--color-bg);
        }

        .glitch-beat::before {
          left: 2px;
          text-shadow: -1px 0 #ff00c1;
          clip: rect(44px, 450px, 56px, 0);
          animation: glitch-anim 5s infinite linear alternate-reverse;
        }

        .glitch-beat::after {
          left: -2px;
          text-shadow: -1px 0 #00fff9;
          clip: rect(44px, 450px, 56px, 0);
          animation: glitch-anim-2 5s infinite linear alternate-reverse;
        }

        @keyframes slideIn {
          0% { transform: translateX(-100px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }

        @keyframes glitch-anim {
          0% { clip: rect(32px, 9999px, 12px, 0); transform: skew(0.6deg); }
          5% { clip: rect(10px, 9999px, 88px, 0); transform: skew(0.2deg); }
          10% { clip: rect(66px, 9999px, 3px, 0); transform: skew(-0.3deg); }
          15% { clip: rect(90px, 9999px, 95px, 0); transform: skew(0.7deg); }
          20% { clip: rect(10px, 9999px, 80px, 0); transform: skew(0.1deg); }
          25% { clip: rect(40px, 9999px, 20px, 0); transform: skew(0.1deg); }
          30% { clip: rect(3px, 9999px, 60px, 0); transform: skew(0.3deg); }
          35% { clip: rect(60px, 9999px, 10px, 0); transform: skew(0.8deg); }
          40% { clip: rect(20px, 9999px, 50px, 0); transform: skew(0.2deg); }
          45% { clip: rect(98px, 9999px, 12px, 0); transform: skew(0.1deg); }
          50% { clip: rect(15px, 9999px, 64px, 0); transform: skew(0.5deg); }
          55% { clip: rect(85px, 9999px, 3px, 0); transform: skew(0.1deg); }
          60% { clip: rect(12px, 9999px, 55px, 0); transform: skew(0.2deg); }
          65% { clip: rect(50px, 9999px, 85px, 0); transform: skew(0.1deg); }
          70% { clip: rect(35px, 9999px, 15px, 0); transform: skew(0.9deg); }
          75% { clip: rect(70px, 9999px, 40px, 0); transform: skew(0.2deg); }
          80% { clip: rect(10px, 9999px, 90px, 0); transform: skew(0.1deg); }
          85% { clip: rect(45px, 9999px, 25px, 0); transform: skew(0.4deg); }
          90% { clip: rect(25px, 9999px, 75px, 0); transform: skew(0.3deg); }
          95% { clip: rect(65px, 9999px, 5px, 0); transform: skew(0.1deg); }
          100% { clip: rect(5px, 9999px, 30px, 0); transform: skew(0.8deg); }
        }

        @keyframes glitch-anim-2 {
          0% { clip: rect(12px, 9999px, 32px, 0); transform: skew(0.3deg); }
          5% { clip: rect(88px, 9999px, 10px, 0); transform: skew(0.9deg); }
          10% { clip: rect(3px, 9999px, 66px, 0); transform: skew(0.4deg); }
          15% { clip: rect(95px, 9999px, 90px, 0); transform: skew(0.1deg); }
          20% { clip: rect(80px, 9999px, 10px, 0); transform: skew(0.3deg); }
          25% { clip: rect(20px, 9999px, 40px, 0); transform: skew(0.5deg); }
          30% { clip: rect(60px, 9999px, 3px, 0); transform: skew(0.1deg); }
          35% { clip: rect(10px, 9999px, 60px, 0); transform: skew(0.2deg); }
          40% { clip: rect(50px, 9999px, 20px, 0); transform: skew(0.6deg); }
          45% { clip: rect(12px, 9999px, 98px, 0); transform: skew(0.1deg); }
          50% { clip: rect(64px, 9999px, 15px, 0); transform: skew(0.3deg); }
          55% { clip: rect(3px, 9999px, 85px, 0); transform: skew(0.1deg); }
          60% { clip: rect(55px, 9999px, 12px, 0); transform: skew(0.8deg); }
          65% { clip: rect(85px, 9999px, 50px, 0); transform: skew(0.2deg); }
          70% { clip: rect(15px, 9999px, 35px, 0); transform: skew(0.4deg); }
          75% { clip: rect(40px, 9999px, 70px, 0); transform: skew(0.5deg); }
          80% { clip: rect(90px, 9999px, 10px, 0); transform: skew(0.2deg); }
          85% { clip: rect(25px, 9999px, 45px, 0); transform: skew(0.1deg); }
          90% { clip: rect(75px, 9999px, 25px, 0); transform: skew(0.6deg); }
          95% { clip: rect(5px, 9999px, 65px, 0); transform: skew(0.1deg); }
          100% { clip: rect(30px, 9999px, 5px, 0); transform: skew(0.9deg); }
        }
      `}</style>
    </div>
  );
};

export default BeatSection;
