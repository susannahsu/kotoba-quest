import { useGame } from '@/state/store';

interface Area {
  id: string;
  name: string;
  jp: string;
}

function Node({ area, current, locked }: { area: Area; current: boolean; locked: boolean }) {
  return (
    <div
      className={`rounded-xl px-3 py-2 text-center ring-1 ${
        current
          ? 'bg-arcane/30 ring-arcane'
          : locked
            ? 'bg-white/5 opacity-50 ring-white/10'
            : 'bg-white/10 ring-white/15'
      }`}
    >
      <div className="font-jp text-lg font-bold">{locked ? '？？？' : area.jp}</div>
      <div className="text-[11px] opacity-70">{locked ? 'undiscovered' : area.name}</div>
      {current && <div className="mt-0.5 text-[10px] font-bold text-arcane">● ここ (here)</div>}
    </div>
  );
}

const VILLAGE = { id: 'village', name: 'Buena Village', jp: '村' };
const HOUSE = { id: 'house', name: 'Greyrat House', jp: '家' };
const FOREST = { id: 'forestpath', name: 'Forest Path', jp: '森の道' };
const ROA = { id: 'roa', name: 'Roa', jp: '町' };

export function WorldMap({ onClose }: { onClose: () => void }) {
  const current = useGame((s) => s.pos.map);
  const reachedRoa = useGame((s) => !!s.flags.q_roa_reached);

  return (
    <div
      className="ui-interactive absolute inset-0 z-30 grid place-items-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="w-[30rem] max-w-[94vw] rounded-2xl bg-ink p-6 shadow-2xl ring-1 ring-arcane/40"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-jp text-xl font-bold">
            🗺️ World Map <span className="text-sm opacity-60">地図</span>
          </h2>
          <button onClick={onClose} className="rounded px-2 py-1 text-sm opacity-70 hover:bg-white/10">
            ✕
          </button>
        </div>

        <div className="flex flex-col items-center gap-2">
          <Node area={HOUSE} current={current === 'house'} locked={false} />
          <div className="text-xs opacity-50">🚪</div>
          <div className="flex items-center gap-2">
            <Node area={VILLAGE} current={current === 'village'} locked={false} />
            <span className="opacity-50">→</span>
            <Node area={FOREST} current={current === 'forestpath'} locked={false} />
            <span className="opacity-50">→</span>
            <Node area={ROA} current={current === 'roa'} locked={!reachedRoa && current !== 'roa'} />
          </div>
        </div>

        <p className="mt-6 text-center text-[11px] opacity-50">
          Walk to map edges and doors (🚪) to travel between areas.
        </p>
      </div>
    </div>
  );
}
