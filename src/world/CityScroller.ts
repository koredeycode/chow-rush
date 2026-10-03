import * as THREE from 'three';
import {
  BUILDING_COUNT,
  SEGMENT_COUNT,
  SEGMENT_LENGTH,
} from '../data/cityConfig';
import { ZONES, zoneIndexAt } from '../data/zones';
import { logEvent } from '../utils/log';
import { Building } from './Building';
import { Landmarks } from './Landmarks';
import { Road } from './Road';

const RECYCLE_Z = 30;
const FOG_LERP_RATE = 1.0;

export class CityScroller {
  private readonly segments: THREE.Group[] = [];
  private readonly buildings: THREE.Mesh[][] = [];
  private trackDistance = 0;
  private landmarks: Landmarks | null = null;
  private scene: THREE.Scene | null = null;
  private zoneIndex = 0;
  private readonly fogTarget = new THREE.Color(ZONES[0].fogColor);

  init(scene: THREE.Scene): void {
    this.scene = scene;
    this.landmarks = new Landmarks(scene);
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
    this.landmarks?.update(this.trackDistance);

    const zoneIdx = zoneIndexAt(this.trackDistance);
    if (zoneIdx !== this.zoneIndex) {
      this.zoneIndex = zoneIdx;
      const zone = ZONES[zoneIdx];
      this.fogTarget.setHex(zone.fogColor);
      logEvent('zone', `entered ${zone.name}`, {
        traffic: zone.traffic,
        density: zone.density,
      });
    }
    if (this.scene?.fog instanceof THREE.Fog) {
      this.scene.fog.color.lerp(this.fogTarget, 1 - Math.exp(-FOG_LERP_RATE * dt));
    }
    if (this.scene?.background instanceof THREE.Color) {
      this.scene.background.lerp(this.fogTarget, 1 - Math.exp(-FOG_LERP_RATE * dt));
    }

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

  getDensity(): number {
    return ZONES[this.zoneIndex].density;
  }

  getZoneName(): string {
    return ZONES[this.zoneIndex].name;
  }
}
