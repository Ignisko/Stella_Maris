import type { Apparition } from '../data/apparitions';

export interface AppConfig {
  projectId: 'mary' | 'eucharist';
  title: string;
  subtitle?: Record<string, string>;
  theme: {
    primaryColor: string;
    accentColor: string;
  };
  getData: () => Apparition[];
  getTutorialSteps?: (lang: string) => { title: string; description: string }[];
}
