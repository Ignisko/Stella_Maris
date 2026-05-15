import React from 'react';
import type { Apparition } from '../data/apparitions';

interface TimelineOverlayProps {
  apparitions: Apparition[];
  selectedApparition: Apparition | null;
  onSelectApparition: (apparition: Apparition) => void;
}

const TimelineOverlay: React.FC<TimelineOverlayProps> = ({ apparitions, selectedApparition, onSelectApparition }) => {
  // Sort apparitions by year
  const sorted = [...apparitions].sort((a, b) => a.year - b.year);
  const minYear = sorted.length > 0 ? sorted[0].year - 50 : 1500;
  const maxYear = sorted.length > 0 ? sorted[sorted.length - 1].year + 50 : 2000;
  const range = maxYear - minYear;

  return (
    <div className="glass-panel glass-panel-rounded animate-fade-in" style={{
      position: 'absolute',
      bottom: '30px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: 'calc(100% - 180px)',
      maxWidth: '820px',
      padding: '24px 30px',
      zIndex: 10,
      boxSizing: 'border-box'
    }}>
      <h3 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1.5px', opacity: 0.6, marginBottom: '24px', textAlign: 'center', fontWeight: 600 }}>
        Timeline of Apparitions
      </h3>
      
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
