import * as THREE from 'three';

export type WeatherKind = 'clear' | 'rain' | 'rain + night';

const DROP_COUNT = 600;
const AREA = 60;
const HEIGHT = 30;
const FALL_SPEED = 45;

export class Weather {
  private readonly rain: THREE.Points;
  private readonly drops: Float32Array;
  private readonly headlight: THREE.SpotLight;
  private readonly headTarget: THREE.Object3D;

  constructor(scene: THREE.Scene) {
    this.drops = new Float32Array(DROP_COUNT * 3);
    for (let i = 0; i < DROP_COUNT; i++) {
      this.drops[i * 3] = (Math.random() - 0.5) * AREA;
      this.drops[i * 3 + 1] = Math.random() * HEIGHT;
      this.drops[i * 3 + 2] = (Math.random() - 0.5) * AREA;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(this.drops, 3));
    this.rain = new THREE.Points(
      geo,
      new THREE.PointsMaterial({
        color: 0x9db8cc,
        size: 0.18,
        transparent: true,
        opacity: 0.7,
      }),
    );
    this.rain.visible = false;
    this.rain.frustumCulled = false;
    scene.add(this.rain);

    this.headlight = new THREE.SpotLight(0xfff2cc, 0, 70, 0.5, 0.4);
    this.headTarget = new THREE.Object3D();
    scene.add(this.headTarget);
    this.headlight.target = this.headTarget;
    scene.add(this.headlight);
  }

  update(dt: number, bikePos: THREE.Vector3, weather: WeatherKind): void {
    const raining = weather !== 'clear';
    const night = weather === 'rain + night';
    this.rain.visible = raining;
    if (raining) {
      for (let i = 0; i < DROP_COUNT; i++) {
        let y = this.drops[i * 3 + 1] - FALL_SPEED * dt;
        if (y < 0) y += HEIGHT;
        this.drops[i * 3 + 1] = y;
      }
      (this.rain.geometry as THREE.BufferGeometry).attributes
        .position.needsUpdate = true;
      this.rain.position.set(bikePos.x, 0, bikePos.z);
    }
    const target = night ? 200 : 0;
    this.headlight.intensity += (target - this.headlight.intensity) * Math.min(1, dt * 2);
    this.headlight.position.set(bikePos.x, 4, bikePos.z + 3);
    this.headTarget.position.set(bikePos.x, 0, bikePos.z - 18);
  }
}
