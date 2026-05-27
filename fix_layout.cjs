const fs = require('fs');
const file = 'c:/Users/ignac/Documents/github projects/stellamaris.help/src/components/TutorialModal.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(
  '      if (step === 4) selector = \u0027#search-filters-container\u0027;\n' +
  '      else if (step === 5) selector = \u0027#filter-tabs-content-container\u0027;\n' +
  '      else if (step === 6) selector = \u0027#browse-directory-button\u0027;\n' +
  '      else if (step === 7) selector = \u0027#directory-modal-container\u0027;\n' +
  '      else if (step === 8) selector = \u0027#timeline-closed-pill\u0027;\n' +
  '      else if (step === 9) selector = \u0027#timeline-play-presentation-button\u0027;\n' +
  '      else if (step === 10) selector = \u0027#auto-rotate-button\u0027;',
  '      if (step === 2) selector = \u0027#auto-rotate-button\u0027;\n' +
  '      else if (step === 5) selector = \u0027#search-filters-container\u0027;\n' +
  '      else if (step === 6) selector = \u0027#filter-tabs-content-container\u0027;\n' +
  '      else if (step === 7) selector = \u0027#browse-directory-button\u0027;\n' +
  '      else if (step === 8) selector = \u0027#directory-modal-container\u0027;\n' +
  '      else if (step === 9) selector = \u0027#timeline-closed-pill\u0027;\n' +
  '      else if (step === 10) selector = \u0027#timeline-play-presentation-button\u0027;'
);

c = c.replace(
  'if (step === 1 || step === 2 || step === 3) {',
  'if (step === 1 || step === 3 || step === 4) {'
);
c = c.replace(
  'if (step === 1 || step === 2 || step === 3) {',
  'if (step === 1 || step === 3 || step === 4) {'
);

c = c.replace(
  '      if (step === 4) {\n' +
  '        paddingT = 2; // reduces the excessive top space to center the frame\n' +
  '        paddingB = 10; // shifts the highlight down slightly to center it evenly\n' +
  '      }',
  '      if (step === 5) {\n' +
  '        paddingT = 2; // reduces the excessive top space to center the frame\n' +
  '        paddingB = 10; // shifts the highlight down slightly to center it evenly\n' +
  '      }'
);

c = c.replace(
  '      switch (step) {\n' +
  '        case 4:\n' +
  '        case 5:\n' +
  '        case 6:\n' +
  '          return {\n' +
  '            ...common,\n' +
  '            left: \px,\n' +
  '            top: \px,\n' +
  '          };\n' +
  '        case 7:\n' +
  '          return {\n' +
  '            ...common,\n' +
  '            left: \u002750px\u0027,\n' +
  '            bottom: \u002730px\u0027,\n' +
  '            width: \u0027420px\u0027,\n' +
  '          };\n' +
  '        case 8:\n' +
  '          return {\n' +
  '            ...common,\n' +
  '            left: \px,\n' +
  '            bottom: \u002730px\u0027,\n' +
  '          };\n' +
  '        case 9:\n' +
  '          return {\n' +
  '            ...common,\n' +
  '            left: \u002750px\u0027,\n' +
  '            bottom: \px,\n' +
  '            width: \u0027420px\u0027,\n' +
  '          };\n' +
  '        case 10:\n' +
  '          return {\n' +
  '            ...common,\n' +
  '            left: \px,\n' +
  '            bottom: \u002730px\u0027,\n' +
  '          };',
  '      switch (step) {\n' +
  '        case 5:\n' +
  '        case 6:\n' +
  '        case 7:\n' +
  '          return {\n' +
  '            ...common,\n' +
  '            left: \px,\n' +
  '            top: \px,\n' +
  '          };\n' +
  '        case 8:\n' +
  '          return {\n' +
  '            ...common,\n' +
  '            left: \u002750px\u0027,\n' +
  '            bottom: \u002730px\u0027,\n' +
  '            width: \u0027420px\u0027,\n' +
  '          };\n' +
  '        case 9:\n' +
  '          return {\n' +
  '            ...common,\n' +
  '            left: \px,\n' +
  '            bottom: \u002730px\u0027,\n' +
  '          };\n' +
  '        case 10:\n' +
  '          return {\n' +
  '            ...common,\n' +
  '            left: \u002750px\u0027,\n' +
  '            bottom: \px,\n' +
  '            width: \u0027420px\u0027,\n' +
  '          };\n' +
  '        case 2:\n' +
  '          return {\n' +
  '            ...common,\n' +
  '            left: \px,\n' +
  '            bottom: \u002730px\u0027,\n' +
  '          };'
);

