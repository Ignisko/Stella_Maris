import type { AppConfig } from './types';
import { eucharisticMiraclesData } from '../data/eucharistic-miracles';

export const eucharistConfig: AppConfig = {
  projectId: 'eucharist',
  title: 'Idiota Jezusa',
  subtitle: {
    en: 'Map of Eucharistic Miracles',
    pl: 'Mapa Cudów Eucharystycznych'
  },
  theme: {
    primaryColor: '#ef4444', // Red
    accentColor: '#f87171'
  },
  getData: () => eucharisticMiraclesData
};
