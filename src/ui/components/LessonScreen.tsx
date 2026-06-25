// Duolingo-style lesson runner: one exercise at a time, immediate feedback, advances a
// word's mastery stage (+ SRS) on success and re-queues it on a miss for another try.
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { toKana } from 'wanakana';
import { useGame } from '@/state/store';
import { getVocab } from '@/content/vocab/n5-starter';
import { maxStageFor } from '@/systems/learning/stages';
import { buildLesson, checkExercise, type Exercise } from '@/systems/learning/exercises';
import { speak } from '@/systems/japanese/tts';
import { audio } from '@/systems/audio/audio';

export function LessonScreen({ onClose }: { onClose: () => void }) {
  const grimoire = useGame((s) => s.grimoire);
  const mastery = useGame((s) => s.mastery);
  const audioOn = useGame((s) => s.settings.audio);
  const answer = useGame((s) => s.answer);
  const advanceStage = useGame((s) => s.advanceStage);
  const gainXp = useGame((s) => s.gainXp);

  const initial = useMemo(() => {
    const candidates = grimoire
      .map((id) => ({ id, stage: mastery[id]?.stage ?? 0, v: getVocab(id) }))
      .filter((c) => c.v && c.stage >= 1 && c.stage < maxStageFor(c.v))
      .map((c) => ({ id: c.id, stage: c.stage }));
    return buildLesson(candidates, 6);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [queue, setQueue] = useState<Exercise[]>(initial);
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<'answer' | 'feedback'>('answer');
  const [correct, setCorrect] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);
  const [typed, setTyped] = useState('');
  const [order, setOrder] = useState<number[]>([]);
  const [rightCount, setRightCount] = useState(0);
  const awarded = useRef(false);

  const ex: Exercise | undefined = queue[idx];
  const finished = queue.length > 0 && idx >= queue.length;

  useEffect(() => {
    setPicked(null);
    setTyped('');
    setOrder([]);
    setPhase('answer');
    if (ex?.kind === 'listen-word' && ex.audioText) speak(ex.audioText, audioOn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);

  useEffect(() => {
    if (finished && !awarded.current) {
      awarded.current = true;
      gainXp(rightCount * 4);
      audio.sfx('levelup');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

  const wrap = (body: ReactNode) => (
    <div
      className="ui-interactive absolute inset-0 z-40 flex flex-col bg-[#0c0a12]"
      role="dialog"
      aria-label="Lesson"
    >
      {body}
    </div>
  );

  if (queue.length === 0) {
    return wrap(
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="text-2xl">🎓</div>
        <p className="max-w-sm opacity-80">
          No words to practise yet. Explore the world — pick up items, read signs, and talk to
          people — to <span className="text-mana">discover</span> words first!
        </p>
        <button onClick={onClose} className="rounded-xl bg-arcane px-6 py-3 font-bold text-white">
          Back
        </button>
      </div>,
    );
  }

  if (finished) {
    return wrap(
      <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
        <div className="font-jp text-4xl font-bold text-leaf">よくできました！</div>
        <p className="text-lg">
          Lesson complete — {rightCount} correct. <span className="opacity-70">+{rightCount * 4} XP</span>
        </p>
        <button onClick={onClose} className="mt-2 rounded-xl bg-arcane px-6 py-3 font-bold text-white">
          Done
        </button>
      </div>,
    );
  }

  const v = getVocab(ex.vocabId);
  const assembled = order.map((i) => ex.options![i]).join('');

  const submit = (raw: string) => {
    if (phase !== 'answer') return;
    const ok = checkExercise(ex, raw);
    setPicked(raw);
    setCorrect(ok);
    setPhase('feedback');
    answer(ex.vocabId, ok);
    audio.sfx(ok ? 'correct' : 'wrong');
    if (ok) {
      advanceStage(ex.vocabId, ex.toStage);
      setRightCount((r) => r + 1);
    } else {
      setQueue((q) => [...q, ex]); // try again later this session
    }
  };

  const next = () => setIdx((i) => i + 1);

  const optionBtn = (opt: string) => {
    let cls = 'bg-white/10 ring-white/10 hover:bg-arcane/30';
    if (phase === 'feedback') {
      if (opt === ex.answer || ex.answer.split(',').includes(opt)) cls = 'bg-leaf/30 ring-leaf';
      else if (opt === picked) cls = 'bg-ember/30 ring-ember';
      else cls = 'bg-white/5 ring-white/10 opacity-60';
    }
    return (
      <button
        key={opt}
        disabled={phase === 'feedback'}
        onClick={() => submit(opt)}
        className={`rounded-xl px-4 py-3 font-jp text-lg ring-1 transition ${cls}`}
      >
        {opt}
      </button>
    );
  };

  return wrap(
    <>
      {/* progress */}
      <div className="flex items-center gap-3 p-4">
        <button onClick={onClose} aria-label="Quit lesson" className="text-lg opacity-60 hover:opacity-100">
          ✕
        </button>
        <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-leaf transition-all"
            style={{ width: `${(idx / queue.length) * 100}%` }}
          />
        </div>
      </div>

      {/* exercise body */}
      <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6">
        <div className="text-sm uppercase tracking-wide opacity-60">{ex.instruction}</div>

        {ex.kind === 'listen-word' && (
          <button
            onClick={() => speak(ex.audioText ?? '', audioOn)}
            className="grid h-24 w-24 place-items-center rounded-full bg-mana/30 text-5xl ring-1 ring-mana/50 hover:bg-mana/40"
            aria-label="Play audio"
          >
            🔊
          </button>
        )}

        {ex.word && (
          <div className="font-jp text-6xl font-bold">
            {ex.kind === 'type-kana' ? (
              ex.word.jp
            ) : (
              <ruby>
                {ex.word.jp}
                <rt className="text-2xl">{ex.word.reading}</rt>
              </ruby>
            )}
          </div>
        )}

        {(ex.kind === 'fill-blank' || ex.kind === 'build-sentence') && ex.sentence && (
          <div className="text-center">
            {ex.kind === 'fill-blank' ? (
              <div className="font-jp text-4xl font-bold leading-relaxed">
                {ex.sentence.map((t, i) =>
                  i === ex.blankIndex ? (
                    <span key={i} className="mx-1 rounded bg-white/15 px-4 text-mana">
                      ＿＿
                    </span>
                  ) : (
                    <span key={i}>{t.text}</span>
                  ),
                )}
              </div>
            ) : null}
            {ex.en && <div className="mt-3 text-base opacity-70">{ex.en}</div>}
          </div>
        )}

        {/* build-sentence assembly area */}
        {ex.kind === 'build-sentence' && (
          <div className="flex min-h-[3.5rem] w-full max-w-md flex-wrap items-center justify-center gap-2 rounded-xl border-b-2 border-white/15 p-2">
            {order.map((tileIdx, pos) => (
              <button
                key={pos}
                disabled={phase === 'feedback'}
                onClick={() => setOrder((o) => o.filter((_, p) => p !== pos))}
                className="rounded-lg bg-white/15 px-3 py-2 font-jp text-lg ring-1 ring-white/15"
              >
                {ex.options![tileIdx]}
              </button>
            ))}
          </div>
        )}

        {/* answer inputs */}
        <div className="w-full max-w-md">
          {(ex.kind === 'listen-word' || ex.kind === 'meaning' || ex.kind === 'fill-blank') && (
            <div className="grid grid-cols-2 gap-2">{ex.options!.map(optionBtn)}</div>
          )}

          {ex.kind === 'type-kana' && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit(typed);
              }}
              className="flex flex-col items-center gap-2"
            >
              <input
                autoFocus
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                disabled={phase === 'feedback'}
                placeholder="type romaji or kana…"
                autoComplete="off"
                spellCheck={false}
                className="w-full rounded-xl bg-white/10 px-4 py-3 text-center font-jp text-2xl outline-none ring-1 ring-white/10 focus:ring-arcane"
              />
              {typed && <div className="font-jp text-sm opacity-70">→ {toKana(typed)}</div>}
              {phase === 'answer' && (
                <button type="submit" className="rounded-xl bg-arcane px-6 py-2 font-bold text-white">
                  Check
                </button>
              )}
            </form>
          )}

          {ex.kind === 'build-sentence' && (
            <>
              <div className="flex flex-wrap justify-center gap-2">
                {ex.options!.map((tile, i) =>
                  order.includes(i) ? (
                    <span key={i} className="rounded-lg bg-white/5 px-3 py-2 font-jp text-lg opacity-30">
                      {tile}
                    </span>
                  ) : (
                    <button
                      key={i}
                      disabled={phase === 'feedback'}
                      onClick={() => setOrder((o) => [...o, i])}
                      className="rounded-lg bg-white/15 px-3 py-2 font-jp text-lg ring-1 ring-white/15 hover:bg-arcane/30"
                    >
                      {tile}
                    </button>
                  ),
                )}
              </div>
              {phase === 'answer' && (
                <div className="mt-4 text-center">
                  <button
                    disabled={order.length === 0}
                    onClick={() => submit(assembled)}
                    className="rounded-xl bg-arcane px-6 py-2 font-bold text-white disabled:opacity-40"
                  >
                    Check
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* feedback bar */}
      {phase === 'feedback' && (
        <div className={`p-5 ${correct ? 'bg-leaf/20' : 'bg-ember/20'}`}>
          <div className="mx-auto flex max-w-md items-center justify-between gap-4">
            <div>
              <div className={`font-bold ${correct ? 'text-leaf' : 'text-ember'}`}>
                {correct ? '✓ Correct!' : '✗ Not quite'}
              </div>
              {!correct && (
                <div className="text-sm opacity-80">
                  Answer: <span className="font-jp">{ex.answer}</span>
                  {v && ex.kind !== 'meaning' ? ` (${v.romaji} — ${v.en})` : ''}
                </div>
              )}
            </div>
            <button onClick={next} className="rounded-xl bg-arcane px-6 py-3 font-bold text-white">
              Continue
            </button>
          </div>
        </div>
      )}
    </>,
  );
}
