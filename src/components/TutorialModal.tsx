import React, { useEffect, useState, useMemo } from 'react';
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
  isTimelineOpen: boolean;
  setIsTimelineOpen: (open: boolean) => void;
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
    skip: 'Skip',
    next: 'Next',
    back: 'Back',
    finish: 'Start Exploring',
    start: 'Start',
    step: 'Step',
    of: 'of'
  },
  pl: {
    skip: 'Pomiń',
    next: 'Dalej',
    back: 'Wstecz',
    finish: 'Rozpocznij odkrywanie',
    start: 'Rozpocznij',
    step: 'Krok',
    of: 'z'
  },
  es: {
    skip: 'Omitir',
    next: 'Siguiente',
    back: 'Atrás',
    finish: 'Comenzar a explorar',
    start: 'Iniciar',
    step: 'Paso',
    of: 'de'
  },
  pt: {
    skip: 'Pular',
    next: 'Avançar',
    back: 'Voltar',
    finish: 'Começar a explorar',
    start: 'Iniciar',
    step: 'Passo',
    of: 'de'
  },
  fr: {
    skip: 'Passer',
    next: 'Suivant',
    back: 'Retour',
    finish: 'Commencer l’exploration',
    start: 'Lancer',
    step: 'Étape',
    of: 'sur'
  },
  it: {
    skip: 'Salta',
    next: 'Avanti',
    back: 'Indietro',
    finish: 'Inizia a esplorare',
    start: 'Avvia',
    step: 'Passo',
    of: 'di'
  },
  ar: {
    skip: 'تخطي',
    next: 'التالي',
    back: 'السابق',
    finish: 'بدء الاستكشاف',
    start: 'بدء',
    step: 'الخطوة',
    of: 'من'
  },
  tl: {
    skip: 'Laktawan',
    next: 'Susunod',
    back: 'Balik',
    finish: 'Simulan ang Paggagalugad',
    start: 'Simulan',
    step: 'Hakbang',
    of: 'ng'
  },
  vi: {
    skip: 'Bỏ qua',
    next: 'Tiếp tục',
    back: 'Quay lại',
    finish: 'Bắt đầu khám phá',
    start: 'Bắt đầu',
    step: 'Bước',
    of: 'trên'
  },
  tr: {
    skip: 'Geç',
    next: 'İleri',
    back: 'Geri',
    finish: 'Keşfetmeye Başla',
    start: 'Başlat',
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
  const titles: Record<string, string[]> = {
    en: [
      "Stella Maris onboarding",
      "Explore the 3D globe",
      "Zoom to Guadalupe & details",
      "Search & filters",
      "Browse directory",
      "Open timeline",
      "Timeline & presentation",
      "Auto-rotate Earth",
      "Glory to Jesus!"
    ],
    pl: [
      "Wprowadzenie do Stella Maris",
      "Eksploruj globus 3D",
      "Zbliżenie na Guadalupe i szczegóły",
      "Wyszukiwanie i filtry",
      "Przeglądaj katalog",
      "Otwórz oś czasu",
      "Oś czasu i prezentacja",
      "Automatyczne obracanie Ziemi",
      "Chwała Jezusowi!"
    ],
    es: [
      "Guía de Stella Maris",
      "Explore el globo 3D",
      "Zoom a Guadalupe y detalles",
      "Búsqueda y filtros",
      "Explorar directorio",
      "Abrir línea de tiempo",
      "Línea de tiempo y presentación",
      "Rotación automática de la Tierra",
      "¡Gloria a Jesús!"
    ],
    pt: [
      "Introdução ao Stella Maris",
      "Explore o globo 3D",
      "Zoom para Guadalupe e detalhes",
      "Pesquisa e filtros",
      "Navegar no diretório",
      "Abrir linha do tempo",
      "Linha do tempo e apresentação",
      "Rotação automática da Terra",
      "Glória a Jesus!"
    ],
    fr: [
      "Bienvenue sur Stella Maris",
      "Explorez le globe 3D",
      "Zoom sur Guadalupe & détails",
      "Recherche & filtres",
      "Parcourir le répertoire",
      "Ouvrir la frise chronologique",
      "Frise chronologique & présentation",
      "Rotation automatique de la Terre",
      "Gloire à Jésus !"
    ],
    it: [
      "Introduzione a Stella Maris",
      "Esplora il globo 3D",
      "Zoom su Guadalupe e dettagli",
      "Ricerca & filtri",
      "Sfoglia la directory",
      "Apri la cronologia",
      "Cronologia & presentazione",
      "Rotazione automatica della Terra",
      "Gloria a Gesù!"
    ]
  };

  const descriptions: Record<string, string[]> = {
    en: [
      "Choose your language to begin.",
      "Left-click and drag the Earth to rotate it. Scroll your mouse wheel to zoom in and out.",
      "The globe has zoomed to Mexico. On the right, the details panel for 'Our Lady of Guadalupe' has opened automatically. Read the description, and when you are ready to explore other features, click the Close (X) button in the top right corner of the panel.",
      "Use the left panel to search for specific shrines, filter by approval status, or filter by historical century.",
      "Click 'Browse directory' to open a complete list of all apparitions and explore them in detail.",
      "Click the timeline toggle button in the bottom right corner to show the chronological event timeline.",
      "Open the timeline at the bottom to see how events unfolded chronologically. Click 'Play Presentation' to start a cinematic tour!",
      "Toggle the auto-rotation of the Earth using this button in the bottom left corner.",
      "You are ready to begin. Enjoy your journey through the history of Stella Maris! Mary Mother of God, glory through Her to Jesus."
    ],
    pl: [
      "Wybierz język, aby rozpocząć.",
      "Kliknij lewym przyciskiem myszy i przeciągnij Ziemię, aby ją obrócić. Użyj kółka myszy, aby przybliżyć lub oddalić.",
      "Globus przybliżył się do Meksyku. Po prawej stronie automatycznie otworzył się panel szczegółów dla „Matki Bożej z Guadalupe”. Przeczytaj opis, a gdy będziesz gotowy poznać inne funkcje, kliknij przycisk Zamknij (X) w prawym górnym rogu panelu.",
      "Użyj lewego panelu, aby wyszukać konkretne sanktuaria, filtrować według statusu zatwierdzenia lub stulecia historycznego.",
      "Kliknij „Przeglądaj katalog”, aby otworzyć pełną listę wszystkich objawień i szczegółowo je zbadać.",
      "Kliknij przycisk osi czasu w prawym dolnym rogu, aby wyświetlić chronologiczną linię wydarzeń.",
      "Otwórz oś czasu na dole, aby zobaczyć wydarzenia w porządku chronologicznym. Kliknij „Uruchom prezentację”, aby rozpocząć kinową podróż!",
      "Włącz lub wyłącz automatyczne obracanie Ziemi za pomocą tego przycisku w lewym dolnym rogu.",
      "Jesteś gotowy, aby rozpocząć. Życzymy udanej podróży przez historię Stella Maris! Maryjo Matko Boża, chwała przez Nią Jezusowi."
    ],
    es: [
      "Elija su idioma para comenzar.",
      "Haga clic izquierdo y arrastre la Tierra para rotarla. Use la rueda del mouse para acercar y alejar.",
      "El globo se ha acercado a Guadalupe. A la derecha, el panel de detalles de 'Nuestra Señora de Guadalupe' se ha abierto automáticamente. Lea la descripción y haga clic en Cerrar (X) cuando esté listo.",
      "Use el panel izquierdo para buscar santuarios específicos, filtrar por estado de aprobación o por siglo histórico.",
      "Haga clic en 'Explorar directorio' para abrir una lista completa de todas las apariciones y explorarlas en detalle.",
      "Haga clic en el botón de la línea de tiempo en la esquina inferior derecha para abrir la vista cronológica.",
      "Abra la línea de tiempo en la parte inferior para ver cómo se desarrollaron los eventos cronológicamente. ¡Haga clic en 'Iniciar presentación' para comenzar un recorrido cinematográfico!",
      "Active o desactive la rotación automática de la Tierra usando este botón en la esquina inferior izquierda.",
      "Está listo para comenzar. ¡Disfrute de su viaje a través de la historia de Stella Maris! María Madre de Dios, gloria por Ella a Jesús."
    ],
    pt: [
      "Escolha o seu idioma para começar.",
      "Clique com o botão esquerdo e arraste a Terra para girá-la. Use a roda do mouse para aproximar e afastar.",
      "O globo foi ampliado para Guadalupe. À direita, o painel de detalhes de 'Nossa Senhora de Guadalupe' abriu-se automaticamente. Leia a descrição e clique em Fechar (X) quando estiver pronto.",
      "Use o painel esquerdo para pesquisar santuários específicos, filtrar por status de aprovação ou por século histórico.",
      "Clique em 'Navegar no diretório' para abrir uma lista completa de todas as aparições e explorá-las em detalhes.",
      "Clique no botão da linha do tempo no canto inferior direito para abrir a visualização cronológica.",
      "Abra a linha do tempo na parte inferior para ver os eventos em ordem cronológica. Clique em 'Iniciar apresentação' para iniciar um tour cinematográfico!",
      "Ative ou desative a rotação automática da Terra usando este botão no canto inferior esquerdo.",
      "Você está pronto para começar. Aproveite a sua jornada pela história do Stella Maris! Maria Mãe de Deus, glória por Ela a Jesus."
    ],
    fr: [
      "Choisissez votre langue pour commencer.",
      "Faites un clic gauche et glissez la Terre pour la faire tourner. Faites défiler la molette de votre souris pour zoomer et dézoomer.",
      "Le globe a zoomé sur Guadalupe. À droite, le panneau de détails pour 'Notre-Dame de Guadalupe' s'est ouvert automatiquement. Lisez la description et cliquez sur Fermer (X) pour continuer.",
      "Utilisez le panneau de gauche pour rechercher des sanctuaires spécifiques, filtrer par statut d'approbation ou par siècle historique.",
      "Cliquez sur 'Parcourir le répertoire' pour ouvrir la liste complète de toutes les apparitions et les explorer en détail.",
      "Cliquez sur le bouton de la frise chronologique en bas à droite pour l'afficher.",
      "Ouvrez la frise chronologique en bas pour voir les événements chronologiquement. Cliquez sur 'Lancer la présentation' pour démarrer une visite cinématographique !",
      "Activez ou désactivez la rotation automatique de la Terre à l'aide de ce bouton dans le coin inférieur gauche.",
      "Vous êtes prêt à commencer. Bon voyage à travers l'histoire de Stella Maris ! Marie Mère de Dieu, gloire par Elle à Jésus."
    ],
    it: [
      "Scegli la tua lingua per iniziare.",
      "Fai clic sinistro e trascina la Terra per ruotarla. Usa la rotellina del mouse per ingrandire e rimpicciolire.",
      "Il globo ha eseguito lo zoom su Guadalupe. A destra, il pannello dei dettagli di 'Nostra Signora di Guadalupe' si è aperto automaticamente. Leggi la descrizione e fai clic su Chiudi (X) quando sei pronto.",
      "Usa il pannello sinistro per cercare santuari specifici, filtrare per stato di approvazione o per secolo storico.",
      "Fai clic su 'Sfoglia la directory' per aprire un elenco completo di tutte le apparizioni ed esplorarle in dettaglio.",
      "Fai clic sul pulsante della cronologia nell'angolo in basso a destra per aprirla.",
      "Apri la cronologia in basso per vedere gli eventi in ordine cronologico. Fai clic su 'Avvia presentazione' per iniziare un tour cinematografico!",
      "Attiva o disattiva la rotazione automatica della Terra usando questo pulsante nell'angolo in basso a sinistra.",
      "Sei pronto per iniziare. Buon viaggio attraverso la storia di Stella Maris! Maria Madre di Dio, gloria attraverso di Lei a Gesù."
    ]
  };

  const selectedTitles = titles[lang] || titles['en'];
  const selectedDescs = descriptions[lang] || descriptions['en'];

  const icons = [
    <HelpCircle size={40} color="var(--gold-accent)" />,
    <Globe size={40} color="var(--accent-color)" />,
    <SidebarIcon size={40} color="var(--accent-color)" />,
    <Sliders size={40} color="var(--accent-color)" />,
    <Sliders size={40} color="var(--accent-color)" />,
    <Calendar size={40} color="var(--accent-color)" />,
    <Calendar size={40} color="var(--accent-color)" />,
    <Globe size={40} color="var(--accent-color)" />,
    <Sparkles size={40} color="var(--gold-accent)" />
  ];

  return selectedTitles.map((title, i) => ({
    title,
    description: selectedDescs[i] || descriptions['en'][i],
    icon: icons[i] || icons[0]
  }));
};

