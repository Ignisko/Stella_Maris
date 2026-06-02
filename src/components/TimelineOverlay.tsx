import React, { useState, useMemo, useEffect, useRef } from 'react';
import type { Apparition } from '../data/apparitions';
import { ChartBar, Clock, CaretUp, X, MapPin, Play } from '@phosphor-icons/react';
import { getStatusColor, getApparitionStatusCategory, STATUS_COLORS } from '../utils/colors';
import { t } from '../utils/i18n';
import type { Language } from '../utils/i18n';

interface TimelineOverlayProps {
  apparitions: Apparition[];
  selectedApparition: Apparition | null;
  onSelectApparition: (apparition: Apparition) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  isCinemaMode: boolean;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  lang: Language;
}

const FAMOUS_CALLOUTS: Record<string, { label: string; year: number; modernOffset: number; fullHistoryOffset: number }> = {
  "last_supper": { label: "The Last Supper", year: 33, modernOffset: -1, fullHistoryOffset: 45 },
  "guadalupe_mexico": { label: "Our Lady of Guadalupe", year: 1531, modernOffset: -1, fullHistoryOffset: 30 },
  "rue-du-bac-1830": { label: "Our Lady of Miraculous Medal", year: 1830, modernOffset: 6, fullHistoryOffset: -1 },
  "rome-ratisbonne-1842": { label: "Our Lady of Zion", year: 1842, modernOffset: -55, fullHistoryOffset: -1 },
  "lourdes-1858": { label: "Our Lady of Lourdes", year: 1858, modernOffset: 40, fullHistoryOffset: 45 },
  "fatima": { label: "Our Lady of Fatima", year: 1917, modernOffset: 65, fullHistoryOffset: 20 },
  "banneux": { label: "Virgin of the Poor", year: 1933, modernOffset: 25, fullHistoryOffset: -1 },
  "kibeho": { label: "Our Lady of Kibeho", year: 1981, modernOffset: 50, fullHistoryOffset: -1 }
};

const playPresentationTranslations: Record<string, string> = {
  pl: 'Uruchom prezentację',
  es: 'Iniciar presentación',
  pt: 'Iniciar apresentação',
  fr: 'Lancer la présentation',
  it: 'Avvia presentazione',
  vi: 'Bắt đầu trình chiếu',
  ar: 'بدء العرض التقديمي',
  tl: 'Simulan ang Presentation',
  tr: 'Sunumu Oynat',
  en: 'Play Presentation'
};

