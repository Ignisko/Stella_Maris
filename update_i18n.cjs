const fs = require('fs');

const files = [
  'c:/Users/ignac/Documents/github projects/Catholic_projects/stella-maris/src/utils/i18n.ts',
  'c:/Users/ignac/Documents/github projects/Catholic_projects/eucharistic-miracles/src/utils/i18n.ts'
];

const playPresentationTranslations = {
  pl: 'Uruchom prezentację',
  es: 'Iniciar presentación',
  pt: 'Iniciar apresentação',
  fr: 'Lancer la présentation',
  it: 'Avvia presentazione',
  vi: 'Bắt đầu trình chiếu',
  ar: 'بدء العرض التقديمي',
  tl: 'Simulan ang Presentation',
  tr: 'Sunumu Oynat',
  en: 'Play Presentation',
  ko: '프레젠테이션 재생'
};

const exitTranslations = {
  pl: 'Zakończ',
  es: 'Salir',
  pt: 'Sair',
  fr: 'Quitter',
  it: 'Esci',
  vi: 'Thoát',
  ar: 'إنهاء',
  tl: 'Lumabas',
  tr: 'Kapat',
  en: 'Exit',
  ko: '종료'
};

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  for (const lang of Object.keys(playPresentationTranslations)) {
    const playStr = `playPresentation: '${playPresentationTranslations[lang]}',`;
    const exitStr = `exit: '${exitTranslations[lang]}',`;
    
    // Find the language block: `en: {` or `pl: {` etc.
    const regex = new RegExp(`(${lang}:\\s*\\{[\\s\\S]*?)(themeDark:.*?,)`, 'g');
    
    if (!content.includes(playStr)) {
      content = content.replace(regex, `$1${playStr}\n    ${exitStr}\n    $2`);
    }
  }
  
  fs.writeFileSync(file, content);
}
console.log('Updated i18n.ts with playPresentation and exit');
