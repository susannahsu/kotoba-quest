// Dictionary lookup. For the vertical slice this reads the bundled starter deck;
// later this is where a jmdict-simplified subset gets wired in for full hover lookup.
import type { VocabEntry } from '@/content/types';
import { getVocab } from '@/content/vocab/n5-starter';

export function lookup(id: string): VocabEntry | undefined {
  return getVocab(id);
}
