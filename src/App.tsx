import { useState, useMemo, useEffect } from 'react';
import { List } from 'lucide-react';
import GlobeViewer from './components/GlobeViewer';
import Sidebar from './components/Sidebar';
import TimelineOverlay from './components/TimelineOverlay';
import FilterMenu from './components/FilterMenu';
import { FILTER_CATEGORIES, categoryMapping, CENTURY_FILTERS } from './data/filters';
import SearchBar from './components/SearchBar';
import DirectoryModal from './components/DirectoryModal';
import LanguagePicker from './components/LanguagePicker';
import { apparitionsData } from './data/apparitions';
import type { Apparition } from './data/apparitions';
import { t, translateApparitionsList, loadLanguageTranslations } from './utils/i18n';
import type { Language } from './utils/i18n';

function App() {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('stellamaris_lang') as Language;
    return saved || 'en';
  });

  const [langTranslations, setLangTranslations] = useState<Record<string, { title: string; location: string; country: string; description: string }>>({});

  useEffect(() => {
    localStorage.setItem('stellamaris_lang', lang);
    loadLanguageTranslations(lang).then(data => {
      setLangTranslations(data);
    });
  }, [lang]);

  const translatedApparitionsData = useMemo(() => {
    return translateApparitionsList(apparitionsData, lang, langTranslations);
  }, [lang, langTranslations]);

  const [selectedApparition, setSelectedApparition] = useState<Apparition | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>(FILTER_CATEGORIES.filter(c => c !== "Dismissed"));
  const [activeCenturies, setActiveCenturies] = useState<string[]>(CENTURY_FILTERS.map(c => c.id));
  const [isDirectoryOpen, setIsDirectoryOpen] = useState(false);
  const [isPlayingTimeline, setIsPlayingTimeline] = useState(false);
  const [playbackIndex, setPlaybackIndex] = useState(0);
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);

  // Dynamically translate the selected apparition object
  const currentSelectedApparition = useMemo(() => {
    if (!selectedApparition) return null;
    return translatedApparitionsData.find(app => app.id === selectedApparition.id) || selectedApparition;
  }, [selectedApparition, translatedApparitionsData]);

  const handleSelectApparition = (apparition: Apparition | null) => {
    setSelectedApparition(apparition);
    if (isPlayingTimeline) {
      setIsPlayingTimeline(false);
    }
  };

  // Filter the data
  const filteredApparitions = useMemo(() => {
    return translatedApparitionsData.filter(app => {
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
  }, [translatedApparitionsData, activeFilters, activeCenturies]);

  // Sort filtered data chronologically
  const sortedFilteredApparitions = useMemo(() => {
    return [...filteredApparitions].sort((a, b) => a.year - b.year);
  }, [filteredApparitions]);

  // Interval loop for timeline playback
  useEffect(() => {
    if (!isPlayingTimeline || sortedFilteredApparitions.length === 0) return;

    const interval = setInterval(() => {
      setPlaybackIndex(prev => {
        const next = prev + 1;
        if (next >= sortedFilteredApparitions.length) {
          return 0; // Loop back to start
        }
        return next;
      });
    }, 2800);

    return () => clearInterval(interval);
  }, [isPlayingTimeline, sortedFilteredApparitions]);

  // Auto-select apparition when playbackIndex ticks
  useEffect(() => {
    if (isPlayingTimeline && sortedFilteredApparitions[playbackIndex]) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      // Note: we're disabling warnings because setting state in this interval effect is intentional
      setSelectedApparition(sortedFilteredApparitions[playbackIndex]);
    }
  }, [isPlayingTimeline, playbackIndex, sortedFilteredApparitions]);

  const togglePlayTimeline = () => {
    if (!isPlayingTimeline) {
      setIsPlayingTimeline(true);
      setPlaybackIndex(0);
      if (sortedFilteredApparitions.length > 0) {
        setSelectedApparition(sortedFilteredApparitions[0]);
      }
    } else {
      setIsPlayingTimeline(false);
    }
  };

  // Sliced data for GlobeViewer during playback
  const displayedApparitions = useMemo(() => {
    if (!isPlayingTimeline || !currentSelectedApparition) return filteredApparitions;
    return filteredApparitions.filter(a => a.year <= currentSelectedApparition.year);
  }, [isPlayingTimeline, currentSelectedApparition, filteredApparitions]);

  const hasPopups = isDirectoryOpen || !!currentSelectedApparition;

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* Left Control Panel */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        zIndex: 30,
        width: '320px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        pointerEvents: 'none',
        transform: hasPopups ? 'translateX(calc(-100% - 40px))' : 'translateX(0)',
        transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        {/* Title Card */}
        <div className="glass-panel glass-panel-rounded animate-fade-in" style={{
          padding: '20px 24px',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid var(--glass-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          pointerEvents: 'auto'
        }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0, letterSpacing: '0.5px', color: 'var(--text-color)' }}>
            Stella Maris
          </h1>
          <p style={{ fontSize: '13px', opacity: 0.7, margin: 0, fontWeight: 300, letterSpacing: '0.2px' }}>
            {t('subtitle', lang)}
          </p>
        </div>

        {/* Quick Search */}
        <div style={{ pointerEvents: 'auto' }}>
          <SearchBar 
            apparitions={translatedApparitionsData} 
            onSelectApparition={handleSelectApparition} 
            lang={lang}
          />
        </div>

        {/* Action Row: Filters and Browse Directory */}
        <div style={{ display: 'flex', gap: '8px', pointerEvents: 'auto' }}>
          <FilterMenu 
            activeFilters={activeFilters} 
            onChange={setActiveFilters} 
            activeCenturies={activeCenturies}
            onChangeCenturies={setActiveCenturies}
            lang={lang}
          />

          <button
            onClick={() => setIsDirectoryOpen(true)}
            className="glass-panel glass-panel-rounded animate-fade-in"
            style={{
              flex: 1,
              height: '42px',
              padding: '0 12px',
              background: 'rgba(15, 23, 42, 0.8)',
              color: 'var(--text-color)',
              border: '1px solid var(--glass-border)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)';
              e.currentTarget.style.borderColor = 'var(--accent-color)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = 'rgba(15, 23, 42, 0.8)';
              e.currentTarget.style.borderColor = 'var(--glass-border)';
            }}
          >
            <List size={15} color="var(--accent-color)" />
            <span>{t('browseDirectory', lang, { count: filteredApparitions.length })}</span>
          </button>
        </div>
      </div>

      {/* Top Right Language Switcher */}
      <LanguagePicker 
        currentLang={lang} 
        onLanguageChange={setLang} 
      />

      <DirectoryModal
        isOpen={isDirectoryOpen}
        onClose={() => setIsDirectoryOpen(false)}
        apparitions={filteredApparitions}
        onSelectApparition={handleSelectApparition}
        lang={lang}
      />

      <GlobeViewer 
        apparitions={displayedApparitions} 
        selectedApparition={currentSelectedApparition}
        onSelectApparition={handleSelectApparition} 
        isTimelineOpen={isTimelineOpen}
        lang={lang}
        hidePlayPause={hasPopups}
      />
      
      <Sidebar 
        apparition={currentSelectedApparition} 
        onClose={() => setSelectedApparition(null)} 
        allActiveApparitions={filteredApparitions}
        onSelectApparition={handleSelectApparition}
        lang={lang}
      />

      {filteredApparitions.length > 0 && (
        <TimelineOverlay
          apparitions={filteredApparitions}
          selectedApparition={currentSelectedApparition}
          onSelectApparition={handleSelectApparition}
          isPlaying={isPlayingTimeline}
          onTogglePlay={togglePlayTimeline}
          isOpen={isTimelineOpen}
          setIsOpen={setIsTimelineOpen}
          lang={lang}
        />
      )}
    </div>
  );
}

export default App;
