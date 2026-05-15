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
      width: '80%',
      maxWidth: '800px',
      padding: '24px 40px',
      zIndex: 10,
    }}>
      <h3 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1.5px', opacity: 0.6, marginBottom: '24px', textAlign: 'center', fontWeight: 600 }}>
        Timeline of Apparitions
      </h3>
      
      <div style={{ position: 'relative', height: '30px', width: '100%' }}>
        {/* Main Line */}
        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '2px', background: 'rgba(255,255,255,0.15)', transform: 'translateY(-50%)' }}></div>
        
        {/* Markers */}
        {sorted.map(app => {
          const leftPercent = ((app.year - minYear) / range) * 100;
          const isSelected = selectedApparition?.id === app.id;
          
          return (
            <div 
              key={app.id}
              onClick={() => onSelectApparition(app)}
              style={{
                position: 'absolute',
                left: `${leftPercent}%`,
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: isSelected ? '18px' : '14px',
                height: isSelected ? '18px' : '14px',
                borderRadius: '50%',
                background: isSelected ? 'var(--gold-accent)' : 'var(--accent-color)',
                border: '2px solid var(--bg-color)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: isSelected ? '0 0 15px var(--gold-accent)' : '0 0 8px var(--accent-glow)',
                zIndex: isSelected ? 2 : 1
              }}
              title={`${app.title} (${app.year})`}
            >
              <div style={{
                position: 'absolute',
                bottom: '24px',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '13px',
                fontWeight: isSelected ? 700 : 500,
                color: isSelected ? 'var(--gold-accent)' : 'var(--text-color)',
                opacity: isSelected ? 1 : 0.6,
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
              }}>
                {app.year}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TimelineOverlay;
