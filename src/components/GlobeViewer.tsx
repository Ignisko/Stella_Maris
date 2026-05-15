import React, { useEffect, useRef, useState, useMemo } from 'react';
import Globe from 'react-globe.gl';
import type { Apparition } from '../data/apparitions';
import { Play, Pause } from 'lucide-react';

interface GlobeViewerProps {
  apparitions: Apparition[];
  selectedApparition: Apparition | null;
  onSelectApparition: (apparition: Apparition | null) => void;
}

const GlobeViewer: React.FC<GlobeViewerProps> = ({ apparitions, selectedApparition, onSelectApparition }) => {
  const globeEl = useRef<any>(null);
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [lodThreshold, setLodThreshold] = useState<number>(2);
  const lodRef = useRef<number>(2);

  useEffect(() => {
    if (selectedApparition && globeEl.current) {
      setIsAutoRotate(false);
      if (globeEl.current.controls()) {
        globeEl.current.controls().autoRotate = false;
      }
      globeEl.current.pointOfView({ lat: selectedApparition.lat, lng: selectedApparition.lng, altitude: 0.6 }, 1000);
    }
  }, [selectedApparition]);

  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.controls().autoRotateSpeed = 0.15;
      globeEl.current.pointOfView({ lat: 20, lng: 10, altitude: 2.2 });
    }
  }, []);

  useEffect(() => {
    if (globeEl.current && globeEl.current.controls()) {
      globeEl.current.controls().autoRotate = isAutoRotate;
    }
  }, [isAutoRotate]);

  useEffect(() => {
    let animationFrameId: number;
    const updateScale = () => {
      if (globeEl.current) {
        const pov = globeEl.current.pointOfView();
        if (pov && pov.altitude !== undefined) {
          // Update LOD Threshold based on altitude
          let newThreshold = 2;
          if (pov.altitude < 1.3) newThreshold = 5;      // closest zoom - show all
          else if (pov.altitude < 1.9) newThreshold = 4; // close zoom - show priority 1-4
          else if (pov.altitude < 2.6) newThreshold = 3; // medium zoom - show priority 1-3
          else newThreshold = 2;                         // high zoom - show priority 1-2

          if (newThreshold !== lodRef.current) {
            lodRef.current = newThreshold;
            setLodThreshold(newThreshold);
          }

          let targetScale = 1;
          let targetOpacity = 1;

          if (pov.altitude < 2.2) {
             targetScale = 0.85 + (pov.altitude / 2.2) * 0.15;
             targetOpacity = 1;
          } else {
             targetScale = 1.0 - ((pov.altitude - 2.2) / 2.8) * 0.4;
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

  // Filter visible points based on LOD zoom threshold
  const visibleApparitions = useMemo(() => {
    return apparitions.filter(app => (app.priority || 3) <= lodThreshold);
  }, [apparitions, lodThreshold]);

  // When an apparition is selected, hide all other text labels to prevent clutter
  const visibleHtmlLabels = useMemo(() => {
    if (selectedApparition) {
      return [selectedApparition];
    }
    return apparitions.filter(app => (app.priority || 3) <= lodThreshold);
  }, [apparitions, lodThreshold, selectedApparition]);

  const handlePointClick = (point: object) => {
    const app = point as Apparition;
    onSelectApparition(app);
    setIsAutoRotate(false); 
    if (globeEl.current && globeEl.current.controls()) {
      globeEl.current.controls().autoRotate = false;
      globeEl.current.pointOfView({ lat: app.lat, lng: app.lng, altitude: 0.6 }, 1000);
    }
  };

  const handleGlobeClick = () => {
    onSelectApparition(null);
  };

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 1, width: '100vw', height: '100vh' }}>
      <Globe
        ref={globeEl}
        width={dimensions.width}
        height={dimensions.height}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        pointsData={visibleApparitions}
        pointLat="lat"
        pointLng="lng"
        pointColor={() => '#fbbf24'}
        pointAltitude={0.015}
        pointRadius={0.4}
        pointsMerge={false}
        onPointClick={handlePointClick}
        onGlobeClick={handleGlobeClick}
        htmlElementsData={visibleHtmlLabels}
        htmlElement={(d: any) => {
          const isSelected = selectedApparition?.id === d.id;
          const el = document.createElement('div');
          el.innerHTML = `<div style="
            color: ${isSelected ? '#ffffff' : '#fbbf24'}; 
            font-size: ${isSelected ? '15px' : '13px'}; 
            font-weight: ${isSelected ? '700' : '600'}; 
            font-family: 'Outfit', sans-serif; 
            background: ${isSelected ? 'rgba(251, 191, 36, 0.25)' : 'rgba(0,0,0,0.6)'}; 
            padding: ${isSelected ? '6px 12px' : '4px 8px'}; 
            border-radius: 8px; 
            border: ${isSelected ? '2px solid #fbbf24' : '1px solid rgba(251, 191, 36, 0.4)'}; 
            backdrop-filter: blur(8px); 
            transform: translate(-50%, -20px) scale(${isSelected ? '1.15' : 'var(--globe-label-scale, 1)'}); 
            opacity: ${isSelected ? '1' : 'var(--globe-label-opacity, 1)'};
            transform-origin: bottom center;
            pointer-events: none; 
            white-space: nowrap; 
            box-shadow: ${isSelected ? '0 0 20px rgba(251, 191, 36, 0.6)' : '0 4px 12px rgba(0,0,0,0.5)'};
            transition: all 0.2s ease-out;
          ">${d.title}</div>`;
          return el;
        }}
      />

      {/* Play/Pause Control Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsAutoRotate(prev => !prev);
        }}
        style={{
          position: 'absolute',
          bottom: '40px',
          left: '25px',
          zIndex: 50,
          pointerEvents: 'auto',
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
