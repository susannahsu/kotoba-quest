// The Learn hub: shows every discovered word's mastery stage (crown) and starts a lesson.
import { useGame } from '@/state/store';
import { getVocab } from '@/content/vocab/n5-starter';
import { maxStageFor, stageMeta } from '@/systems/learning/stages';
import { speak } from '@/systems/japanese/tts';

export function LearnHub({ onClose, onStart }: { onClose: () => void; onStart: () => void }) {
  const grimoire = useGame((s) => s.grimoire);
  const mastery = useGame((s) => s.mastery);
  const audioOn = useGame((s) => s.settings.audio);

  const words = grimoire
    .map((id) => ({ id, v: getVocab(id)!, stage: mastery[id]?.stage ?? 0 }))
    .filter((w) => w.v);
  const learnable = words.filter((w) => w.stage >= 1 && w.stage < maxStageFor(w.v)).length;
  const mastered = words.filter((w) => w.stage >= maxStageFor(w.v)).length;

  return (
    <div
      className="ui-interactive absolute inset-0 z-30 grid place-items-center bg-black/60"
      onClick={onClose}
      role="dialog"
      aria-label="Learn"
    >
      <div
        className="flex max-h-[85vh] w-[28rem] max-w-[94vw] flex-col rounded-2xl bg-ink p-5 shadow-2xl ring-1 ring-arcane/40"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-1 flex items-center justify-between">
          <h2 className="font-jp text-xl font-bold">
            🎓 Learn <span className="text-sm opacity-60">学ぶ</span>
          </h2>
          <button onClick={onClose} className="rounded px-2 py-1 text-sm opacity-70 hover:bg-white/10">
            ✕
          </button>
        </div>
        <p className="mb-3 text-xs opacity-60">
          {words.length} discovered · {mastered} mastered · {learnable} ready to practise
        </p>

        <button
          onClick={onStart}
          disabled={learnable === 0}
          className="mb-4 rounded-xl bg-arcane py-3 text-lg font-bold text-white shadow ring-1 ring-white/20 transition hover:bg-arcane/90 disabled:opacity-40"
        >
          ▶ Start lesson
        </button>

        {words.length === 0 ? (
          <p className="py-6 text-center text-sm opacity-60">
            No words yet. Explore the world — pick up items, read signs, talk to people — to
            discover words. Then climb each word from 👁 Seen to ⭐ Mastered here.
          </p>
        ) : (
          <ul className="panel-scroll flex flex-col gap-2 overflow-y-auto pr-1">
            {words
              .slice()
              .sort((a, b) => b.stage - a.stage)
              .map(({ id, v, stage }) => {
                const max = maxStageFor(v);
                const meta = stageMeta(stage);
                return (
                  <li key={id} className="flex items-center gap-3 rounded-xl bg-white/5 p-2.5">
                    <button
                      onClick={() => speak(v.reading, audioOn)}
                      className="font-jp text-2xl"
                      aria-label={`Hear ${v.reading}`}
                    >
                      <ruby>
                        {v.jp}
                        <rt className="text-[10px]">{v.reading}</rt>
                      </ruby>
                    </button>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm opacity-80">{v.en}</div>
                      <div className="mt-0.5 flex items-center gap-1 text-[11px]">
                        <span>{meta.icon}</span>
                        <span className="opacity-70">{meta.label}</span>
                        <span className="opacity-40">
                          ({stage}/{max})
                        </span>
                      </div>
                    </div>
                    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-black/40">
                      <div
                        className="h-full rounded-full bg-arcane"
                        style={{ width: `${(stage / max) * 100}%` }}
                      />
                    </div>
                  </li>
                );
              })}
          </ul>
        )}

        <p className="mt-3 text-center text-[10px] opacity-40">
          Discover in the world → climb stages here → apply in battle → review in 🧠 Training.
        </p>
      </div>
    </div>
  );
}
