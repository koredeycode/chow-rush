import * as THREE from 'three';
import { LANES } from '../data/bikeConfig';
import {
  POTHOLE_AHEAD,
  POTHOLE_COLOR,
  POTHOLE_HIT_DIST,
  POTHOLE_SLOW_MULT,
  POTHOLE_SLOW_TIME,
  POTHOLE_SPACING,
} from '../data/obstacles';
import { logEvent } from '../utils/log';
import { beep } from '../audio/beep';
import { inZone } from './Collision';
import { MarkerPool } from './MarkerPool';

interface Pothole {
  dist: number;
  lane: number;
  hit: boolean;
}

export class Potholes {
  private readonly pool: MarkerPool;
  private readonly holes: Pothole[] = [];
  private nextSpawn = POTHOLE_SPACING;
  private slowTimer = 0;

  constructor(scene: THREE.Scene) {
    this.pool = new MarkerPool(
      scene,
      new THREE.CylinderGeometry(1, 1, 0.1, 12),
      new THREE.MeshStandardMaterial({ color: POTHOLE_COLOR }),
      5,
      0.05,
    );
  }

  update(
    dt: number,
    trackDist: number,
    bikeLane: number,
    airborne: boolean,
  ): void {
    this.slowTimer = Math.max(0, this.slowTimer - dt);

    while (this.nextSpawn < trackDist + POTHOLE_AHEAD) {
      this.holes.push({
        dist: this.nextSpawn,
        lane: Math.floor(Math.random() * LANES.length),
        hit: false,
      });
      this.nextSpawn += POTHOLE_SPACING;
    }
    while (this.holes.length > 0 && this.holes[0].dist < trackDist - 20) {
      this.holes.shift();
    }

    for (const hole of this.holes) {
      if (
        !hole.hit &&
        inZone(bikeLane, trackDist, hole.lane, hole.dist, 0.5, POTHOLE_HIT_DIST)
      ) {
        hole.hit = true;
        if (airborne) {
          logEvent('obstacle', 'hopped pothole', { dist: Math.round(hole.dist) });
        } else {
          this.slowTimer = POTHOLE_SLOW_TIME;
          beep(110, 0.2, 'triangle');
          logEvent('obstacle', 'pothole hit — slowed', {
            dist: Math.round(hole.dist),
          });
        }
      }
    }
    this.pool.layout(this.holes, trackDist);
  }

  speedMultiplier(): number {
    return this.slowTimer > 0 ? POTHOLE_SLOW_MULT : 1;
  }
}
