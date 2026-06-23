// Difficulty presets: a single JP level drives furigana density + romaji visibility.
// Designed so the player can change level any time and the same content re-renders.
import type { FuriganaMode, JLPTLevel, JPLevel, Segment, VocabEntry } from '@/content/types';

export interface LevelPreset {
  furigana: FuriganaMode;
  romaji: boolean;
  label: string;
  desc: string;
}

export const LEVEL_PRESETS: Record<JPLevel, LevelPreset> = {
  beginner: {
    furigana: 'all',
    romaji: true,
    label: 'Complete beginner',
    desc: 'Furigana on everything, romaji shown — kana focus.',
  },
  n5: {
    furigana: 'all',
    romaji: true,
    label: 'Beginner (JLPT N5)',
    desc: 'Furigana on all kanji, romaji available.',
  },
  n4n3: {
    furigana: 'smart',
    romaji: false,
    label: 'Intermediate (N4–N3)',
    desc: 'Furigana only on harder words.',
  },
  advanced: {
    furigana: 'off',
    romaji: false,
    label: 'Advanced (N2+)',
    desc: 'No furigana or romaji — full immersion.',
  },
};

export const JP_LEVEL_ORDER: JPLevel[] = ['beginner', 'n5', 'n4n3', 'advanced'];

const HARDER_THAN_N5: JLPTLevel[] = ['N4', 'N3', 'N2', 'N1'];

/** Should this segment show furigana, given the current mode and the word's JLPT level? */
export function shouldShowFurigana(
  mode: FuriganaMode,
  seg: Segment,
  vocab?: VocabEntry,
): boolean {
  if (!seg.reading) return false;
  if (mode === 'off') return false;
  if (mode === 'all') return true;
  // smart: show only for words harder than N5 (or unknown words, to be safe)
  if (!vocab) return true;
  return HARDER_THAN_N5.includes(vocab.jlpt);
}
