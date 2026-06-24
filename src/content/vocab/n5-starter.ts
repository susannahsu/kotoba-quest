// Starter vocabulary (mostly JLPT N5). Elemental words double as spells.
// Themed groups make it easy to scatter words across the world (signs, items, NPCs).
import type { VocabEntry } from '@/content/types';

export const VOCAB: VocabEntry[] = [
  // --- Elemental words (castable spells) ---
  { id: 'mizu', jp: '水', reading: 'みず', romaji: 'mizu', en: 'water', jlpt: 'N5', pos: 'noun', element: 'water', chant: '水よ、集まれ', tags: ['element', 'nature'] },
  { id: 'hi', jp: '火', reading: 'ひ', romaji: 'hi', en: 'fire', jlpt: 'N5', pos: 'noun', element: 'fire', chant: '火よ、燃えろ', tags: ['element', 'nature'] },
  { id: 'kaze', jp: '風', reading: 'かぜ', romaji: 'kaze', en: 'wind', jlpt: 'N5', pos: 'noun', element: 'wind', chant: '風よ、走れ', tags: ['element', 'nature'] },
  { id: 'tsuchi', jp: '土', reading: 'つち', romaji: 'tsuchi', en: 'earth, soil', jlpt: 'N5', pos: 'noun', element: 'earth', chant: '土よ、固まれ', tags: ['element', 'nature'] },
  { id: 'hikari', jp: '光', reading: 'ひかり', romaji: 'hikari', en: 'light', jlpt: 'N4', pos: 'noun', element: 'heal', chant: '光よ、癒せ', tags: ['element'] },

  // --- Story words ---
  { id: 'mahou', jp: '魔法', reading: 'まほう', romaji: 'mahou', en: 'magic', jlpt: 'N4', pos: 'noun', tags: ['story'] },
  { id: 'kotoba', jp: '言葉', reading: 'ことば', romaji: 'kotoba', en: 'word, language', jlpt: 'N4', pos: 'noun', tags: ['story'] },

  // --- Nature ---
  { id: 'ki', jp: '木', reading: 'き', romaji: 'ki', en: 'tree, wood', jlpt: 'N5', pos: 'noun', tags: ['nature'] },
  { id: 'hana', jp: '花', reading: 'はな', romaji: 'hana', en: 'flower', jlpt: 'N5', pos: 'noun', tags: ['nature'] },
  { id: 'yama', jp: '山', reading: 'やま', romaji: 'yama', en: 'mountain', jlpt: 'N5', pos: 'noun', tags: ['nature'] },
  { id: 'kawa', jp: '川', reading: 'かわ', romaji: 'kawa', en: 'river', jlpt: 'N5', pos: 'noun', tags: ['nature'] },
  { id: 'sora', jp: '空', reading: 'そら', romaji: 'sora', en: 'sky', jlpt: 'N5', pos: 'noun', tags: ['nature'] },
  { id: 'ishi', jp: '石', reading: 'いし', romaji: 'ishi', en: 'stone', jlpt: 'N5', pos: 'noun', tags: ['nature'] },
  { id: 'mori', jp: '森', reading: 'もり', romaji: 'mori', en: 'forest', jlpt: 'N5', pos: 'noun', tags: ['nature', 'place'] },

  // --- Animals ---
  { id: 'inu', jp: '犬', reading: 'いぬ', romaji: 'inu', en: 'dog', jlpt: 'N5', pos: 'noun', tags: ['animal'] },
  { id: 'neko', jp: '猫', reading: 'ねこ', romaji: 'neko', en: 'cat', jlpt: 'N5', pos: 'noun', tags: ['animal'] },
  { id: 'tori', jp: '鳥', reading: 'とり', romaji: 'tori', en: 'bird', jlpt: 'N5', pos: 'noun', tags: ['animal'] },
  { id: 'sakana', jp: '魚', reading: 'さかな', romaji: 'sakana', en: 'fish', jlpt: 'N5', pos: 'noun', tags: ['animal'] },

  // --- People ---
  { id: 'sensei', jp: '先生', reading: 'せんせい', romaji: 'sensei', en: 'teacher', jlpt: 'N5', pos: 'noun', tags: ['people'] },
  { id: 'tomodachi', jp: '友達', reading: 'ともだち', romaji: 'tomodachi', en: 'friend', jlpt: 'N5', pos: 'noun', tags: ['people'] },
  { id: 'kazoku', jp: '家族', reading: 'かぞく', romaji: 'kazoku', en: 'family', jlpt: 'N5', pos: 'noun', tags: ['people'] },
  { id: 'ko', jp: '子', reading: 'こ', romaji: 'ko', en: 'child', jlpt: 'N5', pos: 'noun', tags: ['people'] },

  // --- Places ---
  { id: 'ie', jp: '家', reading: 'いえ', romaji: 'ie', en: 'house, home', jlpt: 'N5', pos: 'noun', tags: ['place'] },
  { id: 'mura', jp: '村', reading: 'むら', romaji: 'mura', en: 'village', jlpt: 'N5', pos: 'noun', tags: ['place'] },
  { id: 'machi', jp: '町', reading: 'まち', romaji: 'machi', en: 'town', jlpt: 'N5', pos: 'noun', tags: ['place'] },
  { id: 'gakkou', jp: '学校', reading: 'がっこう', romaji: 'gakkou', en: 'school', jlpt: 'N5', pos: 'noun', tags: ['place'] },

  // --- Things ---
  { id: 'hon', jp: '本', reading: 'ほん', romaji: 'hon', en: 'book', jlpt: 'N5', pos: 'noun', tags: ['thing'] },
  { id: 'ringo', jp: 'りんご', reading: 'りんご', romaji: 'ringo', en: 'apple', jlpt: 'N5', pos: 'noun', tags: ['food'] },
  { id: 'gohan', jp: 'ご飯', reading: 'ごはん', romaji: 'gohan', en: 'meal, cooked rice', jlpt: 'N5', pos: 'noun', tags: ['food'] },
  { id: 'me', jp: '目', reading: 'め', romaji: 'me', en: 'eye', jlpt: 'N5', pos: 'noun', tags: ['body'] },
  { id: 'te', jp: '手', reading: 'て', romaji: 'te', en: 'hand', jlpt: 'N5', pos: 'noun', tags: ['body'] },

  // --- Verbs ---
  { id: 'iku', jp: '行く', reading: 'いく', romaji: 'iku', en: 'to go', jlpt: 'N5', pos: 'verb', tags: ['verb'] },
  { id: 'miru', jp: '見る', reading: 'みる', romaji: 'miru', en: 'to see, to look', jlpt: 'N5', pos: 'verb', tags: ['verb'] },
  { id: 'taberu', jp: '食べる', reading: 'たべる', romaji: 'taberu', en: 'to eat', jlpt: 'N5', pos: 'verb', tags: ['verb'] },
  { id: 'yomu', jp: '読む', reading: 'よむ', romaji: 'yomu', en: 'to read', jlpt: 'N5', pos: 'verb', tags: ['verb'] },

  // --- Adjectives ---
  { id: 'ookii', jp: '大きい', reading: 'おおきい', romaji: 'ookii', en: 'big', jlpt: 'N5', pos: 'adjective', tags: ['adj'] },
  { id: 'chiisai', jp: '小さい', reading: 'ちいさい', romaji: 'chiisai', en: 'small', jlpt: 'N5', pos: 'adjective', tags: ['adj'] },
];

