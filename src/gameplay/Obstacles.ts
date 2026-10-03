import type * as THREE from 'three';
import { HORN_RADIUS } from '../data/obstacles';
import { Blockers, type BlockHits } from './Blockers';
import { Potholes } from './Potholes';

export type { BlockHits };

export class ObstacleManager {
  private readonly potholes: Potholes;
  private readonly blockers: Blockers;

  constructor(scene: THREE.Scene) {
    this.potholes = new Potholes(scene);
    this.blockers = new Blockers(scene);
  }

  update(
    dt: number,
    trackDist: number,
    bikeLane: number,
    airborne: boolean,
    horn: boolean,
    density = 1,
    hornRadius = HORN_RADIUS,
  ): BlockHits {
    this.potholes.update(dt, trackDist, bikeLane, airborne, density);
    return this.blockers.update(trackDist, bikeLane, horn, density, hornRadius);
  }

  speedMultiplier(): number {
    return this.potholes.speedMultiplier();
  }
}
