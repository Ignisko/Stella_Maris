import React, { useEffect, useRef, useState, useMemo } from 'react';
import Globe from 'react-globe.gl';
import type { Apparition } from '../data/apparitions';
import { Play, Pause } from 'lucide-react';
import { getStatusColor, hexToRgb } from '../utils/colors';
import { t } from '../utils/i18n';
import type { Language } from '../utils/i18n';

interface GlobeViewerProps {
  apparitions: Apparition[];
  selectedApparition: Apparition | null;
  onSelectApparition: (apparition: Apparition | null) => void;
  isTimelineOpen: boolean;
  lang: Language;
  hidePlayPause?: boolean;
}

const GlobeViewer: React.FC<GlobeViewerProps> = ({ 
  apparitions, 
  selectedApparition, 
  onSelectApparition, 
  isTimelineOpen, 
  lang,
  hidePlayPause = false
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globeEl = useRef<any>(null);
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [lodThreshold, setLodThreshold] = useState<number>(2);
  const lodRef = useRef<number>(2);
  const lastClickTimeRef = useRef<number>(0);

  const [ringApparition, setRingApparition] = useState<Apparition | null>(null);
  const [ringProgress, setRingProgress] = useState(1);

  useEffect(() => {
    if (selectedApparition) {
      setRingApparition(selectedApparition);
      setRingProgress(1);
    } else {
      let start: number | null = null;
      const duration = 400; // ms
      let animFrameId: number;

      const animate = (timestamp: number) => {
        if (!start) start = timestamp;
        const elapsed = timestamp - start;
        const progress = Math.max(0, 1 - elapsed / duration);
        setRingProgress(progress);

        if (progress > 0) {
          animFrameId = requestAnimationFrame(animate);
        } else {
          setRingApparition(null);
        }
      };

      animFrameId = requestAnimationFrame(animate);
      return () => {
        cancelAnimationFrame(animFrameId);
      };
    }
  }, [selectedApparition]);

  useEffect(() => {
    if (selectedApparition && globeEl.current) {
      setIsAutoRotate(false);
      if (globeEl.current.controls()) {
        globeEl.current.controls().autoRotate = false;
      }
      const latOffset = isTimelineOpen ? 14 : 4;
      globeEl.current.pointOfView({ lat: selectedApparition.lat - latOffset, lng: selectedApparition.lng, altitude: 0.6 }, 1000);
    }
  }, [selectedApparition, isTimelineOpen]);

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
      controls.minDistance = 112; // Globe radius ~100. 112 keeps camera safely outside globe surface but allows closer zoom
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
          controls.minDistance = 112;
          controls.maxDistance = 400;
          controls.zoomSpeed = 0.6;
          controlsConfigured = true;
        }

        const pov = globeEl.current.pointOfView();
        if (pov && pov.altitude !== undefined) {
          // 5-zone LOD
          // Zone 1 (very close, alt < 0.4) → 0 extra labels (selected only)
          // Zone 2 (close,     alt < 0.9) → max 6,  priority-1 only
          // Zone 3 (mid,       alt < 1.6) → max 12, priority-1 only
          // Zone 4 (mid-far,   alt < 2.4) → max 8,  priority-1 only
          // Zone 5 (far,       alt ≥ 2.4) → max 5,  priority-1 only
          const altitude = Math.max(0.1, pov.altitude);
          let newThreshold: number;
          if (altitude < 0.4) newThreshold = 1;
          else if (altitude < 0.9) newThreshold = 2;
          else if (altitude < 1.6) newThreshold = 3;
          else if (altitude < 2.4) newThreshold = 4;
          else newThreshold = 5;

          if (newThreshold !== lodRef.current) {
            lodRef.current = newThreshold;
            setLodThreshold(newThreshold);
          }

          // Labels fade slightly when very far out
          const targetOpacity = altitude > 3.0
            ? Math.max(0, 1.0 - ((altitude - 3.0) / 0.8))
            : 1;
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
    const threshold = 0.02;
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
    // Per-zone label caps
    // Zone 1 (very close): selected only
    // Zone 2 (close):      max 2 per region, priority ≤ 1
    // Zone 3 (mid):        max 3 per region, priority ≤ 1
    // Zone 4 (mid-far):    max 2 per region, priority ≤ 1
    // Zone 5 (far):        max 1 per region, priority ≤ 1
    //
    // GEOGRAPHIC DISTRIBUTION: Labels are picked per continental region so the
    // globe always looks populated globally as it rotates, not just over Europe.
    const ZONE_CONFIG: Record<number, { perRegion: number; maxPriority: number }> = {
      1: { perRegion: 25, maxPriority: 5 },
      2: { perRegion: 15, maxPriority: 4 },
      3: { perRegion: 8, maxPriority: 2 },
      4: { perRegion: 3, maxPriority: 1 },
      5: { perRegion: 2, maxPriority: 1 },
    };
    const { perRegion, maxPriority } = ZONE_CONFIG[lodThreshold] ?? { perRegion: 2, maxPriority: 1 };

    // Dynamic scale-up when user filters down the dataset (e.g. Vatican-approved only)
    const totalItems = apparitions.length;
    let effectivePerRegion = perRegion;
    let effectiveMaxPriority = maxPriority;

    if (totalItems < 35) {
      effectivePerRegion = 15; // Allow many more labels when dataset is sparse
      effectiveMaxPriority = 999; // Allow all priorities
    } else if (totalItems < 75) {
      effectivePerRegion = Math.max(perRegion, 5);
      effectiveMaxPriority = Math.max(maxPriority, 2);
    }

    // Geographic regions: [name, latMin, latMax, lngMin, lngMax]
    const REGIONS: [string, number, number, number, number][] = [
      ['western-europe',  35,  72,  -12,  30],
      ['eastern-europe',  40,  70,   30,  60],
      ['middle-east',     15,  42,   25,  65],
      ['africa',         -40,  38,  -18,  55],
      ['north-america',   15,  75, -170, -50],
      ['central-america',  5,  25, -120, -60],
      ['south-america',  -55,   5,  -82, -34],
      ['asia-south',      -5,  40,   60, 145],
      ['asia-east',       20,  55,  100, 150],
      ['oceania',        -55,  -5,  100, 180],
    ];

    const getRegion = (lat: number, lng: number): string => {
      for (const [name, latMin, latMax, lngMin, lngMax] of REGIONS) {
        if (lat >= latMin && lat <= latMax && lng >= lngMin && lng <= lngMax) return name;
      }
      return 'other';
    };

    // Pre-calculate active apparitions count per region
    const totalCountByRegion: Record<string, number> = {};
    for (const app of apparitions) {
      const r = getRegion(app.lat, app.lng);
      totalCountByRegion[r] = (totalCountByRegion[r] || 0) + 1;
    }

    // Build candidate list — handle adaptive priority relaxation
    const candidates = apparitions
      .filter(app => {
        if (selectedApparition?.id === app.id) return true;
        
        const region = getRegion(app.lat, app.lng);
        const regionTotal = totalCountByRegion[region] || 0;
        
        // If the region has very few total active apparitions, show them all!
        if (regionTotal < 25) return true;
        
        if (effectiveMaxPriority >= 999) return true;
        if (app.priority === undefined || app.priority === null) return false;
        return app.priority <= effectiveMaxPriority;
      })
      .sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99));

    // Adaptive spacing based on lodThreshold (zoom/altitude) and dataset size
    let spacingBase: number;
    if (lodThreshold === 5) {
      spacingBase = 12.0; // Far out: labels must be very far apart geographically to not overlap on screen
    } else if (lodThreshold === 4) {
      spacingBase = 7.5;  // Mid-far
    } else if (lodThreshold === 3) {
      spacingBase = 4.5;  // Mid
    } else if (lodThreshold === 2) {
      spacingBase = 2.5;  // Close
    } else {
      spacingBase = 1.2;  // Very close
    }

    // Slightly compress spacing margin if dataset is small, but keep safety bounds
    const CLUSTER_DEG = totalItems < 35 ? spacingBase * 0.7 : spacingBase;

    const regionCounts: Record<string, number> = {};
    const clusters: (Apparition & { clusterCount?: number })[] = [];

    for (const app of candidates) {
      if (selectedApparition?.id === app.id) continue; // handled at end

      // Avoid showing other labels near the selected apparition to prevent overlap.
      // Since the selected label is styled larger and wider, we apply a horizontal aspect ratio multiplier.
      if (selectedApparition) {
        const distLat = Math.abs(selectedApparition.lat - app.lat);
        const distLng = Math.abs(selectedApparition.lng - app.lng);
        const meanLat = ((selectedApparition.lat + app.lat) / 2) * Math.PI / 180;
        const cosLat = Math.max(0.3, Math.cos(meanLat));
        const physicalDistLng = distLng * cosLat;
        const minSelectedDist = lodThreshold === 5 ? 12.0 : (lodThreshold === 4 ? 8.0 : (lodThreshold === 3 ? 5.0 : 2.8));
        if (distLat < minSelectedDist && physicalDistLng < (minSelectedDist * 3.8)) continue;
      }

      const region = getRegion(app.lat, app.lng);
      const count = regionCounts[region] ?? 0;
      
      const regionTotal = totalCountByRegion[region] || 0;
      const maxAllowed = regionTotal < 25 ? 15 : effectivePerRegion;
      
      if (count >= maxAllowed) continue;

      // Within same region, avoid placing labels too close together.
      // Since labels are text strings written horizontally, their width is much
      // larger than their height. We use a 3.8x horizontal aspect ratio multiplier
      // and project longitude distance by cos(lat) to prevent overlaps.
      const tooClose = clusters.some(c => {
        const latDiff = Math.abs(c.lat - app.lat);
        const lngDiff = Math.abs(c.lng - app.lng);
        const meanLat = ((c.lat + app.lat) / 2) * Math.PI / 180;
        const cosLat = Math.max(0.3, Math.cos(meanLat));
        const physicalLngDiff = lngDiff * cosLat;
        return latDiff < CLUSTER_DEG && physicalLngDiff < (CLUSTER_DEG * 3.8);
      });
      if (tooClose) continue;

      clusters.push({ ...app, clusterCount: 1 });
      regionCounts[region] = count + 1;
    }

    // Always show selected apparition
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
    <>
      <div 
        style={{ position: 'absolute', top: 0, left: 0, zIndex: 1, width: '100%', height: '100%' }}
        onPointerEnter={() => {
          const active = document.activeElement as HTMLElement;
          if (active && active.tagName !== 'INPUT' && active.tagName !== 'TEXTAREA') {
            active.blur();
          }
        }}
      >
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
          pointColor={(d: unknown) => getStatusColor((d as Apparition).approvalStatus)}
          pointAltitude={lodThreshold <= 2 ? 0.005 : lodThreshold === 3 ? 0.008 : 0.013}
          pointRadius={lodThreshold <= 1 ? 0.08 : lodThreshold === 2 ? 0.13 : lodThreshold === 3 ? 0.2 : lodThreshold === 4 ? 0.28 : 0.36}
          pointsMerge={false}
          ringsData={ringApparition ? [ringApparition] : []}
          ringLat="lat"
          ringLng="lng"
          ringColor={(d: unknown) => {
            const hex = getStatusColor((d as Apparition).approvalStatus);
            const rgb = hexToRgb(hex);
            return `rgba(${rgb}, ${ringProgress})`;
          }}
          ringMaxRadius={6 * ringProgress}
          ringPropagationSpeed={4}
          ringRepeatPeriod={700}
          onPointClick={handlePointClick}
          onPointHover={(point) => {
            document.body.style.cursor = point ? 'pointer' : 'default';
          }}
          onGlobeClick={handleGlobeClick}
          htmlElementsData={visibleHtmlLabels}
          htmlElement={(dRaw: unknown) => {
            const d = dRaw as Apparition & { clusterCount?: number };
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
            el.style.zIndex = isSelected ? '9999' : '1';

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
              cursor: pointer;
              white-space: nowrap; 
              z-index: ${isSelected ? 9999 : 1};
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
      </div>

      {/* Play/Pause Control Button - fixed so zoom/pan never moves it off-screen */}
      {!hidePlayPause && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsAutoRotate(prev => !prev);
          }}
          style={{
            position: 'fixed',
            bottom: isTimelineOpen ? '268px' : '20px',
            left: '20px',
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
          title={isAutoRotate ? t('pauseRotation', lang) : t('resumeRotation', lang)}
        >
          {isAutoRotate ? <Pause size={18} /> : <Play size={18} style={{ marginLeft: '2px' }} />}
        </button>
      )}
    </>
  );
};

export default GlobeViewer;
