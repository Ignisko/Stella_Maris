const fs = require('fs');

// 1. Update GlobeViewer.tsx
let globe = fs.readFileSync('src/components/GlobeViewer.tsx', 'utf8');

// Replace SVG arrow with a pure CSS arrow
globe = globe.replace(
  '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent-color)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 2px 6px rgba(0,0,0,0.5));"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>',
  '<div style="width: 0; height: 0; border-left: 12px solid transparent; border-right: 12px solid transparent; border-top: 16px solid var(--accent-color); filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));"></div>'
);

// Disable the "Auto-rotate" button instead of hiding it
const buttonLogicOld = `{!hidePlayPause && (!isTutorialActive || tutorialStep === 2 || tutorialStep === 3 || tutorialStep === 10) && (`;
const buttonLogicNew = `{!hidePlayPause && (`;
globe = globe.replace(buttonLogicOld, buttonLogicNew);

const buttonStyleOld = `          style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            zIndex: 10,
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid var(--glass-border)',
            borderRadius: '20px',
            padding: '8px 16px',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: isTutorialActive && (tutorialStep === 2 || tutorialStep === 3) ? '0 0 0 4px rgba(56, 189, 248, 0.5), 0 0 20px rgba(56, 189, 248, 0.8)' : '0 4px 12px rgba(0,0,0,0.4)',
            transition: 'all 0.2s ease'
          }}`;

const buttonStyleNew = `          style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            zIndex: 10,
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid var(--glass-border)',
            borderRadius: '20px',
            padding: '8px 16px',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: isTutorialActive && tutorialStep !== 2 ? 'default' : 'pointer',
            opacity: isTutorialActive && tutorialStep !== 2 ? 0.5 : 1,
            pointerEvents: isTutorialActive && tutorialStep !== 2 ? 'none' : 'auto',
            boxShadow: isTutorialActive && tutorialStep === 2 ? '0 0 0 4px rgba(56, 189, 248, 0.5), 0 0 20px rgba(56, 189, 248, 0.8)' : '0 4px 12px rgba(0,0,0,0.4)',
            transition: 'all 0.2s ease'
          }}`;
globe = globe.replace(buttonStyleOld, buttonStyleNew);

fs.writeFileSync('src/components/GlobeViewer.tsx', globe);


// 2. Update App.tsx
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

// Update special logic for steps 3, 4, 5, 6
// In GlobeViewer pointer-events wrapper:
app = app.replace(
  `pointerEvents: isTutorialActive && (tutorialStep === 2 || tutorialStep === 3) ? 'none' : 'auto'`,
  `pointerEvents: isTutorialActive && (tutorialStep === 2 || tutorialStep === 3 || tutorialStep === 5) ? 'none' : 'auto'`
);

// Sidebar open check:
app = app.replace(
  `!(isTutorialActive && (tutorialStep === 3 || tutorialStep === 5))`,
  `!(isTutorialActive && (tutorialStep === 3 || tutorialStep === 4))`
);

fs.writeFileSync('src/App.tsx', app);


// 3. Update TutorialModal.tsx
let tut = fs.readFileSync('src/components/TutorialModal.tsx', 'utf8');

// A function to splice an element into an array inside a string at a specific index
const insertArrayElements = (content, startIdx, elementsToInsert) => {
  const lines = content.split('\\r\\n');
  if (lines.length === 1) {
    // Fallback if the file uses \n instead of \r\n
    return content.split('\\n').map(line => line).join('\\n'); // We will just use replace instead, it's safer
  }
  return content;
}

// Since JS regex / replace is safest, I will precisely map each language
const addTitles = {
  en: ['"Click on apparition",', '"Apparition details",'],
  pl: ['"Kliknij na objawienie",', '"Informacje o objawieniu",'],
  es: ['"Haga clic en la aparición",', '"Detalles de la aparición",'],
  pt: ['"Clique na aparição",', '"Detalhes da aparição",'],
  fr: ['"Cliquez sur l\'apparition",', '"Détails de l\'apparition",'],
  it: ['"Clicca sull\'apparizione",', '"Dettagli dell\'apparizione",'],
  ar: ['"انقر على الظهور",', '"تفاصيل الظهور",'],
  tl: ['"I-click ang aparisyon",', '"Mga detalye ng aparisyon",'],
  vi: ['"Nhấp vào hiện tượng",', '"Chi tiết hiện tượng",'],
  tr: ['"Görünmeye tıklayın",', '"Görünüm detayları",']
};

