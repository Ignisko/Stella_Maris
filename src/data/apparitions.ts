export interface Apparition {
  id: string;
  title: string;
  location: string;
  country: string;
  lat: number;
  lng: number;
  year: number;
  description: string;
  approvalStatus: string;
}

export const apparitionsData: Apparition[] = [
  {
    id: "guadalupe",
    title: "Our Lady of Guadalupe",
    location: "Mexico City",
    country: "Mexico",
    lat: 19.4848,
    lng: -99.1179,
    year: 1531,
    description: "Mary appeared to Juan Diego, an indigenous Mexican, asking for a church to be built. She left her image miraculously imprinted on his tilma (cloak), which is still preserved today.",
    approvalStatus: "Approved by the Holy See"
  },
  {
    id: "miraculous-medal",
    title: "Our Lady of the Miraculous Medal",
    location: "Paris",
    country: "France",
    lat: 48.8506,
    lng: 2.3233,
    year: 1830,
    description: "Mary appeared to St. Catherine Labouré, a novice in the Daughters of Charity, instructing her to have a medal struck with her image. It became known as the Miraculous Medal.",
    approvalStatus: "Approved by the Holy See"
  },
  {
    id: "lourdes",
    title: "Our Lady of Lourdes",
    location: "Lourdes",
    country: "France",
    lat: 43.0975,
    lng: -0.0461,
    year: 1858,
    description: "Mary appeared 18 times to a young girl named Bernadette Soubirous in a grotto. She revealed herself as 'The Immaculate Conception' and uncovered a spring of water known for miraculous healings.",
    approvalStatus: "Approved by the Holy See"
  },
  {
    id: "fatima",
    title: "Our Lady of the Rosary",
    location: "Fátima",
    country: "Portugal",
    lat: 39.6315,
    lng: -8.6730,
    year: 1917,
    description: "Mary appeared to three shepherd children, Lúcia, Francisco, and Jacinta, asking for prayer, especially the Rosary, and penance for the conversion of sinners. The final apparition included the 'Miracle of the Sun'.",
    approvalStatus: "Approved by the Holy See"
  },
  {
    id: "zaytun",
    title: "Our Lady of Zaytun",
    location: "Cairo",
    country: "Egypt",
    lat: 30.1068,
    lng: 31.3115,
    year: 1968,
    description: "A mass Marian apparition that occurred over a period of 2-3 years, witnessed by millions of people, both Christians and Muslims, over the Coptic Orthodox Church of Saint Mary in Zeitoun.",
    approvalStatus: "Approved by the Coptic Orthodox Church"
  },
  {
    id: "kibeho",
    title: "Mother of the Word",
    location: "Kibeho",
    country: "Rwanda",
    lat: -2.6454,
    lng: 29.5539,
    year: 1981,
    description: "Mary appeared to several teenagers, identifying herself as 'Nyina wa Jambo' (Mother of the Word). The visions included warnings of a coming apocalypse, which many interpret as a foreshadowing of the 1994 Rwandan genocide.",
    approvalStatus: "Approved by the Holy See"
  },
  {
    id: "knock",
    title: "Our Lady of Knock",
    location: "Knock",
    country: "Ireland",
    lat: 53.7919,
    lng: -8.9167,
    year: 1879,
    description: "Mary, along with St. Joseph and St. John the Evangelist, appeared at the south gable of the Knock Parish Church. Uniquely, she did not speak during this apparition.",
    approvalStatus: "Approved by the Holy See"
  },
  {
    id: "champion",
    title: "Our Lady of Good Help",
    location: "Champion, Wisconsin",
    country: "USA",
    lat: 44.5911,
    lng: -87.8016,
    year: 1859,
    description: "Mary appeared to Adele Brise, a Belgian immigrant, instructing her to 'gather the children in this wild country and teach them what they should know for salvation.' It is the first and only Vatican-approved Marian apparition in the United States.",
    approvalStatus: "Approved by the Holy See"
  },
  {
    id: "lasalette",
    title: "Our Lady of La Salette",
    location: "La Salette",
    country: "France",
    lat: 44.8661,
    lng: 5.9786,
    year: 1846,
    description: "Mary appeared to two shepherd children, weeping over the sins of humanity, particularly the breaking of the Sabbath and taking the Lord's name in vain.",
    approvalStatus: "Approved by the Holy See"
  },
  {
    id: "pillar",
    title: "Our Lady of the Pillar",
    location: "Zaragoza",
    country: "Spain",
    lat: 41.6488,
    lng: -0.8891,
    year: 40,
    description: "According to legend, the Apostle James the Greater was proclaiming the Gospel when he saw Mary miraculously appearing in the flesh on a pillar calling him to return to Jerusalem. This is considered the first Marian apparition.",
    approvalStatus: "Traditionally Approved"
  },
  {
    id: "lepuy",
    title: "Our Lady of the Le Puy",
    location: "Le Puy en Velay",
    country: "France",
    lat: 45.0428,
    lng: 3.8829,
    year: 250,
    description: "Our Lady appeared to a recent convert named Vila, who had been plagued by a serious illness. She was completely cured and built a small chapel on the site.",
    approvalStatus: "Traditionally Approved"
  },
  {
    id: "snows",
    title: "Our Lady of the Snows",
    location: "Rome",
    country: "Italy",
    lat: 41.9028,
    lng: 12.4964,
    year: 352,
    description: "The Virgin Mary miraculously left snow in the middle of the hot month of August on Esquiline Hill, indicating the exact area where she wanted the St. Mary Major Basilica built.",
    approvalStatus: "Traditionally Approved"
  },
  {
    id: "covadonga",
    title: "Our Lady of Covadonga",
    location: "Covadonga",
    country: "Spain",
    lat: 43.3105,
    lng: -5.0560,
    year: 722,
    description: "Our Lady appeared to Dom Pelayo, first King of the Asturias, leaving behind a statue. The Christians subsequently defeated the Moors against incredible odds.",
    approvalStatus: "Traditionally Approved"
  },
  {
    id: "walsingham",
    title: "Our Lady of Walsingham",
    location: "Walsingham",
    country: "England",
    lat: 52.8941,
    lng: 0.8741,
    year: 1061,
    description: "Our Lady appeared to Richeldis de Faverches, presenting her with the plans of the Holy House of the Holy Family in Nazareth and asking her to build a replica as a shrine.",
    approvalStatus: "Traditionally Approved"
  },
  {
    id: "ransom",
    title: "Our Lady of Ransom / Mercy",
    location: "Barcelona",
    country: "Spain",
    lat: 41.3851,
    lng: 2.1734,
    year: 1218,
    description: "The Blessed Virgin appeared to three men who established the Mercedarian religious order to redeem Christian captives from Moorish imprisonment.",
    approvalStatus: "Traditionally Approved"
  },
  {
    id: "carmel",
    title: "Our Lady of Mt. Carmel",
    location: "Aylesford",
    country: "England",
    lat: 51.3005,
    lng: 0.4789,
    year: 1251,
    description: "In answer to St. Simon Stock's appeal for help, the Virgin Mary appeared to him with a scapular in her hand and the promise of safety from Hell.",
    approvalStatus: "Traditionally Approved"
  },
  {
    id: "guadalupe_spain",
    title: "Our Lady of Guadalupe (Spain)",
    location: "Caceres",
    country: "Spain",
    lat: 39.4520,
    lng: -5.3283,
    year: 1326,
    description: "Cowherd Gil Cordero experienced an apparition of the Virgin Mary who directed him to a miraculous buried statue given to Spain from Pope Gregory the Great 600 years prior.",
    approvalStatus: "Traditionally Approved"
  },
  {
    id: "guard",
    title: "Our Lady of the Guard",
    location: "Liguria",
    country: "Italy",
    lat: 44.4984,
    lng: 8.8778,
    year: 1490,
    description: "The Virgin Mary appeared to a peasant called Benedetto Pareto and asked him to build a chapel on the mountain.",
    approvalStatus: "Traditionally Approved"
  },
  {
    id: "angels",
    title: "Our Lady of the Angels",
    location: "Lucerne",
    country: "Switzerland",
    lat: 47.0502,
    lng: 8.3093,
    year: 1513,
    description: "City councilor Maurice von Mettenwyl saw the Virgin Mary surrounded by a heavenly light and promised to rebuild a chapel in her honor.",
    approvalStatus: "Traditionally Approved"
  },
  {
    id: "garaison",
    title: "Notre Dame de Garaison",
    location: "Garaison",
    country: "France",
    lat: 43.2500,
    lng: 0.5000,
    year: 1515,
    description: "The Virgin visited a shepherdess named Angleze Sagazan three times and requested a chapel be built. Many cures were later attested there.",
    approvalStatus: "Traditionally Approved"
  },
  {
    id: "ocotlan",
    title: "Our Lady of Ocotlán",
    location: "Tlaxcala",
    country: "Mexico",
    lat: 19.3175,
    lng: -98.2255,
    year: 1541,
    description: "Our Lady appeared to Juan Diego Bernardino and led him to a healing spring, promising an image of herself could be found within a nearby tree.",
    approvalStatus: "Traditionally Approved"
  },
  {
    id: "vailankanni",
    title: "Our Lady of Good Health",
    location: "Vailankanni",
    country: "India",
    lat: 10.6811,
    lng: 79.8436,
    year: 1580,
    description: "Mary appeared to a shepherd boy and later healed a crippled boy. Portuguese sailors attribute being saved from a violent storm to her intercession.",
    approvalStatus: "Traditionally Approved"
  },
  {
    id: "coromoto",
    title: "Our Lady of Coromoto",
    location: "Portuguesa",
    country: "Venezuela",
    lat: 9.0418,
    lng: -69.7421,
    year: 1652,
    description: "The Virgin appeared to the Cacique of the Cospes Coromoto and his wife, asking them and their tribe to be baptized.",
    approvalStatus: "Traditionally Approved"
  },
  {
    id: "laslajas",
    title: "Our Lady of Las Lajas",
    location: "Guáitara Canyon",
    country: "Colombia",
    lat: 0.8055,
    lng: -77.5860,
    year: 1754,
    description: "Maria Mueses de Quinones and her deaf-mute daughter Rosa saw an apparition in a canyon. A miraculous image was found burned into the rocks, and Rosa was later restored to life.",
    approvalStatus: "Traditionally Approved"
  },
  {
    id: "lavang",
    title: "Our Lady of La Vang",
    location: "La Vang",
    country: "Vietnam",
    lat: 16.7900,
    lng: 107.2172,
    year: 1798,
    description: "Mary appeared to Christians seeking refuge in the jungle. She comforted them, provided a medicinal cure from tree leaves, and promised to answer their prayers.",
    approvalStatus: "Traditionally Approved"
  },
  {
    id: "lichen",
    title: "Our Lady of Lichen",
    location: "Lichen",
    country: "Poland",
    lat: 52.3268,
    lng: 18.3564,
    year: 1813,
    description: "Mary healed a wounded soldier and later appeared to a shepherd in 1850, foretelling a cholera epidemic and interceding for many.",
    approvalStatus: "Traditionally Approved"
  },
  {
    id: "pompeii",
    title: "Our Lady of Pompeii",
    location: "Pompeii",
    country: "Italy",
    lat: 40.7462,
    lng: 14.4989,
    year: 1884,
    description: "The Virgin appeared as the Queen of the Rosary to Fortuna Agrelli, who was miraculously cured of a severe illness.",
    approvalStatus: "Traditionally Approved"
  },
  {
    id: "donglu",
    title: "Our Lady of China",
    location: "Dong Lu",
    country: "China",
    lat: 38.8351,
    lng: 115.4264,
    year: 1900,
    description: "Mary appeared as a beautiful lady in the skies when Catholics implored Her to save them and their city from destruction during the Boxer Rebellion.",
    approvalStatus: "Traditionally Approved"
  }
];
