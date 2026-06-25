// Discovery card — shown when you find a word (item, sign, or by tapping it in dialogue).
// It's the "exposure" step: see the word, hear it, see meaning + an example, and it's added
// to your lessons (stage 1). Deliberate climbing to mastery happens in 🎓 Learn.
import { useEffect } from 'react';
import { useGame } from '@/state/store';
import { lookup } from '@/systems/japanese/dictionary';
import { getSentence } from '@/content/sentences';
import { FuriganaText } from '@/systems/japanese/furigana';
import { speak } from '@/systems/japanese/tts';
import { audio } from '@/systems/audio/audio';

export function WordPopup({ vocabId, onClose }: { vocabId: string; onClose: () => void }) {
  const v = lookup(vocabId);
  const stage = useGame((s) => s.mastery[vocabId]?.stage ?? 0);
  const furigana = useGame((s) => s.settings.furigana);
  const voiceOn = useGame((s) => s.settings.audio);
  const discover = useGame((s) => s.discover);
  const sentence = getSentence(vocabId);

  // Discovering the word IS opening this card: register it + speak it (see + hear).
  useEffect(() => {
    if (!v) return;
    const wasNew = discover(vocabId);
    if (wasNew) audio.sfx('capture');
    speak(v.reading, voiceOn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vocabId]);

  if (!v) return null;
  const isNew = stage === 0;

  return (
    <div
      className="ui-interactive absolute inset-0 z-30 grid place-items-center bg-black/50"
      onClick={onClose}
      role="dialog"
      aria-label="Word"
    >
      <div
        className="animate-pop-in w-80 max-w-[92vw] rounded-2xl bg-ink p-5 text-center shadow-2xl ring-1 ring-arcane/40"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-1 text-xs uppercase tracking-wide text-leaf">
          {isNew ? '✨ New word!' : '📖 Word'}
        </div>
        <div className="font-jp text-5xl font-bold">
          <ruby>
            {v.jp}
            <rt className="text-base">{v.reading}</rt>
          </ruby>
        </div>
        <div className="mt-1 text-sm opacity-70">{v.romaji}</div>
        <div className="mt-2 text-lg">{v.en}</div>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="rounded bg-mana/20 px-2 py-0.5 text-mana">{v.jlpt}</span>
          <span className="rounded bg-white/10 px-2 py-0.5 opacity-80">{v.pos}</span>
          {v.element && <span className="rounded bg-arcane/30 px-2 py-0.5">spell · {v.element}</span>}
        </div>

        {sentence && (
          <div className="mt-3 rounded-lg bg-white/5 p-2">
            <FuriganaText className="font-jp text-lg" segments={sentence.tiles} mode={furigana} />
            <div className="mt-1 text-xs opacity-60">{sentence.en}</div>
          </div>
        )}

        <button
          onClick={() => speak(v.reading, voiceOn)}
          className="mt-4 w-full rounded-lg bg-white/10 py-2 text-sm hover:bg-white/20"
        >
          🔊 Hear it
        </button>

        <p className="mt-3 text-[11px] text-leaf">
          ✓ Added to your lessons — practise it in 🎓 Learn.
        </p>
        <button onClick={onClose} className="mt-2 text-xs opacity-60 hover:opacity-100">
          got it ✕
        </button>
      </div>
    </div>
  );
}
