/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, X, Question, ArrowLeft, ArrowRight, Rewind, FastForward, MagnifyingGlass, Info } from '@phosphor-icons/react';

import GlobeViewer from './components/GlobeViewer';
import Sidebar from './components/Sidebar';
import TimelineOverlay from './components/TimelineOverlay';
import FilterMenu from './components/FilterMenu';
import { FILTER_CATEGORIES, categoryMapping, CENTURY_FILTERS } from './data/filters';
import SearchBar from './components/SearchBar';
import DirectoryModal from './components/DirectoryModal';
import LanguagePicker from './components/LanguagePicker';
import { lazy, Suspense } from 'react';
const TutorialModal = lazy(() => import('./components/TutorialModal'));
import { config } from './config';
import type { Apparition } from './data/apparitions';

const apparitionsData = config.getData();
import { t, translateApparitionsList, loadLanguageTranslations } from './utils/i18n';
import type { Language } from './utils/i18n';




// Translations moved to i18n.ts
function App() {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('stellamaris_lang') as Language;
    return saved || 'en';
  });

  const [langTranslations, setLangTranslations] = useState<Record<string, { title: string; location: string; country: string; description: string }>>({});

  useEffect(() => {
    localStorage.setItem('stellamaris_lang', lang);
    document.documentElement.lang = lang;
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
  const [playbackSpeedMultiplier, setPlaybackSpeedMultiplier] = useState(1);
    const [isLanguagePickerOpen, setIsLanguagePickerOpen] = useState(false);

  useEffect(() => {
    document.body.classList.add('dark-theme');
    localStorage.setItem('stellamaris_theme', 'dark');
  }, []);

  useEffect(() => {
    document.body.setAttribute('data-project-id', config.projectId);
  }, []);

  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname.substring(1);
      if (path && translatedApparitionsData.length > 0) {
        const found = translatedApparitionsData.find((a: Apparition) => a.id === path);
        if (found) {
          setSelectedApparition(found);
        } else {
          setSelectedApparition(null);
        }
      } else if (!path) {
        setSelectedApparition(null);
      }
    };

    handleUrlChange();

    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, [translatedApparitionsData]);

  const [isTutorialActive, setIsTutorialActive] = useState<boolean>(() => {
    const path = window.location.pathname.substring(1);
    if (path && path.length > 0) {
      localStorage.setItem('stellamaris_tutorial_seen', 'true');
      return false;
    }
    return localStorage.getItem('stellamaris_tutorial_seen') !== 'true';
  });
  const [tutorialStep, setTutorialStep] = useState<number>(0);

  // Mobile: which toolbar button tooltip is showing
  const [mobileTooltip, setMobileTooltip] = useState<string | null>(null);
  const tooltipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showTooltip = useCallback((id: string) => {
    setMobileTooltip(id);
    if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current);
    tooltipTimerRef.current = setTimeout(() => setMobileTooltip(null), 1800);
  }, []);

  const handleTutorialStepChange = (newStep: number) => {
    setTutorialStep(newStep);
    // Advancing TO step 5 (Search & filters) — close the apparition sidebar
    if (newStep === 5) {
      setSelectedApparition(null);
    }
  };

  // Centralized synchronization of panels and modal visibility based on tutorial step
  useEffect(() => {
    if (!isTutorialActive) return;

    setIsFiltersExpanded(false);

    if (tutorialStep === 7) {
      setIsDirectoryOpen(true);
    } else {
      setIsDirectoryOpen(false);
    }

    if (tutorialStep === 4) {
      // Step 4 = "Apparition details" — always ensure target sidebar is open
      if (!selectedApparition) {
        const targetId = config.projectId === 'eucharist' ? 'lanciano_italy' : 'guadalupe_mexico';
        const target = translatedApparitionsData.find(app => app.id === targetId) || translatedApparitionsData[0];
        if (target) {
          setSelectedApparition(target);
        }
      }
    } else if (tutorialStep === 10) {
      // Step 10 = "Watching the presentation" — let presentation selection flow naturally
    } else {
      // For all other steps, ensure the sidebar is closed
      setSelectedApparition(null);
    }
  }, [tutorialStep, isTutorialActive, translatedApparitionsData]);

  const handleTutorialClose = () => {
    setIsTutorialActive(false);
    localStorage.setItem('stellamaris_tutorial_seen', 'true');
    setSelectedApparition(null);
    setIsTimelineOpen(false);
  };


  // Dynamically translate the selected apparition object
  const currentSelectedApparition = useMemo(() => {
    if (!selectedApparition) return null;
    return translatedApparitionsData.find(app => app.id === selectedApparition.id) || selectedApparition;
  }, [selectedApparition, translatedApparitionsData]);

  const handleSelectApparition = (apparition: Apparition | null) => {
    setSelectedApparition(apparition);
    if (apparition) {
      window.history.pushState(null, '', `/${apparition.id}`);
      const idx = sortedFilteredApparitions.findIndex(a => a.id === apparition.id);
      if (idx !== -1) {
        setPlaybackIndex(idx);
      }
      if (isTutorialActive && (tutorialStep === 1 || tutorialStep === 2 || tutorialStep === 3 || tutorialStep === 4)) {
        setTutorialStep(4);
      }
    } else {
      window.history.pushState(null, '', '/');
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
    }, 8000 / playbackSpeedMultiplier);

    return () => clearInterval(interval);
  }, [isPlayingTimeline, sortedFilteredApparitions, playbackSpeedMultiplier]);

  // Auto-select apparition when playbackIndex ticks
  useEffect(() => {
    if (isCinemaMode && sortedFilteredApparitions[playbackIndex]) {
      setSelectedApparition(sortedFilteredApparitions[playbackIndex]);
    }
  }, [isCinemaMode, playbackIndex, sortedFilteredApparitions]);

  // Re-sync playback index if filtered apparitions change during cinema mode
  useEffect(() => {
    if (isCinemaMode) {
      if (sortedFilteredApparitions.length === 0) {
        setIsPlayingTimeline(false);
        setIsCinemaMode(false);
        return;
      }
      
      setPlaybackIndex(prevIdx => {
        if (selectedApparition) {
          const newIdx = sortedFilteredApparitions.findIndex(a => a.id === selectedApparition.id);
          if (newIdx !== -1) {
            return newIdx === prevIdx ? prevIdx : newIdx;
          }
        }
        return prevIdx >= sortedFilteredApparitions.length ? Math.max(0, sortedFilteredApparitions.length - 1) : prevIdx;
      });
    }
  }, [sortedFilteredApparitions, isCinemaMode, selectedApparition]);

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
      if (isTutorialActive && tutorialStep === 9) {
        setTutorialStep(10);
      }
    }
  };

  const exitCinemaMode = () => {
    setIsPlayingTimeline(false);
    setIsCinemaMode(false);
    setSelectedApparition(null);
    setIsTimelineOpen(false);
    if (isTutorialActive && tutorialStep === 10) {
      setTutorialStep(9);
    }
  };

  const handlePrevPresentation = () => {
    if (sortedFilteredApparitions.length === 0) return;
    setPlaybackIndex(prev => {
      const next = prev - 1;
      if (next < 0) return 0;
      return next;
    });
  };

  const handleNextPresentation = () => {
    if (sortedFilteredApparitions.length === 0) return;
    setPlaybackIndex(prev => {
      const next = prev + 1;
      if (next >= sortedFilteredApparitions.length) return sortedFilteredApparitions.length - 1;
      return next;
    });
  };

  // Sliced data for GlobeViewer during playback
  const displayedApparitions = useMemo(() => {
    if (isTutorialActive) {
      if (tutorialStep >= 1 && tutorialStep <= 4) {
        // Return only target for steps 1 to 4 to keep the map clean
        const targetId = config.projectId === 'eucharist' ? 'lanciano_italy' : 'guadalupe_mexico';
        const target = translatedApparitionsData.find(a => a.id === targetId) || translatedApparitionsData[0];
        return target ? [target] : [];
      }
      // If we are in cinema mode during tutorial, restrict to current selection to keep it clean
      if (isCinemaMode && currentSelectedApparition) {
        return [currentSelectedApparition];
      }
      return translatedApparitionsData;
    }
    if (!isCinemaMode || !currentSelectedApparition) return filteredApparitions;
    return [currentSelectedApparition];
  }, [isCinemaMode, currentSelectedApparition, filteredApparitions, isTutorialActive, translatedApparitionsData, tutorialStep]);

  const hasPopups = isDirectoryOpen || !!currentSelectedApparition;
  const isSidebarOpen = isSidebarVisible && !!currentSelectedApparition && !(isTutorialActive && tutorialStep === 3);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {!isTutorialActive && isCinemaMode && (
        <div 
          className="glass-panel glass-panel-rounded animate-fade-in" 
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            zIndex: 40,
            padding: '16px 20px',
            background: 'rgba(28, 28, 30, 0.95)',
            border: '1px solid var(--glass-border)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            gap: '12px',
            width: isCinemaMode ? '280px' : '230px',
            boxShadow: '0 15px 45px rgba(0,0,0,0.6)',
            pointerEvents: 'auto',
            transition: 'all 0.3s ease'
          }}
        >
          {isCinemaMode ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                <button
                  onClick={() => setPlaybackSpeedMultiplier(prev => Math.max(0.5, prev / 2))}
                  title="Slow Down"
                  style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', opacity: playbackSpeedMultiplier > 0.5 ? 0.8 : 0.3, padding: '6px', transition: 'opacity 0.2s' }}
                  disabled={playbackSpeedMultiplier <= 0.5}
                >
                  <Rewind size={22} />
                </button>
                <button
                  onClick={handlePrevPresentation}
                  title="Previous Apparition"
                  style={{ pointerEvents: playbackIndex <= 0 ? 'none' : 'auto', background: 'transparent', border: 'none', color: '#fff', cursor: playbackIndex <= 0 ? 'default' : 'pointer', opacity: playbackIndex <= 0 ? 0.3 : 0.8, padding: '6px', transition: 'opacity 0.2s' }}
                  onMouseOver={e => { if (playbackIndex > 0) e.currentTarget.style.opacity = '1'; }}
                  onMouseOut={e => { if (playbackIndex > 0) e.currentTarget.style.opacity = '0.8'; }}
                  disabled={playbackIndex <= 0}
                >
                  <ArrowLeft size={24} />
                </button>
                
                <button
                  onClick={togglePlayTimeline}
                  style={{
                    background: isPlayingTimeline 
                      ? '#ef4444' 
                      : (config.projectId === 'eucharist' ? 'linear-gradient(135deg, #d99726, #3b82f6)' : 'var(--accent-color)'),
                    color: '#fff',
                    border: 'none',
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: isPlayingTimeline 
                      ? '0 0 15px rgba(239, 68, 68, 0.45)' 
                      : (config.projectId === 'eucharist' ? '0 0 15px rgba(217, 151, 38, 0.45)' : '0 0 15px rgba(56, 189, 248, 0.45)'),
                    transition: 'all 0.2s',
                    flexShrink: 0
                  }}
                  onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'none'}
                >
                  {isPlayingTimeline ? <Pause size={24} weight="bold" /> : <Play size={24} weight="bold" style={{ marginLeft: '2px' }} />}
                </button>

                <button
                  onClick={handleNextPresentation}
                  title="Next Apparition"
                  style={{ pointerEvents: playbackIndex >= sortedFilteredApparitions.length - 1 ? 'none' : 'auto', background: 'transparent', border: 'none', color: '#fff', cursor: playbackIndex >= sortedFilteredApparitions.length - 1 ? 'default' : 'pointer', opacity: playbackIndex >= sortedFilteredApparitions.length - 1 ? 0.3 : 0.8, padding: '6px', transition: 'opacity 0.2s' }}
                  onMouseOver={e => { if (playbackIndex < sortedFilteredApparitions.length - 1) e.currentTarget.style.opacity = '1'; }}
                  onMouseOut={e => { if (playbackIndex < sortedFilteredApparitions.length - 1) e.currentTarget.style.opacity = '0.8'; }}
                  disabled={playbackIndex >= sortedFilteredApparitions.length - 1}
                >
                  <ArrowRight size={24} />
                </button>
                <button
                  onClick={() => setPlaybackSpeedMultiplier(prev => Math.min(4, prev * 2))}
                  title="Speed Up"
                  style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', opacity: playbackSpeedMultiplier < 4 ? 0.8 : 0.3, padding: '6px', transition: 'opacity 0.2s' }}
                  disabled={playbackSpeedMultiplier >= 4}
                >
                  <FastForward size={22} />
                </button>
              </div>
              
              <div style={{ textAlign: 'center', fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>
                {playbackSpeedMultiplier}x Speed
              </div>
              
              {/* Exit Button */}
              <button
                onClick={exitCinemaMode}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#fff',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  padding: '10px 20px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '4px',
                  transition: 'all 0.2s'
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
                <span>{t('exit', lang)}</span>
              </button>
            </div>
          ) : (
            /* Włącz animację / Play Presentation when controls are hidden and sidebar is open */
            <button
              onClick={togglePlayTimeline}
              style={{
                background: config.projectId === 'eucharist'
                  ? 'linear-gradient(135deg, #d99726, #3b82f6)'
                  : 'linear-gradient(135deg, var(--accent-color), rgba(59, 130, 246, 0.85))',
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
                boxShadow: config.projectId === 'eucharist'
                  ? '0 4px 20px rgba(217, 151, 38, 0.35)'
                  : '0 4px 20px rgba(56, 189, 248, 0.35)',
                transition: 'all 0.2s',
                letterSpacing: '0.5px'
              }}
              onMouseOver={e => {
                e.currentTarget.style.transform = 'scale(1.03)';
                e.currentTarget.style.boxShadow = config.projectId === 'eucharist'
                  ? '0 6px 24px rgba(217, 151, 38, 0.55)'
                  : '0 6px 24px rgba(56, 189, 248, 0.55)';
                e.currentTarget.style.filter = 'brightness(1.1)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = config.projectId === 'eucharist'
                  ? '0 4px 20px rgba(217, 151, 38, 0.35)'
                  : '0 4px 20px rgba(56, 189, 248, 0.35)';
                e.currentTarget.style.filter = 'none';
              }}
            >
              <Play size={16} weight="bold" fill="#ffffff" />
              <span>
                {t('playPresentation', lang)}
              </span>
            </button>
          )}
        </div>
      )}
      {/* Left Control Panel */}
      <div className="desktop-left-panel" style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        zIndex: 30,
        width: '320px',
        display: 'flex',
        flexDirection: 'column',
        gap: isTimelineOpen ? '0px' : '10px',
        pointerEvents: isTutorialActive && tutorialStep < 5 ? 'none' : 'auto',
        opacity: isTutorialActive && tutorialStep < 5 ? 0.35 : 1,
        transform: (isCinemaMode || isDirectoryOpen) ? 'translateX(calc(-100% - 40px))' : 'translateX(0)',
        transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), gap 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease'
      }}>
        {/* Title Card removed */}

        {/* Collapsible interactive controls container */}
        <div id="search-filters-container" style={{
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

          {/* Action Row: Filters, Catalogue and Play/Pause */}
          <div id="action-row-container" style={{ display: 'flex', gap: '10px', pointerEvents: 'auto', width: '100%', alignItems: 'center' }}>
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
              <>
                <button
                  id="browse-directory-button"
                  onClick={() => setIsDirectoryOpen(true)}
                  className="glass-panel glass-panel-rounded animate-fade-in"
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    background: 'var(--glass-bg)',
                    color: 'var(--text-color)',
                    border: '1px solid var(--glass-border)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--box-shadow)',
                    transition: 'all 0.2s ease',
                    fontSize: '22px',
                    outline: 'none',
                    padding: '0'
                  }}
                  title={t('browseDirectory', lang, { count: filteredApparitions.length })}
                  aria-label={t('browseDirectory', lang, { count: filteredApparitions.length })}
                  onMouseOver={e => {
                    e.currentTarget.style.background = 'var(--glass-border)';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.background = 'var(--glass-bg)';
                  }}
                >
                  📋
                </button>

                {!isTutorialActive && (
                  <button
                    id="play-presentation-button"
                    onClick={togglePlayTimeline}
                    className="glass-panel glass-panel-rounded animate-fade-in"
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      background: 'var(--glass-bg)',
                      color: 'var(--text-color)',
                      border: '1px solid var(--glass-border)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: 'var(--box-shadow)',
                      transition: 'all 0.2s ease',
                      fontSize: '22px',
                      outline: 'none',
                      padding: '0'
                    }}
                    title={isPlayingTimeline ? (lang === 'pl' ? 'Wstrzymaj prezentację' : 'Pause Presentation') : t('playPresentation', lang)}
                    aria-label={isPlayingTimeline ? (lang === 'pl' ? 'Wstrzymaj prezentację' : 'Pause Presentation') : t('playPresentation', lang)}
                    onMouseOver={e => {
                      e.currentTarget.style.background = 'var(--glass-border)';
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.background = 'var(--glass-bg)';
                    }}
                  >
                    {isPlayingTimeline ? '⏸️' : '▶️'}
                  </button>
                )}
              </>
            )}
          </div>

          {/* Additional Info Link */}
          {!isFiltersExpanded && (
            <a
              href="https://idiotajezusa.pl"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 12px',
                background: 'var(--glass-bg)',
                color: 'var(--text-color)',
                border: '1px solid var(--glass-border)',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: 600,
                textDecoration: 'none',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                pointerEvents: 'auto',
                width: 'max-content',
                transition: 'all 0.2s',
                boxShadow: 'var(--box-shadow)'
              }}
              onMouseOver={e => {
                e.currentTarget.style.background = 'var(--text-color)';
                e.currentTarget.style.color = 'var(--bg-color)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = 'var(--glass-bg)';
                e.currentTarget.style.color = 'var(--text-color)';
              }}
            >
              <Info size={14} weight="bold" />
              <span>{lang === 'pl' ? 'Więcej od Idiota Jezusa' : 'More by Idiota Jezusa'}</span>
            </a>
          )}
        </div>
      </div>

      {/* Help / Onboarding Tutorial Button */}
      {!isCinemaMode && !isSidebarOpen && !isTutorialActive && (
        <button
          className="desktop-help-btn glass-panel glass-panel-rounded animate-fade-in"
          onClick={() => {
            setIsTutorialActive(true);
            setTutorialStep(0);
            setSelectedApparition(null);
            setIsTimelineOpen(false);
          }}
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
          title={t('helpGuide', lang)}
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
          <Question size={20} color="var(--accent-color)" weight="bold" />
        </button>
      )}

      {/* Top Right Language Switcher */}
      {!isSidebarOpen && !isCinemaMode && !isTutorialActive && (
        <div className="desktop-lang-picker">
          <LanguagePicker 
            currentLang={lang} 
            onLanguageChange={setLang} 
            onOpenChange={setIsLanguagePickerOpen}
          />
        </div>
      )}

      {/* Floating Filter Menu for Cinema Mode */}
      {isCinemaMode && (
        <div style={{
          position: 'absolute',
          top: '210px',
          left: '20px',
          zIndex: 150,
        }}>
          <FilterMenu 
            activeFilters={activeFilters} 
            onChange={setActiveFilters} 
            activeCenturies={activeCenturies}
            onChangeCenturies={setActiveCenturies}
            lang={lang}
            isExpanded={isFiltersExpanded}
            onToggleExpanded={setIsFiltersExpanded}
          />
        </div>
      )}

      <DirectoryModal
        isOpen={isDirectoryOpen}
        onClose={() => {
          setIsDirectoryOpen(false);
          if (isTutorialActive && tutorialStep === 7) {
            setTutorialStep(7);
          }
        }}
        apparitions={filteredApparitions}
        onSelectApparition={handleSelectApparition}
        lang={lang}
        activeFilters={activeFilters}
        onChangeFilters={setActiveFilters}
        activeCenturies={activeCenturies}
        onChangeCenturies={setActiveCenturies}
      />

      <div style={{ pointerEvents: isTutorialActive && tutorialStep !== 1 && tutorialStep !== 3 ? 'none' : 'auto', width: '100%', height: '100%' }}>
          <GlobeViewer 
        apparitions={displayedApparitions} 
        selectedApparition={currentSelectedApparition}
        onSelectApparition={handleSelectApparition} 
        isTimelineOpen={isTimelineOpen}
        lang={lang}
        hidePlayPause={hasPopups || isTimelineOpen || isFiltersExpanded}
        isTutorialActive={isTutorialActive}
        tutorialStep={tutorialStep}
        isCinemaMode={isCinemaMode}
        isDarkMode={true}
      />
        </div>
      
      {currentSelectedApparition && (
        <Sidebar 
          apparition={currentSelectedApparition} 
          isVisible={isSidebarVisible}
          onClose={() => {
            setSelectedApparition(null);
            if (isTutorialActive && tutorialStep === 4) {
              setTutorialStep(5); // Advance: "Apparition details" → "Search & filters"
            }
          }} 
          allActiveApparitions={filteredApparitions}
          onSelectApparition={handleSelectApparition}
          lang={lang}
          isTimelineOpen={isTimelineOpen}
          isCinemaMode={isCinemaMode}
          projectId={config.projectId}
        />
      )}

      {filteredApparitions.length > 0 && (!isTutorialActive || (tutorialStep >= 8 && tutorialStep <= 11)) && (
        <TimelineOverlay
          apparitions={filteredApparitions}
          selectedApparition={currentSelectedApparition}
          onSelectApparition={handleSelectApparition}
          isPlaying={isPlayingTimeline}
          onTogglePlay={togglePlayTimeline}
          isCinemaMode={isCinemaMode}
          isOpen={isTimelineOpen}
          setIsOpen={(open) => {
            setIsTimelineOpen(open);
            if (open && isTutorialActive && tutorialStep === 8) {
              setTutorialStep(8);
            } else if (!open && isTutorialActive && tutorialStep === 9) {
              setTutorialStep(9);
            }
          }}
          lang={lang}
          hideTriggerButton={isLanguagePickerOpen}
        />
      )}

      {/* Tutorial click-blocker: transparent overlay blocks all clicks on background UI.
          At steps 0-8 and 10-11: zIndex 120 (above most UI, below tutorial modal 130).
          At step 9 specifically: zIndex 165 to also block the timeline pill (zIndex 160).
          Tutorial modal zIndex is 130 — we need it above even the step-9 blocker,
          so the tutorial card style uses zIndex 170 at step 9 (see TutorialModal cardStyle).
          Disabled at steps 1 (user rotates globe) and 4 (user clicks marker). */}
      {isTutorialActive && tutorialStep !== 1 && tutorialStep !== 3 && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: tutorialStep === 8 ? 165 : 120,
          pointerEvents: 'all',
          background: 'transparent',
          cursor: 'default'
        }} />
      )}

      <Suspense fallback={null}>
        {isTutorialActive && (
<TutorialModal
        isOpen={isTutorialActive}
        onClose={handleTutorialClose}
        currentLang={lang}
        onLanguageChange={setLang}
        step={tutorialStep}
        onStepChange={handleTutorialStepChange}
        isTimelineOpen={isTimelineOpen}
        setIsTimelineOpen={setIsTimelineOpen}
      />        )}
      </Suspense>

      {/* ── Mobile Toolbar (Google Earth–style) ── */}
      {!isCinemaMode && !isTutorialActive && (
        <div className="mob-toolbar">
          {/* Search */}
          <button
            className={`mob-btn${mobileTooltip === 'search' ? ' tooltip-visible' : ''}`}
            aria-label="Search apparitions"
            onClick={() => {
              showTooltip('search');
              // Focus the search input if present
              const inp = document.querySelector<HTMLInputElement>('input[type="text"], input[placeholder]');
              if (inp) inp.focus();
              // Show the desktop left panel temporarily by scrolling to it / making it visible
              // On mobile we just reveal a search that already works. Re-use the desktop SearchBar
              // by toggling a hidden class. For now open the directory as the search surface.
              setIsDirectoryOpen(true);
            }}
          >
            <MagnifyingGlass size={22} color="#1a1a1a" />
            <span className="mob-btn-tooltip">Search</span>
          </button>

          {/* Filters */}
          <button
            className={`mob-btn${(isFiltersExpanded || mobileTooltip === 'filters') ? ' tooltip-visible' : ''}${isFiltersExpanded ? ' mob-btn--active' : ''}`}
            aria-label="Filters"
            onClick={() => {
              showTooltip('filters');
              setIsFiltersExpanded(prev => !prev);
            }}
          >
            <span style={{ fontSize: 22 }}>🎚️</span>
            <span className="mob-btn-tooltip">Filters</span>
          </button>

          {/* Browse Directory */}
          <button
            className={`mob-btn${mobileTooltip === 'browse' ? ' tooltip-visible' : ''}`}
            aria-label="Browse directory"
            onClick={() => {
              showTooltip('browse');
              setIsDirectoryOpen(true);
            }}
          >
            <span style={{ fontSize: 22 }}>📋</span>
            <span className="mob-btn-tooltip">Directory</span>
          </button>

          <div className="mob-toolbar-divider" />

          {/* Play Presentation */}
          <button
            className={`mob-btn${mobileTooltip === 'play' ? ' tooltip-visible' : ''}${isCinemaMode ? ' mob-btn--active' : ''}`}
            aria-label="Play presentation"
            onClick={() => {
              showTooltip('play');
              togglePlayTimeline();
            }}
          >
            <span style={{ fontSize: 22 }}>▶️</span>
            <span className="mob-btn-tooltip">Play Presentation</span>
          </button>

          {/* Timeline */}
          <button
            className={`mob-btn${(isTimelineOpen || mobileTooltip === 'timeline') ? ' tooltip-visible' : ''}${isTimelineOpen ? ' mob-btn--active' : ''}`}
            aria-label="Timeline"
            onClick={() => {
              showTooltip('timeline');
              setIsTimelineOpen(prev => !prev);
            }}
          >
            <span style={{ fontSize: 22 }}>📅</span>
            <span className="mob-btn-tooltip">Timeline</span>
          </button>

          <div className="mob-toolbar-divider" />

          {/* Language */}
          <button
            className={`mob-btn${mobileTooltip === 'lang' ? ' tooltip-visible' : ''}`}
            aria-label="Language"
            onClick={() => {
              showTooltip('lang');
              // Cycle through common languages
              const langs = ['en','pl','es','pt','fr','it','vi','ar','tl','tr','ko'] as const;
              const idx = langs.indexOf(lang as typeof langs[number]);
              const next = langs[(idx + 1) % langs.length];
              setLang(next);
            }}
          >
            <span style={{ fontSize: 22 }}>🌐</span>
            <span className="mob-btn-tooltip">Language: {lang.toUpperCase()}</span>
          </button>

          {/* Help */}
          <button
            className={`mob-btn${mobileTooltip === 'help' ? ' tooltip-visible' : ''}`}
            aria-label="Help"
            onClick={() => {
              showTooltip('help');
              setIsTutorialActive(true);
              setTutorialStep(0);
              setSelectedApparition(null);
              setIsTimelineOpen(false);
            }}
          >
            <span style={{ fontSize: 22 }}>❓</span>
            <span className="mob-btn-tooltip">Guide</span>
          </button>

          {/* Theme Toggle */}
          {false && (
            <button
              className={`mob-btn${mobileTooltip === 'theme' ? ' tooltip-visible' : ''}`}
              aria-label="Toggle Theme"
              onClick={() => {
                showTooltip('theme');
// setIsDarkMode(prev => !prev);
              }}
            >
              <span style={{ fontSize: 22 }}>'🌙'</span>
              <span className="mob-btn-tooltip">'Dark Mode'</span>
            </button>
          )}
        </div>
      )}

      {/* Mobile Filter Panel overlay (shown when filters expanded on mobile) */}
      {isFiltersExpanded && (
        <div
          className="mob-filter-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 250,
            flexDirection: 'column',
            justifyContent: 'flex-end',
          }}
          onClick={() => setIsFiltersExpanded(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="animate-fade-in"
            style={{
              background: 'rgba(15,23,42,0.98)',
              borderRadius: '20px',
              padding: '24px 20px',
              boxShadow: '0 -8px 40px rgba(0,0,0,0.6)',
              maxHeight: '80vh',
              overflowY: 'auto',
              width: '90%',
              maxWidth: '360px',
              margin: '0 auto 20px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>🔍 Filters</span>
              <button onClick={() => setIsFiltersExpanded(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 20, opacity: 0.7 }}>✕</button>
            </div>
            <FilterMenu
              activeFilters={activeFilters}
              onChange={setActiveFilters}
              activeCenturies={activeCenturies}
              onChangeCenturies={setActiveCenturies}
              lang={lang}
              isExpanded={true}
              onToggleExpanded={setIsFiltersExpanded}
              forceTab={undefined}
            />
          </div>
        </div>
      )}

      {/* Bug Report Modal */}

    </div>

  );
}

export default App;
