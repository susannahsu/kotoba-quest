export interface ToastItem {
  id: string;
  text: string;
  tone?: 'info' | 'good' | 'bad';
}

const TONE: Record<NonNullable<ToastItem['tone']>, string> = {
  info: 'bg-ink/90 ring-white/15',
  good: 'bg-leaf/90 ring-white/20 text-ink',
  bad: 'bg-ember/90 ring-white/20 text-ink',
};

export function Toasts({ items }: { items: ToastItem[] }) {
  return (
    <div className="pointer-events-none absolute left-1/2 top-4 flex -translate-x-1/2 flex-col items-center gap-2">
      {items.map((t) => (
        <div
          key={t.id}
          className={`animate-float-up rounded-lg px-4 py-2 text-sm font-medium shadow-lg ring-1 backdrop-blur ${
            TONE[t.tone ?? 'info']
          }`}
        >
          {t.text}
        </div>
      ))}
    </div>
  );
}
