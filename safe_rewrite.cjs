const fs = require('fs');

let tut = fs.readFileSync('src/components/TutorialModal.tsx', 'utf8');

// The perfect steps array without regex madness
const perfectGetStepsContent = `const getStepsContent = (lang: Language): StepContent[] => {
  const titles: Record<string, string[]> = {
    en: [
      "Stella Maris onboarding",
      "Explore the 3D globe",
      "Auto-rotate Earth",
      "Zoom",
      "Click on apparition",
      "Apparition details",
      "Search & filters",
      "Browse directory",
      "Apparitions list",
      "Open timeline",
      "Timeline & presentation",
      "Glory to Jesus!"
    ],
    pl: [
      "Wprowadzenie do Stella Maris",
      "Eksploruj globus 3D",
      "Automatyczne obracanie Ziemi",
      "Zbliżenie",
      "Kliknij na objawienie",
      "Informacje o objawieniu",
      "Wyszukiwanie i filtry",
      "Przeglądaj katalog",
      "Katalog objawień",
      "Otwórz oś czasu",
      "Oś czasu i prezentacja",
      "Chwała Jezusowi!"
    ],
    es: [
      "Guía de Stella Maris",
      "Explore el globo 3D",
      "Rotación automática de la Tierra",
      "Zoom",
      "Haga clic en la aparición",
      "Detalles de la aparición",
      "Búsqueda y filtros",
      "Explorar directorio",
      "Directorio de apariciones",
      "Abrir línea de tiempo",
      "Línea de tiempo y presentación",
      "¡Gloria a Jesús!"
    ],
    pt: [
      "Introdução ao Stella Maris",
      "Explore o globo 3D",
      "Rotação automática da Terra",
      "Zoom",
      "Clique na aparição",
      "Detalhes da aparição",
      "Pesquisa e filtros",
      "Navegar no diretório",
      "Diretório de aparições",
      "Abrir linha do tempo",
      "Linha do tempo e apresentação",
      "Glória a Jesus!"
    ],
    fr: [
      "Bienvenue sur Stella Maris",
      "Explorez le globe 3D",
      "Rotation automatique de la Terre",
      "Zoom",
      "Cliquez sur l'apparition",
      "Détails de l'apparition",
      "Recherche & filtres",
      "Parcourir le répertoire",
      "Répertoire des apparitions",
      "Ouvrir la frise chronologique",
      "Frise chronologique & présentation",
      "Gloire à Jésus !"
    ],
    it: [
      "Introduzione a Stella Maris",
      "Esplora il globo 3D",
      "Rotazione automatica della Terra",
      "Zoom",
      "Clicca sull'apparizione",
      "Dettagli dell'apparizione",
      "Ricerca & filtri",
      "Sfoglia la directory",
      "Elenco delle apparizioni",
      "Apri la cronologia",
      "Cronologia & presentazione",
      "Gloria a Gesù!"
    ]
  };

  const descriptions: Record<string, string[]> = {
    en: [
      "Choose your language to begin.",
      "Left-click and drag the Earth to rotate it. Scroll your mouse wheel to zoom in and out.",
      "Toggle the auto-rotation of the Earth using this button in the bottom left corner.",
      "After selecting an apparition, the map zooms in to its location. Click the point to open more information.",
      "Now that we are zoomed in, click on the marker to open detailed information about the apparition.",
      "This sidebar contains the historical overview, the visionary's story, and details about the Church's approval.",
      "Use the left panel to search for specific shrines, filter by approval status, or filter by historical century.",
      "Click 'Browse directory' to open a complete list of all apparitions and explore them in detail.",
      "In the directory, you can quickly search and sort all recorded apparitions. Close the directory to continue.",
      "Click the timeline toggle button in the bottom right corner to show the chronological event timeline.",
      "Open the timeline at the bottom. We recommend using filters first to narrow down the events, then click 'Play Presentation' to start a chronological cinematic tour of your filtered selection!",
      "You are ready to begin. Enjoy your journey through the history of Stella Maris! Mary Mother of God, glory through Her to Jesus."
    ],
    pl: [
      "Wybierz język, aby rozpocząć.",
      "Kliknij lewym przyciskiem myszy i przeciągnij Ziemię, aby ją obrócić. Użyj myszy, aby przybliżyć lub oddalić.",
      "Włącz lub wyłącz automatyczne obracanie Ziemi za pomocą tego przycisku w lewym dolnym rogu.",
      "Po wybraniu objawienia mapa zbliża się do jego lokalizacji. Kliknij punkt, aby otworzyć więcej informacji.",
      "Teraz, gdy przybliżyliśmy, kliknij znacznik, aby otworzyć szczegółowe informacje o objawieniu.",
      "Ten panel boczny zawiera historyczny przegląd, historię wizjonera oraz szczegóły dotyczące zatwierdzenia przez Kościół.",
      "Użyj lewego panelu, aby wyszukać konkretne sanktuaria, filtrować według statusu zatwierdzenia lub stulecia historycznego.",
      "Kliknij „Przeglądaj katalog”, aby otworzyć pełną listę wszystkich objawień i szczegółowo je zbadać.",
      "W katalogu możesz szybko przeszukiwać i sortować wszystkie zarejestrowane objawienia. Zamknij katalog, aby kontynuować.",
      "Kliknij przycisk osi czasu w prawym dolnym rogu, aby wyświetlić chronologiczną linię wydarzeń.",
      "Otwórz oś czasu na dole. Zalecamy najpierw użyć filtrów, aby zawęzić listę wydarzeń, a następnie kliknąć 'Uruchom prezentację', aby rozpocząć chronologiczną, kinową podróż po wybranych objawieniach!",
      "Jesteś gotowy, aby rozpocząć. Życzymy udanej podróży przez historię Stella Maris! Maryjo Matko Boża, chwała przez Nią Jezusowi."
    ],
    es: [
      "Elija su idioma para comenzar.",
      "Haga clic izquierdo y arrastre la Tierra para rotarla. Use la rueda del mouse para acercar y alejar.",
      "Active o desactive la rotación automática de la Tierra usando este botón en la esquina inferior izquierda.",
      "Después de seleccionar una aparición, el mapa se acerca a su ubicación. Haga clic en el punto para abrir más información.",
      "Ahora que nos hemos acercado, haga clic en el marcador para abrir información detallada sobre la aparición.",
      "Esta barra lateral contiene el resumen histórico, la historia del vidente y detalles sobre la aprobación de la Iglesia.",
      "Use el panel izquierdo para buscar santuarios específicos, filtrar por estado de aprobación o por siglo histórico.",
      "Haga clic en 'Explorar directorio' para abrir una lista completa de todas las apariciones y explorarlas en detalle.",
      "En el directorio, puede buscar y ordenar rápidamente todas las apariciones registradas. Cierre el directorio para continuar.",
      "Haga clic en el botón de la línea de tiempo en la esquina inferior derecha para abrir la vista cronológica.",
      "Abra la línea de tiempo en la parte inferior. Recomendamos usar filtros primero para reducir los eventos, luego haga clic en 'Iniciar presentación' para comenzar un recorrido cinematográfico cronológico de su selección filtrada.",
      "Está listo para comenzar. ¡Disfrute de su viaje a través de la historia de Stella Maris! María Madre de Dios, gloria por Ella a Jesús."
    ],
    pt: [
      "Escolha o seu idioma para começar.",
      "Clique com o botão esquerdo e arraste a Terra para girá-la. Use a roda do mouse para aproximar e afastar.",
      "Ative ou desactive a rotação automática da Terra usando este botão no canto inferior esquerdo.",
      "Depois de selecionar uma aparição, o mapa se aproxima de sua localização. Clique no ponto para abrir mais informações.",
      "Agora que nos aproximamos, clique no marcador para abrir informações detalhadas sobre a aparição.",
      "Esta barra lateral contém a visão geral histórica, a história do vidente e detalhes sobre a aprovação da Igreja.",
      "Use o painel esquerdo para pesquisar santuários específicos, filtrar por status de aprovação ou por século histórico.",
      "Clique em 'Navegar no diretório' to abrir uma lista completa de todas as aparições e explorá-las em detalhes.",
      "No diretório, você pode pesquisar e ordenar rapidamente todas as aparições registradas. Feche o diretório para continuar.",
      "Clique no botão da linha do tempo no canto inferior direito para abrir la visualização cronológica.",
      "Abra a linha do tempo na parte inferior. Recomendamos usar filtros primeiro para restringir os eventos, depois clique em 'Iniciar apresentação' para iniciar um tour cinematográfico cronológico de sua seleção filtrada!",
      "Você está pronto para começar. Aproveite a sua jornada pela história do Stella Maris! Maria Mãe de Deus, glória por Ela a Jesus."
    ],
    fr: [
      "Choisissez votre langue pour commencer.",
      "Faites un clic gauche et glissez la Terre pour la faire tourner. Faites défiler la molette de votre souris pour zoomer et dézoomer.",
      "Activez ou désactivez la rotation automatique de la Terre à l'aide de ce bouton dans le coin inférieur gauche.",
      "Après avoir sélectionné une apparition, la carte zoome sur son emplacement. Cliquez sur le point pour ouvrir plus d'informations.",
      "Maintenant que nous avons zoomé, cliquez sur le marqueur pour ouvrir des informations détaillées.",
      "Ce panneau latéral contient un aperçu historique, l'histoire du voyant et des détails sur l'approbation de l'Église.",
      "Utilisez le panneau de gauche pour rechercher des sanctuaires spécifiques, filtrer par statut d'approbation ou par siècle historique.",
      "Cliquez sur 'Parcourir le répertoire' pour ouvrir la liste complète de toutes les apparitions et les explorer en détail.",
      "Dans le répertoire, vous pouvez rapidement rechercher et trier toutes les apparitions enregistrées. Fermez le répertoire pour continuer.",
      "Cliquez sur le bouton de la frise chronologique en bas à droite pour l'afficher.",
      "Ouvrez la frise chronologique en bas. Nous recommandons d'utiliser d'abord des filtres pour affiner les événements, puis cliquez sur 'Lancer la présentation' pour démarrer une visite cinématographique chronologique de votre sélection filtrée !",
      "Vous êtes prêt à commencer. Bon voyage à travers l'histoire de Stella Maris ! Marie Mère de Dieu, gloire par Elle à Jésus."
    ],
    it: [
      "Scegli la tua lingua per iniziare.",
      "Fai clic sinistro e trascina la Terra per ruotarla. Usa la rotellina del mouse per ingrandire e rimpicciolire.",
      "Attiva o disattiva la rotazione automatica della Terre usando questo postanel nell'angolo in basso a sinistra.",
      "Dopo aver selezionato un'apparizione, la mappa esegue lo zoom sulla sua posizione. Fare clic sul punto per aprire ulteriori informazioni.",
      "Ora che abbiamo ingrandito, clicca sul marcatore per aprire informazioni dettagliate.",
      "Questo pannello laterale contiene la panoramica storica, la storia del veggente e i dettagli sull'approvazione della Chiesa.",
      "Usa il pannello sinistro per cercare santuari specifici, filtrare per stato di approvazione o per secolo storico.",
      "Fai clic su 'Sfoglia la directory' per aprire un elenco completo di tutte le apparizioni ed esplorarle in dettaglio.",
      "Nell'elenco, puoi cercare e ordinare rapidamente tutte le apparizioni registrate. Chiudi l'elenco per continuare.",
      "Fai clic sul pulsante della cronologia nell'angolo in basso a destra per aprirla.",
      "Apri la cronologia in basso. Ti consigliamo di usare prima i filtri per restringere gli eventi, quindi fai clic su 'Avvia presentazione' per iniziare un tour cinematografico cronologico della tua selezione filtrata!",
      "Sei pronto per iniziare. Buon viaggio attraverso la storia di Stella Maris! Maria Madre di Dio, gloria attraverso di Lei a Gesù."
    ]
  };

  const selectedTitles = titles[lang] || titles['en'];
  const selectedDescs = descriptions[lang] || descriptions['en'];

  const icons = [
      <HelpCircle size={40} color="var(--gold-accent)" />,
      <Globe size={40} color="var(--accent-color)" />,
      <Globe size={40} color="var(--accent-color)" />,
      <ZoomIn size={40} color="var(--accent-color)" />,
      <Globe size={40} color="var(--accent-color)" />,
      <Info size={40} color="var(--accent-color)" />,
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
};`;

