import { useEffect, useState } from 'react';
import { bus } from '@/bridge/events';
import { useGame } from '@/state/store';
import { audio } from '@/systems/audio/audio';
import { initQuests } from '@/systems/quests/quests';
import type { DialogueLine } from '@/content/types';
import { HUD } from './components/HUD';
import { DialogueBox } from './components/DialogueBox';
import { BattleScreen } from './components/BattleScreen';
import { Grimoire } from './components/Grimoire';
import { SettingsPanel } from './components/SettingsPanel';
import { TrainingScreen } from './components/TrainingScreen';
import { QuestLog } from './components/QuestLog';
import { TitleScreen } from './components/TitleScreen';
import { WordPopup } from './components/WordPopup';
import { Toasts, type ToastItem } from './components/Toasts';

type Menu = 'grimoire' | 'settings' | 'training' | 'quests' | null;

export function App() {
  const started = useGame((s) => s.started);
  const darkMode = useGame((s) => s.settings.darkMode);
  const [dialogue, setDialogue] = useState<{ lines: DialogueLine[]; tag?: string } | null>(null);
  const [battle, setBattle] = useState<{ enemyId: string; instanceId?: string } | null>(null);
  const [word, setWord] = useState<string | null>(null);
  const [menu, setMenu] = useState<Menu>(null);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => initQuests(), []);

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
      {started && !dialogue && !battle && <HUD onOpenMenu={setMenu} />}

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

      {word && (
        <WordPopup
          vocabId={word}
          onClose={() => {
            setWord(null);
            bus.emit('dialogue:end', { tag: 'word' });
          }}
        />
      )}

      {!started && <TitleScreen />}

      <Toasts items={toasts} />
    </>
  );
}
