// Forest Path — the road east toward Roa. A tougher beast guards the way; seeds M4.
import { T, border, grid, rect } from './tiles';
import type { MapDef } from './types';

const W = 16;
const H = 12;

function build(): number[][] {
  const m = grid(W, H, T.GRASS);
  border(m, T.TREE);
  rect(m, 1, 8, 14, 8, T.DIRT); // the road

  const trees: [number, number][] = [[3, 3], [5, 4], [10, 3], [12, 4], [6, 10], [11, 10]];
  const bushes: [number, number][] = [[4, 6], [9, 6], [13, 5]];
  const flowers: [number, number][] = [[7, 5], [13, 9], [2, 5]];
  for (const [x, y] of trees) if (m[y][x] === T.GRASS) m[y][x] = T.TREE;
  for (const [x, y] of bushes) if (m[y][x] === T.GRASS) m[y][x] = T.BUSH;
  for (const [x, y] of flowers) if (m[y][x] === T.GRASS) m[y][x] = T.FLOWER;

  // keep key tiles clear
  [[2, 8], [8, 6], [12, 8], [1, 8]].forEach(([x, y]) => {
    if (m[y][x] === T.TREE) m[y][x] = T.GRASS;
  });
  return m;
}

export const forestpath: MapDef = {
  id: 'forestpath',
  width: W,
  height: H,
  build,
  spawn: { tx: 2, ty: 8 },
  npcs: [],
  signs: [{ tx: 8, ty: 6, vocabId: 'machi' }],
  items: [],
  enemies: [{ id: 'fp_great', enemyId: 'greatbeast', tx: 12, ty: 8 }],
  transitions: [{ tx: 1, ty: 8, toMap: 'village', toTx: 37, toTy: 14, label: '← Back to village' }],
};