const startIdx = tut.indexOf('const getStepsContent =');
const endIdx = tut.indexOf('export const TutorialModal:');
tut = tut.substring(0, startIdx) + perfectGetStepsContent + '\\n\\n' + tut.substring(endIdx);

// Ensure Info icon is imported from lucide-react
if (!tut.includes('Info,')) {
  tut = tut.replace('import { ', 'import { Info, ');
}

// Ensure ZoomIn icon is imported if missing
if (!tut.includes('ZoomIn,')) {
  tut = tut.replace('import { ', 'import { ZoomIn, ');
}

// Perform the logic shifts!
const tutShiftNumbers = (str) => {
  return str
    .replace(/step === 11/g, 'step === 13') // old 9
    .replace(/step === 10/g, 'step === 12') // old 9
    .replace(/step === 9/g, 'step === 11') // old 8
    .replace(/step === 8/g, 'step === 10') // old 7
    .replace(/step === 7/g, 'step === 9') // old 6
    .replace(/step === 6/g, 'step === 8') // old 5
    .replace(/step === 5/g, 'step === 7') // old 4
    .replace(/step === 4/g, 'step === 6') // old 3
};

const updateRectStart = tut.indexOf('const updateRect = () => {');
const updateRectEnd = tut.indexOf('animFrameId = requestAnimationFrame(updateRect);');
let updateRectBlock = tut.substring(updateRectStart, updateRectEnd);
updateRectBlock = tutShiftNumbers(updateRectBlock);
updateRectBlock = updateRectBlock.replace("selector = '';", "selector = '';\\n      if (step === 5) selector = '#apparition-sidebar';"); // Step 5 infobox
tut = tut.substring(0, updateRectStart) + updateRectBlock + tut.substring(updateRectEnd);

