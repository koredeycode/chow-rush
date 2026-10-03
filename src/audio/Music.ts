import { beep, unlockAudio } from './beep';
import { logEvent } from '../utils/log';

const STEP = 0.125;
const BAR_MS = 2000;
const KICK = [0, 4, 8, 12, 14];
const SNARE = [4, 12];
const HATS = [2, 6, 10, 14];
const BASS: Array<readonly [number, number]> = [
  [0, 55],
  [3, 55],
  [6, 65.4],
  [10, 55],
  [12, 82.4],
  [14, 65.4],
];

export class Music {
  private timer = 0;
  playing = false;

  constructor() {
    const unlock = (): void => unlockAudio();
    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });
  }

  start(): void {
    if (this.playing) return;
    this.playing = true;
    this.scheduleBar();
    this.timer = window.setInterval(() => this.scheduleBar(), BAR_MS);
    logEvent('audio', 'music started (120 BPM groove, M to mute)');
  }

  stop(): void {
    this.playing = false;
    window.clearInterval(this.timer);
  }

  toggle(): void {
    if (this.playing) {
      this.stop();
      logEvent('audio', 'music muted');
    } else {
      this.start();
    }
  }

  private scheduleBar(): void {
    if (!this.playing) return;
    for (const s of KICK) beep(120, 0.14, 'sine', s * STEP, 0.5);
    for (const s of SNARE) beep(190, 0.1, 'triangle', s * STEP, 0.3);
    for (const s of HATS) beep(7000, 0.03, 'sine', s * STEP, 0.06);
    for (const [s, f] of BASS) beep(f, 0.2, 'sine', s * STEP, 0.35);
  }
}
