// On-screen controls for touch devices: a directional D-pad + an action button.
import type { ReactNode } from 'react';
import { bus } from '@/bridge/events';
import { touch } from '@/systems/input/touch';

type Dir = 'up' | 'down' | 'left' | 'right';

function Pad({ dir, cls, children }: { dir: Dir; cls: string; children: ReactNode }) {
  const set = (v: boolean) => (e: React.PointerEvent) => {
    e.preventDefault();
    touch[dir] = v;
  };
  return (
    <button
      aria-label={`Move ${dir}`}
      onPointerDown={set(true)}
      onPointerUp={set(false)}
      onPointerLeave={set(false)}
      onPointerCancel={set(false)}
      className={`ui-interactive absolute grid h-[52px] w-[52px] touch-none select-none place-items-center rounded-xl bg-ink/70 text-xl ring-1 ring-white/15 backdrop-blur active:bg-arcane/50 ${cls}`}
    >
      {children}
    </button>
  );
}

export function TouchControls() {
  return (
    <>
      <div className="absolute bottom-24 left-4" style={{ width: 156, height: 156 }}>
        <Pad dir="up" cls="left-1/2 top-0 -translate-x-1/2">
          ▲
        </Pad>
        <Pad dir="left" cls="left-0 top-1/2 -translate-y-1/2">
          ◀
        </Pad>
        <Pad dir="right" cls="right-0 top-1/2 -translate-y-1/2">
          ▶
        </Pad>
        <Pad dir="down" cls="bottom-0 left-1/2 -translate-x-1/2">
          ▼
        </Pad>
      </div>

      <button
        aria-label="Action / talk / fight"
        onPointerDown={(e) => {
          e.preventDefault();
          bus.emit('touch:action', undefined);
        }}
        className="ui-interactive absolute bottom-52 right-4 grid h-16 w-16 touch-none select-none place-items-center rounded-full bg-arcane/80 text-lg font-bold text-white ring-1 ring-white/25 backdrop-blur active:scale-95"
      >
        A
      </button>
    </>
  );
}
