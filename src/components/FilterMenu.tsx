import React, { useState, useEffect, useRef } from 'react';
import { ChevronUp, Filter, Clock, Award } from 'lucide-react';
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
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
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
    if (activeFilters.includes(category)) {
      onChange(activeFilters.filter(f => f !== category));
    } else {
      onChange([...activeFilters, category]);
    }
  };

  const toggleCentury = (centuryId: string) => {
    if (activeCenturies.includes(centuryId)) {
      onChangeCenturies(activeCenturies.filter(c => c !== centuryId));
    } else {
      onChangeCenturies([...activeCenturies, centuryId]);
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
      style={{
        width: isExpanded ? '100%' : 'auto',
        position: 'relative', // Ensures absolute children position correctly
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      {!isExpanded ? (
        /* Small trigger button */
        <button
          onClick={() => onToggleExpanded(true)}
          title={t('filters', lang)}
          style={absolute ? {
            width: '100%',
            padding: '10px 16px',
            background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            borderRadius: '8px',
            color: 'var(--text-color)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '14px',
            fontWeight: 600,
            transition: 'all 0.2s ease',
            outline: 'none'
          } : {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0',
            background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            borderRadius: '50%',
            boxShadow: 'var(--box-shadow)',
            cursor: 'pointer',
            width: '46px',
            height: '46px',
            fontSize: '22px',
            transition: 'all 0.2s ease',
            outline: 'none'
          }}
          onMouseOver={e => {
            e.currentTarget.style.background = 'var(--glass-border)';
          }}
          onMouseOut={e => {
            e.currentTarget.style.background = 'var(--glass-bg)';
          }}
        >
          {absolute ? (
            <>
              <span style={{ fontSize: '16px' }}>🎚️</span>
              <span>{t('filters', lang)}</span>
            </>
          ) : (
            '🎚️'
          )}
        </button>
      ) : (
        /* Expanded Unified Box */
        <div
          className="glass-panel glass-panel-rounded animate-fade-in"
          style={{
            width: absolute ? '280px' : '100%',
            position: absolute ? 'absolute' : 'relative',
            top: absolute ? 'calc(100% + 8px)' : undefined,
            right: absolute ? 0 : undefined,
            background: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid rgba(56, 189, 248, 0.45)',
            boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
            borderRadius: '16px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            zIndex: absolute ? 50 : undefined,
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
              padding: '12px 20px',
              background: 'rgba(56, 189, 248, 0.12)',
              border: 'none',
              borderBottom: '1px solid var(--glass-border)',
              color: 'var(--text-color)',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '14px',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = 'rgba(56, 189, 248, 0.2)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = 'rgba(56, 189, 248, 0.12)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Filter size={15} color="var(--accent-color)" />
              <span>{t('filters', lang)}</span>
            </div>
            <ChevronUp size={15} style={{ opacity: 0.8, color: 'var(--accent-color)' }} />
          </button>

          {/* Tabs and Checkboxes Wrapper for tutorial highlight */}
          <div id="filter-tabs-content-container" style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--glass-border)' }}>
              <button
                onClick={() => setActiveTab('status')}
                style={{ 
                  flex: 1, 
                  padding: '12px 0', 
                  background: activeTab === 'status' ? 'rgba(255,255,255,0.06)' : 'transparent', 
                  border: 'none', 
                  color: 'var(--text-color)', 
                  opacity: activeTab === 'status' ? 1 : 0.5, 
                  cursor: 'pointer', 
                  display: 'flex', 
                  justifyContent: 'center', 
                  gap: '8px', 
                  alignItems: 'center', 
                  fontSize: '13px', 
                  fontWeight: 600, 
                  transition: 'all 0.2s ease' 
                }}
              >
                <Award size={15} /> {t('status', lang)}
              </button>
              <button
                onClick={() => setActiveTab('time')}
                style={{ 
                  flex: 1, 
                  padding: '12px 0', 
                  background: activeTab === 'time' ? 'rgba(255,255,255,0.06)' : 'transparent', 
                  border: 'none', 
                  color: 'var(--text-color)', 
                  opacity: activeTab === 'time' ? 1 : 0.5, 
                  cursor: 'pointer', 
                  display: 'flex', 
                  justifyContent: 'center', 
                  gap: '8px', 
                  alignItems: 'center', 
                  fontSize: '13px', 
                  fontWeight: 600, 
                  transition: 'all 0.2s ease' 
                }}
              >
                <Clock size={15} /> {t('centuries', lang)}
              </button>
            </div>

            {/* Checkboxes List */}
            <div style={{ 
              padding: '14px 20px', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '12px', 
              maxHeight: '320px', 
              overflowY: 'auto' 
            }}>
              {/* Switched Buttons: Clear all on left, Select all on right */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                <button 
                  onClick={clearAll} 
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: 'var(--text-color)', 
                    opacity: 0.7, 
                    fontSize: '12px', 
                    cursor: 'pointer', 
                    fontFamily: 'inherit',
                    transition: 'opacity 0.2s'
                  }}
                  onMouseOver={e => e.currentTarget.style.opacity = '1'}
                  onMouseOut={e => e.currentTarget.style.opacity = '0.7'}
                >
                  {t('clearAll', lang)}
                </button>
                <button 
                  onClick={selectAll} 
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: 'var(--accent-color)', 
                    fontSize: '12px', 
                    cursor: 'pointer', 
                    fontWeight: 600, 
                    fontFamily: 'inherit',
                    transition: 'filter 0.2s'
                  }}
                  onMouseOver={e => e.currentTarget.style.filter = 'brightness(1.2)'}
                  onMouseOut={e => e.currentTarget.style.filter = 'none'}
                >
                  {t('selectAll', lang)}
                </button>
              </div>

              {activeTab === 'status' && (
                <div id="status-filters-group" style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
                  {FILTER_CATEGORIES.map(category => {
                    const isActive = activeFilters.includes(category);
                    const color = STATUS_COLORS[category] || '#94a3b8';
                    return (
                      <label 
                        key={category} 
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '10px', 
                          cursor: 'pointer', 
                          fontSize: '13px', 
                          opacity: isActive ? 1 : 0.55, 
                          transition: 'all 0.2s' 
                        }}
                        onMouseOver={e => e.currentTarget.style.opacity = '1'}
                        onMouseOut={e => { if (!isActive) e.currentTarget.style.opacity = '0.55'; }}
                      >
                        <input
                          type="checkbox"
                          checked={isActive}
                          onChange={() => toggleFilter(category)}
                          style={{ cursor: 'pointer', accentColor: 'var(--accent-color)', width: '15px', height: '15px', flexShrink: 0 }}
                        />
                        <span style={{ 
                          width: '10px', 
                          height: '10px', 
                          borderRadius: '50%', 
                          backgroundColor: color, 
                          display: 'inline-block', 
                          flexShrink: 0, 
                          boxShadow: `0 0 6px ${color}` 
                        }} />
                        <span>{t(category as keyof typeof import('../utils/i18n').translations['en'], lang)}</span>
                      </label>
                    );
                  })}
                </div>
              )}

              {activeTab === 'time' && (
                <div id="century-filters-group" style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
                  {CENTURY_FILTERS.map(century => {
                    const isActive = activeCenturies.includes(century.id);
                    return (
                      <label 
                        key={century.id} 
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '10px', 
                          cursor: 'pointer', 
                          fontSize: '13px', 
                          opacity: isActive ? 1 : 0.55, 
                          transition: 'all 0.2s' 
                        }}
                        onMouseOver={e => e.currentTarget.style.opacity = '1'}
                        onMouseOut={e => { if (!isActive) e.currentTarget.style.opacity = '0.55'; }}
                      >
                        <input
                          type="checkbox"
                          checked={isActive}
                          onChange={() => toggleCentury(century.id)}
                          style={{ cursor: 'pointer', accentColor: 'var(--accent-color)', width: '15px', height: '15px', flexShrink: 0 }}
                        />
                        <span>{t(century.id as keyof typeof import('../utils/i18n').translations['en'], lang)}</span>
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
