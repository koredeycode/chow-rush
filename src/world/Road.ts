import * as THREE from 'three';
import { ASPHALT_COLOR, ROAD_WIDTH, SEGMENT_LENGTH, STRIP_COLOR } from '../data/cityConfig';

const STRIP_WIDTH = 0.15;
const STRIP_HEIGHT = 0.02;

export class Road {
  readonly group = new THREE.Group();

  constructor() {
    const asphalt = new THREE.Mesh(
      new THREE.PlaneGeometry(ROAD_WIDTH, SEGMENT_LENGTH),
      new THREE.MeshStandardMaterial({ color: ASPHALT_COLOR }),
    );
    asphalt.rotation.x = -Math.PI / 2;
    asphalt.receiveShadow = true;
    this.group.add(asphalt);

    const stripGeo = new THREE.BoxGeometry(STRIP_WIDTH, STRIP_HEIGHT, SEGMENT_LENGTH);
    const stripMat = new THREE.MeshStandardMaterial({ color: STRIP_COLOR });
    for (const x of [-1.5, 1.5]) {
      const strip = new THREE.Mesh(stripGeo, stripMat);
      strip.position.set(x, STRIP_HEIGHT / 2, 0);
      this.group.add(strip);
    }
  }

  update(): void {
    // Static — CityScroller moves the parent group.
  }
}
