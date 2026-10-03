import * as THREE from 'three';
import { ZONES } from '../data/zones';

function box(
  w: number,
  h: number,
  d: number,
  color: number,
  x = 0,
  y = 0,
): THREE.Mesh {
  const m = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, d),
    new THREE.MeshStandardMaterial({ color }),
  );
  m.position.set(x, y, 0);
  return m;
}

function arch(color: number): THREE.Group {
  const g = new THREE.Group();
  g.add(box(1.5, 9, 1.5, color, -7, 4.5));
  g.add(box(1.5, 9, 1.5, color, 7, 4.5));
  g.add(box(16, 1.5, 1.5, color, 0, 9.5));
  return g;
}

function overheadBeam(color: number): THREE.Group {
  const g = new THREE.Group();
  g.add(box(2, 7, 2, color, -8, 3.5));
  g.add(box(2, 7, 2, color, 8, 3.5));
  g.add(box(20, 2, 6, color, 0, 8));
  return g;
}

function mall(color: number): THREE.Group {
  const g = new THREE.Group();
  g.add(box(14, 8, 10, color, 16, 4));
  g.add(box(14, 1, 10, 0xf5f5f5, 16, 8.5));
  return g;
}

function tower(color: number): THREE.Group {
  const g = new THREE.Group();
  g.add(box(3, 22, 3, color, -10, 11));
  g.add(box(8, 1.5, 1.5, color, -10, 22.5));
  return g;
}

function gate(color: number, trim: number): THREE.Group {
  const g = new THREE.Group();
  g.add(box(2, 10, 2, color, -7, 5));
  g.add(box(2, 10, 2, color, 7, 5));
  g.add(box(16, 2, 2, trim, 0, 10.5));
  return g;
}

const BUILDERS: Record<string, () => THREE.Group> = {
  yaba: () => arch(0xc96f2f),
  ojuelegba: () => overheadBeam(0x9c9c9c),
  ikeja: () => mall(0x7fb3c8),
  vi: () => tower(0xd9d9d9),
  lekki: () => gate(0x2e6b34, 0xd9a441),
};

const VIEW_AHEAD = 300;
const VIEW_BEHIND = 30;

export class Landmarks {
  private readonly items: Array<{ dist: number; group: THREE.Group }> = [];

  constructor(scene: THREE.Scene) {
    for (const zone of ZONES) {
      const build = BUILDERS[zone.id] ?? (() => arch(0x9c9c9c));
      const group = build();
      group.visible = false;
      this.items.push({ dist: zone.startDist, group });
      scene.add(group);
    }
  }

  update(trackDist: number): void {
    for (const item of this.items) {
      const ahead = item.dist - trackDist;
      item.group.visible = ahead > -VIEW_BEHIND && ahead < VIEW_AHEAD;
      item.group.position.z = -ahead;
    }
  }
}
