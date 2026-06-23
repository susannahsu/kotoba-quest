import { describe, it, expect } from 'vitest';
import { checkAnswer, damageFor, makeChallenge, pickKind } from '@/systems/combat/challenges';

describe('combat challenges', () => {
  it('reading challenge includes the correct answer among options', () => {
    const ch = makeChallenge('mizu', { kind: 'reading' });
    expect(ch.answer).toBe('みず');
    expect(ch.options).toContain('みず');
    expect(ch.options.length).toBeGreaterThanOrEqual(2);
  });

  it('meaning challenge checks against the English gloss', () => {
    const ch = makeChallenge('inu', { kind: 'meaning' });
    expect(checkAnswer(ch, 'dog')).toBe(true);
    expect(checkAnswer(ch, 'cat')).toBe(false);
  });

  it('typeKana accepts both romaji and kana input', () => {
    const ch = makeChallenge('mizu', { kind: 'typeKana' });
    expect(checkAnswer(ch, 'mizu')).toBe(true);
    expect(checkAnswer(ch, 'みず')).toBe(true);
    expect(checkAnswer(ch, 'inu')).toBe(false);
  });

  it('multi-sense meanings accept any listed sense', () => {
    const ch = makeChallenge('tsuchi', { kind: 'meaning' }); // "earth, soil"
    expect(checkAnswer(ch, 'soil')).toBe(true);
    expect(checkAnswer(ch, 'earth')).toBe(true);
  });

  it('grades difficulty by mastery: recognition → reading → typing', () => {
    expect(pickKind(0, 0)).toBe('meaning');
    expect(pickKind(0.3, 5)).toBe('reading');
    expect(pickKind(0.8, 20)).toBe('typeKana');
  });

  it('new words get extra time and fewer distractors', () => {
    const fresh = makeChallenge('mizu', { seen: 0 });
    expect(fresh.isNew).toBe(true);
    expect(fresh.kind).toBe('meaning');
    expect(fresh.timeMs).toBeGreaterThan(10000);
  });

  it('damage scales up with mastery and answer speed', () => {
    const base = damageFor(7, 0, false);
    expect(damageFor(7, 1, false)).toBeGreaterThan(base);
    expect(damageFor(7, 0, true)).toBeGreaterThan(base);
    expect(base).toBeGreaterThanOrEqual(1);
  });
});
