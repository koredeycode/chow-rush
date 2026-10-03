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

interface Pothole {
  dist: number;
  lane: number;
  hit: boolean;
}

const POOL_SIZE = 5;

export class ObstacleManager {
  private readonly markers: THREE.Mesh[] = [];
  private readonly holes: Pothole[] = [];
  private nextSpawn = POTHOLE_SPACING;
  private slowTimer = 0;

  constructor(scene: THREE.Scene) {
    const geo = new THREE.CylinderGeometry(1, 1, 0.1, 12);
    const mat = new THREE.MeshStandardMaterial({ color: POTHOLE_COLOR });
    for (let i = 0; i < POOL_SIZE; i++) {
      const m = new THREE.Mesh(geo, mat);
      m.position.y = 0.05;
      m.visible = false;
      this.markers.push(m);
      scene.add(m);
    }
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

    const upcoming = this.holes.filter((h) => h.dist >= trackDist - 5);
    for (let i = 0; i < this.markers.length; i++) {
      const hole = upcoming[i];
      const marker = this.markers[i];
      if (!hole || !marker) continue;
      marker.visible = true;
      marker.position.set(
        LANES[hole.lane],
        0.05,
        -(hole.dist - trackDist),
      );
    }
    for (let i = upcoming.length; i < this.markers.length; i++) {
      const marker = this.markers[i];
      if (marker) marker.visible = false;
    }
  }

  speedMultiplier(): number {
    return this.slowTimer > 0 ? POTHOLE_SLOW_MULT : 1;
  }
}
