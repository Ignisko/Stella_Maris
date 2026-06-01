const fs = require('fs');
const path = require('path');

// ─── App.tsx ─────────────────────────────────────────────────────────────────
const appPath = path.join(__dirname, 'src/App.tsx');
let app = fs.readFileSync(appPath, 'utf8');

// Fix 1: useEffect — only keep guadalupe at step 5, not step 6
app = app.replace(
  '\r\n    if (tutorialStep === 5 || tutorialStep === 6) {\r\n      if (tutorialStep === 6 && !selectedApparition) {\r\n        const guadalupe = translatedApparitionsData.find(app => app.id === \'guadalupe_mexico\');\r\n        if (guadalupe) {\r\n          setSelectedApparition(guadalupe);\r\n        }\r\n      }\r\n    } else {\r\n      setSelectedApparition(null);\r\n    }',
  '\r\n    if (tutorialStep === 5) {\r\n      // Step 5 = "Apparition details" — always ensure Guadalupe sidebar is open\r\n      if (!selectedApparition) {\r\n        const guadalupe = translatedApparitionsData.find(app => app.id === \'guadalupe_mexico\');\r\n        if (guadalupe) {\r\n          setSelectedApparition(guadalupe);\r\n        }\r\n      }\r\n    } else {\r\n      setSelectedApparition(null);\r\n    }'
);

const check1 = app.includes('if (tutorialStep === 5) {') && !app.includes('tutorialStep === 5 || tutorialStep === 6');
console.log(check1 ? '✓ Fix 1: useEffect' : '✗ Fix 1 FAILED');

// Fix 2: Sidebar onClose — advance from step 5 → 6
app = app.replace(
  'onClose={() => {\r\n            setSelectedApparition(null);\r\n            if (isTutorialActive && tutorialStep === 6) {\r\n              setTutorialStep(6);\r\n            }\r\n          }}',
  'onClose={() => {\r\n            setSelectedApparition(null);\r\n            if (isTutorialActive && tutorialStep === 5) {\r\n              setTutorialStep(6); // Advance: "Apparition details" → "Search & filters"\r\n            }\r\n          }}'
);

const check2 = app.includes('isTutorialActive && tutorialStep === 5) {\r\n              setTutorialStep(6)');
console.log(check2 ? '✓ Fix 2: Sidebar onClose' : '✗ Fix 2 FAILED');

fs.writeFileSync(appPath, app);

// ─── TutorialModal.tsx ────────────────────────────────────────────────────────
const tmPath = path.join(__dirname, 'src/components/TutorialModal.tsx');
let tm = fs.readFileSync(tmPath, 'utf8');

// Normalize to LF for reliable matching
tm = tm.replace(/\r\n/g, '\n');

// Fix 3: updateRect — correct all selector step numbers
const count_old = (tm.match(/else if \(step === 7\) selector = '#search-filters-container'/g) || []).length;
console.log(`Found ${count_old} old updateRect selector lines to fix`);

tm = tm
  .replace("else if (step === 7) selector = '#search-filters-container';", "else if (step === 6) selector = '#search-filters-container';")
  .replace("else if (step === 8) selector = '#filter-tabs-content-container';", "else if (step === 7) selector = '#browse-directory-button';")
  .replace("else if (step === 9) selector = '#browse-directory-button';", "else if (step === 8) selector = '#directory-modal-container';")
  .replace("else if (step === 10) selector = '#directory-modal-container';", "else if (step === 9) selector = '#timeline-closed-pill';")
  .replace("else if (step === 11) selector = '#timeline-closed-pill';", "else if (step === 10) selector = '#timeline-play-presentation-button';")
  .replace("\n      else if (step === 12) selector = '#timeline-play-presentation-button';", '')
  .replace("\n      else if (step === 13) selector = '#auto-rotate-button';", '');

const check3 = tm.includes("else if (step === 6) selector = '#search-filters-container'") &&
               !tm.includes("else if (step === 13)");
console.log(check3 ? '✓ Fix 3: updateRect selectors' : '✗ Fix 3 FAILED');

// Fix 4: highlightStyle — step 13 → step 11 (no spotlight for final step)
tm = tm.replace(
  'if (step === 0 || step === 13) {\n      return {\n        left: \'-100px\',\n        top: \'-100px\',\n        width: \'0px\',\n        height: \'0px\',\n        border: \'none\',\n        boxShadow: \'0 0 0 9999px rgba(5, 8, 22, 0.75)\',\n        background: \'transparent\',\n      };\n    }',
  'if (step === 0 || step === 11) {\n      return {\n        left: \'-100px\',\n        top: \'-100px\',\n        width: \'0px\',\n        height: \'0px\',\n        border: \'none\',\n        boxShadow: \'0 0 0 9999px rgba(5, 8, 22, 0.75)\',\n        background: \'transparent\',\n      };\n    }'
);
console.log(tm.includes('if (step === 0 || step === 11) {') ? '✓ Fix 4: highlightStyle step 13→11' : '✗ Fix 4 FAILED');

