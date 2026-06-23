import { bus } from '@/bridge/events';
import { useGame } from '@/state/store';
import { lookup } from '@/systems/japanese/dictionary';
import { speak } from '@/systems/japanese/tts';

export function WordPopup({ vocabId, onClose }: { vocabId: string; onClose: () => void }) {
  const v = lookup(vocabId);
  const captured = useGame((s) => s.grimoire.includes(vocabId));
  const capture = useGame((s) => s.capture);
  const audio = useGame((s) => s.settings.audio);

  if (!v) return null;

  const onCapture = () => {
    if (capture(vocabId)) {
      bus.emit('toast', { text: `Learned ${v.jp}（${v.reading}）!`, tone: 'good' });
    }
  };

  return (
    <div
      className="ui-interactive absolute inset-0 z-30 grid place-items-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="animate-pop-in w-72 rounded-2xl bg-ink p-5 text-center shadow-2xl ring-1 ring-arcane/40"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="font-jp text-4xl font-bold">
          <ruby>
            {v.jp}
            <rt className="text-base">{v.reading}</rt>
          </ruby>
        </div>
        <div className="mt-1 text-sm opacity-70">{v.romaji}</div>
        <div className="mt-3 text-lg">{v.en}</div>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="rounded bg-mana/20 px-2 py-0.5 text-mana">{v.jlpt}</span>
          <span className="rounded bg-white/10 px-2 py-0.5 opacity-80">{v.pos}</span>
          {v.element && (
            <span className="rounded bg-arcane/30 px-2 py-0.5">spell · {v.element}</span>
          )}
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => speak(v.reading, audio)}
            className="flex-1 rounded-lg bg-white/10 py-2 text-sm hover:bg-white/20"
          >
            🔊 Listen
          </button>
          {captured ? (
            <button disabled className="flex-1 rounded-lg bg-leaf/30 py-2 text-sm text-leaf">
              ✓ Learned
            </button>
          ) : (
            <button
              onClick={onCapture}
              className="flex-1 rounded-lg bg-arcane py-2 text-sm font-bold text-white hover:bg-arcane/90"
            >
              ＋ Learn
            </button>
          )}
        </div>
        <button onClick={onClose} className="mt-3 text-xs opacity-60 hover:opacity-100">
          close
        </button>
      </div>
    </div>
  );
}
