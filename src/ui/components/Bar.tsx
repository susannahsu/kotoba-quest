interface BarProps {
  label: string;
  value: number;
  max: number;
  color: string;
  width?: number;
}

export function Bar({ label, value, max, color, width = 172 }: BarProps) {
  const pct = max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 0;
  return (
    <div className="flex items-center gap-2 text-[13px]" style={{ width }}>
      <span className="w-8 shrink-0 font-bold opacity-80">{label}</span>
      <div className="h-4 flex-1 overflow-hidden rounded-full bg-black/50 ring-1 ring-white/10">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span className="w-14 shrink-0 text-right tabular-nums opacity-80">
        {Math.round(value)}/{max}
      </span>
    </div>
  );
}
