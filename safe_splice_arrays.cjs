const fs = require('fs');
let file = fs.readFileSync('src/components/TutorialModal.tsx', 'utf8');

// 1. Titles
file = file.replace(`"Zoom",\n      "Search & filters"`, `"Zoom",\n      "Click on apparition",\n      "Search & filters"`);
file = file.replace(`"Zbliżenie",\n      "Wyszukiwanie i filtry"`, `"Zbliżenie",\n      "Kliknij na objawienie",\n      "Wyszukiwanie i filtry"`);
file = file.replace(`"Zoom",\n      "Búsqueda y filtros"`, `"Zoom",\n      "Haga clic en la aparición",\n      "Búsqueda y filtros"`);
file = file.replace(`"Zoom",\n      "Pesquisa e filtros"`, `"Zoom",\n      "Clique na aparição",\n      "Pesquisa e filtros"`);
file = file.replace(`"Zoom",\n      "Recherche & filtres"`, `"Zoom",\n      "Cliquez sur l'apparition",\n      "Recherche & filtres"`);
file = file.replace(`"Zoom",\n      "Ricerca & filtri"`, `"Zoom",\n      "Clicca sull'apparizione",\n      "Ricerca & filtri"`);
file = file.replace(`"تكبير",\n      "البحث والفلاتر"`, `"تكبير",\n      "انقر على الظهور",\n      "البحث والفلاتر"`);
file = file.replace(`"I-zoom",\n      "Paghahanap at mga filter"`, `"I-zoom",\n      "I-click ang aparisyon",\n      "Paghahanap at mga filter"`);
file = file.replace(`"Thu phóng",\n      "Tìm kiếm & bộ lọc"`, `"Thu phóng",\n      "Nhấp vào hiện tượng",\n      "Tìm kiếm & bộ lọc"`);
file = file.replace(`"Yakınlaştır",\n      "Arama ve filtreler"`, `"Yakınlaştır",\n      "Görünmeye tıklayın",\n      "Arama ve filtreler"`);

