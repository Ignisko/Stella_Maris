export const STATUS_COLORS: Record<string, string> = {
  "Vatican approved": "#fbbf24", // Gold
  "Traditionally approved": "#2dd4bf", // Teal
  "Bishop approved": "#3b82f6", // Bright Blue
  "Coptic approved": "#c084fc", // Purple
  "Approved for faith expression": "#10b981", // Emerald Green
  "Apparitions to saints": "#f43f5e", // Rose Pink
  "Dismissed": "#94a3b8" // Slate Gray
};

export const getApparitionStatusCategory = (status: string): string => {
  if (!status) return "Dismissed";
  const s = status.toLowerCase();
  if (s.includes('vatican') || s.includes('holy see')) return "Vatican approved";
  if (s.includes('tradition')) return "Traditionally approved";
  if (s.includes('bishop') || s.includes('supernatural') || s.includes('syrian')) return "Bishop approved";
  if (s.includes('coptic')) return "Coptic approved";
  if (s.includes('faith') || s.includes('prayer') || s.includes('nihil') || s.includes('pilgrimage')) return "Approved for faith expression";
  if (s.includes('saint')) return "Apparitions to saints";
  return "Dismissed";
};

export const getStatusColor = (status: string): string => {
  const cat = getApparitionStatusCategory(status);
  return STATUS_COLORS[cat] || "#94a3b8";
};

export const hexToRgb = (hex: string): string => {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16) || 148;
  const g = parseInt(cleanHex.substring(2, 4), 16) || 163;
  const b = parseInt(cleanHex.substring(4, 6), 16) || 184;
  return `${r}, ${g}, ${b}`;
};
