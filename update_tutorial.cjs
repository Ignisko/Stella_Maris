const fs = require('fs');
const file = 'c:/Users/ignac/Documents/github projects/stellamaris.help/src/components/TutorialModal.tsx';
let content = fs.readFileSync(file, 'utf8');

const newEn = `    en: [
      {
        title: "Stella Maris Onboarding",
        description: "Choose your language to begin.",
        icon: <HelpCircle size={40} color="var(--gold-accent)" />
      },
      {
        title: "Explore the 3D Globe",
        description: "Left-click and drag the Earth to rotate it. Scroll your mouse wheel to zoom in and out. Click on any colored marker to view the details.",
        icon: <Globe size={40} color="var(--accent-color)" />
      },
      {
        title: "Apparition Information",
        description: "Selecting a marker opens the Information Panel on the right. Here you can read a description, view the approval status, and visit documented sources.",
        icon: <SidebarIcon size={40} color="var(--accent-color)" />
      },
      {
        title: "Search & Filters",
        description: "Use the left panel to search for specific shrines, filter by approval status, or filter by historical century.",
        icon: <Sliders size={40} color="var(--accent-color)" />
      },
      {
        title: "Browse Directory",
        description: "Click 'Browse directory' to open a complete list of all apparitions and explore them in detail.",
        icon: <Sliders size={40} color="var(--accent-color)" />
      },
      {
        title: "Timeline & Presentation",
        description: "Open the timeline at the bottom to see how events unfolded chronologically. Click 'Play Presentation' to start a cinematic tour!",
        icon: <Calendar size={40} color="var(--accent-color)" />
      },
      {
        title: "Auto-Rotate Earth",
        description: "Toggle the auto-rotation of the Earth using this button in the bottom left corner.",
        icon: <Globe size={40} color="var(--accent-color)" />
      },
      {
        title: "Glory to Jesus!",
        description: "You are ready to begin. Enjoy your journey through the history of Stella Maris! Mary Mother of God, glory through Her to Jesus.",
        icon: <Sparkles size={40} color="var(--gold-accent)" />
      }
    ],`;

const getStepsStart = content.indexOf('const getStepsContent = (lang: Language): StepContent[] => {');
const getStepsEnd = content.indexOf('const getHighlightStyle = (step: number): React.CSSProperties => {');

const newGetStepsContent = `const getStepsContent = (lang: Language): StepContent[] => {
  const steps: Partial<Record<Language, StepContent[]>> & { en: StepContent[] } = {
` + newEn + `
    pl: ` + newEn.replace('en: [', '[') + `
    es: ` + newEn.replace('en: [', '[') + `
    pt: ` + newEn.replace('en: [', '[') + `
    fr: ` + newEn.replace('en: [', '[') + `
    it: ` + newEn.replace('en: [', '[') + `
    ar: ` + newEn.replace('en: [', '[') + `
    tl: ` + newEn.replace('en: [', '[') + `
    vi: ` + newEn.replace('en: [', '[') + `
    tr: ` + newEn.replace('en: [', '[') + `
  };
  return steps[lang] || steps['en'];
};

`;

content = content.substring(0, getStepsStart) + newGetStepsContent + content.substring(getStepsEnd);

// Fix highlight styles
content = content.replace(
  "width: '450px',\n        height: '450px',",
  "width: '650px',\n        height: '650px',"
);

content = content.replace(
  /case 2:[\s\S]*?background: 'transparent',\n      };/,
  `case 2:
      // Highlight Sidebar
      return {
        right: '18px',
        top: '18px',
        width: '384px',
        height: '500px', // approximate info panel height
        borderRadius: '16px',
        left: 'auto',
        background: 'transparent',
      };`
);

content = content.replace(
  /case 3:[\s\S]*?background: 'transparent',\n      };/,
  `case 3:
      // Highlight Search and Filters
      return {
        left: '18px',
        top: '125px',
        width: '324px',
        height: '92px',
        borderRadius: '12px',
        background: 'transparent',
      };
    case 4:
      // Highlight Browse Directory
      return {
        left: '170px',
        top: '180px',
        width: '172px',
        height: '46px',
        borderRadius: '12px',
        background: 'transparent',
      };`
);

content = content.replace(
  /case 4:[\s\S]*?background: 'transparent',\n      };/,
  `case 5:
      // Highlight Timeline Overlay at the bottom
      return {
        left: '18px',
        right: '18px',
        bottom: '18px',
        height: '215px',
        top: 'auto',
        width: 'auto',
        borderRadius: '16px',
        background: 'transparent',
      };
    case 6:
      // Highlight Auto-Rotate Button
      return {
        left: '18px',
        bottom: '18px',
        width: '180px',
        height: '48px',
        top: 'auto',
        borderRadius: '24px',
        background: 'transparent',
      };`
);

content = content.replace(
  /case 5:[\s\S]*?background: 'transparent',\n      };/,
  `case 7:
      // Dim the entire screen
      return {
        left: '-100px',
        top: '-100px',
        width: '0px',
        height: '0px',
        border: 'none',
        boxShadow: '0 0 0 9999px rgba(5, 8, 22, 0.75)',
        background: 'transparent',
      };`
);

// Fix card styles
content = content.replace(
  /case 4:[\s\S]*?width: '420px',\n      };/,
  `case 4:
      return {
        ...common,
        left: '370px',
        top: '160px',
      };
    case 5:
      return {
        ...common,
        left: '50px',
        bottom: '250px',
        width: '420px',
      };
    case 6:
      return {
        ...common,
        left: '220px',
        bottom: '30px',
      };`
);

content = content.replace(
  /case 5:\n      return \{\n        \.\.\.common,\n        left: '50vw',\n        top: '50vh',\n        transform: 'translate\(-50%, -50%\)',\n        width: '450px',\n        maxWidth: '90vw'\n      \};/,
  `case 7:
      return {
        ...common,
        left: '50vw',
        top: '50vh',
        transform: 'translate(-50%, -50%)',
        width: '450px',
        maxWidth: '90vw'
      };`
);

// Fix arrow styles
content = content.replace(
  /case 4:[\s\S]*?transparent',\n      };/,
  `case 4:
      // Pointing left
      return {
        ...base,
        top: '20px',
        left: '-10px',
        borderWidth: '10px 10px 10px 0',
        borderColor: 'transparent rgba(15, 23, 42, 0.96) transparent transparent',
      };
    case 5:
      // Pointing down
      return {
        ...base,
        bottom: '-10px',
        left: '40px',
        borderWidth: '10px 10px 0 10px',
        borderColor: 'rgba(15, 23, 42, 0.96) transparent transparent transparent',
      };
    case 6:
      // Pointing left
      return {
        ...base,
        top: '20px',
        left: '-10px',
        borderWidth: '10px 10px 10px 0',
        borderColor: 'transparent rgba(15, 23, 42, 0.96) transparent transparent',
      };`
);

fs.writeFileSync(file, content, 'utf8');
console.log('Updated TutorialModal.tsx');
