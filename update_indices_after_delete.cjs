const fs = require('fs');

let tm = fs.readFileSync('src/components/TutorialModal.tsx', 'utf8');

tm = tm.replace(
  `      else if (step === 4) selector = '#action-row-container';\n` +
  `      else if (step === 5) selector = '#filter-tabs-content-container';\n` +
  `      else if (step === 6) selector = '#browse-directory-button';\n` +
  `      else if (step === 7) selector = '#directory-modal-container';\n` +
  `      else if (step === 8) selector = '#timeline-closed-pill';\n` +
  `      else if (step === 9) selector = '#timeline-play-presentation-button';`,
  `      else if (step === 4) selector = '#action-row-container';\n` +
  `      else if (step === 5) selector = '#browse-directory-button';\n` +
  `      else if (step === 6) selector = '#directory-modal-container';\n` +
  `      else if (step === 7) selector = '#timeline-closed-pill';\n` +
  `      else if (step === 8) selector = '#timeline-play-presentation-button';`
);

tm = tm.replace(
  `      switch (step) {\n` +
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
  `        case 9:\n` +
  `          return {\n` +
  `            ...common,\n` +
  `            top: '20vh',\n` +
  `            left: '50vw',\n` +
  `            bottom: 'auto',\n` +
  `            transform: 'translateX(-50%)',\n` +
  `            width: '420px',\n` +
  `          };`,
  `      switch (step) {\n` +
  `        case 4:\n` +
  `        case 5:\n` +
  `          return {\n` +
  `            ...common,\n` +
  `            left: \`\${elementRect.right + 20}px\`,\n` +
  `            top: \`\${elementRect.top}px\`,\n` +
  `          };\n` +
  `        case 6:\n` +
  `          return {\n` +
  `            ...common,\n` +
  `            left: '50px',\n` +
  `            bottom: '30px',\n` +
  `            width: '420px',\n` +
  `          };\n` +
  `        case 7:\n` +
  `          return {\n` +
  `            ...common,\n` +
  `            left: \`\${elementRect.left - 380}px\`,\n` +
  `            bottom: '30px',\n` +
  `          };\n` +
  `        case 8:\n` +
  `          return {\n` +
  `            ...common,\n` +
  `            top: '20vh',\n` +
  `            left: '50vw',\n` +
  `            bottom: 'auto',\n` +
  `            transform: 'translateX(-50%)',\n` +
  `            width: '420px',\n` +
  `          };`
);

tm = tm.replace(
  `    if (step === 0 || step === 1 || step === 3 || step === 9 || step === 10 || !elementRect) return null;`,
  `    if (step === 0 || step === 1 || step === 3 || step === 8 || step === 9 || !elementRect) return null;`
);

tm = tm.replace(
  `    switch (step) {\n` +
  `      case 4:\n` +
  `      case 5:\n` +
  `      case 6:\n` +
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
  `      case 8:\n` +
  `        return {\n` +
  `          ...base,\n` +
  `          bottom: '-10px',\n` +
  `          left: '40px',\n` +
  `          borderWidth: '10px 10px 0 10px',\n` +
  `          borderColor: 'rgba(15, 23, 42, 0.96) transparent transparent transparent',\n` +
  `        };`,
  `    switch (step) {\n` +
  `      case 4:\n` +
  `      case 5:\n` +
  `        return {\n` +
  `          ...base,\n` +
  `          top: '30px',\n` +
  `          left: '-10px',\n` +
  `          borderWidth: '10px 10px 10px 0',\n` +
  `          borderColor: 'transparent rgba(15, 23, 42, 0.96) transparent transparent',\n` +
  `        };\n` +
  `      case 6:\n` +
  `        return {\n` +
  `          ...base,\n` +
  `          bottom: '24px',\n` +
  `          right: '-10px',\n` +
  `          borderWidth: '10px 0 10px 10px',\n` +
  `          borderColor: 'transparent transparent transparent rgba(15, 23, 42, 0.96)',\n` +
  `        };\n` +
  `      case 7:\n` +
  `        return {\n` +
  `          ...base,\n` +
  `          bottom: '-10px',\n` +
  `          left: '40px',\n` +
  `          borderWidth: '10px 10px 0 10px',\n` +
  `          borderColor: 'rgba(15, 23, 42, 0.96) transparent transparent transparent',\n` +
  `        };`
);

tm = tm.replace(
  `    if (step === 9) {\n` +
  `      setIsTimelineOpen(true);\n` +
  `    } else {\n` +
  `      setIsTimelineOpen(false);\n` +
  `    }`,
  `    if (step === 8) {\n` +
  `      setIsTimelineOpen(true);\n` +
  `    } else {\n` +
  `      setIsTimelineOpen(false);\n` +
  `    }`
);

fs.writeFileSync('src/components/TutorialModal.tsx', tm);

let app = fs.readFileSync('src/App.tsx', 'utf8');

app = app.replace(
  `    if (tutorialStep === 5) {\n` +
  `      setIsFiltersExpanded(true);\n` +
  `    } else {\n` +
  `      setIsFiltersExpanded(false);\n` +
  `    }`,
  `    // Filters no longer forced open by a step\n` +
  `    if (false) {\n` +
  `      setIsFiltersExpanded(true);\n` +
  `    } else {\n` +
  `      setIsFiltersExpanded(false);\n` +
  `    }`
);

app = app.replace(
  `    if (tutorialStep === 7) {\n` +
  `      setIsDirectoryOpen(true);\n` +
  `    } else {\n` +
  `      setIsDirectoryOpen(false);\n` +
  `    }`,
  `    if (tutorialStep === 6) {\n` +
  `      setIsDirectoryOpen(true);\n` +
  `    } else {\n` +
  `      setIsDirectoryOpen(false);\n` +
  `    }`
);

app = app.replace(
  `forceTab={tutorialStep === 5 ? 'status' : undefined}`,
  `forceTab={undefined}`
);

fs.writeFileSync('src/App.tsx', app);
console.log('Successfully updated layout logic!');
