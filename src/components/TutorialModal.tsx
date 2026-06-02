import React, { useEffect, useState, useMemo } from 'react';
import { Info, ArrowRight, ArrowLeft, Globe, SlidersHorizontal, Calendar, Sparkle, Question } from '@phosphor-icons/react';
import type { Language } from '../utils/i18n';
import { languageNames } from '../utils/i18n';
import { config } from '../config';

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
  tr: 'tr',
  ko: 'kr'
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
  },
  ko: {
    skip: '건너뛰기',
    next: '다음',
    back: '뒤로',
    finish: '탐색 시작',
    start: '시작',
    step: '단계',
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
      "Auto-rotate Earth",
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
      "Clicca sull'apparizione",
      "Dettagli dell'apparizione",
      "Ricerca & filtri",
      "Sfoglia la directory",
      "Elenco delle apparizioni",
      "Apri la cronologia",
      "Cronologia & presentazione",
      "Gloria a Gesù!"
    ],
    ko: [
      "Stella Maris 시작하기",
      "3D 지구본 탐색",
      "지구 자동 회전",
      "발현 클릭하기",
      "발현 세부 정보",
      "검색 및 필터",
      "디렉토리 찾아보기",
      "발현 목록",
      "타임라인 열기",
      "타임라인 및 프레젠테이션",
      "예수님께 영광을!"
    ],
    tr: [
      "Stella Maris Rehberi",
      "3D Küreyi Keşfedin",
      "Dünyayı Otomatik Döndür",
      "Görünüşe Tıklayın",
      "Görünüş Detayları",
      "Arama ve Filtreler",
      "Dizine Göz Atın",
      "Görünüşler Listesi",
      "Zaman Çizelgesini Aç",
      "Zaman Çizelgesi ve Sunum",
      "İsa'ya Yücelik Olsun!"
    ],
    ar: [
      "دليل ستيلا ماريس",
      "استكشف الكرة الأرضية ثلاثية الأبعاد",
      "تدوير الأرض تلقائياً",
      "انقر على الظهور",
      "تفاصيل الظهور",
      "البحث والفلاتر",
      "تصفح الدليل",
      "قائمة الظهورات",
      "افتح الجدول الزمني",
      "الجدول الزمني والعرض",
      "المجد ليسوع!"
    ],
    tl: [
      "Gabay ng Stella Maris",
      "Galugarin ang 3D Globe",
      "Awtomatikong Iikot ang Mundo",
      "I-click ang Aparisyon",
      "Mga Detalye ng Aparisyon",
      "Paghahanap at Mga Filter",
      "I-browse ang Direktoryo",
      "Listahan ng mga Aparisyon",
      "Buksan ang Timeline",
      "Timeline at Presentasyon",
      "Papurihan si Hesus!"
    ],
    vi: [
      "Hướng dẫn Stella Maris",
      "Khám phá quả địa cầu 3D",
      "Tự động xoay Trái Đất",
      "Nhấp vào sự hiện ra",
      "Chi tiết sự hiện ra",
      "Tìm kiếm & Bộ lọc",
      "Duyệt qua danh mục",
      "Danh sách sự hiện ra",
      "Mở dòng thời gian",
      "Dòng thời gian & trình bày",
      "Vinh danh Chúa Giêsu!"
    ]
  };

  const descriptions: Record<string, string[]> = {
    en: [
      "Choose your language to begin.",
      "Left-click and drag the Earth to rotate it. Scroll your mouse wheel to zoom in and out.",
      "Toggle the auto-rotation of the Earth using this button in the bottom left corner.",
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
      "Ora che abbiamo ingrandito, clicca sul marcatore per aprire informazioni dettagliate.",
      "Questo pannello laterale contiene la panoramica storica, la storia del veggente e i dettagli sull'approvazione della Chiesa.",
      "Usa il pannello sinistro per cercare santuari specifici, filtrare per stato di approvazione o per secolo storico.",
      "Fai clic su 'Sfoglia la directory' per aprire un elenco completo di tutte le apparizioni ed esplorarle in dettaglio.",
      "Nell'elenco, puoi cercare e ordinare rapidamente tutte le apparizioni registrate. Chiudi l'elenco per continuare.",
      "Fai clic sul pulsante della cronologia nell'angolo in basso a destra per aprirla.",
      "Apri la cronologia in basso. Ti consigliamo di usare prima i filtri per restringere gli eventi, quindi fai clic su 'Avvia presentazione' per iniziare un tour cinematografico cronologico della tua selezione filtrata!",
      "Sei pronto per iniziare. Buon viaggio attraverso la storia di Stella Maris! Maria Madre di Dio, gloria attraverso di Lei a Gesù."
    ],
    ko: [
      "시작하려면 언어를 선택하세요.",
      "마우스 왼쪽 버튼을 클릭하고 드래그하여 지구를 회전합니다. 마우스 휠을 사용하여 확대 및 축소합니다.",
      "왼쪽 하단 모서리에 있는 이 버튼을 사용하여 지구의 자동 회전을 켭니다.",
      "이제 확대되었으므로 마커를 클릭하여 발현에 대한 자세한 정보를 엽니다.",
      "이 사이드바에는 역사적 개요, 환시자의 이야기, 교회의 승인에 대한 세부 정보가 포함되어 있습니다.",
      "왼쪽 패널을 사용하여 특정 성지를 검색하거나 승인 상태 또는 역사적 세기별로 필터링합니다.",
      "모든 발현의 전체 목록을 열고 자세히 탐색하려면 '디렉토리 찾아보기'를 클릭하세요.",
      "디렉토리에서 기록된 모든 발현을 빠르게 검색하고 정렬할 수 있습니다. 계속하려면 디렉토리를 닫습니다.",
      "오른쪽 하단 모서리에 있는 타임라인 버튼을 클릭하여 연대순 이벤트를 표시합니다.",
      "하단에 타임라인을 엽니다. 먼저 필터를 사용하여 이벤트를 좁힌 다음 '프레젠테이션 재생'을 클릭하여 필터링된 선택 항목의 연대순 영화 같은 투어를 시작하는 것이 좋습니다!",
      "시작할 준비가 되었습니다. Stella Maris의 역사를 즐겁게 여행하세요! 하느님의 어머니 마리아, 그녀를 통해 예수님께 영광을 돌립니다."
    ],
    tr: [
      "Başlamak için dilinizi seçin.",
      "Döndürmek için Dünyaya sol tıklayıp sürükleyin. Yakınlaştırmak ve uzaklaştırmak için farenizin tekerleğini kullanın.",
      "Sol alt köşedeki bu düğmeyi kullanarak Dünyanın otomatik dönmesini açın veya kapatın.",
      "Şimdi yakınlaştırdığımıza göre, görünüş hakkında ayrıntılı bilgileri açmak için işaretçiye tıklayın.",
      "Bu kenar çubuğu tarihsel genel bakışı, vizyonerin hikayesini ve Kilisenin onayına ilişkin ayrıntıları içerir.",
      "Belirli türbeleri aramak, onay durumuna göre filtrelemek veya tarihi yüzyıla göre filtrelemek için sol paneli kullanın.",
      "Tüm görünüşlerin tam listesini açmak ve bunları ayrıntılı olarak incelemek için 'Dizine Göz Atın'a tıklayın.",
      "Dizinde kaydedilen tüm görünüşleri hızlıca arayabilir ve sıralayabilirsiniz. Devam etmek için dizini kapatın.",
      "Kronolojik olayları göstermek için sağ alt köşedeki zaman çizelgesi düğmesine tıklayın.",
      "Zaman çizelgesini alttan açın. Olayları daraltmak için önce filtreleri kullanmanızı, ardından filtrelenmiş seçiminizin kronolojik sinematik turunu başlatmak için 'Sunumu Oynat'a tıklamanızı öneririz!",
      "Başlamaya hazırsınız. Stella Maris tarihi boyunca yapacağınız yolculuğun tadını çıkarın! Meryem Tanrı'nın Annesi, O'nun aracılığıyla İsa'ya yücelik olsun."
    ],
    ar: [
      "اختر لغتك للبدء.",
      "انقر بزر الماوس الأيسر واسحب الأرض لتدويرها. استخدم عجلة الماوس للتكبير والتصغير.",
      "قم بتشغيل أو إيقاف التدوير التلقائي للأرض باستخدام هذا الزر في الزاوية اليسرى السفلية.",
      "الآن بعد أن قمنا بالتكبير، انقر على العلامة لفتح معلومات تفصيلية عن الظهور.",
      "يحتوي هذا الشريط الجانبي على النظرة التاريخية العامة، وقصة الرائي، وتفاصيل عن موافقة الكنيسة.",
      "استخدم اللوحة اليسرى للبحث عن مزارات معينة، أو الفلترة حسب حالة الموافقة، أو الفلترة حسب القرن التاريخي.",
      "انقر فوق 'تصفح الدليل' لفتح قائمة كاملة بجميع الظهورات واستكشافها بالتفصيل.",
      "في الدليل، يمكنك البحث السريع وفرز جميع الظهورات المسجلة. أغلق الدليل للمتابعة.",
      "انقر فوق زر الجدول الزمني في الزاوية اليمنى السفلية لإظهار الجدول الزمني للأحداث الترتيبي.",
      "افتح الجدول الزمني في الأسفل. نوصي باستخدام الفلاتر أولاً لتضييق نطاق الأحداث، ثم انقر فوق 'تشغيل العرض التقديمي' لبدء جولة سينمائية ترتيبية لاختيارك المصفى!",
      "أنت جاهز للبدء. استمتع برحلتك عبر تاريخ ستيلا ماريس! مريم والدة الإله، المجد لها بيسوع."
    ],
    tl: [
      "Piliin ang iyong wika upang magsimula.",
      "I-click ang kaliwang button ng mouse at i-drag ang Mundo upang paikutin ito. Gamitin ang gulong ng iyong mouse upang mag-zoom in at mag-zoom out.",
      "I-toggle ang awtomatikong pag-ikot ng Mundo gamit ang button na ito sa ibabang kaliwang sulok.",
      "Ngayong naka-zoom in na tayo, i-click ang marker para buksan ang detalyadong impormasyon tungkol sa aparisyon.",
      "Naglalaman ang sidebar na ito ng pangkasaysayang buod, kwento ng nakakita, at mga detalye tungkol sa pag-apruba ng Simbahan.",
      "Gamitin ang kaliwang panel upang maghanap ng partikular na dambana, i-filter ayon sa estado ng pag-apruba, o i-filter ayon sa kasaysayan ng siglo.",
      "I-click ang 'I-browse ang direktoryo' para magbukas ng kumpletong listahan ng lahat ng aparisyon at galugarin ang mga ito nang detalyado.",
      "Sa direktoryo, mabilis mong mahahanap at maiuuri ang lahat ng naitalang aparisyon. Isara ang direktoryo upang magpatuloy.",
      "I-click ang button na timeline sa kanang ibabang sulok upang ipakita ang pagkakasunud-sunod na timeline ng kaganapan.",
      "Buksan ang timeline sa ibaba. Inirerekumenda namin ang paggamit ng mga filter muna upang paliitin ang mga kaganapan, pagkatapos ay i-click ang 'Simulan ang Presentasyon' upang magsimula ng isang sunud-sunod na cinematic tour ng iyong na-filter na pagpipilian!",
      "Handa ka nang magsimula. Tangkilikin ang iyong paglalakbay sa kasaysayan ng Stella Maris! Maria Ina ng Diyos, papuri sa pamamagitan Niya kay Hesus."
    ],
    vi: [
      "Chọn ngôn ngữ của bạn để bắt đầu.",
      "Nhấp chuột trái và kéo Trái Đất để xoay. Sử dụng con lăn chuột để phóng to và thu nhỏ.",
      "Bật hoặc tắt tính năng tự động xoay Trái Đất bằng nút này ở góc dưới bên trái.",
      "Bây giờ chúng ta đã phóng to, nhấp vào điểm đánh dấu để mở thông tin chi tiết về sự hiện ra.",
      "Bảng điều khiển bên này chứa tổng quan lịch sử, câu chuyện của người nhìn thấy, và các chi tiết về sự chấp thuận của Giáo hội.",
      "Sử dụng bảng điều khiển bên trái để tìm kiếm các đền thánh cụ thể, lọc theo trạng thái phê duyệt, hoặc lọc theo thế kỷ.",
      "Nhấp vào 'Duyệt qua danh mục' để mở danh sách đầy đủ tất cả các sự hiện ra và khám phá chi tiết.",
      "Trong danh mục, bạn có thể nhanh chóng tìm kiếm và sắp xếp tất cả các sự hiện ra đã được ghi lại. Đóng danh mục để tiếp tục.",
      "Nhấp vào nút dòng thời gian ở góc dưới bên phải để hiển thị dòng thời gian sự kiện theo trình tự thời gian.",
      "Mở dòng thời gian ở dưới cùng. Chúng tôi khuyên bạn nên sử dụng bộ lọc trước để thu hẹp các sự kiện, sau đó nhấp vào 'Bắt đầu trình chiếu' để bắt đầu chuyến tham quan điện ảnh theo trình tự thời gian cho lựa chọn đã lọc của bạn!",
      "Bạn đã sẵn sàng để bắt đầu. Hãy tận hưởng hành trình của bạn qua lịch sử của Stella Maris! Mẹ Maria Mẹ Thiên Chúa, vinh danh qua Mẹ đến Chúa Giêsu."
    ]
  };

  const selectedTitles = titles[lang] || titles['en'];
  const selectedDescs = descriptions[lang] || descriptions['en'];

  const icons = [
      <Question size={40} color="var(--gold-accent)" />,
      <Globe size={40} color="var(--accent-color)" />,
      <Globe size={40} color="var(--accent-color)" />,
      <Globe size={40} color="var(--accent-color)" />,
      <Info size={40} color="var(--accent-color)" />,
      <SlidersHorizontal size={40} color="var(--accent-color)" />,
      <SlidersHorizontal size={40} color="var(--accent-color)" />,
      <Calendar size={40} color="var(--accent-color)" />,
      <Calendar size={40} color="var(--accent-color)" />,
      <Globe size={40} color="var(--accent-color)" />,
      <Sparkle size={40} color="var(--gold-accent)" />
    ];

  return selectedTitles.map((title, i) => {
    let finalTitle = title;
    let finalDesc = selectedDescs[i] || descriptions['en'][i];

    if (config.projectId === 'eucharist') {
      const applyReplacements = (text: string) => {
        return text
          .replace(/Stella Maris/g, config.title)
          .replace(/apparition/gi, 'miracle')
          .replace(/objawienie/g, 'cud eucharystyczny')
          .replace(/objawieniu/g, 'cudzie eucharystycznym')
          .replace(/objawień/g, 'cudów eucharystycznych')
          .replace(/objawienia/g, 'cudu eucharystycznego')
          .replace(/Mary Mother of God, glory through Her to Jesus\./g, 'Glory to Jesus in the Blessed Sacrament!')
          .replace(/Maryjo Matko Boża, chwała przez Nią Jezusowi\./g, 'Chwała Jezusowi w Najświętszym Sakramencie!');
      };

      finalTitle = applyReplacements(finalTitle);
      finalDesc = applyReplacements(finalDesc);
    }

    return {
      title: finalTitle,
      description: finalDesc,
      icon: icons[i] || icons[0]
    };
  });
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

  // Step 8: timeline stays CLOSED so #timeline-closed-pill is visible for the highlight
  // Step 9: timeline auto-opens so #timeline-play-presentation-button is visible
  useEffect(() => {
    if (!isOpen) return;
    if (step === 9) {
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
      if (step === 4) selector = '#apparition-sidebar';
      else if (step === 5) selector = '#search-filters-container';
      else if (step === 6) selector = '#browse-directory-button';
      else if (step === 7) selector = '#directory-modal-container';
      else if (step === 8) selector = '#timeline-closed-pill';
      else if (step === 9) selector = '#timeline-play-presentation-button';

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
    if (step === 0 || step === 10) {
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
    if (step === 1 || step === 2 || step === 3) {
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
      const paddingL = 6;
      const paddingR = 6;

      if (step === 6) {
        paddingT = 2; // reduces the excessive top space to center the frame
        paddingB = 10; // shifts the highlight down slightly to center it evenly
      }

      return {
        left: `${elementRect.left - paddingL}px`,
        top: `${elementRect.top - paddingT}px`,
        width: `${elementRect.width + paddingL + paddingR}px`,
        height: `${elementRect.height + paddingT + paddingB}px`,
        position: 'fixed',
        background: 'transparent',
        borderRadius: '12px',
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
      // Ensure the card stays above the timeline from step 8 onwards (timeline is at zIndex 160)
      zIndex: step >= 8 ? 170 : 130,
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

    if (step === 0 || step === 10) {
      return {
        ...common,
        left: '50vw',
        top: '50vh',
        transform: 'translate(-50%, -50%)',
        width: '450px',
        maxWidth: '90vw',
        textAlign: step === 10 ? 'center' : 'left',
        alignItems: step === 10 ? 'center' : 'stretch'
      };
    }
    if (step === 1 || step === 2 || step === 3) {
      return {
        ...common,
        left: '60px',
        top: '150px',
      };
    }

    if (elementRect) {
      switch (step) {
        case 4:   // sidebar is on RIGHT, left side is empty → place card top-left
          return {
            ...common,
            left: '20px',
            top: '80px',
          };
        case 5:
        case 6:
          return {
            ...common,
            left: `${elementRect.right + 20}px`,
            top: `${elementRect.top}px`,
          };
        case 7:
          return {
            ...common,
            left: '50px',
            bottom: '30px',
            width: '420px',
          };
        case 8:
          return {
            ...common,
            left: `${elementRect.left - 380}px`,
            bottom: '30px',
          };
        case 9:
          return {
            ...common,
            left: '50%',
            top: 'auto',
            bottom: `${window.innerHeight - elementRect.top + 20}px`,
            transform: 'translateX(-50%)',
            width: '650px',
            maxWidth: '90vw',
          };
      }
    }

    return common;
  }, [step, elementRect]);

  const arrowStyle = useMemo((): React.CSSProperties | null => {
    if (step === 0 || step === 1 || step === 2 || step === 3 || step === 10 || !elementRect) return null;

    const base: React.CSSProperties = {
      position: 'absolute',
      width: 0,
      height: 0,
      borderStyle: 'solid',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    };

    switch (step) {
      case 4:   // card is on LEFT, sidebar is on RIGHT → arrow points RIGHT
        return {
          ...base,
          top: '30px',
          right: '-10px',
          borderWidth: '10px 0 10px 10px',
          borderColor: 'transparent transparent transparent rgba(15, 23, 42, 0.96)',
        };
      case 5:
      case 6:   // card is to RIGHT of element → arrow points LEFT
        return {
          ...base,
          top: '30px',
          left: '-10px',
          borderWidth: '10px 10px 10px 0',
          borderColor: 'transparent rgba(15, 23, 42, 0.96) transparent transparent',
        };
      case 8:
        return {
          ...base,
          bottom: '24px',
          right: '-10px',
          borderWidth: '10px 0 10px 10px',
          borderColor: 'transparent transparent transparent rgba(15, 23, 42, 0.96)',
        };
      case 9:  // card is top-center, timeline is at bottom → arrow points DOWN
        return {
          ...base,
          bottom: '-10px',
          left: '50%',
          transform: 'translateX(-50%)',
          borderWidth: '10px 10px 0 10px',
          borderColor: 'rgba(15, 23, 42, 0.96) transparent transparent transparent',
        };
      case 7:
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

        {/* Header without Close X */}
        <div style={{ 
          display: 'flex', 
          justifyContent: step === 10 ? 'center' : 'flex-start', 
          alignItems: 'center', 
          gap: '12px',
          width: '100%',
          position: 'relative'
        }}>
          <div style={{ 
            display: 'flex', 
            flexDirection: step === 10 ? 'column' : 'row', 
            alignItems: 'center', 
            gap: '12px', 
            width: '100%',
            justifyContent: step === 10 ? 'center' : 'flex-start',
            paddingRight: step < steps.length - 1 ? '55px' : '0px'
          }}>
            {currentStepData.icon}
            <h2 style={{ 
              fontSize: '20px', 
              fontWeight: 700, 
              margin: 0, 
              color: 'var(--text-color)',
              textAlign: step === 10 ? 'center' : 'left'
            }}>
              {currentStepData.title}
            </h2>
          </div>
          {step < steps.length - 1 && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: 0,
              fontSize: '12px',
              fontWeight: 700,
              color: 'rgba(255, 255, 255, 0.45)',
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '4px 10px',
              borderRadius: '12px',
              letterSpacing: '0.5px',
              border: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
              {step + 1}/{steps.length - 1}
            </div>
          )}
        </div>

        {/* Content text */}
        <p style={{ 
          fontSize: '14px', 
          lineHeight: '1.6', 
          opacity: 0.85, 
          margin: 0, 
          color: 'var(--text-color)',
          textAlign: step === 10 ? 'center' : 'left'
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

        {/* Video introduction temporarily removed due to broken link */}


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
        {step >= 0 && step < steps.length - 1 && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '6px',
            marginTop: '-4px'
          }}>
            {steps.slice(0, -1).map((_, i) => {
              const isActive = step === i;
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
