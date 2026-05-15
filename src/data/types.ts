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
  priority?: number; // 1 = highest (world shrines), 5 = lowest (historical details)
  sourceUrl?: string;
}
