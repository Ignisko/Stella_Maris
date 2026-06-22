import React, { useState, useEffect, useRef } from 'react';
import { CaretUp, Funnel, Clock, Medal, Check } from '@phosphor-icons/react';
import { STATUS_COLORS } from '../utils/colors';
import { t } from '../utils/i18n';
import type { Language } from '../utils/i18n';
import { FILTER_CATEGORIES, CENTURY_FILTERS } from '../data/filters';

interface FilterMenuProps {
  activeFilters: string[];
  onChange: (filters: string[]) => void;
  activeCenturies: string[];
  onChangeCenturies: (centuries: string[]) => void;
  lang: Language;
  isExpanded: boolean;
  onToggleExpanded: (expanded: boolean) => void;
  absolute?: boolean;
  forceTab?: 'status' | 'time';
}

const FilterMenu: React.FC<FilterMenuProps> = ({ 
  activeFilters, 
  onChange, 
  activeCenturies, 
  onChangeCenturies, 
  lang,
  isExpanded,
  onToggleExpanded,
  absolute = false,
  forceTab
}) => {
  const [activeTab, setActiveTab] = useState<'status' | 'time'>('status');
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (forceTab) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveTab(forceTab);
    }
  }, [forceTab]);

  useEffect(() => {
    if (!isExpanded) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (!filterRef.current) return;
      
      // If this FilterMenu is hidden by CSS (e.g. mobile overlay on desktop), ignore
      if (filterRef.current.offsetWidth === 0 && filterRef.current.offsetHeight === 0) {
        return;
      }

      if (!filterRef.current.contains(event.target as Node)) {
        // If the click is inside another FilterMenu, let that one handle it
        const target = event.target as Element;
        if (target.closest && target.closest('.filter-menu-container')) {
          return;
        }
        onToggleExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isExpanded, onToggleExpanded]);

  const toggleFilter = (category: string) => {
    const current = activeFilters || [];
    if (current.includes(category)) {
      onChange(current.filter(f => f !== category));
    } else {
      onChange([...current, category]);
    }
  };

  const toggleCentury = (centuryId: string) => {
    const current = activeCenturies || [];
    if (current.includes(centuryId)) {
      onChangeCenturies(current.filter(c => c !== centuryId));
    } else {
      onChangeCenturies([...current, centuryId]);
    }
  };

  const selectAll = () => {
    if (activeTab === 'status') onChange([...FILTER_CATEGORIES]);
    else onChangeCenturies(CENTURY_FILTERS.map(c => c.id));
  };
  
  const clearAll = () => {
    if (activeTab === 'status') onChange([]);
    else onChangeCenturies([]);
  };

  return (
    <div 
      ref={filterRef}
      className="filter-menu-container"
      style={{
        width: isExpanded ? '100%' : 'auto',
        position: 'relative', // Ensures absolute children position correctly
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        userSelect: 'none',
        WebkitUserSelect: 'none'
      }}
    >
      {!isExpanded ? (
        /* Small trigger button */
        <button
          onClick={() => onToggleExpanded(true)}
          title={t('filters', lang)}
          style={absolute ? {
            width: '100%',
            padding: '12px 16px',
            background: 'var(--glass-bg)',
            border: 'none',
            color: 'var(--text-color)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontWeight: 600,
            transition: 'all 0.2s ease',
            outline: 'none',
            borderRadius: '24px'
          } : {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0',
            background: 'var(--glass-bg)',
            border: 'none',
            color: '#ffffff',
            cursor: 'pointer',
            width: '40px',
            height: '40px',
            transition: 'all 0.2s ease',
            outline: 'none',
            borderRadius: '20px'
          }}
          onMouseOver={e => {
            e.currentTarget.style.background = '#ffffff';
            e.currentTarget.style.color = '#000000';
            e.currentTarget.style.border = 'none';
          }}
          onMouseOut={e => {
            e.currentTarget.style.background = 'var(--glass-bg)';
            e.currentTarget.style.color = '#ffffff';
            e.currentTarget.style.border = 'none';
          }}
        >
          {absolute ? (
            <>
              <Funnel size={16} weight="bold" />
              <span>{t('filters', lang)}</span>
            </>
          ) : (
            <Funnel size={20} weight="bold" />
          )}
        </button>
      ) : (
        /* Expanded Unified Box */
        <div
          className="glass-panel animate-fade-in"
          style={{
            width: absolute ? '280px' : '100%',
            position: absolute ? 'absolute' : 'relative',
            top: absolute ? 'calc(100% + 8px)' : undefined,
            right: absolute ? 0 : undefined,
            background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            zIndex: absolute ? 50 : undefined,
            userSelect: 'none',
            WebkitUserSelect: 'none',
            borderRadius: '24px'
          }}
        >
          {/* Unified Header */}
          <button
            onClick={() => onToggleExpanded(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '16px 20px',
              background: '#1e293b',
              border: 'none',
              borderBottom: '1px solid var(--glass-border)',
              color: 'var(--text-color)',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '14px',
              transition: 'all 0.2s ease',
              userSelect: 'none',
              WebkitUserSelect: 'none'
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = '#2d3748';
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = '#1e293b';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', userSelect: 'none', WebkitUserSelect: 'none' }}>
              <Funnel size={16} weight="bold" />
              <span>{t('filters', lang)}</span>
            </div>
            <CaretUp size={16} weight="bold" />
          </button>

          {/* Tabs and Checkboxes Wrapper for tutorial highlight */}
          <div id="filter-tabs-content-container" style={{ display: 'flex', flexDirection: 'column', width: '100%', userSelect: 'none', WebkitUserSelect: 'none' }}>
            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--glass-border)', userSelect: 'none', WebkitUserSelect: 'none' }}>
              <button
                onClick={() => setActiveTab('status')}
                style={{ 
                  flex: 1, 
                  padding: '16px 0', 
                  background: activeTab === 'status' ? 'var(--text-color)' : 'transparent', 
                  border: 'none', 
                  color: activeTab === 'status' ? 'var(--bg-color)' : 'var(--text-color)', 
                  opacity: activeTab === 'status' ? 1 : 0.6, 
                  cursor: 'pointer', 
                  display: 'flex', 
                  justifyContent: 'center', 
                  gap: '8px', 
                  alignItems: 'center', 
                  fontSize: '13px', 
                  fontWeight: 600, 
                  transition: 'all 0.2s ease',
                  userSelect: 'none',
                  WebkitUserSelect: 'none'
                }}
              >
                <Medal size={16} weight={activeTab === 'status' ? 'fill' : 'regular'} /> {t('status', lang)}
              </button>
              <button
                onClick={() => setActiveTab('time')}
                style={{ 
                  flex: 1, 
                  padding: '16px 0', 
                  background: activeTab === 'time' ? 'var(--text-color)' : 'transparent', 
                  border: 'none', 
                  color: activeTab === 'time' ? 'var(--bg-color)' : 'var(--text-color)', 
                  opacity: activeTab === 'time' ? 1 : 0.6, 
                  cursor: 'pointer', 
                  display: 'flex', 
                  justifyContent: 'center', 
                  gap: '8px', 
                  alignItems: 'center', 
                  fontSize: '13px', 
                  fontWeight: 600, 
                  transition: 'all 0.2s ease',
                  userSelect: 'none',
                  WebkitUserSelect: 'none'
                }}
              >
                <Clock size={16} weight={activeTab === 'time' ? 'fill' : 'regular'} /> {t('centuries', lang)}
              </button>
            </div>

            {/* Checkboxes List */}
            <div style={{ 
              padding: '14px 20px', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '12px', 
              maxHeight: '320px', 
              overflowY: 'auto',
              userSelect: 'none',
              WebkitUserSelect: 'none'
            }}>
              {/* Switched Buttons: Clear all on left, Select all on right */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', userSelect: 'none', WebkitUserSelect: 'none' }}>
                <button 
                  onClick={clearAll} 
                  style={{ 
                    background: 'transparent', 
                    border: 'none', 
                    color: 'rgba(255,255,255,0.6)', 
                    padding: '4px 8px',
                    fontSize: '12px', 
                    cursor: 'pointer', 
                    fontFamily: 'inherit',
                    transition: 'all 0.2s',
                  }}
                  onMouseOver={e => e.currentTarget.style.color = '#fff'}
                  onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                >
                  Wyczyść wszystko
                </button>
                <button 
                  onClick={selectAll} 
                  style={{ 
                    background: 'transparent', 
                    border: 'none', 
                    color: '#3b82f6', 
                    padding: '4px 8px',
                    fontSize: '12px', 
                    cursor: 'pointer', 
                    fontWeight: 600, 
                    fontFamily: 'inherit',
                    transition: 'all 0.2s',
                  }}
                  onMouseOver={e => e.currentTarget.style.color = '#60a5fa'}
                  onMouseOut={e => e.currentTarget.style.color = '#3b82f6'}
                >
                  Zaznacz wszystko
                </button>
              </div>

              {activeTab === 'status' && (
                <div id="status-filters-group" style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', userSelect: 'none', WebkitUserSelect: 'none' }}>
                  {FILTER_CATEGORIES.map(category => {
                    const isActive = (activeFilters || []).includes(category);
                    const color = STATUS_COLORS[category] || '#94a3b8';
                    return (
                      <label 
                        key={category} 
                        onClick={(e) => { e.preventDefault(); toggleFilter(category); }}
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '12px', 
                          cursor: 'pointer', 
                          fontSize: '12px', 
                          fontWeight: 500,
                          opacity: isActive ? 1 : 0.6, 
                          transition: 'all 0.2s',
                          userSelect: 'none',
                          WebkitUserSelect: 'none'
                        }}
                        onMouseOver={e => e.currentTarget.style.opacity = '1'}
                        onMouseOut={e => { if (!isActive) e.currentTarget.style.opacity = '0.6'; }}
                      >
                        <div style={{ 
                          width: '16px', 
                          height: '16px', 
                          borderRadius: '4px',
                          border: `1px solid ${isActive ? '#3b82f6' : 'rgba(255,255,255,0.3)'}`, 
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: isActive ? '#3b82f6' : 'transparent',
                          transition: 'all 0.2s',
                          flexShrink: 0
                        }}>
                          {isActive && <Check size={12} weight="bold" color="#fff" />}
                        </div>
                        <div style={{ 
                          width: '12px', 
                          height: '12px', 
                          borderRadius: '50%',
                          backgroundColor: color,
                          boxShadow: `0 0 8px ${color}`,
                          flexShrink: 0
                        }} />
                        <span style={{ color: 'var(--text-color)' }}>{t(category as keyof typeof import('../utils/i18n').translations['en'], lang)}</span>
                      </label>
                    );
                  })}
                </div>
              )}

              {activeTab === 'time' && (
                <div id="century-filters-group" style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', userSelect: 'none', WebkitUserSelect: 'none' }}>
                  {CENTURY_FILTERS.map(century => {
                    const isActive = (activeCenturies || []).includes(century.id);
                    return (
                      <label 
                        key={century.id} 
                        onClick={(e) => { e.preventDefault(); toggleCentury(century.id); }}
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '12px', 
                          cursor: 'pointer', 
                          fontSize: '12px', 
                          fontWeight: 500,
                          opacity: isActive ? 1 : 0.6, 
                          transition: 'all 0.2s',
                          userSelect: 'none',
                          WebkitUserSelect: 'none'
                        }}
                        onMouseOver={e => e.currentTarget.style.opacity = '1'}
                        onMouseOut={e => { if (!isActive) e.currentTarget.style.opacity = '0.6'; }}
                      >
                        <div style={{ 
                          width: '16px', 
                          height: '16px', 
                          borderRadius: '4px',
                          border: `1px solid ${isActive ? '#3b82f6' : 'rgba(255,255,255,0.3)'}`, 
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: isActive ? '#3b82f6' : 'transparent',
                          transition: 'all 0.2s',
                          flexShrink: 0
                        }}>
                          {isActive && <Check size={12} weight="bold" color="#fff" />}
                        </div>
                        <div style={{ 
                          width: '12px', 
                          height: '12px', 
                          borderRadius: '50%',
                          backgroundColor: 'var(--text-color)',
                          boxShadow: `0 0 8px rgba(255,255,255,0.3)`,
                          flexShrink: 0
                        }} />
                        <span style={{ color: 'var(--text-color)' }}>{t(century.id as keyof typeof import('../utils/i18n').translations['en'], lang)}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterMenu;
