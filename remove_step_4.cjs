const fs = require('fs');
let content = fs.readFileSync('src/components/TutorialModal.tsx', 'utf8');

function removeIndex4(text) {
  return text.replace(/\[([\s\S]*?)\]/g, (match, inner) => {
    const lines = inner.split('\n');
    const itemIndices = [];
    lines.forEach((line, idx) => {
      if (line.trim().startsWith('\"') || line.trim().startsWith('<')) {
        itemIndices.push(idx);
      }
    });
    if (itemIndices.length >= 5) {
      lines.splice(itemIndices[4], 1);
      const newItems = [];
      lines.forEach((line, idx) => {
        if (line.trim().startsWith('\"') || line.trim().startsWith('<')) {
          newItems.push(idx);
        }
      });
      newItems.forEach((idx, i) => {
        lines[idx] = lines[idx].replace(/,$/, '');
        if (i < newItems.length - 1) {
          lines[idx] = lines[idx] + ',';
        }
      });
      return '[' + lines.join('\n') + ']';
    }
    return match;
  });
}

const titlesStart = content.indexOf('const titles: Record<string, string[]> = {');
const titlesEnd = content.indexOf('const descriptions: Record<string, string[]> = {');
let titlesText = content.substring(titlesStart, titlesEnd);
titlesText = removeIndex4(titlesText);

const descStart = titlesEnd;
const descEnd = content.indexOf('const icons = [');
let descText = content.substring(descStart, descEnd);
descText = removeIndex4(descText);

const iconsStart = descEnd;
const iconsEnd = content.indexOf('  return selectedTitles.map');
let iconsText = content.substring(iconsStart, iconsEnd);
iconsText = removeIndex4(iconsText);

content = content.substring(0, titlesStart) + titlesText + descText + iconsText + content.substring(iconsEnd);
fs.writeFileSync('src/components/TutorialModal.tsx', content);
console.log('Successfully removed index 4');
