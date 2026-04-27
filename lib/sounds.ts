let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

function isSoundEnabled(): boolean {
  try {
    const s = localStorage.getItem("berserk_settings");
    if (s) {
      const parsed = JSON.parse(s) as { soundEnabled?: boolean };
      return parsed.soundEnabled !== false;
    }
  } catch {}
  return true;
}

function play(fn: (ac: AudioContext) => void) {
  if (typeof window === "undefined") return;
  if (!isSoundEnabled()) return;
  try {
    const ac = getCtx();
    if (ac.state === "suspended") ac.resume();
    fn(ac);
  } catch {}
}

/* ── Helpers ── */
function tone(
  ac: AudioContext,
  freq: number,
  type: OscillatorType,
  startAt: number,
  duration: number,
  gainPeak: number,
  detune = 0
) {
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.connect(gain);
  gain.connect(ac.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(freq, startAt);
  osc.detune.setValueAtTime(detune, startAt);
  gain.gain.setValueAtTime(0, startAt);
  gain.gain.linearRampToValueAtTime(gainPeak, startAt + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, startAt + duration);
  osc.start(startAt);
  osc.stop(startAt + duration + 0.05);
}

/* ── Exported sounds ── */

/** Soft UI click */
export function playClick() {
  play((ac) => {
    tone(ac, 600, "sine", ac.currentTime, 0.08, 0.15);
  });
}

/** Save / confirm success */
export function playSuccess() {
  play((ac) => {
    const t = ac.currentTime;
    tone(ac, 523, "sine", t, 0.12, 0.2);
    tone(ac, 659, "sine", t + 0.1, 0.12, 0.2);
    tone(ac, 784, "sine", t + 0.2, 0.2, 0.25);
  });
}

/** Error / wrong */
export function playError() {
  play((ac) => {
    const t = ac.currentTime;
    tone(ac, 300, "sawtooth", t, 0.1, 0.15);
    tone(ac, 220, "sawtooth", t + 0.1, 0.15, 0.15);
  });
}

/** Start focus session */
export function playFocusStart() {
  play((ac) => {
    const t = ac.currentTime;
    tone(ac, 440, "sine", t, 0.25, 0.25);
    tone(ac, 880, "sine", t + 0.2, 0.35, 0.2);
  });
}

/** End / break focus session */
export function playFocusEnd() {
  play((ac) => {
    const t = ac.currentTime;
    tone(ac, 880, "sine", t, 0.25, 0.2);
    tone(ac, 660, "sine", t + 0.2, 0.25, 0.2);
    tone(ac, 440, "sine", t + 0.4, 0.35, 0.25);
  });
}

/** Challenge completed / achievement */
export function playAchievement() {
  play((ac) => {
    const t = ac.currentTime;
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      tone(ac, freq, "triangle", t + i * 0.1, 0.25, 0.25);
    });
  });
}

/** Notification / alert */
export function playNotification() {
  play((ac) => {
    const t = ac.currentTime;
    tone(ac, 880, "sine", t, 0.1, 0.2);
    tone(ac, 880, "sine", t + 0.15, 0.1, 0.2);
  });
}

/** Level up special */
export function playLevelUp() {
  play((ac) => {
    const t = ac.currentTime;
    const notes = [523, 659, 784, 659, 1047];
    notes.forEach((freq, i) => {
      tone(ac, freq, "triangle", t + i * 0.08, 0.2, 0.3);
      tone(ac, freq * 2, "sine", t + i * 0.08, 0.15, 0.1);
    });
  });
}
