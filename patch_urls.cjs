const fs = require('fs');
let data = fs.readFileSync('src/data/eucharistic-miracles.ts', 'utf8');
const updates = {
  'krakow_poland': 'https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=polonia&wh=cracovia&ct=Krakow,%201345',
  'poznan_poland': 'https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=polonia&wh=poznan&ct=Poznan,%201399',
  'middleburg_lovanio_belgium': 'https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=belgio&wh=middleburg&ct=Middleburg-Lovanio,%201374',
  'cava_de_tirreni_italy': 'https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=italia&wh=cavadeitirreni&ct=Cava%20dei%20Tirreni,%201656',
  'st_peter_damian_italy': 'https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=italia&wh=sanpierdamiani&ct=S.%20Peter%20Damian%2C%20XI%20cent.',
  'alboraya_almacera_spain': 'https://www.miracolieucaristici.org/en/Liste/scheda_b.html?nat=spagna&wh=alboraya-almacera&ct=Alboraya-Almac%C3%A9ra%2C%201348',
  'alcala_spain': 'https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=spagna&wh=alcala&ct=Alcal%C3%A0%2C%201597',
  'o_cebreiro_spain': "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=spagna&wh=ocebreiro&ct=O'Cebreiro%2C%201300",
  'sant_joan_de_les_abadesses_spain': 'https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=spagna&wh=s_j_de_las_abadeses&ct=S.%20John%20of%20the%20Abbesses%2C%201251'
};

Object.keys(updates).forEach(id => {
  // We look for the closing } for this specific id.
  // Wait, some might not have approvalStatus, let's just find the exact object.
  const regex = new RegExp(`({\\s*id:\\s*'${id}'[^}]+)\\s*}`);
  data = data.replace(regex, (match, p1) => {
    return p1 + `, sourceUrl: '${updates[id]}' }`;
  });
});

fs.writeFileSync('src/data/eucharistic-miracles.ts', data);
console.log('Successfully patched the 9 missing URLs!');
