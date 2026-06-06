const fs = require('fs');

const files = [
  'c:/Users/ignac/Documents/github projects/Catholic_projects/stella-maris/src/App.tsx',
  'c:/Users/ignac/Documents/github projects/Catholic_projects/eucharistic-miracles/src/App.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let lines = content.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    // exitTranslations
    if (lines[i].includes('exitTranslations[lang] || \'Exit\'')) {
      lines[i] = lines[i].replace('exitTranslations[lang] || \'Exit\'', 't(\'exit\', lang)');
    }
    // playPresentationTranslations
    if (lines[i].includes('playPresentationTranslations[lang] || \'Play Presentation\'')) {
      lines[i] = lines[i].replace('playPresentationTranslations[lang] || \'Play Presentation\'', 't(\'playPresentation\', lang)');
    }
    // GlobeViewer isDarkMode
    if (lines[i].includes('isDarkMode={isDarkMode}')) {
      lines[i] = lines[i].replace('isDarkMode={isDarkMode}', 'isDarkMode={true}');
    }
    // Mobile Theme Toggle button
    if (lines[i].includes('showTooltip(\'theme\');')) {
      // Just comment out the insides of the click handler
      lines[i+1] = '// setIsDarkMode(prev => !prev);';
    }
    if (lines[i].includes('{isDarkMode ? \'☀️\' : \'🌙\'}')) {
      lines[i] = lines[i].replace('{isDarkMode ? \'☀️\' : \'🌙\'}', '\'🌙\'');
    }
    if (lines[i].includes('{isDarkMode ? \'Light Mode\' : \'Dark Mode\'}')) {
      lines[i] = lines[i].replace('{isDarkMode ? \'Light Mode\' : \'Dark Mode\'}', '\'Dark Mode\'');
    }
    // Bug report modal
    if (lines[i].includes('{isBugModalOpen && (')) {
      lines[i] = '{false && (';
    }
  }

  fs.writeFileSync(file, lines.join('\n'));
}

console.log('App.tsx strict line fix completed');
