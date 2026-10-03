import { LEVELS } from '../data/economy';
import type { UpgradeId } from '../data/upgrades';

export enum GameState {
  MENU,
  PLAYING,
  PAUSED,
  RESULTS,
}

export interface BestScore {
  cash: number;
  xp: number;
}

const BEST_KEY = 'chowrush_best';

export class State {
  current: GameState = GameState.MENU;

  setState(next: GameState): void {
    this.current = next;
  }

  isPlaying(): boolean {
    return this.current === GameState.PLAYING;
  }
}

export function loadBest(): BestScore {
  try {
    const raw = localStorage.getItem(BEST_KEY);
    if (!raw) return { cash: 0, xp: 0 };
    const parsed = JSON.parse(raw) as Partial<BestScore>;
    return {
      cash: typeof parsed.cash === 'number' ? parsed.cash : 0,
      xp: typeof parsed.xp === 'number' ? parsed.xp : 0,
    };
  } catch {
    return { cash: 0, xp: 0 };
  }
}

export function saveBest(cash: number, xp: number): BestScore {
  const prev = loadBest();
  const next = { cash: Math.max(prev.cash, cash), xp: Math.max(prev.xp, xp) };
  try {
    localStorage.setItem(BEST_KEY, JSON.stringify(next));
  } catch {
    // Private mode — best persists for session only.
  }
  return next;
}

export interface Progress {
  wallet: number;
  totalXp: number;
  upgrades: Record<UpgradeId, number>;
}

const PROGRESS_KEY = 'chowrush_progress';

export function defaultProgress(): Progress {
  return { wallet: 0, totalXp: 0, upgrades: { engine: 0, thermal: 0, horn: 0 } };
}

export function loadProgress(): Progress {
  const base = defaultProgress();
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return base;
    const parsed = JSON.parse(raw) as Partial<Progress>;
    return {
      wallet: typeof parsed.wallet === 'number' ? parsed.wallet : 0,
      totalXp: typeof parsed.totalXp === 'number' ? parsed.totalXp : 0,
      upgrades: { ...base.upgrades, ...parsed.upgrades },
    };
  } catch {
    return base;
  }
}

export function saveProgress(p: Progress): void {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(p));
  } catch {
    // Private mode — progress persists for session only.
  }
}

export function levelForXp(xp: number): number {
  let level = 1;
  for (const [lvl, need] of Object.entries(LEVELS)) {
    if (xp >= (need as number)) level = Number(lvl);
  }
  return level;
}
