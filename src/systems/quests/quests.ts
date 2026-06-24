// Quest tracking: listens to world events and ticks off objectives via store flags,
// awarding XP when a quest is fully complete. UI reads the same flags (see QuestLog).
import { bus } from '@/bridge/events';
import { useGame } from '@/state/store';
import { QUESTS } from '@/content/quests';

function checkQuests() {
  const g = useGame.getState();
  for (const q of QUESTS) {
    const allDone = q.objectives.every((o) => g.flags[o.flag]);
    if (allDone && !g.flags[`${q.id}_rewarded`]) {
      g.setFlag(`${q.id}_rewarded`);
      g.gainXp(q.xp);
      bus.emit('toast', { text: `Quest complete — ${q.title}! +${q.xp} XP`, tone: 'good' });
    }
  }
}

function complete(flag: string) {
  const g = useGame.getState();
  if (g.flags[flag]) return;
  g.setFlag(flag);
  checkQuests();
}

export function initQuests(): () => void {
  const offs = [
    bus.on('dialogue:end', ({ tag }) => {
      if (tag === 'roxy-intro') complete('q_learn');
      if (tag === 'sylphie') complete('q_friend');
      if (tag === 'eris') complete('q_eris');
      if (tag === 'ghislaine') complete('q_ghislaine');
    }),
    bus.on('battle:end', ({ won }) => {
      if (won) complete('q_beast');
    }),
    bus.on('map:enter', ({ map }) => {
      if (map === 'roa') complete('q_roa_reached');
    }),
  ];
  return () => offs.forEach((o) => o());
}
