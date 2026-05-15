import { useState } from 'react';
import GlobeViewer from './components/GlobeViewer';
import Sidebar from './components/Sidebar';
import TimelineOverlay from './components/TimelineOverlay';
import { apparitionsData } from './data/apparitions';
import type { Apparition } from './data/apparitions';

function App() {
  const [selectedApparition, setSelectedApparition] = useState<Apparition | null>(null);

  const handleSelectApparition = (apparition: Apparition | null) => {
    setSelectedApparition(apparition);
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* Header Overlay */}
      <div className="glass-panel glass-panel-rounded animate-fade-in" style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        zIndex: 10,
        padding: '18px 28px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
      }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0, letterSpacing: '0.5px', color: 'var(--text-color)' }}>
          Stella Maris
        </h1>
        <p style={{ fontSize: '14px', opacity: 0.7, margin: 0, fontWeight: 300, letterSpacing: '0.2px' }}>
          Marian Apparitions Map
        </p>
      </div>

      <GlobeViewer 
        apparitions={apparitionsData} 
        onSelectApparition={handleSelectApparition} 
      />
      
      <Sidebar 
        apparition={selectedApparition} 
        onClose={() => setSelectedApparition(null)} 
      />

      <TimelineOverlay
        apparitions={apparitionsData}
        selectedApparition={selectedApparition}
        onSelectApparition={handleSelectApparition}
      />
    </div>
  );
}

export default App;
