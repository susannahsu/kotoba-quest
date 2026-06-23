import { useEffect, useState } from 'react';
import { bus } from '@/bridge/events';
import { useGame } from '@/state/store';
import type { DialogueLine } from '@/content/types';
import { HUD } from './components/HUD';
import { DialogueBox } from './components/DialogueBox';
import { BattleScreen } from './components/BattleScreen';
import { Grimoire } from './components/Grimoire';
import { SettingsPanel } from './components/SettingsPanel';
import { TitleScreen } from './components/TitleScreen';
import { Toasts, type ToastItem } from './components/Toasts';

type Menu = 'grimoire' | 'settings' | null;

export function App() {
  const started = useGame((s) => s.started);
  const darkMode = useGame((s) => s.settings.darkMode);
  const [dialogue, setDialogue] = useState<{ lines: DialogueLine[]; tag?: string } | null>(null);
  const [battle, setBattle] = useState<{ enemyId: string } | null>(null);
  const [menu, setMenu] = useState<Menu>(null);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    const offs = [
      bus.on('dialogue:start', (p) => setDialogue(p)),
      bus.on('battle:start', (p) => setBattle(p)),
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
            const enemyId = battle.enemyId;
            setBattle(null);
            bus.emit('battle:end', { won, enemyId });
          }}
        />
      )}

      {menu === 'grimoire' && <Grimoire onClose={() => setMenu(null)} />}
      {menu === 'settings' && <SettingsPanel onClose={() => setMenu(null)} />}

      {!started && <TitleScreen />}

      <Toasts items={toasts} />
    </>
  );
}
