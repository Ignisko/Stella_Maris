const fs = require('fs');
const path = require('path');

const tmPath = path.join(__dirname, 'src/components/TutorialModal.tsx');
let tm = fs.readFileSync(tmPath, 'utf8');
tm = tm.replace(/\r\n/g, '\n');

// Fix cardStyle case 5: card was at "elementRect.right + 20" which is off the right edge of the screen.
// When sidebar is open, the left panel slides away → left side is empty.
// Position the tutorial card on the LEFT side of the screen, pointing RIGHT at the sidebar.
tm = tm.replace(
  `        case 5:   // apparition-sidebar → card to right of sidebar
        case 6:   // search-filters-container → card to right of search panel
        case 7:   // browse-directory-button → card to right of button
          return {
            ...common,
            left: \`\${elementRect.right + 20}px\`,
            top: \`\${elementRect.top}px\`,
          };`,
  `        case 5:   // apparition-sidebar → left side is empty (left panel slid away), card goes left
          return {
            ...common,
            left: '20px',
            top: '80px',
          };
        case 6:   // search-filters-container → card to right of search panel
        case 7:   // browse-directory-button → card to right of button
          return {
            ...common,
            left: \`\${elementRect.right + 20}px\`,
            top: \`\${elementRect.top}px\`,
          };`
);

const check1 = tm.includes("case 5:   // apparition-sidebar → left side");
console.log(check1 ? '✓ cardStyle case 5 fixed (left:20px, top:80px)' : '✗ cardStyle case 5 FAILED');

// Fix arrowStyle case 5: was pointing LEFT (card was to the right of sidebar).
// Now card is on the LEFT, sidebar on the RIGHT → arrow points RIGHT.
tm = tm.replace(
  `      case 5:   // card is to right of sidebar → arrow points LEFT
      case 6:   // card is to right of search container → arrow points LEFT
      case 7:   // card is to right of browse button → arrow points LEFT
        return {
          ...base,
          top: '30px',
          left: '-10px',
          borderWidth: '10px 10px 10px 0',
          borderColor: 'transparent rgba(15, 23, 42, 0.96) transparent transparent',
        };`,
  `      case 5:   // card is on the LEFT, sidebar on the RIGHT → arrow points RIGHT
        return {
          ...base,
          top: '30px',
          right: '-10px',
          borderWidth: '10px 0 10px 10px',
          borderColor: 'transparent transparent transparent rgba(15, 23, 42, 0.96)',
        };
      case 6:   // card is to right of search container → arrow points LEFT
      case 7:   // card is to right of browse button → arrow points LEFT
        return {
          ...base,
          top: '30px',
          left: '-10px',
          borderWidth: '10px 10px 10px 0',
          borderColor: 'transparent rgba(15, 23, 42, 0.96) transparent transparent',
        };`
);

const check2 = tm.includes("case 5:   // card is on the LEFT, sidebar on the RIGHT");
console.log(check2 ? '✓ arrowStyle case 5 fixed (right-pointing arrow)' : '✗ arrowStyle case 5 FAILED');

// Also: the tutorial card for step 5 should NOT use the spotlight/highlight around the sidebar
// (the sidebar is already highlighted by its own border). Let's make the highlightStyle for step 5
// show the sidebar rect with a gentle highlight instead.
// Currently step 5 falls through to elementRect-based highlight — that's actually fine.
// The sidebar will be highlighted with a bright border. Keep that.

tm = tm.replace(/\n/g, '\r\n');
fs.writeFileSync(tmPath, tm);
console.log('✓ TutorialModal.tsx written');
