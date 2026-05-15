import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';

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

interface FilterMenuProps {
  activeFilters: string[];
  onChange: (filters: string[]) => void;
}

const FilterMenu: React.FC<FilterMenuProps> = ({ activeFilters, onChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleFilter = (category: string) => {
    if (activeFilters.includes(category)) {
      onChange(activeFilters.filter(f => f !== category));
    } else {
      onChange([...activeFilters, category]);
    }
  };

  const selectAll = () => onChange([...FILTER_CATEGORIES]);
  const clearAll = () => onChange([]);

  return (
    <div className="glass-panel glass-panel-rounded animate-fade-in" style={{
      position: 'absolute',
      top: '110px',
      left: '20px',
      zIndex: 10,
      width: '280px',
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
        <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <button onClick={selectAll} style={{ background: 'none', border: 'none', color: 'var(--accent-color)', fontSize: '13px', cursor: 'pointer', fontWeight: 500 }}>Select All</button>
            <button onClick={clearAll} style={{ background: 'none', border: 'none', color: 'var(--text-color)', opacity: 0.7, fontSize: '13px', cursor: 'pointer' }}>Clear All</button>
          </div>
          
          {FILTER_CATEGORIES.map(category => {
            const isActive = activeFilters.includes(category);
            return (
              <label key={category} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: '14px', opacity: isActive ? 1 : 0.6, transition: 'opacity 0.2s' }}>
                <input 
                  type="checkbox" 
                  checked={isActive}
                  onChange={() => toggleFilter(category)}
                  style={{ cursor: 'pointer', accentColor: 'var(--accent-color)', width: '16px', height: '16px' }}
                />
                {category}
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FilterMenu;
