const fs = require('fs');

let globe = fs.readFileSync('src/components/GlobeViewer.tsx', 'utf8');

// 1. Fix the visibility condition for the button
globe = globe.replace(
  `{(!hidePlayPause && (!isTutorialActive || tutorialStep === 11)) && (`,
  `{(!hidePlayPause && (!isTutorialActive || tutorialStep === 2 || tutorialStep === 9)) && (`
);

// 2. Fix the Box Shadow
// Find the exact line with the old box shadow
const oldBoxShadowPattern = `            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',\n            transition: 'all 0.2s ease'`;
const newBoxShadow = `            boxShadow: isTutorialActive && tutorialStep === 2 ? '0 0 0 4px rgba(56, 189, 248, 0.5), 0 0 20px rgba(56, 189, 248, 0.8)' : '0 4px 12px rgba(0,0,0,0.4)',\n            transition: 'all 0.2s ease'`;

if (globe.includes(oldBoxShadowPattern)) {
    globe = globe.replace(oldBoxShadowPattern, newBoxShadow);
} else {
    console.log("Could not find box shadow pattern!");
}

fs.writeFileSync('src/components/GlobeViewer.tsx', globe);
console.log('Successfully fixed GlobeViewer shadow and visibility!');
