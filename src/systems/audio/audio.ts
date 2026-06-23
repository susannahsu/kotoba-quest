// Procedural audio: synthesized background music (town + battle) and sound effects,
// generated live with the Web Audio API. Fully original and license-safe — no audio
// files are shipped. Music is muted/unmuted via gain so toggling is instant.
import { useGame } from '@/state/store';

const MASTER_VOL = 0.9;
const MUSIC_VOL = 0.4;
const SFX_VOL = 0.55;

type Note = [beat: number, lenBeats: number, midi: number | number[]];
interface Voice {
  type: OscillatorType;
  gain: number;
  notes: Note[];
}
interface Track {
  bpm: number;
  beats: number;
  voices: Voice[];
}

const midi = (m: number) => 440 * Math.pow(2, (m - 69) / 12);

// I–vi–IV–V, calm and warm.
const TOWN: Track = {
  bpm: 94,
  beats: 8,
  voices: [
    {
      type: 'triangle',
      gain: 0.18,
      notes: [
        [0, 1, 76], [1, 1, 79], [2, 1, 81], [3, 1, 79],
        [4, 1, 76], [5, 1, 72], [6, 2, 74],
      ],
    },
    {
      type: 'sine',
      gain: 0.24,
      notes: [[0, 2, 48], [2, 2, 45], [4, 2, 41], [6, 2, 43]],
    },
    {
      type: 'triangle',
      gain: 0.05,
      notes: [
        [0, 2, [60, 64, 67]], [2, 2, [57, 60, 64]],
        [4, 2, [53, 57, 60]], [6, 2, [55, 59, 62]],
      ],
    },
  ],
};

// Driving A-minor, tenser.
const BATTLE: Track = {
  bpm: 142,
  beats: 8,
  voices: [
    {
      type: 'square',
      gain: 0.1,
      notes: [
        [0, 0.5, 69], [0.5, 0.5, 72], [1, 1, 76], [2, 0.5, 72], [2.5, 0.5, 69],
        [3, 1, 67], [4, 0.5, 65], [4.5, 0.5, 69], [5, 1, 72], [6, 2, 69],
      ],
    },
    {
      type: 'sawtooth',
      gain: 0.12,
      notes: [
        [0, 1, 45], [1, 1, 45], [2, 1, 45], [3, 1, 45],
        [4, 1, 41], [5, 1, 41], [6, 1, 43], [7, 1, 43],
      ],
    },
  ],
};

const TRACKS: Record<string, Track> = { town: TOWN, battle: BATTLE };

class AudioEngine {
  private ctx: AudioContext | null = null;
  private master!: GainNode;
  private musicGain!: GainNode;
  private sfxGain!: GainNode;
  private activeOscs: OscillatorNode[] = [];
  private currentTrack: string | null = null;
  private desiredTrack: string | null = null;
  private token = 0;
  private loopTimer: number | null = null;
  private musicEnabled = true;
  private sfxEnabled = true;

  /** Must be called from a user gesture (browser autoplay policy). Idempotent. */
  init() {
    if (this.ctx) {
      void this.ctx.resume();
      return;
    }
    const Ctor =
      window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;
    this.ctx = new Ctor();
    this.master = this.ctx.createGain();
    this.master.gain.value = MASTER_VOL;
    this.master.connect(this.ctx.destination);
    this.musicGain = this.ctx.createGain();
    this.musicGain.connect(this.master);
    this.sfxGain = this.ctx.createGain();
    this.sfxGain.connect(this.master);

    this.applySettings(useGame.getState().settings);
    useGame.subscribe((s) => this.applySettings(s.settings));

    if (this.desiredTrack) this.playMusic(this.desiredTrack);
  }

  private applySettings(s: { music: boolean; sfx: boolean }) {
    this.musicEnabled = s.music;
    this.sfxEnabled = s.sfx;
    if (!this.ctx) return;
    this.musicGain.gain.setTargetAtTime(s.music ? MUSIC_VOL : 0, this.ctx.currentTime, 0.05);
    this.sfxGain.gain.value = s.sfx ? SFX_VOL : 0;
  }

