import * as THREE from 'three';
import { LANES } from '../data/bikeConfig';

export interface MarkItem {
  dist: number;
  lane: number;
}

export class MarkerPool {
  private readonly meshes: THREE.Mesh[] = [];

  constructor(
    scene: THREE.Scene,
    geo: THREE.BufferGeometry,
    mat: THREE.Material,
    count: number,
    private readonly y: number,
  ) {
    for (let i = 0; i < count; i++) {
      const m = new THREE.Mesh(geo, mat);
      m.position.y = y;
      m.visible = false;
      this.meshes.push(m);
      scene.add(m);
    }
  }

  layout(items: MarkItem[], trackDist: number): void {
    const upcoming = items.filter((h) => h.dist >= trackDist - 5);
    for (let i = 0; i < this.meshes.length; i++) {
      const item = upcoming[i];
      const marker = this.meshes[i];
      if (!item || !marker) continue;
      marker.visible = true;
      marker.position.set(LANES[item.lane], this.y, -(item.dist - trackDist));
    }
    for (let i = upcoming.length; i < this.meshes.length; i++) {
      const marker = this.meshes[i];
      if (marker) marker.visible = false;
    }
  }
}
