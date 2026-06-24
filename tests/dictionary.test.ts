import { describe, it, expect } from 'vitest';
import { getVocab, lookupSurface } from '@/content/vocab/n5-starter';

describe('dictionary', () => {
  it('looks up words by surface form', () => {
    expect(lookupSurface('水')?.id).toBe('mizu');
    expect(lookupSurface('は')?.id).toBe('p_wa');
    expect(lookupSurface('今日')?.id).toBe('kyou');
  });

  it('returns undefined for unknown surfaces', () => {
    expect(lookupSurface('ＸＹＺ')).toBeUndefined();
  });

  it('getVocab resolves dictionary-only ids (particles/extras)', () => {
    expect(getVocab('p_wo')?.en).toContain('object');
    expect(getVocab('taisetsu')?.pos).toBe('adjective');
  });
});
