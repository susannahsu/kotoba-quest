import type { MapDef } from './types';
import { village } from './village';
import { house } from './house';
import { forestpath } from './forestpath';
import { roa } from './roa';

export const MAPS: Record<string, MapDef> = { village, house, forestpath, roa };

export function getMap(id: string): MapDef {
  return MAPS[id] ?? village;
}
