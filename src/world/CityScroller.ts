import * as THREE from 'three';
import {
  BUILDING_COUNT,
  SEGMENT_COUNT,
  SEGMENT_LENGTH,
} from '../data/cityConfig';
import { Building } from './Building';
import { Road } from './Road';

const RECYCLE_Z = 30;

export class CityScroller {
  private readonly segments: THREE.Group[] = [];
  private readonly buildings: THREE.Mesh[][] = [];
  private trackDistance = 0;

  init(scene: THREE.Scene): void {
    for (let i = 0; i < SEGMENT_COUNT; i++) {
      const group = new THREE.Group();
      group.position.z = -i * SEGMENT_LENGTH;

      const road = new Road();
      group.add(road.group);

      const batch: THREE.Mesh[] = [];
      for (let b = 0; b < BUILDING_COUNT; b++) {
        const mesh = Building.createBuilding();
        batch.push(mesh);
        group.add(mesh);
      }
      this.buildings.push(batch);
      this.segments.push(group);
      scene.add(group);
    }
  }

  update(dt: number, speed: number): void {
    this.trackDistance += speed * dt;
    for (let i = 0; i < this.segments.length; i++) {
      const group = this.segments[i];
      group.position.z += speed * dt;
      if (group.position.z > RECYCLE_Z) {
        group.position.z -= SEGMENT_COUNT * SEGMENT_LENGTH;
        for (const mesh of this.buildings[i]) {
          Building.randomize(mesh, mesh.position.x < 0 ? -1 : 1);
        }
      }
    }
  }

  getTrackDistance(): number {
    return this.trackDistance;
  }
}
