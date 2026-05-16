import React from 'react';
import type { Apparition } from '../data/apparitions';
import { MapPin, Calendar, Info, ShieldCheck, X, ExternalLink } from 'lucide-react';

interface SidebarProps {
  apparition: Apparition | null;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ apparition, onClose }) => {
  if (!apparition) return null;

  const sourceLink = apparition.sourceUrl || `https://www.google.com/search?q=${encodeURIComponent(`Catholic Marian apparition "${apparition.title}" ${apparition.location} ${apparition.country}`)}`;

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
          <span style={{ color: '#6ee7b7', fontWeight: 500, lineHeight: 1.4 }}>{apparition.approvalStatus}</span>
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
            <span>View Historical Documentation / Source</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
