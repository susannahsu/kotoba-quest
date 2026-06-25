// Global game state + save system. Zustand with localStorage persistence (autosave).
// Read by both the Phaser world (via useGame.getState()) and the React UI (hooks).
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Settings } from '@/content/types';
import {
  gradeMastery,
  masteryScore,
  newMastery,
  reviewMastery,
  type Grade,
  type MasteryRecord,
} from '@/systems/srs/srs';
import { LEVEL_PRESETS } from '@/systems/japanese/levels';

interface Position {
  map: string;
  x: number;
  y: number;
}

interface GameData {
  playerName: string;
  level: number;
  xp: number;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  pos: Position;
  grimoire: string[];
  mastery: Record<string, MasteryRecord>;
  flags: Record<string, boolean>;
  grammar: string[];
  settings: Settings;
  started: boolean;
}

interface GameActions {
  newGame: (name?: string) => void;
  resetSave: () => void;
  capture: (vocabId: string) => boolean;
  answer: (vocabId: string, correct: boolean, fast?: boolean) => void;
  grade: (vocabId: string, grade: Grade) => void;
  masteryOf: (vocabId: string) => number;
  damage: (n: number) => void;
  heal: (n: number) => void;
  spendMp: (n: number) => void;
  restoreMp: (n: number) => void;
  gainXp: (n: number) => void;
  setPos: (x: number, y: number, map?: string) => void;
  setFlag: (key: string, value?: boolean) => void;
  unlockGrammar: (id: string) => void;
  updateSettings: (patch: Partial<Settings>) => void;
}

export type GameStore = GameData & GameActions;

const DEFAULT_SETTINGS: Settings = {
  jpLevel: 'n5',
  furigana: 'all',
  romaji: true,
  audio: true,
  music: true,
  sfx: true,
  textSpeed: 28,
  darkMode: true,
  zoom: 1.6,
};

function freshData(): Omit<GameData, 'settings'> {
  return {
    playerName: 'Rudeus',
    level: 1,
    xp: 0,
    hp: 30,
    maxHp: 30,
    mp: 20,
    maxMp: 20,
    pos: { map: 'village', x: 0, y: 0 },
    grimoire: [],
    mastery: {},
    flags: {},
    grammar: [],
    started: false,
  };
}

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

export const useGame = create<GameStore>()(
  persist(
    (set, get) => ({
      ...freshData(),
      settings: DEFAULT_SETTINGS,

      newGame: (name) =>
        set((s) => ({ ...freshData(), settings: s.settings, playerName: name || 'Rudeus', started: true })),

      resetSave: () => set((s) => ({ ...freshData(), settings: s.settings })),

      capture: (vocabId) => {
        if (get().grimoire.includes(vocabId)) return false;
        set((s) => ({
          grimoire: [...s.grimoire, vocabId],
          mastery: { ...s.mastery, [vocabId]: s.mastery[vocabId] ?? newMastery() },
        }));
        return true;
      },

      answer: (vocabId, correct, fast = false) =>
        set((s) => {
          const rec = s.mastery[vocabId] ?? newMastery();
          return { mastery: { ...s.mastery, [vocabId]: reviewMastery(rec, correct, fast) } };
        }),

      grade: (vocabId, g) =>
        set((s) => {
          const rec = s.mastery[vocabId] ?? newMastery();
          return { mastery: { ...s.mastery, [vocabId]: gradeMastery(rec, g) } };
        }),

      masteryOf: (vocabId) => masteryScore(get().mastery[vocabId]),

      damage: (n) => set((s) => ({ hp: clamp(s.hp - n, 0, s.maxHp) })),
      heal: (n) => set((s) => ({ hp: clamp(s.hp + n, 0, s.maxHp) })),
      spendMp: (n) => set((s) => ({ mp: clamp(s.mp - n, 0, s.maxMp) })),
      restoreMp: (n) => set((s) => ({ mp: clamp(s.mp + n, 0, s.maxMp) })),

      gainXp: (n) =>
        set((s) => {
          let { xp, level, maxHp, maxMp, hp, mp } = s;
          xp += n;
          while (xp >= level * 20) {
            xp -= level * 20;
            level += 1;
            maxHp += 5;
            maxMp += 4;
            hp = maxHp;
            mp = maxMp;
          }
          return { xp, level, maxHp, maxMp, hp, mp };
        }),

      setPos: (x, y, map) => set((s) => ({ pos: { map: map ?? s.pos.map, x, y } })),

      setFlag: (key, value = true) => set((s) => ({ flags: { ...s.flags, [key]: value } })),

      unlockGrammar: (id) =>
        set((s) => (s.grammar.includes(id) ? {} : { grammar: [...s.grammar, id] })),

      updateSettings: (patch) =>
        set((s) => {
          let next: Settings = { ...s.settings, ...patch };
          // Changing the JP level applies its furigana/romaji preset.
          if (patch.jpLevel && patch.jpLevel !== s.settings.jpLevel) {
            const preset = LEVEL_PRESETS[patch.jpLevel];
            next = { ...next, furigana: preset.furigana, romaji: preset.romaji };
          }
          return { settings: next };
        }),
    }),
    {
      name: 'kotoba-quest-save',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        playerName: s.playerName,
        level: s.level,
        xp: s.xp,
        hp: s.hp,
        maxHp: s.maxHp,
        mp: s.mp,
        maxMp: s.maxMp,
        pos: s.pos,
        grimoire: s.grimoire,
        mastery: s.mastery,
        flags: s.flags,
        grammar: s.grammar,
        settings: s.settings,
        started: s.started,
      }),
    },
  ),
);
