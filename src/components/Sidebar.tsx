import React, { useMemo, useState, useEffect } from 'react';
import type { Apparition } from '../data/apparitions';
import { MapPin, Calendar, Info, X, ArrowUpRight, Medal, BookOpen, CheckCircle, Sparkle, Handshake, XCircle, Copy, Check } from '@phosphor-icons/react';
import { getStatusColor, getSingleStatusCategory, getApparitionStatusCategory, STATUS_COLORS } from '../utils/colors';
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
  projectId?: 'mary' | 'eucharist';
}

const getCategoryIcon = (category: string, color: string) => {
  switch (category) {
    case "Vatican approved":
      return <Medal size={20} color={color} weight="fill" style={{ flexShrink: 0 }} />;
    case "Traditionally approved":
      return <BookOpen size={20} color={color} weight="fill" style={{ flexShrink: 0 }} />;
    case "Bishop approved":
      return <CheckCircle size={20} color={color} weight="fill" style={{ flexShrink: 0 }} />;
    case "Coptic approved":
      return <Sparkle size={20} color={color} weight="fill" style={{ flexShrink: 0 }} />;
    case "Approved for faith expression":
      return <Handshake size={20} color={color} weight="fill" style={{ flexShrink: 0 }} />;
    case "Apparitions to saints":
      return <Sparkle size={20} color={color} weight="fill" style={{ flexShrink: 0 }} />;
    case "Dismissed":
    default:
      return <XCircle size={20} color={color} weight="fill" style={{ flexShrink: 0 }} />;
  }
};

