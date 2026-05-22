import React, { useEffect } from 'react';
import { X, ArrowRight, ArrowLeft, Globe, Sidebar as SidebarIcon, Sliders, Calendar, Sparkles, HelpCircle } from 'lucide-react';
import type { Language } from '../utils/i18n';
import { languageNames } from '../utils/i18n';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  step: number;
  onStepChange: (step: number) => void;
}

const LANGUAGE_FLAG_CODES: Record<Language, string> = {
  en: 'gb',
  pl: 'pl',
  es: 'es',
  pt: 'pt',
  fr: 'fr',
  it: 'it',
  ar: 'sa',
  tl: 'ph',
  vi: 'vn',
  tr: 'tr'
};

const tutorialTranslations = {
  en: {
    skip: 'Skip Tour',
    next: 'Next',
    back: 'Back',
    finish: 'Start Exploring',
    start: 'Start Tour',
    step: 'Step',
    of: 'of'
  },
  pl: {
    skip: 'Pomiń przewodnik',
    next: 'Dalej',
    back: 'Wstecz',
    finish: 'Rozpocznij odkrywanie',
    start: 'Rozpocznij przewodnik',
    step: 'Krok',
    of: 'z'
  },
  es: {
    skip: 'Omitir tutorial',
    next: 'Siguiente',
    back: 'Atrás',
    finish: 'Comenzar a explorar',
    start: 'Iniciar tutorial',
    step: 'Paso',
    of: 'de'
  },
  pt: {
    skip: 'Pular tutorial',
    next: 'Avançar',
    back: 'Voltar',
    finish: 'Começar a explorar',
    start: 'Iniciar tutorial',
    step: 'Passo',
    of: 'de'
  },
  fr: {
    skip: 'Passer le tour',
    next: 'Suivant',
    back: 'Retour',
    finish: 'Commencer l’exploration',
    start: 'Lancer le guide',
    step: 'Étape',
    of: 'sur'
  },
  it: {
    skip: 'Salta tutorial',
    next: 'Avanti',
    back: 'Indietro',
    finish: 'Inizia a esplorare',
    start: 'Avvia tutorial',
    step: 'Passo',
    of: 'di'
  },
  ar: {
    skip: 'تخطي الجولة',
    next: 'التالي',
    back: 'السابق',
    finish: 'بدء الاستكشاف',
    start: 'بدء الجولة',
    step: 'الخطوة',
    of: 'من'
  },
  tl: {
    skip: 'Laktawan ang Tour',
    next: 'Susunod',
    back: 'Balik',
    finish: 'Simulan ang Paggagalugad',
    start: 'Simulan ang Tour',
    step: 'Hakbang',
    of: 'ng'
  },
  vi: {
    skip: 'Bỏ qua hướng dẫn',
    next: 'Tiếp tục',
    back: 'Quay lại',
    finish: 'Bắt đầu khám phá',
    start: 'Bắt đầu hướng dẫn',
    step: 'Bước',
    of: 'trên'
  },
  tr: {
    skip: 'Rehberi Geç',
    next: 'İleri',
    back: 'Geri',
    finish: 'Keşfetmeye Başla',
    start: 'Rehberi Başlat',
    step: 'Adım',
    of: '/'
  }
};

