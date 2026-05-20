import React, { useState, useMemo, useEffect } from 'react';
import type { Apparition } from '../data/apparitions';
import { BarChart2, Clock, Play, Pause, ChevronUp, X } from 'lucide-react';
import { getStatusColor, getApparitionStatusCategory, STATUS_COLORS } from '../utils/colors';
import { t } from '../utils/i18n';
import type { Language } from '../utils/i18n';

interface TimelineOverlayProps {
  apparitions: Apparition[];
  selectedApparition: Apparition | null;
  onSelectApparition: (apparition: Apparition) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  lang: Language;
}

const FAMOUS_CALLOUTS: Record<string, { label: string; year: number; modernOffset: number; fullHistoryOffset: number }> = {
  "guadalupe_mexico": { label: "Our Lady of Guadalupe", year: 1531, modernOffset: -1, fullHistoryOffset: 30 },
  "rue-du-bac-1830": { label: "Our Lady of Miraculous Medal", year: 1830, modernOffset: 15, fullHistoryOffset: -1 },
  "rome-ratisbonne-1842": { label: "Our Lady of Zion", year: 1842, modernOffset: 45, fullHistoryOffset: -1 },
  "lourdes-1858": { label: "Our Lady of Lourdes", year: 1858, modernOffset: 80, fullHistoryOffset: 80 },
  "fatima": { label: "Our Lady of Fatima", year: 1917, modernOffset: 65, fullHistoryOffset: 20 },
  "banneux": { label: "Virgin of the Poor", year: 1933, modernOffset: 25, fullHistoryOffset: -1 },
  "kibeho": { label: "Mother of the Word", year: 1981, modernOffset: 50, fullHistoryOffset: -1 }
};

