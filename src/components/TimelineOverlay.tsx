import React, { useState, useMemo } from 'react';
import type { Apparition } from '../data/apparitions';
import { BarChart2, ChevronUp, ChevronDown } from 'lucide-react';

interface TimelineOverlayProps {
  apparitions: Apparition[];
  selectedApparition: Apparition | null;
  onSelectApparition: (apparition: Apparition) => void;
}

const TimelineOverlay: React.FC<TimelineOverlayProps> = ({ apparitions, selectedApparition, onSelectApparition }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredDecade, setHoveredDecade] = useState<{ decade: number; count: number; apps: Apparition[] } | null>(null);

  // Sort apparitions by year
  const sorted = [...apparitions].sort((a, b) => a.year - b.year);
  const minYear = sorted.length > 0 ? sorted[0].year - 50 : 1500;
  const maxYear = sorted.length > 0 ? sorted[sorted.length - 1].year + 50 : 2000;
  const range = maxYear - minYear;

  // Group into decades
  const decadeBuckets = useMemo(() => {
    if (sorted.length === 0) return [];
    const minD = Math.floor(minYear / 10) * 10;
    const maxD = Math.floor(maxYear / 10) * 10;
    const buckets = [];
    for (let d = minD; d <= maxD; d += 10) {
      const apps = sorted.filter(app => app.year >= d && app.year < d + 10);
      buckets.push({
        decade: d,
        count: apps.length,
        apps
      });
    }
    return buckets;
  }, [sorted, minYear, maxYear]);

  const maxCount = useMemo(() => {
    return Math.max(1, ...decadeBuckets.map(b => b.count));
  }, [decadeBuckets]);

  const svgPath = useMemo(() => {
    if (decadeBuckets.length === 0) return '';
    const points = decadeBuckets.map(b => {
      const x = ((b.decade + 5 - minYear) / range) * 100;
      const y = 80 - (b.count / maxCount) * 70;
      return `${x} ${y}`;
    });
    return `M 0 80 L ${points.map(p => `${p}`).join(' L ')} L 100 80 Z`;
  }, [decadeBuckets, minYear, range, maxCount]);

  return (
    <div className="glass-panel glass-panel-rounded animate-fade-in" style={{
      position: 'absolute',
      bottom: '30px',
      left: '340px',
      right: selectedApparition ? '420px' : '30px',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '16px 24px',
      zIndex: 10,
      boxSizing: 'border-box',
      transition: 'all 0.3s ease'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', position: 'relative' }}>
        <h3 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1.5px', opacity: 0.8, margin: 0, fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BarChart2 size={16} color="var(--accent-color)" /> Timeline
        </h3>

        {hoveredDecade && (
          <div style={{
            position: 'absolute',
            top: '-35px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid #fbbf24',
            padding: '4px 12px',
            borderRadius: '8px',
            fontSize: '13px',
            color: '#f1f5f9',
            whiteSpace: 'nowrap',
            zIndex: 100,
            boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
            pointerEvents: 'none'
          }}>
            <strong style={{ color: '#fbbf24' }}>{hoveredDecade.decade}s:</strong> {hoveredDecade.count} Apparition{hoveredDecade.count > 1 ? 's' : ''}
          </div>
        )}

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: '#f1f5f9',
            padding: '4px 12px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
        >
          {isExpanded ? <>Collapse Graph <ChevronDown size={14} /></> : <>Expand 2D Graph <ChevronUp size={14} /></>}
        </button>
      </div>

      {isExpanded && (
        <div style={{ width: '100%', height: '80px', marginBottom: '16px', position: 'relative' }}>
          <svg viewBox="0 0 100 80" preserveAspectRatio="none" style={{ width: '100%', height: '80px', overflow: 'visible' }}>
            <defs>
              <linearGradient id="graphGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path d={svgPath} fill="url(#graphGrad)" opacity="0.5" stroke="#fbbf24" strokeWidth="0.8" />
            {decadeBuckets.filter(b => b.count > 0).map(b => {
              const x = ((b.decade + 5 - minYear) / range) * 100;
              const y = 80 - (b.count / maxCount) * 70;
              return (
                <circle
                  key={b.decade}
                  cx={`${x}`}
                  cy={`${y}`}
                  r="2.2"
                  fill="#fbbf24"
                  stroke="#03040b"
                  strokeWidth="0.5"
                  style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                  onMouseEnter={() => setHoveredDecade(b)}
                  onMouseLeave={() => setHoveredDecade(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (b.apps.length > 0) {
                      const topApp = [...b.apps].sort((x, y) => (x.priority || 3) - (y.priority || 3))[0];
                      onSelectApparition(topApp);
                    }
                  }}
                />
              );
            })}
          </svg>
        </div>
      )}
      
      <div style={{ position: 'relative', height: '30px', width: '100%' }}>
        {/* Main Line */}
        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '2px', background: 'rgba(255,255,255,0.15)', transform: 'translateY(-50%)' }}></div>
        
        {/* Century Ticks */}
        {Array.from({ length: Math.ceil(range / 100) + 1 }).map((_, i) => {
          const year = Math.floor(minYear / 100) * 100 + i * 100;
          if (year < minYear || year > maxYear) return null;
          const leftPercent = ((year - minYear) / range) * 100;
          return (
            <div key={`tick-${year}`} style={{
              position: 'absolute',
              left: `${leftPercent}%`,
              top: '50%',
              transform: 'translate(-50%, -50%)',
              height: '10px',
              width: '1px',
              background: 'rgba(255,255,255,0.3)',
              pointerEvents: 'none'
            }}>
              <div style={{ position: 'absolute', top: '12px', left: '50%', transform: 'translateX(-50%)', fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>
                {year}
              </div>
            </div>
          );
        })}

        {/* Markers */}
        {sorted.map(app => {
          const leftPercent = ((app.year - minYear) / range) * 100;
          const isSelected = selectedApparition?.id === app.id;
          
          return (
            <div 
              key={app.id}
              onClick={(e) => {
                e.stopPropagation();
                onSelectApparition(app);
              }}
              style={{
                position: 'absolute',
                left: `${leftPercent}%`,
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: isSelected ? '18px' : '12px',
                height: isSelected ? '18px' : '12px',
                borderRadius: '50%',
                background: isSelected ? 'var(--gold-accent)' : 'var(--accent-color)',
                border: '2px solid var(--bg-color)',
                cursor: 'pointer',
                pointerEvents: 'auto',
                transition: 'all 0.2s ease',
                boxShadow: isSelected ? '0 0 15px var(--gold-accent)' : '0 0 8px var(--accent-glow)',
                zIndex: isSelected ? 3 : 2
              }}
              title={`${app.title} (${app.year})`}
            >
              {isSelected && (
                <div style={{
                  position: 'absolute',
                  bottom: '24px',
                  left: leftPercent > 78 ? 'auto' : leftPercent < 22 ? '0' : '50%',
                  right: leftPercent > 78 ? '0' : 'auto',
                  transform: leftPercent > 78 ? 'none' : leftPercent < 22 ? 'none' : 'translateX(-50%)',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: 'var(--gold-accent)',
                  whiteSpace: 'nowrap',
                  background: 'rgba(0,0,0,0.6)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  border: '1px solid rgba(251, 191, 36, 0.3)',
                  backdropFilter: 'blur(4px)',
                  pointerEvents: 'none'
                }}>
                  {app.year}: {app.title}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TimelineOverlay;
