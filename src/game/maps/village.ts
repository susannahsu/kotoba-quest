// Buena Village + forest — the M2 map, generated as a tile grid plus object placements
// (NPCs, readable signs, item pickups, enemies). A Tiled JSON loader can replace
// buildVillage() later without touching the scene.
export const TILE = 32;
export const MAP_W = 40;
export const MAP_H = 30;

export const T = {
  GRASS: 0,
  PATH: 1,
  DIRT: 2,
  WATER: 3,
  TREE: 4,
  FLOWER: 5,
  BUSH: 6,
  ROCK: 7,
  FENCE: 8,
  HOUSE_WALL: 9,
  HOUSE_ROOF: 10,
  DOOR: 11,
} as const;

export const TILE_TEXTURE: Record<number, string> = {
  [T.GRASS]: 'grass',
  [T.PATH]: 'path',
  [T.DIRT]: 'dirt',
  [T.WATER]: 'water',
  [T.TREE]: 'tree',
  [T.FLOWER]: 'flower',
  [T.BUSH]: 'bush',
  [T.ROCK]: 'rock',
  [T.FENCE]: 'fence',
  [T.HOUSE_WALL]: 'house_wall',
  [T.HOUSE_ROOF]: 'house_roof',
  [T.DOOR]: 'door',
};

export const COLLIDE: Set<number> = new Set([
  T.WATER,
  T.TREE,
  T.ROCK,
  T.FENCE,
  T.HOUSE_WALL,
  T.HOUSE_ROOF,
  T.DOOR,
]);

const px = (tx: number, ty: number) => ({ x: tx * TILE + TILE / 2, y: ty * TILE + TILE / 2 });

export const SPAWN = px(8, 23);

export interface NpcPlacement {
  id: string;
  sprite: string;
  tx: number;
  ty: number;
  kind: 'lesson' | 'talk';
}
export interface SignPlacement {
  tx: number;
  ty: number;
  vocabId: string;
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

export const NPCS: NpcPlacement[] = [
  { id: 'roxy', sprite: 'roxy', tx: 13, ty: 11, kind: 'lesson' },
  { id: 'sylphie', sprite: 'sylphie', tx: 33, ty: 21, kind: 'talk' },
];

export const SIGNS: SignPlacement[] = [
  { tx: 10, ty: 9, vocabId: 'ie' }, // by the house
  { tx: 18, ty: 11, vocabId: 'sakana' }, // by the pond
  { tx: 11, ty: 20, vocabId: 'mura' }, // village path
  { tx: 29, ty: 17, vocabId: 'mori' }, // forest entrance
];

export const ITEMS: ItemPlacement[] = [
  { id: 'book1', tx: 12, ty: 13, vocabId: 'hon' },
  { id: 'apple1', tx: 16, ty: 14, vocabId: 'ringo' },
  { id: 'flower1', tx: 22, ty: 13, vocabId: 'hana' },
];

export const ENEMIES: EnemyPlacement[] = [
  { id: 'tutorial', enemyId: 'manabeast', tx: 15, ty: 13, requiresFlag: 'roxyIntroDone' },
  { id: 'forest1', enemyId: 'manabeast', tx: 34, ty: 13 },
  { id: 'forest2', enemyId: 'manabeast', tx: 33, ty: 16 },
];

export function enemyPos(p: EnemyPlacement) {
  return px(p.tx, p.ty);
}

export function buildVillage(): number[][] {
  const m: number[][] = [];
  for (let y = 0; y < MAP_H; y++) {
    const row: number[] = [];
    for (let x = 0; x < MAP_W; x++) row.push(T.GRASS);
    m.push(row);
  }

  const rect = (x0: number, y0: number, x1: number, y1: number, tile: number) => {
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) m[y][x] = tile;
  };

  // border trees
  for (let x = 0; x < MAP_W; x++) {
    m[0][x] = T.TREE;
    m[MAP_H - 1][x] = T.TREE;
  }
  for (let y = 0; y < MAP_H; y++) {
    m[y][0] = T.TREE;
    m[y][MAP_W - 1] = T.TREE;
  }

  // dense forest band on the right
  rect(30, 1, 38, MAP_H - 2, T.TREE);
  // clearings within the forest
  rect(32, 11, 36, 16, T.GRASS); // beast clearing
  rect(31, 19, 35, 23, T.GRASS); // Sylphiette's clearing

  // Greyrat house (roof + walls + door)
  rect(6, 4, 11, 5, T.HOUSE_ROOF);
  rect(6, 6, 11, 7, T.HOUSE_WALL);
  m[7][8] = T.DOOR;
  // yard fence
  for (let x = 5; x <= 12; x++) if (x !== 8) m[9][x] = T.FENCE;

  // pond
  rect(19, 5, 24, 9, T.WATER);

  // paths
  for (let y = 8; y <= 23; y++) m[y][8] = T.PATH; // main vertical
  for (let x = 8; x <= 32; x++) m[18][x] = T.PATH; // horizontal to forest
  for (let x = 8; x <= 18; x++) m[10][x] = T.PATH; // branch to pond/Roxy
  m[16][32] = T.PATH;
  m[17][32] = T.PATH; // into beast clearing
  m[19][33] = T.PATH; // into Sylphiette's clearing

  // decor (non-colliding flowers/bushes + a few colliding rocks/trees)
  const flowers: [number, number][] = [[10, 15], [15, 21], [22, 16], [6, 14], [25, 21], [14, 6]];
  const bushes: [number, number][] = [[5, 12], [20, 21], [24, 14], [27, 8], [12, 16]];
  const rocks: [number, number][] = [[6, 20], [25, 7], [21, 19]];
  const trees: [number, number][] = [[4, 4], [26, 4], [3, 25], [27, 25], [16, 8]];
  for (const [x, y] of flowers) if (m[y][x] === T.GRASS) m[y][x] = T.FLOWER;
  for (const [x, y] of bushes) if (m[y][x] === T.GRASS) m[y][x] = T.BUSH;
  for (const [x, y] of rocks) if (m[y][x] === T.GRASS) m[y][x] = T.ROCK;
  for (const [x, y] of trees) if (m[y][x] === T.GRASS) m[y][x] = T.TREE;

  // ensure every interactive object stands on walkable ground
  const clearWalkable = (tx: number, ty: number) => {
    if (m[ty][tx] !== T.PATH) m[ty][tx] = T.GRASS;
  };
  clearWalkable(8, 23); // spawn tile
  for (const n of NPCS) clearWalkable(n.tx, n.ty);
  for (const s of SIGNS) clearWalkable(s.tx, s.ty);
  for (const it of ITEMS) clearWalkable(it.tx, it.ty);
  for (const e of ENEMIES) clearWalkable(e.tx, e.ty);

  return m;
}
