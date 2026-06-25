// The Word Mastery Ladder (Duolingo-style crown levels). A word climbs one stage per
// matching exercise; world discovery grants stage 1, lessons earn the rest.
import type { VocabEntry } from '@/content/types';
import { hasSentence } from '@/content/sentences';

export const MAX_STAGE = 6;

export type ExerciseKind =
  | 'exposure'
  | 'listen-word'
  | 'meaning'
  | 'type-kana'
  | 'fill-blank'
  | 'build-sentence';

export interface StageMeta {
  n: number;
  label: string;
  icon: string;
}

export const STAGE_META: StageMeta[] = [
  { n: 0, label: 'Locked', icon: '🔒' },
  { n: 1, label: 'Seen', icon: '👁' },
  { n: 2, label: 'Heard', icon: '👂' },
  { n: 3, label: 'Read', icon: '📖' },
  { n: 4, label: 'Written', icon: '✍️' },
  { n: 5, label: 'Used', icon: '🗣️' },
  { n: 6, label: 'Mastered', icon: '⭐' },
];

export function stageMeta(stage: number): StageMeta {
  return STAGE_META[Math.max(0, Math.min(MAX_STAGE, stage))];
}

/** The exercise that advances a word FROM `stage` to `stage + 1` (null at the top). */
export function exerciseForStage(stage: number): ExerciseKind | null {
  switch (stage) {
    case 1:
      return 'listen-word';
    case 2:
      return 'meaning';
    case 3:
      return 'type-kana';
    case 4:
      return 'fill-blank';
    case 5:
      return 'build-sentence';
    default:
      return null;
  }
}

/** Words without an example sentence cap at stage 4 (no sentence exercises yet). */
export function maxStageFor(vocab: VocabEntry): number {
  return hasSentence(vocab.id) ? MAX_STAGE : 4;
}
