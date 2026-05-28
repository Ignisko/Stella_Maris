const fs = require('fs');
let content = fs.readFileSync('src/components/TutorialModal.tsx', 'utf8');

function removeIndex5(text) {
  return text.replace(/\[([\s\S]*?)\]/g, (match, inner) => {
    const lines = inner.split('\n');
    const items = [];
    lines.forEach((line, idx) => {
      if (line.trim().startsWith('\"') || line.trim().startsWith('<')) {
        items.push({ idx, text: line.trim() });
      }
    });

    if (items.length >= 10) {
      const newLines = [];
      let mappedIndex = 0;
      items.forEach((item, i) => {
        if (i !== 5) {
          let line = lines[item.idx];
          line = line.replace(/,\s*$/, '').trim();
          if (mappedIndex < items.length - 2) {
            line += ',';
          }
          newLines.push('      ' + line);
          mappedIndex++;
        }
      });
      return '[\n' + newLines.join('\n') + '\n    ]';
    }
    return match;
  });
}

const titlesStart = content.indexOf('const titles: Record<string, string[]> = {');
const titlesEnd = content.indexOf('const descriptions: Record<string, string[]> = {');
let titlesText = content.substring(titlesStart, titlesEnd);
titlesText = removeIndex5(titlesText);

const descStart = titlesEnd;
const descEnd = content.indexOf('const icons = [');
let descText = content.substring(descStart, descEnd);
descText = removeIndex5(descText);

const iconsStart = descEnd;
const iconsEnd = content.indexOf('  return selectedTitles.map');
let iconsText = content.substring(iconsStart, iconsEnd);
iconsText = removeIndex5(iconsText);

content = content.substring(0, titlesStart) + titlesText + descText + iconsText + content.substring(iconsEnd);

fs.writeFileSync('src/components/TutorialModal.tsx', content);
console.log('Removed index 5!');
