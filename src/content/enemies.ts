import type { EnemyDef } from '@/content/types';

export const ENEMIES: Record<string, EnemyDef> = {
  manabeast: {
    id: 'manabeast',
    name: 'Mana Beast',
    nameJp: '魔物',
    maxHp: 24,
    power: 5,
    xp: 25,
    textureKey: 'beast',
    deck: ['mizu', 'mahou', 'kotoba'],
  },
  greatbeast: {
    id: 'greatbeast',
    name: 'Great Mana Beast',
    nameJp: '大魔物',
    maxHp: 40,
    power: 7,
    xp: 50,
    textureKey: 'beast',
    deck: ['hi', 'kaze', 'mori', 'ki', 'tori'],
  },
};

export function getEnemy(id: string): EnemyDef | undefined {
  return ENEMIES[id];
}
