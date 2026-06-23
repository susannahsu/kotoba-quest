import { useGame } from '@/state/store';
import { isDue } from '@/systems/srs/srs';
import { Bar } from './Bar';

export function HUD({
  onOpenMenu,
}: {
  onOpenMenu: (m: 'grimoire' | 'settings' | 'training' | 'quests') => void;
}) {
  const name = useGame((s) => s.playerName);
  const level = useGame((s) => s.level);
  const hp = useGame((s) => s.hp);
  const maxHp = useGame((s) => s.maxHp);
  const mp = useGame((s) => s.mp);
  const maxMp = useGame((s) => s.maxMp);
  const grimoire = useGame((s) => s.grimoire);
  const mastery = useGame((s) => s.mastery);
  const words = grimoire.length;
  const due = grimoire.filter((id) => mastery[id] && isDue(mastery[id].card)).length;

  return (
    <>
      {/* Stats, top-left */}
      <div className="ui-interactive absolute left-3 top-3 flex flex-col gap-1.5 rounded-xl bg-ink/80 p-3 ring-1 ring-white/10 backdrop-blur">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-full bg-arcane font-bold text-white">
            {name.charAt(0)}
          </div>
          <div className="leading-tight">
            <div className="text-sm font-bold">{name}</div>
            <div className="text-[10px] uppercase tracking-wide opacity-70">Lv {level}</div>
          </div>
        </div>
        <Bar label="HP" value={hp} max={maxHp} color="#ff6b6b" />
        <Bar label="MP" value={mp} max={maxMp} color="#5b8cff" />
      </div>

      {/* Buttons, top-right */}
      <div className="ui-interactive absolute right-3 top-3 flex gap-2">
        <button
          onClick={() => onOpenMenu('training')}
          className="rounded-lg bg-ink/80 px-3 py-2 text-sm ring-1 ring-white/10 backdrop-blur transition hover:bg-arcane/30"
          title="Daily Training (review your words)"
        >
          🧠{due > 0 && <span className="ml-1 tabular-nums text-mana">{due}</span>}
        </button>
        <button
          onClick={() => onOpenMenu('quests')}
          className="rounded-lg bg-ink/80 px-3 py-2 text-sm ring-1 ring-white/10 backdrop-blur transition hover:bg-arcane/30"
          title="Quests"
        >
          📜
        </button>
        <button
          onClick={() => onOpenMenu('grimoire')}
          className="rounded-lg bg-ink/80 px-3 py-2 text-sm ring-1 ring-white/10 backdrop-blur transition hover:bg-arcane/30"
          title="Grimoire (your captured words)"
        >
          📖 <span className="ml-1 tabular-nums">{words}</span>
        </button>
        <button
          onClick={() => onOpenMenu('settings')}
          className="rounded-lg bg-ink/80 px-3 py-2 text-sm ring-1 ring-white/10 backdrop-blur transition hover:bg-arcane/30"
          title="Settings"
        >
          ⚙
        </button>
      </div>

      {/* Controls hint, bottom-left */}
      <div className="absolute bottom-3 left-3 rounded-lg bg-ink/60 px-3 py-1.5 text-[11px] opacity-80 backdrop-blur">
        <span className="font-bold">WASD / Arrows</span> move · <span className="font-bold">Space</span> talk / fight
      </div>
    </>
  );
}