// 2. Descriptions
file = file.replace(
  `"After selecting an apparition, the map zooms in to its location. Click the point to open more information.",\n      "Use the left panel to search for specific shrines, filter by approval status, or filter by historical century."`, 
  `"After selecting an apparition, the map zooms in to its location. Click the point to open more information.",\n      "Now that we are zoomed in, click on the marker to open detailed information about the apparition.",\n      "Use the left panel to search for specific shrines, filter by approval status, or filter by historical century."`
);
file = file.replace(
  `"Po wybraniu objawienia mapa zbliża się do jego lokalizacji. Kliknij punkt, aby otworzyć więcej informacji.",\n      "Użyj lewego panelu, aby wyszukać konkretne sanktuaria, filtrować według statusu zatwierdzenia lub stulecia historycznego."`,
  `"Po wybraniu objawienia mapa zbliża się do jego lokalizacji. Kliknij punkt, aby otworzyć więcej informacji.",\n      "Teraz, gdy przybliżyliśmy, kliknij znacznik, aby otworzyć szczegółowe informacje o objawieniu.",\n      "Użyj lewego panelu, aby wyszukać konkretne sanktuaria, filtrować według statusu zatwierdzenia lub stulecia historycznego."`
);
file = file.replace(
  `"Después de seleccionar una aparición, el mapa se acerca a su ubicación. Haga clic en el punto para abrir más información.",\n      "Use el panel izquierdo para buscar santuarios específicos, filtrar por estado de aprobación o por siglo histórico."`,
  `"Después de seleccionar una aparición, el mapa se acerca a su ubicación. Haga clic en el punto para abrir más información.",\n      "Ahora que nos hemos acercado, haga clic en el marcador para abrir información detallada sobre la aparición.",\n      "Use el panel izquierdo para buscar santuarios específicos, filtrar por estado de aprobación o por siglo histórico."`
);
file = file.replace(
  `"Depois de selecionar uma aparição, o mapa se aproxima de sua localização. Clique no ponto para abrir mais informações.",\n      "Use o painel esquerdo para pesquisar santuários específicos, filtrar por status de aprovação ou por século histórico."`,
  `"Depois de selecionar uma aparição, o mapa se aproxima de sua localização. Clique no ponto para abrir mais informações.",\n      "Agora que nos aproximamos, clique no marcador para abrir informações detalhadas sobre a aparição.",\n      "Use o painel esquerdo para pesquisar santuários específicos, filtrar por status de aprovação ou por século histórico."`
);
file = file.replace(
  `"Après avoir sélectionné une apparition, la carte zoome sur son emplacement. Cliquez sur le point pour ouvrir plus d'informations.",\n      "Utilisez le panneau de gauche pour rechercher des sanctuaires spécifiques, filtrer par statut d'approbation ou par siècle historique."`,
  `"Après avoir sélectionné une apparition, la carte zoome sur son emplacement. Cliquez sur le point pour ouvrir plus d'informations.",\n      "Maintenant que nous avons zoomé, cliquez sur le marqueur pour ouvrir des informations détaillées sur l'apparition.",\n      "Utilisez le panneau de gauche pour rechercher des sanctuaires spécifiques, filtrer par statut d'approbation ou par siècle historique."`
);
file = file.replace(
  `"Dopo aver selezionato un'apparizione, la mappa ingrandisce la sua posizione. Clicca sul punto per aprire ulteriori informazioni.",\n      "Usa il pannello di sinistra per cercare santuari specifici, filtrare per stato di approvazione o per secolo storico."`,
  `"Dopo aver selezionato un'apparizione, la mappa ingrandisce la sua posizione. Clicca sul punto per aprire ulteriori informazioni.",\n      "Ora che abbiamo ingrandito, clicca sul marcatore per aprire informazioni dettagliate sull'apparizione.",\n      "Usa il pannello di sinistra per cercare santuari specifici, filtrare per stato di approvazione o per secolo storico."`
);
file = file.replace(
  `"بعد تحديد ظهور، تقترب الخريطة من موقعه. انقر على النقطة لفتح المزيد من المعلومات.",\n      "استخدم اللوحة اليسرى للبحث عن مزارات معينة، أو التصفية حسب حالة الموافقة، أو التصفية حسب القرن التاريخي."`,
  `"بعد تحديد ظهور، تقترب الخريطة من موقعه. انقر على النقطة لفتح المزيد من المعلومات.",\n      "الآن بعد أن قمنا بالتكبير، انقر على العلامة لفتح معلومات مفصلة حول الظهور.",\n      "استخدم اللوحة اليسرى للبحث عن مزارات معينة، أو التصفية حسب حالة الموافقة، أو التصفية حسب القرن التاريخي."`
);
file = file.replace(
  `"Pagkatapos pumili ng aparisyon, nagzu-zoom in ang mapa sa lokasyon nito. I-click ang punto para buksan ang karagdagang impormasyon.",\n      "Gamitin ang kaliwang panel para maghanap ng mga partikular na dambana, i-filter ayon sa status ng pag-apruba, o i-filter ayon sa makasaysayang siglo."`,
  `"Pagkatapos pumili ng aparisyon, nagzu-zoom in ang mapa sa lokasyon nito. I-click ang punto para buksan ang karagdagang impormasyon.",\n      "Ngayong nag-zoom in na tayo, i-click ang marker para buksan ang detalyadong impormasyon tungkol sa aparisyon.",\n      "Gamitin ang kaliwang panel para maghanap ng mga partikular na dambana, i-filter ayon sa status ng pag-apruba, o i-filter ayon sa makasaysayang siglo."`
);
file = file.replace(
  `"Sau khi chọn một hiện tượng, bản đồ sẽ phóng to đến vị trí đó. Nhấp vào điểm để mở thêm thông tin.",\n      "Sử dụng bảng bên trái để tìm kiếm các đền thờ cụ thể, lọc theo trạng thái phê duyệt hoặc lọc theo thế kỷ lịch sử."`,
  `"Sau khi chọn một hiện tượng, bản đồ sẽ phóng to đến vị trí đó. Nhấp vào điểm để mở thêm thông tin.",\n      "Bây giờ chúng ta đã phóng to, hãy nhấp vào điểm đánh dấu để mở thông tin chi tiết về hiện tượng.",\n      "Sử dụng bảng bên trái để tìm kiếm các đền thờ cụ thể, lọc theo trạng thái phê duyệt hoặc lọc theo thế kỷ lịch sử."`
);
file = file.replace(
  `"Bir görünüm seçtikten sonra harita o konuma yaklaşır. Daha fazla bilgi açmak için noktaya tıklayın.",\n      "Belirli tapınakları aramak, onay durumuna göre filtrelemek veya tarihi yüzyıla göre filtrelemek için sol paneli kullanın."`,
  `"Bir görünüm seçtikten sonra harita o konuma yaklaşır. Daha fazla bilgi açmak için noktaya tıklayın.",\n      "Şimdi yakınlaştırdığımıza göre, görünme hakkında ayrıntılı bilgileri açmak için işarete tıklayın.",\n      "Belirli tapınakları aramak, onay durumuna göre filtrelemek veya tarihi yüzyıla göre filtrelemek için sol paneli kullanın."`
);

// 3. Icons
file = file.replace(
  `<ZoomIn size={40} color="var(--accent-color)" />,\n    <Search size={40} color="var(--accent-color)" />`,
  `<ZoomIn size={40} color="var(--accent-color)" />,\n    <Globe size={40} color="var(--accent-color)" />,\n    <Search size={40} color="var(--accent-color)" />`
);

// 4. Update tutorial logic layout indices
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

// Ensure step 4 has the same 500x500 layout in highlightStyle
file = file.replace(
  `if (step === 1 || step === 2 || step === 3) {`,
  `if (step === 1 || step === 2 || step === 3 || step === 4) {`
);
file = file.replace(
  `if (step === 1 || step === 2 || step === 3) {`, // replace again for cardStyle
  `if (step === 1 || step === 2 || step === 3 || step === 4) {`
);

file = file.replace(
  `if (step === 0 || step === 1 || step === 2 || step === 3 || step === 8 || step === 9 || !elementRect) return null;`,
  `if (step === 0 || step === 1 || step === 2 || step === 3 || step === 4 || step === 9 || step === 10 || !elementRect) return null;`
);

fs.writeFileSync('src/components/TutorialModal.tsx', file);
console.log('Successfully completed safe array splicing!');
