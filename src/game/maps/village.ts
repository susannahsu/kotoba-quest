// Buena Village — the M1 starter map, generated as a tile grid (no Tiled dependency
// yet; a Tiled JSON loader can replace buildVillage() later without touching the scene).
export const TILE = 32;
export const MAP_W = 30;
export const MAP_H = 20;

export const T = { GRASS: 0, PATH: 1, TREE: 2, WATER: 3, FLOWER: 4 } as const;

export const TILE_TEXTURE: Record<number, string> = {
  [T.GRASS]: 'grass',
  [T.PATH]: 'path',
  [T.TREE]: 'tree',
  [T.WATER]: 'water',
  [T.FLOWER]: 'flower',
};

export const COLLIDE: Set<number> = new Set([T.TREE, T.WATER]);

const center = (tx: number, ty: number) => ({ x: tx * TILE + TILE / 2, y: ty * TILE + TILE / 2 });

export const SPAWN = center(8, 14);
export const ROXY_POS = center(16, 9);
export const BEAST_POS = center(11, 7);

export function buildVillage(): number[][] {
  const m: number[][] = [];
  for (let y = 0; y < MAP_H; y++) {
    const row: number[] = [];
    for (let x = 0; x < MAP_W; x++) row.push(T.GRASS);
    m.push(row);
  }
  // border of trees
  for (let x = 0; x < MAP_W; x++) {
    m[0][x] = T.TREE;
    m[MAP_H - 1][x] = T.TREE;
  }
  for (let y = 0; y < MAP_H; y++) {
    m[y][0] = T.TREE;
    m[y][MAP_W - 1] = T.TREE;
  }
  // pond (where the water mage teaches water magic)
  for (let y = 3; y <= 7; y++) for (let x = 20; x <= 25; x++) m[y][x] = T.WATER;
  // paths
  for (let x = 2; x <= 16; x++) m[14][x] = T.PATH;
  for (let y = 9; y <= 14; y++) m[y][16] = T.PATH;
  for (let x = 16; x <= 19; x++) m[9][x] = T.PATH;
  // scattered inner trees (obstacles), kept clear of paths + key positions
  const trees: [number, number][] = [
    [4, 4], [5, 4], [6, 10], [22, 12], [24, 15], [7, 6], [12, 3], [26, 8], [3, 16], [27, 17],
  ];
  for (const [x, y] of trees) m[y][x] = T.TREE;
  // decorative flowers (non-colliding)
  const flowers: [number, number][] = [
    [10, 12], [11, 12], [18, 13], [6, 15], [20, 16], [14, 5], [9, 9],
  ];
  for (const [x, y] of flowers) if (m[y][x] === T.GRASS) m[y][x] = T.FLOWER;
  return m;
}
