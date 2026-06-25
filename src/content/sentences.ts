// Example sentences for sentence-level exercises (fill-blank, build-sentence). Each
// sentence's target tile (text === the vocab word's jp) is the word being practised.
import type { Segment } from './types';

export interface Sentence {
  vocabId: string;
  tiles: Segment[]; // ordered tiles; one tile's text equals the target word's jp
  en: string;
}

export const SENTENCES: Record<string, Sentence> = {
  mizu: { vocabId: 'mizu', tiles: [{ text: '水', reading: 'みず' }, { text: 'を' }, { text: 'のむ' }], en: '(I) drink water.' },
  hi: { vocabId: 'hi', tiles: [{ text: '火', reading: 'ひ' }, { text: 'が' }, { text: 'あつい' }], en: 'The fire is hot.' },
  kaze: { vocabId: 'kaze', tiles: [{ text: '風', reading: 'かぜ' }, { text: 'が' }, { text: 'つよい' }], en: 'The wind is strong.' },
  mori: { vocabId: 'mori', tiles: [{ text: '森', reading: 'もり' }, { text: 'へ' }, { text: 'いく' }], en: 'Go to the forest.' },
  hon: { vocabId: 'hon', tiles: [{ text: '本', reading: 'ほん' }, { text: 'を' }, { text: 'よむ' }], en: 'Read a book.' },
  ringo: { vocabId: 'ringo', tiles: [{ text: 'りんご' }, { text: 'を' }, { text: 'たべる' }], en: 'Eat an apple.' },
  hana: { vocabId: 'hana', tiles: [{ text: '花', reading: 'はな' }, { text: 'が' }, { text: 'きれい' }], en: 'The flower is pretty.' },
  sakana: { vocabId: 'sakana', tiles: [{ text: '魚', reading: 'さかな' }, { text: 'を' }, { text: 'たべる' }], en: 'Eat fish.' },
  ie: { vocabId: 'ie', tiles: [{ text: '家', reading: 'いえ' }, { text: 'に' }, { text: 'いる' }], en: '(I) am at home.' },
  machi: { vocabId: 'machi', tiles: [{ text: '町', reading: 'まち' }, { text: 'へ' }, { text: 'いく' }], en: 'Go to town.' },
  mura: { vocabId: 'mura', tiles: [{ text: '村', reading: 'むら' }, { text: 'は' }, { text: 'ちいさい' }], en: 'The village is small.' },
  ken: { vocabId: 'ken', tiles: [{ text: '剣', reading: 'けん' }, { text: 'を' }, { text: 'みせる' }], en: 'Show the sword.' },
  tsuyoi: { vocabId: 'tsuyoi', tiles: [{ text: 'エリス' }, { text: 'は' }, { text: '強い', reading: 'つよい' }], en: 'Eris is strong.' },
  inu: { vocabId: 'inu', tiles: [{ text: '犬', reading: 'いぬ' }, { text: 'が' }, { text: 'いる' }], en: 'There is a dog.' },
  neko: { vocabId: 'neko', tiles: [{ text: '猫', reading: 'ねこ' }, { text: 'が' }, { text: 'すき' }], en: '(I) like cats.' },
  tomodachi: { vocabId: 'tomodachi', tiles: [{ text: '友達', reading: 'ともだち' }, { text: 'と' }, { text: 'あそぶ' }], en: 'Play with a friend.' },
  mahou: { vocabId: 'mahou', tiles: [{ text: '魔法', reading: 'まほう' }, { text: 'を' }, { text: 'つかう' }], en: 'Use magic.' },
  sensei: { vocabId: 'sensei', tiles: [{ text: '先生', reading: 'せんせい' }, { text: 'は' }, { text: 'やさしい' }], en: 'The teacher is kind.' },
  gakkou: { vocabId: 'gakkou', tiles: [{ text: '学校', reading: 'がっこう' }, { text: 'へ' }, { text: 'いく' }], en: 'Go to school.' },
};

export function getSentence(id: string): Sentence | undefined {
  return SENTENCES[id];
}

export function hasSentence(id: string): boolean {
  return id in SENTENCES;
}
