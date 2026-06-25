import { useEffect, useState } from 'react';
import type { Beat } from '@/content/cutscenes';
import { useGame } from '@/state/store';
import { getCharacter } from '@/content/characters';
import { FuriganaText } from '@/systems/japanese/furigana';
import { speak } from '@/systems/japanese/tts';
import { WordPopup } from './WordPopup';

export function CutsceneScreen({ beats, onDone }: { beats: Beat[]; onDone: () => void }) {
  const [i, setI] = useState(0);
  const [word, setWord] = useState<string | null>(null);
  const furigana = useGame((s) => s.settings.furigana);
  const romaji = useGame((s) => s.settings.romaji);
  const audio = useGame((s) => s.settings.audio);
  const captured = useGame((s) => s.grimoire);
  const unlockGrammar = useGame((s) => s.unlockGrammar);

  const beat = beats[i];

  useEffect(() => {
    if (beat?.kind === 'line') {
      const sp = getCharacter(beat.line.speaker);
      speak(beat.line.segments.map((s) => s.text).join(''), { enabled: audio, ...sp.voice });
      if (beat.line.grammarNote) unlockGrammar(beat.line.grammarNote);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i]);

  const advance = () => {
    if (word) return;
    if (i < beats.length - 1) setI(i + 1);
    else onDone();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        advance();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, word]);

  if (!beat) return null;

  return (
    <div
      className="ui-interactive absolute inset-0 z-40 bg-[#0a0812] text-parchment"
      onClick={advance}
      role="dialog"
      aria-label="Story scene"
    >
      {(beat.kind === 'title' || beat.kind === 'narration') && (
        <div className="flex h-full animate-fade-in flex-col items-center justify-center px-8 text-center">
          {beat.kind === 'title' ? (
            <>
              <div className="font-jp text-6xl font-bold drop-shadow">{beat.title}</div>
              {beat.subtitle && <div className="mt-4 text-xl tracking-wide text-arcane">{beat.subtitle}</div>}
            </>
          ) : (
            <p className="max-w-xl text-xl leading-relaxed opacity-90">{beat.text}</p>
          )}
          <div className="mt-10 animate-pulse text-sm opacity-50">▶ click / Space</div>
        </div>
      )}

      {beat.kind === 'line' &&
        (() => {
          const sp = getCharacter(beat.line.speaker);
          return (
            <div className="absolute inset-x-0 bottom-0 flex justify-center p-4">
              <div className="w-full max-w-3xl rounded-2xl bg-ink/95 p-5 shadow-2xl ring-1 ring-arcane/40 backdrop-blur">
                <div className="mb-2 flex items-center gap-2">
                  <div
                    className="grid h-9 w-9 place-items-center rounded-full font-bold text-white"
                    style={{ background: sp.color }}
                  >
                    {(sp.name || '?').charAt(0)}
                  </div>
                  <div className="font-jp font-bold">
                    {sp.nameJp || sp.name}
                    {sp.nameJp && <span className="ml-2 text-xs opacity-60">{sp.name}</span>}
                  </div>
                </div>
                <FuriganaText
                  className="font-jp text-3xl leading-loose"
                  segments={beat.line.segments}
                  mode={furigana}
                  capturedIds={captured}
                  onWord={(id) => setWord(id)}
                />
                {romaji && beat.line.romaji && (
                  <div className="mt-2 text-sm italic opacity-60">{beat.line.romaji}</div>
                )}
                <div className="mt-2 text-base opacity-90">{beat.line.en}</div>
                <div className="mt-3 text-right text-xs opacity-60">▶ click / Space</div>
              </div>
              {word && <WordPopup vocabId={word} onClose={() => setWord(null)} />}
            </div>
          );
        })()}
    </div>
  );
}
