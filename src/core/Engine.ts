import * as THREE from 'three';

export type QualityTier = 'high' | 'medium' | 'low';

function isPortrait(): boolean {
  return window.innerHeight > window.innerWidth;
}

export function defaultFov(): number {
  return isPortrait() ? 68 : 60;
}

export class Engine {
  readonly renderer: THREE.WebGLRenderer;
  readonly scene: THREE.Scene;
  readonly camera: THREE.PerspectiveCamera;
  private readonly dirLight: THREE.DirectionalLight;
  private tier: QualityTier = 'high';

  constructor(canvasId = 'game-canvas') {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87ceeb);
    this.scene.fog = new THREE.Fog(0x87ceeb, 50, 200);

    this.camera = new THREE.PerspectiveCamera(defaultFov(), 1, 0.1, 500);
    this.camera.position.set(0, 5, 10);
    this.camera.lookAt(0, 0, 0);

    const hemi = new THREE.HemisphereLight(0xbfd9ff, 0x3a2f23, 0.9);
    this.dirLight = new THREE.DirectionalLight(0xffffff, 1.6);
    this.dirLight.position.set(10, 20, 10);
    this.dirLight.castShadow = true;
    this.scene.add(hemi, this.dirLight);

    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.setQualityTier(isPortrait() ? 'medium' : 'high');
  }

  setQualityTier(tier: QualityTier): void {
    this.tier = tier;
    const dpr = window.devicePixelRatio || 1;
    if (tier === 'high') {
      this.renderer.setPixelRatio(Math.min(dpr, 2));
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.dirLight.shadow.mapSize.set(2048, 2048);
    } else if (tier === 'medium') {
      this.renderer.setPixelRatio(Math.min(dpr, 1.5));
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFShadowMap;
      this.dirLight.shadow.mapSize.set(1024, 1024);
    } else {
      this.renderer.setPixelRatio(1);
      this.renderer.shadowMap.enabled = false;
    }
    this.dirLight.shadow.map?.dispose();
    this.dirLight.shadow.map = null;
  }

  getQualityTier(): QualityTier {
    return this.tier;
  }

  resize(): void {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.fov = defaultFov();
    this.camera.updateProjectionMatrix();
  }

  render(): void {
    this.renderer.render(this.scene, this.camera);
  }
}
