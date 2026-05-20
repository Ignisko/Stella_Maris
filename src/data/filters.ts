export const FILTER_CATEGORIES = [
  "Vatican approved",
  "Traditionally approved",
  "Bishop approved",
  "Coptic approved",
  "Approved for faith expression",
  "Apparitions to saints",
  "Dismissed"
];

// Mapping for our current dataset phrasing
export const categoryMapping: Record<string, string[]> = {
  "Vatican approved": ["Approved by the Holy See", "Vatican Approved", "Vatican approved"],
  "Traditionally approved": ["Traditionally Approved", "Traditionally approved"],
  "Bishop approved": ["Bishop Approved", "Bishop approved", "Approved by local bishop", "Approval by Syrian Catholic Church", "Established as supernatural"],
  "Coptic approved": ["Approved by the Coptic Orthodox Church", "Coptic Approved", "Coptic approved"],
  "Approved for faith expression": ["Approved for Faith Expression", "Approved for faith expression", "Declared nihil obstat", "Nihil obstat", "Declared site of pilgrimage and prayer", "Place of prayer", "Recognized as place of prayer"],
  "Apparitions to saints": ["Apparitions to Saints", "Apparitions to saints"],
  "Dismissed": ["Unapproved Apparitions", "Unapproved apparitions", "Unapproved", "No decision", "Negative decision", "Declared not supernatural", "Not established as supernatural", "Established as not supernatural", "Uninvestigated", "Negative", "Negative - Uninvestigated", "Negative judgment"]
};

export const CENTURY_FILTERS = [
  { id: "c_early", label: "Early (40 - 999)", min: 0, max: 999 },
  { id: "c_11", label: "11th Century (1000s)", min: 1000, max: 1099 },
  { id: "c_12", label: "12th Century (1100s)", min: 1100, max: 1199 },
  { id: "c_13", label: "13th Century (1200s)", min: 1200, max: 1299 },
  { id: "c_14", label: "14th Century (1300s)", min: 1300, max: 1399 },
  { id: "c_15", label: "15th Century (1400s)", min: 1400, max: 1499 },
  { id: "c_16", label: "16th Century (1500s)", min: 1500, max: 1599 },
  { id: "c_17", label: "17th Century (1600s)", min: 1600, max: 1699 },
  { id: "c_18", label: "18th Century (1700s)", min: 1700, max: 1799 },
  { id: "c_19", label: "19th Century (1800s)", min: 1800, max: 1899 },
  { id: "c_20", label: "20th Century (1900s)", min: 1900, max: 1999 },
  { id: "c_21", label: "21st Century (2000s)", min: 2000, max: 2100 },
];
