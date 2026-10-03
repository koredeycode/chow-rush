import * as THREE from 'three';
import { LANES } from '../data/bikeConfig';
import {
  BLOCK_HIT_DIST,
  HORN_RADIUS,
  PED_COLOR,
  PED_SPACING,
  POTHOLE_AHEAD,
  VENDOR_COLOR,
  VENDOR_SPACING,
} from '../data/obstacles';
import { logEvent } from '../utils/log';
import { inZone } from './Collision';
import { MarkerPool } from './MarkerPool';

interface Blocker {
  dist: number;
  lane: number;
  kind: 'vendor' | 'ped';
  cleared: boolean;
  struck: boolean;
}

export interface BlockHits {
  vendor: boolean;
  ped: boolean;
}

export class Blockers {
  private readonly vendorPool: MarkerPool;
  private readonly pedPool: MarkerPool;
  private readonly blockers: Blocker[] = [];
  private nextVendor = VENDOR_SPACING;
  private nextPed = PED_SPACING;

  constructor(scene: THREE.Scene) {
    this.vendorPool = new MarkerPool(
      scene,
      new THREE.BoxGeometry(2.5, 2, 2),
      new THREE.MeshStandardMaterial({ color: VENDOR_COLOR }),
      3,
      1,
    );
    this.pedPool = new MarkerPool(
      scene,
      new THREE.BoxGeometry(0.8, 1.8, 0.8),
      new THREE.MeshStandardMaterial({ color: PED_COLOR }),
      3,
      0.9,
    );
  }

  update(trackDist: number, bikeLane: number, horn: boolean): BlockHits {
    const hits: BlockHits = { vendor: false, ped: false };

    while (this.nextVendor < trackDist + POTHOLE_AHEAD) {
      this.blockers.push({
        dist: this.nextVendor,
        lane: Math.floor(Math.random() * LANES.length),
        kind: 'vendor',
        cleared: false,
        struck: false,
      });
      this.nextVendor += VENDOR_SPACING;
    }
    while (this.nextPed < trackDist + POTHOLE_AHEAD) {
      this.blockers.push({
        dist: this.nextPed,
        lane: Math.floor(Math.random() * LANES.length),
        kind: 'ped',
        cleared: false,
        struck: false,
      });
      this.nextPed += PED_SPACING;
    }
    while (
      this.blockers.length > 0 &&
      this.blockers[0].dist < trackDist - 20
    ) {
      this.blockers.shift();
    }

    for (const b of this.blockers) {
      if (b.cleared || b.struck) continue;
      const ahead = b.dist - trackDist;
      if (horn && b.lane === bikeLane && ahead > 0 && ahead < HORN_RADIUS) {
        b.cleared = true;
        logEvent('obstacle', `honked ${b.kind} aside`, {
          dist: Math.round(b.dist),
        });
        continue;
      }
      if (inZone(bikeLane, trackDist, b.lane, b.dist, 0.5, BLOCK_HIT_DIST)) {
        b.struck = true;
        if (b.kind === 'vendor') hits.vendor = true;
        else hits.ped = true;
      }
    }

    this.vendorPool.layout(
      this.blockers.filter((b) => b.kind === 'vendor' && !b.cleared),
      trackDist,
    );
    this.pedPool.layout(
      this.blockers.filter((b) => b.kind === 'ped' && !b.cleared),
      trackDist,
    );
    return hits;
  }
}
