import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Filter, Clock, Award } from 'lucide-react';

export const FILTER_CATEGORIES = [
  "Vatican Approved",
  "Traditionally Approved",
  "Bishop Approved",
  "Coptic Approved",
  "Approved for Faith Expression",
  "Apparitions to Saints",
  "Unapproved Apparitions"
];

// Mapping for our current dataset phrasing
export const categoryMapping: Record<string, string[]> = {
  "Vatican Approved": ["Approved by the Holy See"],
  "Traditionally Approved": ["Traditionally Approved"],
  "Coptic Approved": ["Approved by the Coptic Orthodox Church"],
  // Add others as needed if dataset expands
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

  return (
    <div className="glass-panel glass-panel-rounded animate-fade-in" style={{
      position: 'absolute',
      top: '110px',
      left: '20px',
      zIndex: 10,
      width: '290px',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
    }}>
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          background: isExpanded ? 'rgba(255,255,255,0.05)' : 'transparent',
          borderBottom: isExpanded ? '1px solid var(--glass-border)' : 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Filter size={18} color="var(--accent-color)" />
          <h3 style={{ fontSize: '15px', fontWeight: 600, margin: 0, letterSpacing: '0.5px' }}>Filters</h3>
        </div>
        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </div>

      {isExpanded && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          
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

          <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '40vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <button onClick={selectAll} style={{ background: 'none', border: 'none', color: 'var(--accent-color)', fontSize: '13px', cursor: 'pointer', fontWeight: 500 }}>Select All</button>
              <button onClick={clearAll} style={{ background: 'none', border: 'none', color: 'var(--text-color)', opacity: 0.7, fontSize: '13px', cursor: 'pointer' }}>Clear All</button>
            </div>
            
            {activeTab === 'status' && FILTER_CATEGORIES.map(category => {
              const isActive = activeFilters.includes(category);
              return (
                <label key={category} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: '14px', opacity: isActive ? 1 : 0.6, transition: 'opacity 0.2s' }}>
                  <input 
                    type="checkbox" 
                    checked={isActive}
                    onChange={() => toggleFilter(category)}
                    style={{ cursor: 'pointer', accentColor: 'var(--accent-color)', width: '16px', height: '16px', flexShrink: 0 }}
                  />
                  {category}
                </label>
              );
            })}

            {activeTab === 'time' && CENTURY_FILTERS.map(century => {
              const isActive = activeCenturies.includes(century.id);
              return (
                <label key={century.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: '14px', opacity: isActive ? 1 : 0.6, transition: 'opacity 0.2s' }}>
                  <input 
                    type="checkbox" 
                    checked={isActive}
                    onChange={() => toggleCentury(century.id)}
                    style={{ cursor: 'pointer', accentColor: 'var(--accent-color)', width: '16px', height: '16px', flexShrink: 0 }}
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
