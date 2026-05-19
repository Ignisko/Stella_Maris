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
    if (globeEl.current && globeEl.current.controls()) {
      const controls = globeEl.current.controls();
      controls.autoRotateSpeed = 0.15;
      controls.minDistance = 155; // Globe radius ~100. 155 keeps camera safely outside globe surface
      controls.maxDistance = 400;
      controls.zoomSpeed = 0.6;
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
    let controlsConfigured = false;
    const updateScale = () => {
      if (globeEl.current) {
        if (!controlsConfigured && globeEl.current.controls()) {
          const controls = globeEl.current.controls();
          controls.minDistance = 155;
          controls.maxDistance = 400;
          controls.zoomSpeed = 0.6;
          controlsConfigured = true;
        }

        const pov = globeEl.current.pointOfView();
        if (pov && pov.altitude !== undefined) {
          // LOD: FEWER labels when close (zoomed in), MORE when far out
          // But "more" is still capped by MAX_LABELS in visibleHtmlLabels.
          // alt < 1.0  → threshold 1  → max 1 label  (just selected)
          // alt < 2.0  → threshold 2  → max 20 labels (explicitly priority-1&2)
          // alt >= 2.0 → threshold 3  → max 12 labels (world-famous only, priority-1)
          const altitude = Math.max(0.1, pov.altitude);
          let newThreshold: number;
          if (altitude < 1.0) newThreshold = 1;
          else if (altitude < 2.0) newThreshold = 2;
          else newThreshold = 3;

          if (newThreshold !== lodRef.current) {
            lodRef.current = newThreshold;
            setLodThreshold(newThreshold);
          }

          // Label opacity: fully visible when zoomed in, fades when very far out
          let targetOpacity = 1;
          if (altitude > 2.5) {
            targetOpacity = Math.max(0, 1.0 - ((altitude - 2.5) / 1.0));
          }
          targetOpacity = Math.max(0, Math.min(targetOpacity, 1));

          document.documentElement.style.setProperty('--globe-label-opacity', targetOpacity.toString());
          document.documentElement.style.setProperty('--globe-label-scale', '1');
        }
      }
      animationFrameId = requestAnimationFrame(updateScale);
    };
    updateScale();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const visibleApparitions = useMemo(() => {
    // Show all pins always (dots are lightweight), only labels are LOD-gated
    const clusters: Apparition[] = [];
    const threshold = 0.45;
    for (const app of apparitions) {
      const existing = clusters.find(c => Math.abs(c.lat - app.lat) < threshold && Math.abs(c.lng - app.lng) < threshold);
      if (!existing) {
        clusters.push({ ...app });
      } else if ((app.priority || 3) < (existing.priority || 3) || selectedApparition?.id === app.id) {
        Object.assign(existing, app);
      }
    }
    return clusters;
  }, [apparitions, selectedApparition]);

  const visibleHtmlLabels = useMemo(() => {
    // ──────────────────────────────────────────────────────────────────────────
    // LABEL LOD RULES  (lodThreshold set by altitude in the RAF loop)
    //   threshold 1 (zoomed in, alt < 1.2) → only the selected item
    //   threshold 2 (mid,        alt < 2.0) → top 20 by explicit priority
    //   threshold 3 (zoomed out, alt ≥ 2.0) → top 12 world-famous only
    //
    // "Explicit priority" means the field is actually set in the data file.
    // Entries without a priority field are treated as priority 99 (unlabelled)
    // unless they are the currently selected apparition.
    // ──────────────────────────────────────────────────────────────────────────
    const MAX_LABELS: Record<number, number> = { 1: 1, 2: 20, 3: 12 };
    const maxLabels = MAX_LABELS[lodThreshold] ?? 12;

    // Build candidate list — only use EXPLICIT priorities (not the default fallback)
    const candidates = apparitions
      .filter(app => {
        if (selectedApparition?.id === app.id) return true; // always keep selected
        if (app.priority === undefined || app.priority === null) return false; // skip unlabelled
        return app.priority <= Math.min(lodThreshold + 1, 3); // use explicit rank only
      })
      .sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99));

    // Cluster nearby candidates so Europe doesn't get wall-to-wall text
    const CLUSTER_DEG = 0.8; // ~90 km — larger cluster radius reduces overlap
    const clusters: (Apparition & { clusterCount?: number })[] = [];
    for (const app of candidates) {
      if (selectedApparition?.id !== app.id && clusters.length >= maxLabels) break;
      const existing = clusters.find(
        c => Math.abs(c.lat - app.lat) < CLUSTER_DEG && Math.abs(c.lng - app.lng) < CLUSTER_DEG
      );
      if (!existing) {
        clusters.push({ ...app, clusterCount: 1 });
      } else {
        existing.clusterCount = (existing.clusterCount || 1) + 1;
        // Prefer the selected apparition or the higher-priority one
        if (selectedApparition?.id === app.id || (app.priority ?? 99) < (existing.priority ?? 99)) {
          existing.id = app.id;
          existing.title = app.title;
          existing.approvalStatus = app.approvalStatus;
          existing.priority = app.priority;
          existing.lat = app.lat;
          existing.lng = app.lng;
        }
      }
    }

    // Always include selected apparition even if it has no explicit priority
    if (selectedApparition && !clusters.find(c => c.id === selectedApparition.id)) {
      clusters.push({ ...selectedApparition, clusterCount: 1 });
    }

    return clusters;
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
    <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 1, width: '100%', height: '100%' }}>
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
        ringsData={selectedApparition ? [selectedApparition] : []}
        ringLat="lat"
        ringLng="lng"
        ringColor={(d: any) => getStatusColor(d.approvalStatus)}
        ringMaxRadius={6}
        ringPropagationSpeed={4}
        ringRepeatPeriod={700}
        onPointClick={handlePointClick}
        onGlobeClick={handleGlobeClick}
        htmlElementsData={visibleHtmlLabels}
        htmlElement={(d: any) => {
          const isSelected = selectedApparition?.id === d.id;
          const safeTitle = escapeHtml(d.title || '');
          const count = d.clusterCount || 1;
          const badge = count > 1 ? `<span style="background: rgba(255,255,255,0.25); padding: 2px 6px; border-radius: 10px; font-size: 11px; margin-left: 6px; font-weight: 700;">+${count - 1}</span>` : '';
          const statusColor = getStatusColor(d.approvalStatus);
          const rgb = hexToRgb(statusColor);
          const el = document.createElement('div');
          el.className = 'globe-html-label';
          el.dataset.id = d.id;
          el.dataset.priority = isSelected ? '0' : (d.priority || 3).toString();
          el.dataset.selected = isSelected ? 'true' : 'false';
          el.style.pointerEvents = 'none';

          el.innerHTML = `<div class="label-content" style="
            color: #ffffff; 
            font-size: ${isSelected ? '15px' : '13px'}; 
            font-weight: ${isSelected ? '700' : '600'}; 
            font-family: inherit; 
            background: ${isSelected ? `rgba(${rgb}, 0.4)` : 'transparent'}; 
            padding: ${isSelected ? '6px 12px' : '2px 6px'}; 
            border-radius: 8px; 
            border: ${isSelected ? `2px solid ${statusColor}` : 'none'}; 
            backdrop-filter: ${isSelected ? 'blur(8px)' : 'none'}; 
            transform: translate(-50%, -20px) scale(${isSelected ? '1.15' : 'var(--globe-label-scale, 1)'}); 
            opacity: ${isSelected ? '1' : 'var(--globe-label-opacity, 1)'};
            transform-origin: bottom center;
            pointer-events: auto; 
            white-space: nowrap; 
            text-shadow: ${isSelected ? 'none' : '0 2px 8px rgba(0,0,0,0.95), 0 0 4px rgba(0,0,0,0.8)'};
            box-shadow: ${isSelected ? `0 0 20px rgba(${rgb}, 0.8)` : 'none'};
            transition: opacity 0.3s ease-out, transform 0.2s ease-out;
          ">${safeTitle}${badge}</div>`;

          const content = el.querySelector('.label-content') as HTMLElement;
          if (content) {
            content.onpointerdown = (e) => {
              e.stopPropagation();
              lastClickTimeRef.current = Date.now();
              handlePointClick(d);
            };
            content.onclick = (e) => {
              e.stopPropagation();
              lastClickTimeRef.current = Date.now();
              handlePointClick(d);
            };
          }
          return el;
        }}
      />

      {/* Play/Pause Control Button - fixed so zoom/pan never moves it off-screen */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsAutoRotate(prev => !prev);
        }}
        style={{
          position: 'fixed',
          bottom: '100px',
          left: '25px',
          zIndex: 200,
          pointerEvents: 'auto',
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '50%',
          width: '44px',
          height: '44px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-color)',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
          transition: 'all 0.2s ease'
        }}
        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(15, 23, 42, 0.95)'}
        onMouseOut={(e) => e.currentTarget.style.background = 'rgba(15, 23, 42, 0.75)'}
        title={isAutoRotate ? "Pause rotation" : "Resume rotation"}
      >
        {isAutoRotate ? <Pause size={18} /> : <Play size={18} style={{ marginLeft: '2px' }} />}
      </button>
    </div>
  );
};

export default GlobeViewer;
