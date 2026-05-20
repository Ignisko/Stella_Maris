import React, { useMemo, useState } from 'react';
import type { Apparition } from '../data/apparitions';
import { MapPin, Calendar, Info, X, ExternalLink, Award, BookOpen, CheckCircle2, Sparkles, HeartHandshake, XCircle, Copy, Check } from 'lucide-react';
import { getApparitionStatusCategory, getStatusColor, hexToRgb, getSingleStatusCategory, STATUS_COLORS } from '../utils/colors';
import { t } from '../utils/i18n';
import type { Language } from '../utils/i18n';

interface SidebarProps {
  apparition: Apparition | null;
  onClose: () => void;
  allActiveApparitions?: Apparition[];
  onSelectApparition?: (apparition: Apparition) => void;
  lang: Language;
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
    case "Dismissed":
    default:
      return <XCircle size={20} color={color} style={{ flexShrink: 0 }} />;
  }
};

const Sidebar: React.FC<SidebarProps> = ({ apparition, onClose, allActiveApparitions = [], onSelectApparition, lang }) => {
  const [copied, setCopied] = useState(false);

  const clusteredApps = useMemo(() => {
    if (!apparition || !allActiveApparitions.length) return [];
    const threshold = 0.02; // Close distance to group only within same city/shrine
    return allActiveApparitions.filter(a => 
      Math.abs(a.lat - apparition.lat) < threshold && Math.abs(a.lng - apparition.lng) < threshold
    ).sort((a, b) => a.year - b.year);
  }, [apparition, allActiveApparitions]);

  if (!apparition) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(apparition.title);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const querySlug = apparition.location.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const sourceLink = apparition.sourceUrl || `https://www.miraclehunter.com/marian_apparitions/approved_apparitions/${querySlug}/index.html`;

  return (
    <div className="glass-panel glass-panel-rounded animate-slide-in-right selectable" style={{
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
          <h2 style={{ fontSize: '26px', fontWeight: 600, margin: 0, color: 'var(--gold-accent)', lineHeight: 1.2, userSelect: 'text', WebkitUserSelect: 'text' }}>
            {apparition.title}
          </h2>
          <button
            onClick={handleCopy}
            title="Copy Title"
            style={{
              background: 'transparent',
              border: 'none',
              color: copied ? '#10b981' : 'var(--text-color)',
              cursor: 'pointer',
              padding: '6px',
              opacity: copied ? 1 : 0.6,
              transition: 'all 0.2s',
              display: 'inline-flex',
              alignItems: 'center',
              borderRadius: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
            }}
            onMouseOver={(e) => { if (!copied) { e.currentTarget.style.opacity = '1'; e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)'; } }}
            onMouseOut={(e) => { if (!copied) { e.currentTarget.style.opacity = '0.6'; e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'; } }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
        </div>
        <button 
          onClick={onClose}
          style={{ background: 'transparent', border: 'none', color: 'var(--text-color)', cursor: 'pointer', padding: '4px', opacity: 0.7, transition: 'opacity 0.2s', flexShrink: 0 }}
          onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
          onMouseOut={(e) => e.currentTarget.style.opacity = '0.7'}
        >
          <X size={24} />
        </button>
      </div>

      {clusteredApps.length > 1 && onSelectApparition && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: 'rgba(255, 255, 255, 0.03)', padding: '12px 14px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
          <span style={{ fontSize: '13px', opacity: 0.7, fontWeight: 500 }}>{t('otherApparitions', lang, { count: clusteredApps.length })}:</span>
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
                  title={app.title}
                >
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: color, flexShrink: 0 }} />
                  <span>{app.year} • {app.title.replace('Our Lady of ', '').replace('The Virgin Mary in ', '')}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px' }}>
          <MapPin size={18} color="var(--accent-color)" />
          <span style={{ userSelect: 'text', WebkitUserSelect: 'text' }}>{apparition.location}, {apparition.country}</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px' }}>
          <Calendar size={18} color="var(--accent-color)" />
          <span style={{ userSelect: 'text', WebkitUserSelect: 'text' }}>{apparition.year}</span>
        </div>

        {apparition.approvalStatus.split(/[/,;]/).map(s => s.trim()).filter(Boolean).map((part, index) => {
          const cat = getSingleStatusCategory(part);
          const color = STATUS_COLORS[cat] || "#94a3b8";
          const rgb = hexToRgb(color);
          return (
            <div key={index} style={{ 
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
              <span style={{ color: color, fontWeight: 700, letterSpacing: '0.3px', lineHeight: 1.3, userSelect: 'text', WebkitUserSelect: 'text' }}>
                {t(cat as keyof typeof import('../utils/i18n').translations['en'], lang)}
              </span>
            </div>
          );
        })}
      </div>

      <div style={{ height: '1px', background: 'var(--glass-border)', margin: '4px 0' }}></div>

      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', color: 'var(--accent-color)' }}>
          <Info size={18} />
          <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>{t('description', lang)}</h3>
        </div>
        <p style={{ fontSize: '15px', lineHeight: 1.65, opacity: 0.9, letterSpacing: '0.2px', margin: 0, userSelect: 'text', WebkitUserSelect: 'text' }}>
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
            <span>{t('viewSource', lang)}</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
