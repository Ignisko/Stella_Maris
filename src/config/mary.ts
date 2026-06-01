import type { AppConfig } from './types';
import { apparitionsData } from '../data/apparitions';

export const maryConfig: AppConfig = {
  projectId: 'mary',
  title: 'Stella Maris',
  theme: {
    primaryColor: 'var(--accent-color)', // e.g., blue
    accentColor: '#3bb2f6'
  },
  getData: () => apparitionsData
};
