// Spaced-repetition wrapper around ts-fsrs (FSRS algorithm).
// We persist a plain `SerializedCard` (JSON-safe) and rebuild a real Card on review,
// so save/load through localStorage stays clean and the library can evolve its Card shape.
import { fsrs, generatorParameters, createEmptyCard, Rating, State } from 'ts-fsrs';
import type { Card } from 'ts-fsrs';

const scheduler = fsrs(generatorParameters({ enable_fuzz: true }));

export interface SerializedCard {
  due: string;
  stability: number;
  difficulty: number;
  elapsed_days: number;
  scheduled_days: number;
  reps: number;
  lapses: number;
  state: number;
  last_review?: string;
}

/** Per-word memory state plus a simple hit-rate counter. */
export interface MasteryRecord {
  card: SerializedCard;
  seen: number;
  correct: number;
  stage: number; // mastery-ladder stage (0 locked … 6 mastered)
}

function serialize(c: Card): SerializedCard {
  return {
    due: c.due.toISOString(),
    stability: c.stability,
    difficulty: c.difficulty,
    elapsed_days: c.elapsed_days,
    scheduled_days: c.scheduled_days,
    reps: c.reps,
    lapses: c.lapses,
    state: c.state,
    last_review: c.last_review ? c.last_review.toISOString() : undefined,
  };
}

function deserialize(s: SerializedCard): Card {
  // Start from a fresh card (so any library-internal fields get sane defaults), then
  // overwrite the fields we track.
  const c = createEmptyCard(new Date(s.due));
  c.due = new Date(s.due);
  c.stability = s.stability;
  c.difficulty = s.difficulty;
  c.elapsed_days = s.elapsed_days;
  c.scheduled_days = s.scheduled_days;
  c.reps = s.reps;
  c.lapses = s.lapses;
  c.state = s.state as State;
  c.last_review = s.last_review ? new Date(s.last_review) : undefined;
  return c;
}

export function newCard(): SerializedCard {
  return serialize(createEmptyCard(new Date()));
}

/** Grade a single review. Maps (correct, fast) to an FSRS rating and reschedules. */
export function review(card: SerializedCard, correct: boolean, fast = false): SerializedCard {
  const rating = !correct ? Rating.Again : fast ? Rating.Easy : Rating.Good;
  const log = scheduler.repeat(deserialize(card), new Date());
  return serialize(log[rating].card);
}

/** Memory strength in [0,1], derived from FSRS stability (days). Powers spell damage. */
export function masteryFromCard(card: SerializedCard): number {
  const s = Math.max(0, card.stability);
  return Math.min(1, 1 - Math.exp(-s / 14));
}

export function newMastery(): MasteryRecord {
  return { card: newCard(), seen: 0, correct: 0, stage: 0 };
}

export function reviewMastery(m: MasteryRecord, correct: boolean, fast = false): MasteryRecord {
  return {
    card: review(m.card, correct, fast),
    seen: m.seen + 1,
    correct: m.correct + (correct ? 1 : 0),
    stage: m.stage ?? 0,
  };
}

export type Grade = 'again' | 'hard' | 'good' | 'easy';

const GRADE_RATING: Record<Grade, Rating> = {
  again: Rating.Again,
  hard: Rating.Hard,
  good: Rating.Good,
  easy: Rating.Easy,
};

/** Grade an explicit flashcard review (Daily Training). */
export function gradeMastery(m: MasteryRecord, grade: Grade): MasteryRecord {
  const log = scheduler.repeat(deserialize(m.card), new Date()) as unknown as Record<
    number,
    { card: Card }
  >;
  return {
    card: serialize(log[GRADE_RATING[grade]].card),
    seen: m.seen + 1,
    correct: m.correct + (grade === 'again' ? 0 : 1),
    stage: m.stage ?? 0,
  };
}

export function masteryScore(m: MasteryRecord | undefined): number {
  if (!m) return 0;
  return masteryFromCard(m.card);
}

export function isDue(card: SerializedCard, at: Date = new Date()): boolean {
  return new Date(card.due).getTime() <= at.getTime();
}
