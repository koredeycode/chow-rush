import * as THREE from 'three';
import { ACCELERATION, BRAKE_FORCE, LANES, MAX_SPEED } from '../data/bikeConfig';

export class Bike {
  readonly mesh: THREE.Mesh;
  laneIndex = 1;
  speed = 0;

  constructor() {
    const geo = new THREE.BoxGeometry(1, 1, 2);
    const mat = new THREE.MeshStandardMaterial({ color: 0xe67e22 });
    this.mesh = new THREE.Mesh(geo, mat);
    this.mesh.position.set(LANES[this.laneIndex], 0.5, 0);
  }

  setLane(index: number): void {
    this.laneIndex = THREE.MathUtils.clamp(index, 0, LANES.length - 1);
  }

  accelerate(dt: number): void {
    this.speed = Math.min(MAX_SPEED, this.speed + ACCELERATION * dt);
  }

  brake(dt: number): void {
    this.speed = Math.max(0, this.speed - BRAKE_FORCE * dt);
  }

  update(_dt: number): void {
    this.mesh.position.x = LANES[this.laneIndex];
  }

  getLaneX(): number {
    return LANES[this.laneIndex];
  }

  getPosition(): THREE.Vector3 {
    return this.mesh.position;
  }
}
