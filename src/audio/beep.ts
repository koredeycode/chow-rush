let ctx: AudioContext | null = null;

function ac(): AudioContext | null {
  try {
    if (!ctx) {
      const AC =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

export function beep(
  freq: number,
  dur = 0.12,
  type: OscillatorType = 'sine',
  delay = 0,
  gainAmt = 0.2,
): void {
  const c = ac();
  if (!c) return;
  const t = c.currentTime + delay;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(gainAmt, t + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(gain).connect(c.destination);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

export function unlockAudio(): void {
  ac();
}

export function hornHonk(): void {
  beep(370, 0.18, 'sawtooth');
  beep(466, 0.18, 'sawtooth', 0.02);
}

export function pickupDing(): void {
  beep(880, 0.12);
  beep(1320, 0.15, 'sine', 0.08);
}

export function deliverJingle(): void {
  beep(660, 0.1);
  beep(880, 0.1, 'sine', 0.09);
  beep(1320, 0.2, 'sine', 0.18);
}
