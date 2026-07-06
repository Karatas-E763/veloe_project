const SOUND_SRC = "/music/sonido-shopify.mp3";

let htmlAudio: HTMLAudioElement | null = null;
let audioContext: AudioContext | null = null;
let audioBuffer: AudioBuffer | null = null;
let preloadPromise: Promise<void> | null = null;
let gestureUnlocked = false;

function getHtmlAudio(): HTMLAudioElement {
  if (!htmlAudio) {
    htmlAudio = new Audio(SOUND_SRC);
    htmlAudio.preload = "auto";
  }
  return htmlAudio;
}

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
}

function preloadSound(): Promise<void> {
  if (preloadPromise) return preloadPromise;

  preloadPromise = (async () => {
    if (typeof window === "undefined") return;

    const el = getHtmlAudio();
    el.load();

    try {
      const response = await fetch(SOUND_SRC, { cache: "force-cache" });
      if (!response.ok) return;

      const data = await response.arrayBuffer();
      const ctx = getAudioContext();
      audioBuffer = await ctx.decodeAudioData(data.slice(0));
    } catch {
      // HTML audio fallback remains available.
    }
  })();

  return preloadPromise;
}

function stopMutedKeepAlive(): void {
  if (!htmlAudio) return;
  htmlAudio.loop = false;
  htmlAudio.pause();
  htmlAudio.muted = false;
  htmlAudio.currentTime = 0;
}

/** Call synchronously from a click handler so playback is allowed later. */
export function unlockSuccessSound(): void {
  if (typeof window === "undefined") return;

  gestureUnlocked = true;

  const ctx = getAudioContext();
  void ctx.resume();
  void preloadSound();

  const el = getHtmlAudio();
  el.muted = true;
  el.loop = true;
  el.volume = 1;
  el.currentTime = 0;
  void el.play().catch(() => {});
}

async function playWithWebAudio(): Promise<boolean> {
  if (!gestureUnlocked || !audioBuffer) return false;

  const ctx = getAudioContext();
  if (ctx.state === "suspended") {
    await ctx.resume();
  }

  const source = ctx.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(ctx.destination);
  source.start(0);
  stopMutedKeepAlive();
  return true;
}

async function playWithHtmlAudio(): Promise<boolean> {
  const el = getHtmlAudio();
  el.loop = false;
  el.pause();
  el.muted = false;
  el.volume = 1;
  el.currentTime = 0;

  try {
    await el.play();
    return true;
  } catch {
    el.load();
    try {
      await el.play();
      return true;
    } catch {
      return false;
    }
  }
}

/** Play once when the success screen mounts. */
export function playSuccessSoundOnce(): void {
  if (typeof window === "undefined") return;

  void (async () => {
    await preloadSound();

    if (await playWithWebAudio()) return;
    await playWithHtmlAudio();
  })();
}

/** Warm cache on first user interaction anywhere in the flow. */
export function warmSuccessSound(): void {
  if (typeof window === "undefined") return;
  void preloadSound();
}
