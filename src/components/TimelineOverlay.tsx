import React, { useState, useMemo } from 'react';
import type { Apparition } from '../data/apparitions';
import { BarChart2, ChevronUp, ChevronDown, Clock } from 'lucide-react';
import { getStatusColor, STATUS_COLORS, getApparitionStatusCategory } from '../utils/colors';

interface TimelineOverlayProps {
  apparitions: Apparition[];
  selectedApparition: Apparition | null;
  onSelectApparition: (apparition: Apparition) => void;
}

const FAMOUS_CALLOUTS: Record<string, { label: string; year: number; heightOffset: number }> = {
  "rue-du-bac-1830": { label: "Our Lady of Miraculous Medal", year: 1830, heightOffset: 12 },
  "rome-ratisbonne-1842": { label: "Our Lady of Zion", year: 1842, heightOffset: 65 },
  "lourdes-1858": { label: "Our Lady of Lourdes", year: 1858, heightOffset: 75 },
  "fatima": { label: "Our Lady of Fatima", year: 1917, heightOffset: 12 },
  "banneux": { label: "Virgin of the Poor", year: 1933, heightOffset: 30 },
  "kibeho": { label: "Mother of the Word", year: 1981, heightOffset: 12 }
};

const TimelineOverlay: React.FC<TimelineOverlayProps> = ({ apparitions, selectedApparition, onSelectApparition }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [timeMode, setTimeMode] = useState<'modern' | 'all'>('modern');
  const [hoveredApp, setHoveredApp] = useState<Apparition | null>(null);

  // Filter based on selected time mode
  const activeApparitions = useMemo(() => {
    if (timeMode === 'modern') {
      return apparitions.filter(a => a.year >= 1800);
    }
    return apparitions;
  }, [apparitions, timeMode]);

  // Sort active apparitions by year
  const sorted = useMemo(() => [...activeApparitions].sort((a, b) => a.year - b.year), [activeApparitions]);
  
  const minYear = useMemo(() => {
    if (timeMode === 'modern') return 1800;
    return sorted.length > 0 ? sorted[0].year : 1500;
  }, [sorted, timeMode]);

  const maxYear = useMemo(() => {
    if (timeMode === 'modern') return 2025;
    return sorted.length > 0 ? sorted[sorted.length - 1].year : 2025;
  }, [sorted, timeMode]);

  // Pad the range slightly
  const startY = minYear;
  const endY = maxYear;
  const range = endY - startY;

  // Group into columns (approx 115 columns across timeline width)
  const bucketSpan = Math.max(1, Math.round(range / 115));
  const numBuckets = Math.ceil(range / bucketSpan);

  const buckets = useMemo(() => {
    if (sorted.length === 0) return [];
    const bList = [];
    for (let i = 0; i <= numBuckets; i++) {
      const yStart = startY + i * bucketSpan;
      const yEnd = yStart + bucketSpan - 1;
      const apps = sorted.filter(app => app.year >= yStart && app.year <= yEnd);
      bList.push({
        index: i,
        startYear: yStart,
        endYear: yEnd,
        apps
      });
    }
    return bList;
  }, [sorted, startY, bucketSpan, numBuckets]);

  const maxCount = useMemo(() => {
    return Math.max(1, ...buckets.map(b => b.apps.length));
  }, [buckets]);

  // Precise tile height to prevent container overflow
  const tileHeight = maxCount > 25 ? 4 : maxCount > 18 ? 6 : maxCount > 12 ? 8 : 10;
  const tickStep = timeMode === 'modern' ? 20 : 100;

  return (
    <div className="glass-panel glass-panel-rounded animate-fade-in" style={{
      position: 'absolute',
      bottom: '30px',
      left: '340px',
      right: selectedApparition ? '420px' : '30px',
      maxWidth: '1400px',
      margin: '0 auto',
      backgroundColor: isExpanded ? 'rgba(15, 23, 42, 0.98)' : 'rgba(15, 23, 42, 0.85)',
      border: isExpanded ? '1px solid rgba(255, 255, 255, 0.25)' : '1px solid rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(20px)',
      boxShadow: isExpanded ? '0 25px 60px rgba(0,0,0,0.9)' : '0 8px 30px rgba(0,0,0,0.6)',
      padding: isExpanded ? '20px 28px' : '12px 24px',
      zIndex: 25,
      boxSizing: 'border-box',
      transition: 'all 0.3s ease',
      pointerEvents: 'auto'
    }}>
      {/* Header and Controls */}
      <div style={{ position: 'relative', minHeight: '30px', marginBottom: isExpanded ? '16px' : '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap', paddingRight: '110px' }}>
          <h3 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1.5px', opacity: 0.9, margin: 0, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart2 size={18} color="var(--accent-color)" /> Timeline
          </h3>

          {/* Time Mode Pill Toggle */}
          <div style={{ display: 'flex', background: 'rgba(0, 0, 0, 0.4)', padding: '3px', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
            <button
              onClick={() => setTimeMode('modern')}
              style={{
                background: timeMode === 'modern' ? 'var(--accent-color)' : 'transparent',
                color: timeMode === 'modern' ? '#ffffff' : '#94a3b8',
                border: 'none',
                padding: '4px 14px',
                borderRadius: '18px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Clock size={12} /> Modern era (1800-Present)
            </button>
            <button
              onClick={() => setTimeMode('all')}
              style={{
                background: timeMode === 'all' ? 'var(--accent-color)' : 'transparent',
                color: timeMode === 'all' ? '#ffffff' : '#94a3b8',
                border: 'none',
                padding: '4px 14px',
                borderRadius: '18px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Clock size={12} /> Full history (40 AD-Present)
            </button>
          </div>
          
          {/* Status Legend (Only visible when expanded) */}
          {isExpanded && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              {Object.entries(STATUS_COLORS).map(([label, color]) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', opacity: 0.8, fontWeight: 500 }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: color, boxShadow: `0 0 6px ${color}` }} />
                  <span>
                    {label === "Approved for faith expression" ? "Faith expression" : label === "Apparitions to saints" ? "Apparitions to saints" : label === "Unapproved apparitions" ? "Unapproved" : label.replace(" approved", "")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {hoveredApp && (
          <div style={{
            position: 'absolute',
            top: '-75px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            border: `1px solid ${getStatusColor(hoveredApp.approvalStatus)}`,
            padding: '8px 16px',
            borderRadius: '10px',
            color: '#ffffff',
            zIndex: 100,
            boxShadow: '0 8px 30px rgba(0,0,0,0.7)',
            pointerEvents: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            minWidth: '220px'
          }}>
            <div style={{ fontSize: '14px', fontWeight: 700, display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
              <span>{hoveredApp.title}</span>
              <span style={{ color: '#fbbf24' }}>{hoveredApp.year}</span>
            </div>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>{hoveredApp.location}, {hoveredApp.country}</div>
            <div style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: getStatusColor(hoveredApp.approvalStatus) }} />
              <span style={{ fontWeight: 600 }}>
                {getApparitionStatusCategory(hoveredApp.approvalStatus) === "Approved for faith expression" ? "Faith expression" : getApparitionStatusCategory(hoveredApp.approvalStatus)}
              </span>
            </div>
          </div>
        )}

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            background: isExpanded ? 'rgba(239, 68, 68, 0.2)' : 'rgba(56, 189, 248, 0.15)',
            border: isExpanded ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(56, 189, 248, 0.3)',
            color: isExpanded ? '#fca5a5' : '#38bdf8',
            padding: '6px 14px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            zIndex: 30,
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = isExpanded ? 'rgba(239, 68, 68, 0.3)' : 'rgba(56, 189, 248, 0.25)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = isExpanded ? 'rgba(239, 68, 68, 0.2)' : 'rgba(56, 189, 248, 0.15)';
          }}
        >
          {isExpanded ? <>Close <ChevronDown size={14} /></> : <>Expand <ChevronUp size={14} /></>}
        </button>
      </div>

      {isExpanded && (
        <div style={{ position: 'relative', width: '100%', height: '250px', marginBottom: '8px' }}>
          
          {/* Era Overlays (Visible in Modern view when no apparition is selected) */}
          {timeMode === 'modern' && !selectedApparition && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: '3%',
              right: '3%',
              display: 'flex',
              justifyContent: 'space-between',
              pointerEvents: 'none',
              zIndex: 15
            }}>
              <div style={{ maxWidth: '280px', background: 'rgba(15, 23, 42, 0.7)', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
                <div style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '1px', color: '#fbbf24', marginBottom: '4px' }}>GOLDEN AGE (1830-1933)</div>
                <div style={{ fontSize: '11px', lineHeight: 1.35, color: '#e2e8f0', opacity: 0.9 }}>Wars, famine, and changing attitudes toward religion contributed to a surge in apparitions and church approvals between 1830 and 1933.</div>
              </div>
              <div style={{ maxWidth: '280px', background: 'rgba(15, 23, 42, 0.7)', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
                <div style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '1px', color: '#38bdf8', marginBottom: '4px' }}>MODERN ERA</div>
                <div style={{ fontSize: '11px', lineHeight: 1.35, color: '#e2e8f0', opacity: 0.9 }}>Travelers who visited revered sites reported having visions. Millennial fervor stoked by apocalyptic fears may also have led people to report visions.</div>
              </div>
            </div>
          )}

          {/* Stacked Histogram Bars */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            width: '100%',
            height: '100%',
            position: 'absolute',
            bottom: 0,
            left: 0,
            paddingBottom: '2px'
          }}>
            {buckets.map(b => {
              return (
                <div
                  key={b.index}
                  style={{
                    flex: 1,
                    minWidth: 0,
                    margin: '0 0.5px',
                    display: 'flex',
                    flexDirection: 'column-reverse',
                    alignItems: 'center',
                    gap: '2px',
                    height: '100%',
                    justifyContent: 'flex-start',
                    position: 'relative'
                  }}
                >
                  {/* The stacked tiles */}
                  {b.apps.map(app => {
                    const isSelected = selectedApparition?.id === app.id;
                    const statusColor = getStatusColor(app.approvalStatus);

                    return (
                      <div
                        key={app.id}
                        onClick={(e) => { e.stopPropagation(); onSelectApparition(app); }}
                        onMouseEnter={() => setHoveredApp(app)}
                        onMouseLeave={() => setHoveredApp(null)}
                        style={{
                          width: '100%',
                          maxWidth: '10px',
                          minWidth: '1.5px',
                          height: `${tileHeight}px`,
                          backgroundColor: statusColor,
                          borderRadius: '1px',
                          borderTop: '1px solid rgba(255, 255, 255, 0.35)',
                          border: isSelected ? '2px solid #ffffff' : 'none',
                          boxShadow: isSelected ? `0 0 15px #ffffff, 0 0 10px ${statusColor}` : 'none',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          opacity: selectedApparition ? (isSelected ? 1 : 0.4) : 0.95,
                          zIndex: isSelected ? 30 : 1,
                          transform: isSelected ? 'scale(1.25)' : 'none'
                        }}
                      />
                    );
                  })}
                </div>
              );
            })}

            {/* Sibling Overlay for Famous Callouts (Guaranteed by CSS DOM rendering order to sit completely in front of all colorful tiles!) */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 100 }}>
              {/* Layer 1: All white pinning lines */}
              {buckets.map((b) => {
                const famousAppInBucket = b.apps.find(app => FAMOUS_CALLOUTS[app.id]);
                const callout = famousAppInBucket ? FAMOUS_CALLOUTS[famousAppInBucket.id] : null;
                if (!callout || b.apps.length === 0) return null;

                const leftPercent = ((b.index + 0.5) / buckets.length) * 100;
                const bottomOffset = b.apps.length * (tileHeight + 2);

                return (
                  <div
                    key={`line-${b.index}`}
                    style={{
                      position: 'absolute',
                      left: `${leftPercent}%`,
                      bottom: `${bottomOffset}px`,
                      transform: 'translateX(-50%)',
                      width: '1px',
                      height: `${callout.heightOffset}px`,
                      background: 'linear-gradient(to top, rgba(255,255,255,0.2), rgba(255,255,255,0.95))',
                      zIndex: 1
                    }}
                  />
                );
              })}

              {/* Layer 2: All text title pills (Rendered AFTER all white lines, so guaranteed to sit over all white lines!) */}
              {buckets.map((b) => {
                const famousAppInBucket = b.apps.find(app => FAMOUS_CALLOUTS[app.id]);
                const callout = famousAppInBucket ? FAMOUS_CALLOUTS[famousAppInBucket.id] : null;
                if (!callout || b.apps.length === 0) return null;

                const leftPercent = ((b.index + 0.5) / buckets.length) * 100;
                const bottomOffset = (b.apps.length * (tileHeight + 2)) + callout.heightOffset;

                return (
                  <div
                    key={`pill-${b.index}`}
                    onClick={(e) => { e.stopPropagation(); onSelectApparition(famousAppInBucket!); }}
                    style={{
                      position: 'absolute',
                      left: `${leftPercent}%`,
                      bottom: `${bottomOffset}px`,
                      transform: 'translateX(-50%)',
                      zIndex: 50,
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#ffffff',
                      whiteSpace: 'nowrap',
                      backgroundColor: 'rgba(15, 23, 42, 0.98)',
                      padding: '5px 12px',
                      borderRadius: '16px',
                      border: '1px solid var(--accent-color)',
                      backdropFilter: 'blur(8px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.9)',
                      marginBottom: '4px',
                      pointerEvents: 'auto',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--accent-color)';
                      e.currentTarget.style.transform = 'translateX(-50%) scale(1.05)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.98)';
                      e.currentTarget.style.transform = 'translateX(-50%)';
                    }}
                  >
                    {callout.label}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Horizontal Axis & Ticks */}
      <div 
        onClick={() => { if (!isExpanded) setIsExpanded(true); }}
        style={{ position: 'relative', height: '28px', width: '100%', marginTop: '4px', cursor: isExpanded ? 'default' : 'pointer' }}
        title={!isExpanded ? "Click to expand activity graph" : ""}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'rgba(255, 255, 255, 0.3)' }} />
        
        {Array.from({ length: Math.ceil(range / tickStep) + 1 }).map((_, i) => {
          const tickYear = Math.floor(startY / tickStep) * tickStep + i * tickStep;
          if (tickYear < startY || tickYear > endY) return null;
          const leftPercent = ((tickYear - startY) / range) * 100;
          
          return (
            <div key={`tick-${tickYear}`} style={{
              position: 'absolute',
              left: `${leftPercent}%`,
              top: 0,
              transform: 'translateX(-50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              pointerEvents: 'none'
            }}>
              <div style={{ width: '2px', height: '6px', background: 'rgba(255, 255, 255, 0.5)' }} />
              <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.75)', fontWeight: 600, marginTop: '2px' }}>
                {tickYear}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TimelineOverlay;
