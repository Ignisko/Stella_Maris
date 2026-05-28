const fs = require('fs');
const file = 'src/components/TutorialModal.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  `      if (step === 2) selector = '#auto-rotate-button';\n` +
  `      else if (step === 5) selector = '#search-filters-container';\n` +
  `      else if (step === 6) selector = '#filter-tabs-content-container';\n` +
  `      else if (step === 7) selector = '#browse-directory-button';\n` +
  `      else if (step === 8) selector = '#directory-modal-container';\n` +
  `      else if (step === 9) selector = '#timeline-closed-pill';\n` +
  `      else if (step === 10) selector = '#timeline-play-presentation-button';`,
  `      if (step === 2) selector = '#auto-rotate-button';\n` +
  `      else if (step === 4) selector = '#action-row-container';\n` +
  `      else if (step === 5) selector = '#filter-tabs-content-container';\n` +
  `      else if (step === 6) selector = '#browse-directory-button';\n` +
  `      else if (step === 7) selector = '#directory-modal-container';\n` +
  `      else if (step === 8) selector = '#timeline-closed-pill';\n` +
  `      else if (step === 9) selector = '#timeline-play-presentation-button';`
);

content = content.replace(
  `if (step === 1 || step === 3 || step === 4) {`,
  `if (step === 1 || step === 3) {`
);
content = content.replace(
  `if (step === 1 || step === 3 || step === 4) {`,
  `if (step === 1 || step === 3) {`
);
content = content.replace(
  `if (step === 0 || step === 1 || step === 3 || step === 4 || step === 11 || !elementRect) return null;`,
  `if (step === 0 || step === 1 || step === 3 || step === 10 || !elementRect) return null;`
);

content = content.replace(
  `        case 5:\n` +
  `        case 6:\n` +
  `        case 7:\n` +
  `          return {\n` +
  `            ...common,\n` +
  `            left: \`\${elementRect.right + 20}px\`,\n` +
  `            top: \`\${elementRect.top}px\`,\n` +
  `          };\n` +
  `        case 8:\n` +
  `          return {\n` +
  `            ...common,\n` +
  `            left: '50px',\n` +
  `            bottom: '30px',\n` +
  `            width: '420px',\n` +
  `          };\n` +
  `        case 9:\n` +
  `          return {\n` +
  `            ...common,\n` +
  `            left: \`\${elementRect.left - 380}px\`,\n` +
  `            bottom: '30px',\n` +
  `          };\n` +
  `        case 10:`,
  `        case 4:\n` +
  `        case 5:\n` +
  `        case 6:\n` +
  `          return {\n` +
  `            ...common,\n` +
  `            left: \`\${elementRect.right + 20}px\`,\n` +
  `            top: \`\${elementRect.top}px\`,\n` +
  `          };\n` +
  `        case 7:\n` +
  `          return {\n` +
  `            ...common,\n` +
  `            left: '50px',\n` +
  `            bottom: '30px',\n` +
  `            width: '420px',\n` +
  `          };\n` +
  `        case 8:\n` +
  `          return {\n` +
  `            ...common,\n` +
  `            left: \`\${elementRect.left - 380}px\`,\n` +
  `            bottom: '30px',\n` +
  `          };\n` +
  `        case 9:`
);

content = content.replace(
  `      if (step === 5) {\n` +
  `        paddingT = 2; // reduces the excessive top space to center the frame\n` +
  `        paddingB = 10; // shifts the highlight down slightly to center it evenly\n` +
  `      }`,
  `      if (step === 4) {\n` +
  `        paddingT = 2; // reduces the excessive top space to center the frame\n` +
  `        paddingB = 10; // shifts the highlight down slightly to center it evenly\n` +
  `      }`
);

content = content.replace(
  `      case 5:\n` +
  `      case 6:\n` +
  `      case 7:\n` +
  `      case 10:\n` +
  `        return {\n` +
  `          ...base,\n` +
  `          top: '30px',\n` +
  `          left: '-10px',\n` +
  `          borderWidth: '10px 10px 10px 0',\n` +
  `          borderColor: 'transparent rgba(15, 23, 42, 0.96) transparent transparent',\n` +
  `        };\n` +
  `      case 8:\n` +
  `        return {\n` +
  `          ...base,\n` +
  `          bottom: '24px',\n` +
  `          right: '-10px',\n` +
  `          borderWidth: '10px 0 10px 10px',\n` +
  `          borderColor: 'transparent transparent transparent rgba(15, 23, 42, 0.96)',\n` +
  `        };\n` +
  `      case 9:`,
  `      case 4:\n` +
  `      case 5:\n` +
  `      case 6:\n` +
  `      case 9:\n` +
  `        return {\n` +
  `          ...base,\n` +
  `          top: '30px',\n` +
  `          left: '-10px',\n` +
  `          borderWidth: '10px 10px 10px 0',\n` +
  `          borderColor: 'transparent rgba(15, 23, 42, 0.96) transparent transparent',\n` +
  `        };\n` +
  `      case 7:\n` +
  `        return {\n` +
  `          ...base,\n` +
  `          bottom: '24px',\n` +
  `          right: '-10px',\n` +
  `          borderWidth: '10px 0 10px 10px',\n` +
  `          borderColor: 'transparent transparent transparent rgba(15, 23, 42, 0.96)',\n` +
  `        };\n` +
  `      case 8:`
);

fs.writeFileSync(file, content);
