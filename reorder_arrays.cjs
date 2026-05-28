const fs = require('fs');
let content = fs.readFileSync('src/components/TutorialModal.tsx', 'utf8');

function reorderArray(text) {
  return text.replace(/\[([\s\S]*?)\]/g, (match, inner) => {
    const lines = inner.split('\n');
    const items = [];
    lines.forEach((line, idx) => {
      if (line.trim().startsWith('\"')) {
        items.push({ idx, text: line.trim() });
      }
    });

    if (items.length >= 12) {
      const newOrder = [0, 1, 10, 2, 4, 5, 6, 7, 8, 9, 11];
      const newLines = [];
      newOrder.forEach((oldIdx, i) => {
        let line = lines[items[oldIdx].idx];
        line = line.replace(/,\s*$/, '');
        line = line.trim();
        if (i < newOrder.length - 1) {
          line += ',';
        }
        newLines.push('      ' + line);
      });
      return '[\n' + newLines.join('\n') + '\n    ]';
    }
    return match;
  });
}

const titlesStart = content.indexOf('const titles: Record<string, string[]> = {');
const titlesEnd = content.indexOf('const descriptions: Record<string, string[]> = {');
let titlesText = content.substring(titlesStart, titlesEnd);
titlesText = reorderArray(titlesText);

const descStart = titlesEnd;
const descEnd = content.indexOf('const icons = [');
let descText = content.substring(descStart, descEnd);
descText = reorderArray(descText);

content = content.substring(0, titlesStart) + titlesText + descText + content.substring(descEnd);

const newIcons = `const icons = [
    <HelpCircle size={40} color="var(--gold-accent)" />,
    <Globe size={40} color="var(--accent-color)" />,
    <Globe size={40} color="var(--accent-color)" />,
    <Globe size={40} color="var(--accent-color)" />,
    <Sliders size={40} color="var(--accent-color)" />,
    <Sliders size={40} color="var(--accent-color)" />,
    <Sliders size={40} color="var(--accent-color)" />,
    <Calendar size={40} color="var(--accent-color)" />,
    <Calendar size={40} color="var(--accent-color)" />,
    <Globe size={40} color="var(--accent-color)" />,
    <Sparkles size={40} color="var(--gold-accent)" />
  ];`;
  
const iconStart = content.indexOf('const icons = [');
const iconEnd = content.indexOf('  ];', iconStart) + 4;
content = content.substring(0, iconStart) + newIcons + content.substring(iconEnd);

fs.writeFileSync('src/components/TutorialModal.tsx', content);
console.log('Successfully reordered arrays without double commas.');
