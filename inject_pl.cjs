const fs = require('fs');
const script = fs.readFileSync('build_miracles.cjs', 'utf8');

// Extract translationsPl
const plMatch = script.match(/const translationsPl = (\{[\s\S]*?\});\s*\/\//);
if (plMatch) {
  const plDataObj = eval('(' + plMatch[1] + ')');
  const plPath = 'src/data/translations/pl.json';
  const plData = JSON.parse(fs.readFileSync(plPath, 'utf8'));
  for (const [key, val] of Object.entries(plDataObj)) {
    plData[key] = val;
  }
  fs.writeFileSync(plPath, JSON.stringify(plData, null, 2));
  console.log('Injected Polish translations.');
} else {
  console.log('Could not find translationsPl in build_miracles.cjs');
}
