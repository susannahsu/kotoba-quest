// Story cutscenes: full-screen sequences of title cards, English narration, and
// bilingual dialogue lines. Played at key moments to give the world a narrative spine.
import type { DialogueLine } from './types';

export type Beat =
  | { kind: 'title'; title: string; subtitle?: string }
  | { kind: 'narration'; text: string }
  | { kind: 'line'; line: DialogueLine };

export interface Cutscene {
  id: string;
  beats: Beat[];
}

const prologue: Cutscene = {
  id: 'prologue',
  beats: [
    { kind: 'title', title: '言葉クエスト', subtitle: 'Mushoku Tensei · Kotoba Quest' },
    {
      kind: 'narration',
      text: 'A thirty-four-year-old shut-in dies on a cold, rainy street — friendless, and full of regret.',
    },
    { kind: 'narration', text: '…and wakes as a newborn, in a world of swords and magic.' },
    {
      kind: 'narration',
      text: 'This time, he swears, he will live without regret. He will learn. He will grow. He will not look away.',
    },
    {
      kind: 'narration',
      text: 'But first — he must learn to read and speak all over again. In this world, words are quite literally power.',
    },
    {
      kind: 'line',
      line: {
        speaker: 'narrator',
        segments: [
          { text: '言葉', reading: 'ことば', vocabId: 'kotoba' },
          { text: 'は' },
          { text: '力', reading: 'ちから' },
          { text: '。' },
        ],
        romaji: 'Kotoba wa chikara.',
        en: 'Words are power.',
      },
    },
    { kind: 'title', title: '第一章', subtitle: 'Chapter 1 — A Second Life' },
  ],
};

const chForest: Cutscene = {
  id: 'ch-forest',
  beats: [
    { kind: 'title', title: '第二章', subtitle: 'Chapter 2 — Into the Forest' },
    {
      kind: 'narration',
      text: 'Beyond the village fence the forest path winds east — toward strangers, stronger beasts, and the town of Roa.',
    },
  ],
};

const chRoa: Cutscene = {
  id: 'ch-roa',
  beats: [
    { kind: 'title', title: '第三章', subtitle: 'Chapter 3 — The Sword City' },
    {
      kind: 'narration',
      text: 'Roa: home of the proud Boreas family — and a swordmaster whose blade speaks louder than any word.',
    },
  ],
};

export const CUTSCENES: Record<string, Cutscene> = {
  prologue,
  'ch-forest': chForest,
  'ch-roa': chRoa,
};

export function getCutscene(id: string): Cutscene | undefined {
  return CUTSCENES[id];
}
