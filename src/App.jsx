import React, { useState } from 'react';
import { authorizedPersonnel } from './data/authorizedPersonnel';
import CornerBrand from './components/CornerBrand';
import HeroSection from './components/HeroSection';
import GalleryGrid from './components/GalleryGrid';
import BeatSection from './components/BeatSection';
import BeatProduction from './components/BeatProduction';
import MediaTeaser from './components/MediaTeaser';
import MediaPage from './components/MediaPage';
import NetworkPage from './components/NetworkPage';
import ContactAgents from './components/ContactAgents';
import MachinesPage from './components/MachinesPage';
import ShopPage from './components/ShopPage';
import VehicleDetailPage from './components/VehicleDetailPage';
import WelcomeSplash from './components/WelcomeSplash';
import SystemAccessLogin from './components/SystemAccessLogin';
import CloudStatus from './components/CloudStatus';
import { useOperative } from './context/OperativeContext';
import { useSiteProtection } from './hooks/useSiteProtection';
import { useSessionTimeout } from './hooks/useSessionTimeout';

// --- ADMIN HELPERS ---
const AdminCredentialsPanel = ({ currentUser }) => {
  const [visible, setVisible] = React.useState(false);

  // Security Check: Only show for System Overlord (Case insensitive safety)
  if (!currentUser) return null;
  const isOverlord = currentUser.role === 'SYSTEM_OVERLORD' || currentUser.idName === 'ADMIN_01' || currentUser.idName === 'admin_01';

  if (!isOverlord) return null;

  if (!visible) {
    return (
      <div
        onClick={() => setVisible(true)}
        style={{
          position: 'fixed', bottom: '60px', left: '20px', zIndex: 999999,
          background: 'rgba(255, 0, 0, 0.2)', border: '1px solid rgba(255,0,0,0.8)',
          color: 'red', padding: '8px 12px', fontSize: '11px', cursor: 'pointer',
          fontFamily: 'var(--font-tech)', letterSpacing: '1px', backdropFilter: 'blur(5px)'
        }}
      >
        [SHOW_CREDS]
      </div >
    );
  }

  return (
    <div style={{
      position: 'fixed', bottom: '100px', left: '20px', zIndex: 10000,
      background: 'rgba(0, 0, 0, 0.95)', border: '1px solid red',
      color: '#0f0', padding: '15px', fontFamily: 'monospace', fontSize: '12px',
      boxShadow: '0 0 20px rgba(255, 0, 0, 0.3)', maxWidth: '250px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', borderBottom: '1px solid #333', paddingBottom: '5px' }}>
        <span style={{ color: 'red', fontWeight: 'bold' }}>// CRED_DUMP</span>
        <span onClick={() => setVisible(false)} style={{ cursor: 'pointer', color: 'white' }}>[X]</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {authorizedPersonnel.map((u, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px dashed #333', paddingBottom: '4px' }}>
            <span style={{ color: 'white', fontWeight: 'bold' }}>{u.idName}</span>
            <span style={{ color: '#0f0', userSelect: 'all' }}>PASS: {u.passcode}</span>
            <span style={{ color: '#666', fontSize: '9px' }}>{u.role}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

function App() {
  useSiteProtection(); // Activate Anti-Theft Protocols
  useSessionTimeout(); // Activate Auto-Logout (10 mins default)
  const { currentUser, syncStatus, logout } = useOperative();
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Gatekeeper

  const [isBeatOpen, setIsBeatOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeMachineId, setActiveMachineId] = useState(null);
  const [uploadedBeats, setUploadedBeats] = useState([]);

  // Auto-login if session exists
  React.useEffect(() => {
    if (currentUser) {
      setIsAuthenticated(true);
    }
  }, [currentUser]);

  // 1. SPLASH SCREEN (First)
  if (showSplash) {
    return <WelcomeSplash onComplete={() => setShowSplash(false)} />;
  }

  // 2. ACCESS GATE (Mandatory)
  if (!isAuthenticated) {
    return (
      <SystemAccessLogin
        onAccessGranted={(userData) => {
          console.log("Gate Opened:", userData);
          setIsAuthenticated(true);
          // Optional: Store in context if needed
        }}
      // No Cancel button here because it's the front door
      />
    );
  }

  // 3. MAIN SITE
  return (
    <div className="App">
      <CloudStatus />

      {/* ADMIN ONLY PANEL */}
      <AdminCredentialsPanel currentUser={currentUser} />

      <BeatSection
        isOpen={isBeatOpen}
        onClose={() => setIsBeatOpen(false)}
        onSelectCategory={(category) => setActiveCategory(category)}
      />

      <CornerBrand
        isBeatOpen={isBeatOpen}
        activeCategory={activeCategory}
        onBeatClick={() => setIsBeatOpen(!isBeatOpen)}
      />

      {/* Conditional Rendering based on Category */}
      {/* Conditional Rendering based on Category */}
      {activeCategory === 'BEAT' && (
        <BeatProduction beats={uploadedBeats} setBeats={setUploadedBeats} />
      )}

      {activeCategory === 'MEDIA' && (
        <MediaPage />
      )}

      {activeCategory === 'MACHINES' && (
        <MachinesPage
          onSelectMachine={(id) => {
            setActiveMachineId(id);
            setActiveCategory('MACHINE_DETAIL');
          }}
        />
      )}

      {activeCategory === 'MACHINE_DETAIL' && (
        <VehicleDetailPage
          machineId={activeMachineId}
          onBack={() => setActiveCategory('MACHINES')}
        />
      )}

      {activeCategory === 'CONTACT' && (
        <ContactAgents />
      )}

      {activeCategory === 'SHOP' && (
        <ShopPage />
      )}

      {/* HOME PAGE (Default) - Only show when no category is active */}
      {!activeCategory && (
        <>
          <HeroSection />

          <div style={{ height: '100px' }}></div> {/* Spacer */}

          {/* Bio Section */}
          <section className="container" style={{
            display: 'flex',
            gap: '50px',
            marginBottom: '100px',
            flexWrap: 'wrap'
          }}>
            <div style={{ flex: 1, minWidth: '300px' }}>
              <h2 style={{
                fontSize: '3rem',
                color: 'var(--color-bg)',
                WebkitTextStroke: '1px var(--color-red)',
                marginBottom: '20px'
              }}>THE<br />BIO</h2>
            </div>
            <div style={{ flex: 2, fontFamily: 'var(--font-tech)', fontSize: '1.2rem', lineHeight: '1.6', color: '#ccc' }}>
              <p style={{ marginBottom: '20px' }}>
                <span style={{ color: 'var(--color-red)', fontWeight: 'bold' }}>JFR-UNIT 001.</span> Kendime ait çemberin merkezinde, kaotik düzenin bir parçasıyım.
                Burası benim dijital sığınağım; <span className="mahlukat-style">saf mahlukatlığın</span>, anıların ve görsel kirliliğin estetikle, ritmin ise kaosla buluştuğu nokta.
              </p>
              <p>
                Y.B.S.C. (Yakakent Blood Social Club) çatısı altında, sıradanlığa meydan okuyan bir yaşam tarzını benimsiyoruz.
                Bu platform, sadece bir galeri değil; yaşayan, nefes alan ve kullanıcılarıyla etkileşime giren bir organizma.
              </p>
            </div>
          </section>

          <MediaTeaser onOpenArchive={() => setActiveCategory('VISUALS')} />

          {/* Footer */}
          <footer style={{
            marginTop: '100px',
            padding: '50px 0',
            borderTop: '1px solid #333',
            textAlign: 'center',
            fontFamily: 'var(--font-tech)',
            fontSize: '0.8rem',
            color: '#555'
          }}>
            COPYRIGHT © 2026 JUANFRUAN // ALL RIGHTS RESERVED
          </footer>
        </>
      )}
      {/* DEBUG: RESET SESSION BUTTON */}
      {/* RESET / LOGOUT BUTTON (Top Right) */}
      <div
        onClick={() => {
          if (window.confirm("OTURUMU SONLANDIRIP ÇIKMAK İSTEDİĞİNİZE EMİN MİSİNİZ?")) {
            setIsAuthenticated(false);
            if (logout) logout();
            setTimeout(() => window.location.reload(), 500);
          }
        }}
        style={{
          position: 'fixed', bottom: '20px', left: '20px',
          background: 'rgba(0,0,0,0.8)', color: 'red', padding: '8px 15px',
          cursor: 'pointer', fontSize: '11px', zIndex: 900,
          border: '1px solid red', fontFamily: 'var(--font-tech)',
          letterSpacing: '1px', backdropFilter: 'blur(5px)'
        }}>
        [ ÇIKIŞ // SIFIRLA ]
      </div>

    </div>
  );
}

export default App;
