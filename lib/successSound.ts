let audio: HTMLAudioElement | null = null;

function getAudio(): HTMLAudioElement {
  if (!audio) {
    audio = new Audio("/music/sonido-shopify.mp3");
    audio.preload = "auto";
  }
  return audio;
}

/** Call synchronously from a click handler so playback is allowed later. */
export function unlockSuccessSound(): void {
  if (typeof window === "undefined") return;

  const el = getAudio();
  el.currentTime = 0;
  el.volume = 0.01;

  void el.play().then(
    () => {
      el.pause();
      el.currentTime = 0;
      el.volume = 1;
    },
    () => {
      el.volume = 1;
    }
  );
}

/** Play once when the success screen mounts. */
export function playSuccessSoundOnce(): void {
  if (typeof window === "undefined") return;

  const el = getAudio();
  el.currentTime = 0;
  el.volume = 1;
  void el.play().catch(() => {});
}
