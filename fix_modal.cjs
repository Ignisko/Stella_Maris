const fs = require('fs');
const path = require('path');

const tmPath = path.join(__dirname, 'src/components/TutorialModal.tsx');
let tm = fs.readFileSync(tmPath, 'utf8');

// Normalize to LF for reliable string matching, then restore CRLF at end
const hasCRLF = tm.includes('\r\n');
if (hasCRLF) tm = tm.replace(/\r\n/g, '\n');

// Count occurrences before
const before4 = (tm.match(/step === 1 \|\| step === 2 \|\| step === 3 \|\| step === 6/g) || []).length;
console.log(`Found ${before4} occurrences of the pattern to fix`);

// Fix BOTH occurrences: highlightStyle group and cardStyle group
// Both currently say: step === 1 || step === 2 || step === 3 || step === 6
// Change to:          step === 1 || step === 2 || step === 3 || step === 4 || step === 6
tm = tm.replace(
  /step === 1 \|\| step === 2 \|\| step === 3 \|\| step === 6/g,
  'step === 1 || step === 2 || step === 3 || step === 4 || step === 6'
);

const after4 = (tm.match(/step === 1 \|\| step === 2 \|\| step === 3 \|\| step === 4 \|\| step === 6/g) || []).length;
console.log(`Applied fix to ${after4} occurrences`);

// Restore CRLF if file originally had it
if (hasCRLF) tm = tm.replace(/\n/g, '\r\n');

fs.writeFileSync(tmPath, tm);
console.log('Done writing TutorialModal.tsx');
