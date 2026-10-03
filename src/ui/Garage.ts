import { UPGRADES, type UpgradeId } from '../data/upgrades';
import { formatCurrency } from './hudConfig';

export interface GarageData {
  wallet: number;
  levels: Record<UpgradeId, number>;
}

function getEl(id: string): HTMLElement {
  const el = document.getElementById(id);
  if (!el) throw new Error(`[Garage] missing element #${id} — check index.html`);
  return el;
}

export class Garage {
  private readonly el: HTMLElement;
  private shown = false;

  constructor(
    private readonly getData: () => GarageData,
    private readonly onBuy: (id: UpgradeId) => void,
    private readonly onClose: () => void,
  ) {
    this.el = getEl('menu');
  }

  isOpen(): boolean {
    return this.shown;
  }

  show(): void {
    this.shown = true;
    this.render();
    this.el.classList.add('visible');
  }

  hide(): void {
    this.shown = false;
    this.el.classList.remove('visible');
  }

  refresh(): void {
    if (this.shown) this.render();
  }

  private render(): void {
    const d = this.getData();
    this.el.innerHTML = '';
    const card = document.createElement('div');
    card.className = 'garage-card';
    const title = document.createElement('h2');
    title.textContent = 'Garage';
    const wallet = document.createElement('p');
    wallet.textContent = `Wallet: ${formatCurrency(d.wallet)}`;
    card.append(title, wallet);
    for (const def of UPGRADES) {
      const lv = d.levels[def.id];
      const cost = def.costs[lv];
      const row = document.createElement('div');
      row.className = 'garage-row';
      const label = document.createElement('span');
      label.textContent = `${def.name} ${lv}/${def.maxLevel} — ${def.desc}`;
      const btn = document.createElement('button');
      if (cost === undefined) {
        btn.textContent = 'MAX';
        btn.disabled = true;
      } else {
        btn.textContent = `Buy ${formatCurrency(cost)}`;
        btn.disabled = d.wallet < cost;
      }
      btn.addEventListener('click', () => this.onBuy(def.id));
      row.append(label, btn);
      card.appendChild(row);
    }
    const close = document.createElement('button');
    close.textContent = 'Close';
    close.addEventListener('click', () => this.onClose());
    card.appendChild(close);
    this.el.appendChild(card);
  }
}
