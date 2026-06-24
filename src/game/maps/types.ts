import type { DialogueLine } from '@/content/types';

export interface NpcPlacement {
  id: string;
  sprite: string;
  tx: number;
  ty: number;
  dialogue: DialogueLine[];
  tag: string;
  /** If set and this flag is true, talking again shows `afterDialogue` instead. */
  doneFlag?: string;
  afterDialogue?: DialogueLine[];
  afterTag?: string;
  marker?: 'quest' | 'talk';
}

export interface SignPlacement {
  tx: number;
  ty: number;
  vocabId?: string; // word sign → opens the word card
  grammar?: boolean; // bookshelf → opens the Grammar notebook
  sprite?: string; // defaults to 'sign'
  label?: string; // prompt label override
}

export interface ItemPlacement {
  id: string;
  tx: number;
  ty: number;
  vocabId: string;
}

export interface EnemyPlacement {
  id: string;
  enemyId: string;
  tx: number;
  ty: number;
  requiresFlag?: string;
}

export interface TransitionPlacement {
  tx: number;
  ty: number;
  toMap: string;
  toTx: number;
  toTy: number;
  label?: string;
}

export interface MapDef {
  id: string;
  width: number;
  height: number;
  build: () => number[][];
  spawn: { tx: number; ty: number };
  npcs: NpcPlacement[];
  signs: SignPlacement[];
  items: ItemPlacement[];
  enemies: EnemyPlacement[];
  transitions: TransitionPlacement[];
}

export const tilePx = (t: number, size = 32) => t * size + size / 2;
