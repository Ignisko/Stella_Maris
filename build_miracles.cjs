const fs = require('fs');

const miracles = [
  { id: 'walldurn_germany', location: 'Walldürn', country: 'Germany', year: 1330, lat: , lng: , approvalStatus: 'Vatican Approved' },
  { id: 'blanot_france', location: 'Blanot', country: 'France', year: 1331, lat: , lng: , approvalStatus: 'Vatican Approved' }
];

const translationsEn = {
  "lanciano_italy": {
    "title": "Eucharistic Miracle of Lanciano",
    "description": "In the 8th century, a Basilian monk who doubted the Real Presence saw the Host turn into real flesh and the wine into real blood during Mass. Extensive scientific testing in the 1970s concluded it is human cardiac tissue (myocardium) and AB blood type, identical to the Shroud of Turin."
  },
  "bolsena_italy": {
    "title": "Eucharistic Miracle of Bolsena",
    "description": "In 1263, a doubting priest named Peter of Prague celebrated Mass. Upon breaking the Host, blood began to seep from it, staining the corporal. This miracle prompted Pope Urban IV to institute the feast of Corpus Christi."
  },
  "buenos_aires_argentina": {
    "title": "Eucharistic Miracle of Buenos Aires",
    "description": "In 1992, 1994, and 1996, discarded Hosts began bleeding. Under the direction of Cardinal Jorge Bergoglio (now Pope Francis), the tissue was scientifically analyzed and found to contain living human white blood cells and heart muscle tissue in severe distress."
  },
  "sokolka_poland": {
    "title": "Eucharistic Miracle of Sokółka",
    "description": "In 2008, a consecrated Host that had fallen was placed in water to dissolve. A week later, a red stain appeared on it. Pathologists concluded the substance is identical to myocardial (heart) tissue of a person nearing death."
  },
  "legnica_poland": {
    "title": "Eucharistic Miracle of Legnica",
    "description": "In 2013, a fallen Host was placed in water. It developed red stains, which scientific analysis confirmed contained fragmented human heart muscle fibers exhibiting signs of extreme stress and agony."
  },
  "tixtla_mexico": {
    "title": "Eucharistic Miracle of Tixtla",
    "description": "During a retreat in 2006, a Host began effusing a reddish substance. Scientific investigations found that the blood came from the interior of the Host outward, possessed AB blood type, and contained intact human DNA and active white blood cells."
  },
  "santarem_portugal": {
    "title": "Eucharistic Miracle of Santarém",
    "description": "In 1247, a woman who had consulted a sorceress stole a consecrated Host. The Host began bleeding profusely in her home. It has remained intact for over 750 years and is venerated in the Church of St. Stephen."
  },
  "cascia_italy": {
    "title": "Eucharistic Miracle of Cascia",
    "description": "In 1330, a priest placed a consecrated Host inside a breviary book instead of a pyx. When he opened the book at the sick person's house, the Host had bled, leaving a stain shaped like a face on the pages, which are still preserved today."
  },
  "siena_italy": {
    "title": "Eucharistic Miracle of Siena",
    "description": "In 1730, thieves stole 351 consecrated Hosts from a basilica in Siena. They were later found discarded in an offering box. Inexplicably, the Hosts have remained perfectly incorrupt and fresh to this day, completely defying organic decay."
  },
  "daroca_spain": {
    "title": "Eucharistic Miracle of Daroca",
    "description": "In 1239, during a battle, six consecrated Hosts were wrapped in a corporal for protection. When unwrapped, the Hosts were found covered in blood. The blood-stained corporals are preserved in the Daroca basilica."
  },
  "chirattakonam_india": {
    "title": "Eucharistic Miracle of Chirattakonam",
    "description": "In 2001, a Host exposed for adoration developed three red stains. Over the following days, the stains formed the clear image of a face resembling Jesus crowned with thorns."
  },
  "tumaco_colombia": {
    "title": "Eucharistic Miracle of Tumaco",
    "description": "In 1906, a massive tsunami threatened the island of Tumaco. Father Gerardo Larrondo carried the Blessed Sacrament to the shore. As the massive wave approached, it instantly receded upon reaching the Eucharist, saving the island."
  },
  "amsterdam_holland": {
    "title": "Eucharistic Miracle of Amsterdam",
    "description": "In 1345, a dying man vomited a Host he had just received. The Host was thrown into a fire but remained untouched by the flames. It hovered above the fire completely intact."
  },
  "avignon_france": {
    "title": "Eucharistic Miracle of Avignon",
    "description": "In 1433, severe flooding submerged the city of Avignon. The waters rose high in the church but miraculously parted, forming a dry path to the altar where the Blessed Sacrament was exposed, leaving the altar completely untouched."
  },
  "krakow_poland": {
    "title": "Eucharistic Miracle of Kraków",
    "description": "In 1345, thieves stole a ciborium with consecrated Hosts and abandoned them in a marsh. A strange light emanated from the marsh, leading to the discovery of the completely preserved Hosts."
  },
  "poznan_poland": {
    "title": "Eucharistic Miracle of Poznań",
    "description": "In 1399, thieves stole three consecrated Hosts and stabbed them. The Hosts bled and miraculously floated in the air before being recovered. A church was built on the site of the miracle."
  },
  "betania_venezuela": {
    "title": "Eucharistic Miracle of Betania",
    "description": "In 1991, during Mass, the priest broke the Host into four pieces. One piece began to bleed. Video recordings show the blood pulsating like a living heart. Tests confirmed it is AB positive human blood."
  },
  "ludbreg_croatia": {
    "title": "Eucharistic Miracle of Ludbreg",
    "description": "In 1411, a doubting priest saw the wine turn into real liquid blood during the consecration. The blood was preserved in a vial, and the miracle was approved by Pope Leo X in 1513."
  },
  "walldurn_germany": {
    "title": "Eucharistic Miracle of Walldürn",
    "description": "In 1330, a priest accidentally knocked over a chalice with consecrated wine. The wine spilled onto the corporal and formed the image of Christ crucified, surrounded by eleven identical images of the Head of Christ crowned with thorns."
  },
  "blanot_france": {
    "title": "Eucharistic Miracle of Blanot",
    "description": "In 1331, a fragment of a consecrated Host fell onto a cloth held by a woman during Communion. The fragment turned into a drop of blood, penetrating the cloth deeply. The blood stain remains to this day."
  }
};

