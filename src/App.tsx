import { useState, useMemo } from 'react';
import GlobeViewer from './components/GlobeViewer';
import Sidebar from './components/Sidebar';
import TimelineOverlay from './components/TimelineOverlay';
import FilterMenu, { FILTER_CATEGORIES, categoryMapping, CENTURY_FILTERS } from './components/FilterMenu';
import SearchBar from './components/SearchBar';
import { apparitionsData } from './data/apparitions';
import type { Apparition } from './data/apparitions';

function App() {
  const [selectedApparition, setSelectedApparition] = useState<Apparition | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>(FILTER_CATEGORIES.filter(c => c !== "Dismissed"));
  const [activeCenturies, setActiveCenturies] = useState<string[]>(CENTURY_FILTERS.map(c => c.id));

  const handleSelectApparition = (apparition: Apparition | null) => {
    setSelectedApparition(apparition);
  };

  // Filter the data
  const filteredApparitions = useMemo(() => {
    return apparitionsData.filter(app => {
      // 1. Check if it matches active century filters
      const matchesCentury = CENTURY_FILTERS.some(century => {
        if (!activeCenturies.includes(century.id)) return false;
        return app.year >= century.min && app.year <= century.max;
      });

      if (!matchesCentury) return false;

      // 2. Check if it matches active status filters
      for (const filter of activeFilters) {
        const matchingStatuses = categoryMapping[filter];
        if (matchingStatuses && matchingStatuses.includes(app.approvalStatus)) {
          return true;
        }
        // Fallback for exact matches if they are added directly
        if (app.approvalStatus === filter) {
          return true;
        }
      }
      return false;
    });
  }, [activeFilters, activeCenturies]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* Header Overlay */}
      <div className="glass-panel glass-panel-rounded animate-fade-in" style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        zIndex: 10,
        padding: '18px 28px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
      }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0, letterSpacing: '0.5px', color: 'var(--text-color)' }}>
          Stella Maris
        </h1>
        <p style={{ fontSize: '14px', opacity: 0.7, margin: 0, fontWeight: 300, letterSpacing: '0.2px' }}>
          Marian apparitions map
        </p>
      </div>

      <SearchBar 
        apparitions={apparitionsData} 
        onSelectApparition={handleSelectApparition} 
      />

      <FilterMenu 
        activeFilters={activeFilters} 
        onChange={setActiveFilters} 
        activeCenturies={activeCenturies}
        onChangeCenturies={setActiveCenturies}
      />

      <GlobeViewer 
        apparitions={filteredApparitions} 
        selectedApparition={selectedApparition}
        onSelectApparition={handleSelectApparition} 
      />
      
      <Sidebar 
        apparition={selectedApparition} 
        onClose={() => setSelectedApparition(null)} 
        allActiveApparitions={filteredApparitions}
        onSelectApparition={handleSelectApparition}
      />

      {filteredApparitions.length > 0 && (
        <TimelineOverlay
          apparitions={filteredApparitions}
          selectedApparition={selectedApparition}
          onSelectApparition={handleSelectApparition}
        />
      )}
    </div>
  );
}

export default App;
