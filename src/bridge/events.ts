// Typed event bus bridging the Phaser world and the React UI.
// Phaser emits world events the UI reacts to (dialogue, battles); the UI emits
// resolutions the world reacts to. Decoupled + easy to test (no Phaser import here).
import type { DialogueLine } from '@/content/types';

export type GameEvents = {
  'dialogue:start': { lines: DialogueLine[]; tag?: string };
  'dialogue:end': { tag?: string };
  'battle:start': { enemyId: string };
  'battle:end': { won: boolean; enemyId: string };
  'toast': { text: string; tone?: 'info' | 'good' | 'bad' };
  'game:start': undefined;
};

type Listener<T> = (payload: T) => void;

class TypedEmitter<Events extends Record<string, unknown>> {
  private listeners: { [K in keyof Events]?: Set<Listener<Events[K]>> } = {};

  on<K extends keyof Events>(event: K, fn: Listener<Events[K]>): () => void {
    const set = (this.listeners[event] ??= new Set<Listener<Events[K]>>());
    set.add(fn);
    return () => this.off(event, fn);
  }

  off<K extends keyof Events>(event: K, fn: Listener<Events[K]>): void {
    this.listeners[event]?.delete(fn);
  }

  emit<K extends keyof Events>(event: K, payload: Events[K]): void {
    this.listeners[event]?.forEach((fn) => fn(payload));
  }
}

export const bus = new TypedEmitter<GameEvents>();
