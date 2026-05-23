import { useState, useMemo, useEffect } from 'react';
import { List, Play, Pause, X, HelpCircle } from 'lucide-react';
import GlobeViewer from './components/GlobeViewer';
import Sidebar from './components/Sidebar';
import TimelineOverlay from './components/TimelineOverlay';
import FilterMenu from './components/FilterMenu';
import { FILTER_CATEGORIES, categoryMapping, CENTURY_FILTERS } from './data/filters';
import SearchBar from './components/SearchBar';
import DirectoryModal from './components/DirectoryModal';
import LanguagePicker from './components/LanguagePicker';
import TutorialModal from './components/TutorialModal';
import { apparitionsData } from './data/apparitions';
import type { Apparition } from './data/apparitions';
import { t, translateApparitionsList, loadLanguageTranslations } from './utils/i18n';
import type { Language } from './utils/i18n';


const pauseTranslations: Record<string, string> = {
  pl: 'Zatrzymaj',
  es: 'Pausar',
  pt: 'Pausar',
  fr: 'Pause',
  it: 'Pausa',
  vi: 'Tạm dừng',
  ar: 'إيقاف مؤقت',
  tl: 'I-pause',
  tr: 'Duraklat',
  en: 'Pause'
};

const resumeTranslations: Record<string, string> = {
  pl: 'Wznów',
  es: 'Reanudar',
  pt: 'Retomar',
  fr: 'Reprendre',
  it: 'Riprendi',
  vi: 'Tiếp tục',
  ar: 'استئناف',
  tl: 'Ituloy',
  tr: 'Sürdür',
  en: 'Resume'
};

