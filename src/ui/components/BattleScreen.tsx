import { useEffect, useMemo, useRef, useState } from 'react';
import { toKana } from 'wanakana';
import type { Challenge } from '@/content/types';
import { useGame } from '@/state/store';
import { getEnemy } from '@/content/enemies';
import { getVocab } from '@/content/vocab/n5-starter';
import { checkAnswer, damageFor, makeChallenge } from '@/systems/combat/challenges';
import { MANA_BOLT, MP_COST, SPELLS } from '@/systems/combat/spells';
import { speak } from '@/systems/japanese/tts';
import { Bar } from './Bar';

const DURATION = 9000;
const FAST_WINDOW = 4000;

type Phase = 'prompt' | 'result' | 'win' | 'lose';

interface ResultInfo {
  correct: boolean;
  dmg?: number;
  taken?: number;
  spellJp?: string;
  spellEn?: string;
  color?: string;
  chant?: string;
  fast?: boolean;
  answer?: string;
}

export function BattleScreen({
  enemyId,
  onEnd,
}: {
  enemyId: string;
  onEnd: (won: boolean) => void;
}) {
  const enemy = getEnemy(enemyId)!;

  const hp = useGame((s) => s.hp);
  const maxHp = useGame((s) => s.maxHp);
  const mp = useGame((s) => s.mp);
  const maxMp = useGame((s) => s.maxMp);
  const grimoire = useGame((s) => s.grimoire);

  const deck = useMemo(() => (grimoire.length ? grimoire : enemy.deck), [grimoire, enemy]);

  const [enemyHp, setEnemyHp] = useState(enemy.maxHp);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [result, setResult] = useState<ResultInfo | null>(null);
  const [phase, setPhase] = useState<Phase>('prompt');
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [typed, setTyped] = useState('');

  const enemyHpRef = useRef(enemy.maxHp);
  const timeLeftRef = useRef(DURATION);
  const timerRef = useRef<number | null>(null);
  const answeredRef = useRef(false);
  const resolveRef = useRef<(raw: string) => void>(() => {});
  const inputRef = useRef<HTMLInputElement>(null);

  const clearTimer = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startTimer = () => {
    clearTimer();
    timeLeftRef.current = DURATION;
    setTimeLeft(DURATION);
    timerRef.current = window.setInterval(() => {
      timeLeftRef.current -= 100;
      setTimeLeft(timeLeftRef.current);
      if (timeLeftRef.current <= 0) {
        clearTimer();
        resolveRef.current('');
      }
    }, 100);
  };

  const nextChallenge = () => {
    const id = deck[Math.floor(Math.random() * deck.length)];
    answeredRef.current = false;
    setChallenge(makeChallenge(id));
    setTyped('');
    setResult(null);
    setPhase('prompt');
    startTimer();
  };

  useEffect(() => {
    nextChallenge();
    return () => clearTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // focus the kana input when one appears
  useEffect(() => {
    if (challenge?.kind === 'typeKana') inputRef.current?.focus();
  }, [challenge]);

  const resolve = (raw: string) => {
    if (answeredRef.current || !challenge) return;
    answeredRef.current = true;
    clearTimer();

    const fast = timeLeftRef.current > DURATION - FAST_WINDOW;
    const correct = checkAnswer(challenge, raw);
    const g = useGame.getState();
    g.answer(challenge.vocabId, correct, fast);
    const v = getVocab(challenge.vocabId)!;

    if (correct) {
      const spell = v.element ? SPELLS[v.element] : MANA_BOLT;
      const dmg = damageFor(spell.base, g.masteryOf(challenge.vocabId), fast);
      g.spendMp(MP_COST);
      const newHp = Math.max(0, enemyHpRef.current - dmg);
      enemyHpRef.current = newHp;
      setEnemyHp(newHp);
      setResult({
        correct: true,
        dmg,
        spellJp: spell.nameJp,
        spellEn: spell.nameEn,
        color: spell.color,
        chant: v.chant,
        fast,
      });
      speak(v.chant ?? v.reading, g.settings.audio);
      setPhase('result');
      if (newHp <= 0) {
        g.gainXp(enemy.xp);
        window.setTimeout(() => setPhase('win'), 1100);
      } else {
        window.setTimeout(nextChallenge, 1200);
      }
    } else {
      g.damage(enemy.power);
      setResult({ correct: false, taken: enemy.power, answer: challenge.answer });
      setPhase('result');
      const lethal = useGame.getState().hp <= 0;
      window.setTimeout(() => (lethal ? setPhase('lose') : nextChallenge()), 1300);
    }
  };
  resolveRef.current = resolve;

  const v = challenge ? getVocab(challenge.vocabId) : undefined;
  const showFuriganaOnPrompt = challenge?.kind === 'meaning';
  const timerPct = Math.max(0, (timeLeft / DURATION) * 100);
  const kanaPreview = typed ? toKana(typed) : '';

  return (
    <div className="ui-interactive absolute inset-0 z-40 flex flex-col items-center justify-between bg-gradient-to-b from-[#1a1426f5] to-[#0c0a12f5] p-6">
      {/* Enemy */}
      <div className="mt-2 flex flex-col items-center gap-2">
        <div className="relative h-20 w-20 animate-pulse">
          <div className="absolute inset-0 rounded-[45%] bg-arcane shadow-[0_0_34px_rgba(157,107,255,0.6)]" />
          <div className="absolute left-4 top-8 h-3 w-3 rounded-full bg-yellow-300" />
          <div className="absolute right-4 top-8 h-3 w-3 rounded-full bg-yellow-300" />
        </div>
        <div className="font-jp text-lg font-bold">
          {enemy.nameJp} <span className="text-sm opacity-60">{enemy.name}</span>
        </div>
        <Bar label="" value={enemyHp} max={enemy.maxHp} color="#d9544f" width={260} />
      </div>

      {/* Center */}
      <div className="flex w-full max-w-md flex-col items-center">
        {phase === 'win' && (
          <div className="flex animate-pop-in flex-col items-center gap-3 text-center">
            <div className="font-jp text-4xl font-bold text-leaf">勝利！</div>
            <div className="text-lg">
              Victory! <span className="opacity-70">+{enemy.xp} XP</span>
            </div>
            <button
              onClick={() => onEnd(true)}
              className="rounded-xl bg-arcane px-6 py-3 font-bold text-white hover:bg-arcane/90"
            >
              Continue ▶
            </button>
          </div>
        )}

        {phase === 'lose' && (
          <div className="flex animate-pop-in flex-col items-center gap-3 text-center">
            <div className="font-jp text-4xl font-bold text-ember">やられた…</div>
            <div className="text-sm opacity-80">Roxy heals you. Try again!</div>
            <button
              onClick={() => {
                const g = useGame.getState();
                g.heal(g.maxHp);
                onEnd(false);
              }}
              className="rounded-xl bg-white/10 px-6 py-3 font-bold hover:bg-white/20"
            >
              Continue
            </button>
          </div>
        )}

        {(phase === 'prompt' || phase === 'result') && challenge && v && (
          <>
            <div className="mb-3 h-1.5 w-full overflow-hidden rounded bg-white/10">
              <div
                className="h-full bg-mana transition-all duration-100 ease-linear"
                style={{ width: `${timerPct}%` }}
              />
            </div>
            <div className="text-xs uppercase tracking-wide opacity-60">{challenge.promptLabel}</div>
            <div className="my-3 font-jp text-6xl font-bold">
              {showFuriganaOnPrompt ? (
                <ruby>
                  {v.jp}
                  <rt className="text-xl">{v.reading}</rt>
                </ruby>
              ) : (
                v.jp
              )}
            </div>

            {phase === 'result' && result && (
              <div className="mb-2 animate-pop-in text-center">
                {result.correct ? (
                  <div style={{ color: result.color }}>
                    <div className="font-jp text-2xl font-bold">{result.spellJp}！</div>
                    <div className="text-sm opacity-90">
                      {result.chant && `「${result.chant}」 · `}
                      {result.spellEn} −{result.dmg}
                      {result.fast && ' ⚡ fast!'}
                    </div>
                  </div>
                ) : (
                  <div className="text-ember">
                    <div className="text-xl font-bold">Miss! −{result.taken} HP</div>
                    <div className="text-sm opacity-80">answer: {result.answer}</div>
                  </div>
                )}
              </div>
            )}

            {phase === 'prompt' && challenge.kind !== 'typeKana' && (
              <div className="grid w-full grid-cols-2 gap-2">
                {challenge.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => resolve(opt)}
                    className="rounded-xl bg-white/10 px-4 py-3 font-jp text-lg ring-1 ring-white/10 transition hover:bg-arcane/30"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {phase === 'prompt' && challenge.kind === 'typeKana' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  resolve(typed);
                }}
                className="flex w-full flex-col items-center gap-1"
              >
                <div className="flex w-full gap-2">
                  <input
                    ref={inputRef}
                    value={typed}
                    onChange={(e) => setTyped(e.target.value)}
                    placeholder="type romaji or kana…"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    className="flex-1 rounded-xl bg-white/10 px-4 py-3 font-jp text-lg outline-none ring-1 ring-white/10 focus:ring-arcane"
                  />
                  <button type="submit" className="rounded-xl bg-arcane px-5 font-bold text-white">
                    Cast
                  </button>
                </div>
                {kanaPreview && <div className="font-jp text-sm opacity-70">→ {kanaPreview}</div>}
              </form>
            )}
          </>
        )}
      </div>

      {/* Player */}
      <div className="mb-2 flex w-full max-w-md flex-col items-center gap-1">
        <Bar label="HP" value={hp} max={maxHp} color="#ff6b6b" width={260} />
        <Bar label="MP" value={mp} max={maxMp} color="#5b8cff" width={260} />
        <div className="mt-1 text-[11px] opacity-50">
          Answer correctly to cast · faster + higher mastery = stronger
        </div>
      </div>
    </div>
  );
}
