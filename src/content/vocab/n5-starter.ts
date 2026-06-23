// Starter vocabulary deck (mostly JLPT N5). Elemental words double as spells.
import type { VocabEntry } from '@/content/types';

export const VOCAB: VocabEntry[] = [
  // --- Elemental words (castable spells) ---
  { id: 'mizu', jp: '水', reading: 'みず', romaji: 'mizu', en: 'water', jlpt: 'N5', pos: 'noun', element: 'water', chant: '水よ、集まれ', tags: ['element'] },
  { id: 'hi', jp: '火', reading: 'ひ', romaji: 'hi', en: 'fire', jlpt: 'N5', pos: 'noun', element: 'fire', chant: '火よ、燃えろ', tags: ['element'] },
  { id: 'kaze', jp: '風', reading: 'かぜ', romaji: 'kaze', en: 'wind', jlpt: 'N5', pos: 'noun', element: 'wind', chant: '風よ、走れ', tags: ['element'] },
  { id: 'tsuchi', jp: '土', reading: 'つち', romaji: 'tsuchi', en: 'earth, soil', jlpt: 'N5', pos: 'noun', element: 'earth', chant: '土よ、固まれ', tags: ['element'] },
  { id: 'hikari', jp: '光', reading: 'ひかり', romaji: 'hikari', en: 'light', jlpt: 'N4', pos: 'noun', element: 'heal', chant: '光よ、癒せ', tags: ['element'] },

  // --- Story words ---
  { id: 'mahou', jp: '魔法', reading: 'まほう', romaji: 'mahou', en: 'magic', jlpt: 'N4', pos: 'noun' },
  { id: 'kotoba', jp: '言葉', reading: 'ことば', romaji: 'kotoba', en: 'word, language', jlpt: 'N4', pos: 'noun' },

  // --- Common N5 nouns (distractors + future content) ---
  { id: 'ki', jp: '木', reading: 'き', romaji: 'ki', en: 'tree, wood', jlpt: 'N5', pos: 'noun' },
  { id: 'inu', jp: '犬', reading: 'いぬ', romaji: 'inu', en: 'dog', jlpt: 'N5', pos: 'noun' },
  { id: 'neko', jp: '猫', reading: 'ねこ', romaji: 'neko', en: 'cat', jlpt: 'N5', pos: 'noun' },
  { id: 'hon', jp: '本', reading: 'ほん', romaji: 'hon', en: 'book', jlpt: 'N5', pos: 'noun' },
  { id: 'sensei', jp: '先生', reading: 'せんせい', romaji: 'sensei', en: 'teacher', jlpt: 'N5', pos: 'noun' },
  { id: 'gakkou', jp: '学校', reading: 'がっこう', romaji: 'gakkou', en: 'school', jlpt: 'N5', pos: 'noun' },
  { id: 'tomodachi', jp: '友達', reading: 'ともだち', romaji: 'tomodachi', en: 'friend', jlpt: 'N5', pos: 'noun' },
];

export const VOCAB_BY_ID: Record<string, VocabEntry> = Object.fromEntries(
  VOCAB.map((v) => [v.id, v]),
);

export function getVocab(id: string): VocabEntry | undefined {
  return VOCAB_BY_ID[id];
}