const exitTranslations: Record<string, string> = {
  pl: 'Zakończ',
  es: 'Salir',
  pt: 'Sair',
  fr: 'Quitter',
  it: 'Esci',
  vi: 'Thoát',
  ar: 'إنهاء',
  tl: 'Lumabas',
  tr: 'Kapat',
  en: 'Exit'
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
  const [isCinemaMode, setIsCinemaMode] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [playbackIndex, setPlaybackIndex] = useState(0);
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);

  const [isTutorialActive, setIsTutorialActive] = useState<boolean>(() => {
    return localStorage.getItem('stellamaris_tutorial_seen') !== 'true';
  });
  const [tutorialStep, setTutorialStep] = useState<number>(0);

  const handleTutorialStepChange = (step: number) => {
    setTutorialStep(step);
    if (step === 2) {
      const guadalupe = translatedApparitionsData.find(app => app.id === 'guadalupe_mexico');
      if (guadalupe) {
        setSelectedApparition(guadalupe);
      }
    } else if (step === 4) {
      setIsTimelineOpen(true);
    } else if (step === 0 || step === 1 || step === 3 || step === 5) {
      setSelectedApparition(null);
    }
  };

  const handleTutorialClose = () => {
    setIsTutorialActive(false);
    localStorage.setItem('stellamaris_tutorial_seen', 'true');
    setSelectedApparition(null);
    setIsTimelineOpen(true);
  };


  // Dynamically translate the selected apparition object
  const currentSelectedApparition = useMemo(() => {
    if (!selectedApparition) return null;
    return translatedApparitionsData.find(app => app.id === selectedApparition.id) || selectedApparition;
  }, [selectedApparition, translatedApparitionsData]);

  const handleSelectApparition = (apparition: Apparition | null) => {
    setSelectedApparition(apparition);
    if (apparition) {
      const idx = sortedFilteredApparitions.findIndex(a => a.id === apparition.id);
      if (idx !== -1) {
        setPlaybackIndex(idx);
      }
    }
    if (!isCinemaMode && isPlayingTimeline) {
      setIsPlayingTimeline(false);
    }
    setIsFiltersExpanded(false);
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

  // Interval loop for timeline playback (8.0s per event to give zoom/read time)
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
    }, 8000);

    return () => clearInterval(interval);
  }, [isPlayingTimeline, sortedFilteredApparitions]);

  // Auto-select apparition when playbackIndex ticks
  useEffect(() => {
    if (isPlayingTimeline && sortedFilteredApparitions[playbackIndex]) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedApparition(sortedFilteredApparitions[playbackIndex]);
    }
  }, [isPlayingTimeline, playbackIndex, sortedFilteredApparitions]);

  // Manage sidebar visibility delay during timeline playback to wait for flight animation
  useEffect(() => {
    if (isPlayingTimeline) {
      setIsSidebarVisible(false);
      const timer = setTimeout(() => {
        setIsSidebarVisible(true);
      }, 2200); // 2.2s delay covers the cinematic flight duration beautifully
      return () => clearTimeout(timer);
    } else {
      setIsSidebarVisible(true);
    }
  }, [playbackIndex, isPlayingTimeline]);

  const togglePlayTimeline = () => {
    if (isCinemaMode) {
      // If already in cinema mode, toggle play/pause state
      setIsPlayingTimeline(prev => !prev);
    } else {
      // Enter cinema mode and play
      setIsPlayingTimeline(true);
      setIsCinemaMode(true);
      setPlaybackIndex(0);
      if (sortedFilteredApparitions.length > 0) {
        setSelectedApparition(sortedFilteredApparitions[0]);
      }
    }
  };

  const exitCinemaMode = () => {
    setIsPlayingTimeline(false);
    setIsCinemaMode(false);
  };

  // Sliced data for GlobeViewer during playback
  const displayedApparitions = useMemo(() => {
    if (!isCinemaMode || !currentSelectedApparition) return filteredApparitions;
    return filteredApparitions.filter(a => a.year <= currentSelectedApparition.year);
  }, [isCinemaMode, currentSelectedApparition, filteredApparitions]);

  const hasPopups = isDirectoryOpen || !!currentSelectedApparition;

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {(isCinemaMode || (hasPopups && !isCinemaMode)) && (
        <div 
          className="glass-panel glass-panel-rounded animate-fade-in" 
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            zIndex: 40,
            padding: '16px 20px',
            background: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid var(--glass-border)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            gap: '12px',
            width: isCinemaMode ? '210px' : '230px',
            boxShadow: '0 15px 45px rgba(0,0,0,0.6)',
            pointerEvents: 'auto',
            transition: 'all 0.3s ease'
          }}
        >
          {isCinemaMode ? (
            <>
              {/* Play/Pause Button */}
              <button
                onClick={togglePlayTimeline}
                style={{
                  background: isPlayingTimeline ? '#ef4444' : 'var(--accent-color)',
                  color: '#fff',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '25px',
                  fontSize: '15px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: isPlayingTimeline ? '0 0 20px rgba(239, 68, 68, 0.45)' : '0 0 20px rgba(56, 189, 248, 0.45)',
                  transition: 'all 0.2s',
                  letterSpacing: '0.5px'
                }}
                onMouseOver={e => {
                  e.currentTarget.style.transform = 'scale(1.03)';
                  e.currentTarget.style.boxShadow = isPlayingTimeline ? '0 0 25px rgba(239, 68, 68, 0.65)' : '0 0 25px rgba(56, 189, 248, 0.65)';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = isPlayingTimeline ? '0 0 20px rgba(239, 68, 68, 0.45)' : '0 0 20px rgba(56, 189, 248, 0.45)';
                }}
              >
                {isPlayingTimeline ? <Pause size={16} /> : <Play size={16} />}
                <span>
                  {isPlayingTimeline 
                    ? (pauseTranslations[lang] || 'Pause')
                    : (resumeTranslations[lang] || 'Resume')
                  }
                </span>
              </button>

              {/* Exit Button */}
              <button
                onClick={exitCinemaMode}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#fff',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  padding: '12px 24px',
                  borderRadius: '25px',
                  fontSize: '15px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s',
                  letterSpacing: '0.5px'
                }}
                onMouseOver={e => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.transform = 'scale(1.03)';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.transform = 'none';
                }}
              >
                <X size={16} style={{ opacity: 0.8 }} />
                <span>{exitTranslations[lang] || 'Exit'}</span>
              </button>
            </>
          ) : (
            /* Włącz animację / Play Presentation when controls are hidden and sidebar is open */
            <button
              onClick={togglePlayTimeline}
              style={{
                background: 'linear-gradient(135deg, var(--accent-color), rgba(59, 130, 246, 0.85))',
                color: '#fff',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '25px',
                fontSize: '15px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 20px rgba(56, 189, 248, 0.35)',
                transition: 'all 0.2s',
                letterSpacing: '0.5px'
              }}
              onMouseOver={e => {
                e.currentTarget.style.transform = 'scale(1.03)';
                e.currentTarget.style.boxShadow = '0 6px 24px rgba(56, 189, 248, 0.55)';
                e.currentTarget.style.filter = 'brightness(1.1)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(56, 189, 248, 0.35)';
                e.currentTarget.style.filter = 'none';
              }}
            >
              <Play size={16} fill="#ffffff" />
              <span>
                {playPresentationTranslations[lang] || 'Play Presentation'}
              </span>
            </button>
          )}
        </div>
      )}
      {/* Left Control Panel */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        zIndex: 30,
        width: '320px',
        display: 'flex',
        flexDirection: 'column',
        gap: isTimelineOpen ? '0px' : '10px',
        pointerEvents: 'none',
        transform: (hasPopups || isCinemaMode) ? 'translateX(calc(-100% - 40px))' : 'translateX(0)',
        transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), gap 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
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

        {/* Collapsible interactive controls container */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          opacity: isTimelineOpen ? 0 : 1,
          maxHeight: isTimelineOpen ? '0px' : (isFiltersExpanded ? '600px' : '220px'),
          transform: isTimelineOpen ? 'translateY(-10px)' : 'translateY(0)',
          overflow: isTimelineOpen ? 'hidden' : 'visible',
          transition: 'opacity 0.3s ease, maxHeight 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s ease',
          pointerEvents: isTimelineOpen ? 'none' : 'auto'
        }}>
          {/* Quick Search */}
          <div style={{ pointerEvents: 'auto' }}>
            <SearchBar 
              apparitions={translatedApparitionsData} 
              onSelectApparition={handleSelectApparition} 
              lang={lang}
            />
          </div>

          {/* Action Row: Filters and Browse Directory */}
          <div style={{ display: 'flex', gap: '8px', pointerEvents: 'auto', width: '100%' }}>
            <FilterMenu 
              activeFilters={activeFilters} 
              onChange={setActiveFilters} 
              activeCenturies={activeCenturies}
              onChangeCenturies={setActiveCenturies}
              lang={lang}
              isExpanded={isFiltersExpanded}
              onToggleExpanded={setIsFiltersExpanded}
            />

            {!isFiltersExpanded && (
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
            )}
          </div>

          {/* Play Presentation Button */}
          {!isFiltersExpanded && (
            <button
              onClick={togglePlayTimeline}
              className="glass-panel glass-panel-rounded"
              style={{
                pointerEvents: 'auto',
                width: '100%',
                height: '42px',
                padding: '0 16px',
                background: 'linear-gradient(135deg, var(--accent-color), rgba(59, 130, 246, 0.8))',
                color: '#ffffff',
                border: 'none',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 16px rgba(56, 189, 248, 0.3)',
                transition: 'all 0.2s ease',
                letterSpacing: '0.3px'
              }}
              onMouseOver={e => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(56, 189, 248, 0.45)';
                e.currentTarget.style.filter = 'brightness(1.1)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(56, 189, 248, 0.3)';
                e.currentTarget.style.filter = 'none';
              }}
            >
              <Play size={15} fill="#ffffff" />
              <span>{playPresentationTranslations[lang] || 'Play Presentation'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Help / Onboarding Tutorial Button */}
      {!isCinemaMode && (
        <button
          onClick={() => {
            setIsTutorialActive(true);
            setTutorialStep(0);
          }}
          className="glass-panel glass-panel-rounded animate-fade-in"
          style={{
            position: 'absolute',
            top: '20px',
            right: '96px',
            zIndex: 100,
            pointerEvents: 'auto',
            width: '42px',
            height: '42px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(15, 23, 42, 0.8)',
            color: 'var(--text-color)',
            border: '1px solid var(--glass-border)',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
            transition: 'all 0.2s ease',
            borderRadius: '12px',
            outline: 'none'
          }}
          title="Onboarding Guide / Przewodnik"
          onMouseOver={e => {
            e.currentTarget.style.background = 'rgba(15, 23, 42, 0.95)';
            e.currentTarget.style.borderColor = 'rgba(56,189,248,0.3)';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseOut={e => {
            e.currentTarget.style.background = 'rgba(15, 23, 42, 0.8)';
            e.currentTarget.style.borderColor = 'var(--glass-border)';
            e.currentTarget.style.transform = 'none';
          }}
        >
          <HelpCircle size={20} color="var(--accent-color)" />
        </button>
      )}

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
        hidePlayPause={hasPopups || isTimelineOpen || isFiltersExpanded}
      />
      
      {currentSelectedApparition && (
        <Sidebar 
          apparition={currentSelectedApparition} 
          isVisible={isSidebarVisible}
          onClose={() => setSelectedApparition(null)} 
          allActiveApparitions={filteredApparitions}
          onSelectApparition={handleSelectApparition}
          lang={lang}
          isTimelineOpen={isTimelineOpen}
          isCinemaMode={isCinemaMode}
        />
      )}

      {filteredApparitions.length > 0 && (
        <TimelineOverlay
          apparitions={filteredApparitions}
          selectedApparition={currentSelectedApparition}
          onSelectApparition={handleSelectApparition}
          isPlaying={isPlayingTimeline}
          onTogglePlay={togglePlayTimeline}
          isCinemaMode={isCinemaMode}
          isOpen={isTimelineOpen}
          setIsOpen={setIsTimelineOpen}
          lang={lang}
        />
      )}

      <TutorialModal
        isOpen={isTutorialActive}
        onClose={handleTutorialClose}
        currentLang={lang}
        onLanguageChange={setLang}
        step={tutorialStep}
        onStepChange={handleTutorialStepChange}
      />
    </div>

  );
}

export default App;