c = c.replace(
  'if (step === 0 || step === 1 || step === 2 || step === 3 || step === 11 || !elementRect) return null;',
  'if (step === 0 || step === 1 || step === 3 || step === 4 || step === 11 || !elementRect) return null;'
);

c = c.replace(
  '    switch (step) {\n' +
  '      case 4:\n' +
  '      case 5:\n' +
  '      case 6:\n' +
  '      case 10:\n' +
  '        return {\n' +
  '          ...base,\n' +
  '          top: \u002730px\u0027,\n' +
  '          left: \u0027-10px\u0027,\n' +
  '          borderWidth: \u002710px 10px 10px 0\u0027,\n' +
  '          borderColor: \u0027transparent rgba(15, 23, 42, 0.96) transparent transparent\u0027,\n' +
  '        };\n' +
  '      case 8:\n' +
  '        return {\n' +
  '          ...base,\n' +
  '          bottom: \u002724px\u0027,\n' +
  '          right: \u0027-10px\u0027,\n' +
  '          borderWidth: \u002710px 0 10px 10px\u0027,\n' +
  '          borderColor: \u0027transparent transparent transparent rgba(15, 23, 42, 0.96)\u0027,\n' +
  '        };\n' +
  '      case 9:\n' +
  '        return {\n' +
  '          ...base,\n' +
  '          bottom: \u0027-10px\u0027,\n' +
  '          left: \u002740px\u0027,\n' +
  '          borderWidth: \u002710px 10px 0 10px\u0027,\n' +
  '          borderColor: \u0027rgba(15, 23, 42, 0.96) transparent transparent transparent\u0027,\n' +
  '        };\n' +
  '      case 7:',
  '    switch (step) {\n' +
  '      case 5:\n' +
  '      case 6:\n' +
  '      case 7:\n' +
  '      case 2:\n' +
  '        return {\n' +
  '          ...base,\n' +
  '          top: \u002730px\u0027,\n' +
  '          left: \u0027-10px\u0027,\n' +
  '          borderWidth: \u002710px 10px 10px 0\u0027,\n' +
  '          borderColor: \u0027transparent rgba(15, 23, 42, 0.96) transparent transparent\u0027,\n' +
  '        };\n' +
  '      case 9:\n' +
  '        return {\n' +
  '          ...base,\n' +
  '          bottom: \u002724px\u0027,\n' +
  '          right: \u0027-10px\u0027,\n' +
  '          borderWidth: \u002710px 0 10px 10px\u0027,\n' +
  '          borderColor: \u0027transparent transparent transparent rgba(15, 23, 42, 0.96)\u0027,\n' +
  '        };\n' +
  '      case 10:\n' +
  '        return {\n' +
  '          ...base,\n' +
  '          bottom: \u0027-10px\u0027,\n' +
  '          left: \u002740px\u0027,\n' +
  '          borderWidth: \u002710px 10px 0 10px\u0027,\n' +
  '          borderColor: \u0027rgba(15, 23, 42, 0.96) transparent transparent transparent\u0027,\n' +
  '        };\n' +
  '      case 8:'
);

fs.writeFileSync(file, c);
console.log('Done!');
