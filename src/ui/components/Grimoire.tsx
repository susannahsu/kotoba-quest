import { useGame } from '@/state/store';
import { getVocab } from '@/content/vocab/n5-starter';
import { speak } from '@/systems/japanese/tts';

export function Grimoire({ onClose }: { onClose: () => void }) {
  const grimoire = useGame((s) => s.grimoire);
  const masteryOf = useGame((s) => s.masteryOf);
  const audio = useGame((s) => s.settings.audio);

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
            📖 Grimoire <span className="text-sm opacity-60">魔導書</span>
          </h2>
          <button onClick={onClose} className="rounded px-2 py-1 text-sm opacity-70 hover:bg-white/10">
            ✕
          </button>
        </div>

        {grimoire.length === 0 ? (
          <p className="py-8 text-center text-sm opacity-60">
            No words yet. Tap glowing words in dialogue to learn them!
          </p>
        ) : (
          <ul className="panel-scroll flex flex-col gap-2 overflow-y-auto pr-1">
            {grimoire.map((id) => {
              const v = getVocab(id);
              if (!v) return null;
              const m = Math.round(masteryOf(id) * 100);
              return (
                <li key={id} className="rounded-xl bg-white/5 p-3">
                  <div className="flex items-center justify-between">
                    <div className="font-jp text-2xl">
                      <ruby>
                        {v.jp}
                        <rt className="text-xs">{v.reading}</rt>
                      </ruby>
                    </div>
                    <button
                      onClick={() => speak(v.reading, audio)}
                      className="rounded bg-white/10 px-2 py-1 text-xs hover:bg-white/20"
                    >
                      🔊
                    </button>
                  </div>
                  <div className="mt-0.5 text-sm opacity-80">
                    {v.en} <span className="opacity-50">· {v.romaji}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[10px] uppercase opacity-60">mastery</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-black/40">
                      <div className="h-full rounded-full bg-arcane" style={{ width: `${m}%` }} />
                    </div>
                    <span className="w-9 text-right text-[10px] tabular-nums opacity-70">{m}%</span>
                    {v.element && (
                      <span className="rounded bg-mana/20 px-1.5 text-[10px] text-mana">spell</span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <p className="mt-3 text-center text-[10px] opacity-40">
          Mastery grows as you cast words in battle and review them.
        </p>
      </div>
    </div>
  );
}
