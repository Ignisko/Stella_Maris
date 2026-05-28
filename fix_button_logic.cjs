const fs = require('fs');

// 1. Fix App.tsx
let app = fs.readFileSync('src/App.tsx', 'utf8');
const rogueString = `\n          boxShadow: isTutorialActive && tutorialStep === 2 ? '0 0 0 4px rgba(56, 189, 248, 0.5), 0 0 20px rgba(56, 189, 248, 0.8)' : undefined,`;
app = app.replace(rogueString, '');
fs.writeFileSync('src/App.tsx', app);

// 2. Fix GlobeViewer.tsx
let globe = fs.readFileSync('src/components/GlobeViewer.tsx', 'utf8');

// The auto-rotate button should be visible if NOT tutorial, OR if tutorial step is 2 or 9
globe = globe.replace(
  `{(!hidePlayPause && (!isTutorialActive || tutorialStep === 11)) && (`,
  `{(!hidePlayPause && (!isTutorialActive || tutorialStep === 2 || tutorialStep === 9)) && (`
);

// We need to inject the glowing boxShadow style into the auto-rotate button
const btnIdPattern = `id="auto-rotate-button"`;
const btnStart = globe.indexOf(btnIdPattern);

// Find the style object of the button
const styleStart = globe.indexOf('style={{', btnStart);
const colorEnd = globe.indexOf(`color: `, styleStart);
const insertPos = globe.indexOf(`,`, colorEnd) + 1;

globe = globe.substring(0, insertPos) + `\n              boxShadow: isTutorialActive && tutorialStep === 2 ? '0 0 0 4px rgba(56, 189, 248, 0.5), 0 0 20px rgba(56, 189, 248, 0.8)' : undefined,` + globe.substring(insertPos);

fs.writeFileSync('src/components/GlobeViewer.tsx', globe);
console.log('Fixed buttons and removed corrupted JSX!');