export const TutorialModal: React.FC<TutorialModalProps> = ({
  isOpen,
  onClose,
  currentLang,
  onLanguageChange,
  step,
  onStepChange,
  isTimelineOpen,
  setIsTimelineOpen
}) => {
  const [elementRect, setElementRect] = useState<DOMRect | null>(null);

  // Manage timeline open/close dynamically depending on tutorial step
  useEffect(() => {
    if (!isOpen) return;
    if (step === 6) {
      setIsTimelineOpen(true);
    } else {
      setIsTimelineOpen(false);
    }
  }, [step, isOpen, setIsTimelineOpen]);

  // Set hook class on body to allow styling modifications (e.g. bright sidebar Close button on Step 4)
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('tutorial-active');
      document.body.setAttribute('data-tutorial-step', step.toString());
    } else {
      document.body.classList.remove('tutorial-active');
      document.body.removeAttribute('data-tutorial-step');
    }
    return () => {
      document.body.classList.remove('tutorial-active');
      document.body.removeAttribute('data-tutorial-step');
    };
  }, [isOpen, step]);

  useEffect(() => {
    if (!isOpen) return;

    let animFrameId: number;
    const updateRect = () => {
      let selector = '';
      if (step === 2) selector = '#sidebar-close-button';
      else if (step === 3) selector = '#search-filters-container';
      else if (step === 4) selector = '#browse-directory-button';
      else if (step === 5) selector = '#timeline-closed-pill';
      else if (step === 6) selector = '#timeline-container';
      else if (step === 7) selector = '#auto-rotate-button';

      if (selector) {
        const el = document.querySelector(selector);
        if (el) {
          const rect = el.getBoundingClientRect();
          setElementRect(prev => {
            if (!prev || prev.left !== rect.left || prev.top !== rect.top || prev.width !== rect.width || prev.height !== rect.height) {
              return rect;
            }
            return prev;
          });
        } else {
          setElementRect(null);
        }
      } else {
        setElementRect(null);
      }
      animFrameId = requestAnimationFrame(updateRect);
    };

    updateRect();
    window.addEventListener('resize', updateRect);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', updateRect);
    };
  }, [step, isTimelineOpen, isOpen]);

  useEffect(() => {
    if (isOpen) {
      onStepChange(step);
    }
  }, [step, isOpen, onStepChange]);

  const steps = getStepsContent(currentLang);
  const currentStepData = steps[step] || steps[0];
  const tLocal = tutorialTranslations[currentLang] || tutorialTranslations['en'];

  const highlightStyle = useMemo((): React.CSSProperties => {
    if (step === 0 || step === 8) {
      return {
        left: '-100px',
        top: '-100px',
        width: '0px',
        height: '0px',
        border: 'none',
        boxShadow: '0 0 0 9999px rgba(5, 8, 22, 0.75)',
        background: 'transparent',
      };
    }
    if (step === 1) {
      return {
        left: '50vw',
        top: '50vh',
        width: '500px',
        height: '500px',
        transform: 'translate(-50%, -50%)',
        borderRadius: '50%',
        background: 'transparent',
      };
    }
    if (elementRect) {
      let paddingT = 6;
      let paddingB = 6;
      let paddingL = 6;
      let paddingR = 6;

      if (step === 3) {
        paddingT = 2; // reduces the excessive top space to center the frame
        paddingB = 10; // shifts the highlight down slightly to center it evenly
      } else if (step === 2) {
        // Spotlight close button tightly
        paddingT = 8;
        paddingB = 8;
        paddingL = 8;
        paddingR = 8;
      }

      return {
        left: `${elementRect.left - paddingL}px`,
        top: `${elementRect.top - paddingT}px`,
        width: `${elementRect.width + paddingL + paddingR}px`,
        height: `${elementRect.height + paddingT + paddingB}px`,
        position: 'fixed',
        background: 'transparent',
        borderRadius: step === 2 ? '50%' : '12px',
      };
    }
    return {
      left: '-100px',
      top: '-100px',
      width: '0px',
      height: '0px',
      border: 'none',
      background: 'transparent',
    };
  }, [step, elementRect]);

  const cardStyle = useMemo((): React.CSSProperties => {
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

    if (step === 0 || step === 8) {
      return {
        ...common,
        left: '50vw',
        top: '50vh',
        transform: 'translate(-50%, -50%)',
        width: '450px',
        maxWidth: '90vw',
        textAlign: step === 8 ? 'center' : 'left',
        alignItems: step === 8 ? 'center' : 'stretch'
      };
    }
    if (step === 1) {
      return {
        ...common,
        left: '60px',
        top: '150px',
      };
    }

    if (elementRect) {
      switch (step) {
        case 2:
          return {
            ...common,
            left: `${elementRect.left - 380}px`,
            top: `${elementRect.top - 10}px`,
          };
        case 3:
        case 4:
          return {
            ...common,
            left: `${elementRect.right + 20}px`,
            top: `${elementRect.top}px`,
          };
        case 5:
          return {
            ...common,
            left: `${elementRect.left - 380}px`,
            bottom: '30px',
          };
        case 6:
          return {
            ...common,
            left: '50px',
            bottom: `${window.innerHeight - elementRect.top + 20}px`,
            width: '420px',
          };
        case 7:
          return {
            ...common,
            left: `${elementRect.right + 20}px`,
            bottom: '30px',
          };
      }
    }

    return common;
  }, [step, elementRect]);

  const arrowStyle = useMemo((): React.CSSProperties | null => {
    if (step === 0 || step === 1 || step === 8 || !elementRect) return null;

    const base: React.CSSProperties = {
      position: 'absolute',
      width: 0,
      height: 0,
      borderStyle: 'solid',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    };

    switch (step) {
      case 3:
      case 4:
      case 7:
        return {
          ...base,
          top: '30px',
          left: '-10px',
          borderWidth: '10px 10px 10px 0',
          borderColor: 'transparent rgba(15, 23, 42, 0.96) transparent transparent',
        };
      case 2:
        return {
          ...base,
          top: '50px',
          right: '-10px',
          borderWidth: '10px 0 10px 10px',
          borderColor: 'transparent transparent transparent rgba(15, 23, 42, 0.96)',
        };
      case 5:
        return {
          ...base,
          bottom: '24px',
          right: '-10px',
          borderWidth: '10px 0 10px 10px',
          borderColor: 'transparent transparent transparent rgba(15, 23, 42, 0.96)',
        };
      case 6:
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
  }, [step, elementRect]);

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

  if (!isOpen) return null;


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
        <div style={{ 
          display: 'flex', 
          justifyContent: step === 8 ? 'center' : 'space-between', 
          alignItems: 'center', 
          gap: '12px',
          width: '100%',
          position: 'relative'
        }}>
          <div style={{ 
            display: 'flex', 
            flexDirection: step === 8 ? 'column' : 'row', 
            alignItems: 'center', 
            gap: '12px', 
            width: '100%',
            justifyContent: 'center'
          }}>
            {currentStepData.icon}
            <h2 style={{ 
              fontSize: '20px', 
              fontWeight: 700, 
              margin: 0, 
              color: 'var(--text-color)',
              textAlign: step === 8 ? 'center' : 'left'
            }}>
              {currentStepData.title}
            </h2>
          </div>
          <button 
            onClick={onClose}
            style={{
              position: step === 8 ? 'absolute' : 'static',
              right: step === 8 ? '0' : 'auto',
              top: step === 8 ? '0' : 'auto',
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
          color: 'var(--text-color)',
          textAlign: step === 8 ? 'center' : 'left'
        }}>
          {currentStepData.description}
        </p>

        {/* Step 0 Language Choice Grid */}
        {step === 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '8px',
            marginTop: '8px'
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
