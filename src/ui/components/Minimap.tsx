// Always-on minimap: draws the current map's terrain + markers (NPCs, signs, items,
// enemies, exits) and the live player dot, fed by the throttled `world:pos` event.
import { useEffect, useMemo, useRef, useState } from 'react';
import { bus } from '@/bridge/events';
import { useGame } from '@/state/store';
import { getMap } from '@/game/maps';
import { MINIMAP_COLOR, TILE } from '@/game/maps/tiles';

const MAX = 176;

export function Minimap() {
  const startMap = useGame((s) => s.pos.map);
  const flags = useGame((s) => s.flags);
  const [pos, setPos] = useState({ map: startMap, x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => bus.on('world:pos', (p) => setPos(p)), []);

  const map = getMap(pos.map);
  const grid = useMemo(() => map.build(), [map]);
  const cell = Math.max(2, Math.floor(MAX / Math.max(map.width, map.height)));
  const w = map.width * cell;
  const h = map.height * cell;

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, w, h);
    for (let y = 0; y < map.height; y++) {
      for (let x = 0; x < map.width; x++) {
        ctx.fillStyle = MINIMAP_COLOR[grid[y][x]] ?? '#222';
        ctx.fillRect(x * cell, y * cell, cell, cell);
      }
    }
    const dot = (tx: number, ty: number, color: string, r = cell * 0.7) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(tx * cell + cell / 2, ty * cell + cell / 2, Math.max(1.5, r), 0, Math.PI * 2);
      ctx.fill();
    };
    map.transitions.forEach((t) => dot(t.tx, t.ty, '#ffffff'));
    map.signs.forEach((s) => dot(s.tx, s.ty, '#5b8cff'));
    map.items.forEach((it) => !flags[`item_${it.id}`] && dot(it.tx, it.ty, '#ffd24a'));
    map.enemies.forEach((e) => {
      if (flags[`enemy_${e.id}`]) return;
      if (e.requiresFlag && !flags[e.requiresFlag]) return;
      dot(e.tx, e.ty, '#e0563b');
    });
    map.npcs.forEach((n) => dot(n.tx, n.ty, '#ffe46b'));

    // player
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#1a1426';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc((pos.x / TILE) * cell, (pos.y / TILE) * cell, Math.max(2.5, cell * 0.6), 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }, [grid, pos, flags, cell, w, h, map]);

  const label = map.id.charAt(0).toUpperCase() + map.id.slice(1);

  return (
    <div className="absolute bottom-3 right-3 rounded-lg bg-ink/80 p-1.5 ring-1 ring-white/10 backdrop-blur">
      <canvas
        ref={canvasRef}
        width={w}
        height={h}
        className="block rounded"
        style={{ width: w, height: h }}
      />
      <div className="mt-1 text-center text-[9px] uppercase tracking-wide opacity-60">{label}</div>
    </div>
  );
}
