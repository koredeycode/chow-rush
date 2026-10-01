import { IDS, formatCurrency, formatHeat, formatRating, formatTime } from './hudConfig';

export interface HudState {
  cash: number;
  heatPercent: number;
  rating: number;
  timeLeft: number;
}

function getEl(id: string): HTMLElement {
  const el = document.getElementById(id);
  if (!el) throw new Error(`[HUD] missing element #${id} — check index.html`);
  return el;
}

export class HUD {
  private readonly cashEl: HTMLElement;
  private readonly heatEl: HTMLElement;
  private readonly ratingEl: HTMLElement;
  private readonly timeEl: HTMLElement;

  constructor() {
    this.cashEl = getEl(IDS.cash);
    this.heatEl = getEl(IDS.heat);
    this.ratingEl = getEl(IDS.rating);
    this.timeEl = getEl(IDS.time);
  }

  update(state: HudState): void {
    this.cashEl.textContent = formatCurrency(state.cash);
    this.heatEl.textContent = formatHeat(state.heatPercent);
    this.ratingEl.textContent = formatRating(state.rating);
    this.timeEl.textContent = formatTime(state.timeLeft);
    this.heatEl.style.color =
      state.heatPercent > 0.66
        ? '#3ddc84'
        : state.heatPercent > 0.33
          ? '#ff9f1c'
          : '#e5383b';
  }
}
