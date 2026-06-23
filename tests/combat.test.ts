import { describe, it, expect } from 'vitest';
import { checkAnswer, damageFor, makeChallenge } from '@/systems/combat/challenges';

describe('combat challenges', () => {
  it('reading challenge includes the correct answer among options', () => {
    const ch = makeChallenge('mizu', 'reading');
    expect(ch.answer).toBe('みず');
    expect(ch.options).toContain('みず');
    expect(ch.options.length).toBeGreaterThanOrEqual(2);
  });

  it('meaning challenge checks against the English gloss', () => {
    const ch = makeChallenge('inu', 'meaning');
    expect(checkAnswer(ch, 'dog')).toBe(true);
    expect(checkAnswer(ch, 'cat')).toBe(false);
  });

  it('typeKana accepts both romaji and kana input', () => {
    const ch = makeChallenge('mizu', 'typeKana');
    expect(checkAnswer(ch, 'mizu')).toBe(true); // romaji -> kana
    expect(checkAnswer(ch, 'みず')).toBe(true); // direct kana
    expect(checkAnswer(ch, 'inu')).toBe(false);
  });

  it('multi-sense meanings accept any listed sense', () => {
    const ch = makeChallenge('tsuchi', 'meaning'); // "earth, soil"
    expect(checkAnswer(ch, 'soil')).toBe(true);
    expect(checkAnswer(ch, 'earth')).toBe(true);
  });

  it('damage scales up with mastery and answer speed', () => {
    const base = damageFor(7, 0, false);
    expect(damageFor(7, 1, false)).toBeGreaterThan(base);
    expect(damageFor(7, 0, true)).toBeGreaterThan(base);
    expect(base).toBeGreaterThanOrEqual(1);
  });
});
