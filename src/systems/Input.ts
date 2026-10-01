import { EMPTY_INPUT, type InputState } from '../types/input';

const PREVENT_DEFAULT_CODES = new Set([
  'ArrowLeft',
  'ArrowRight',
  'ArrowUp',
  'ArrowDown',
  'Space',
]);

export class Keyboard {
  private readonly pressed = new Set<string>();
  private readonly onKeyDown: (e: KeyboardEvent) => void;
  private readonly onKeyUp: (e: KeyboardEvent) => void;
  private readonly onBlur: () => void;

  constructor() {
    this.onKeyDown = (e: KeyboardEvent): void => {
      if (PREVENT_DEFAULT_CODES.has(e.code)) e.preventDefault();
      this.pressed.add(e.code);
    };
    this.onKeyUp = (e: KeyboardEvent): void => {
      this.pressed.delete(e.code);
    };
    this.onBlur = (): void => {
      this.pressed.clear();
    };
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('blur', this.onBlur);
  }

  getInput(): InputState {
    const p = this.pressed;
    return {
      ...EMPTY_INPUT,
      left: p.has('ArrowLeft') || p.has('KeyA'),
      right: p.has('ArrowRight') || p.has('KeyD'),
      up: p.has('ArrowUp') || p.has('KeyW'),
      down: p.has('ArrowDown') || p.has('KeyS'),
      hop: p.has('Space'),
      horn: p.has('KeyH'),
      action: p.has('KeyE'),
    };
  }

  dispose(): void {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('blur', this.onBlur);
    this.pressed.clear();
  }
}

export function getCombinedInput(a: InputState, b: InputState): InputState {
  return {
    left: a.left || b.left,
    right: a.right || b.right,
    up: a.up || b.up,
    down: a.down || b.down,
    hop: a.hop || b.hop,
    horn: a.horn || b.horn,
    action: a.action || b.action,
  };
}
