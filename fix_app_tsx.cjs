const fs = require('fs');

const files = [
  'c:/Users/ignac/Documents/github projects/Catholic_projects/stella-maris/src/App.tsx',
  'c:/Users/ignac/Documents/github projects/Catholic_projects/eucharistic-miracles/src/App.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  // 1. Remove Bug from imports
  content = content.replace(/, MagnifyingGlass, Bug }/, ', MagnifyingGlass }');
  
  // 2. Fix exitTranslations
  content = content.replace(/exitTranslations\[lang\] \|\| 'Exit'/g, "t('exit', lang)");
  
  // 3. Fix playPresentationTranslations
  content = content.replace(/playPresentationTranslations\[lang\] \|\| 'Play Presentation'/g, "t('playPresentation', lang)");
  
  // 4. Restore isLanguagePickerOpen and isDarkMode
  if (!content.includes('const [isLanguagePickerOpen, setIsLanguagePickerOpen]')) {
    content = content.replace(
      /const \[playbackSpeedMultiplier, setPlaybackSpeedMultiplier\] = useState\(1\);/,
      `const [playbackSpeedMultiplier, setPlaybackSpeedMultiplier] = useState(1);\n  const [isLanguagePickerOpen, setIsLanguagePickerOpen] = useState(false);\n  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {\n    const saved = localStorage.getItem('stellamaris_theme');\n    return saved !== 'light';\n  });`
    );
  }
  
  // 5. Fix body class logic
  content = content.replace(
    /useEffect\(\(\) => \{\s*document\.body\.classList\.add\('dark-theme'\);\s*localStorage\.setItem\('stellamaris_theme', 'dark'\);\s*\}, \[\]\);/,
    `useEffect(() => {\n    if (isDarkMode) {\n      document.body.classList.remove('light-theme');\n      localStorage.setItem('stellamaris_theme', 'dark');\n    } else {\n      document.body.classList.add('light-theme');\n      localStorage.setItem('stellamaris_theme', 'light');\n    }\n  }, [isDarkMode]);`
  );

  // 6. Remove the mobile BugReportModal block entirely
  content = content.replace(
    /\{\s*\/\* Bug Report Modal \*\/\s*\}([\s\S]*?)isBugModalOpen && \([\s\S]*?\}\)/,
    ''
  );

  // 7. Remove mobile Theme Toggle entirely
  content = content.replace(
    /\{\s*\/\* Theme Toggle \*\/\s*\}([\s\S]*?)false && \([\s\S]*?\}\)/,
    ''
  );

  fs.writeFileSync(file, content);
}
console.log('Fixed TypeScript errors in App.tsx');
