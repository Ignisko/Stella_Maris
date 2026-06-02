const fs = require('fs');

const file = 'src/data/eucharistic-miracles.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/coordinates:\s*\[\s*([\-\d\.]+)\s*,\s*([\-\d\.]+)\s*\]/g, "lat: $1, lng: $2");

fs.writeFileSync(file, content);
console.log("Fixed coordinates in " + file);
