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
  }
];
