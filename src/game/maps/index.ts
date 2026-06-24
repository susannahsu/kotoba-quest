import type { MapDef } from './types';
import { village } from './village';
import { house } from './house';
import { forestpath } from './forestpath';

export const MAPS: Record<string, MapDef> = { village, house, forestpath };

export function getMap(id: string): MapDef {
  return MAPS[id] ?? village;
}
