import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Filter, Clock, Award } from 'lucide-react';
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
}

const FilterMenu: React.FC<FilterMenuProps> = ({ activeFilters, onChange, activeCenturies, onChangeCenturies, lang }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'status' | 'time'>('status');

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
    <div style={{
      position: 'relative',
      zIndex: 10,
    }}>
      {/* Small trigger button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        title="Filters"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 16px',
          background: isExpanded
            ? 'rgba(56,189,248,0.15)'
            : 'rgba(15, 23, 42, 0.8)',
          border: `1px solid ${isExpanded ? 'rgba(56,189,248,0.5)' : 'var(--glass-border)'}`,
          borderRadius: '12px',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
          cursor: 'pointer',
          color: 'var(--text-color)',
          fontSize: '13px',
          fontWeight: 600,
          transition: 'all 0.2s ease',
          whiteSpace: 'nowrap',
        }}
        onMouseOver={e => {
          if (!isExpanded) {
            e.currentTarget.style.background = 'rgba(15, 23, 42, 0.95)';
            e.currentTarget.style.borderColor = 'rgba(56,189,248,0.3)';
          }
        }}
        onMouseOut={e => {
          if (!isExpanded) {
            e.currentTarget.style.background = 'rgba(15, 23, 42, 0.8)';
            e.currentTarget.style.borderColor = 'var(--glass-border)';
          }
        }}
      >
        <Filter size={15} color="var(--accent-color)" />
        <span>{t('filters', lang)}</span>
        {isExpanded ? <ChevronUp size={13} style={{ opacity: 0.7 }} /> : <ChevronDown size={13} style={{ opacity: 0.7 }} />}
      </button>

      {/* Dropdown panel */}
      {isExpanded && (
        <div
          className="glass-panel glass-panel-rounded animate-fade-in"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: 0,
            width: '280px',
            overflow: 'hidden',
            boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
            zIndex: 11,
          }}
        >
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--glass-border)' }}>
            <button
              onClick={() => setActiveTab('status')}
              style={{ flex: 1, padding: '12px 0', background: activeTab === 'status' ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', color: 'var(--text-color)', opacity: activeTab === 'status' ? 1 : 0.5, cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center', fontSize: '13px', fontWeight: 600, transition: 'all 0.2s ease' }}
            >
              <Award size={15} /> {t('status', lang)}
            </button>
            <button
              onClick={() => setActiveTab('time')}
              style={{ flex: 1, padding: '12px 0', background: activeTab === 'time' ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', color: 'var(--text-color)', opacity: activeTab === 'time' ? 1 : 0.5, cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center', fontSize: '13px', fontWeight: 600, transition: 'all 0.2s ease' }}
            >
              <Clock size={15} /> {t('centuries', lang)}
            </button>
          </div>

          <div style={{ padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: 'calc(100vh - 260px)', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
              <button onClick={selectAll} style={{ background: 'none', border: 'none', color: 'var(--accent-color)', fontSize: '12px', cursor: 'pointer', fontWeight: 500, fontFamily: 'inherit' }}>{t('selectAll', lang)}</button>
              <button onClick={clearAll} style={{ background: 'none', border: 'none', color: 'var(--text-color)', opacity: 0.7, fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }}>{t('clearAll', lang)}</button>
            </div>

            {activeTab === 'status' && FILTER_CATEGORIES.map(category => {
              const isActive = activeFilters.includes(category);
              const color = STATUS_COLORS[category] || '#94a3b8';
              return (
                <label key={category} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', opacity: isActive ? 1 : 0.5, transition: 'opacity 0.2s' }}>
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={() => toggleFilter(category)}
                    style={{ cursor: 'pointer', accentColor: 'var(--accent-color)', width: '15px', height: '15px', flexShrink: 0 }}
                  />
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: color, display: 'inline-block', flexShrink: 0, boxShadow: `0 0 6px ${color}` }} />
                  <span>{t(category as keyof typeof import('../utils/i18n').translations['en'], lang)}</span>
                </label>
              );
            })}

            {activeTab === 'time' && CENTURY_FILTERS.map(century => {
              const isActive = activeCenturies.includes(century.id);
              return (
                <label key={century.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', opacity: isActive ? 1 : 0.5, transition: 'opacity 0.2s' }}>
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={() => toggleCentury(century.id)}
                    style={{ cursor: 'pointer', accentColor: 'var(--accent-color)', width: '15px', height: '15px', flexShrink: 0 }}
                  />
                  {t(century.id as keyof typeof import('../utils/i18n').translations['en'], lang)}
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterMenu;
