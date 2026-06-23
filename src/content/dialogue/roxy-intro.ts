// Ch.0 — Roxy's first magic lesson. Lore-accurate: Roxy is a water mage, so she
// teaches 水 (water) first, which becomes the player's first spell.
import type { DialogueLine } from '@/content/types';

export const roxyIntro: DialogueLine[] = [
  {
    speaker: 'roxy',
    segments: [{ text: 'はじめまして！' }],
    romaji: 'Hajimemashite!',
    en: 'Nice to meet you!',
  },
  {
    speaker: 'roxy',
    segments: [{ text: 'わたしは' }, { text: 'ロキシー' }, { text: 'です。' }],
    romaji: 'Watashi wa Roxy desu.',
    en: "I'm Roxy.",
  },
  {
    speaker: 'roxy',
    segments: [
      { text: '今日', reading: 'きょう' },
      { text: 'から' },
      { text: '魔法', reading: 'まほう', vocabId: 'mahou' },
      { text: 'を' },
      { text: '教', reading: 'おし' },
      { text: 'えます。' },
    ],
    romaji: 'Kyō kara mahō o oshiemasu.',
    en: "Starting today, I'll teach you magic.",
    grammar: '〜から = "from / starting from". 〜を marks the object you act on.',
  },
  {
    speaker: 'roxy',
    segments: [
      { text: 'まず、この' },
      { text: '言葉', reading: 'ことば', vocabId: 'kotoba' },
      { text: 'を' },
      { text: '覚', reading: 'おぼ' },
      { text: 'えてね。' },
    ],
    romaji: 'Mazu, kono kotoba o oboete ne.',
    en: 'First, memorize this word.',
  },
  {
    speaker: 'roxy',
    segments: [{ text: '水', reading: 'みず', vocabId: 'mizu' }, { text: '。' }],
    romaji: 'Mizu.',
    en: 'Water.',
  },
  {
    speaker: 'roxy',
    segments: [
      { text: '「' },
      { text: '水', reading: 'みず', vocabId: 'mizu' },
      { text: '」と' },
      { text: '読', reading: 'よ' },
      { text: 'みます。' },
    ],
    romaji: "'Mizu' to yomimasu.",
    en: "It's read 'mizu'.",
  },
  {
    speaker: 'roxy',
    segments: [
      { text: 'ひかる' },
      { text: '言葉', reading: 'ことば', vocabId: 'kotoba' },
      { text: 'をタップして、' },
      { text: '覚', reading: 'おぼ' },
      { text: 'えましょう！' },
    ],
    romaji: 'Hikaru kotoba o tappu shite, oboemashō!',
    en: 'Tap the glowing words to learn them!',
    grammar: 'Tip: tap any glowing word to add it to your Grimoire.',
  },
  {
    speaker: 'roxy',
    segments: [
      { text: 'では、' },
      { text: '水', reading: 'みず', vocabId: 'mizu' },
      { text: 'の' },
      { text: '魔法', reading: 'まほう', vocabId: 'mahou' },
      { text: 'を' },
      { text: '使', reading: 'つか' },
      { text: 'ってみましょう！' },
    ],
    romaji: 'Dewa, mizu no mahō o tsukatte mimashō!',
    en: "Now — let's try using water magic!",
  },
];
