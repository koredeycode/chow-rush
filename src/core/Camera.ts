import * as THREE from 'three';

const OFFSET = new THREE.Vector3(0, 5, 10);
const LOOK_AHEAD = 10;
const LERP_RATE = 5.0;
const SHAKE_DECAY = 1.5;
const SHAKE_MAG = 0.6;

export class CameraRig {
  private readonly desired = new THREE.Vector3();
  private trauma = 0;

  constructor(private readonly camera: THREE.PerspectiveCamera) {}

  addShake(amount: number): void {
    this.trauma = Math.min(1, this.trauma + amount);
  }

  update(dt: number, bikePos: THREE.Vector3): void {
    this.desired.set(
      bikePos.x + OFFSET.x,
      bikePos.y + OFFSET.y,
      bikePos.z + OFFSET.z,
    );
    this.camera.position.lerp(this.desired, 1 - Math.exp(-LERP_RATE * dt));
    this.trauma = Math.max(0, this.trauma - SHAKE_DECAY * dt);
    const shake = this.trauma * this.trauma * SHAKE_MAG;
    this.camera.position.x += (Math.random() * 2 - 1) * shake;
    this.camera.position.y += (Math.random() * 2 - 1) * shake;
    this.camera.lookAt(bikePos.x * 0.5, 1, bikePos.z - LOOK_AHEAD);
  }
}
