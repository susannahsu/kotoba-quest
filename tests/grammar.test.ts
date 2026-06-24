import { describe, it, expect } from 'vitest';
import { getGrammar } from '@/content/grammar';
import { useGame } from '@/state/store';

describe('grammar notes', () => {
  it('exposes notes with titles and examples', () => {
    expect(getGrammar('wa')?.title).toBe('は');
    expect(getGrammar('wo')?.example).toBeTruthy();
    expect(getGrammar('mashou')?.titleEn).toContain("let's");
  });

  it('unlockGrammar stores unique ids', () => {
    useGame.getState().unlockGrammar('wa');
    useGame.getState().unlockGrammar('wa');
    expect(useGame.getState().grammar.filter((g) => g === 'wa').length).toBe(1);
  });
});