interface StepContent {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const getStepsContent = (lang: Language): StepContent[] => {
  const steps: Partial<Record<Language, StepContent[]>> & { en: StepContent[] } = {
    en: [
      {
        title: "Stella Maris Onboarding",
        description: "Stella Maris is an interactive 3D map documenting historical Marian apparitions globally. Let's take a quick guided tour to explore the controls.",
        icon: <HelpCircle size={40} color="var(--gold-accent)" />
      },
      {
        title: "Explore the 3D Globe",
        description: "Left-click and drag the Earth to rotate it. Scroll your mouse wheel to zoom in and out. Click on any colored marker to view the details of that apparition.",
        icon: <Globe size={40} color="var(--accent-color)" />
      },
      {
        title: "Apparition Information",
        description: "Selecting a marker opens the Information Panel on the right. Here you can read a description, view the approval status, and visit documented sources.",
        icon: <SidebarIcon size={40} color="var(--accent-color)" />
      },
      {
        title: "Search & Filters",
        description: "Use the left panel to search for specific shrines, filter by approval status, filter by historical century, or browse the complete directory list.",
        icon: <Sliders size={40} color="var(--accent-color)" />
      },
      {
        title: "Timeline & Presentation",
        description: "Open the timeline at the bottom to see how events unfolded chronologically. Click 'Play Presentation' to start a cinematic tour that automatically flies you from one event to the next!",
        icon: <Calendar size={40} color="var(--accent-color)" />
      },
      {
        title: "Glory to Jesus!",
        description: "You are ready to begin. The app is loaded with all events. Enjoy your journey through the history of Stella Maris! Mary Mother of God, glory through Her to Jesus.",
        icon: <Sparkles size={40} color="var(--gold-accent)" />
      }
    ],
    pl: [
      {
        title: "Stella Maris Wprowadzenie",
        description: "Stella Maris to interaktywna mapa 3D przedstawiająca historyczne objawienia maryjne na całym świecie. Zapraszamy na krótki przewodnik po funkcjach programu.",
        icon: <HelpCircle size={40} color="var(--gold-accent)" />
      },
      {
        title: "Odkrywaj Globus 3D",
        description: "Kliknij lewym przyciskiem myszy i przeciągnij Ziemię, aby ją obracać. Użyj kółka myszy, aby przybliżać i oddalać. Kliknij dowolny kolorowy znacznik, aby zobaczyć szczegóły danego objawienia.",
        icon: <Globe size={40} color="var(--accent-color)" />
      },
      {
        title: "Informacje o Objawieniu",
        description: "Wybór znacznika otwiera panel informacyjny po prawej. Przeczytasz tu opis objawienia, sprawdzisz status zatwierdzenia przez Kościół oraz znajdziesz linki do źródeł.",
        icon: <SidebarIcon size={40} color="var(--accent-color)" />
      },
      {
        title: "Wyszukiwanie i Filtry",
        description: "Użyj lewego panelu, aby wyszukać konkretne sanktuaria, przefiltrować objawienia według stuleci lub otworzyć pełny spis w katalogu.",
        icon: <Sliders size={40} color="var(--accent-color)" />
      },
      {
        title: "Oś Czasu i Prezentacja",
        description: "Otwórz oś czasu na dole, aby zobaczyć wydarzenia w porządku chronologicznym. Kliknij 'Uruchom prezentację', aby rozpocząć kinową podróż, która automatycznie przeniesie Cię od jednego wydarzenia do drugiego!",
        icon: <Calendar size={40} color="var(--accent-color)" />
      },
      {
        title: "Chwała Jezusowi!",
        description: "Jesteś gotowy, aby rozpocząć. Program zawiera wszystkie historyczne wydarzenia. Dobrej podróży przez historię Stella Maris! Maryja Matka Boża, chwała przez Nią Jezusowi.",
        icon: <Sparkles size={40} color="var(--gold-accent)" />
      }
    ],
    es: [
      {
        title: "Introducción a Stella Maris",
        description: "Stella Maris es un mapa 3D interactivo que documenta las apariciones marianas históricas a nivel mundial. Hagamos un breve recorrido guiado para conocer los controles.",
        icon: <HelpCircle size={40} color="var(--gold-accent)" />
      },
      {
        title: "Explorar el Globo 3D",
        description: "Haga clic izquierdo y arrastre la Tierra para girarla. Use la rueda del mouse para acercar y alejar. Haga clic en cualquier marcador de color para ver los detalles de esa aparición.",
        icon: <Globe size={40} color="var(--accent-color)" />
      },
      {
        title: "Información de la Aparición",
        description: "Al seleccionar un marcador, se abre el panel de información a la derecha. Aquí puede leer una descripción, ver el estado de aprobación y visitar las fuentes documentadas.",
        icon: <SidebarIcon size={40} color="var(--accent-color)" />
      },
      {
        title: "Búsqueda y Filtros",
        description: "Use el panel izquierdo para buscar santuarios específicos, filtrar por estado de aprobación, filtrar por siglo histórico o explorar el directorio completo.",
        icon: <Sliders size={40} color="var(--accent-color)" />
      },
      {
        title: "Línea de Tiempo y Presentación",
        description: "Abra la línea de tiempo en la parte inferior para ver los eventos cronológicamente. ¡Haga clic en 'Iniciar presentación' para comenzar un recorrido cinematográfico que lo llevará automáticamente de un evento al siguiente!",
        icon: <Calendar size={40} color="var(--accent-color)" />
      },
      {
        title: "¡Gloria a Jesús!",
        description: "Está listo para comenzar. La aplicación está cargada con todos los eventos. ¡Disfrute de su viaje a través de la historia de Stella Maris! María Madre de Dios, gloria por Ella a Jesús.",
        icon: <Sparkles size={40} color="var(--gold-accent)" />
      }
    ],
    pt: [
      {
        title: "Introdução ao Stella Maris",
        description: "Stella Maris é um mapa 3D interativo que documenta as aparições marianas históricas no mundo inteiro. Vamos fazer um breve tour guiado para conhecer os controles.",
        icon: <HelpCircle size={40} color="var(--gold-accent)" />
      },
      {
        title: "Explorar o Globo 3D",
        description: "Clique com o botão esquerdo e arraste a Terra para girá-la. Use a roda do mouse para aproximar e afastar. Clique em qualquer marcador colorido para ver os detalhes da aparição.",
        icon: <Globe size={40} color="var(--accent-color)" />
      },
      {
        title: "Informações sobre a Aparição",
        description: "Ao selecionar um marcador, o painel de informações se abre à direita. Aqui você pode ler uma descrição, verificar o status de aprovação e acessar as fontes documentadas.",
        icon: <SidebarIcon size={40} color="var(--accent-color)" />
      },
      {
        title: "Pesquisa e Filtros",
        description: "Use o painel esquerdo para pesquisar santuários específicos, filtrar por status de aprovação, filtrar por século histórico ou navegar pela lista completa do diretório.",
        icon: <Sliders size={40} color="var(--accent-color)" />
      },
      {
        title: "Linha do Tempo e Apresentação",
        description: "Abra a linha do tempo na parte inferior para ver os eventos cronologicamente. Clique em 'Iniciar apresentação' para começar uma viagem cinematográfica que o levará automaticamente de um evento ao seguinte!",
        icon: <Calendar size={40} color="var(--accent-color)" />
      },
      {
        title: "Glória a Jesus!",
        description: "Você está pronto para começar. O aplicativo está carregado com todos os eventos. Aproveite a sua jornada pela história do Stella Maris! Maria Mãe de Deus, glória por Ela a Jesus.",
        icon: <Sparkles size={40} color="var(--gold-accent)" />
      }
    ],
    fr: [
      {
        title: "Introduction à Stella Maris",
        description: "Stella Maris est une carte interactive 3D documentant les apparitions mariales historiques à travers le monde. Faisons un court guide pour découvrir les contrôles.",
        icon: <HelpCircle size={40} color="var(--gold-accent)" />
      },
      {
        title: "Explorer le Globe 3D",
        description: "Faites un clic gauche et glissez pour tourner la Terre. Utilisez la molette de la souris pour zoomer et dézoomer. Cliquez sur un marqueur coloré pour voir les détails de cette apparition.",
        icon: <Globe size={40} color="var(--accent-color)" />
      },
      {
        title: "Informations sur l'Apparition",
        description: "La sélection d'un marqueur ouvre le panneau d'informations sur la droite. Vous pouvez y lire une description, voir le statut d'approbation et visiter les sources documentées.",
        icon: <SidebarIcon size={40} color="var(--accent-color)" />
      },
      {
        title: "Recherche et Filtres",
        description: "Utilisez le panneau gauche pour rechercher des sanctuaires spécifiques, filtrer par statut d'approbation, filtrer par siècle ou parcourir l'annuaire complet.",
        icon: <Sliders size={40} color="var(--accent-color)" />
      },
      {
        title: "Chronologie et Présentation",
        description: "Ouvrez la chronologie en bas pour voir les événements de manière chronologique. Cliquez sur 'Lancer la présentation' pour démarrer un tour cinématographique automatique d'un événement à l'autre !",
        icon: <Calendar size={40} color="var(--accent-color)" />
      },
      {
        title: "Gloire à Jésus !",
        description: "Vous êtes prêt à commencer. L'application est chargée avec tous les événements. Bon voyage à travers l'histoire de Stella Maris ! Marie Mère de Dieu, gloire par Elle à Jésus.",
        icon: <Sparkles size={40} color="var(--gold-accent)" />
      }
    ],
    it: [
      {
        title: "Benvenuto su Stella Maris",
        description: "Stella Maris è una mappa 3D interattiva che documenta le apparizioni mariane storiche nel mondo. Facciamo una breve visita guidata per imparare i comandi.",
        icon: <HelpCircle size={40} color="var(--gold-accent)" />
      },
      {
        title: "Esplora il Globo 3D",
        description: "Trascina con il tasto sinistro del mouse per ruotare la Terra. Usa la rotellina per ingrandire o rimpicciolire. Clicca su un marcatore colorato per visualizzare i dettagli dell'apparizione.",
        icon: <Globe size={40} color="var(--accent-color)" />
      },
      {
        title: "Dettagli sull'Apparizione",
        description: "Selezionando un marcatore si aprirà il pannello informativo a destra. Qui potrai leggere la descrizione, verificare lo stato di approvazione e consultare le fonti documentate.",
        icon: <SidebarIcon size={40} color="var(--accent-color)" />
      },
      {
        title: "Ricerca e Filtri",
        description: "Usa il pannello sinistro per cercare santuari specifici, filtrare per stato di approvazione, filtrare per secolo storico o scorrere l'elenco completo.",
        icon: <Sliders size={40} color="var(--accent-color)" />
      },
      {
        title: "Linea Temporale e Presentazione",
        description: "Apri la linea temporale in basso per vedere gli eventi in ordine cronologico. Clicca su 'Avvia presentazione' per iniziare un viaggio cinematografico che ti porterà da un evento all'altro!",
        icon: <Calendar size={40} color="var(--accent-color)" />
      },
      {
        title: "Gloria a Gesù!",
        description: "Sei pronto per iniziare. L'applicazione è caricata con tutti gli eventi. Buon viaggio nella storia di Stella Maris! Maria Madre di Dio, gloria a Gesù per mezzo Suo.",
        icon: <Sparkles size={40} color="var(--gold-accent)" />
      }
    ]
  };

