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
};

export function getEnemy(id: string): EnemyDef | undefined {
  return ENEMIES[id];
}
