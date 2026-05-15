import type { Apparition } from './types';
import { earlyApparitions } from './centuries/early_to_1000';
import { century11and12Apparitions } from './centuries/century_11_12';
import { century13and14Apparitions } from './centuries/century_13_14';
import { century16Apparitions } from './centuries/century_16';
import { century17Apparitions } from './centuries/century_17';
import { century18Apparitions } from './centuries/century_18';
import { century19Apparitions } from './centuries/century_19';
import { century20and21Apparitions } from './centuries/century_20_21';

export type { Apparition };

export const apparitionsData: Apparition[] = [
  ...earlyApparitions,
  ...century11and12Apparitions,
  ...century13and14Apparitions,
  ...century16Apparitions,
  ...century17Apparitions,
  ...century18Apparitions,
  ...century19Apparitions,
  ...century20and21Apparitions
];
