import React, { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';
import type { Apparition } from '../data/apparitions';
import { Play, Pause } from 'lucide-react';

interface GlobeViewerProps {
  apparitions: Apparition[];
  onSelectApparition: (apparition: Apparition | null) => void;
}

const GlobeViewer: React.FC<GlobeViewerProps> = ({ apparitions, onSelectApparition }) => {
  const globeEl = useRef<any>(null);
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [isAutoRotate, setIsAutoRotate] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (globeEl.current) {
      // Made rotation significantly slower
      globeEl.current.controls().autoRotateSpeed = 0.15;
      globeEl.current.pointOfView({ lat: 20, lng: 10, altitude: 2.2 });
    }
  }, []);

  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = isAutoRotate;
    }
  }, [isAutoRotate]);

  const handlePointClick = (point: object) => {
    const app = point as Apparition;
    onSelectApparition(app);
    // Pause rotation when a user clicks a specific point
    setIsAutoRotate(false); 
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = false;
      globeEl.current.pointOfView({ lat: app.lat, lng: app.lng, altitude: 0.6 }, 1000);
    }
  };

  const handleGlobeClick = () => {
    onSelectApparition(null);
  };

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}>
      <Globe
        ref={globeEl}
        width={dimensions.width}
        height={dimensions.height}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        pointsData={apparitions}
        pointLat="lat"
        pointLng="lng"
        pointColor={() => '#fbbf24'}
        pointAltitude={0.05}
        pointRadius={1}
        pointsMerge={false}
        onPointClick={handlePointClick}
        onGlobeClick={handleGlobeClick}
        htmlElementsData={apparitions}
        htmlElement={(d: any) => {
          const el = document.createElement('div');
          el.innerHTML = `<div style="color: #fbbf24; font-size: 13px; font-weight: 600; font-family: 'Outfit', sans-serif; background: rgba(0,0,0,0.6); padding: 4px 8px; border-radius: 6px; border: 1px solid rgba(251, 191, 36, 0.4); backdrop-filter: blur(4px); transform: translate(-50%, -20px); pointer-events: none; white-space: nowrap; box-shadow: 0 4px 12px rgba(0,0,0,0.5);">${d.title}</div>`;
          return el;
        }}
      />

      {/* Play/Pause Control Button */}
      <button
        onClick={() => setIsAutoRotate(!isAutoRotate)}
        style={{
          position: 'absolute',
          bottom: '120px', // Positioned above the timeline
          right: '30px',
          zIndex: 10,
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          width: '48px',
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-color)',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          transition: 'all 0.2s ease'
        }}
        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(15, 23, 42, 0.8)'}
        onMouseOut={(e) => e.currentTarget.style.background = 'rgba(15, 23, 42, 0.6)'}
        title={isAutoRotate ? "Pause Rotation" : "Play Rotation"}
      >
        {isAutoRotate ? <Pause size={20} /> : <Play size={20} style={{ marginLeft: '2px' }} />}
      </button>
    </div>
  );
};

export default GlobeViewer;
