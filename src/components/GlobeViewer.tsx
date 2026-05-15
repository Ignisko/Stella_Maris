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

  useEffect(() => {
    let animationFrameId: number;
    const updateScale = () => {
      if (globeEl.current) {
        const pov = globeEl.current.pointOfView();
        if (pov && pov.altitude !== undefined) {
          // altitude is roughly 0.1 to 4.0+
          let targetScale = 1;
          let targetOpacity = 1;

          if (pov.altitude < 2.2) {
             // zoomed in - keep it readable, shrink slightly to 0.85 minimum
             targetScale = 0.85 + (pov.altitude / 2.2) * 0.15;
             targetOpacity = 1;
          } else {
             // zoomed out - shrink more to avoid chaos, and fade out
             targetScale = 1.0 - ((pov.altitude - 2.2) / 2.8) * 0.4;
             // fade out completely by altitude 3.5
             targetOpacity = 1.0 - ((pov.altitude - 2.2) / 1.3);
          }
          
          targetScale = Math.max(0.7, Math.min(targetScale, 1.0));
          targetOpacity = Math.max(0, Math.min(targetOpacity, 1));
          
          document.documentElement.style.setProperty('--globe-label-scale', targetScale.toString());
          document.documentElement.style.setProperty('--globe-label-opacity', targetOpacity.toString());
        }
      }
      animationFrameId = requestAnimationFrame(updateScale);
    };
    updateScale();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

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
        pointAltitude={0.015}
        pointRadius={0.4}
        pointsMerge={false}
        onPointClick={handlePointClick}
        onGlobeClick={handleGlobeClick}
        htmlElementsData={apparitions}
        htmlElement={(d: any) => {
          const el = document.createElement('div');
          el.innerHTML = `<div style="
            color: #fbbf24; 
            font-size: 13px; 
            font-weight: 600; 
            font-family: 'Outfit', sans-serif; 
            background: rgba(0,0,0,0.6); 
            padding: 4px 8px; 
            border-radius: 6px; 
            border: 1px solid rgba(251, 191, 36, 0.4); 
            backdrop-filter: blur(4px); 
            transform: translate(-50%, -20px) scale(var(--globe-label-scale, 1)); 
            opacity: var(--globe-label-opacity, 1);
            transform-origin: bottom center;
            pointer-events: none; 
            white-space: nowrap; 
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            transition: transform 0.1s ease-out, opacity 0.1s ease-out;
          ">${d.title}</div>`;
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
