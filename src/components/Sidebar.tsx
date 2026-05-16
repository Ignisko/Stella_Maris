import React, { useMemo } from 'react';
import type { Apparition } from '../data/apparitions';
import { MapPin, Calendar, Info, ShieldCheck, X, ExternalLink } from 'lucide-react';
import { getApparitionStatusCategory, getStatusColor, hexToRgb } from '../utils/colors';

interface SidebarProps {
  apparition: Apparition | null;
  onClose: () => void;
  allActiveApparitions?: Apparition[];
  onSelectApparition?: (apparition: Apparition) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ apparition, onClose, allActiveApparitions = [], onSelectApparition }) => {
  if (!apparition) return null;

  const clusteredApps = useMemo(() => {
    if (!apparition || !allActiveApparitions.length) return [];
    const threshold = 0.05; // ~5km radius
    return allActiveApparitions.filter(a => 
      Math.abs(a.lat - apparition.lat) < threshold && Math.abs(a.lng - apparition.lng) < threshold
    ).sort((a, b) => a.year - b.year);
  }, [apparition, allActiveApparitions]);

  const querySlug = apparition.location.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const sourceLink = apparition.sourceUrl || `https://www.miraclehunter.com/marian_apparitions/approved_apparitions/${querySlug}/index.html`;

  return (
    <div className="glass-panel glass-panel-rounded animate-slide-in-right" style={{
      position: 'absolute',
      top: '80px',
      right: '20px',
      width: '380px',
      maxHeight: 'calc(100vh - 100px)',
      overflowY: 'auto',
      zIndex: 10,
      padding: '28px',
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      backdropFilter: 'blur(25px)',
      boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h2 style={{ fontSize: '26px', fontWeight: 600, margin: 0, color: 'var(--gold-accent)', lineHeight: 1.2 }}>
          {apparition.title}
        </h2>
        <button 
          onClick={onClose}
          style={{ background: 'transparent', border: 'none', color: 'var(--text-color)', cursor: 'pointer', padding: '4px', opacity: 0.7, transition: 'opacity 0.2s' }}
          onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
          onMouseOut={(e) => e.currentTarget.style.opacity = '0.7'}
        >
          <X size={24} />
        </button>
      </div>

      {clusteredApps.length > 1 && onSelectApparition && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
          <span style={{ fontSize: '13px', opacity: 0.7, fontWeight: 500 }}>Apparitions at this location ({clusteredApps.length}):</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {clusteredApps.map(app => {
              const isCurrent = app.id === apparition.id;
              const color = getStatusColor(app.approvalStatus);
              return (
                <button
                  key={app.id}
                  onClick={() => onSelectApparition(app)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    background: isCurrent ? `rgba(${hexToRgb(color)}, 0.3)` : 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${isCurrent ? color : 'rgba(255, 255, 255, 0.1)'}`,
                    color: isCurrent ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
                    fontSize: '13px',
                    fontWeight: isCurrent ? 700 : 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s'
                  }}
                >
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: color }} />
                  {app.year}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '16px' }}>
          <MapPin size={20} color="var(--accent-color)" />
          <span>{apparition.location}, {apparition.country}</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '16px' }}>
          <Calendar size={20} color="var(--accent-color)" />
          <span>{apparition.year}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '15px', marginTop: '6px', background: 'rgba(16, 185, 129, 0.1)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
          <ShieldCheck size={20} color="#34d399" style={{ flexShrink: 0 }} />
          <span style={{ color: '#6ee7b7', fontWeight: 500, lineHeight: 1.4 }}>
            {getApparitionStatusCategory(apparition.approvalStatus) === "Approved for faith expression" ? "Faith expression" : getApparitionStatusCategory(apparition.approvalStatus)}
          </span>
        </div>
      </div>

      <div style={{ height: '1px', background: 'var(--glass-border)', margin: '8px 0' }}></div>

      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', color: 'var(--accent-color)' }}>
          <Info size={20} />
          <h3 style={{ fontSize: '18px', fontWeight: 500, margin: 0 }}>Description</h3>
        </div>
        <p style={{ fontSize: '16px', lineHeight: 1.7, opacity: 0.9, letterSpacing: '0.2px' }}>
          {apparition.description}
        </p>
        
        <div style={{ marginTop: '24px' }}>
          <a
            href={sourceLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '14px',
              fontWeight: 600,
              color: '#38bdf8',
              textDecoration: 'none',
              background: 'rgba(56, 189, 248, 0.12)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              padding: '10px 18px',
              borderRadius: '10px',
              transition: 'all 0.2s',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(56, 189, 248, 0.22)';
              e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.5)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(56, 189, 248, 0.12)';
              e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.3)';
              e.currentTarget.style.transform = 'none';
            }}
          >
            <ExternalLink size={16} />
            <span>View source</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
