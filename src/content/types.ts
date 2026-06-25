// Shared domain types for Kotoba Quest.

/** Player-facing difficulty. Drives furigana/romaji presets (see systems/japanese/levels). */
export type JPLevel = 'beginner' | 'n5' | 'n4n3' | 'advanced';
export type JLPTLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
export type FuriganaMode = 'all' | 'smart' | 'off';
export type SpellElement = 'fire' | 'water' | 'wind' | 'earth' | 'heal';

/** A dictionary word. Words with an `element` are castable as spells. */
export interface VocabEntry {
  id: string;
  jp: string;
  reading: string; // kana reading of the whole word
  romaji: string;
  en: string;
  jlpt: JLPTLevel;
  pos: string; // part of speech
  chant?: string; // flavour incantation, shown when cast
  element?: SpellElement;
  tags?: string[];
}

/** One chunk of a Japanese sentence. A segment with `vocabId` is tappable/capturable. */
export interface Segment {
  text: string; // base text (kanji and/or kana)
  reading?: string; // furigana for this segment (when it contains kanji)
  vocabId?: string;
}

export interface DialogueLine {
  speaker: string; // Character id
  segments: Segment[];
  romaji?: string;
  en: string;
  grammar?: string;
  grammarNote?: string; // id into the grammar notebook (unlocks on encounter)
  emotion?: string;
}

export interface Character {
  id: string;
  name: string;
  nameJp: string;
  color: string;
  textureKey: string;
}

export interface EnemyDef {
  id: string;
  name: string;
  nameJp: string;
  maxHp: number;
  power: number; // damage dealt to the player on a miss
  xp: number;
  textureKey: string;
  deck: string[]; // vocab ids this enemy tests you on
}

export type ChallengeKind = 'reading' | 'meaning' | 'typeKana';

export interface Challenge {
  kind: ChallengeKind;
  vocabId: string;
  promptJp: string;
  promptLabel: string;
  answer: string;
  options: string[]; // empty for typeKana
  timeMs: number; // how long the player has to answer
  isNew?: boolean; // first encounters get extra scaffolding
}

export interface Settings {
  jpLevel: JPLevel;
  furigana: FuriganaMode;
  romaji: boolean;
  audio: boolean;
  music: boolean;
  sfx: boolean;
  textSpeed: number;
  darkMode: boolean;
  zoom: number; // camera zoom (1.0–3.0)
}
