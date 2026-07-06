const SOUND_SRC = "/music/sonido-shopify.mp3";

let audio: HTMLAudioElement | null = null;
let lastPlayAt = 0;

function ensureAudio(): HTMLAudioElement {
  if (!audio) {
    audio = new Audio(SOUND_SRC);
    audio.preload = "auto";
  }
  return audio;
}

/** Call synchronously from a click handler so playback is allowed later. */
export function unlockSuccessSound(): void {
  if (typeof window === "undefined") return;

  const el = ensureAudio();
  el.muted = true;
  el.loop = true;
  el.volume = 1;
  el.currentTime = 0;
  void el.play().catch(() => {});
}

/** Play once when the success screen mounts. */
export function playSuccessSoundOnce(): void {
  if (typeof window === "undefined") return;

  const now = Date.now();
  if (now - lastPlayAt < 400) return;
  lastPlayAt = now;

  const el = ensureAudio();
  el.loop = false;
  el.muted = false;
  el.volume = 1;
  el.currentTime = 0;

  void el.play().catch(() => {
    el.load();
    void el.play().catch(() => {});
  });
}
