// Roa — a town past the forest path. Home of Eris and the swordmaster Ghislaine.
import { T, border, grid, rect } from './tiles';
import type { MapDef } from './types';
import { erisLines, ghislaineLines } from '@/content/dialogue/extra';

const W = 22;
const H = 16;

function build(): number[][] {
  const m = grid(W, H, T.GRASS);
  border(m, T.TREE);

  // cross-shaped dirt roads
  rect(m, 1, 8, 20, 8, T.DIRT);
  rect(m, 11, 2, 11, 13, T.DIRT);

  // a couple of houses (decorative, solid)
  rect(m, 3, 2, 7, 3, T.HOUSE_ROOF);
  rect(m, 3, 4, 7, 5, T.HOUSE_WALL);
  rect(m, 15, 10, 19, 11, T.HOUSE_ROOF);
  rect(m, 15, 12, 19, 13, T.HOUSE_WALL);

  // town fountain
  rect(m, 8, 5, 9, 6, T.WATER);

  // decor
  const flowers: [number, number][] = [[5, 10], [18, 6], [13, 4], [7, 12]];
  const bushes: [number, number][] = [[14, 6], [4, 12], [19, 7]];
  const rocks: [number, number][] = [[6, 7], [17, 4]];
  for (const [x, y] of flowers) if (m[y][x] === T.GRASS) m[y][x] = T.FLOWER;
  for (const [x, y] of bushes) if (m[y][x] === T.GRASS) m[y][x] = T.BUSH;
  for (const [x, y] of rocks) if (m[y][x] === T.GRASS) m[y][x] = T.ROCK;

  const free = (tx: number, ty: number) => {
    if (m[ty][tx] !== T.PATH && m[ty][tx] !== T.DIRT && m[ty][tx] !== T.DOOR) m[ty][tx] = T.GRASS;
  };
  [[2, 8], [11, 7], [16, 9], [12, 11], [6, 11], [1, 8]].forEach(([x, y]) => free(x, y));

  return m;
}

export const roa: MapDef = {
  id: 'roa',
  width: W,
  height: H,
  build,
  spawn: { tx: 2, ty: 8 },
  npcs: [
    { id: 'eris', sprite: 'eris', tx: 11, ty: 7, dialogue: erisLines, tag: 'eris', marker: 'talk' },
    {
      id: 'ghislaine',
      sprite: 'ghislaine',
      tx: 16,
      ty: 9,
      dialogue: ghislaineLines,
      tag: 'ghislaine',
      marker: 'talk',
    },
  ],
  signs: [{ tx: 12, ty: 11, vocabId: 'machi' }],
  items: [{ id: 'roa_scroll', tx: 6, ty: 11, vocabId: 'tatakau' }],
  enemies: [],
  transitions: [{ tx: 1, ty: 8, toMap: 'forestpath', toTx: 13, toTy: 8, label: '← Forest Path' }],
};
