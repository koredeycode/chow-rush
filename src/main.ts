import * as THREE from 'three';
import { Engine } from './core/Engine';
import { GameLoop } from './core/GameLoop';
import './style.css';

if (import.meta.env.DEV || new URLSearchParams(window.location.search).has('debug')) {
  void import('vconsole').then(({ default: VConsole }) => {
    new VConsole({ theme: 'dark' });
  });
}

const engine = new Engine('game-canvas');
const loop = new GameLoop();

const geo = new THREE.BoxGeometry(1, 1, 1);
const mat = new THREE.MeshStandardMaterial({ color: 0xe67e22 });
const cube = new THREE.Mesh(geo, mat);
engine.scene.add(cube);

loop.onUpdate = (dt: number): void => {
  cube.rotation.x += dt;
  cube.rotation.y += dt * 1.2;
};
loop.onRender = (): void => engine.render();
loop.start();