const highlightStyleStart = tut.indexOf('const highlightStyle = useMemo');
const highlightStyleEnd = tut.indexOf('const cardStyle = useMemo');
let highlightStyleBlock = tut.substring(highlightStyleStart, highlightStyleEnd);
highlightStyleBlock = tutShiftNumbers(highlightStyleBlock);
highlightStyleBlock = highlightStyleBlock.replace('step === 4', 'step === 4 || step === 5');
tut = tut.substring(0, highlightStyleStart) + highlightStyleBlock + tut.substring(highlightStyleEnd);

const cardStyleStart = tut.indexOf('const cardStyle = useMemo');
const cardStyleEnd = tut.indexOf('const arrowStyle = useMemo');
let cardStyleBlock = tut.substring(cardStyleStart, cardStyleEnd);
cardStyleBlock = tutShiftNumbers(cardStyleBlock);
cardStyleBlock = cardStyleBlock.replace('step === 4', 'step === 4 || step === 5');
tut = tut.substring(0, cardStyleStart) + cardStyleBlock + tut.substring(cardStyleEnd);

const arrowStyleStart = tut.indexOf('const arrowStyle = useMemo');
const arrowStyleEnd = tut.indexOf('const handleNext = () =>');
let arrowStyleBlock = tut.substring(arrowStyleStart, arrowStyleEnd);
arrowStyleBlock = tutShiftNumbers(arrowStyleBlock);
arrowStyleBlock = arrowStyleBlock.replace('step === 4', 'step === 4 || step === 5');
tut = tut.substring(0, arrowStyleStart) + arrowStyleBlock + tut.substring(arrowStyleEnd);