  playMusic(name: string | null) {
    this.desiredTrack = name;
    if (!this.ctx) return;
    if (this.currentTrack === name) return;
    this.currentTrack = name;
    this.token += 1;
    this.stopActiveOscs();
    if (this.loopTimer) {
      window.clearTimeout(this.loopTimer);
      this.loopTimer = null;
    }
    if (!name) return;
    this.nextLoopTime = this.ctx.currentTime + 0.06;
    this.scheduleLoop();
  }

  private nextLoopTime = 0;

  private scheduleLoop() {
    if (!this.ctx || !this.currentTrack) return;
    const token = this.token;
    const track = TRACKS[this.currentTrack];
    const beatDur = 60 / track.bpm;
    for (const voice of track.voices) {
      for (const [beat, len, m] of voice.notes) {
        const start = this.nextLoopTime + beat * beatDur;
        const dur = len * beatDur * 0.92;
        const notes = Array.isArray(m) ? m : [m];
        for (const n of notes) this.tone(midi(n), start, dur, voice.type, voice.gain, this.musicGain);
      }
    }
    const loopDur = track.beats * beatDur;
    const fireInMs = (this.nextLoopTime - this.ctx.currentTime - 0.05) * 1000;
    this.nextLoopTime += loopDur;
    this.loopTimer = window.setTimeout(() => {
      if (token === this.token) this.scheduleLoop();
    }, Math.max(10, fireInMs));
  }

  private stopActiveOscs() {
    const now = this.ctx?.currentTime ?? 0;
    for (const o of this.activeOscs) {
      try {
        o.stop(now);
      } catch {
        /* already stopped */
      }
    }
    this.activeOscs = [];
  }

  private tone(
    freq: number,
    start: number,
    dur: number,
    type: OscillatorType,
    gain: number,
    dest: GainNode,
  ) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    osc.type = type;
    osc.frequency.value = freq;
    const g = this.ctx.createGain();
    const atk = 0.012;
    const rel = Math.min(0.1, dur * 0.4);
    g.gain.setValueAtTime(0, start);
    g.gain.linearRampToValueAtTime(gain, start + atk);
    g.gain.setValueAtTime(gain, Math.max(start + atk, start + dur - rel));
    g.gain.linearRampToValueAtTime(0, start + dur);
    osc.connect(g).connect(dest);
    osc.start(start);
    osc.stop(start + dur + 0.03);
    if (dest === this.musicGain) {
      this.activeOscs.push(osc);
      osc.onended = () => {
        const i = this.activeOscs.indexOf(osc);
        if (i >= 0) this.activeOscs.splice(i, 1);
      };
    }
  }

  /** Fire-and-forget sound effects. */
  sfx(name: 'cast' | 'correct' | 'wrong' | 'capture' | 'victory' | 'levelup' | 'ui') {
    if (!this.ctx || !this.sfxEnabled) return;
    const t = this.ctx.currentTime;
    const seq = (notes: [number, number, number][], type: OscillatorType = 'triangle') => {
      for (const [m, at, len] of notes) this.tone(midi(m), t + at, len, type, 0.5, this.sfxGain);
    };
    switch (name) {
      case 'cast':
        seq([[72, 0, 0.08], [79, 0.05, 0.1], [84, 0.1, 0.14]], 'triangle');
        break;
      case 'correct':
        seq([[76, 0, 0.1], [80, 0.08, 0.14]], 'triangle');
        break;
      case 'wrong':
        seq([[50, 0, 0.16], [46, 0.08, 0.2]], 'square');
        break;
      case 'capture':
        seq([[72, 0, 0.07], [76, 0.06, 0.07], [79, 0.12, 0.07], [84, 0.18, 0.14]], 'sine');
        break;
      case 'victory':
        seq([[72, 0, 0.12], [76, 0.12, 0.12], [79, 0.24, 0.12], [84, 0.36, 0.3]], 'triangle');
        break;
      case 'levelup':
        seq([[67, 0, 0.1], [72, 0.1, 0.1], [76, 0.2, 0.1], [79, 0.3, 0.1], [84, 0.4, 0.25]], 'sine');
        break;
      case 'ui':
        seq([[84, 0, 0.04]], 'square');
        break;
    }
  }
}

export const audio = new AudioEngine();
