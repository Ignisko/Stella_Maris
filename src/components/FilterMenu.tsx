import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Filter, Clock, Award } from 'lucide-react';
import { STATUS_COLORS } from '../utils/colors';

export const FILTER_CATEGORIES = [
  "Vatican approved",
  "Traditionally approved",
  "Bishop approved",
  "Coptic approved",
  "Approved for faith expression",
  "Apparitions to saints",
  "Dismissed"
];

// Mapping for our current dataset phrasing
export const categoryMapping: Record<string, string[]> = {
  "Vatican approved": ["Approved by the Holy See", "Vatican Approved", "Vatican approved"],
  "Traditionally approved": ["Traditionally Approved", "Traditionally approved"],
  "Bishop approved": ["Bishop Approved", "Bishop approved", "Approved by local bishop", "Approval by Syrian Catholic Church", "Established as supernatural"],
  "Coptic approved": ["Approved by the Coptic Orthodox Church", "Coptic Approved", "Coptic approved"],
  "Approved for faith expression": ["Approved for Faith Expression", "Approved for faith expression", "Declared nihil obstat", "Nihil obstat", "Declared site of pilgrimage and prayer", "Place of prayer", "Recognized as place of prayer"],
  "Apparitions to saints": ["Apparitions to Saints", "Apparitions to saints"],
  "Dismissed": ["Unapproved Apparitions", "Unapproved apparitions", "Unapproved", "No decision", "Negative decision", "Declared not supernatural", "Not established as supernatural", "Established as not supernatural", "Uninvestigated", "Negative", "Negative - Uninvestigated", "Negative judgment"]
};

export const CENTURY_FILTERS = [
  { id: "c_early", label: "Early (40 - 999)", min: 0, max: 999 },
  { id: "c_11", label: "11th Century (1000s)", min: 1000, max: 1099 },
  { id: "c_12", label: "12th Century (1100s)", min: 1100, max: 1199 },
  { id: "c_13", label: "13th Century (1200s)", min: 1200, max: 1299 },
  { id: "c_14", label: "14th Century (1300s)", min: 1300, max: 1399 },
  { id: "c_15", label: "15th Century (1400s)", min: 1400, max: 1499 },
  { id: "c_16", label: "16th Century (1500s)", min: 1500, max: 1599 },
  { id: "c_17", label: "17th Century (1600s)", min: 1600, max: 1699 },
  { id: "c_18", label: "18th Century (1700s)", min: 1700, max: 1799 },
  { id: "c_19", label: "19th Century (1800s)", min: 1800, max: 1899 },
  { id: "c_20", label: "20th Century (1900s)", min: 1900, max: 1999 },
  { id: "c_21", label: "21st Century (2000s)", min: 2000, max: 2100 },
];

interface FilterMenuProps {
  activeFilters: string[];
  onChange: (filters: string[]) => void;
  activeCenturies: string[];
  onChangeCenturies: (centuries: string[]) => void;
}

const FilterMenu: React.FC<FilterMenuProps> = ({ activeFilters, onChange, activeCenturies, onChangeCenturies }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'status' | 'time'>('time');

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

  const activeCount = activeFilters.length + activeCenturies.length;
  const totalPossible = FILTER_CATEGORIES.length + CENTURY_FILTERS.length;
  const hasFiltered = activeCount < totalPossible;

  return (
    <div style={{
      position: 'absolute',
      top: '130px',
      left: '20px',
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
        <span>Filters</span>
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
              onClick={() => setActiveTab('time')}
              style={{ flex: 1, padding: '12px 0', background: activeTab === 'time' ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', color: 'var(--text-color)', opacity: activeTab === 'time' ? 1 : 0.5, cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center', fontSize: '13px', fontWeight: 600, transition: 'all 0.2s ease' }}
            >
              <Clock size={15} /> Centuries
            </button>
            <button
              onClick={() => setActiveTab('status')}
              style={{ flex: 1, padding: '12px 0', background: activeTab === 'status' ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', color: 'var(--text-color)', opacity: activeTab === 'status' ? 1 : 0.5, cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center', fontSize: '13px', fontWeight: 600, transition: 'all 0.2s ease' }}
            >
              <Award size={15} /> Status
            </button>
          </div>

          <div style={{ padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: 'calc(100vh - 260px)', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
              <button onClick={selectAll} style={{ background: 'none', border: 'none', color: 'var(--accent-color)', fontSize: '12px', cursor: 'pointer', fontWeight: 500, fontFamily: 'inherit' }}>Select all</button>
              <button onClick={clearAll} style={{ background: 'none', border: 'none', color: 'var(--text-color)', opacity: 0.7, fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }}>Clear all</button>
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
                  <span>{category === "Approved for faith expression" ? "Faith expression" : category}</span>
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
                  {century.label}
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
