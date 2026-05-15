import type { Apparition } from './types';
import { earlyApparitions } from './centuries/early_to_1000';
import { century11and12Apparitions } from './centuries/century_11_12';
import { century13and14Apparitions } from './centuries/century_13_14';
import { modernApparitions } from './centuries/modern';

export type { Apparition };

export const apparitionsData: Apparition[] = [
  ...earlyApparitions,
  ...century11and12Apparitions,
  ...century13and14Apparitions,
  ...modernApparitions
];
