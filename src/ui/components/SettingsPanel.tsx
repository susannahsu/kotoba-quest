import type { ReactNode } from 'react';
import { useGame } from '@/state/store';
import { JP_LEVEL_ORDER, LEVEL_PRESETS } from '@/systems/japanese/levels';
import type { FuriganaMode } from '@/content/types';

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm">{label}</span>
      {children}
    </div>
  );
}

function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <Row label={label}>
      <button
        onClick={() => onChange(!value)}
        className={`h-6 w-11 rounded-full p-0.5 transition ${value ? 'bg-arcane' : 'bg-white/15'}`}
        role="switch"
        aria-checked={value}
      >
        <span
          className={`block h-5 w-5 rounded-full bg-white transition ${value ? 'translate-x-5' : ''}`}
        />
      </button>
    </Row>
  );
}

export function SettingsPanel({ onClose }: { onClose: () => void }) {
  const settings = useGame((s) => s.settings);
  const update = useGame((s) => s.updateSettings);
  const resetSave = useGame((s) => s.resetSave);

  return (
    <div
      className="ui-interactive absolute inset-0 z-30 grid place-items-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="panel-scroll flex max-h-[85vh] w-[24rem] max-w-[92vw] flex-col gap-4 overflow-y-auto rounded-2xl bg-ink p-5 shadow-2xl ring-1 ring-arcane/40"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">⚙ Settings</h2>
          <button onClick={onClose} className="rounded px-2 py-1 text-sm opacity-70 hover:bg-white/10">
            ✕
          </button>
        </div>

        <div>
          <div className="mb-1 text-sm font-bold">Japanese level</div>
          <div className="grid grid-cols-2 gap-2">
            {JP_LEVEL_ORDER.map((lvl) => {
              const active = settings.jpLevel === lvl;
              return (
                <button
                  key={lvl}
                  onClick={() => update({ jpLevel: lvl })}
                  className={`rounded-lg p-2 text-left text-xs ring-1 transition ${
                    active ? 'bg-arcane/30 ring-arcane' : 'bg-white/5 ring-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="font-bold">{LEVEL_PRESETS[lvl].label}</div>
                  <div className="opacity-60">{LEVEL_PRESETS[lvl].desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        <Row label="Furigana">
          <select
            value={settings.furigana}
            onChange={(e) => update({ furigana: e.target.value as FuriganaMode })}
            className="rounded bg-white/10 px-2 py-1 text-sm"
          >
            <option value="all">All kanji</option>
            <option value="smart">Hard words only</option>
            <option value="off">Off</option>
          </select>
        </Row>

        <Toggle label="Romaji" value={settings.romaji} onChange={(v) => update({ romaji: v })} />
        <Toggle label="Voice (audio)" value={settings.audio} onChange={(v) => update({ audio: v })} />
        <Toggle label="Dark mode" value={settings.darkMode} onChange={(v) => update({ darkMode: v })} />

        <Row label="Text speed">
          <input
            type="range"
            min={8}
            max={60}
            value={settings.textSpeed}
            onChange={(e) => update({ textSpeed: Number(e.target.value) })}
          />
        </Row>

        <button
          onClick={() => {
            if (confirm('Erase your save and return to the title?')) {
              resetSave();
              onClose();
            }
          }}
          className="mt-2 rounded-lg bg-ember/20 py-2 text-sm text-ember ring-1 ring-ember/40 hover:bg-ember/30"
        >
          Reset save
        </button>
      </div>
    </div>
  );
}
