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
