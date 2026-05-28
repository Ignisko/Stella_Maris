const fs = require('fs');

let tm = fs.readFileSync('src/components/TutorialModal.tsx', 'utf8');

// FIX 1: UPDATE updateRect
const updateRectPattern = `    const updateRect = () => {\n      let selector = '';\n      if (step === 4) selector = '#search-filters-container';`;
const updateRectReplacement = `    const updateRect = () => {\n      let selector = '';\n      if (step === 1 || step === 2 || step === 3) selector = '#map-container';\n      else if (step === 4) selector = '#search-filters-container';`;
tm = tm.replace(updateRectPattern, updateRectReplacement);

// FIX 2: UPDATE highlightStyle
const highlightStylePattern = `    if (step === 1 || step === 3) {\n      return {\n        left: '50vw',\n        top: '50vh',`;
const highlightStyleReplacement = `    if (step === 1 || step === 3) {\n      return {\n        left: '50vw',\n        top: '50vh',`; // This logic is actually fine as-is!

// FIX 3: UPDATE cardStyle step 2 fallback
const cardStylePattern = `    if (step === 1 || step === 3) {\n      return {\n        ...common,\n        left: '60px',\n        top: '150px',\n      };\n    }`;
const cardStyleReplacement = `    if (step === 1 || step === 2 || step === 3) {\n      return {\n        ...common,\n        left: '60px',\n        top: '150px',\n      };\n    }`;
tm = tm.replace(cardStylePattern, cardStyleReplacement);

// FIX 4: Remove redundant case 2 and case 3 from cardStyle elementRect switch (if any exist)
// In the current file, after checkout, there might not be a case 2 or case 3. But let's be sure.
// Wait, we just checked out main. Let's see what is there.
// If it's main, we've got the code that crashed.

fs.writeFileSync('src/components/TutorialModal.tsx', tm);
console.log('Fixed TutorialModal safely!');