const translationsPl = {
  "lanciano_italy": {
    "title": "Cud Eucharystyczny w Lanciano",
    "description": "W VIII wieku mnich, który wątpił w Prawdziwą Obecność, ujrzał podczas Mszy św., jak Hostia zamienia się w prawdziwe ciało, a wino w prawdziwą krew. Badania naukowe z lat 70. XX wieku potwierdziły, że jest to tkanka mięśnia sercowego i krew grupy AB, identyczna z tą z Całunu Turyńskiego."
  },
  "bolsena_italy": {
    "title": "Cud Eucharystyczny w Bolsenie",
    "description": "W 1263 roku wątpiący ksiądz, Piotr z Pragi, odprawiał Mszę św. Po przełamaniu Hostii zaczęła z niej sączyć się krew, plamiąc korporał. Ten cud skłonił papieża Urbana IV do ustanowienia święta Bożego Ciała."
  },
  "buenos_aires_argentina": {
    "title": "Cud Eucharystyczny w Buenos Aires",
    "description": "W latach 1992, 1994 i 1996 porzucone Hostie zaczęły krwawić. Pod kierownictwem kardynała Jorge Bergoglio (obecnie papieża Franciszka) tkanka została poddana analizie naukowej i okazała się zawierać żywe ludzkie białe krwinki oraz tkankę mięśnia sercowego w stanie skrajnego stresu."
  },
  "sokolka_poland": {
    "title": "Cud Eucharystyczny w Sokółce",
    "description": "W 2008 roku konsekrowana Hostia, która upadła, została umieszczona w wodzie, aby się rozpuściła. Tydzień później pojawiła się na niej czerwona plama. Patolodzy stwierdzili, że substancja ta jest identyczna z tkanką mięśnia sercowego osoby w agonii."
  },
  "legnica_poland": {
    "title": "Cud Eucharystyczny w Legnicy",
    "description": "W 2013 roku upuszczona Hostia została umieszczona w wodzie. Pojawiły się na niej czerwone plamy, które – jak potwierdziła analiza naukowa – zawierały pofragmentowane włókna ludzkiego mięśnia sercowego, wykazujące oznaki skrajnego stresu i agonii."
  },
  "tixtla_mexico": {
    "title": "Cud Eucharystyczny w Tixtla",
    "description": "Podczas rekolekcji w 2006 roku z Hostii zaczęła wydzielać się czerwonawa substancja. Badania naukowe wykazały, że krew pochodzi z wnętrza Hostii na zewnątrz, ma grupę krwi AB oraz zawiera nienaruszone ludzkie DNA i aktywne białe krwinki."
  },
  "santarem_portugal": {
    "title": "Cud Eucharystyczny w Santarém",
    "description": "W 1247 roku kobieta, która skonsultowała się z czarownicą, ukradła konsekrowaną Hostię. Hostia zaczęła obficie krwawić w jej domu. Pozostaje ona nienaruszona od ponad 750 lat i jest czczona w kościele św. Szczepana."
  },
  "cascia_italy": {
    "title": "Cud Eucharystyczny w Cascii",
    "description": "W 1330 roku ksiądz umieścił konsekrowaną Hostię w brewiarzu zamiast w bursie. Kiedy otworzył księgę w domu chorego, Hostia krwawiła, pozostawiając na stronach plamę w kształcie twarzy, co zachowało się do dziś."
  },
  "siena_italy": {
    "title": "Cud Eucharystyczny w Sienie",
    "description": "W 1730 roku złodzieje ukradli 351 konsekrowanych Hostii z bazyliki w Sienie. Później znaleziono je porzucone w skrzynce na ofiary. W niewytłumaczalny sposób Hostie te do dziś pozostały całkowicie nienaruszone i świeże, całkowicie opierając się naturalnemu rozkładowi."
  },
  "daroca_spain": {
    "title": "Cud Eucharystyczny w Daroca",
    "description": "W 1239 roku podczas bitwy sześć konsekrowanych Hostii zawinięto w korporał dla ochrony. Po rozwinięciu Hostie były pokryte krwią. Zakrwawione korporały są przechowywane w bazylice w Daroca."
  },
  "chirattakonam_india": {
    "title": "Cud Eucharystyczny w Chirattakonam",
    "description": "W 2001 roku na wystawionej do adoracji Hostii pojawiły się trzy czerwone plamy. W ciągu kolejnych dni plamy utworzyły wyraźny obraz twarzy przypominającej Jezusa w koronie cierniowej."
  },
  "tumaco_colombia": {
    "title": "Cud Eucharystyczny w Tumaco",
    "description": "W 1906 roku ogromne tsunami zagroziło wyspie Tumaco. Ojciec Gerardo Larrondo zaniósł Najświętszy Sakrament na brzeg. Gdy potężna fala zbliżała się, natychmiast cofnęła się po dotarciu do Eucharystii, ratując wyspę."
  },
  "amsterdam_holland": {
    "title": "Cud Eucharystyczny w Amsterdamie",
    "description": "W 1345 roku umierający człowiek zwymiotował Hostię, którą właśnie przyjął. Hostię wrzucono do ognia, ale pozostała nietknięta przez płomienie. Unosiła się nad ogniem całkowicie nienaruszona."
  },
  "avignon_france": {
    "title": "Cud Eucharystyczny w Awinionie",
    "description": "W 1433 roku miasto Awinion nawiedziła wielka powódź. Wody podniosły się wysoko w kościele, ale cudownie się rozstąpiły, tworząc suchą ścieżkę do ołtarza, gdzie wystawiony był Najświętszy Sakrament, pozostawiając ołtarz całkowicie suchym."
  },
  "krakow_poland": {
    "title": "Cud Eucharystyczny w Krakowie",
    "description": "W 1345 roku złodzieje ukradli cyborium z konsekrowanymi Hostiami i porzucili je na bagnach. Z bagien emanowało niezwykłe światło, co doprowadziło do odnalezienia całkowicie zachowanych Hostii."
  },
  "poznan_poland": {
    "title": "Cud Eucharystyczny w Poznaniu",
    "description": "W 1399 roku złodzieje ukradli trzy konsekrowane Hostie i przebili je nożem. Hostie krwawiły i cudownie unosiły się w powietrzu przed ich odzyskaniem. Na miejscu cudu zbudowano kościół."
  },
  "betania_venezuela": {
    "title": "Cud Eucharystyczny w Betanii",
    "description": "W 1991 roku podczas Mszy św. ksiądz przełamał Hostię na cztery części. Jedna z nich zaczęła krwawić. Nagrania wideo pokazują, że krew pulsuje jak żywe serce. Testy potwierdziły, że to ludzka krew grupy AB dodatniej."
  },
  "ludbreg_croatia": {
    "title": "Cud Eucharystyczny w Ludbregu",
    "description": "W 1411 roku wątpiący ksiądz ujrzał, jak wino zamienia się w prawdziwą, płynną krew podczas konsekracji. Krew została zachowana w fiolce, a cud został zatwierdzony przez papieża Leona X w 1513 roku."
  },
  "walldurn_germany": {
    "title": "Cud Eucharystyczny w Walldürn",
    "description": "W 1330 roku ksiądz przypadkowo przewrócił kielich z konsekrowanym winem. Wino wylało się na korporał i utworzyło wizerunek ukrzyżowanego Chrystusa, otoczony jedenastoma identycznymi wizerunkami Głowy Chrystusa w koronie cierniowej."
  },
  "blanot_france": {
    "title": "Cud Eucharystyczny w Blanot",
    "description": "W 1331 roku fragment konsekrowanej Hostii upadł na płótno trzymane przez kobietę podczas Komunii. Fragment zamienił się w kroplę krwi, która głęboko wniknęła w płótno. Plama krwi pozostała do dziś."
  }
};

