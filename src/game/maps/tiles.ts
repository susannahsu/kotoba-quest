// Shared tile definitions for every map (outdoor + indoor).
export const TILE = 32;

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
  // interior
  FLOOR: 12,
  WALL: 13,
  RUG: 14,
  TABLE: 15,
  SHELF: 16,
  DOOR_OUT: 17,
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
  [T.FLOOR]: 'floor',
  [T.WALL]: 'wall_int',
  [T.RUG]: 'rug',
  [T.TABLE]: 'table',
  [T.SHELF]: 'shelf',
  [T.DOOR_OUT]: 'door_out',
};

// Doors are walkable (you step onto them to transition).
export const COLLIDE: Set<number> = new Set([
  T.WATER,
  T.TREE,
  T.ROCK,
  T.FENCE,
  T.HOUSE_WALL,
  T.HOUSE_ROOF,
  T.WALL,
  T.TABLE,
  T.SHELF,
]);

/** Fill a fresh grid with a base tile. */
export function grid(w: number, h: number, base: number): number[][] {
  const m: number[][] = [];
  for (let y = 0; y < h; y++) {
    const row: number[] = [];
    for (let x = 0; x < w; x++) row.push(base);
    m.push(row);
  }
  return m;
}

export function border(m: number[][], tile: number): void {
  const h = m.length;
  const w = m[0].length;
  for (let x = 0; x < w; x++) {
    m[0][x] = tile;
    m[h - 1][x] = tile;
  }
  for (let y = 0; y < h; y++) {
    m[y][0] = tile;
    m[y][w - 1] = tile;
  }
}

export function rect(
  m: number[][],
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  tile: number,
): void {
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) m[y][x] = tile;
}
