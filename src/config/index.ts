import { maryConfig } from './mary';
import { eucharistConfig } from './eucharist';
import type { AppConfig } from './types';

// Read the Vite environment variable (default to mary if not set)
const projectType = import.meta.env.VITE_APP_PROJECT_TYPE || 'mary';

export const config: AppConfig = projectType === 'eucharist' ? eucharistConfig : maryConfig;
