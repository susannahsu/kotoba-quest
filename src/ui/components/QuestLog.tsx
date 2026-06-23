import { useGame } from '@/state/store';
import { QUESTS } from '@/content/quests';

export function QuestLog({ onClose }: { onClose: () => void }) {
  const flags = useGame((s) => s.flags);

  return (
    <div
      className="ui-interactive absolute inset-0 z-30 grid place-items-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="flex max-h-[80vh] w-[26rem] max-w-[92vw] flex-col rounded-2xl bg-ink p-5 shadow-2xl ring-1 ring-arcane/40"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-jp text-xl font-bold">
            📜 Quests <span className="text-sm opacity-60">任務</span>
          </h2>
          <button onClick={onClose} className="rounded px-2 py-1 text-sm opacity-70 hover:bg-white/10">
            ✕
          </button>
        </div>

        <ul className="panel-scroll flex flex-col gap-3 overflow-y-auto pr-1">
          {QUESTS.map((q) => {
            const done = q.objectives.every((o) => flags[o.flag]);
            return (
              <li key={q.id} className="rounded-xl bg-white/5 p-3">
                <div className="flex items-center gap-2">
                  <span className="font-jp font-bold">{q.titleJp}</span>
                  <span className="text-xs opacity-60">{q.title}</span>
                  {done && <span className="ml-auto text-xs text-leaf">✓ complete</span>}
                </div>
                <p className="mt-0.5 text-xs opacity-70">{q.desc}</p>
                <ul className="mt-2 flex flex-col gap-1 text-sm">
                  {q.objectives.map((o) => {
                    const ok = !!flags[o.flag];
                    return (
                      <li key={o.id} className={ok ? 'text-leaf' : 'opacity-80'}>
                        {ok ? '✓' : '○'} <span className={ok ? 'line-through opacity-70' : ''}>{o.text}</span>
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
