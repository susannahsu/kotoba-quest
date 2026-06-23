// Language-powered combat with graded difficulty: new words start as gentle recognition
// (see the word + furigana, pick the meaning) and progress to recall (read it, then type it)
// as mastery grows. Newer words also get more options removed and extra time.
import { toKana, toRomaji } from 'wanakana';
import type { Challenge, ChallengeKind } from '@/content/types';
import { VOCAB, getVocab } from '@/content/vocab/n5-starter';

export interface ChallengeOpts {
  mastery?: number;
  seen?: number;
  kind?: ChallengeKind;
}

const TIME: Record<ChallengeKind, number> = {
  meaning: 12000,
  reading: 9500,
  typeKana: 8500,
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function distractors(pool: string[], answer: string, n: number): string[] {
  const unique = Array.from(new Set(pool)).filter((x) => x && x !== answer);
  return shuffle(unique).slice(0, n);
}

/** Recognition → cued recall → free recall, based on how well the word is known. */
export function pickKind(mastery = 0, seen = 0): ChallengeKind {
  if (seen < 2 || mastery < 0.15) return 'meaning';
  if (mastery < 0.5) return 'reading';
  return 'typeKana';
}

export function makeChallenge(vocabId: string, opts: ChallengeOpts = {}): Challenge {
  const v = getVocab(vocabId);
  if (!v) throw new Error(`Unknown vocab: ${vocabId}`);
  const kind = opts.kind ?? pickKind(opts.mastery, opts.seen);
  const seen = opts.seen ?? 0;
  const isNew = seen < 1;
  const distractCount = seen < 2 ? 2 : 3; // fewer choices while learning
  const base = { vocabId, promptJp: v.jp, timeMs: TIME[kind], isNew };

  if (kind === 'meaning') {
    const options = shuffle([v.en, ...distractors(VOCAB.map((x) => x.en), v.en, distractCount)]);
    return { ...base, kind, promptLabel: 'What does it mean?', answer: v.en, options };
  }
  if (kind === 'typeKana') {
    return { ...base, kind, promptLabel: 'Type the reading in kana', answer: v.reading, options: [] };
  }
  const options = shuffle([v.reading, ...distractors(VOCAB.map((x) => x.reading), v.reading, distractCount)]);
  return { ...base, kind, promptLabel: 'How do you read it?', answer: v.reading, options };
}

const normalize = (s: string): string => s.trim().toLowerCase().replace(/[、。，,.\s]/g, '');

export function checkAnswer(ch: Challenge, raw: string): boolean {
  if (ch.kind === 'typeKana') {
    const input = raw.trim();
    if (!input) return false;
    if (input === ch.answer) return true;
    if (toKana(input) === ch.answer) return true;
    return normalize(toRomaji(ch.answer)) === normalize(input);
  }
  if (ch.kind === 'meaning') {
    const senses = ch.answer.split(',').map(normalize);
    return senses.includes(normalize(raw));
  }
  return normalize(raw) === normalize(ch.answer);
}

/** Final spell damage: base * (1 + mastery) * speed bonus. */
export function damageFor(base: number, mastery: number, fast: boolean): number {
  return Math.max(1, Math.round(base * (1 + mastery) * (fast ? 1.35 : 1)));
}
