// Japanese text-to-speech via the Web Speech API. Zero-asset pronunciation for the
// MVP; recorded VO can replace this later behind the same `speak()` call.
let jaVoice: SpeechSynthesisVoice | null = null;

function supported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

function pickVoice(): void {
  if (!supported()) return;
  const voices = window.speechSynthesis.getVoices();
  jaVoice =
    voices.find((v) => v.lang === 'ja-JP') ?? voices.find((v) => v.lang.startsWith('ja')) ?? null;
}

if (supported()) {
  pickVoice();
  window.speechSynthesis.onvoiceschanged = pickVoice;
}

export function speak(text: string, enabled = true): void {
  if (!enabled || !supported() || !text) return;
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'ja-JP';
  if (jaVoice) utter.voice = jaVoice;
  utter.rate = 0.95;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}

export function ttsAvailable(): boolean {
  return supported();
}
