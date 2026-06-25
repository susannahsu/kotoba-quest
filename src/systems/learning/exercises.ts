// Exercise model + generators for the staged Lesson flow. One word + its current stage
// yields the exercise that advances it. Answers are checked tolerantly (kana/romaji).
import { toKana, toRomaji } from 'wanakana';
import type { Segment } from '@/content/types';
import { VOCAB, getVocab } from '@/content/vocab/n5-starter';
import { getSentence } from '@/content/sentences';
import { exerciseForStage, type ExerciseKind } from './stages';

export interface Exercise {
  kind: ExerciseKind;
  vocabId: string;
  fromStage: number;
  toStage: number;
  instruction: string;
  word?: { jp: string; reading: string };
  sentence?: Segment[]; // fill-blank / build-sentence
  blankIndex?: number; // fill-blank: which tile is hidden
  en?: string; // sentence translation
  audioText?: string; // listen exercises
  options?: string[]; // choices or word-bank tiles
  answer: string; // canonical answer (build-sentence: tiles joined)
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function distractors(pool: string[], answer: string, n: number): string[] {
  return shuffle(Array.from(new Set(pool)).filter((x) => x && x !== answer)).slice(0, n);
}

const normalize = (s: string): string => s.trim().toLowerCase().replace(/[、。，,.\s]/g, '');

/** Build the exercise that advances `vocabId` from `stage`. Returns null if not possible. */
export function makeExercise(vocabId: string, stage: number): Exercise | null {
  const v = getVocab(vocabId);
  if (!v) return null;
  const kind = exerciseForStage(stage);
  if (!kind) return null;
  const base = { vocabId, fromStage: stage, toStage: stage + 1 };

  if (kind === 'listen-word') {
    const options = shuffle([v.jp, ...distractors(VOCAB.map((x) => x.jp), v.jp, 3)]);
    return { ...base, kind, instruction: 'Listen — which word is it?', audioText: v.reading, options, answer: v.jp };
  }
  if (kind === 'meaning') {
    const options = shuffle([v.en, ...distractors(VOCAB.map((x) => x.en), v.en, 3)]);
    return { ...base, kind, instruction: 'What does it mean?', word: { jp: v.jp, reading: v.reading }, options, answer: v.en };
  }
  if (kind === 'type-kana') {
    return { ...base, kind, instruction: 'Type the reading in kana', word: { jp: v.jp, reading: v.reading }, answer: v.reading };
  }

  // sentence-based
  const s = getSentence(vocabId);
  if (!s) return null;

  if (kind === 'fill-blank') {
    const blankIndex = s.tiles.findIndex((t) => t.text === v.jp);
    const options = shuffle([v.jp, ...distractors(VOCAB.map((x) => x.jp), v.jp, 3)]);
    return {
      ...base,
      kind,
      instruction: 'Choose the missing word',
      sentence: s.tiles,
      blankIndex,
      en: s.en,
      options,
      answer: v.jp,
    };
  }
  // build-sentence
  const tiles = s.tiles.map((t) => t.text);
  return {
    ...base,
    kind: 'build-sentence',
    instruction: 'Build the sentence',
    sentence: s.tiles,
    en: s.en,
    options: shuffle(tiles),
    answer: tiles.join(''),
  };
}

export function checkExercise(ex: Exercise, raw: string): boolean {
  if (ex.kind === 'type-kana') {
    const input = raw.trim();
    if (!input) return false;
    if (input === ex.answer) return true;
    if (toKana(input) === ex.answer) return true;
    return normalize(toRomaji(ex.answer)) === normalize(input);
  }
  if (ex.kind === 'meaning') {
    return ex.answer.split(',').map(normalize).includes(normalize(raw));
  }
  return normalize(raw) === normalize(ex.answer);
}

/** Assemble a short lesson from discovered, not-yet-maxed words (easiest first). */
export function buildLesson(candidates: { id: string; stage: number }[], size = 6): Exercise[] {
  const out: Exercise[] = [];
  for (const c of [...candidates].sort((a, b) => a.stage - b.stage)) {
    if (out.length >= size) break;
    const ex = makeExercise(c.id, c.stage);
    if (ex) out.push(ex);
  }
  return out;
}