// Fix layout boundaries
tut = tut.replace(
  'if (step === 0 || step === 12)',
  'if (step === 0 || step === 13)' // shifted +1 from 12 (now 13 steps: 0-12)
);
tut = tut.replace(
  "step === 12 ? 'center' : 'left'",
  "step === 13 ? 'center' : 'left'"
);
tut = tut.replace(
  "step === 12 ? 'center' : 'stretch'",
  "step === 13 ? 'center' : 'stretch'"
);
tut = tut.replace(
  "step === 10 ? 'center' : 'left'",
  "step === 12 ? 'center' : 'left'" // old 10 is new 12
);
tut = tut.replace(
  "step === 10 ? 'center' : 'flex-start'",
  "step === 12 ? 'center' : 'flex-start'" // old 10 is new 12
);
tut = tut.replace(
  'step === 9 || step === 10 || !elementRect',
  'step === 11 || step === 12 || !elementRect' // old 9, 10 is new 11, 12
);

fs.writeFileSync('src/components/TutorialModal.tsx', tut);


// Update App.tsx
let app = fs.readFileSync('src/App.tsx', 'utf8');
const appShiftNumbers = (str) => {
  return str
    .replace(/tutorialStep === 11/g, 'tutorialStep === 12')
    .replace(/tutorialStep <= 10/g, 'tutorialStep <= 11')
    .replace(/tutorialStep === 10/g, 'tutorialStep === 11')
    .replace(/tutorialStep === 9/g, 'tutorialStep === 10')
    .replace(/tutorialStep >= 8/g, 'tutorialStep >= 9')
    .replace(/tutorialStep === 8/g, 'tutorialStep === 9')
    .replace(/tutorialStep === 7/g, 'tutorialStep === 8')
    .replace(/tutorialStep === 6/g, 'tutorialStep === 7')
    .replace(/tutorialStep === 5/g, 'tutorialStep === 6')
    .replace(/tutorialStep === 4/g, 'tutorialStep === 5');
};
app = appShiftNumbers(app);

