import { useEffect, useState } from 'react';
import type { DialogueLine } from '@/content/types';
import { useGame } from '@/state/store';
import { getCharacter } from '@/content/characters';
import { FuriganaText } from '@/systems/japanese/furigana';
import { speak } from '@/systems/japanese/tts';
import { WordPopup } from './WordPopup';

function lineToJp(line: DialogueLine): string {
  return line.segments.map((s) => s.text).join('');
}

export function DialogueBox({ lines, onDone }: { lines: DialogueLine[]; onDone: () => void }) {
  const [idx, setIdx] = useState(0);
  const [word, setWord] = useState<string | null>(null);
  const furigana = useGame((s) => s.settings.furigana);
  const romaji = useGame((s) => s.settings.romaji);
  const audio = useGame((s) => s.settings.audio);
  const captured = useGame((s) => s.grimoire);

  const line = lines[idx];
  const speaker = getCharacter(line.speaker);

  useEffect(() => {
    speak(lineToJp(line), audio);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);

  const advance = () => {
    if (word) return; // don't advance while a word popup is open
    if (idx < lines.length - 1) setIdx((i) => i + 1);
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
  }, [idx, word]);

  return (
    <div className="absolute inset-x-0 bottom-0 z-20 flex justify-center p-4">
      <div
        className="ui-interactive w-full max-w-3xl cursor-pointer rounded-2xl bg-ink/95 p-5 shadow-2xl ring-1 ring-arcane/40 backdrop-blur"
        onClick={advance}
      >
        <div className="mb-2 flex items-center gap-2">
          <div
            className="grid h-9 w-9 place-items-center rounded-full font-bold text-white"
            style={{ background: speaker.color }}
          >
            {(speaker.name || '?').charAt(0)}
          </div>
          <div className="font-jp font-bold">
            {speaker.nameJp || speaker.name}
            {speaker.nameJp && <span className="ml-2 text-xs opacity-60">{speaker.name}</span>}
          </div>
        </div>

        <div key={idx} className="animate-float-up">
          <FuriganaText
            className="font-jp text-3xl leading-loose"
            segments={line.segments}
            mode={furigana}
            capturedIds={captured}
            onWord={(id) => setWord(id)}
          />
          {romaji && line.romaji && (
            <div className="mt-2 text-sm italic opacity-60">{line.romaji}</div>
          )}
          <div className="mt-2 text-base opacity-90">{line.en}</div>
          {line.grammar && (
            <div className="mt-3 rounded-lg bg-mana/10 px-3 py-2 text-xs text-mana/90">
              💡 {line.grammar}
            </div>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between text-xs opacity-60">
          <span>
            {idx + 1} / {lines.length}
          </span>
          <span className="animate-pulse">▶ Space / click</span>
        </div>
      </div>

      {word && <WordPopup vocabId={word} onClose={() => setWord(null)} />}
    </div>
  );
}
