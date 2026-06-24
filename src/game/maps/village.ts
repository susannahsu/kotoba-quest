// Buena Village — the hub map. Door → house interior; east gate → forest path.
import { T, border, grid, rect } from './tiles';
import type { MapDef } from './types';
import { roxyIntro } from '@/content/dialogue/roxy-intro';
import { roxyAgainLines, sylphieLines } from '@/content/dialogue/extra';

const W = 40;
const H = 30;

function build(): number[][] {
  const m = grid(W, H, T.GRASS);
  border(m, T.TREE);

  // forest band + clearings
  rect(m, 30, 1, 38, H - 2, T.TREE);
  rect(m, 32, 11, 36, 16, T.GRASS);
  rect(m, 31, 19, 35, 23, T.GRASS);

  // Greyrat house
  rect(m, 6, 4, 11, 5, T.HOUSE_ROOF);
  rect(m, 6, 6, 11, 7, T.HOUSE_WALL);
  m[7][8] = T.DOOR;
  for (let x = 5; x <= 12; x++) if (x !== 8) m[9][x] = T.FENCE;

  // pond
  rect(m, 19, 5, 24, 9, T.WATER);

  // paths
  for (let y = 8; y <= 23; y++) m[y][8] = T.PATH;
  for (let x = 8; x <= 32; x++) m[18][x] = T.PATH;
  for (let x = 8; x <= 18; x++) m[10][x] = T.PATH;
  m[16][32] = T.PATH;
  m[17][32] = T.PATH;
  m[19][33] = T.PATH;
  for (let x = 33; x <= 38; x++) m[14][x] = T.PATH; // east gate corridor

  // decor
  const flowers: [number, number][] = [[10, 15], [15, 21], [22, 16], [6, 14], [25, 21], [14, 6]];
  const bushes: [number, number][] = [[5, 12], [20, 21], [24, 14], [27, 8], [12, 16]];
  const rocks: [number, number][] = [[6, 20], [25, 7], [21, 19]];
  const trees: [number, number][] = [[4, 4], [26, 4], [3, 25], [27, 25], [16, 8]];
  for (const [x, y] of flowers) if (m[y][x] === T.GRASS) m[y][x] = T.FLOWER;
  for (const [x, y] of bushes) if (m[y][x] === T.GRASS) m[y][x] = T.BUSH;
  for (const [x, y] of rocks) if (m[y][x] === T.GRASS) m[y][x] = T.ROCK;
  for (const [x, y] of trees) if (m[y][x] === T.GRASS) m[y][x] = T.TREE;

  // keep interactable tiles walkable (leave paths + doors intact)
  const free = (tx: number, ty: number) => {
    if (m[ty][tx] !== T.PATH && m[ty][tx] !== T.DOOR) m[ty][tx] = T.GRASS;
  };
  [[8, 23], [13, 11], [33, 21], [10, 9], [18, 11], [11, 20], [29, 17], [12, 13], [16, 14], [22, 13], [15, 13], [34, 13], [33, 16], [37, 14]].forEach(([x, y]) => free(x, y));

  return m;
}

export const village: MapDef = {
  id: 'village',
  width: W,
  height: H,
  build,
  spawn: { tx: 8, ty: 23 },
  npcs: [
    {
      id: 'roxy',
      sprite: 'roxy',
      tx: 13,
      ty: 11,
      dialogue: roxyIntro,
      tag: 'roxy-intro',
      doneFlag: 'roxyIntroDone',
      afterDialogue: roxyAgainLines,
      afterTag: 'roxy-again',
      marker: 'quest',
    },
    { id: 'sylphie', sprite: 'sylphie', tx: 33, ty: 21, dialogue: sylphieLines, tag: 'sylphie', marker: 'talk' },
  ],
  signs: [
    { tx: 10, ty: 9, vocabId: 'ie' },
    { tx: 18, ty: 11, vocabId: 'sakana' },
    { tx: 11, ty: 20, vocabId: 'mura' },
    { tx: 29, ty: 17, vocabId: 'mori' },
  ],
  items: [
    { id: 'book1', tx: 12, ty: 13, vocabId: 'hon' },
    { id: 'apple1', tx: 16, ty: 14, vocabId: 'ringo' },
    { id: 'flower1', tx: 22, ty: 13, vocabId: 'hana' },
  ],
  enemies: [
    { id: 'v_tutorial', enemyId: 'manabeast', tx: 15, ty: 13, requiresFlag: 'roxyIntroDone' },
    { id: 'v_forest1', enemyId: 'manabeast', tx: 34, ty: 13 },
    { id: 'v_forest2', enemyId: 'manabeast', tx: 33, ty: 16 },
  ],
  transitions: [
    { tx: 8, ty: 7, toMap: 'house', toTx: 5, toTy: 6, label: '🚪 Enter' },
    { tx: 38, ty: 14, toMap: 'forestpath', toTx: 2, toTy: 8, label: '→ Forest Path' },
  ],
};