// Fix 5: highlightStyle — remove step 6 from globe-circle group 
// (step 6 now shows search container highlight via elementRect)
tm = tm.replace(
  'if (step === 1 || step === 2 || step === 3 || step === 4 || step === 6) {\n      return {\n        left: \'50vw\',\n        top: \'50vh\',\n        width: \'500px\',\n        height: \'500px\',\n        transform: \'translate(-50%, -50%)\',\n        borderRadius: \'50%\',\n        background: \'transparent\',\n      };\n    }',
  'if (step === 1 || step === 2 || step === 3 || step === 4) {\n      return {\n        left: \'50vw\',\n        top: \'50vh\',\n        width: \'500px\',\n        height: \'500px\',\n        transform: \'translate(-50%, -50%)\',\n        borderRadius: \'50%\',\n        background: \'transparent\',\n      };\n    }'
);
const check5 = !tm.includes('step === 4 || step === 6) {\n      return {\n        left: \'50vw\'');
console.log(check5 ? '✓ Fix 5: highlightStyle removed step 6 from globe group' : '✗ Fix 5 FAILED');

// Fix 6: cardStyle — step 13 → step 11 for centered card
tm = tm.replace(
  'if (step === 0 || step === 13) {\n      return {\n        ...common,\n        left: \'50vw\',\n        top: \'50vh\',\n        transform: \'translate(-50%, -50%)\',\n        width: \'450px\',\n        maxWidth: \'90vw\',\n        textAlign: step === 13 ? \'center\' : \'left\',\n        alignItems: step === 13 ? \'center\' : \'stretch\'\n      };\n    }',
  'if (step === 0 || step === 11) {\n      return {\n        ...common,\n        left: \'50vw\',\n        top: \'50vh\',\n        transform: \'translate(-50%, -50%)\',\n        width: \'450px\',\n        maxWidth: \'90vw\',\n        textAlign: step === 11 ? \'center\' : \'left\',\n        alignItems: step === 11 ? \'center\' : \'stretch\'\n      };\n    }'
);
const check6 = tm.includes('if (step === 0 || step === 11) {\n      return {\n        ...common,\n        left: \'50vw\'');
console.log(check6 ? '✓ Fix 6: cardStyle step 13→11 centered group' : '✗ Fix 6 FAILED');

// Fix 7: cardStyle — remove step 6 from fixed-left group (it now uses elementRect)
tm = tm.replace(
  'if (step === 1 || step === 2 || step === 3 || step === 4 || step === 6) {\n      return {\n        ...common,\n        left: \'60px\',\n        top: \'150px\',\n      };\n    }',
  'if (step === 1 || step === 2 || step === 3 || step === 4) {\n      return {\n        ...common,\n        left: \'60px\',\n        top: \'150px\',\n      };\n    }'
);
const check7 = !tm.includes('step === 4 || step === 6) {\n      return {\n        ...common,\n        left: \'60px\'');
console.log(check7 ? '✓ Fix 7: cardStyle removed step 6 from fixed-left group' : '✗ Fix 7 FAILED');

// Fix 8: cardStyle switch — remove case 11 (handled by centered group above), keep 5,6,7,8,9,10
tm = tm.replace(
  '        case 11:\n          return {\n            ...common,\n            left: `${elementRect.right + 20}px`,\n            bottom: \'30px\',\n          };\n',
  ''
);
console.log(!tm.includes('case 11:') ? '✓ Fix 8: cardStyle removed case 11 from switch' : '✗ Fix 8 FAILED');

// Fix 9: arrowStyle — step 12 → step 11
tm = tm.replace(
  'if (step === 1 || step === 2 || step === 3 || step === 4 || step === 12 || !elementRect) return null;',
  'if (step === 0 || step === 1 || step === 2 || step === 3 || step === 4 || step === 11 || !elementRect) return null;'
);
const check9 = tm.includes('step === 4 || step === 11 || !elementRect');
console.log(check9 ? '✓ Fix 9: arrowStyle step 12→11' : '✗ Fix 9 FAILED');

// Restore CRLF
tm = tm.replace(/\n/g, '\r\n');
fs.writeFileSync(tmPath, tm);

console.log('\nDone! Run npm run build to verify.');
