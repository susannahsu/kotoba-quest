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

// Eris Boreas Greyrat — fiery, sword-loving. Teaches 剣 (sword) and 〜たい (want to).
export const erisLines: DialogueLine[] = [
  {
    speaker: 'eris',
    segments: [{ text: 'あんた、だれ！？' }],
    romaji: 'Anta, dare!?',
    en: 'You — who are you?!',
  },
  {
    speaker: 'eris',
    segments: [{ text: 'わたしは' }, { text: 'エリス' }, { text: 'よ！' }],
    romaji: 'Watashi wa Eris yo!',
    en: "I'm Eris!",
  },
  {
    speaker: 'eris',
    segments: [{ text: '剣', reading: 'けん', vocabId: 'ken' }, { text: 'が' }, { text: 'すき！' }],
    romaji: 'Ken ga suki!',
    en: 'I love swords!',
    grammarNote: 'ga',
  },
  {
    speaker: 'eris',
    segments: [{ text: 'つよく' }, { text: 'なりたい！' }],
    romaji: 'Tsuyoku naritai!',
    en: 'I want to get stronger!',
    grammarNote: 'tai',
  },
];

// Ghislaine — calm swordmaster. Teaches 強い (strong) and 剣 (sword).
export const ghislaineLines: DialogueLine[] = [
  {
    speaker: 'ghislaine',
    segments: [{ text: 'ふむ。' }, { text: '強い', reading: 'つよい', vocabId: 'tsuyoi' }, { text: 'な。' }],
    romaji: 'Fumu. Tsuyoi na.',
    en: "Hmm. You're strong.",
  },
  {
    speaker: 'ghislaine',
    segments: [{ text: '剣', reading: 'けん', vocabId: 'ken' }, { text: 'を' }, { text: 'みがけ。' }],
    romaji: 'Ken o migake.',
    en: 'Polish your blade.',
    grammarNote: 'wo',
  },
];
