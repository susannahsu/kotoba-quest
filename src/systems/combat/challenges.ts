// Language-powered combat: turn a vocab word into a quick challenge, check answers
// (kana/romaji tolerant via wanakana), and scale damage by mastery + answer speed.
import { toKana, toRomaji } from 'wanakana';
import type { Challenge, ChallengeKind } from '@/content/types';
import { VOCAB, getVocab } from '@/content/vocab/n5-starter';

const KINDS: ChallengeKind[] = ['reading', 'meaning', 'typeKana'];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
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
  const unique = Array.from(new Set(pool)).filter((x) => x && x !== answer);
  return shuffle(unique).slice(0, n);
}

export function makeChallenge(vocabId: string, kind?: ChallengeKind): Challenge {
  const v = getVocab(vocabId);
  if (!v) throw new Error(`Unknown vocab: ${vocabId}`);
  const k = kind ?? pick(KINDS);

  if (k === 'meaning') {
    const options = shuffle([v.en, ...distractors(VOCAB.map((x) => x.en), v.en, 3)]);
    return { kind: k, vocabId, promptJp: v.jp, promptLabel: 'What does it mean?', answer: v.en, options };
  }
  if (k === 'typeKana') {
    return {
      kind: k,
      vocabId,
      promptJp: v.jp,
      promptLabel: 'Type the reading in kana',
      answer: v.reading,
      options: [],
    };
  }
  const options = shuffle([v.reading, ...distractors(VOCAB.map((x) => x.reading), v.reading, 3)]);
  return { kind: 'reading', vocabId, promptJp: v.jp, promptLabel: 'How do you read it?', answer: v.reading, options };
}

const normalize = (s: string): string => s.trim().toLowerCase().replace(/[、。，,.\s]/g, '');

export function checkAnswer(ch: Challenge, raw: string): boolean {
  if (ch.kind === 'typeKana') {
    const input = raw.trim();
    if (!input) return false;
    if (input === ch.answer) return true; // typed kana directly
    if (toKana(input) === ch.answer) return true; // typed romaji -> kana
    return normalize(toRomaji(ch.answer)) === normalize(input); // typed romaji vs romaji
  }
  if (ch.kind === 'meaning') {
    // accept any comma-separated sense, e.g. "earth, soil"
    const senses = ch.answer.split(',').map(normalize);
    return senses.includes(normalize(raw));
  }
  return normalize(raw) === normalize(ch.answer);
}

/** Final spell damage: base * (1 + mastery) * speed bonus. */
export function damageFor(base: number, mastery: number, fast: boolean): number {
  return Math.max(1, Math.round(base * (1 + mastery) * (fast ? 1.35 : 1)));
}
