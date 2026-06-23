import type { SpellElement } from '@/content/types';

export interface SpellInfo {
  nameJp: string;
  nameEn: string;
  color: string;
  base: number;
}

export const SPELLS: Record<SpellElement, SpellInfo> = {
  water: { nameJp: '水撃', nameEn: 'Water Bolt', color: '#5b8cff', base: 7 },
  fire: { nameJp: '火撃', nameEn: 'Fire Bolt', color: '#ff7a59', base: 8 },
  wind: { nameJp: '風刃', nameEn: 'Wind Blade', color: '#5fbf77', base: 6 },
  earth: { nameJp: '土塊', nameEn: 'Stone Shot', color: '#b08458', base: 9 },
  heal: { nameJp: '治癒', nameEn: 'Heal', color: '#ffd56b', base: 6 },
};

/** Words without an element still channel a basic Mana Bolt. */
export const MANA_BOLT: SpellInfo = {
  nameJp: '魔力弾',
  nameEn: 'Mana Bolt',
  color: '#9d6bff',
  base: 6,
};

export const MP_COST = 4;
