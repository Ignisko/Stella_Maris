const fs = require('fs');

let file = fs.readFileSync('src/components/TutorialModal.tsx', 'utf8');

const newTitles = {
  en: '"Click on apparition"',
  pl: '"Kliknij na objawienie"',
  es: '"Haga clic en la aparición"',
  pt: '"Clique na aparição"',
  fr: '"Cliquez sur l\'apparition"',
  it: '"Clicca sull\'apparizione"',
  ar: '"انقر على الظهور"',
  tl: '"I-click ang aparisyon"',
  vi: '"Nhấp vào hiện tượng"',
  tr: '"Görünmeye tıklayın"'
};

const newDescs = {
  en: '"Now that we are zoomed in, click on the marker to open detailed information about the apparition."',
  pl: '"Teraz, gdy przybliżyliśmy, kliknij znacznik, aby otworzyć szczegółowe informacje o objawieniu."',
  es: '"Ahora que nos hemos acercado, haga clic en el marcador para abrir información detallada sobre la aparición."',
  pt: '"Agora que nos aproximamos, clique no marcador para abrir informações detalhadas sobre a aparição."',
  fr: '"Maintenant que nous avons zoomé, cliquez sur le marqueur pour ouvrir des informations détaillées sur l\'apparition."',
  it: '"Ora che abbiamo ingrandito, clicca sul marcatore per aprire informazioni dettagliate sull\'apparizione."',
  ar: '"الآن بعد أن قمنا بالتكبير، انقر على العلامة لفتح معلومات مفصلة حول الظهور."',
  tl: '"Ngayong nag-zoom in na tayo, i-click ang marker para buksan ang detalyadong impormasyon tungkol sa aparisyon."',
  vi: '"Bây giờ chúng ta đã phóng to, hãy nhấp vào điểm đánh dấu để mở thông tin chi tiết về hiện tượng."',
  tr: '"Şimdi yakınlaştırdığımıza göre, görünme hakkında ayrıntılı bilgileri açmak için işarete tıklayın."'
};

for (const [lang, newTitle] of Object.entries(newTitles)) {
  const arrStart = file.indexOf(`${lang}: [`, file.indexOf('const titles'));
  if (arrStart !== -1) {
    let commaIndex = arrStart;
    for (let i = 0; i < 4; i++) {
      commaIndex = file.indexOf(',', commaIndex + 1);
    }
    file = file.substring(0, commaIndex + 1) + `\n      ${newTitle},` + file.substring(commaIndex + 1);
  }
}

for (const [lang, newDesc] of Object.entries(newDescs)) {
  const arrStart = file.indexOf(`${lang}: [`, file.indexOf('const descriptions'));
  if (arrStart !== -1) {
    let commaIndex = arrStart;
    for (let i = 0; i < 4; i++) {
      commaIndex = file.indexOf(',', commaIndex + 1);
    }
    file = file.substring(0, commaIndex + 1) + `\n      ${newDesc},` + file.substring(commaIndex + 1);
  }
}

const iconsStart = file.indexOf('const icons = [');
let iconCommaIndex = iconsStart;
for (let i = 0; i < 4; i++) {
  iconCommaIndex = file.indexOf(',', iconCommaIndex + 1);
}
file = file.substring(0, iconCommaIndex + 1) + `\n      <Globe size={40} color="var(--accent-color)" />,` + file.substring(iconCommaIndex + 1);

const shiftNumbers = (str) => {
  return str
    .replace(/step === 11/g, 'step === 12')
    .replace(/case 10:/g, 'case 11:')
    .replace(/step === 10/g, 'step === 11')
    .replace(/case 9:/g, 'case 10:')
    .replace(/step === 9/g, 'step === 10')
    .replace(/case 8:/g, 'case 9:')
    .replace(/step === 8/g, 'step === 9')
    .replace(/case 7:/g, 'case 8:')
    .replace(/step === 7/g, 'step === 8')
    .replace(/case 6:/g, 'case 7:')
    .replace(/step === 6/g, 'step === 7')
    .replace(/case 5:/g, 'case 6:')
    .replace(/step === 5/g, 'step === 6')
    .replace(/case 4:/g, 'case 5:')
    .replace(/step === 4/g, 'step === 5');
};

const updateRectStart = file.indexOf('const updateRect = () => {');
const updateRectEnd = file.indexOf('animFrameId = requestAnimationFrame(updateRect);');
let updateRectBlock = file.substring(updateRectStart, updateRectEnd);
updateRectBlock = shiftNumbers(updateRectBlock);
file = file.substring(0, updateRectStart) + updateRectBlock + file.substring(updateRectEnd);

const highlightStyleStart = file.indexOf('const highlightStyle = useMemo');
const highlightStyleEnd = file.indexOf('const cardStyle = useMemo');
let highlightStyleBlock = file.substring(highlightStyleStart, highlightStyleEnd);
highlightStyleBlock = shiftNumbers(highlightStyleBlock);
file = file.substring(0, highlightStyleStart) + highlightStyleBlock + file.substring(highlightStyleEnd);

const cardStyleStart = file.indexOf('const cardStyle = useMemo');
const cardStyleEnd = file.indexOf('const arrowStyle = useMemo');
let cardStyleBlock = file.substring(cardStyleStart, cardStyleEnd);
cardStyleBlock = shiftNumbers(cardStyleBlock);
file = file.substring(0, cardStyleStart) + cardStyleBlock + file.substring(cardStyleEnd);

const arrowStyleStart = file.indexOf('const arrowStyle = useMemo');
const arrowStyleEnd = file.indexOf('const handleNext = () =>');
let arrowStyleBlock = file.substring(arrowStyleStart, arrowStyleEnd);
arrowStyleBlock = shiftNumbers(arrowStyleBlock);
file = file.substring(0, arrowStyleStart) + arrowStyleBlock + file.substring(arrowStyleEnd);

file = file.replace(
  'if (step === 1 || step === 2 || step === 3) {',
  'if (step === 1 || step === 2 || step === 3 || step === 4) {'
);
file = file.replace(
  'if (step === 0 || step === 1 || step === 2 || step === 3 || step === 8 || step === 9 || !elementRect) return null;',
  'if (step === 0 || step === 1 || step === 2 || step === 3 || step === 4 || step === 9 || step === 10 || !elementRect) return null;'
);

fs.writeFileSync('src/components/TutorialModal.tsx', file);
console.log('Successfully spliced arrays and layout logic!');