  // Fallback to english if language is not explicitly defined in translations
  return steps[lang] || steps['en'];
};

const getHighlightStyle = (step: number): React.CSSProperties => {
  switch (step) {
    case 0:
      // Dim the entire screen: spotlight is size 0 and offscreen
      return {
        left: '-100px',
        top: '-100px',
        width: '0px',
        height: '0px',
        border: 'none',
        boxShadow: '0 0 0 9999px rgba(5, 8, 22, 0.75)',
        background: 'transparent',
      };
    case 1:
      // Focus Globe: Center of the screen pulse overlay (large circular spotlight like magnifying glass)
      return {
        left: '50vw',
        top: '50vh',
        width: '450px',
        height: '450px',
        transform: 'translate(-50%, -50%)',
        borderRadius: '50%',
        background: 'transparent',
      };
    case 2:
      // Highlight Sidebar
      return {
        right: '15px',
        top: '15px',
        bottom: '15px',
        width: '390px',
        left: 'auto',
        height: 'auto',
        background: 'transparent',
      };
    case 3:
      // Highlight Left Panel
      return {
        left: '15px',
        top: '15px',
        width: '330px',
        height: '490px',
        background: 'transparent',
      };
    case 4:
      // Highlight Timeline Overlay at the bottom
      return {
        left: '15px',
        right: '15px',
        bottom: '10px',
        height: '240px',
        top: 'auto',
        width: 'auto',
        background: 'transparent',
      };
    case 5:
      // Dim the entire screen
      return {
        left: '-100px',
        top: '-100px',
        width: '0px',
        height: '0px',
        border: 'none',
        boxShadow: '0 0 0 9999px rgba(5, 8, 22, 0.75)',
        background: 'transparent',
      };
    default:
      return {
        left: '-100px',
        top: '-100px',
        width: '0px',
        height: '0px',
        border: 'none',
        background: 'transparent',
      };
  }
};

const getCardStyle = (step: number): React.CSSProperties => {
  const common: React.CSSProperties = {
    position: 'fixed',
    zIndex: 130,
    width: '360px',
    backgroundColor: 'rgba(15, 23, 42, 0.96)',
    backdropFilter: 'blur(20px)',
    border: '1px solid var(--glass-border)',
    borderRadius: '16px',
    boxShadow: '0 25px 60px rgba(0,0,0,0.85)',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    pointerEvents: 'auto'
  };

  switch (step) {
    case 0:
      return {
        ...common,
        left: '50vw',
        top: '50vh',
        transform: 'translate(-50%, -50%)',
        width: '450px',
        maxWidth: '90vw'
      };
    case 1:
      return {
        ...common,
        left: '50vw',
        top: '100px',
        transform: 'translateX(-50%)',
      };
    case 2:
      // To the left of the Sidebar
      return {
        ...common,
        right: '430px',
        top: '150px',
      };
    case 3:
      // To the right of the Left Panel
      return {
        ...common,
        left: '370px',
        top: '100px',
      };
    case 4:
      // Above the Timeline
      return {
        ...common,
        left: '50px',
        bottom: '270px',
        width: '420px',
      };
    case 5:
      return {
        ...common,
        left: '50vw',
        top: '50vh',
        transform: 'translate(-50%, -50%)',
        width: '450px',
        maxWidth: '90vw'
      };
    default:
      return common;
  }
};

const getArrowStyle = (step: number): React.CSSProperties | null => {
  const base: React.CSSProperties = {
    position: 'absolute',
    width: 0,
    height: 0,
    borderStyle: 'solid',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  switch (step) {
    case 2:
      // Pointing right
      return {
        ...base,
        top: '40px',
        right: '-10px',
        borderWidth: '10px 0 10px 10px',
        borderColor: 'transparent transparent transparent rgba(15, 23, 42, 0.96)',
      };
    case 3:
      // Pointing left
      return {
        ...base,
        top: '40px',
        left: '-10px',
        borderWidth: '10px 10px 10px 0',
        borderColor: 'transparent rgba(15, 23, 42, 0.96) transparent transparent',
      };
    case 4:
      // Pointing down
      return {
        ...base,
        bottom: '-10px',
        left: '40px',
        borderWidth: '10px 10px 0 10px',
        borderColor: 'rgba(15, 23, 42, 0.96) transparent transparent transparent',
      };
    default:
      return null;
  }
};

export const TutorialModal: React.FC<TutorialModalProps> = ({
  isOpen,
  onClose,
  currentLang,
  onLanguageChange,
  step,
  onStepChange
}) => {
  useEffect(() => {
    if (isOpen) {
      onStepChange(step);
    }
  }, [step, isOpen, onStepChange]);

  if (!isOpen) return null;

  const steps = getStepsContent(currentLang);
  const currentStepData = steps[step] || steps[0];
  const tLocal = tutorialTranslations[currentLang] || tutorialTranslations['en'];
  const highlightStyle = getHighlightStyle(step);
  const cardStyle = getCardStyle(step);
  const arrowStyle = getArrowStyle(step);

  const handleNext = () => {
    if (step < steps.length - 1) {
      onStepChange(step + 1);
    } else {
      onClose();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      onStepChange(step - 1);
    }
  };

  return (
    <>
      <style>{`
        @media (max-width: 900px) {
          .tutorial-spotlight {
            display: none !important;
          }
          .tutorial-card {
            left: 50% !important;
            top: 50% !important;
            bottom: auto !important;
            right: auto !important;
            transform: translate(-50%, -50%) !important;
            width: 90vw !important;
            max-width: 400px !important;
          }
          .tutorial-arrow {
            display: none !important;
          }
        }
      `}</style>

      {/* Spotlight cutout backdrop */}
      {highlightStyle && (
        <div className="tutorial-spotlight" style={highlightStyle}>
          {step === 1 && (
            <div 
              className="tutorial-pulse-ring" 
              style={{ 
                position: 'absolute', 
                inset: '-20px', 
                pointerEvents: 'none' 
              }} 
            />
          )}
        </div>
      )}

      {/* Card Popup Box */}
      <div className="tutorial-card animate-tutorial-fade-in" style={cardStyle}>
        {/* Arrow pointer */}
        {arrowStyle && <div className="tutorial-arrow" style={arrowStyle} />}

        {/* Header with Close */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {currentStepData.icon}
            <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: 'var(--text-color)' }}>
              {currentStepData.title}
            </h2>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-color)',
              cursor: 'pointer',
              opacity: 0.6,
              transition: 'opacity 0.2s',
              padding: '4px'
            }}
            onMouseOver={e => e.currentTarget.style.opacity = '1'}
            onMouseOut={e => e.currentTarget.style.opacity = '0.6'}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content text */}
        <p style={{ 
          fontSize: '14px', 
          lineHeight: '1.6', 
          opacity: 0.85, 
          margin: 0, 
          color: 'var(--text-color)' 
        }}>
          {currentStepData.description}
        </p>

        {/* Step 0 Language Choice Grid */}
        {step === 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '8px',
            marginTop: '8px',
            maxHeight: '160px',
            overflowY: 'auto',
            paddingRight: '4px'
          }}>
            {(Object.keys(LANGUAGE_FLAG_CODES) as Language[]).map(lang => {
              const isSelected = currentLang === lang;
              return (
                <button
                  key={lang}
                  onClick={() => onLanguageChange(lang)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: `1px solid ${isSelected ? 'rgba(56, 189, 248, 0.6)' : 'rgba(255,255,255,0.08)'}`,
                    background: isSelected ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255,255,255,0.03)',
                    color: isSelected ? '#ffffff' : 'rgba(255,255,255,0.75)',
                    fontSize: '13px',
                    fontWeight: isSelected ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textAlign: 'left'
                  }}
                  onMouseOver={e => {
                    if (!isSelected) {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                    }
                  }}
                  onMouseOut={e => {
                    if (!isSelected) {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                    }
                  }}
                >
                  <img 
                    src={`${import.meta.env.BASE_URL}flags/${LANGUAGE_FLAG_CODES[lang]}.svg`} 
                    alt={languageNames[lang]} 
                    style={{ 
                      width: '18px', 
                      height: '12px', 
                      objectFit: 'cover', 
                      borderRadius: '1px' 
                    }} 
                  />
                  <span>{languageNames[lang]}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Footer Navigation */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginTop: '10px',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          paddingTop: '14px'
        }}>
          {/* Skip Button */}
          {step < steps.length - 1 ? (
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 600,
                transition: 'color 0.2s',
                padding: '6px 0'
              }}
              onMouseOver={e => e.currentTarget.style.color = '#ef4444'}
              onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
            >
              {tLocal.skip}
            </button>
          ) : (
            <div />
          )}

          {/* Back/Next Buttons */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {step > 0 && (
              <button
                onClick={handleBack}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'var(--text-color)',
                  cursor: 'pointer',
                  borderRadius: '20px',
                  padding: '8px 16px',
                  fontSize: '13px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s'
                }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
                onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              >
                <ArrowLeft size={14} />
                <span>{tLocal.back}</span>
              </button>
            )}

            <button
              onClick={handleNext}
              style={{
                background: 'linear-gradient(135deg, var(--accent-color), rgba(59, 130, 246, 0.85))',
                border: 'none',
                color: '#ffffff',
                cursor: 'pointer',
                borderRadius: '20px',
                padding: '8px 20px',
                fontSize: '13px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 12px rgba(56, 189, 248, 0.25)',
                transition: 'all 0.2s'
              }}
              onMouseOver={e => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(56, 189, 248, 0.4)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(56, 189, 248, 0.25)';
              }}
            >
              <span>{step === 0 ? tLocal.start : step === steps.length - 1 ? tLocal.finish : tLocal.next}</span>
              {step < steps.length - 1 && <ArrowRight size={14} />}
            </button>
          </div>
        </div>

        {/* Step dots */}
        {step > 0 && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '6px',
            marginTop: '-4px'
          }}>
            {steps.slice(1).map((_, i) => {
              const isActive = step === i + 1;
              return (
                <div
                  key={i}
                  style={{
                    width: isActive ? '18px' : '6px',
                    height: '6px',
                    borderRadius: '3px',
                    backgroundColor: isActive ? 'var(--accent-color)' : 'rgba(255,255,255,0.2)',
                    transition: 'all 0.3s ease'
                  }}
                />
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default TutorialModal;
