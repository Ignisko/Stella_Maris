import React, { useMemo } from 'react';
import type { Apparition } from '../data/apparitions';
import { MapPin, Calendar, Info, X, ExternalLink, Award, BookOpen, CheckCircle2, Sparkles, HeartHandshake, XCircle } from 'lucide-react';
import { getApparitionStatusCategory, getStatusColor, hexToRgb } from '../utils/colors';

interface SidebarProps {
  apparition: Apparition | null;
  onClose: () => void;
  allActiveApparitions?: Apparition[];
  onSelectApparition?: (apparition: Apparition) => void;
}

const getCategoryIcon = (category: string, color: string) => {
  switch (category) {
    case "Vatican approved":
      return <Award size={20} color={color} style={{ flexShrink: 0 }} />;
    case "Traditionally approved":
      return <BookOpen size={20} color={color} style={{ flexShrink: 0 }} />;
    case "Bishop approved":
      return <CheckCircle2 size={20} color={color} style={{ flexShrink: 0 }} />;
    case "Coptic approved":
      return <Sparkles size={20} color={color} style={{ flexShrink: 0 }} />;
    case "Approved for faith expression":
      return <HeartHandshake size={20} color={color} style={{ flexShrink: 0 }} />;
    case "Apparitions to saints":
      return <Sparkles size={20} color={color} style={{ flexShrink: 0 }} />;
    default:
      return <XCircle size={20} color={color} style={{ flexShrink: 0 }} />;
  }
};

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
      padding: '24px 28px',
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      backdropFilter: 'blur(25px)',
      boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: 'rgba(255, 255, 255, 0.03)', padding: '12px 14px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px' }}>
          <MapPin size={18} color="var(--accent-color)" />
          <span>{apparition.location}, {apparition.country}</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px' }}>
          <Calendar size={18} color="var(--accent-color)" />
          <span>{apparition.year}</span>
        </div>

        {(() => {
          const cat = getApparitionStatusCategory(apparition.approvalStatus);
          const color = getStatusColor(apparition.approvalStatus);
          const rgb = hexToRgb(color);
          return (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              fontSize: '15px', 
              marginTop: '4px', 
              background: `rgba(${rgb}, 0.15)`, 
              padding: '10px 14px', 
              borderRadius: '8px', 
              border: `1px solid rgba(${rgb}, 0.4)`,
              boxShadow: `0 0 15px rgba(${rgb}, 0.15)`
            }}>
              {getCategoryIcon(cat, color)}
              <span style={{ color: color, fontWeight: 700, letterSpacing: '0.3px', lineHeight: 1.3 }}>
                {cat === "Approved for faith expression" ? "Faith expression" : cat}
              </span>
            </div>
          );
        })()}
      </div>

      <div style={{ height: '1px', background: 'var(--glass-border)', margin: '4px 0' }}></div>

      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', color: 'var(--accent-color)' }}>
          <Info size={18} />
          <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>Description</h3>
        </div>
        <p style={{ fontSize: '15px', lineHeight: 1.65, opacity: 0.9, letterSpacing: '0.2px', margin: 0 }}>
          {apparition.description}
        </p>
        
        <div style={{ marginTop: '18px' }}>
          <a
            href={sourceLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              fontWeight: 600,
              color: '#38bdf8',
              textDecoration: 'none',
              background: 'rgba(56, 189, 248, 0.12)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              padding: '8px 16px',
              borderRadius: '8px',
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
            <ExternalLink size={14} />
            <span>View source</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