// Extra dictionary entries: particles + common words that appear in dialogue.
// Looked up for tap-to-learn, but NOT part of the combat/spell deck (VOCAB).
export const EXTRA: VocabEntry[] = [
  { id: 'p_wa', jp: 'は', reading: 'は', romaji: 'wa', en: 'topic particle (wa)', jlpt: 'N5', pos: 'particle' },
  { id: 'p_ga', jp: 'が', reading: 'が', romaji: 'ga', en: 'subject particle', jlpt: 'N5', pos: 'particle' },
  { id: 'p_wo', jp: 'を', reading: 'を', romaji: 'o', en: 'object particle', jlpt: 'N5', pos: 'particle' },
  { id: 'p_ni', jp: 'に', reading: 'に', romaji: 'ni', en: 'to, at (particle)', jlpt: 'N5', pos: 'particle' },
  { id: 'p_de', jp: 'で', reading: 'で', romaji: 'de', en: 'at, by, with (particle)', jlpt: 'N5', pos: 'particle' },
  { id: 'p_no', jp: 'の', reading: 'の', romaji: 'no', en: 'of (possessive particle)', jlpt: 'N5', pos: 'particle' },
  { id: 'p_to', jp: 'と', reading: 'と', romaji: 'to', en: 'and, with (particle)', jlpt: 'N5', pos: 'particle' },
  { id: 'p_mo', jp: 'も', reading: 'も', romaji: 'mo', en: 'also, too (particle)', jlpt: 'N5', pos: 'particle' },
  { id: 'kyou', jp: '今日', reading: 'きょう', romaji: 'kyou', en: 'today', jlpt: 'N5', pos: 'noun' },
  { id: 'issho', jp: '一緒', reading: 'いっしょ', romaji: 'issho', en: 'together', jlpt: 'N5', pos: 'noun' },
  { id: 'taisetsu', jp: '大切', reading: 'たいせつ', romaji: 'taisetsu', en: 'important, precious', jlpt: 'N5', pos: 'adjective' },
  { id: 'choushi', jp: '調子', reading: 'ちょうし', romaji: 'choushi', en: 'condition, pace', jlpt: 'N4', pos: 'noun' },
];

/** Everything that can be looked up: the combat deck plus extras. */
export const DICTIONARY: VocabEntry[] = [...VOCAB, ...EXTRA];

export const VOCAB_BY_ID: Record<string, VocabEntry> = Object.fromEntries(
  VOCAB.map((v) => [v.id, v]),
);
const DICT_BY_ID: Record<string, VocabEntry> = Object.fromEntries(
  DICTIONARY.map((v) => [v.id, v]),
);
const SURFACE_INDEX: Record<string, VocabEntry> = {};
for (const v of DICTIONARY) if (!(v.jp in SURFACE_INDEX)) SURFACE_INDEX[v.jp] = v;

export function getVocab(id: string): VocabEntry | undefined {
  return DICT_BY_ID[id];
}

/** Look up a word by its surface form (the kanji/kana as written). */
export function lookupSurface(text: string): VocabEntry | undefined {
  return SURFACE_INDEX[text];
}

export function vocabByTag(tag: string): VocabEntry[] {
  return VOCAB.filter((v) => v.tags?.includes(tag));
}