// 1. Write the TS file
let tsContent = "import type { Apparition } from './apparitions';\n\nexport const eucharisticMiraclesData: Apparition[] = [\n";
miracles.forEach((m, idx) => {
  const enData = translationsEn[m.id] || { title: m.id, description: '' };
  tsContent += `  {
    id: '${m.id}',
    location: '${m.location}',
    country: '${m.country}',
    year: ${m.year},
    coordinates: [${m.coordinates[0]}, ${m.coordinates[1]}],
    title: ${JSON.stringify(enData.title)},
    description: ${JSON.stringify(enData.description)},
    approvalStatus: '${m.approvalStatus}'
  }`;
  if (idx < miracles.length - 1) tsContent += ",\n";
  else tsContent += "\n";
});
tsContent += "];\n";
fs.writeFileSync('src/data/eucharistic-miracles.ts', tsContent);

// 2. Update Polish JSON
const plPath = 'src/data/translations/pl.json';
const plData = JSON.parse(fs.readFileSync(plPath, 'utf8'));
for (const [key, val] of Object.entries(translationsPl)) {
  plData[key] = val;
}
fs.writeFileSync(plPath, JSON.stringify(plData, null, 2));

console.log('Successfully injected 20 miracles into eucharistic-miracles.ts and pl.json!');