const TimelineOverlay: React.FC<TimelineOverlayProps> = ({
  apparitions, selectedApparition, onSelectApparition, isPlaying, onTogglePlay, isOpen, setIsOpen, lang
}) => {
  const [timeMode, setTimeMode] = useState<'modern' | 'all'>('modern');
  const [hoveredApp, setHoveredApp] = useState<Apparition | null>(null);

  // Auto-open when playing, auto-close when stopped (but only if user didn't manually open)
  useEffect(() => {
    if (isPlaying) setIsOpen(true);
  }, [isPlaying, setIsOpen]);

  const activeApparitions = useMemo(() => {
    if (timeMode === 'modern') return apparitions.filter(a => a.year >= 1800);
    return apparitions;
  }, [apparitions, timeMode]);

  const sorted = useMemo(() => [...activeApparitions].sort((a, b) => a.year - b.year), [activeApparitions]);

  const minYear = useMemo(() => timeMode === 'modern' ? 1800 : (sorted[0]?.year ?? 1500), [sorted, timeMode]);
  const maxYear = useMemo(() => timeMode === 'modern' ? 2025 : (sorted[sorted.length - 1]?.year ?? 2025), [sorted, timeMode]);
  const endY = maxYear;
  const startY = timeMode === 'modern' ? 1800 : minYear;
  const range = endY - startY;

  const bucketSpan = Math.max(1, Math.round(range / 115));
  const numBuckets = Math.ceil(range / bucketSpan);

  const buckets = useMemo(() => {
    if (sorted.length === 0) return [];
    const bList = [];
    for (let i = 0; i <= numBuckets; i++) {
      const yStart = startY + i * bucketSpan;
      const yEnd = yStart + bucketSpan - 1;
      const apps = sorted.filter(app => app.year >= yStart && app.year <= yEnd);
      bList.push({ index: i, startYear: yStart, endYear: yEnd, apps });
    }
    return bList;
  }, [sorted, startY, bucketSpan, numBuckets]);

  const maxCount = useMemo(() => Math.max(1, ...buckets.map(b => b.apps.length)), [buckets]);
  
  const tileHeight = timeMode === 'all'
    ? (maxCount > 25 ? 3.5 : maxCount > 18 ? 4.5 : maxCount > 12 ? 6 : 8)
    : (maxCount > 25 ? 4.5 : maxCount > 18 ? 6.5 : maxCount > 12 ? 9 : 12);
    
  const tileWidth = timeMode === 'all'
    ? (maxCount > 25 ? 5.5 : maxCount > 18 ? 7 : maxCount > 12 ? 8.5 : 10)
    : (maxCount > 25 ? 3 : maxCount > 18 ? 4.5 : maxCount > 12 ? 6 : 7.5);
    
  const tileGap = maxCount > 25 ? 0.75 : maxCount > 18 ? 1 : 1.5;
  
  const tickStep = timeMode === 'modern' ? 20 : 100;

  const callouts = useMemo(() => {
    const list: {
      id: string;
      famous: Apparition;
      label: string;
      originalLeft: number;
      bottomPx: number;
      offset: number;
      left: number;
    }[] = [];

    Object.entries(FAMOUS_CALLOUTS).forEach(([id, callout]) => {
      const famous = sorted.find(app => app.id === id);
      if (!famous) return;

      const offset = timeMode === 'modern' ? callout.modernOffset : callout.fullHistoryOffset;
      if (offset < 0) return;

      const bucket = buckets.find(b => famous.year >= b.startYear && famous.year <= b.endYear);
      const bottomPx = bucket ? bucket.apps.length * (tileHeight + tileGap) : 0;

      const leftPct = ((famous.year - startY) / range) * 100;
      const clampedLeft = Math.max(6, Math.min(94, leftPct));

      const titleForLang = (famous as any).translations?.[lang]?.title || famous.title;

      list.push({
        id: famous.id,
        famous,
        label: titleForLang.split('(')[0].trim(),
        originalLeft: leftPct,
        bottomPx,
        offset,
        left: clampedLeft
      });
    });

    return list;
  }, [sorted, buckets, timeMode, tileHeight, tileGap, startY, range, lang]);

  // Collapsed pill
  if (!isOpen) {
    return (
      <button
        className="glass-panel glass-panel-rounded animate-fade-in"
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: selectedApparition ? '420px' : '20px',
          zIndex: 25,
          pointerEvents: 'auto',
          background: 'linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,41,59,0.95))',
          border: '1px solid rgba(56,189,248,0.35)',
          backdropFilter: 'blur(20px)',
          padding: '14px 28px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          cursor: 'pointer',
          color: 'var(--text-color)',
          fontSize: '15px',
          fontWeight: 700,
          boxShadow: '0 8px 32px rgba(0,0,0,0.6), 0 0 20px rgba(56,189,248,0.1)',
          transition: 'all 0.25s ease',
          letterSpacing: '0.3px'
        }}
        onMouseOver={e => {
          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(56,189,248,0.2), rgba(59,130,246,0.2))';
          e.currentTarget.style.borderColor = 'rgba(56,189,248,0.7)';
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.6), 0 0 30px rgba(56,189,248,0.25)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseOut={e => {
          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,41,59,0.95))';
          e.currentTarget.style.borderColor = 'rgba(56,189,248,0.35)';
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.6), 0 0 20px rgba(56,189,248,0.1)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        <BarChart2 size={20} color="var(--accent-color)" />
        <span>{t('timeline', lang)}</span>
        <ChevronUp size={16} style={{ opacity: 0.7, color: 'var(--accent-color)' }} />
      </button>
    );
  }

  // Expanded panel
  return (
    <div
      className="glass-panel glass-panel-rounded animate-fade-in"
      style={{
        position: 'fixed',
        bottom: '12px',
        left: '20px',
        right: selectedApparition ? '420px' : '30px',
        maxWidth: '1400px',
        backgroundColor: 'rgba(15, 23, 42, 0.98)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 25px 60px rgba(0,0,0,0.85)',
        padding: '10px 20px',
        zIndex: 25,
        boxSizing: 'border-box',
        transition: 'all 0.3s ease',
        pointerEvents: 'auto'
      }}
    >
      {/* Close button in top-right */}
      <button
        onClick={() => { setIsOpen(false); if (isPlaying) onTogglePlay(); }}
        style={{
          position: 'absolute',
          top: '10px',
          right: '20px',
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '16px',
          padding: '6px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: '#e2e8f0',
          cursor: 'pointer',
          fontSize: '12px',
          fontWeight: 600,
          transition: 'all 0.2s',
          zIndex: 35
        }}
        onMouseOver={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.2)'; e.currentTarget.style.color = '#fca5a5'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)'; }}
        onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#e2e8f0'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
      >
        <span>{t('close', lang)}</span>
        <X size={13} />
      </button>

      {/* Top bar: title + controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '8px', paddingRight: '100px' }}>

        {/* Title */}
        <h3 style={{
          fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1.5px',
          opacity: 0.85, margin: 0, fontWeight: 700,
          display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0
        }}>
          <BarChart2 size={16} color="var(--accent-color)" /> {t('timeline', lang)}
        </h3>

        {/* Time mode toggle */}
        <div style={{
          display: 'flex', background: 'rgba(0,0,0,0.4)', padding: '3px',
          borderRadius: '20px', border: '1px solid rgba(255,255,255,0.12)'
        }}>
          {(['modern', 'all'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setTimeMode(mode)}
              style={{
                background: timeMode === mode ? 'var(--accent-color)' : 'transparent',
                color: timeMode === mode ? '#ffffff' : '#94a3b8',
                border: 'none', padding: '4px 14px', borderRadius: '18px',
                fontSize: '11px', fontWeight: 700, cursor: 'pointer',
                transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '5px'
              }}
            >
              <Clock size={11} />
              {mode === 'modern' ? t('modernEra', lang) : t('fullHistory', lang)}
            </button>
          ))}
        </div>

        {/* Play / Pause */}
        <button
          onClick={onTogglePlay}
          style={{
            background: isPlaying ? '#ef4444' : 'var(--accent-color)',
            color: '#fff', border: 'none', padding: '5px 16px',
            borderRadius: '20px', fontSize: '11px', fontWeight: 700,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
            boxShadow: isPlaying ? '0 0 15px rgba(239,68,68,0.8)' : '0 0 15px rgba(56,189,248,0.6)',
            transition: 'all 0.2s'
          }}
        >
          {isPlaying ? <Pause size={12} /> : <Play size={12} />}
          <span>
            {isPlaying
              ? t('playingTimeline', lang, { year: selectedApparition?.year ?? minYear, count: sorted.length })
              : t('playTimeline', lang, { count: sorted.length })}
          </span>
        </button>
      </div>

      {/* Status legend under the controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap',
        marginBottom: '16px',
        paddingTop: '6px',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)'
      }}>
        <span style={{ fontSize: '10px', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700, marginRight: '4px' }}>{t('legend', lang)}</span>
        {Object.entries(STATUS_COLORS).map(([label, color]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', opacity: 0.8, fontWeight: 500 }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: color, boxShadow: `0 0 5px ${color}`, flexShrink: 0 }} />
            <span>{t(label as keyof typeof import('../utils/i18n').translations['en'], lang)}</span>
          </div>
        ))}
      </div>

      {/* Hover tooltip */}
      {hoveredApp && (
        <div style={{
          position: 'absolute', bottom: '100%', left: '50%',
          transform: 'translateX(-50%) translateY(-8px)',
          backgroundColor: 'rgba(15,23,42,0.97)',
          border: `1px solid ${getStatusColor(hoveredApp.approvalStatus)}`,
          padding: '8px 14px', borderRadius: '10px', color: '#fff',
          zIndex: 100, boxShadow: '0 8px 30px rgba(0,0,0,0.7)',
          pointerEvents: 'none', display: 'flex', flexDirection: 'column', gap: '3px', minWidth: '200px'
        }}>
          <div style={{ fontSize: '13px', fontWeight: 700, display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
            <span>{hoveredApp.title}</span>
            <span style={{ color: '#fbbf24' }}>{hoveredApp.year}</span>
          </div>
          <div style={{ fontSize: '11px', opacity: 0.8 }}>{hoveredApp.location}, {hoveredApp.country}</div>
          <div style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: getStatusColor(hoveredApp.approvalStatus) }} />
            <span style={{ fontWeight: 600 }}>
              {t(getApparitionStatusCategory(hoveredApp.approvalStatus) as keyof typeof import('../utils/i18n').translations['en'], lang)}
            </span>
          </div>
        </div>
      )}

      {/* Histogram */}
      <div style={{ position: 'relative', width: '100%', height: '120px' }}>

        {/* Stacked bars */}
        <div style={{
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          width: '100%', height: '100%', position: 'absolute', bottom: 0, left: 0, paddingBottom: '1px'
        }}>
          {buckets.map(b => (
            <div key={b.index} style={{
              flex: 1, minWidth: 0, margin: '0 0.5px',
              display: 'flex', flexDirection: 'column-reverse', alignItems: 'center',
              gap: `${tileGap}px`, height: '100%', justifyContent: 'flex-start', position: 'relative'
            }}>
              {b.apps.map(app => {
                const isFuture = isPlaying && selectedApparition && app.year > selectedApparition.year;
                if (isFuture) return null;
                const isSelected = selectedApparition?.id === app.id;
                const statusColor = getStatusColor(app.approvalStatus);
                return (
                  <div
                    key={app.id}
                    onClick={e => { e.stopPropagation(); onSelectApparition(app); }}
                    onMouseEnter={() => setHoveredApp(app)}
                    onMouseLeave={() => setHoveredApp(null)}
                    style={{
                      width: '100%', maxWidth: `${tileWidth}px`, minWidth: '1.5px',
                      height: `${tileHeight}px`, backgroundColor: statusColor,
                      borderRadius: '1.5px', borderTop: '1px solid rgba(255,255,255,0.3)',
                      border: isSelected ? '2px solid #ffffff' : undefined,
                      boxShadow: isSelected ? `0 0 12px #ffffff, 0 0 8px ${statusColor}` : undefined,
                      cursor: 'pointer', transition: 'all 0.2s ease',
                      opacity: selectedApparition ? (isSelected ? 1 : 0.4) : 0.9,
                      zIndex: isSelected ? 30 : 1,
                      transform: isSelected ? 'scale(1.25)' : undefined,
                      flexShrink: 0
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>

        {/* Callout overlays */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 100 }}>

          {/* Playback laser */}
          {selectedApparition && isPlaying && (() => {
            const idx = buckets.findIndex(b => b.apps.some(a => a.id === selectedApparition.id));
            if (idx === -1) return null;
            const leftPct = ((idx + 0.5) / buckets.length) * 100;
            return (
              <div style={{
                position: 'absolute', left: `${leftPct}%`, bottom: 0, top: '-45px',
                width: '2px', backgroundColor: '#38bdf8',
                boxShadow: '0 0 12px #38bdf8', zIndex: 110,
                transform: 'translateX(-50%)', transition: 'left 0.5s cubic-bezier(0.4,0,0.2,1)',
                pointerEvents: 'none'
              }}>
                <div style={{
                  position: 'absolute', top: 0, left: '50%',
                  transform: 'translate(-50%, -100%)',
                  backgroundColor: '#38bdf8', color: '#0f172a',
                  padding: '2px 8px', borderRadius: '10px',
                  fontSize: '11px', fontWeight: 800, whiteSpace: 'nowrap'
                }}>
                  {selectedApparition.year}: {selectedApparition.title}
                </div>
              </div>
            );
          })()}

          {/* Callout lines (solid gradients diagonal or vertical using SVG) */}
          <svg style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '300px', pointerEvents: 'none', zIndex: 5 }}>
            <defs>
              <linearGradient id="callout-grad" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.75)" />
              </linearGradient>
            </defs>
            {callouts.map(c => {
              let lineX2 = c.left;
              if (c.originalLeft > c.left + 0.5) {
                lineX2 = c.left + Math.min(3.5, c.originalLeft - c.left);
              } else if (c.originalLeft < c.left - 0.5) {
                lineX2 = c.left - Math.min(3.5, c.left - c.originalLeft);
              }
              return (
                <line
                  key={`svg-line-${c.id}`}
                  x1={`${c.originalLeft}%`}
                  y1={300 - c.bottomPx}
                  x2={`${lineX2}%`}
                  y2={300 - (c.bottomPx + c.offset)}
                  stroke="url(#callout-grad)"
                  strokeWidth="1.5"
                />
              );
            })}
          </svg>

          {/* Callout pills */}
          {callouts.map(c => {
            const bottomPx = c.bottomPx + c.offset;
            // Calculate dynamic translateX to prevent edge clipping and connect beautifully
            let translateX = -50;
            if (c.originalLeft > 85) {
              translateX = -50 - Math.min(40, (c.originalLeft - 85) * 4);
            } else if (c.originalLeft < 15) {
              translateX = -50 + Math.min(40, (15 - c.originalLeft) * 4);
            }

            return (
              <div
                key={`pill-${c.id}`}
                onClick={e => { e.stopPropagation(); onSelectApparition(c.famous); }}
                style={{
                  position: 'absolute',
                  left: `${c.left}%`,
                  bottom: `${bottomPx}px`,
                  transform: `translateX(${translateX}%)`,
                  zIndex: 50,
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#fff',
                  whiteSpace: 'nowrap',
                  backgroundColor: 'rgba(15, 23, 42, 0.97)',
                  padding: '4px 10px',
                  borderRadius: '14px',
                  border: '1px solid var(--accent-color)',
                  backdropFilter: 'blur(8px)',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.8)',
                  pointerEvents: 'auto',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={e => { e.currentTarget.style.backgroundColor = 'var(--accent-color)'; }}
                onMouseOut={e => { e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.97)'; }}
              >
                {c.label}
              </div>
            );
          })}
        </div>
      </div>

      {/* Year axis */}
      <div style={{ position: 'relative', height: '26px', width: '100%', marginTop: '2px' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'rgba(255,255,255,0.25)' }} />
        {Array.from({ length: Math.ceil(range / tickStep) + 1 }).map((_, i) => {
          const tickYear = Math.floor(startY / tickStep) * tickStep + i * tickStep;
          if (tickYear < startY || tickYear > endY) return null;
          const leftPct = ((tickYear - startY) / range) * 100;
          return (
            <div key={tickYear} style={{
              position: 'absolute', left: `${leftPct}%`, top: 0,
              transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column',
              alignItems: 'center', pointerEvents: 'none'
            }}>
              <div style={{ width: '2px', height: '5px', background: 'rgba(255,255,255,0.45)' }} />
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.65)', fontWeight: 600, marginTop: '2px' }}>
                {tickYear}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TimelineOverlay;
