export type HeatState = 'hot' | 'warm' | 'cold';

const HOT_THRESHOLD = 0.66;
const WARM_THRESHOLD = 0.33;

export class HeatMeter {
  private maxHeat = 0;
  private currentHeat = 0;

  reset(capacity: number, multiplier = 1): void {
    this.maxHeat = Math.max(0, capacity * multiplier);
    this.currentHeat = this.maxHeat;
  }

  update(dt: number): void {
    this.currentHeat = Math.max(0, this.currentHeat - dt);
  }

  getPercent(): number {
    if (this.maxHeat <= 0) return 0;
    return this.currentHeat / this.maxHeat;
  }

  getState(): HeatState {
    const p = this.getPercent();
    if (p > HOT_THRESHOLD) return 'hot';
    if (p > WARM_THRESHOLD) return 'warm';
    return 'cold';
  }

  getTipMultiplier(): number {
    const state = this.getState();
    if (state === 'hot') return 1.0;
    if (state === 'warm') return 0.5;
    return 0.0;
  }
}
