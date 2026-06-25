import { useGame } from '@/state/store';
import { isDue } from '@/systems/srs/srs';
import { Bar } from './Bar';

type MenuKey = 'grimoire' | 'settings' | 'training' | 'quests' | 'grammar' | 'worldmap' | 'learn';

const BTN =
  'grid h-12 min-w-[3rem] place-items-center rounded-xl bg-ink/85 px-3 text-2xl leading-none ring-1 ring-white/10 backdrop-blur transition hover:bg-arcane/30';

export function HUD({ onOpenMenu }: { onOpenMenu: (m: MenuKey) => void }) {
  const name = useGame((s) => s.playerName);
  const level = useGame((s) => s.level);
  const hp = useGame((s) => s.hp);
  const maxHp = useGame((s) => s.maxHp);
  const mp = useGame((s) => s.mp);
  const maxMp = useGame((s) => s.maxMp);
  const grimoire = useGame((s) => s.grimoire);
  const mastery = useGame((s) => s.mastery);
  const zoom = useGame((s) => s.settings.zoom ?? 1.6);
  const updateSettings = useGame((s) => s.updateSettings);
  const words = grimoire.length;
  const due = grimoire.filter((id) => mastery[id] && isDue(mastery[id].card)).length;

  const setZoom = (delta: number) =>
    updateSettings({ zoom: Math.round(Math.min(3, Math.max(1, zoom + delta)) * 10) / 10 });

  return (
    <>
      {/* Stats, top-left */}
      <div className="ui-interactive absolute left-3 top-3 flex flex-col gap-2 rounded-2xl bg-ink/85 p-3.5 ring-1 ring-white/10 backdrop-blur">
        <div className="flex items-center gap-2.5">
          <div className="grid h-11 w-11 place-items-center rounded-full bg-arcane text-lg font-bold text-white">
            {name.charAt(0)}
          </div>
          <div className="leading-tight">
            <div className="text-base font-bold">{name}</div>
            <div className="text-[11px] uppercase tracking-wide opacity-70">Lv {level}</div>
          </div>
        </div>
        <Bar label="HP" value={hp} max={maxHp} color="#ff6b6b" />
        <Bar label="MP" value={mp} max={maxMp} color="#5b8cff" />
      </div>

      {/* Buttons, top-right */}
      <div className="ui-interactive absolute right-3 top-3 flex gap-2">
        <button className={BTN} title="Learn (lessons)" onClick={() => onOpenMenu('learn')}>
          🎓
        </button>
        <button className={BTN} title="World map" onClick={() => onOpenMenu('worldmap')}>
          🗺️
        </button>
        <button className={BTN} title="Daily Training (review your words)" onClick={() => onOpenMenu('training')}>
          🧠{due > 0 && <span className="ml-1 text-sm font-bold text-mana">{due}</span>}
        </button>
        <button className={BTN} title="Quests" onClick={() => onOpenMenu('quests')}>
          📜
        </button>
        <button className={BTN} title="Grammar notes" onClick={() => onOpenMenu('grammar')}>
          📘
        </button>
        <button className={BTN} title="Grimoire (your captured words)" onClick={() => onOpenMenu('grimoire')}>
          📖<span className="ml-1 text-sm">{words}</span>
        </button>
        <button className={BTN} title="Settings" onClick={() => onOpenMenu('settings')}>
          ⚙
        </button>
      </div>

      {/* Zoom + controls, bottom-left */}
      <div className="ui-interactive absolute bottom-3 left-3 flex items-center gap-2">
        <button
          className="grid h-12 w-12 place-items-center rounded-xl bg-ink/85 text-3xl leading-none ring-1 ring-white/10 backdrop-blur transition hover:bg-arcane/30"
          title="Zoom out"
          onClick={() => setZoom(-0.2)}
        >
          －
        </button>
        <button
          className="grid h-12 w-12 place-items-center rounded-xl bg-ink/85 text-3xl leading-none ring-1 ring-white/10 backdrop-blur transition hover:bg-arcane/30"
          title="Zoom in"
          onClick={() => setZoom(0.2)}
        >
          ＋
        </button>
        <div className="rounded-xl bg-ink/60 px-3 py-2 text-sm opacity-80 backdrop-blur">
          <span className="font-bold">WASD</span> move · <span className="font-bold">Space</span> talk/fight ·
          scroll or ＋/－ to zoom
        </div>
      </div>
    </>
  );
}