const addDescs = {
  en: [
    '"Now that we are zoomed in, click on the marker to open detailed information about the apparition.",',
    '"This sidebar contains the historical overview, the visionary\'s story, and details about the Church\'s approval.",'
  ],
  pl: [
    '"Teraz, gdy przybliżyliśmy, kliknij znacznik, aby otworzyć szczegółowe informacje o objawieniu.",',
    '"Ten panel boczny zawiera historyczny przegląd, historię wizjonera oraz szczegóły dotyczące zatwierdzenia przez Kościół.",'
  ],
  es: [
    '"Ahora que nos hemos acercado, haga clic en el marcador para abrir información detallada sobre la aparición.",',
    '"Esta barra lateral contiene el resumen histórico, la historia del vidente y detalles sobre la aprobación de la Iglesia.",'
  ],
  pt: [
    '"Agora que nos aproximamos, clique no marcador para abrir informações detalhadas sobre a aparição.",',
    '"Esta barra lateral contém a visão geral histórica, a história do vidente e detalhes sobre a aprovação da Igreja.",'
  ],
  fr: [
    '"Maintenant que nous avons zoomé, cliquez sur le marqueur pour ouvrir des informations détaillées.",',
    '"Ce panneau latéral contient un aperçu historique, l\'histoire du voyant et des détails sur l\'approbation de l\'Église.",'
  ],
  it: [
    '"Ora che abbiamo ingrandito, clicca sul marcatore per aprire informazioni dettagliate.",',
    '"Questo pannello laterale contiene la panoramica storica, la storia del veggente e i dettagli sull\'approvazione della Chiesa.",'
  ],
  ar: [
    '"الآن بعد أن قمنا بالتكبير، انقر على العلامة لفتح معلومات مفصلة.",',
    '"يحتوي هذا الشريط الجانبي على النظرة التاريخية، وقصة الرائي، وتفاصيل حول موافقة الكنيسة.",'
  ],
  tl: [
    '"Ngayong nag-zoom in na tayo, i-click ang marker para buksan ang detalyadong impormasyon.",',
    '"Naglalaman ang sidebar na ito ng makasaysayang pangkalahatang-ideya, kuwento ng nakakita, at mga detalye tungkol sa pag-apruba ng Simbahan.",'
  ],
  vi: [
    '"Bây giờ chúng ta đã phóng to, hãy nhấp vào điểm đánh dấu để mở thông tin chi tiết.",',
    '"Thanh bên này chứa tổng quan lịch sử, câu chuyện của người nhìn thấy và thông tin chi tiết về sự chấp thuận của Giáo hội.",'
  ],
  tr: [
    '"Şimdi yakınlaştırdığımıza göre, ayrıntılı bilgileri açmak için işarete tıklayın.",',
    '"Bu kenar çubuğu, tarihi genel bakışı, vizyonerin hikayesini ve Kilise\'nin onayıyla ilgili ayrıntıları içerir.",'
  ]
};

// Insert titles
for (const [lang, inserts] of Object.entries(addTitles)) {
  let zoomStr = '"Zoom",';
  if (lang === 'pl') zoomStr = '"Zbliżenie",';
  if (lang === 'es') zoomStr = '"Zoom",';
  if (lang === 'pt') zoomStr = '"Zoom",';
  if (lang === 'fr') zoomStr = '"Zoom",';
  if (lang === 'it') zoomStr = '"Zoom",';
  if (lang === 'ar') zoomStr = '"تكبير",';
  if (lang === 'tl') zoomStr = '"I-zoom",';
  if (lang === 'vi') zoomStr = '"Thu phóng",';
  if (lang === 'tr') zoomStr = '"Yakınlaştır",';
  
  const regex = new RegExp('(' + zoomStr + '\\r?\\n)');
  tut = tut.replace(regex, '$1      ' + inserts[0] + '\\n      ' + inserts[1] + '\\n');
}

// Insert descriptions
for (const [lang, inserts] of Object.entries(addDescs)) {
  let searchStr = '"After selecting an apparition';
  if (lang === 'pl') searchStr = '"Po wybraniu objawienia';
  if (lang === 'es') searchStr = '"Después de seleccionar una aparición';
  if (lang === 'pt') searchStr = '"Depois de selecionar uma aparição';
  if (lang === 'fr') searchStr = '"Après avoir sélectionné une apparition';
  if (lang === 'it') searchStr = '"Dopo aver selezionato un\\\'apparizione';
  if (lang === 'ar') searchStr = '"بعد تحديد ظهور';
  if (lang === 'tl') searchStr = '"Pagkatapos pumili ng aparisyon';
  if (lang === 'vi') searchStr = '"Sau khi chọn một hiện tượng';
  if (lang === 'tr') searchStr = '"Bir görünüm seçtikten sonra';

  const regex = new RegExp('(' + searchStr + '[^"]*",\\r?\\n)');
  tut = tut.replace(regex, '$1      ' + inserts[0] + '\\n      ' + inserts[1] + '\\n');
}

// Update icon array
const iconSearch = '<ZoomIn size={40} color="var(--accent-color)" />,';
const iconRegex = new RegExp('( ' + iconSearch + '\\r?\\n)');
tut = tut.replace(iconRegex, '$1    <Globe size={40} color="var(--accent-color)" />,\\n    <Info size={40} color="var(--accent-color)" />,\\n');

// Also add Info to lucide-react imports if missing
if (!tut.includes('Info,')) {
  tut = tut.replace('import { ', 'import { Info, ');
}

// Shift indices in logic blocks
const tutShiftNumbers = (str) => {
  return str
    .replace(/step === 11/g, 'step === 13')
    .replace(/step === 10/g, 'step === 12')
    .replace(/step === 9/g, 'step === 11')
    .replace(/step === 8/g, 'step === 10')
    .replace(/step === 7/g, 'step === 9')
    .replace(/step === 6/g, 'step === 8')
    .replace(/step === 5/g, 'step === 7')
    .replace(/step === 4/g, 'step === 6') // We will manually handle 4, 5
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

// Fallbacks
tut = tut.replace(
  'step === 9 || step === 10 || !elementRect',
  'step === 11 || step === 12 || !elementRect' // old 9, 10 is new 11, 12
);

fs.writeFileSync('src/components/TutorialModal.tsx', tut);
console.log('Successfully applied accurate patches!');