const Sidebar: React.FC<SidebarProps> = ({ 
  apparition, 
  isVisible = true, 
  onClose, 
  allActiveApparitions = [], 
  onSelectApparition, 
  lang,
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
    <div id="apparition-sidebar" className="glass-panel selectable" style={{
      position: 'absolute',
      top: '0',
      bottom: '0',
      right: isVisible ? '0' : '-100%',
      width: '400px',
      maxWidth: '100vw',
      maxHeight: '100vh',
      overflowY: 'auto',
      border: 'none',
      zIndex: 110,
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      transition: 'right 0.4s ease',
      pointerEvents: isVisible ? 'auto' : 'none'
    }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', flex: 1 }}>
          <h2 style={{ 
            fontFamily: 'var(--font-sans)',
            fontSize: '18px', 
            fontWeight: 600, 
            margin: 0, 
            color: 'var(--text-color)',
            letterSpacing: '-0.5px',
            lineHeight: 1.2,
            userSelect: 'text', 
            WebkitUserSelect: 'text' 
          }}>
            {displayApp.title} {(displayApp.approvalStatus === 'Dismissed' || displayApp.approvalStatus === 'Unapproved apparitions') && '⚠️'}
          </h2>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handleCopy}
            title="Copy Title"
            style={{
              background: 'transparent',
              border: '1px solid var(--glass-border)',
              color: copied ? 'var(--text-color)' : 'var(--text-color)',
              cursor: 'pointer',
              padding: '8px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'var(--text-color)'; e.currentTarget.style.color = 'var(--bg-color)'; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-color)'; }}
          >
            {copied ? <Check size={16} weight="bold" /> : <Copy size={16} weight="regular" />}
          </button>
          <button 
            id="sidebar-close-button"
            onClick={onClose}
            style={{ 
              background: 'transparent', 
              border: '1px solid var(--glass-border)', 
              color: 'var(--text-color)', 
              cursor: 'pointer', 
              padding: '8px', 
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s' 
            }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'var(--text-color)'; e.currentTarget.style.color = 'var(--bg-color)'; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-color)'; }}
          >
            <X size={16} weight="regular" />
          </button>
        </div>
      </div>

      {(displayApp.approvalStatus === 'Dismissed' || displayApp.approvalStatus === 'Unapproved apparitions') && (
        <div style={{
          padding: '16px',
          backgroundColor: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          borderRadius: '12px',
          color: '#fca5a5',
          fontSize: '14px',
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-start',
          boxShadow: '0 4px 20px rgba(239, 68, 68, 0.1)'
        }}>
          <div style={{ fontSize: '20px' }}>⚠️</div>
          <div>
            <strong style={{ display: 'block', marginBottom: '4px' }}>{t('dismissedWarningTitle', lang)}</strong>
            <span style={{ opacity: 0.9 }}>{t('dismissedWarningText', lang)}</span>
          </div>
        </div>
      )}

      {clusteredApps.length > 1 && onSelectApparition && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px 0', borderTop: '1px solid var(--glass-border)' }}>
          <span style={{ fontSize: '12px', opacity: 0.6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('otherApparitions', lang, { count: clusteredApps.length })}</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {clusteredApps.map(app => {
              const isCurrent = app.id === displayApp.id;
              const color = getStatusColor(app.approvalStatus);
              return (
                <button
                  key={app.id}
                  onClick={() => onSelectApparition(app)}
                  style={{
                    padding: '8px 12px',
                    background: isCurrent ? 'var(--text-color)' : 'transparent',
                    border: '1px solid var(--glass-border)',
                    color: isCurrent ? 'var(--bg-color)' : 'var(--text-color)',
                    fontSize: '12px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s'
                  }}
                  title={app.title}
                >
                  <span style={{ width: '6px', height: '6px', backgroundColor: isCurrent ? 'var(--bg-color)' : color, flexShrink: 0 }} />
                  <span>{app.year}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px 0', borderTop: '1px solid var(--glass-border)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '14px', fontWeight: 500 }}>
          <MapPin size={16} weight="regular" style={{ marginTop: '2px', opacity: 0.6 }} />
          <span style={{ userSelect: 'text', WebkitUserSelect: 'text', letterSpacing: '0.02em' }}>{displayApp.location}, {displayApp.country}</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', fontWeight: 500 }}>
          <Calendar size={16} weight="regular" style={{ opacity: 0.6 }} />
          <span style={{ userSelect: 'text', WebkitUserSelect: 'text', letterSpacing: '0.02em' }}>{displayApp.year}</span>
        </div>

        {displayApp.approvalStatus.split(/[/,;]/).map(s => s.trim()).filter(Boolean).map((part, index) => {
          const cat = getSingleStatusCategory(part);
          const color = STATUS_COLORS[cat] || "#94a3b8";
          return (
            <div key={index} style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px', 
              fontSize: '12px', 
              marginTop: '8px', 
              background: `${color}15`,
              border: `1px solid ${color}40`,
              boxShadow: `0 0 10px ${color}30, inset 0 0 5px ${color}20`,
              padding: '6px 12px', 
              borderRadius: '20px',
              fontWeight: 500
            }}>
              {getCategoryIcon(cat, color)}
              <span style={{ color: color, fontWeight: 600, userSelect: 'text', WebkitUserSelect: 'text' }}>
                {t(cat as keyof typeof import('../utils/i18n').translations['en'], lang)}
              </span>
            </div>
          );
        })}
      </div>

      <div style={{ height: '1px', background: 'var(--glass-border)', margin: '4px 0' }}></div>

      <div style={{ padding: '16px 0', borderTop: '1px solid var(--glass-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <Info size={16} weight="regular" style={{ opacity: 0.6 }} />
          <h3 style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0, opacity: 0.6 }}>{t('description', lang)}</h3>
        </div>
        <p style={{ 
          fontFamily: 'var(--font-sans)',
          fontSize: '15px', 
          lineHeight: 1.6, 
          color: 'var(--text-color)', 
          margin: 0, 
          userSelect: 'text', 
          WebkitUserSelect: 'text' 
        }}>
          {displayApp.description}
        </p>
        
        <div style={{ marginTop: '32px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
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
                fontSize: '12px',
                fontWeight: 500,
                color: 'var(--text-color)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                textDecoration: 'none',
                background: 'transparent',
                border: '1px solid var(--glass-border)',
                padding: '12px 16px',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'var(--text-color)';
                e.currentTarget.style.color = 'var(--bg-color)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--text-color)';
              }}
            >
              <span>{src.label}</span>
              <ArrowUpRight size={14} weight="bold" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
