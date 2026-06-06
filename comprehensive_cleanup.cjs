const fs = require('fs');

const files = [
  'c:/Users/ignac/Documents/github projects/Catholic_projects/stella-maris/src/App.tsx',
  'c:/Users/ignac/Documents/github projects/Catholic_projects/eucharistic-miracles/src/App.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  // 1. Remove Bug from phosphor-icons
  content = content.replace(/, MagnifyingGlass, Bug }/, ', MagnifyingGlass }');
  
  // 2. Remove BugReportModal import
  content = content.replace(/import BugReportModal from '\.\/components\/BugReportModal';\r?\n?/, '');

  // 3. Lazy load TutorialModal
  content = content.replace(
    /import TutorialModal from '\.\/components\/TutorialModal';/,
    "import { lazy, Suspense } from 'react';\nconst TutorialModal = lazy(() => import('./components/TutorialModal'));"
  );
  
  // 4. Remove exitTranslations & playPresentationTranslations blocks
  content = content.replace(/const exitTranslations: Record<string, string> = \{[\s\S]*?\};\s*const playPresentationTranslations: Record<string, string> = \{[\s\S]*?\};\s*/, '// Translations moved to i18n.ts\n');

  // 5. Remove dead states: isBugModalOpen and isDarkMode
  content = content.replace(/const \[isBugModalOpen, setIsBugModalOpen\] = useState\(false\);\r?\n?/, '');
  
  // 6. Fix isDarkMode effect -> just set body to dark-theme
  content = content.replace(
    /const \[isDarkMode, setIsDarkMode\] = useState<boolean>\(\(\) => \{[\s\S]*?\}\);\s*useEffect\(\(\) => \{[\s\S]*?\}, \[isDarkMode\]\);/,
    "useEffect(() => {\n    document.body.classList.add('dark-theme');\n    localStorage.setItem('stellamaris_theme', 'dark');\n  }, []);"
  );

  // 7. Remove dead filters open block
  content = content.replace(
    /\/\/ Filters no longer forced open by a step\s*if \(false\) \{\s*setIsFiltersExpanded\(true\);\s*\} else \{\s*setIsFiltersExpanded\(false\);\s*\}/,
    'setIsFiltersExpanded(false);'
  );

  // 8. Remove hidden title card
  content = content.replace(
    /\{\/\* Title Card \*\/\}([\s\S]*?)<\/div>/,
    '{/* Title Card removed */}'
  );

  // 9. Add aria-label to Play/Pause button
  content = content.replace(
    /title=\{isPlayingTimeline \? \(lang === 'pl' \? 'Wstrzymaj prezentację' : 'Pause Presentation'\) : \(playPresentationTranslations\[lang\] \|\| 'Play Presentation'\)\}/,
    "title={isPlayingTimeline ? (lang === 'pl' ? 'Wstrzymaj prezentację' : 'Pause Presentation') : t('playPresentation', lang)}\n                    aria-label={isPlayingTimeline ? (lang === 'pl' ? 'Wstrzymaj prezentację' : 'Pause Presentation') : t('playPresentation', lang)}"
  );

  // 10. Add aria-label to Browse Directory button
  content = content.replace(
    /title=\{t\('browseDirectory', lang, \{ count: filteredApparitions.length \}\)\}/,
    "title={t('browseDirectory', lang, { count: filteredApparitions.length })}\n                  aria-label={t('browseDirectory', lang, { count: filteredApparitions.length })}"
  );

  // 11. Remove Theme Toggle and Bug Report buttons
  content = content.replace(/\{\/\* Theme Toggle Button \(Desktop\) \*\/\}([\s\S]*?)\{\/\* Help \/ Onboarding Tutorial Button \*\/\}/, '{/* Help / Onboarding Tutorial Button */}');
  content = content.replace(/\{\/\* Bug Report Button \*\/\}([\s\S]*?)\{\/\* Top Right Language Switcher \*\/\}/, '{/* Top Right Language Switcher */}');
  
  // 12. Wrap TutorialModal in Suspense
  content = content.replace(
    /<TutorialModal\s+isOpen=\{isTutorialActive\}[\s\S]*?\/>/,
    "<Suspense fallback={null}>\n        {isTutorialActive && (\n$&        )}\n      </Suspense>"
  );

  // 13. Accessibility fix: update documentElement.lang
  content = content.replace(
    /localStorage\.setItem\('stellamaris_lang', lang\);/,
    "localStorage.setItem('stellamaris_lang', lang);\n    document.documentElement.lang = lang;"
  );

  // 14. Fix remaining mobile theme/bug toggles
  content = content.replace(/\{\/\* Theme Toggle \*\/\}\s*\{false && \([\s\S]*?\}\)/, '');
  content = content.replace(/\{\/\* Bug Report Modal \*\/\}\s*\{isBugModalOpen && \([\s\S]*?\}\)/, '');

  fs.writeFileSync(file, content);
}
console.log('App.tsx files successfully processed with strict string replacements');
