import React, { useEffect, useRef, useState, useMemo } from 'react';
import Globe from 'react-globe.gl';
import type { Apparition } from '../data/apparitions';
import { Play, Pause } from 'lucide-react';
import { getStatusColor, hexToRgb } from '../utils/colors';

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
  const lastClickTimeRef = useRef<number>(0);

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
          let newThreshold = 1;
          if (pov.altitude < 0.8) newThreshold = 5;
          else if (pov.altitude < 1.4) newThreshold = 3;
          else if (pov.altitude < 2.2) newThreshold = 2;
          else newThreshold = 1;

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

  const visibleApparitions = useMemo(() => {
    return apparitions.filter(app => (app.priority || 3) <= lodThreshold);
  }, [apparitions, lodThreshold]);

  const visibleHtmlLabels = useMemo(() => {
    const famousKeywords = ['guadalupe', 'fatima', 'lourdes', 'medjugorje', 'miraculous medal', 'kibeho', 'banneux', 'knock', 'aparecida', 'akita', 'czestochowa', 'pilar', 'loreto', 'carmel'];
    
    return apparitions.filter(app => {
      if (selectedApparition?.id === app.id) return true;
      const isFamous = (app.priority === 1) || famousKeywords.some(kw => app.title.toLowerCase().includes(kw) || app.id.includes(kw));
      
      if (lodThreshold === 1) {
        return isFamous;
      }
      return (app.priority || 3) <= lodThreshold;
    });
  }, [apparitions, lodThreshold, selectedApparition]);

  const handlePointClick = (point: object) => {
    lastClickTimeRef.current = Date.now();
    const app = point as Apparition;
    onSelectApparition(app);
    setIsAutoRotate(false); 
    if (globeEl.current && globeEl.current.controls()) {
      globeEl.current.controls().autoRotate = false;
      globeEl.current.pointOfView({ lat: app.lat, lng: app.lng, altitude: 0.6 }, 1000);
    }
  };

  const handleGlobeClick = () => {
    if (Date.now() - lastClickTimeRef.current < 400) {
      return;
    }
    onSelectApparition(null);
  };

  const escapeHtml = (str: string): string => {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 1, width: '100vw', height: '100vh' }}>
      <Globe
        ref={globeEl}
        width={dimensions.width}
        height={dimensions.height}
        globeImageUrl="https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="https://unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="https://unpkg.com/three-globe/example/img/night-sky.png"
        pointsData={visibleApparitions}
        pointLat="lat"
        pointLng="lng"
        pointColor={(d: any) => getStatusColor(d.approvalStatus)}
        pointAltitude={0.015}
        pointRadius={0.4}
        pointsMerge={false}
        onPointClick={handlePointClick}
        onGlobeClick={handleGlobeClick}
        htmlElementsData={visibleHtmlLabels}
        htmlElement={(d: any) => {
          const isSelected = selectedApparition?.id === d.id;
          const safeTitle = escapeHtml(d.title || '');
          const statusColor = getStatusColor(d.approvalStatus);
          const rgb = hexToRgb(statusColor);
          const el = document.createElement('div');
          el.innerHTML = `<div style="
            color: #ffffff; 
            font-size: ${isSelected ? '15px' : '13px'}; 
            font-weight: ${isSelected ? '700' : '600'}; 
            font-family: 'Outfit', sans-serif; 
            background: ${isSelected ? `rgba(${rgb}, 0.4)` : 'transparent'}; 
            padding: ${isSelected ? '6px 12px' : '2px 6px'}; 
            border-radius: 8px; 
            border: ${isSelected ? `2px solid ${statusColor}` : 'none'}; 
            backdrop-filter: ${isSelected ? 'blur(8px)' : 'none'}; 
            transform: translate(-50%, -20px) scale(${isSelected ? '1.15' : 'var(--globe-label-scale, 1)'}); 
            opacity: ${isSelected ? '1' : 'var(--globe-label-opacity, 1)'};
            transform-origin: bottom center;
            pointer-events: auto; 
            cursor: pointer;
            white-space: nowrap; 
            text-shadow: ${isSelected ? 'none' : '0 2px 8px rgba(0,0,0,0.95), 0 0 4px rgba(0,0,0,0.8)'};
            box-shadow: ${isSelected ? `0 0 20px rgba(${rgb}, 0.8)` : 'none'};
            transition: all 0.2s ease-out;
          ">${safeTitle}</div>`;

          el.style.pointerEvents = 'auto';
          el.style.cursor = 'pointer';
          el.onpointerdown = (e) => {
            e.stopPropagation();
            lastClickTimeRef.current = Date.now();
            handlePointClick(d);
          };
          el.onpointerup = (e) => {
            e.stopPropagation();
          };
          el.onclick = (e) => {
            e.stopPropagation();
            lastClickTimeRef.current = Date.now();
            handlePointClick(d);
          };
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
