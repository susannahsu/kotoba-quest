import { describe, it, expect } from 'vitest';
import { MAPS, getMap } from '@/game/maps';
import { COLLIDE } from '@/game/maps/tiles';

describe('maps', () => {
  it('build to their declared dimensions', () => {
    for (const id of Object.keys(MAPS)) {
      const m = getMap(id);
      const g = m.build();
      expect(g.length).toBe(m.height);
      expect(g[0].length).toBe(m.width);
    }
  });

  it('place spawns on walkable tiles', () => {
    for (const id of Object.keys(MAPS)) {
      const m = getMap(id);
      const g = m.build();
      expect(COLLIDE.has(g[m.spawn.ty][m.spawn.tx])).toBe(false);
    }
  });

  it('point every transition at a walkable tile in a real target map', () => {
    for (const id of Object.keys(MAPS)) {
      const m = getMap(id);
      for (const t of m.transitions) {
        expect(MAPS[t.toMap]).toBeDefined();
        const dest = getMap(t.toMap).build();
        expect(COLLIDE.has(dest[t.toTy][t.toTx])).toBe(false);
      }
    }
  });
});
