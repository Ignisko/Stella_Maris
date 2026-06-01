import React, { useMemo, useState, useEffect } from 'react';
import type { Apparition } from '../data/apparitions';
import { MapPin, Calendar, Info, X, ExternalLink, Award, BookOpen, CheckCircle2, Sparkles, HeartHandshake, XCircle, Copy, Check } from 'lucide-react';
import { getStatusColor, hexToRgb, getSingleStatusCategory, getApparitionStatusCategory, STATUS_COLORS } from '../utils/colors';
import { t } from '../utils/i18n';
import type { Language } from '../utils/i18n';

interface SidebarProps {
  apparition: Apparition | null;
  isVisible?: boolean;
  onClose: () => void;
  allActiveApparitions?: Apparition[];
  onSelectApparition?: (apparition: Apparition) => void;
  lang: Language;
  isTimelineOpen?: boolean;
  isCinemaMode?: boolean;
  projectId?: 'mary' | 'eucharist';
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

const Sidebar: React.FC<SidebarProps> = ({ 
  apparition, 
  isVisible = true, 
  onClose, 
  allActiveApparitions = [], 
  onSelectApparition, 
  lang,
  isCinemaMode = false,
  projectId = 'mary'
}) => {
  const [copied, setCopied] = useState(false);
  const [localApparition, setLocalApparition] = useState<Apparition | null>(apparition);

  useEffect(() => {
    if (apparition) {
      if (isVisible || !localApparition) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLocalApparition(apparition);
      }
    } else {
      setLocalApparition(null);
    }
  }, [apparition, isVisible, localApparition]);

  const displayApp = localApparition;

  const clusteredApps = useMemo(() => {
    if (!displayApp || !allActiveApparitions.length) return [];
    const threshold = 0.02; // Close distance to group only within same city/shrine
    return allActiveApparitions.filter(a => 
      Math.abs(a.lat - displayApp.lat) < threshold && Math.abs(a.lng - displayApp.lng) < threshold
    ).sort((a, b) => a.year - b.year);
  }, [displayApp, allActiveApparitions]);

  const sources = useMemo(() => {
    if (!displayApp) return [];
    const raw = displayApp.sourceUrl;
    if (!raw) {
      let fallbackUrl: string;
      if (projectId === 'eucharist') {
        fallbackUrl = "https://www.miracolieucaristici.org/";
      } else {
        if (displayApp.year < 1000) {
          fallbackUrl = "https://www.miraclehunter.com/marian_apparitions/approved_apparitions/apparitions_0040-0999.html";
        } else if (displayApp.year < 1500) {
          fallbackUrl = "https://www.miraclehunter.com/marian_apparitions/approved_apparitions/apparitions_1000-1499.html";
        } else if (displayApp.year < 1800) {
          fallbackUrl = "https://www.miraclehunter.com/marian_apparitions/approved_apparitions/apparitions_1500-1799.html";
        } else if (displayApp.year < 1900) {
          fallbackUrl = "https://www.miraclehunter.com/marian_apparitions/approved_apparitions/apparitions_1800-1899.html";
        } else {
          // Post-1900 categories
          const cat = getApparitionStatusCategory(displayApp.approvalStatus);
          if (cat === "Vatican approved") {
            fallbackUrl = "https://www.miraclehunter.com/marian_apparitions/approved_apparitions/vatican.html";
          } else if (cat === "Bishop approved") {
            fallbackUrl = "https://www.miraclehunter.com/marian_apparitions/approved_apparitions/bishop.html";
          } else if (cat === "Coptic approved") {
            fallbackUrl = "https://www.miraclehunter.com/marian_apparitions/approved_apparitions/coptic.html";
          } else if (cat === "Approved for faith expression") {
            fallbackUrl = "https://www.miraclehunter.com/marian_apparitions/approved_apparitions/faith-expression.html";
          } else if (cat === "Traditionally approved") {
            fallbackUrl = "https://www.miraclehunter.com/marian_apparitions/approved_apparitions/traditional.html";
          } else {
            if (displayApp.year < 2000) {
              fallbackUrl = "https://www.miraclehunter.com/marian_apparitions/approved_apparitions/apparitions_1900-1999.html";
            } else {
              fallbackUrl = "https://www.miraclehunter.com/marian_apparitions/approved_apparitions/apparitions_2000-present.html";
            }
          }
        }
      }
      return [{
        url: fallbackUrl,
        label: t('viewSource', lang)
      }];
    }
    
    return raw.split(';').map(urlStr => {
      const url = urlStr.trim();
      let label = t('viewSource', lang);
      
      if (url.includes('miraclehunter.com')) {
        label = t('viewSource', lang);
      } else if (url.includes('bernardyni.pl') || url.includes('lezajsk')) {
        label = url.includes('transmisja') ? t('liveStream', lang) : 'Sanktuarium Leżajsk';
      } else if (url.includes('youtube.com') || url.includes('youtu.be')) {
        label = (url.includes('ESNa1vdHcYY') || url.includes('GENH9mWlvb4') || url.includes('/live')) ? t('liveStream', lang) : 'Video';
      } else {
        label = t('viewSource', lang);
      }
      return { url, label };
    });
  }, [displayApp, lang, projectId]);

  if (!displayApp) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(displayApp.title);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="apparition-sidebar" className="glass-panel glass-panel-rounded selectable" style={{
      position: 'absolute',
      top: '20px',
      bottom: 'auto',
      maxHeight: isCinemaMode ? 'calc(100vh - 115px)' : 'calc(100vh - 40px)',
      right: '20px',
      width: '380px',
      overflowY: 'auto',
      zIndex: 110,
      padding: '24px 28px',
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      backdropFilter: 'blur(25px)',
      boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      transform: isVisible ? 'translateX(0)' : 'translateX(calc(100% + 40px))',
      opacity: isVisible ? 1 : 0,
      transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), max-height 0.3s ease-in-out, top 0.3s ease-in-out',
      pointerEvents: isVisible ? 'auto' : 'none'
    }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
          <h2 style={{ fontSize: '26px', fontWeight: 600, margin: 0, color: 'var(--gold-accent)', lineHeight: 1.2, userSelect: 'text', WebkitUserSelect: 'text' }}>
            {displayApp.title} {displayApp.approvalStatus === 'Dismissed' && '⚠️'}
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
          id="sidebar-close-button"
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
              const isCurrent = app.id === displayApp.id;
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
                  <span>{app.year} • {app.title} {app.approvalStatus === 'Dismissed' && '⚠️'}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px' }}>
          <MapPin size={18} color="var(--accent-color)" />
          <span style={{ userSelect: 'text', WebkitUserSelect: 'text' }}>{displayApp.location}, {displayApp.country}</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px' }}>
          <Calendar size={18} color="var(--accent-color)" />
          <span style={{ userSelect: 'text', WebkitUserSelect: 'text' }}>{displayApp.year}</span>
        </div>

        {displayApp.approvalStatus.split(/[/,;]/).map(s => s.trim()).filter(Boolean).map((part, index) => {
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
          {displayApp.description}
        </p>
        
        <div style={{ marginTop: '18px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {sources.map((src, i) => (
            <a
              key={i}
              href={src.url}
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
              <span>{src.label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
