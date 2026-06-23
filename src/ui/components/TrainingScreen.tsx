// Daily Training — the spaced-repetition review (FSRS). New words are introduced gently
// as "study" cards (see everything, no test); known words are reviewed as flashcards you
// grade yourself on. This is the low-pressure repetition that helps words stick.
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useGame } from '@/state/store';
import { VOCAB, getVocab } from '@/content/vocab/n5-starter';
import { isDue, type Grade } from '@/systems/srs/srs';
import { speak } from '@/systems/japanese/tts';
import { audio } from '@/systems/audio/audio';

const NEW_PER_SESSION = 6;
const REVIEW_CAP = 12;

interface Item {
  id: string;
  isNew: boolean;
}

const GRADES: { g: Grade; jp: string; en: string; cls: string }[] = [
  { g: 'again', jp: 'もう一回', en: 'Again', cls: 'bg-ember/30 text-ember ring-ember/40' },
  { g: 'hard', jp: 'むずい', en: 'Hard', cls: 'bg-yellow-500/20 text-yellow-300 ring-yellow-500/40' },
  { g: 'good', jp: 'できた', en: 'Good', cls: 'bg-mana/25 text-mana ring-mana/40' },
  { g: 'easy', jp: 'かんたん', en: 'Easy', cls: 'bg-leaf/25 text-leaf ring-leaf/40' },
];

export function TrainingScreen({ onClose }: { onClose: () => void }) {
  const grimoire = useGame((s) => s.grimoire);
  const mastery = useGame((s) => s.mastery);
  const voiceOn = useGame((s) => s.settings.audio);
  const capture = useGame((s) => s.capture);
  const grade = useGame((s) => s.grade);
  const gainXp = useGame((s) => s.gainXp);

  // Build the session once when the screen opens.
  const session = useMemo<Item[]>(() => {
    const due = grimoire
      .filter((id) => mastery[id] && isDue(mastery[id].card))
      .slice(0, REVIEW_CAP)
      .map((id) => ({ id, isNew: false }));
    const fresh = VOCAB.filter((v) => !grimoire.includes(v.id))
      .slice(0, NEW_PER_SESSION)
      .map((v) => ({ id: v.id, isNew: true }));
    return [...fresh, ...due];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const finished = session.length > 0 && idx >= session.length;

  useEffect(() => {
    if (finished) {
      gainXp(session.length * 3);
      audio.sfx('levelup');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

  const wrap = (body: ReactNode) => (
    <div
      className="ui-interactive absolute inset-0 z-30 grid place-items-center bg-black/70"
      onClick={onClose}
    >
      <div
        className="w-[26rem] max-w-[92vw] rounded-2xl bg-ink p-6 shadow-2xl ring-1 ring-arcane/40"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-jp text-xl font-bold">
            🧠 Daily Training <span className="text-sm opacity-60">特訓</span>
          </h2>
          <button onClick={onClose} className="rounded px-2 py-1 text-sm opacity-70 hover:bg-white/10">
            ✕
          </button>
        </div>
        {session.length > 0 && !finished && (
          <div className="mb-4 h-1.5 overflow-hidden rounded bg-white/10">
            <div
              className="h-full bg-arcane transition-all"
              style={{ width: `${(idx / session.length) * 100}%` }}
            />
          </div>
        )}
        {body}
      </div>
    </div>
  );

  if (session.length === 0) {
    return wrap(
      <div className="py-6 text-center">
        <div className="text-lg">All caught up! 🎉</div>
        <p className="mt-2 text-sm opacity-60">
          Learn more words in the world (tap glowing words, read signs), then come back to review.
        </p>
        <button onClick={onClose} className="mt-5 rounded-xl bg-arcane px-6 py-2 font-bold text-white">
          Done
        </button>
      </div>,
    );
  }

  if (finished) {
    return wrap(
      <div className="py-6 text-center">
        <div className="font-jp text-3xl font-bold text-leaf">お疲れさま！</div>
        <p className="mt-2 text-sm opacity-80">
          Reviewed {session.length} {session.length === 1 ? 'word' : 'words'}. +{session.length * 3} XP
        </p>
        <button onClick={onClose} className="mt-5 rounded-xl bg-arcane px-6 py-2 font-bold text-white">
          Done
        </button>
      </div>,
    );
  }

  const item = session[idx];
  const v = getVocab(item.id)!;
  const advance = () => {
    setRevealed(false);
    setIdx((i) => i + 1);
  };
  const learnNew = () => {
    capture(item.id);
    audio.sfx('capture');
    advance();
  };
  const doGrade = (g: Grade) => {
    grade(item.id, g);
    audio.sfx(g === 'again' ? 'wrong' : 'correct');
    advance();
  };

  // New word → gentle study card (registration first, no test).
  if (item.isNew) {
    return wrap(
      <div className="text-center">
        <div className="mb-1 text-xs uppercase tracking-wide text-leaf">✨ New word</div>
        <div className="font-jp text-5xl font-bold">
          <ruby>
            {v.jp}
            <rt className="text-xl">{v.reading}</rt>
          </ruby>
        </div>
        <div className="mt-1 text-sm opacity-70">{v.romaji}</div>
        <div className="mt-3 text-lg">{v.en}</div>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="rounded bg-mana/20 px-2 py-0.5 text-mana">{v.jlpt}</span>
          <span className="rounded bg-white/10 px-2 py-0.5 opacity-80">{v.pos}</span>
          {v.element && <span className="rounded bg-arcane/30 px-2 py-0.5">spell · {v.element}</span>}
        </div>
        <div className="mt-5 flex gap-2">
          <button
            onClick={() => speak(v.reading, voiceOn)}
            className="flex-1 rounded-xl bg-white/10 py-2.5 text-sm hover:bg-white/20"
          >
            🔊 Listen
          </button>
          <button
            onClick={learnNew}
            className="flex-1 rounded-xl bg-arcane py-2.5 font-bold text-white hover:bg-arcane/90"
          >
            覚えた · Learn it
          </button>
        </div>
      </div>,
    );
  }

  // Review card → recall, reveal, then self-grade.
  return wrap(
    <div className="text-center">
      <div className="mb-1 text-xs uppercase tracking-wide opacity-60">Do you remember it?</div>
      <div className="font-jp text-6xl font-bold">{revealed ? (
        <ruby>
          {v.jp}
          <rt className="text-2xl">{v.reading}</rt>
        </ruby>
      ) : (
        v.jp
      )}</div>

      {revealed ? (
        <>
          <div className="mt-1 text-sm opacity-70">{v.romaji}</div>
          <div className="mt-2 text-lg">{v.en}</div>
          <button
            onClick={() => speak(v.reading, voiceOn)}
            className="mt-3 rounded-lg bg-white/10 px-3 py-1 text-xs hover:bg-white/20"
          >
            🔊 Listen
          </button>
          <div className="mt-5 grid grid-cols-4 gap-2">
            {GRADES.map(({ g, jp, en, cls }) => (
              <button
                key={g}
                onClick={() => doGrade(g)}
                className={`rounded-lg py-2 text-xs ring-1 transition hover:brightness-125 ${cls}`}
              >
                <div className="font-jp font-bold">{jp}</div>
                <div className="opacity-70">{en}</div>
              </button>
            ))}
          </div>
        </>
      ) : (
        <button
          onClick={() => {
            setRevealed(true);
            speak(v.reading, voiceOn);
          }}
          className="mt-6 rounded-xl bg-arcane px-6 py-2.5 font-bold text-white hover:bg-arcane/90"
        >
          答えを見る · Show answer
        </button>
      )}
    </div>,
  );
}
