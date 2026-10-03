import * as THREE from 'three';
import {
  ACCELERATION,
  BRAKE_FORCE,
  CRASH_STUN_TIME,
  GRAVITY,
  HOP_VELOCITY,
  LANES,
  MAX_SPEED,
} from '../data/bikeConfig';

export class Bike {
  readonly mesh: THREE.Mesh;
  laneIndex = 1;
  speed = 0;
  private hopY = 0;
  private hopV = 0;
  private crashTimer = 0;

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
    if (this.crashTimer > 0) return;
    this.speed = Math.min(MAX_SPEED, this.speed + ACCELERATION * dt);
  }

  brake(dt: number): void {
    this.speed = Math.max(0, this.speed - BRAKE_FORCE * dt);
  }

  update(dt: number): void {
    this.mesh.position.x = LANES[this.laneIndex];
    this.crashTimer = Math.max(0, this.crashTimer - dt);
    if (this.hopY > 0 || this.hopV !== 0) {
      this.hopV -= GRAVITY * dt;
      this.hopY = Math.max(0, this.hopY + this.hopV * dt);
      if (this.hopY === 0) this.hopV = 0;
      this.mesh.position.y = 0.5 + this.hopY;
    }
  }

  hop(): void {
    if (this.hopY <= 0) this.hopV = HOP_VELOCITY;
  }

  isAirborne(): boolean {
    return this.hopY > 0;
  }

  crash(): void {
    this.speed = 0;
    this.crashTimer = CRASH_STUN_TIME;
  }

  getLaneX(): number {
    return LANES[this.laneIndex];
  }

  getPosition(): THREE.Vector3 {
    return this.mesh.position;
  }
}
