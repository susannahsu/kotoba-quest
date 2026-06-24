import type { DialogueLine } from '@/content/types';

// Sylphiette — a friendly forest child. Teaches 森 (forest) and 友達 (friend).
export const sylphieLines: DialogueLine[] = [
  {
    speaker: 'sylphie',
    segments: [{ text: 'こんにちは！' }],
    romaji: 'Konnichiwa!',
    en: 'Hello!',
  },
  {
    speaker: 'sylphie',
    segments: [{ text: 'わたしは' }, { text: 'シルフィ' }, { text: 'です。' }],
    romaji: 'Watashi wa Sylphie desu.',
    en: "I'm Sylphie.",
  },
  {
    speaker: 'sylphie',
    segments: [
      { text: '一緒', reading: 'いっしょ' },
      { text: 'に' },
      { text: '森', reading: 'もり', vocabId: 'mori' },
      { text: 'で' },
      { text: 'あそぼう！' },
    ],
    romaji: 'Issho ni mori de asobou!',
    en: "Let's play in the forest together!",
    grammar: '〜で marks where an action happens. 森 = forest.',
  },
  {
    speaker: 'sylphie',
    segments: [
      { text: '友達', reading: 'ともだち', vocabId: 'tomodachi' },
      { text: 'に' },
      { text: 'なろう！' },
    ],
    romaji: 'Tomodachi ni narou!',
    en: "Let's be friends!",
  },
];

// Roxy, after her first lesson — a short encouragement.
export const roxyAgainLines: DialogueLine[] = [
  {
    speaker: 'roxy',
    segments: [{ text: 'いい' }, { text: '調子', reading: 'ちょうし' }, { text: 'よ！' }],
    romaji: 'Ii chōshi yo!',
    en: "You're doing great! Try the words you've learned in battle.",
  },
];

// Zenith — Rudeus's mother, at home. Teaches 家族 (family) and 本 (book).
export const zenithLines: DialogueLine[] = [
  {
    speaker: 'zenith',
    segments: [{ text: 'おかえり、ルーディ。' }],
    romaji: 'Okaeri, Rudi.',
    en: 'Welcome home, Rudy.',
  },
  {
    speaker: 'zenith',
    segments: [
      { text: '家族', reading: 'かぞく', vocabId: 'kazoku' },
      { text: 'は' },
      { text: '大切', reading: 'たいせつ' },
      { text: 'よ。' },
    ],
    romaji: 'Kazoku wa taisetsu yo.',
    en: 'Family is precious.',
    grammarNote: 'wa',
  },
  {
    speaker: 'zenith',
    segments: [
      { text: '本', reading: 'ほん', vocabId: 'hon' },
      { text: 'を' },
      { text: '読', reading: 'よ' },
      { text: 'んでね。' },
    ],
    romaji: 'Hon o yonde ne.',
    en: 'Read your books, okay?',
    grammarNote: 'wo',
  },
];
