import { describe, it, expect } from 'vitest';
import { exerciseForStage, maxStageFor } from '@/systems/learning/stages';
import { makeExercise, checkExercise, buildLesson } from '@/systems/learning/exercises';
import { getVocab } from '@/content/vocab/n5-starter';

describe('mastery ladder', () => {
  it('maps each stage to the exercise that advances it', () => {
    expect(exerciseForStage(1)).toBe('listen-word');
    expect(exerciseForStage(2)).toBe('meaning');
    expect(exerciseForStage(3)).toBe('type-kana');
    expect(exerciseForStage(4)).toBe('fill-blank');
    expect(exerciseForStage(5)).toBe('build-sentence');
    expect(exerciseForStage(6)).toBeNull();
  });

  it('caps words without an example sentence at stage 4', () => {
    expect(maxStageFor(getVocab('mizu')!)).toBe(6); // has a sentence
    expect(maxStageFor(getVocab('te')!)).toBe(4); // no sentence
  });
});

describe('exercise generation + checking', () => {
  it('meaning exercise checks the gloss', () => {
    const ex = makeExercise('inu', 2)!;
    expect(ex.kind).toBe('meaning');
    expect(ex.options).toContain('dog');
    expect(checkExercise(ex, 'dog')).toBe(true);
    expect(checkExercise(ex, 'cat')).toBe(false);
  });

  it('type-kana accepts romaji and kana', () => {
    const ex = makeExercise('mizu', 3)!;
    expect(ex.kind).toBe('type-kana');
    expect(checkExercise(ex, 'mizu')).toBe(true);
    expect(checkExercise(ex, 'みず')).toBe(true);
  });

  it('fill-blank targets the correct tile', () => {
    const ex = makeExercise('mizu', 4)!;
    expect(ex.kind).toBe('fill-blank');
    expect(ex.sentence![ex.blankIndex!].text).toBe('水');
    expect(ex.options).toContain('水');
    expect(checkExercise(ex, '水')).toBe(true);
  });

  it('build-sentence answer is the tiles in order (spacing ignored)', () => {
    const ex = makeExercise('mizu', 5)!;
    expect(ex.kind).toBe('build-sentence');
    expect(ex.answer).toBe('水をのむ');
    expect(checkExercise(ex, '水 を のむ')).toBe(true);
  });

  it('builds an easiest-first lesson capped to size', () => {
    const lesson = buildLesson(
      [
        { id: 'mizu', stage: 3 },
        { id: 'inu', stage: 1 },
        { id: 'hon', stage: 2 },
      ],
      2,
    );
    expect(lesson).toHaveLength(2);
    expect(lesson[0].vocabId).toBe('inu');
  });
});
