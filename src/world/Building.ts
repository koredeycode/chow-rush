import * as THREE from 'three';
import { PALETTE, ROAD_WIDTH, SEGMENT_LENGTH } from '../data/cityConfig';

const unitBox = new THREE.BoxGeometry(1, 1, 1);

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export class Building {
  static createBuilding(): THREE.Mesh {
    const mesh = new THREE.Mesh(
      unitBox,
      new THREE.MeshStandardMaterial({ color: pick(PALETTE) }),
    );
    mesh.castShadow = true;
    Building.randomize(mesh, Math.random() < 0.5 ? -1 : 1);
    return mesh;
  }

  static randomize(mesh: THREE.Mesh, side: 1 | -1): void {
    const w = 3 + Math.random() * 3;
    const h = 4 + Math.random() * 10;
    const d = 3 + Math.random() * 3;
    mesh.scale.set(w, h, d);
    mesh.position.set(
      side * (ROAD_WIDTH / 2 + 2 + Math.random() * 6),
      h / 2,
      (Math.random() - 0.5) * SEGMENT_LENGTH,
    );
    (mesh.material as THREE.MeshStandardMaterial).color.setHex(pick(PALETTE));
  }
}
