// Story triggers: plays chapter-card cutscenes the first time the player reaches a
// new area. Listens to map:enter (emitted by the world scene) and de-dupes via flags.
import { bus } from '@/bridge/events';
import { useGame } from '@/state/store';

const CHAPTER_BY_MAP: Record<string, { flag: string; cutscene: string }> = {
  forestpath: { flag: 'seen_ch_forest', cutscene: 'ch-forest' },
  roa: { flag: 'seen_ch_roa', cutscene: 'ch-roa' },
};

export function initStory(): () => void {
  return bus.on('map:enter', ({ map }) => {
    const chapter = CHAPTER_BY_MAP[map];
    if (!chapter) return;
    const g = useGame.getState();
    if (g.flags[chapter.flag]) return;
    g.setFlag(chapter.flag);
    bus.emit('cutscene:start', { id: chapter.cutscene });
  });
}