app = app.replace(
  "pointerEvents: isTutorialActive && (tutorialStep === 2 || tutorialStep === 3) ? 'none' : 'auto'",
  "pointerEvents: isTutorialActive && (tutorialStep === 2 || tutorialStep === 3 || tutorialStep === 5) ? 'none' : 'auto'"
);
app = app.replace(
  "!(isTutorialActive && (tutorialStep === 3 || tutorialStep === 5))",
  "!(isTutorialActive && (tutorialStep === 3 || tutorialStep === 4))" // Step 3, 4 restricts sidebar open
);
fs.writeFileSync('src/App.tsx', app);


// Update GlobeViewer.tsx
let globe = fs.readFileSync('src/components/GlobeViewer.tsx', 'utf8');

// Replace SVG arrow with a pure CSS arrow
globe = globe.replace(
  '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#38bdf8" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 22 13 13l4-7-13 4 5 5-3 9 7-2 3-5Z"/></svg>',
  '<div style={{width: 0, height: 0, borderLeft: "12px solid transparent", borderRight: "12px solid transparent", borderTop: "16px solid var(--accent-color)", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))"}}></div>'
);

// We need to disable the "Auto-rotate" button instead of hiding it
const buttonLogicOld = "{!hidePlayPause && (!isTutorialActive || tutorialStep === 2 || tutorialStep === 3 || tutorialStep === 10) && (";
const buttonLogicNew = "{!hidePlayPause && (";
globe = globe.replace(buttonLogicOld, buttonLogicNew);

const buttonStyleOld = "          style={{\\n" +
"            position: 'absolute',\\n" +
"            bottom: '20px',\\n" +
"            left: '20px',\\n" +
"            zIndex: 10,\\n" +
"            background: 'rgba(15, 23, 42, 0.85)',\\n" +
"            border: '1px solid var(--glass-border)',\\n" +
"            borderRadius: '20px',\\n" +
"            padding: '8px 16px',\\n" +
"            color: '#ffffff',\\n" +
"            display: 'flex',\\n" +
"            alignItems: 'center',\\n" +
"            gap: '8px',\\n" +
"            fontSize: '13px',\\n" +
"            fontWeight: 600,\\n" +
"            cursor: 'pointer',\\n" +
"            boxShadow: isTutorialActive && (tutorialStep === 2 || tutorialStep === 3) ? '0 0 0 4px rgba(56, 189, 248, 0.5), 0 0 20px rgba(56, 189, 248, 0.8)' : '0 4px 12px rgba(0,0,0,0.4)',\\n" +
"            transition: 'all 0.2s ease'\\n" +
"          }}";

const buttonStyleNew = "          style={{\\n" +
"            position: 'absolute',\\n" +
"            bottom: '20px',\\n" +
"            left: '20px',\\n" +
"            zIndex: 10,\\n" +
"            background: 'rgba(15, 23, 42, 0.85)',\\n" +
"            border: '1px solid var(--glass-border)',\\n" +
"            borderRadius: '20px',\\n" +
"            padding: '8px 16px',\\n" +
"            color: '#ffffff',\\n" +
"            display: 'flex',\\n" +
"            alignItems: 'center',\\n" +
"            gap: '8px',\\n" +
"            fontSize: '13px',\\n" +
"            fontWeight: 600,\\n" +
"            cursor: isTutorialActive && tutorialStep !== 2 ? 'default' : 'pointer',\\n" +
"            opacity: isTutorialActive && tutorialStep !== 2 ? 0.5 : 1,\\n" +
"            pointerEvents: isTutorialActive && tutorialStep !== 2 ? 'none' : 'auto',\\n" +
"            boxShadow: isTutorialActive && tutorialStep === 2 ? '0 0 0 4px rgba(56, 189, 248, 0.5), 0 0 20px rgba(56, 189, 248, 0.8)' : '0 4px 12px rgba(0,0,0,0.4)',\\n" +
"            transition: 'all 0.2s ease'\\n" +
"          }}";
globe = globe.replace(buttonStyleOld, buttonStyleNew);

fs.writeFileSync('src/components/GlobeViewer.tsx', globe);
console.log('Successfully applied all logic perfectly!');
