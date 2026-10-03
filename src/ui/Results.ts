import { formatCurrency, formatRating } from './hudConfig';

export interface ResultsData {
  cash: number;
  xp: number;
  rating: number;
  deliveries: number;
}

function getEl(id: string): HTMLElement {
  const el = document.getElementById(id);
  if (!el) throw new Error(`[Results] missing element #${id} — check index.html`);
  return el;
}

export class Results {
  private readonly el: HTMLElement;
  private readonly lines: HTMLParagraphElement;
  private shown = false;

  constructor(onRestart: () => void, onGarage?: () => void) {
    this.el = getEl('results');
    const card = document.createElement('div');
    card.className = 'results-card';
    const title = document.createElement('h2');
    title.textContent = 'Shift over';
    this.lines = document.createElement('p');
    const button = document.createElement('button');
    button.textContent = 'Drive again';
    button.addEventListener('click', () => {
      this.hide();
      onRestart();
    });
    card.append(title, this.lines, button);
    if (onGarage) {
      const garageBtn = document.createElement('button');
      garageBtn.textContent = 'Garage 🛠';
      garageBtn.addEventListener('click', () => onGarage());
      card.appendChild(garageBtn);
    }
    this.el.appendChild(card);
  }

  show(d: ResultsData): void {
    if (this.shown) return;
    this.shown = true;
    this.lines.textContent =
      `${formatCurrency(d.cash)} · ${d.deliveries} deliveries · ` +
      `⭐ ${formatRating(d.rating)} · ${d.xp} XP`;
    this.el.classList.add('visible');
  }

  hide(): void {
    this.shown = false;
    this.el.classList.remove('visible');
  }
}