const TimelineOverlay: React.FC<TimelineOverlayProps> = ({
  apparitions, selectedApparition, onSelectApparition, isPlaying, onTogglePlay, isCinemaMode, isOpen, setIsOpen, lang
}) => {
  const [timeMode, setTimeMode] = useState<'modern' | 'all'>('modern');
  const [hoveredApp, setHoveredApp] = useState<Apparition | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewApparition, setPreviewApparition] = useState<Apparition | null>(null);
  const [hoverX, setHoverX] = useState<number | null>(null);
  const [hoverYear, setHoverYear] = useState<number | null>(null);

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

  // Auto-open when cinema mode is active
  useEffect(() => {
    if (isCinemaMode) setIsOpen(true);
  }, [isCinemaMode, setIsOpen]);

  // Auto-switch to 'all' if cinema mode is active and we have apparitions before 1800
  useEffect(() => {
    if (isCinemaMode && apparitions.some(a => a.year < 1800)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTimeMode('all');
    }
  }, [isCinemaMode, apparitions]);

  const handleTimelineInteraction = React.useCallback((clientX: number, isFinal: boolean = false) => {
    if (!containerRef.current || sorted.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const padding = 20; // 20px padding left/right
    const relativeX = clientX - rect.left - padding;
    const timelineWidth = rect.width - (padding * 2);
    if (timelineWidth <= 0) return;

    const pct = Math.max(0, Math.min(1, relativeX / timelineWidth));
    const targetYear = startY + pct * range;

    // Find closest apparition
    let closest = sorted[0];
    let minDiff = Math.abs(sorted[0].year - targetYear);
    for (let i = 1; i < sorted.length; i++) {
      const diff = Math.abs(sorted[i].year - targetYear);
      if (diff < minDiff) {
        minDiff = diff;
        closest = sorted[i];
      }
    }
    
    if (!isFinal) {
      setPreviewApparition(closest);
    } else {
      setPreviewApparition(null);
      onSelectApparition(closest);
    }
  }, [sorted, startY, range, onSelectApparition]);

  const handleContainerMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current || sorted.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const padding = 20;
    const relativeX = e.clientX - rect.left - padding;
    const timelineWidth = rect.width - (padding * 2);
    if (timelineWidth <= 0) return;

    const pct = Math.max(0, Math.min(1, relativeX / timelineWidth));
    const targetYear = Math.round(startY + pct * range);
    
    setHoverX(e.clientX - rect.left);
    setHoverYear(targetYear);
  };

  const handleContainerMouseLeave = () => {
    setHoverX(null);
    setHoverYear(null);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('.interactive-pill') || target.closest('.interactive-bar')) {
      return;
    }
    setIsDragging(true);
    handleTimelineInteraction(e.clientX, false);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      handleTimelineInteraction(e.clientX, false);
    };

    const handleMouseUp = (e: MouseEvent) => {
      setIsDragging(false);
      handleTimelineInteraction(e.clientX, true);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleTimelineInteraction]);

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

      // Use the exact center of the bucket column for perfect alignment with the timeline bar stack
      const leftPct = bucket
        ? ((bucket.index + 0.5) / buckets.length) * 100
        : ((famous.year - startY) / range) * 100;
      const clampedLeft = Math.max(6, Math.min(94, leftPct));

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        id="timeline-closed-pill"
        className="glass-panel animate-fade-in"
        onClick={() => setIsOpen(true)}
        title={t('timeline', lang)}
        style={{
          position: 'fixed',
          bottom: '44px',
          right: selectedApparition ? '440px' : '20px',
          zIndex: 160,
          pointerEvents: 'auto',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          cursor: 'pointer',
          background: 'var(--bg-color)',
          border: '1px solid var(--glass-border)',
          transition: 'all 0.2s ease',
          outline: 'none',
        }}
        onMouseOver={e => {
          e.currentTarget.style.background = 'var(--text-color)';
          e.currentTarget.style.color = 'var(--bg-color)';
        }}
        onMouseOut={e => {
          e.currentTarget.style.background = 'var(--bg-color)';
          e.currentTarget.style.color = 'var(--text-color)';
        }}
      >
        <ChartBar size={16} weight="regular" />
        <span className="timeline-text" style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{t('timeline', lang)}</span>
        <CaretUp size={16} className="timeline-chevron" weight="bold" />
      </button>
    );
  }

  // Expanded panel
  return (
    <div
      id="timeline-container"
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleContainerMouseMove}
      onMouseLeave={handleContainerMouseLeave}
      className="glass-panel animate-fade-in"
      style={{
        cursor: 'pointer',
        position: 'fixed',
        bottom: '24px',
        left: '0',
        width: (selectedApparition && !isCinemaMode) ? 'calc(100vw - 420px)' : '100vw',
        backgroundColor: 'var(--timeline-bg)',
        borderTop: '1px solid var(--timeline-border)',
        borderRight: (selectedApparition && !isCinemaMode) ? '1px solid var(--timeline-border)' : 'none',
        padding: isCinemaMode ? '6px 32px' : '16px 32px',
        zIndex: 160,
        boxSizing: 'border-box',
        transition: 'all 0.3s ease',
        pointerEvents: 'auto'
      }}
    >
      {/* Top hover tooltip pill over cursor */}
      {(isCinemaMode && hoverYear !== null && hoverX !== null) && (
        <div style={{
          position: 'absolute',
          left: `${hoverX}px`,
          top: '-24px',
          transform: 'translateX(-50%)',
          background: 'rgba(15,23,42,0.9)',
          color: 'var(--accent-color)',
          border: '1px solid rgba(56,189,248,0.4)',
          padding: '2px 8px',
          borderRadius: '12px',
          fontSize: '11px',
          fontWeight: 700,
          pointerEvents: 'none',
          zIndex: 200,
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          whiteSpace: 'nowrap'
        }}>
          {hoverYear}
        </div>
      )}

      {/* Top-right action controls (Play Presentation and Close buttons) */}
      {!isCinemaMode && (
        <div style={{
          position: 'absolute',
          top: '16px',
          right: '32px',
          display: 'flex',
          gap: '8px',
          zIndex: 35
        }}>
          <button
            id="timeline-play-presentation-button"
            onClick={onTogglePlay}
            style={{
              background: 'linear-gradient(135deg, #d4af37, #3b82f6)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '20px',
              padding: '8px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 700,
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
              transition: 'all 0.2s'
            }}
            onMouseOver={e => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.6)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
            }}
          >
            <Play size={12} weight="fill" />
            <span>{playPresentationTranslations[lang] || 'Play Presentation'}</span>
          </button>

          <button
            onClick={() => {
              setIsOpen(false);
              if (isPlaying) onTogglePlay();
            }}
            style={{
              background: 'var(--timeline-btn-bg)',
              border: '1px solid var(--timeline-btn-border)',
              borderRadius: '20px',
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--text-color)',
              cursor: 'pointer',
              fontSize: '11px',
              fontWeight: 600,
              transition: 'all 0.2s'
            }}
            onMouseOver={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.2)'; e.currentTarget.style.color = '#fca5a5'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'var(--timeline-btn-bg)'; e.currentTarget.style.color = 'var(--text-color)'; e.currentTarget.style.borderColor = 'var(--timeline-btn-border)'; }}
          >
            <span>{t('close', lang)}</span>
            <X size={14} weight="bold" />
          </button>
        </div>
      )}

      {/* Top bar: title + controls */}
      {!isCinemaMode && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap', marginBottom: '16px', paddingRight: '200px' }}>

          {/* Title */}
          <h3 style={{
            fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em',
            margin: 0, fontWeight: 600, color: 'var(--text-color)',
            display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0
          }}>
            <ChartBar size={16} weight="regular" /> {t('timeline', lang)}
          </h3>

          {/* Time mode toggle */}
          <div style={{
            display: 'flex', background: 'transparent',
            border: '1px solid var(--timeline-border)'
          }}>
            {(['modern', 'all'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setTimeMode(mode)}
                style={{
                  background: timeMode === mode ? 'var(--text-color)' : 'transparent',
                  color: timeMode === mode ? 'var(--bg-color)' : 'var(--text-color)',
                  border: 'none', padding: '6px 16px',
                  fontSize: '9px', fontWeight: 600, cursor: 'pointer',
                  textTransform: 'uppercase', letterSpacing: '0.05em',
                  transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '6px',
                  borderRight: mode === 'modern' ? '1px solid var(--timeline-border)' : 'none'
                }}
              >
                <Clock size={12} weight={timeMode === mode ? 'fill' : 'regular'} />
                {mode === 'modern' ? t('modernEra', lang) : t('fullHistory', lang)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Status legend under the controls */}
      {!isCinemaMode && (
        <div style={{
          marginBottom: '16px',
          paddingTop: '6px',
          borderTop: '1px solid var(--timeline-border)'
        }}>
          <div style={{ 
            fontSize: '10px', 
            opacity: 0.5, 
            textTransform: 'uppercase', 
            letterSpacing: '0.5px', 
            fontWeight: 700,
            marginBottom: '6px'
          }}>
            {t('legend', lang)}
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '8px 16px',
            maxWidth: '600px'
          }}>
            {Object.entries(STATUS_COLORS).map(([label, color]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', opacity: 0.8, fontWeight: 500 }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: color, boxShadow: `0 0 5px ${color}`, flexShrink: 0 }} />
                <span>{t(label as keyof typeof import('../utils/i18n').translations['en'], lang)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

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
            <span>{hoveredApp.title} {hoveredApp.approvalStatus === 'Dismissed' && '⚠️'}</span>
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
      <div style={{ position: 'relative', width: '100%', height: isCinemaMode ? '35px' : `${Math.max(60, Math.min(120, maxCount * (tileHeight + tileGap) + 40))}px`, transition: 'height 0.3s ease' }}>

        {/* Stacked bars */}
        {!isCinemaMode && (
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
                      className="interactive-bar"
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
        )}

        {/* Cinema Mode Markers */}
        {isCinemaMode && (
          <div style={{ position: 'absolute', bottom: '0px', left: 0, right: 0, height: '10px' }}>
            {sorted.map(app => {
              const clampedYear = Math.max(startY, Math.min(endY, app.year));
              const leftPct = range > 0 ? ((clampedYear - startY) / range) * 100 : 0;
              const isSelected = selectedApparition?.id === app.id;
              const statusColor = getStatusColor(app.approvalStatus);
              return (
                <div
                  key={`marker-${app.id}`}
                  onClick={(e) => { e.stopPropagation(); onSelectApparition(app); }}
                  title={`${app.year}: ${app.title}`}
                  style={{
                    position: 'absolute',
                    left: `${leftPct}%`,
                    bottom: '0',
                    width: '24px',
                    height: '24px',
                    transform: 'translate(-50%, 50%)',
                    cursor: 'pointer',
                    zIndex: isSelected ? 105 : 100,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <div
                    style={{
                      width: isSelected ? '10px' : '8px',
                      height: isSelected ? '10px' : '8px',
                      backgroundColor: statusColor,
                      border: isSelected ? '2px solid #ffffff' : '1px solid rgba(255,255,255,0.3)',
                      borderRadius: '50%',
                      boxShadow: isSelected 
                        ? `0 0 16px ${statusColor}, 0 0 8px rgba(0,0,0,0.8)` 
                        : 'none',
                      transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      opacity: isSelected ? 1 : 0.25
                    }}
                    onMouseOver={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.transform = 'scale(1.2)';
                        e.currentTarget.style.opacity = '0.8';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.transform = 'none';
                        e.currentTarget.style.opacity = '0.25';
                      }
                    }}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* Callout overlays */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 100 }}>

          {/* Playback laser pointer / indicator */}
          {(selectedApparition || (isCinemaMode && isDragging && previewApparition)) && (() => {
            const activeApp = (isCinemaMode && isDragging && previewApparition) ? previewApparition : selectedApparition;
            if (!activeApp) return null;

            const year = activeApp.year;
            const clampedYear = Math.max(startY, Math.min(endY, year));
            const leftPct = range > 0 ? ((clampedYear - startY) / range) * 100 : 0;
            
            // Calculate the height of the bar stack up to the selected apparition
            const selectedBucket = buckets.find(b => activeApp && activeApp.year >= b.startYear && activeApp.year <= b.endYear);
            let stackHeight = 0;
            if (!isCinemaMode && selectedBucket && activeApp) {
              const selectedIndex = selectedBucket.apps.findIndex(app => app.id === activeApp.id);
              if (selectedIndex !== -1) {
                stackHeight = (selectedIndex + 1) * (tileHeight + tileGap);
              } else {
                stackHeight = selectedBucket.apps.length * (tileHeight + tileGap);
              }
            }

            return (
              <div style={{
                position: 'absolute', 
                left: `${leftPct}%`, 
                bottom: '0px', 
                height: `${stackHeight}px`,
                width: '2px', 
                backgroundColor: 'var(--accent-color)',
                boxShadow: '0 0 12px var(--accent-color)', 
                zIndex: 110,
                transform: 'translateX(-50%)', 
                transition: 'left 0.5s cubic-bezier(0.4, 0, 0.2, 1), height 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                pointerEvents: 'none'
              }}>
                {/* Pointer head needle Google-style Map Pin */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: '50%',
                  transform: 'translate(-50%, -100%) translateY(2px)',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.6)) drop-shadow(0 0 8px var(--accent-color))',
                  zIndex: 112,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <MapPin size={22} fill="#ef4444" color="#ffffff" strokeWidth={1.5} />
                </div>
                
                {/* floating badge in cinema mode for scrubbing preview */}
                {(isCinemaMode && isDragging && previewApparition) && (() => {
                  let badgeTranslateX = -50;
                  if (leftPct > 80) {
                    badgeTranslateX = -50 - Math.min(45, (leftPct - 80) * 2.25);
                  } else if (leftPct < 20) {
                    badgeTranslateX = -50 + Math.min(45, (20 - leftPct) * 2.25);
                  }
                  return (
                    <div style={{
                      position: 'absolute', 
                      top: '-15px', 
                      left: '50%',
                      transform: `translate(${badgeTranslateX}%, -100%)`,
                      backgroundColor: 'var(--accent-color)', 
                      color: '#0f172a',
                      padding: '4px 10px', 
                      borderRadius: '12px',
                      fontSize: '11px', 
                      fontWeight: 800, 
                      whiteSpace: 'nowrap',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      transition: 'transform 0.1s ease-out'
                    }}>
                      {activeApp.year}: {activeApp.title} {activeApp.approvalStatus === 'Dismissed' && '⚠️'}
                    </div>
                  );
                })()}
              </div>
            );
          })()}

          {/* Callout lines (solid light white lines using SVG) */}
          {!isCinemaMode && (
            <svg width="100%" height="300" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 5 }}>
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
                    stroke="var(--timeline-line)"
                    strokeWidth="1.2"
                  />
                );
              })}
            </svg>
          )}

          {/* Callout pills */}
          {!isCinemaMode && callouts.map(c => {
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
                className="interactive-pill"
                onClick={e => { e.stopPropagation(); onSelectApparition(c.famous); }}
                style={{
                  position: 'absolute',
                  left: `${c.left}%`,
                  bottom: `${bottomPx}px`,
                  transform: `translateX(${translateX}%)`,
                  zIndex: 50,
                  fontSize: '10px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--text-color)',
                  whiteSpace: 'nowrap',
                  backgroundColor: 'var(--bg-color)',
                  padding: '6px 12px',
                  border: '1px solid var(--text-color)',
                  pointerEvents: 'auto',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={e => { 
                  e.currentTarget.style.backgroundColor = 'var(--text-color)'; 
                  e.currentTarget.style.color = 'var(--bg-color)'; 
                }}
                onMouseOut={e => { 
                  e.currentTarget.style.backgroundColor = 'var(--bg-color)'; 
                  e.currentTarget.style.color = 'var(--text-color)'; 
                }}
              >
                {c.label}
              </div>
            );
          })}
        </div>
      </div>

      {/* Year axis */}
      <div style={{ position: 'relative', height: '26px', width: '100%', marginTop: '2px' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'var(--timeline-axis)' }} />
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
              <div style={{ width: '2px', height: '5px', background: 'var(--timeline-tick)' }} />
              <div style={{ fontSize: '10px', color: 'var(--timeline-text)', fontWeight: 600, marginTop: '2px' }}>
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
