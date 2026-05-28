const fs = require('fs');

let tm = fs.readFileSync('src/components/TutorialModal.tsx', 'utf8');

tm = tm.replace(
  `      if (step === 1 || step === 3) selector = '#map-container';\n      else if (step === 2) selector = '#auto-rotate-button';`,
  `      if (step === 1 || step === 2 || step === 3) selector = '#map-container';`
);

tm = tm.replace(
  `    if (step === 1 || step === 3) {\n` +
  `      return {\n` +
  `        ...common,\n` +
  `        left: '60px',\n` +
  `        top: '150px',\n` +
  `      };\n` +
  `    }\n\n` +
  `    if (elementRect) {\n` +
  `      switch (step) {\n` +
  `        case 2:\n` +
  `          return {\n` +
  `            ...common,\n` +
  `            left: \`\${elementRect.right + 20}px\`,\n` +
  `            top: \`\${Math.max(20, elementRect.top - 80)}px\`,\n` +
  `          };`,
  `    if (step === 1 || step === 2 || step === 3) {\n` +
  `      return {\n` +
  `        ...common,\n` +
  `        left: '60px',\n` +
  `        top: '150px',\n` +
  `      };\n` +
  `    }\n\n` +
  `    if (elementRect) {\n` +
  `      switch (step) {`
);

tm = tm.replace(
  `<div style={{ flex: 1, marginTop: '2px' }}>`,
  `<div style={{ flex: 1, marginTop: '2px', paddingRight: step >= 0 && step < steps.length - 1 ? '45px' : '0' }}>`
);

fs.writeFileSync('src/components/TutorialModal.tsx', tm);

let app = fs.readFileSync('src/App.tsx', 'utf8');

const globeViewerStart = app.indexOf('<GlobeViewer');
const globeViewerEnd = app.indexOf('/>', globeViewerStart) + 2;

const originalGlobeViewer = app.substring(globeViewerStart, globeViewerEnd);
const wrappedGlobeViewer = `<div style={{ pointerEvents: isTutorialActive && tutorialStep === 2 ? 'none' : 'auto', width: '100%', height: '100%' }}>\n          ${originalGlobeViewer}\n        </div>`;

app = app.substring(0, globeViewerStart) + wrappedGlobeViewer + app.substring(globeViewerEnd);

const autoRotateStart = app.indexOf('id="auto-rotate-button"');
const boxShadowInsertPoint = app.indexOf('color: ', autoRotateStart);
const insertIndex = app.indexOf(',', boxShadowInsertPoint) + 1;

app = app.substring(0, insertIndex) + `\n          boxShadow: isTutorialActive && tutorialStep === 2 ? '0 0 0 4px rgba(56, 189, 248, 0.5), 0 0 20px rgba(56, 189, 248, 0.8)' : undefined,` + app.substring(insertIndex);

fs.writeFileSync('src/App.tsx', app);
console.log('Successfully updated step 2 highlight and title padding!');
