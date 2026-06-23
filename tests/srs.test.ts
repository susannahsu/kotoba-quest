import { describe, it, expect } from 'vitest';
import { masteryScore, newMastery, reviewMastery } from '@/systems/srs/srs';

describe('SRS mastery', () => {
  it('a brand-new word has zero mastery', () => {
    expect(masteryScore(newMastery())).toBe(0);
  });

  it('a correct review raises mastery and updates counts', () => {
    const m = reviewMastery(newMastery(), true);
    expect(m.seen).toBe(1);
    expect(m.correct).toBe(1);
    expect(masteryScore(m)).toBeGreaterThan(0);
  });

  it('mastery stays within [0,1] across many reviews', () => {
    let m = newMastery();
    for (let i = 0; i < 8; i++) m = reviewMastery(m, true, true);
    const score = masteryScore(m);
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThanOrEqual(1);
  });

  it('treats an undefined record as zero mastery', () => {
    expect(masteryScore(undefined)).toBe(0);
  });
});
