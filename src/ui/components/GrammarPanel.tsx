import { useGame } from '@/state/store';
import { GRAMMAR } from '@/content/grammar';

export function GrammarPanel({ onClose }: { onClose: () => void }) {
  const unlocked = useGame((s) => s.grammar);

  return (
    <div
      className="ui-interactive absolute inset-0 z-30 grid place-items-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="flex max-h-[82vh] w-[28rem] max-w-[92vw] flex-col rounded-2xl bg-ink p-5 shadow-2xl ring-1 ring-arcane/40"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-jp text-xl font-bold">
            📘 Grammar <span className="text-sm opacity-60">文法</span>
          </h2>
          <button onClick={onClose} className="rounded px-2 py-1 text-sm opacity-70 hover:bg-white/10">
            ✕
          </button>
        </div>

        <ul className="panel-scroll flex flex-col gap-2 overflow-y-auto pr-1">
          {GRAMMAR.map((g) => {
            const ok = unlocked.includes(g.id);
            if (!ok) {
              return (
                <li key={g.id} className="rounded-xl bg-white/5 p-3 opacity-50">
                  <span className="font-jp text-lg">？？？</span>{' '}
                  <span className="text-xs">— locked. Encounter it in dialogue to unlock.</span>
                </li>
              );
            }
            return (
              <li key={g.id} className="rounded-xl bg-white/5 p-3">
                <div className="flex items-baseline gap-2">
                  <span className="font-jp text-2xl font-bold text-mana">{g.title}</span>
                  <span className="text-xs opacity-60">{g.titleEn}</span>
                </div>
                <p className="mt-1 text-sm opacity-90">{g.explanation}</p>
                <p className="mt-1 font-jp text-sm opacity-80">
                  {g.example} <span className="opacity-60">— {g.exampleEn}</span>
                </p>
              </li>
            );
          })}
        </ul>

        <p className="mt-3 text-center text-[10px] opacity-40">
          Unlock grammar notes by meeting them in conversation.
        </p>
      </div>
    </div>
  );
}
