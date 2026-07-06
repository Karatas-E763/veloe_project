const SOUND_PATH = "/music/sonido-shopify.mp3";

type AudioContextCtor = typeof AudioContext;

let audioContext: AudioContext | null = null;
let audioBuffer: AudioBuffer | null = null;
let bufferPromise: Promise<AudioBuffer | null> | null = null;
let domAudio: HTMLAudioElement | null = null;
let armed = false;
let unlockSession = 0;
let playedSession = -1;

function resolveSoundUrl(): string {
  if (typeof window === "undefined") return SOUND_PATH;
  return new URL(SOUND_PATH, window.location.origin).href;
}

function getAudioContextCtor(): AudioContextCtor | null {
  if (typeof window === "undefined") return null;
  return (
    window.AudioContext ||
    (window as Window & { webkitAudioContext?: AudioContextCtor })
      .webkitAudioContext ||
    null
  );
}

function getContext(): AudioContext | null {
  if (audioContext) return audioContext;
  const Ctor = getAudioContextCtor();
  if (!Ctor) return null;
  audioContext = new Ctor();
  return audioContext;
}

function getDomAudio(): HTMLAudioElement {
  if (!domAudio && typeof document !== "undefined") {
    domAudio = document.createElement("audio");
    domAudio.src = resolveSoundUrl();
    domAudio.preload = "auto";
    domAudio.setAttribute("playsinline", "true");
    domAudio.style.cssText =
      "position:fixed;width:0;height:0;opacity:0;pointer-events:none";
    document.body.appendChild(domAudio);
  }
  return domAudio as HTMLAudioElement;
}

function loadBuffer(): Promise<AudioBuffer | null> {
  if (audioBuffer) return Promise.resolve(audioBuffer);
  if (!bufferPromise) {
    bufferPromise = (async () => {
      try {
        const response = await fetch(resolveSoundUrl(), { cache: "default" });
        if (!response.ok) return null;

        const data = await response.arrayBuffer();
        const ctx = getContext();
        if (!ctx) return null;

        const buffer = await ctx.decodeAudioData(data.slice(0));
        audioBuffer = buffer;
        return buffer;
      } catch {
        return null;
      }
    })();
  }
  return bufferPromise;
}

function startMutedKeepAlive(): void {
  const el = getDomAudio();
  el.src = resolveSoundUrl();
  el.muted = true;
  el.loop = true;
  el.volume = 1;
  el.currentTime = 0;
  void el.play().catch(() => {});
}

function stopMutedKeepAlive(): void {
  if (!domAudio) return;
  domAudio.loop = false;
  domAudio.pause();
  domAudio.muted = false;
  domAudio.currentTime = 0;
}

/** Call synchronously from a click handler so playback is allowed later. */
export function unlockSuccessSound(): void {
  if (typeof window === "undefined") return;

  armed = true;
  unlockSession += 1;

  const ctx = getContext();
  if (ctx) {
    void ctx.resume();
  }

  void loadBuffer();
  startMutedKeepAlive();
}

async function tryWebAudioPlay(): Promise<boolean> {
  const buffer = await loadBuffer();
  const ctx = getContext();
  if (!buffer || !ctx) return false;

  if (ctx.state === "suspended") {
    try {
      await ctx.resume();
    } catch {
      return false;
    }
  }

  try {
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.start(0);
    stopMutedKeepAlive();
    return true;
  } catch {
    return false;
  }
}

async function tryDomAudioPlay(): Promise<boolean> {
  const el = getDomAudio();
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

async function attemptPlay(): Promise<boolean> {
  if (!armed) return false;
  if (await tryWebAudioPlay()) return true;
  return tryDomAudioPlay();
}

/** Play once when the success screen mounts. Retries handle async save delays. */
export function playSuccessSoundOnce(): void {
  if (typeof window === "undefined" || !armed) return;
  if (playedSession === unlockSession) return;

  const session = unlockSession;

  void (async () => {
    for (let attempt = 0; attempt < 12; attempt++) {
      if (session !== unlockSession || !armed) return;

      if (await attemptPlay()) {
        playedSession = session;
        armed = false;
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  })();
}

/** Play when the admin panel receives new or updated registrations. */
export function playAdminNotificationSound(): void {
  if (typeof window === "undefined") return;

  const ctx = getContext();
  if (ctx) {
    void ctx.resume();
  }

  void (async () => {
    await loadBuffer();

    for (let attempt = 0; attempt < 12; attempt++) {
      if (await tryWebAudioPlay()) return;
      if (await tryDomAudioPlay()) return;
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  })();
}

/** Warm cache on first user interaction anywhere in the flow. */
export function warmSuccessSound(): void {
  if (typeof window === "undefined") return;
  void loadBuffer();
}
