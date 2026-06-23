import { describe, it, expect } from 'vitest';
import { LEVEL_PRESETS, shouldShowFurigana } from '@/systems/japanese/levels';
import { getVocab } from '@/content/vocab/n5-starter';

describe('furigana level scaling', () => {
  const n5Seg = { text: '水', reading: 'みず', vocabId: 'mizu' };
  const hardSeg = { text: '魔法', reading: 'まほう', vocabId: 'mahou' };
  const n5 = getVocab('mizu'); // N5
  const hard = getVocab('mahou'); // N4

  it('shows furigana for any kanji in "all" mode', () => {
    expect(shouldShowFurigana('all', n5Seg, n5)).toBe(true);
  });

  it('hides furigana in "off" mode', () => {
    expect(shouldShowFurigana('off', n5Seg, n5)).toBe(false);
  });

  it('"smart" mode hides N5 words but shows harder ones', () => {
    expect(shouldShowFurigana('smart', n5Seg, n5)).toBe(false);
    expect(shouldShowFurigana('smart', hardSeg, hard)).toBe(true);
  });

  it('never shows furigana for a segment without a reading', () => {
    expect(shouldShowFurigana('all', { text: 'を' })).toBe(false);
  });

  it('maps levels to furigana + romaji presets', () => {
    expect(LEVEL_PRESETS.beginner.romaji).toBe(true);
    expect(LEVEL_PRESETS.n5.furigana).toBe('all');
    expect(LEVEL_PRESETS.advanced.furigana).toBe('off');
  });
});
