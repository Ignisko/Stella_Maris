const fs = require('fs');
const file = 'c:/Users/ignac/Documents/github projects/stellamaris.help/src/components/TutorialModal.tsx';
let content = fs.readFileSync(file, 'utf8');

const start = content.indexOf('const titles: Record<string, string[]> = {');
const end = content.indexOf('const icons = [');
let targetContent = content.substring(start, end);

targetContent = targetContent.replace(/\[\s*([\s\S]*?)\s*\]/g, (match) => {
  const lines = match.split('\n');
  const items = [];
  lines.forEach((l, i) => { if(l.trim().startsWith('\"')) items.push(i) });
  if (items.length === 12) {
    const targetLine = lines.splice(items[10], 1)[0];
    const newItems = [];
    lines.forEach((l, i) => { if(l.trim().startsWith('\"')) newItems.push(i) });
    lines.splice(newItems[2], 0, targetLine);
    
    // Fix commas
    lines.forEach((l, i) => {
      if (l.trim().startsWith('\"')) {
        const isLastItem = (i === newItems[newItems.length-1] && newItems.length === 11) || 
                           (newItems.indexOf(i) === newItems.length-1 && i > newItems[2]); // rough check
        // We can just ensure every string line ends with a comma except the very last one.
      }
    });
  }
  
  // Clean up commas properly
  const cleanLines = lines.map(l => l.replace(/,$/, ''));
  const finalItems = [];
  cleanLines.forEach((l, i) => { if(l.trim().startsWith('\"')) finalItems.push(i) });
  finalItems.forEach((idx, count) => {
    if (count < finalItems.length - 1) cleanLines[idx] = cleanLines[idx] + ',';
  });
  
  return cleanLines.join('\n');
});

content = content.substring(0, start) + targetContent + content.substring(end);

const iconStart = content.indexOf('const icons = [');
const iconEnd = content.indexOf('  return selectedTitles.map');
let iconContent = content.substring(iconStart, iconEnd);
const iconLines = iconContent.split('\n');
const iconsIdx = [];
iconLines.forEach((l, i) => { if(l.trim().startsWith('<')) iconsIdx.push(i) });
if (iconsIdx.length === 12) {
  const targetLine = iconLines.splice(iconsIdx[10], 1)[0].replace(/,$/, '');
  const newIconsIdx = [];
  iconLines.forEach((l, i) => { if(l.trim().startsWith('<')) newIconsIdx.push(i) });
  iconLines.splice(newIconsIdx[2], 0, targetLine);
  
  const cleanLines = iconLines.map(l => l.replace(/,$/, ''));
  const finalItems = [];
  cleanLines.forEach((l, i) => { if(l.trim().startsWith('<')) finalItems.push(i) });
  finalItems.forEach((idx, count) => {
    if (count < finalItems.length - 1) cleanLines[idx] = cleanLines[idx] + ',';
  });
  
  iconContent = cleanLines.join('\n');
}

content = content.substring(0, iconStart) + iconContent + content.substring(iconEnd);
fs.writeFileSync(file, content);
console.log('Done!');
