// Character definitions. Art is original placeholder geometry (see BootScene) —
// no assets from the anime/novel. Names reference Mushoku Tensei (fan project).
import type { Character } from '@/content/types';

export const CHARACTERS: Record<string, Character> = {
  rudeus: {
    id: 'rudeus',
    name: 'Rudeus',
    nameJp: 'ルーデウス',
    color: '#8a5a3c',
    textureKey: 'rudeus',
  },
  roxy: {
    id: 'roxy',
    name: 'Roxy',
    nameJp: 'ロキシー',
    color: '#7aa7ff',
    textureKey: 'roxy',
  },
  sylphie: {
    id: 'sylphie',
    name: 'Sylphiette',
    nameJp: 'シルフィ',
    color: '#8fc795',
    textureKey: 'sylphie',
  },
  zenith: {
    id: 'zenith',
    name: 'Zenith',
    nameJp: 'ゼニス',
    color: '#cf7d96',
    textureKey: 'zenith',
  },
  eris: {
    id: 'eris',
    name: 'Eris',
    nameJp: 'エリス',
    color: '#e0563b',
    textureKey: 'eris',
  },
  ghislaine: {
    id: 'ghislaine',
    name: 'Ghislaine',
    nameJp: 'ギレーヌ',
    color: '#c9a14a',
    textureKey: 'ghislaine',
  },
  narrator: {
    id: 'narrator',
    name: 'Narrator',
    nameJp: '',
    color: '#b8b0c8',
    textureKey: 'none',
  },
};

export function getCharacter(id: string): Character {
  return CHARACTERS[id] ?? CHARACTERS.narrator;
}
