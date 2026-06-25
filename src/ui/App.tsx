import { useEffect, useState } from 'react';
import { bus } from '@/bridge/events';
import { useGame } from '@/state/store';
import { audio } from '@/systems/audio/audio';
import { initQuests } from '@/systems/quests/quests';
import { initStory } from '@/systems/story/story';
import type { DialogueLine } from '@/content/types';
import { getCutscene, type Beat } from '@/content/cutscenes';
import { HUD } from './components/HUD';
import { DialogueBox } from './components/DialogueBox';
import { BattleScreen } from './components/BattleScreen';
import { Grimoire } from './components/Grimoire';
import { SettingsPanel } from './components/SettingsPanel';
import { TrainingScreen } from './components/TrainingScreen';
import { QuestLog } from './components/QuestLog';
import { GrammarPanel } from './components/GrammarPanel';
import { LearnHub } from './components/LearnHub';
import { LessonScreen } from './components/LessonScreen';
import { Minimap } from './components/Minimap';
import { WorldMap } from './components/WorldMap';
import { TitleScreen } from './components/TitleScreen';
import { WordPopup } from './components/WordPopup';
import { CutsceneScreen } from './components/CutsceneScreen';
import { TouchControls } from './components/TouchControls';
import { Toasts, type ToastItem } from './components/Toasts';

type Menu =
  | 'grimoire'
  | 'settings'
  | 'training'
  | 'quests'
  | 'grammar'
  | 'worldmap'
  | 'learn'
  | 'lesson'
  | null;

export function App() {
  const started = useGame((s) => s.started);
  const darkMode = useGame((s) => s.settings.darkMode);
  const dyslexia = useGame((s) => s.settings.dyslexiaFont);
  const touchControls = useGame((s) => s.settings.touchControls);
  const showTouch =
    touchControls || (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0);
  const [dialogue, setDialogue] = useState<{ lines: DialogueLine[]; tag?: string } | null>(null);
  const [battle, setBattle] = useState<{ enemyId: string; instanceId?: string } | null>(null);
  const [word, setWord] = useState<string | null>(null);
  const [cutscene, setCutscene] = useState<{ id: string; beats: Beat[] } | null>(null);
  const [menu, setMenu] = useState<Menu>(null);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    document.documentElement.classList.toggle('easy-read', dyslexia);
  }, [dyslexia]);

  // Esc closes any open menu / popup.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenu(null);
        setWord(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => initQuests(), []);
  useEffect(() => initStory(), []);

  // Initialise audio on the first user gesture (browser autoplay policy).
  useEffect(() => {
    const start = () => {
      audio.init();
      if (useGame.getState().started) audio.playMusic('town');
      window.removeEventListener('pointerdown', start);
      window.removeEventListener('keydown', start);
    };
    window.addEventListener('pointerdown', start);
    window.addEventListener('keydown', start);
    return () => {
      window.removeEventListener('pointerdown', start);
      window.removeEventListener('keydown', start);
    };
  }, []);

  useEffect(() => {
    const offs = [
      bus.on('dialogue:start', (p) => setDialogue(p)),
      bus.on('battle:start', (p) => {
        setBattle(p);
        audio.playMusic('battle');
      }),
      bus.on('word:show', (p) => setWord(p.vocabId)),
      bus.on('grammar:open', () => setMenu('grammar')),
      bus.on('cutscene:start', ({ id }) => {
        const cs = getCutscene(id);
        if (cs) setCutscene({ id, beats: cs.beats });
      }),
      bus.on('toast', (t) => {
        const id = Math.random().toString(36).slice(2);
        setToasts((prev) => [...prev, { id, ...t }]);
        window.setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 3400);
      }),
    ];
    return () => offs.forEach((off) => off());
  }, []);

  return (
    <>
      {started && !dialogue && !battle && !cutscene && <HUD onOpenMenu={setMenu} />}
      {started && !dialogue && !battle && !cutscene && <Minimap />}
      {started && !dialogue && !battle && !cutscene && showTouch && <TouchControls />}

      {dialogue && (
        <DialogueBox
          lines={dialogue.lines}
          onDone={() => {
            const tag = dialogue.tag;
            setDialogue(null);
            bus.emit('dialogue:end', { tag });
          }}
        />
      )}

      {battle && (
        <BattleScreen
          enemyId={battle.enemyId}
          onEnd={(won) => {
            const { enemyId, instanceId } = battle;
            setBattle(null);
            audio.playMusic('town');
            bus.emit('battle:end', { won, enemyId, instanceId });
          }}
        />
      )}

      {menu === 'grimoire' && <Grimoire onClose={() => setMenu(null)} />}
      {menu === 'settings' && <SettingsPanel onClose={() => setMenu(null)} />}
      {menu === 'training' && <TrainingScreen onClose={() => setMenu(null)} />}
      {menu === 'quests' && <QuestLog onClose={() => setMenu(null)} />}
      {menu === 'grammar' && <GrammarPanel onClose={() => setMenu(null)} />}
      {menu === 'worldmap' && <WorldMap onClose={() => setMenu(null)} />}
      {menu === 'learn' && <LearnHub onClose={() => setMenu(null)} onStart={() => setMenu('lesson')} />}
      {menu === 'lesson' && <LessonScreen onClose={() => setMenu('learn')} />}

      {word && (
        <WordPopup
          vocabId={word}
          onClose={() => {
            setWord(null);
            bus.emit('dialogue:end', { tag: 'word' });
          }}
        />
      )}

      {cutscene && (
        <CutsceneScreen
          beats={cutscene.beats}
          onDone={() => {
            const id = cutscene.id;
            setCutscene(null);
            bus.emit('cutscene:end', { id });
          }}
        />
      )}

      {!started && <TitleScreen />}

      <Toasts items={toasts} />
    </>
  );
}
