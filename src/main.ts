import { Game } from './core/Game';
import { GameLoop } from './core/GameLoop';
import { GameState } from './core/GameState';
import './style.css';

if (import.meta.env.DEV || new URLSearchParams(window.location.search).has('debug')) {
  void import('vconsole').then(({ default: VConsole }) => {
    new VConsole({ theme: 'dark' });
  });
}

const game = new Game();
const loop = new GameLoop();

loop.onUpdate = (dt: number): void => game.update(dt);
loop.onRender = (): void => game.render();
loop.start();

game.start();

window.addEventListener('keydown', (e: KeyboardEvent): void => {
  if (e.code !== 'KeyP' && e.code !== 'Escape') return;
  if (game.getState() === GameState.PLAYING) game.pause();
  else game.resume();
});
