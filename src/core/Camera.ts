import * as THREE from 'three';

const OFFSET = new THREE.Vector3(0, 5, 10);
const LOOK_AHEAD = 10;
const LERP_RATE = 5.0;

export class CameraRig {
  private readonly desired = new THREE.Vector3();

  constructor(private readonly camera: THREE.PerspectiveCamera) {}

  update(dt: number, bikePos: THREE.Vector3): void {
    this.desired.set(
      bikePos.x + OFFSET.x,
      bikePos.y + OFFSET.y,
      bikePos.z + OFFSET.z,
    );
    this.camera.position.lerp(this.desired, 1 - Math.exp(-LERP_RATE * dt));
    this.camera.lookAt(bikePos.x * 0.5, 1, bikePos.z - LOOK_AHEAD);
  }
}
