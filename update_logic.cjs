const fs = require('fs');

// App.tsx
let appFile = 'c:/Users/ignac/Documents/github projects/stellamaris.help/src/App.tsx';
let appC = fs.readFileSync(appFile, 'utf8');

// Hide timeline completely except when not tutorial OR during timeline steps
appC = appC.replace(
  '{filteredApparitions.length > 0 && (!isTutorialActive || tutorialStep >= 8) && (',
  '{filteredApparitions.length > 0 && (!isTutorialActive || (tutorialStep >= 9 && tutorialStep <= 10)) && ('
);

// Sidebar close
appC = appC.replace(
  'if (isTutorialActive && tutorialStep === 3) {\\n              setTutorialStep(4);',
  'if (isTutorialActive && tutorialStep === 4) {\\n              setTutorialStep(5);'
);

// DirectoryModal close
appC = appC.replace(
  'if (isTutorialActive && tutorialStep === 7) {\\n            setTutorialStep(8);',
  'if (isTutorialActive && tutorialStep === 8) {\\n            setTutorialStep(9);'
);
appC = appC.replace(
  'if (isTutorialActive && tutorialStep === 8) {\\n            setTutorialStep(9);', // in case previous one didn't have 7->8 but 8->9
  'if (isTutorialActive && tutorialStep === 8) {\\n            setTutorialStep(9);'
);

// Timeline open/close
appC = appC.replace(
  'if (open && isTutorialActive && tutorialStep === 8) {\\n              setTutorialStep(9);\\n            } else if (!open && isTutorialActive && tutorialStep === 9) {\\n              setTutorialStep(10);',
  'if (open && isTutorialActive && tutorialStep === 9) {\\n              setTutorialStep(10);\\n            } else if (!open && isTutorialActive && tutorialStep === 10) {\\n              setTutorialStep(11);'
);
fs.writeFileSync(appFile, appC);

// GlobeViewer.tsx
let globeFile = 'c:/Users/ignac/Documents/github projects/stellamaris.help/src/components/GlobeViewer.tsx';
let globeC = fs.readFileSync(globeFile, 'utf8');
globeC = globeC.replace(
  'if (isTutorialActive && tutorialStep === 10) {\\n            setTutorialStep(11);',
  'if (isTutorialActive && tutorialStep === 2) {\\n            setTutorialStep(3);'
);
fs.writeFileSync(globeFile, globeC);

console.log('App and GlobeViewer updated');
