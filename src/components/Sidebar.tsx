import React from 'react';
import type { Apparition } from '../data/apparitions';
import { MapPin, Calendar, Info, ShieldCheck, X } from 'lucide-react';

interface SidebarProps {
  apparition: Apparition | null;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ apparition, onClose }) => {
  if (!apparition) return null;

  return (
    <div className="glass-panel glass-panel-rounded animate-slide-in-right" style={{
      position: 'absolute',
      top: '20px',
      right: '20px',
      width: '380px',
      maxHeight: 'calc(100vh - 40px)',
      overflowY: 'auto',
      zIndex: 10,
      padding: '28px',
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
      </div>
    </div>
  );
};

export default Sidebar;
