/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useRef, useState, useMemo } from 'react';
import Globe from 'react-globe.gl';
import type { Apparition } from '../data/apparitions';
import { Play, Pause, X } from '@phosphor-icons/react';
import { getStatusColor, hexToRgb } from '../utils/colors';
import { t } from '../utils/i18n';
import type { Language } from '../utils/i18n';
import { config as appConfig } from '../config';

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
  isDarkMode?: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const configureOrbitControls = (controls: any) => {
  controls.minDistance = 101.5; // Globe radius ~100. Allow closer zoom to ground level
  controls.maxDistance = 400;
  controls.zoomSpeed = 6.0; // Faster responsive zoom
  controls.enableDamping = true; // Premium inertial damping
  controls.dampingFactor = 0.05; // Smoother and quicker glide
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
  isCinemaMode = false
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globeEl = useRef<any>(null);
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [telemetry, setTelemetry] = useState<{ lat: number; lng: number; altitude: number }>({ lat: 0, lng: 0, altitude: 2.5 });
  const [isInteracting, setIsInteracting] = useState(false);
  const interactionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isAutoRotate, setIsAutoRotate] = useState(false);
  const [lodThreshold, setLodThreshold] = useState<number>(6);
  const lodRef = useRef<number>(6);
  const lastClickTimeRef = useRef<number>(0);
  const elementCacheRef = useRef<Map<string, HTMLDivElement>>(new Map());

  const [ringApparition, setRingApparition] = useState<Apparition | null>(null);
  const [ringProgress, setRingProgress] = useState(1);
  const [clusterPopup, setClusterPopup] = useState<{ lat: number; lng: number; items: Apparition[] } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const latestSelectedIdRef = useRef<string | null>(null);
  const prevPointOfViewRef = useRef<{ lat: number; lng: number; altitude: number } | null>(null);

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
    }
    // When closing infobox: keep current zoom and stop rotation (do not auto-resume)
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
          controls.addEventListener('change', () => {
            if (globeEl.current) {
              const pov = globeEl.current.pointOfView();
              setTelemetry({ lat: pov.lat, lng: pov.lng, altitude: pov.altitude });
              
              setIsInteracting(true);
              if (interactionTimeoutRef.current) {
                clearTimeout(interactionTimeoutRef.current);
              }
              interactionTimeoutRef.current = setTimeout(() => {
                setIsInteracting(false);
              }, 100);
            }
          });
          controlsConfigured = true;
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
          // Prevent any overlapping text. Use a fixed positive padding.
          const padding = 2;

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
      1: { perRegion: 999, maxPriority: 5, spacingBase: 0.05 }, // super close
      2: { perRegion: 40,  maxPriority: 4, spacingBase: 0.5  }, // very close
      3: { perRegion: 20,  maxPriority: 3, spacingBase: 1.2  }, // close
      4: { perRegion: 10,  maxPriority: 2, spacingBase: 3.0  }, // mid-close
      5: { perRegion: 5,   maxPriority: 2, spacingBase: 6.0  }, // mid zoom
      6: { perRegion: 3,   maxPriority: 1, spacingBase: 12.0 }, // far zoom
      7: { perRegion: 2,   maxPriority: 1, spacingBase: 20.0 }, // very far zoom
    };

    const config = ZONE_CONFIG[lodThreshold] ?? { perRegion: 3, maxPriority: 1, spacingBase: 12.0 };
    let maxPriority = config.maxPriority;
    let effectivePerRegion = config.perRegion;
    let spacingBase = config.spacingBase;

    // Make clustering more aggressive for smaller datasets with very long titles (like Eucharistic Miracles)
    if (totalItems < 35) {
      maxPriority = 5;
      effectivePerRegion = 999;
      // Do not reduce spacingBase; in fact, keep it large enough to cluster long titles.
      spacingBase = spacingBase * 1.2;
    } else if (totalItems < 75) {
      maxPriority = Math.max(maxPriority, 3);
      effectivePerRegion = Math.max(effectivePerRegion, 30);
      spacingBase = spacingBase * 1.0;
    }

    if (appConfig.projectId === 'eucharist') {
      maxPriority = 5;
      effectivePerRegion = Math.max(effectivePerRegion, 45);
      spacingBase = spacingBase * 0.55;
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

      const pri = app.priority ?? (appConfig.projectId === 'eucharist' ? 1 : 3);
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
        return latDiff < CLUSTER_DEG && physicalLngDiff < (CLUSTER_DEG * 5.5);
      });

      if (tooClose) {
        // Group under the existing cluster and increment its counter (+1, +2, etc.)
        const existing = clusters.find(c => {
          const latDiff = Math.abs(c.lat - app.lat);
          const lngDiff = Math.abs(c.lng - app.lng);
          const meanLat = ((c.lat + app.lat) / 2) * Math.PI / 180;
          const cosLat = Math.max(0.3, Math.cos(meanLat));
          const physicalLngDiff = lngDiff * cosLat;
          return latDiff < CLUSTER_DEG && physicalLngDiff < (CLUSTER_DEG * 5.5);
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

  const handlePointClick = React.useCallback((point: object) => {
    lastClickTimeRef.current = Date.now();
    const app = point as Apparition;
    onSelectApparition(app);
    setIsAutoRotate(false); 
  }, [onSelectApparition]);

  const handleGlobeClick = () => {
    if (Date.now() - lastClickTimeRef.current < 400) {
      return;
    }
    onSelectApparition(null);
  };

  const handleBadgeClick = React.useCallback((d: Apparition & { clusterCount?: number; clusteredItems?: Apparition[] }, e: Event) => {
    e.stopPropagation();
    lastClickTimeRef.current = Date.now();
    
    if (globeEl.current) {
      const pov = globeEl.current.pointOfView();
      if (pov) {
        // Save current POV
        prevPointOfViewRef.current = {
          lat: pov.lat,
          lng: pov.lng,
          altitude: pov.altitude
        };

        const currentAltitude = pov.altitude;
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

        // Check if all items in the cluster are in the same town
        const items = d.clusteredItems || [d];
        const sameLocationName = items.every(item => item.location === items[0].location);
        const sameCoords = items.every(item => Math.abs(item.lat - items[0].lat) < 0.01 && Math.abs(item.lng - items[0].lng) < 0.01);
        const isSameTown = sameLocationName || sameCoords;

        if (isSameTown && items.length > 1) {
          // Zoom in first, then show the popup after the zoom completes
          setTimeout(() => {
            setClusterPopup({
              lat: d.lat,
              lng: d.lng,
              items: items
            });
          }, 1200);
        }
      }
    }
  }, [isTimelineOpen, isCinemaMode]);

  const handleCloseClusterPopup = () => {
    setClusterPopup(null);
    prevPointOfViewRef.current = null;
  };

  const handleSelectClusterItem = (item: Apparition) => {
    onSelectApparition(item);
    setClusterPopup(null);
    prevPointOfViewRef.current = null; // Clear it so we don't zoom back out
  };

  const escapeHtml = (str: string): string => {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  const htmlElementCallback = React.useCallback((dRaw: unknown) => {
    const d = dRaw as Apparition & { clusterCount?: number; labelOffset?: string };
    const isSelected = selectedApparition?.id === d.id;
    const count = d.clusterCount || 1;
    const isTutorialTarget = isTutorialActive && tutorialStep === 3 && d.id === 'guadalupe_mexico';
    
    let el = elementCacheRef.current.get(d.id);
    if (!el) {
      el = document.createElement('div');
      el.className = 'globe-html-label';
      elementCacheRef.current.set(d.id, el);
    }
    
    // Check if we need to update the DOM content
    const prevSelected = el.getAttribute('data-selected') === 'true';
    const prevCount = parseInt(el.getAttribute('data-count') || '0', 10);
    const prevTutorial = el.getAttribute('data-tutorial') === 'true';
    const prevLang = el.getAttribute('data-lang');
    
    if (prevSelected !== isSelected || prevCount !== count || prevTutorial !== isTutorialTarget || prevLang !== lang) {
      el.setAttribute('data-selected', isSelected ? 'true' : 'false');
      el.setAttribute('data-count', count.toString());
      el.setAttribute('data-tutorial', isTutorialTarget ? 'true' : 'false');
      el.setAttribute('data-lang', lang);
      
      el.dataset.id = d.id;
      el.dataset.priority = isSelected ? '0' : (d.priority || 3).toString();
      el.dataset.selected = isSelected ? 'true' : 'false';
      if (d.labelOffset) {
        el.dataset.offset = d.labelOffset;
      } else {
        el.removeAttribute('data-offset');
      }
      el.style.zIndex = isSelected ? '9999' : '1';
      
      const statusColor = getStatusColor(d.approvalStatus);
      const rgb = hexToRgb(statusColor);
      el.style.setProperty('--marker-color', statusColor);
      el.style.setProperty('--marker-bg-selected', `rgba(${rgb}, 0.4)`);
      el.style.setProperty('--marker-glow-selected', `rgba(${rgb}, 0.8)`);
      
      const titleText = d.title + (d.approvalStatus === 'Dismissed' ? ' ⚠️' : '');
      const safeTitle = escapeHtml(titleText || '');
      const badge = (count > 1 && !isSelected) ? `<span class="cluster-badge" style="background: rgba(0,0,0,0.6); color: #fff; padding: 2px 6px; border-radius: 12px; font-size: 11px; margin-left: 6px; font-weight: 700; cursor: pointer; pointer-events: auto;">+${count - 1}</span>` : '';
      
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
      const pulseHtml = isSelected ? '<div class="marker-pulse"></div>' : '';
      const tutorialPointerHtml = isTutorialTarget ? `
        <div class="tutorial-click-pointer">
          <div style="width: 0; height: 0; border-left: 12px solid transparent; border-right: 12px solid transparent; border-top: 16px solid var(--accent-color); filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5))"></div>
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
      
      // Wire event listeners
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
    }
    
    return el;
  }, [selectedApparition, isTutorialActive, tutorialStep, lang, handlePointClick, handleBadgeClick]);

  const formatCoord = (val: number, isLat: boolean) => {
    const dir = val < 0 ? (isLat ? 'S' : 'W') : (isLat ? 'N' : 'E');
    let abs = Math.abs(val);
    const deg = Math.floor(abs);
    const minFloat = (abs - deg) * 60;
    const min = Math.floor(minFloat);
    const sec = Math.floor((minFloat - min) * 60);
    return `${deg}°${min.toString().padStart(2, '0')}'${sec.toString().padStart(2, '0')}"${dir}`;
  };

  const cameraKm = Math.round(telemetry.altitude * 6371).toLocaleString();
  const scaleKm = Math.max(1, Math.round(telemetry.altitude * 1200)).toLocaleString();

  return (
    <>
      <div 
        style={{ 
          position: 'absolute', top: 0, left: 0, zIndex: 1, width: '100%', height: '100%',
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
        onPointerDown={() => setIsDragging(true)}
        onPointerUp={() => setIsDragging(false)}
        onPointerLeave={() => {
          setIsDragging(false);
          setIsInteracting(false);
          if (interactionTimeoutRef.current) {
            clearTimeout(interactionTimeoutRef.current);
          }
        }}
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
          htmlElement={htmlElementCallback}
        />
      </div>

      {/* Play/Pause Control Button - fixed so zoom/pan never moves it off-screen */}
      {(!hidePlayPause && (!isTutorialActive || tutorialStep === 2 || tutorialStep === 9)) && (
        <button
          id="auto-rotate-button"
          onClick={(e) => {
            e.stopPropagation();
            setIsAutoRotate(prev => !prev);
          }}
          style={{
            position: 'fixed',
            bottom: isTimelineOpen ? '268px' : '48px',
            left: '20px',
            zIndex: 200,
            pointerEvents: 'auto',
            background: 'rgba(30, 30, 30, 0.8)',
            backdropFilter: 'blur(12px)',
            border: 'none',
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
            e.currentTarget.style.background = 'rgba(45, 45, 45, 0.95)';
            e.currentTarget.style.transform = 'scale(1.02)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(30, 30, 30, 0.8)';
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
          onClick={handleCloseClusterPopup}
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
              backgroundColor: 'rgba(28, 28, 30, 0.95)',
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
                onClick={handleCloseClusterPopup}
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
                      border: 'none',
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
                      <span style={{ fontSize: '15px', fontWeight: 600 }}>{item.title} {item.approvalStatus === 'Dismissed' && '⚠️'}</span>
                      <span style={{ fontSize: '13px', opacity: 0.7 }}>{item.year} • {item.location}, {item.country}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Telemetry Bottom Bar */}
      {(!isAutoRotate && !isTutorialActive) && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '32px',
          backgroundColor: '#0f0f11',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: '0 24px',
          fontFamily: 'var(--font-sans)',
          fontSize: '11px',
          color: '#e8eaed',
          pointerEvents: 'none'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            opacity: isInteracting ? 0 : 1,
            transition: 'opacity 0.4s ease'
          }}>
          {/* Scale Bar */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '12px' }}>
            <div style={{
              width: '100px',
              borderBottom: '1px solid #e8eaed',
              borderLeft: '1px solid #e8eaed',
              borderRight: '1px solid #e8eaed',
              height: '6px',
              position: 'relative'
            }}>
              <span style={{ position: 'absolute', top: '-14px', right: 0, whiteSpace: 'nowrap' }}>{scaleKm} km</span>
            </div>
          </div>
            <div title="Camera">{cameraKm} km</div>
            <div style={{ letterSpacing: '0.05em' }}>
              {formatCoord(telemetry.lat, true)} {formatCoord(telemetry.lng, false)}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GlobeViewer;

