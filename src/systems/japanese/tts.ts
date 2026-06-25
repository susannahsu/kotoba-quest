// Japanese text-to-speech via the Web Audio Speech API. Each character can have a
// distinct voice via pitch/rate (and a different ja voice where the browser has more
// than one). Zero-asset; recorded VO can replace this later behind the same `speak()`.
export interface VoiceProfile {
  pitch?: number;
  rate?: number;
  voiceIndex?: number; // which ja voice to prefer, when several exist
}

type SpeakArg = boolean | ({ enabled?: boolean } & VoiceProfile);

let jaVoices: SpeechSynthesisVoice[] = [];

function supported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

function pickVoices(): void {
  if (!supported()) return;
  const all = window.speechSynthesis.getVoices();
  jaVoices = all.filter((v) => v.lang === 'ja-JP' || v.lang.startsWith('ja'));
}

if (supported()) {
  pickVoices();
  window.speechSynthesis.onvoiceschanged = pickVoices;
}

export function speak(text: string, arg: SpeakArg = true): void {
  const opts = typeof arg === 'boolean' ? { enabled: arg } : arg;
  const { enabled = true, pitch = 1, rate = 1, voiceIndex = 0 } = opts;
  if (!enabled || !supported() || !text) return;

  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'ja-JP';
  if (jaVoices.length) utter.voice = jaVoices[voiceIndex % jaVoices.length] ?? jaVoices[0];
  utter.pitch = Math.max(0, Math.min(2, pitch));
  utter.rate = Math.max(0.5, Math.min(2, rate * 0.95));
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}

export function ttsAvailable(): boolean {
  return supported();
}
