// Renders a Japanese sentence with level-scaled furigana and tappable vocab words.
// Words are tappable in two ways: pre-tagged "learn me" targets (glowing), and any other
// word found in the dictionary by its surface form (a subtle dotted underline).
import type { FuriganaMode, Segment } from '@/content/types';
import { getVocab, lookupSurface } from '@/content/vocab/n5-starter';
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
        const linkedId = seg.vocabId ?? lookupSurface(seg.text)?.id;
        const vocab = linkedId ? getVocab(linkedId) : undefined;
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

        if (linkedId && onWord) {
          const captured = capturedIds.includes(linkedId);
          const highlight = !!seg.vocabId; // explicit targets glow; auto-links stay subtle
          const cls = captured
            ? 'text-leaf'
            : highlight
              ? 'text-mana word-new'
              : 'underline decoration-dotted decoration-white/25 underline-offset-4';
          return (
            <button
              key={i}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onWord(linkedId);
              }}
              className={`ui-interactive rounded px-0.5 align-baseline transition-colors hover:bg-white/10 ${cls}`}
              title="Tap to look up / learn"
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
