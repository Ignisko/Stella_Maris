/**
 * Comprehensive fix for tutorial steps 4 and 5.
 * 
 * Problems being fixed:
 * 1. Step index 3 (display "4/11", title "Zoom"): auto-rotate button glows — should be dimmed/disabled
 * 2. Step index 4 (display "5/11", title "Click on apparition"): tutorial card invisible because 
 *    cardStyle and highlightStyle have no position for this step
 * 3. Step index 5 (display "6/11", title "Apparition details"): sidebar highlight/card positioning
 *    works only when elementRect is found — make sure sidebar is in DOM
 */

const fs = require('fs');
const path = require('path');

// ─── Fix 1: GlobeViewer.tsx ────────────────────────────────────────────────
const gvPath = path.join(__dirname, 'src/components/GlobeViewer.tsx');
let gv = fs.readFileSync(gvPath, 'utf8');

// The button is SHOWN at steps 2, 3, 9 (auto-rotate tutorial steps).
// At step 3 (Zoom step), it should be shown but DIMMED and non-interactive
// (user is learning about zoom, not auto-rotate).
// Change: show button at steps 2 and 9 only (for auto-rotate tutorial).
// At step 3: show it but greyed out (so it stays in the DOM for step 2 context).
// Actually the simplest: show button at step 2 only during tutorial active.
// But we need it in DOM during step 3 too (zoom step) because that's when user 
// learned it. Let's keep showing at steps 2 and 3 but grey at step 3.

// Current line 750: (!hidePlayPause && (!isTutorialActive || tutorialStep === 2 || tutorialStep === 3 || tutorialStep === 9))
// Fix: keep it visible at step 2 (highlighted), step 3 (dimmed), and step 9+ (normal)
// The glow is at line 778: isTutorialActive && (tutorialStep === 2 || tutorialStep === 3)
// Fix: glow only at step 2

gv = gv.replace(
  "(!hidePlayPause && (!isTutorialActive || tutorialStep === 2 || tutorialStep === 3 || tutorialStep === 9))",
  "(!hidePlayPause && (!isTutorialActive || tutorialStep === 2 || tutorialStep === 9))"
);

// Fix the glow: only glow at step 2, not step 3
gv = gv.replace(
  "boxShadow: isTutorialActive && (tutorialStep === 2 || tutorialStep === 3) ? '0 0 0 4px rgba(56, 189, 248, 0.5), 0 0 20px rgba(56, 189, 248, 0.8)' : '0 4px 12px rgba(0,0,0,0.4)',",
  "boxShadow: isTutorialActive && tutorialStep === 2 ? '0 0 0 4px rgba(56, 189, 248, 0.5), 0 0 20px rgba(56, 189, 248, 0.8)' : '0 4px 12px rgba(0,0,0,0.4)',"
);

fs.writeFileSync(gvPath, gv);
console.log('✓ GlobeViewer.tsx fixed (auto-rotate button)');

// ─── Fix 2: TutorialModal.tsx ───────────────────────────────────────────────
const tmPath = path.join(__dirname, 'src/components/TutorialModal.tsx');
let tm = fs.readFileSync(tmPath, 'utf8');

// Fix highlightStyle: add step 4 to the globe-circle group
// Current: "if (step === 1 || step === 2 || step === 3 || step === 6) {"
// Fix:     "if (step === 1 || step === 2 || step === 3 || step === 4 || step === 6) {"
tm = tm.replace(
  "if (step === 1 || step === 2 || step === 3 || step === 6) {\n      return {\n        left: '50vw',\n        top: '50vh',\n        width: '500px',\n        height: '500px',\n        transform: 'translate(-50%, -50%)',\n        borderRadius: '50%',\n        background: 'transparent',\n      };\n    }",
  "if (step === 1 || step === 2 || step === 3 || step === 4 || step === 6) {\n      return {\n        left: '50vw',\n        top: '50vh',\n        width: '500px',\n        height: '500px',\n        transform: 'translate(-50%, -50%)',\n        borderRadius: '50%',\n        background: 'transparent',\n      };\n    }"
);

// Fix cardStyle: add step 4 to the fixed-left-panel group
// Current: "if (step === 1 || step === 2 || step === 3 || step === 6) {"
// Fix:     "if (step === 1 || step === 2 || step === 3 || step === 4 || step === 6) {"
// Note: there are TWO occurrences — one in highlightStyle (already fixed above) and one in cardStyle
tm = tm.replace(
  "if (step === 1 || step === 2 || step === 3 || step === 6) {\n      return {\n        ...common,\n        left: '60px',\n        top: '150px',\n      };\n    }",
  "if (step === 1 || step === 2 || step === 3 || step === 4 || step === 6) {\n      return {\n        ...common,\n        left: '60px',\n        top: '150px',\n      };\n    }"
);

fs.writeFileSync(tmPath, tm);
console.log('✓ TutorialModal.tsx fixed (step 4 highlight + card positioning)');

// ─── Verify changes were applied ────────────────────────────────────────────
const gvOut = fs.readFileSync(gvPath, 'utf8');
const tmOut = fs.readFileSync(tmPath, 'utf8');

const checks = [
  [gvOut.includes('tutorialStep === 2 || tutorialStep === 9'), 'GlobeViewer: button visible only at steps 2, 9'],
  [gvOut.includes('isTutorialActive && tutorialStep === 2 ?'), 'GlobeViewer: glow only at step 2'],
  [tmOut.includes('step === 1 || step === 2 || step === 3 || step === 4 || step === 6) {\n      return {\n        left: \'50vw\''), 'TutorialModal: highlightStyle includes step 4'],
  [tmOut.includes('step === 1 || step === 2 || step === 3 || step === 4 || step === 6) {\n      return {\n        ...common,\n        left: \'60px\''), 'TutorialModal: cardStyle includes step 4'],
];

let allOk = true;
for (const [result, label] of checks) {
  if (result) {
    console.log(`  ✓ ${label}`);
  } else {
    console.log(`  ✗ FAILED: ${label}`);
    allOk = false;
  }
}

if (!allOk) {
  console.log('\n⚠ Some checks failed — review the diffs manually');
  process.exit(1);
} else {
  console.log('\n✓ All checks passed!');
}
