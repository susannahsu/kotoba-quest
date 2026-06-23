// Renders a Japanese sentence with level-scaled furigana and tappable vocab words.
// Furigana uses native <ruby>/<rt> (crisp DOM typography). Vocab segments become
// buttons the player can tap to capture into the Grimoire.
import type { FuriganaMode, Segment } from '@/content/types';
import { getVocab } from '@/content/vocab/n5-starter';
import { shouldShowFurigana } from './levels';

interface FuriganaTextProps {
  segments: Segment[];
  mode: FuriganaMode;
  capturedIds?: string[];
  onWord?: (vocabId: string) => void;
  className?: string;
}

export function FuriganaText({
  segments,
  mode,
  capturedIds = [],
  onWord,
  className,
}: FuriganaTextProps) {
  return (
    <span className={className}>
      {segments.map((seg, i) => {
        const vocab = seg.vocabId ? getVocab(seg.vocabId) : undefined;
        const showRuby = shouldShowFurigana(mode, seg, vocab);
        const body =
          showRuby && seg.reading ? (
            <ruby>
              {seg.text}
              <rt>{seg.reading}</rt>
            </ruby>
          ) : (
            seg.text
          );

        if (seg.vocabId) {
          const captured = capturedIds.includes(seg.vocabId);
          const clickable = !!onWord;
          return (
            <button
              key={i}
              type="button"
              disabled={!clickable}
              onClick={(e) => {
                e.stopPropagation();
                onWord?.(seg.vocabId!);
              }}
              className={[
                'ui-interactive rounded px-0.5 align-baseline transition-colors',
                captured ? 'text-leaf' : 'text-mana word-new',
                clickable ? 'cursor-pointer hover:bg-white/10' : 'cursor-default',
              ].join(' ')}
              title={clickable ? 'Tap to learn this word' : undefined}
            >
              {body}
            </button>
          );
        }
        return <span key={i}>{body}</span>;
      })}
    </span>
  );
}
