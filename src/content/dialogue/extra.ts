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
