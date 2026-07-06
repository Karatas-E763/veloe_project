let audioContext: AudioContext | null = null;
let audioBuffer: AudioBuffer | null = null;
let bufferPromise: Promise<AudioBuffer> | null = null;
let htmlAudio: HTMLAudioElement | null = null;
let armed = false;

function getHtmlAudio(): HTMLAudioElement {
  if (!htmlAudio) {
    htmlAudio = new Audio("/music/sonido-shopify.mp3");
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

function loadAudioBuffer(): Promise<AudioBuffer> {
  if (audioBuffer) return Promise.resolve(audioBuffer);
  if (!bufferPromise) {
    const ctx = getAudioContext();
    bufferPromise = fetch("/music/sonido-shopify.mp3")
      .then((res) => {
        if (!res.ok) throw new Error("Sound file not found");
        return res.arrayBuffer();
      })
      .then((data) => ctx.decodeAudioData(data))
      .then((buffer) => {
        audioBuffer = buffer;
        return buffer;
      });
  }
  return bufferPromise;
}

/** Call synchronously from a click handler so playback is allowed later. */
export function unlockSuccessSound(): void {
  if (typeof window === "undefined") return;

  armed = true;

  const ctx = getAudioContext();
  void ctx.resume();
  void loadAudioBuffer();

  const el = getHtmlAudio();
  el.loop = true;
  el.muted = true;
  el.volume = 1;
  el.currentTime = 0;
  void el.play().catch(() => {});
}

function stopMutedKeepAlive(): void {
  if (!htmlAudio) return;
  htmlAudio.loop = false;
  htmlAudio.pause();
  htmlAudio.muted = false;
  htmlAudio.currentTime = 0;
}

function playWithWebAudio(): Promise<void> {
  const ctx = getAudioContext();
  return loadAudioBuffer().then((buffer) => {
    if (ctx.state === "suspended") {
      return ctx.resume().then(() => buffer);
    }
    return buffer;
  }).then((buffer) => {
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.start(0);
  });
}

function playWithHtmlAudio(): Promise<void> {
  stopMutedKeepAlive();
  const el = getHtmlAudio();
  el.volume = 1;
  return el.play().then(() => undefined);
}

/** Play once when the success screen mounts. */
export function playSuccessSoundOnce(): void {
  if (typeof window === "undefined" || !armed) return;

  armed = false;

  void playWithWebAudio()
    .catch(() => playWithHtmlAudio())
    .catch(() => {
      stopMutedKeepAlive();
    });
}
