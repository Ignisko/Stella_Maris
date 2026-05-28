/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useRef, useState, useMemo } from 'react';
import Globe from 'react-globe.gl';
import type { Apparition } from '../data/apparitions';
import { Play, Pause, X } from 'lucide-react';
import { getStatusColor, hexToRgb } from '../utils/colors';
import { t } from '../utils/i18n';
import type { Language } from '../utils/i18n';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiaWduaW1icml0ZSIsImEiOiJjbXBtOHFucHgwMTg2MnBzYnl1cXVqdjU0In0' + '.' + '9F99qXNcy8GchCFtd7JKWw';

interface GlobeViewerProps {
  apparitions: Apparition[];
  selectedApparition: Apparition | null;
  onSelectApparition: (apparition: Apparition | null) => void;
  isTimelineOpen: boolean;
  lang: Language;
  hidePlayPause?: boolean;
  isTutorialActive?: boolean;
  tutorialStep?: number;
  isCinemaMode?: boolean;
  onAdvanceTutorialStep?: () => void;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const configureOrbitControls = (controls: any) => {
  controls.minDistance = 101.5; // Globe radius ~100. Allow closer zoom to ground level
  controls.maxDistance = 400;
  controls.zoomSpeed = 3.5; // More responsive manual zooming (especially for touchpads)
  controls.enableDamping = true; // Premium inertial damping
  controls.dampingFactor = 0.08; // High glide inertia for premium feel
  
  // Custom zoom scale calculator to boost small touchpad scroll increments (deltaY is typically 1-20)
  // while keeping physical mouse wheel scrolling (deltaY is typically 100-120 feeling natural.
  controls._getZoomScale = function (delta: number) {
    const absDelta = Math.abs(delta);
    // Smooth exponential boost: up to 5x boost for small deltas, fading to ~1.2x for mouse deltas.
    const boost = 1.0 + 4.0 * Math.exp(-absDelta / 40.0);
    const normalizedDelta = (absDelta * boost) * 0.01;
    return Math.pow(0.95, controls.zoomSpeed * normalizedDelta);
  };

  // Intercept dolly actions to smooth out zoom (since OrbitControls has no native zoom damping)
  controls.targetRadius = undefined;
  controls.lastZoomTime = 0;

  controls._dollyIn = function (dollyScale: number) {
    const currentDistance = controls.object.position.distanceTo(controls.target);
    if (controls.targetRadius === undefined) {
      controls.targetRadius = currentDistance;
    }
    controls.targetRadius *= dollyScale;
    controls.targetRadius = Math.max(controls.minDistance, Math.min(controls.maxDistance, controls.targetRadius));
    controls.lastZoomTime = Date.now();
  };

  controls._dollyOut = function (dollyScale: number) {
    const currentDistance = controls.object.position.distanceTo(controls.target);
    if (controls.targetRadius === undefined) {
      controls.targetRadius = currentDistance;
    }
    controls.targetRadius /= dollyScale;
    controls.targetRadius = Math.max(controls.minDistance, Math.min(controls.maxDistance, controls.targetRadius));
    controls.lastZoomTime = Date.now();
  };
};

const GlobeViewer: React.FC<GlobeViewerProps> = ({ 
  apparitions, 
  selectedApparition, 
  onSelectApparition, 
  isTimelineOpen, 
  lang,
  hidePlayPause = false,
  isTutorialActive = false,
  tutorialStep = 0,
  isCinemaMode = false,
  onAdvanceTutorialStep
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globeEl = useRef<any>(null);
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [lodThreshold, setLodThreshold] = useState<number>(6);
  const lodRef = useRef<number>(6);
  const lastClickTimeRef = useRef<number>(0);

  const [ringApparition, setRingApparition] = useState<Apparition | null>(null);
  const [ringProgress, setRingProgress] = useState(1);
  const [clusterPopup, setClusterPopup] = useState<{ lat: number; lng: number; items: Apparition[] } | null>(null);
  const latestSelectedIdRef = useRef<string | null>(null);

  const ringConfig = useMemo(() => {
    switch (lodThreshold) {
      case 1: // super close (alt < 0.05)
        return { maxRadius: 0.04, propagationSpeed: 0.02, repeatPeriod: 3000 };
      case 2: // very close (alt < 0.15)
        return { maxRadius: 0.12, propagationSpeed: 0.06, repeatPeriod: 2500 };
      case 3: // close (alt < 0.4)
        return { maxRadius: 0.35, propagationSpeed: 0.18, repeatPeriod: 2200 };
      case 4: // mid-close (alt < 0.9)
        return { maxRadius: 0.9, propagationSpeed: 0.45, repeatPeriod: 1800 };
      case 5: // mid (alt < 1.6)
        return { maxRadius: 1.8, propagationSpeed: 0.9, repeatPeriod: 1500 };
      case 6: // mid-far (alt < 2.4)
        return { maxRadius: 3.2, propagationSpeed: 1.6, repeatPeriod: 1200 };
      case 7: // far (alt >= 2.4)
      default:
        return { maxRadius: 4.8, propagationSpeed: 2.4, repeatPeriod: 1000 };
    }
  }, [lodThreshold]);

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
      latestSelectedIdRef.current = selectedApparition.id;
      setIsAutoRotate(false);
      if (globeEl.current.controls()) {
        globeEl.current.controls().autoRotate = false;
      }
      const currentPov = globeEl.current.pointOfView();
      const currentLat = currentPov ? currentPov.lat : 0;
      const currentLng = currentPov ? currentPov.lng : 0;
      const currentAltitude = currentPov ? currentPov.altitude : 0.6;
      
      // Calculate dynamic target altitude based on nearby pin density to help separate clustered pins
      let baseTargetAltitude = 0.35;
      if (apparitions.length > 1) {
        let minPeerDist = 999;
        for (const a of apparitions) {
          if (a.id === selectedApparition.id) continue;
          const dLat = Math.abs(a.lat - selectedApparition.lat);
          const dLng = Math.abs(a.lng - selectedApparition.lng);
          const dist = Math.sqrt(dLat * dLat + dLng * dLng);
          if (dist < minPeerDist) {
            minPeerDist = dist;
          }
        }
        
        if (minPeerDist < 0.8) {
          baseTargetAltitude = 0.05; // Zoom in very close to separate nearby pins
        } else if (minPeerDist < 3.0) {
          baseTargetAltitude = 0.15; // Zoom in mid-close
        }
      }

      // If we are already zoomed in closer than targetAltitude, keep the current close zoom.
      const targetAltitude = currentAltitude < baseTargetAltitude ? currentAltitude : baseTargetAltitude;
      const latOffset = (isTimelineOpen && !isCinemaMode) ? 6 : 0;
      
      // Calculate dynamic duration for smooth and cinematic transitions
      const dLat = (selectedApparition.lat - latOffset) - currentLat;
      let dLng = selectedApparition.lng - currentLng;
      if (dLng > 180) dLng -= 360;
      if (dLng < -180) dLng += 360;
      
      const spatialDist = Math.sqrt(dLat * dLat + dLng * dLng);
      const altDist = Math.abs(targetAltitude - currentAltitude);
      
      // Gentle, smooth duration: base 1500ms, scaling with distance and zoom transition (capped at 3000ms)
      const duration = Math.min(3000, 1500 + spatialDist * 6 + altDist * 400);
      
      globeEl.current.pointOfView({ lat: selectedApparition.lat - latOffset, lng: selectedApparition.lng, altitude: targetAltitude }, duration);
    } else if (!selectedApparition) {
      latestSelectedIdRef.current = null;
      if (globeEl.current && !isCinemaMode) {
        const currentPov = globeEl.current.pointOfView();
        if (currentPov && currentPov.altitude < 1.5) {
          globeEl.current.pointOfView({ lat: currentPov.lat, lng: currentPov.lng, altitude: 2.2 }, 1500);
        }
        setIsAutoRotate(true);
        if (globeEl.current.controls()) {
          globeEl.current.controls().autoRotate = true;
        }
      }
    }
  }, [selectedApparition, isTimelineOpen, isCinemaMode, apparitions]);

  // Focus camera on Mexico (Guadalupe) during Step 2 of Onboarding Guide, and reset when closed or started
  const prevTutorialActiveRef = useRef(isTutorialActive);
  useEffect(() => {
    if (isTutorialActive && (tutorialStep === 1 || tutorialStep === 2 || tutorialStep === 3) && globeEl.current) {
      setIsAutoRotate(tutorialStep === 1);
      if (globeEl.current.controls()) {
        globeEl.current.controls().autoRotate = (tutorialStep === 1);
      }
      globeEl.current.pointOfView({ lat: 15, lng: -90, altitude: 2.2 }, 1200);
    } else if (isTutorialActive && tutorialStep === 0 && globeEl.current) {
      setIsAutoRotate(true);
      if (globeEl.current.controls()) {
        globeEl.current.controls().autoRotate = true;
      }
      globeEl.current.pointOfView({ lat: 15, lng: -90, altitude: 2.2 }, 1200);
    } else if (prevTutorialActiveRef.current && !isTutorialActive && globeEl.current) {
      setIsAutoRotate(true);
      if (globeEl.current.controls()) {
        globeEl.current.controls().autoRotate = true;
      }
      globeEl.current.pointOfView({ lat: 20, lng: 10, altitude: 2.2 }, 1500);
    }
    prevTutorialActiveRef.current = isTutorialActive;
  }, [isTutorialActive, tutorialStep]);

  // Freeze globe controls during tutorial steps except Step 1 (Globe exploration step)
  useEffect(() => {
    if (globeEl.current && globeEl.current.controls()) {
      const controls = globeEl.current.controls();
      const shouldFreeze = isTutorialActive && tutorialStep !== 1;
      controls.enabled = !shouldFreeze;
    }
  }, [isTutorialActive, tutorialStep]);

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
      controls.autoRotateSpeed = 1.0;
      configureOrbitControls(controls);
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
          configureOrbitControls(controls);
          controlsConfigured = true;
        }

        if (globeEl.current.controls()) {
          const controls = globeEl.current.controls();
          const now = Date.now();
          const currentDistance = controls.object.position.distanceTo(controls.target);
          
          if (controls.targetRadius === undefined) {
            controls.targetRadius = currentDistance;
          }

          if (now - (controls.lastZoomTime || 0) > 800) {
            controls.targetRadius = currentDistance;
          } else {
            const diff = controls.targetRadius - currentDistance;
            if (Math.abs(diff) > 0.05) {
              const nextDistance = currentDistance + diff * 0.12; // Smooth 12% glide step per frame
              controls._scale = nextDistance / currentDistance;
            }
          }
        }

        const pov = globeEl.current.pointOfView();
        if (pov && pov.altitude !== undefined) {
          // 7-zone LOD
          // Zone 1 (super close, alt < 0.05)
          // Zone 2 (very close,  alt < 0.15)
          // Zone 3 (close,       alt < 0.4)
          // Zone 4 (mid-close,   alt < 0.9)
          // Zone 5 (mid,         alt < 1.6)
          // Zone 6 (mid-far,     alt < 2.4)
          // Zone 7 (far,         alt ≥ 2.4)
          const altitude = Math.max(0.001, pov.altitude);
          let newThreshold: number;
          if (altitude < 0.05) newThreshold = 1;
          else if (altitude < 0.15) newThreshold = 2;
          else if (altitude < 0.4) newThreshold = 3;
          else if (altitude < 0.9) newThreshold = 4;
          else if (altitude < 1.6) newThreshold = 5;
          else if (altitude < 2.4) newThreshold = 6;
          else newThreshold = 7;

          if (newThreshold !== lodRef.current) {
            lodRef.current = newThreshold;
            setLodThreshold(newThreshold);
          }

          // Dynamically adjust auto-rotation speed based on altitude (zoom)
          if (globeEl.current.controls()) {
            const controls = globeEl.current.controls();
            controls.autoRotateSpeed = 1.0 * Math.min(1.0, altitude / 2.0);
          }

          // Labels fade slightly when very far out
          const targetOpacity = altitude > 3.0
            ? Math.max(0, 1.0 - ((altitude - 3.0) / 0.8))
            : 1;
          document.documentElement.style.setProperty('--globe-label-opacity', targetOpacity.toString());
          document.documentElement.style.setProperty('--globe-label-scale', '1');
        }

        // Check HTML label collisions to prevent overlapping text on screen
        const labelEls = Array.from(document.querySelectorAll('.globe-html-label')) as HTMLElement[];
        if (labelEls.length > 1) {
          // Sort labels: selected (highest priority) -> priority value (ascending)
          labelEls.sort((a, b) => {
            const aSel = a.dataset.selected === 'true';
            const bSel = b.dataset.selected === 'true';
            if (aSel && !bSel) return -1;
            if (!aSel && bSel) return 1;
            
            const aPri = parseInt(a.dataset.priority || '3', 10);
            const bPri = parseInt(b.dataset.priority || '3', 10);
            return aPri - bPri;
          });

          const keptRects: DOMRect[] = [];
          // Dynamically adjust collision padding: fewer active labels allow closer screen proximity
          const padding = labelEls.length < 25 ? -12 : (labelEls.length < 50 ? -3 : 5);

          for (const el of labelEls) {
            const content = el.querySelector('.label-content') as HTMLElement;
            if (!content) continue;

            // Restore visibility to measure correct size
            content.style.visibility = 'visible';
            const rect = content.getBoundingClientRect();

            let overlaps = false;
            for (const kept of keptRects) {
              const overlapX = rect.left - padding < kept.right && rect.right + padding > kept.left;
              const overlapY = rect.top - padding < kept.bottom && rect.bottom + padding > kept.top;
              if (overlapX && overlapY) {
                overlaps = true;
                break;
              }
            }

            if (overlaps) {
              content.style.visibility = 'hidden';
            } else {
              keptRects.push(rect);
            }
          }
        }
      }
      animationFrameId = requestAnimationFrame(updateScale);
    };
    updateScale();
    return () => cancelAnimationFrame(animationFrameId);
  }, [selectedApparition]);

  const visibleHtmlLabels = useMemo(() => {
    const totalItems = apparitions.length;

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

    // Pre-calculate active counts of apparitions per region before priority filtering
    const activeCountByRegion: Record<string, number> = {};
    for (const app of apparitions) {
      const r = getRegion(app.lat, app.lng);
      activeCountByRegion[r] = (activeCountByRegion[r] || 0) + 1;
    }

    // Per-zone label configs defining cap per region, max allowed priority, and geographic spacing base (in degrees)
    const ZONE_CONFIG: Record<number, { perRegion: number; maxPriority: number; spacingBase: number }> = {
      1: { perRegion: 999, maxPriority: 5, spacingBase: 0.01 }, // super close (altitude < 0.05) - show all, minimal clustering (~1km)
      2: { perRegion: 150, maxPriority: 5, spacingBase: 0.15 }, // very close (altitude < 0.15) - show up to priority 5, spacing base (~15km)
      3: { perRegion: 80,  maxPriority: 5, spacingBase: 0.4  }, // close (altitude < 0.4) - show up to priority 5, spacing base (~40km)
      4: { perRegion: 45,  maxPriority: 4, spacingBase: 1.0  }, // mid-close (altitude < 0.9, Europe/US full screen view) - show up to priority 4, spacing base (~100km)
      5: { perRegion: 25,  maxPriority: 3, spacingBase: 2.2  }, // mid zoom (altitude < 1.6) - show up to priority 3, spacing base (~240km)
      6: { perRegion: 12,  maxPriority: 3, spacingBase: 4.5  }, // far zoom (altitude < 2.4) - show up to priority 3, spacing base (~500km)
      7: { perRegion: 6,   maxPriority: 2, spacingBase: 9.0  }, // very far zoom (altitude >= 2.4) - show up to priority 2, spacing base (~1000km)
    };

    const config = ZONE_CONFIG[lodThreshold] ?? { perRegion: 3, maxPriority: 1, spacingBase: 12.0 };
    let maxPriority = config.maxPriority;
    let effectivePerRegion = config.perRegion;
    let spacingBase = config.spacingBase;

    // Dynamic scale-up of region caps and relaxation when dataset is sparse (e.g. searches)
    if (totalItems < 35) {
      maxPriority = 5;
      effectivePerRegion = 999;
      spacingBase = 0.1;
    } else if (totalItems < 75) {
      maxPriority = Math.max(maxPriority, 3);
      effectivePerRegion = Math.max(effectivePerRegion, 30);
      spacingBase = spacingBase * 0.4;
    }

    const filtered = apparitions.filter(app => {
      if (selectedApparition?.id === app.id) return true;
      
      const region = getRegion(app.lat, app.lng);
      const regionTotal = activeCountByRegion[region] || 0;

      // Relax the priority limit dynamically in sparse regions
      let allowedPriority = maxPriority;
      if (regionTotal <= 5) {
        allowedPriority = 5;
      } else if (regionTotal <= 15) {
        allowedPriority = Math.max(allowedPriority, 4);
      } else if (regionTotal <= 35) {
        if (lodThreshold >= 6) {
          allowedPriority = Math.max(allowedPriority, 3);
        } else {
          allowedPriority = 5;
        }
      }

      const pri = app.priority ?? 3;
      return pri <= allowedPriority;
    });

    // Build candidate list
    const candidates = filtered
      .sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99));

    const CLUSTER_DEG = spacingBase;
    const regionCounts: Record<string, number> = {};
    const clusters: (Apparition & { clusterCount?: number; clusteredItems?: Apparition[] })[] = [];

    // Always push selected apparition first if it exists, so it acts as the cluster representative
    if (selectedApparition) {
      clusters.push({ ...selectedApparition, clusterCount: 1, clusteredItems: [selectedApparition] });
    }

    for (const app of candidates) {
      if (selectedApparition?.id === app.id) continue;

      const region = getRegion(app.lat, app.lng);
      const count = regionCounts[region] ?? 0;
      
      const regionTotal = activeCountByRegion[region] || 0;
      const maxAllowed = regionTotal < 25 ? 15 : effectivePerRegion;
      
      if (count >= maxAllowed) continue;

      // Within same region, avoid placing labels too close together.
      // Since labels are text strings written horizontally, we use a 3.8x horizontal spacing multiplier.
      const tooClose = clusters.some(c => {
        const latDiff = Math.abs(c.lat - app.lat);
        const lngDiff = Math.abs(c.lng - app.lng);
        const meanLat = ((c.lat + app.lat) / 2) * Math.PI / 180;
        const cosLat = Math.max(0.3, Math.cos(meanLat));
        const physicalLngDiff = lngDiff * cosLat;
        return latDiff < CLUSTER_DEG && physicalLngDiff < (CLUSTER_DEG * 3.8);
      });

      if (tooClose) {
        // Group under the existing cluster and increment its counter (+1, +2, etc.)
        const existing = clusters.find(c => {
          const latDiff = Math.abs(c.lat - app.lat);
          const lngDiff = Math.abs(c.lng - app.lng);
          const meanLat = ((c.lat + app.lat) / 2) * Math.PI / 180;
          const cosLat = Math.max(0.3, Math.cos(meanLat));
          const physicalLngDiff = lngDiff * cosLat;
          return latDiff < CLUSTER_DEG && physicalLngDiff < (CLUSTER_DEG * 3.8);
        });
        if (existing) {
          existing.clusterCount = (existing.clusterCount || 1) + 1;
          if (!existing.clusteredItems) {
            existing.clusteredItems = [{ ...existing }];
          }
          if (!existing.clusteredItems.some(item => item.id === app.id)) {
            existing.clusteredItems.push(app);
          }
        }
        continue;
      }

      clusters.push({ ...app, clusterCount: 1, clusteredItems: [app] });
      regionCounts[region] = count + 1;
    }

    return clusters;
  }, [apparitions, lodThreshold, selectedApparition]);

  const handlePointClick = (point: object) => {
    lastClickTimeRef.current = Date.now();
    const app = point as Apparition;
    onSelectApparition(app);
    setIsAutoRotate(false); 
  };

  const handleGlobeClick = () => {
    if (Date.now() - lastClickTimeRef.current < 400) {
      return;
    }
    onSelectApparition(null);
  };

  const handleBadgeClick = (d: Apparition & { clusterCount?: number; clusteredItems?: Apparition[] }, e: Event) => {
    e.stopPropagation();
    lastClickTimeRef.current = Date.now();
    
    if (globeEl.current) {
      const pov = globeEl.current.pointOfView();
      const currentAltitude = pov ? pov.altitude : 0.6;
      
      let targetAltitude = currentAltitude * 0.35;
      if (targetAltitude < 0.02) {
        targetAltitude = 0.02;
      }
      
      const latOffset = (isTimelineOpen && !isCinemaMode) ? 6 : 0;
      
      globeEl.current.pointOfView({
        lat: d.lat - latOffset,
        lng: d.lng,
        altitude: targetAltitude
      }, 1200);

      if (currentAltitude <= 0.08) {
        setClusterPopup({
          lat: d.lat,
          lng: d.lng,
          items: d.clusteredItems || [d]
        });
      }
    }
  };

  const handleSelectClusterItem = (item: Apparition) => {
    onSelectApparition(item);
    setClusterPopup(null);
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
          globeTileEngineUrl={(x: number, y: number, l: number) => `https://api.mapbox.com/styles/v1/mapbox/outdoors-v12/tiles/512/${l}/${x}/${y}?access_token=${MAPBOX_TOKEN}`}
          backgroundImageUrl="https://unpkg.com/three-globe/example/img/night-sky.png"
          pointsData={[]}
          ringsData={ringApparition ? [ringApparition] : []}
          ringLat="lat"
          ringLng="lng"
          ringColor={(d: unknown) => {
            const hex = getStatusColor((d as Apparition).approvalStatus);
            const rgb = hexToRgb(hex);
            return `rgba(${rgb}, ${ringProgress})`;
          }}
          ringMaxRadius={ringConfig.maxRadius * ringProgress}
          ringPropagationSpeed={ringConfig.propagationSpeed}
          ringRepeatPeriod={ringConfig.repeatPeriod}
          onGlobeClick={handleGlobeClick}
          htmlElementsData={visibleHtmlLabels}
          htmlElement={(dRaw: unknown) => {
            const d = dRaw as Apparition & { clusterCount?: number; labelOffset?: string };
            const isSelected = selectedApparition?.id === d.id;
            const safeTitle = escapeHtml(d.title || '');
            
            const count = d.clusterCount || 1;
            const badge = count > 1 ? `<span class="cluster-badge" style="background: rgba(255,255,255,0.25); padding: 2px 6px; border-radius: 10px; font-size: 11px; margin-left: 6px; font-weight: 700; cursor: pointer; pointer-events: auto;">+${count - 1}</span>` : '';

            // Format title by separating parenthetical subtitles (like "(Filipov)") onto a new line,
            // placing the cluster count badge on the main title line to save vertical space.
            const formatTitle = (title: string) => {
              const openParenIdx = title.indexOf(' (');
              if (openParenIdx !== -1 && title.endsWith(')')) {
                const mainTitle = title.substring(0, openParenIdx);
                const subtitle = title.substring(openParenIdx + 1);
                return `<span class="label-title-main">${mainTitle}${badge}</span><span class="label-subtitle">${subtitle}</span>`;
              }
              return `<span class="label-title-main">${title}${badge}</span>`;
            };
            const displayTitleHtml = formatTitle(safeTitle);
            const statusColor = getStatusColor(d.approvalStatus);
            const rgb = hexToRgb(statusColor);
            
            const el = document.createElement('div');
            el.className = 'globe-html-label';
            el.dataset.id = d.id;
            el.dataset.priority = isSelected ? '0' : (d.priority || 3).toString();
            el.dataset.selected = isSelected ? 'true' : 'false';
            if (d.labelOffset) {
              el.dataset.offset = d.labelOffset;
            }
            el.style.zIndex = isSelected ? '9999' : '1';
            
            // Pass values to CSS variables for dynamic rendering
            el.style.setProperty('--marker-color', statusColor);
            el.style.setProperty('--marker-bg-selected', `rgba(${rgb}, 0.4)`);
            el.style.setProperty('--marker-glow-selected', `rgba(${rgb}, 0.8)`);

            const pulseHtml = isSelected ? '<div class="marker-pulse"></div>' : '';

            const isTutorialTarget = isTutorialActive && tutorialStep === 3 && d.id === 'guadalupe_mexico';
            const tutorialPointerHtml = isTutorialTarget ? `
              <div class="tutorial-click-pointer">
                <div style={{width: 0, height: 0, borderLeft: "12px solid transparent", borderRight: "12px solid transparent", borderTop: "16px solid var(--accent-color)", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))"}}></div>
              </div>
            ` : '';

            el.innerHTML = `
              <div class="marker-container">
                <div class="marker-dot"></div>
                ${pulseHtml}
                ${tutorialPointerHtml}
                <div class="label-content${isSelected ? ' selected' : ''}">${displayTitleHtml}</div>
              </div>
            `;

            // Attach event handlers to both dot and label content for zoom levels <= 4
            const dot = el.querySelector('.marker-dot') as HTMLElement;
            if (dot) {
              dot.onpointerdown = (e) => {
                e.stopPropagation();
                lastClickTimeRef.current = Date.now();
                handlePointClick(d);
              };
              dot.onclick = (e) => {
                e.stopPropagation();
                lastClickTimeRef.current = Date.now();
                handlePointClick(d);
              };
            }

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

            // Attach event handler specifically for the cluster badge to avoid triggering normal dot click
            const badgeEl = el.querySelector('.cluster-badge') as HTMLElement;
            if (badgeEl) {
              badgeEl.onpointerdown = (e) => {
                e.stopPropagation();
              };
              badgeEl.onclick = (e) => {
                e.stopPropagation();
                handleBadgeClick(d as Apparition & { clusterCount?: number; clusteredItems?: Apparition[] }, e);
              };
            }

            el.onwheel = (e) => {
              if (globeEl.current) {
                const renderer = globeEl.current.renderer();
                if (renderer) {
                  const canvas = renderer.domElement;
                  if (canvas) {
                    const clonedEvent = new WheelEvent('wheel', {
                      clientX: e.clientX,
                      clientY: e.clientY,
                      deltaX: e.deltaX,
                      deltaY: e.deltaY,
                      deltaZ: e.deltaZ,
                      deltaMode: e.deltaMode,
                      bubbles: true,
                      cancelable: true,
                      ctrlKey: e.ctrlKey,
                      shiftKey: e.shiftKey,
                      altKey: e.altKey,
                      metaKey: e.metaKey
                    });
                    canvas.dispatchEvent(clonedEvent);
                  }
                }
              }
            };

            return el;
          }}
        />
      </div>

      {/* Play/Pause Control Button - fixed so zoom/pan never moves it off-screen */}
      {(!hidePlayPause && (!isTutorialActive || tutorialStep === 2 || tutorialStep === 9)) && (
        <button
          id="auto-rotate-button"
          onClick={(e) => {
            e.stopPropagation();
            setIsAutoRotate(prev => !prev);
            if (onAdvanceTutorialStep) {
              onAdvanceTutorialStep();
            }
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
            borderRadius: '22px',
            padding: '0 20px',
            height: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            color: 'var(--text-color)',
            cursor: 'pointer',
            boxShadow: isTutorialActive && tutorialStep === 2 ? '0 0 0 4px rgba(56, 189, 248, 0.5), 0 0 20px rgba(56, 189, 248, 0.8)' : '0 4px 12px rgba(0,0,0,0.4)',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(15, 23, 42, 0.95)';
            e.currentTarget.style.transform = 'scale(1.02)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(15, 23, 42, 0.75)';
            e.currentTarget.style.transform = 'none';
          }}
          title={isAutoRotate ? t('autoRotateOn', lang) : t('autoRotateOff', lang)}
        >
          {isAutoRotate ? <Pause size={18} /> : <Play size={18} style={{ marginLeft: '1px' }} />}
          <span style={{ fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap' }}>
            {isAutoRotate ? t('autoRotateOn', lang) : t('autoRotateOff', lang)}
          </span>
        </button>
      )}

      {clusterPopup && (
        <div 
          onClick={() => setClusterPopup(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(3, 4, 11, 0.4)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="glass-panel glass-panel-rounded animate-fade-in"
            style={{
              width: '90%',
              maxWidth: '440px',
              maxHeight: '80%',
              overflowY: 'auto',
              padding: '24px',
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid var(--glass-border)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.7)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--gold-accent)', margin: 0 }}>
                {t('otherApparitions', lang, { count: clusterPopup.items.length })}
              </h3>
              <button 
                onClick={() => setClusterPopup(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-color)',
                  cursor: 'pointer',
                  opacity: 0.7,
                  padding: '4px'
                }}
              >
                <X size={20} />
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', maxHeight: '350px', paddingRight: '4px' }}>
              {clusterPopup.items.map((item) => {
                const color = getStatusColor(item.approvalStatus);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectClusterItem(item)}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      color: 'var(--text-color)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                    }}
                  >
                    <span style={{ 
                      width: '10px', 
                      height: '10px', 
                      borderRadius: '50%', 
                      backgroundColor: color, 
                      marginTop: '5px',
                      flexShrink: 0,
                      boxShadow: `0 0 8px ${color}`
                    }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontSize: '15px', fontWeight: 600 }}>{item.title}</span>
                      <span style={{ fontSize: '13px', opacity: 0.7 }}>{item.year} • {item.location}, {item.country}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GlobeViewer;

