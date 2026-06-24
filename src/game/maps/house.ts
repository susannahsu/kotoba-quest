// Greyrat house interior — reached through the village door. Home of the grammar
// bookshelf and Zenith (Rudeus's mother).
import { T, border, grid, rect } from './tiles';
import type { MapDef } from './types';
import { zenithLines } from '@/content/dialogue/extra';

const W = 12;
const H = 9;

function build(): number[][] {
  const m = grid(W, H, T.FLOOR);
  border(m, T.WALL);
  m[H - 1][5] = T.DOOR_OUT; // exit at the bottom wall
  rect(m, 2, 2, 9, 6, T.RUG); // a rug
  m[1][2] = T.SHELF;
  m[1][3] = T.SHELF; // bookshelves against the top wall
  m[1][9] = T.TABLE;
  return m;
}

export const house: MapDef = {
  id: 'house',
  width: W,
  height: H,
  build,
  spawn: { tx: 5, ty: 6 },
  npcs: [
    { id: 'zenith', sprite: 'zenith', tx: 7, ty: 4, dialogue: zenithLines, tag: 'zenith', marker: 'talk' },
  ],
  signs: [{ tx: 3, ty: 3, grammar: true, sprite: 'shelf', label: '📘 Read the books' }],
  items: [],
  enemies: [],
  transitions: [{ tx: 5, ty: 8, toMap: 'village', toTx: 8, toTy: 8, label: '🚪 Leave' }],
};
