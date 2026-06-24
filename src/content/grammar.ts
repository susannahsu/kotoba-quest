export interface GrammarNote {
  id: string;
  title: string; // the marker/pattern
  titleEn: string;
  explanation: string;
  example: string;
  exampleEn: string;
}

export const GRAMMAR: GrammarNote[] = [
  {
    id: 'wa',
    title: 'は',
    titleEn: 'topic marker',
    explanation: 'は (pronounced "wa" here) marks the topic — what the sentence is about.',
    example: 'わたしは ルーデウスです。',
    exampleEn: 'As for me, I am Rudeus.',
  },
  {
    id: 'wo',
    title: 'を',
    titleEn: 'object marker',
    explanation: 'を (pronounced "o") marks the direct object — the thing an action is done to.',
    example: '本を 読む。',
    exampleEn: 'Read a book.',
  },
  {
    id: 'ga',
    title: 'が',
    titleEn: 'subject marker',
    explanation: 'が marks the subject, often introducing new or specific information.',
    example: '猫が いる。',
    exampleEn: 'There is a cat.',
  },
  {
    id: 'no',
    title: 'の',
    titleEn: 'linking / possessive',
    explanation: 'の links two nouns, often showing possession or type.',
    example: '水の 魔法。',
    exampleEn: 'Water magic (magic of water).',
  },
  {
    id: 'kara',
    title: '〜から',
    titleEn: 'from / because',
    explanation: 'から means "from" (a time or place) or "because".',
    example: '今日から。',
    exampleEn: 'Starting from today.',
  },
  {
    id: 'mashou',
    title: '〜ましょう',
    titleEn: "let's ~",
    explanation: '〜ましょう turns a verb into a friendly suggestion: "let\'s ~".',
    example: '使ってみましょう！',
    exampleEn: "Let's try using it!",
  },
  {
    id: 'desu',
    title: 'です・ます',
    titleEn: 'polite endings',
    explanation: 'です and 〜ます make a sentence polite.',
    example: 'ロキシーです。',
    exampleEn: 'I am Roxy.',
  },
];

export const GRAMMAR_BY_ID: Record<string, GrammarNote> = Object.fromEntries(
  GRAMMAR.map((g) => [g.id, g]),
);

export function getGrammar(id: string): GrammarNote | undefined {
  return GRAMMAR_BY_ID[id];
}
