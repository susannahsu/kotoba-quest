import { createRoot } from 'react-dom/client';
import './styles/index.css';
import { createGame } from '@/game/PhaserGame';
import { App } from '@/ui/App';
import { bus } from '@/bridge/events';
import { useGame } from '@/state/store';
import { roxyIntro } from '@/content/dialogue/roxy-intro';

// Start the Phaser world (renders into #game-root).
createGame();

// Mount the React UI overlay (renders into #ui-root, layered above the canvas).
const uiRoot = document.getElementById('ui-root');
if (uiRoot) {
  createRoot(uiRoot).render(<App />);
}

// Dev-only debug handle (stripped from production builds) for testing overlays.
if (import.meta.env.DEV) {
  (window as Window & typeof globalThis & { __kotoba?: unknown }).__kotoba = {
    bus,
    store: useGame,
    roxyIntro,
  };
}
