export interface Objective {
  id: string;
  text: string;
  flag: string; // store flag set when complete
}

export interface Quest {
  id: string;
  title: string;
  titleJp: string;
  desc: string;
  objectives: Objective[];
  xp: number;
}

export const QUESTS: Quest[] = [
  {
    id: 'first-steps',
    title: 'First Steps',
    titleJp: 'はじめの一歩',
    desc: 'Begin your new life in Buena Village — learn magic, prove yourself, and make a friend.',
    objectives: [
      { id: 'learn', text: 'Learn your first words from Roxy', flag: 'q_learn' },
      { id: 'beast', text: 'Defeat a Mana Beast', flag: 'q_beast' },
      { id: 'friend', text: 'Befriend Sylphiette in the forest', flag: 'q_friend' },
    ],
    xp: 30,
  },
  {
    id: 'to-roa',
    title: 'The Sword City',
    titleJp: '剣の街',
    desc: 'Follow the forest path east to the town of Roa and meet the Boreas swordfolk.',
    objectives: [
      { id: 'reach', text: 'Reach the town of Roa', flag: 'q_roa_reached' },
      { id: 'eris', text: 'Meet Eris', flag: 'q_eris' },
      { id: 'ghislaine', text: 'Meet Ghislaine the swordmaster', flag: 'q_ghislaine' },
    ],
    xp: 40,
  },
];
