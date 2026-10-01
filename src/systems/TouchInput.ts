import { EMPTY_INPUT, type InputState } from '../types/input';

const SWIPE_HOP_PX = 30;
const HOP_PULSE_MS = 150;

function ensureButtons(container: HTMLElement): void {
  const defs: Array<[string, string]> = [
    ['touch-hop', 'Hop'],
    ['touch-horn', 'Horn'],
    ['touch-action', 'Go'],
  ];
  for (const [id, label] of defs) {
    if (!document.getElementById(id)) {
      const btn = document.createElement('button');
      btn.id = id;
      btn.textContent = label;
      btn.style.touchAction = 'none';
      container.appendChild(btn);
    }
  }
}

export class Touch {
  private readonly state: InputState = { ...EMPTY_INPUT };
  private readonly zoneById = new Map<number, 'left' | 'right' | 'up'>();
  private readonly btnById = new Map<number, 'hop' | 'horn' | 'action'>();
  private readonly startYById = new Map<number, number>();
  private readonly container: HTMLElement | null;
  private hopTimer = 0;

  private readonly onTouchStart: (e: TouchEvent) => void;
  private readonly onTouchEnd: (e: TouchEvent) => void;
  private readonly onBlur: () => void;

  constructor() {
    this.container = document.getElementById('touch-controls');
    if (this.container) ensureButtons(this.container);
    const canvas = document.getElementById('game-canvas');
    if (canvas) canvas.style.touchAction = 'none';

    this.onTouchStart = (e: TouchEvent): void => {
      const target = e.target as HTMLElement | null;
      if (target?.closest?.('#__vconsole')) return;
      e.preventDefault();
      const w = window.innerWidth;
      for (const t of Array.from(e.changedTouches)) {
        const el = document.elementFromPoint(t.clientX, t.clientY) as HTMLElement | null;
        const btnId = el?.id ?? '';
        if (btnId === 'touch-hop' || btnId === 'touch-horn' || btnId === 'touch-action') {
          const kind = btnId === 'touch-hop' ? 'hop' : btnId === 'touch-horn' ? 'horn' : 'action';
          this.btnById.set(t.identifier, kind);
          this.state[kind] = true;
          continue;
        }
        this.startYById.set(t.identifier, t.clientY);
        if (t.clientX < w / 3) {
          this.zoneById.set(t.identifier, 'left');
          this.state.left = true;
        } else if (t.clientX > (2 * w) / 3) {
          this.zoneById.set(t.identifier, 'right');
          this.state.right = true;
        } else {
          this.zoneById.set(t.identifier, 'up');
          this.state.up = true;
        }
      }
    };

    this.onTouchEnd = (e: TouchEvent): void => {
      const target = e.target as HTMLElement | null;
      if (target?.closest?.('#__vconsole')) return;
      e.preventDefault();
      let swiped = false;
      for (const t of Array.from(e.changedTouches)) {
        const startY = this.startYById.get(t.identifier);
        if (startY !== undefined && startY - t.clientY > SWIPE_HOP_PX) {
          swiped = true;
        }
        this.startYById.delete(t.identifier);
        const zone = this.zoneById.get(t.identifier);
        this.zoneById.delete(t.identifier);
        if (zone === 'left') this.state.left = this.hasZone('left');
        if (zone === 'right') this.state.right = this.hasZone('right');
        if (zone === 'up') this.state.up = this.hasZone('up');
        const btn = this.btnById.get(t.identifier);
        this.btnById.delete(t.identifier);
        if (btn === 'hop') this.state.hop = this.hasBtn('hop');
        if (btn === 'horn') this.state.horn = this.hasBtn('horn');
        if (btn === 'action') this.state.action = this.hasBtn('action');
      }
      const remaining = e.touches.length;
      if (remaining === 0 && !swiped) {
        this.state.hop = this.hasBtn('hop');
        this.state.horn = this.hasBtn('horn');
        this.state.action = this.hasBtn('action');
      }
      if (swiped) this.pulseHop();
    };

    this.onBlur = (): void => {
      this.clear();
    };

    window.addEventListener('touchstart', this.onTouchStart, { passive: false });
    window.addEventListener('touchend', this.onTouchEnd, { passive: false });
    window.addEventListener('touchcancel', this.onTouchEnd, { passive: false });
    window.addEventListener('blur', this.onBlur);
  }

  getInput(): InputState {
    return { ...this.state };
  }

  dispose(): void {
    window.removeEventListener('touchstart', this.onTouchStart);
    window.removeEventListener('touchend', this.onTouchEnd);
    window.removeEventListener('touchcancel', this.onTouchEnd);
    window.removeEventListener('blur', this.onBlur);
    window.clearTimeout(this.hopTimer);
    this.clear();
  }

  private hasZone(zone: 'left' | 'right' | 'up'): boolean {
    for (const z of this.zoneById.values()) {
      if (z === zone) return true;
    }
    return false;
  }

  private pulseHop(): void {
    this.state.hop = true;
    window.clearTimeout(this.hopTimer);
    this.hopTimer = window.setTimeout(() => {
      this.state.hop = this.hasBtn('hop');
    }, HOP_PULSE_MS);
  }

  private clear(): void {
    this.state.left = false;
    this.state.right = false;
    this.state.up = false;
    this.state.down = false;
    this.state.hop = false;
    this.state.horn = false;
    this.state.action = false;
    this.zoneById.clear();
    this.btnById.clear();
    this.startYById.clear();
  }

  private hasBtn(kind: 'hop' | 'horn' | 'action'): boolean {
    for (const b of this.btnById.values()) {
      if (b === kind) return true;
    }
    return false;
  }
}
