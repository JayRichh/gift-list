import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

type MaterialProperty = "color" | "metalness" | "roughness" | "envMapIntensity";
type MaterialValue = string | number;

export class DemoScene {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private mesh: THREE.Mesh;
  private controls: OrbitControls;
  private container: HTMLElement;
  private animationId: number | null = null;
  private clock: THREE.Clock;
  private pmremGenerator: THREE.PMREMGenerator;
  private envMap: THREE.Texture | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, this.getAspect(), 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    this.clock = new THREE.Clock();
    this.pmremGenerator = new THREE.PMREMGenerator(this.renderer);

    this.mesh = this.createMesh();
    this.controls = this.createControls();

    this.init();
  }

  private getAspect(): number {
    return this.container.clientWidth / this.container.clientHeight;
  }

  private async init() {
    // Setup renderer
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.container.appendChild(this.renderer.domElement);

    // Load environment map
    await this.loadEnvironment();

    // Setup scene
    this.scene.add(this.mesh);
    this.setupLights();
    this.camera.position.set(0, 0, 5);

    // Start animation
    this.animate();

    // Handle resize
    window.addEventListener("resize", this.handleResize);

    // Initial resize
    this.handleResize();
  }

  private async loadEnvironment() {
    const loader = new RGBELoader();
    const hdrTexture = await loader.loadAsync("path_to_hdr_file.hdr");
    this.envMap = this.pmremGenerator.fromEquirectangular(hdrTexture).texture;
    this.scene.environment = this.envMap;
    hdrTexture.dispose();
    this.pmremGenerator.dispose();
  }

  private createControls(): OrbitControls {
    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.enablePan = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.0;
    return controls;
  }

  private createMesh(): THREE.Mesh {
    const geometry = new THREE.IcosahedronGeometry(1, 0);
    const material = new THREE.MeshStandardMaterial({
      color: "#ffffff",
      metalness: 0.7,
      roughness: 0.2,
      envMapIntensity: 1.0,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  }

  private setupLights(): void {
    const ambientLight = new THREE.AmbientLight("#ffffff", 0.2);
    this.scene.add(ambientLight);

    const spotLight = new THREE.SpotLight("#ffffff", 1);
    spotLight.position.set(5, 5, 5);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 2048;
    spotLight.shadow.mapSize.height = 2048;
    this.scene.add(spotLight);
  }

  private handleResize = (): void => {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  };

  private animate = (): void => {
    this.animationId = requestAnimationFrame(this.animate);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  };

  public updateMaterialProperty(property: MaterialProperty, value: MaterialValue): void {
    if (this.mesh.material instanceof THREE.MeshStandardMaterial) {
      const material = this.mesh.material;

      if (property === "color" && typeof value === "string") {
        material.color.set(value);
      } else if (property !== "color" && typeof value === "number") {
        material[property] = value;
      }

      material.needsUpdate = true;
    }
  }

  public updateGeometry(geometry: THREE.BufferGeometry): void {
    this.mesh.geometry.dispose();
    this.mesh.geometry = geometry;
  }

  public dispose(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
    }

    window.removeEventListener("resize", this.handleResize);
    this.controls.dispose();
    this.renderer.dispose();
    this.container.removeChild(this.renderer.domElement);

    if (this.mesh.geometry) {
      this.mesh.geometry.dispose();
    }
    if (Array.isArray(this.mesh.material)) {
      this.mesh.material.forEach((material) => material.dispose());
    } else if (this.mesh.material) {
      this.mesh.material.dispose();
    }
    if (this.envMap) {
      this.envMap.dispose();
    }
  }
}
