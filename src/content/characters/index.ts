// Character definitions. Art is original placeholder geometry (see BootScene) —
// no assets from the anime/novel. Names reference Mushoku Tensei (fan project).
// `voice` gives each character a distinct TTS pitch/rate (and ja voice where available).
import type { Character } from '@/content/types';

export const CHARACTERS: Record<string, Character> = {
  rudeus: {
    id: 'rudeus',
    name: 'Rudeus',
    nameJp: 'ルーデウス',
    color: '#8a5a3c',
    textureKey: 'rudeus',
    voice: { pitch: 1.0, rate: 1.0, voiceIndex: 0 },
  },
  roxy: {
    id: 'roxy',
    name: 'Roxy',
    nameJp: 'ロキシー',
    color: '#7aa7ff',
    textureKey: 'roxy',
    voice: { pitch: 1.3, rate: 1.0, voiceIndex: 1 },
  },
  sylphie: {
    id: 'sylphie',
    name: 'Sylphiette',
    nameJp: 'シルフィ',
    color: '#8fc795',
    textureKey: 'sylphie',
    voice: { pitch: 1.5, rate: 1.08, voiceIndex: 1 },
  },
  zenith: {
    id: 'zenith',
    name: 'Zenith',
    nameJp: 'ゼニス',
    color: '#cf7d96',
    textureKey: 'zenith',
    voice: { pitch: 1.18, rate: 0.92, voiceIndex: 1 },
  },
  eris: {
    id: 'eris',
    name: 'Eris',
    nameJp: 'エリス',
    color: '#e0563b',
    textureKey: 'eris',
    voice: { pitch: 1.22, rate: 1.18, voiceIndex: 0 },
  },
  ghislaine: {
    id: 'ghislaine',
    name: 'Ghislaine',
    nameJp: 'ギレーヌ',
    color: '#c9a14a',
    textureKey: 'ghislaine',
    voice: { pitch: 0.7, rate: 0.9, voiceIndex: 0 },
  },
  narrator: {
    id: 'narrator',
    name: 'Narrator',
    nameJp: '',
    color: '#b8b0c8',
    textureKey: 'none',
    voice: { pitch: 0.92, rate: 0.97, voiceIndex: 0 },
  },
};

export function getCharacter(id: string): Character {
  return CHARACTERS[id] ?? CHARACTERS.narrator;
}
