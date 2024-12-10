import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export class ExampleScene {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private mesh: THREE.Mesh;
  private controls: OrbitControls;
  private container: HTMLElement;
  private animationId: number | null = null;
  private clock: THREE.Clock;
  private grid: THREE.GridHelper;
  private ambientLight: THREE.AmbientLight;
  private mainLight: THREE.DirectionalLight;
  private fillLight: THREE.DirectionalLight;
  private rimLight: THREE.DirectionalLight;

  constructor(container: HTMLElement) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("#f8fafc"); // Soft white background
    this.camera = new THREE.PerspectiveCamera(50, this.getAspect(), 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    this.clock = new THREE.Clock();
    this.mesh = this.createMesh();
    this.grid = this.createGrid();
    this.controls = this.createControls();

    // Initialize lights
    this.ambientLight = new THREE.AmbientLight("#ffffff", 0.5);
    this.mainLight = this.createMainLight();
    this.fillLight = this.createFillLight();
    this.rimLight = this.createRimLight();

    this.init();
  }

  private getAspect(): number {
    return this.container.clientWidth / this.container.clientHeight;
  }

  private createControls(): OrbitControls {
    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.enablePan = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 2.0;
    controls.minDistance = 3;
    controls.maxDistance = 10;
    return controls;
  }

  private createGrid(): THREE.GridHelper {
    const grid = new THREE.GridHelper(20, 20, "#e2e8f0", "#e2e8f0");
    grid.position.y = -1;
    grid.material.transparent = true;
    grid.material.opacity = 0.5;
    return grid;
  }

  private createMainLight(): THREE.DirectionalLight {
    const light = new THREE.DirectionalLight("#ffffff", 1);
    light.position.set(5, 5, 5);
    light.castShadow = true;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 20;
    light.shadow.camera.left = -5;
    light.shadow.camera.right = 5;
    light.shadow.camera.top = 5;
    light.shadow.camera.bottom = -5;
    light.shadow.bias = -0.0001;
    return light;
  }

  private createFillLight(): THREE.DirectionalLight {
    const light = new THREE.DirectionalLight("#bfdbfe", 0.5);
    light.position.set(-5, 0, -5);
    return light;
  }

  private createRimLight(): THREE.DirectionalLight {
    const light = new THREE.DirectionalLight("#60a5fa", 0.3);
    light.position.set(0, 5, -5);
    return light;
  }

  private init(): void {
    // Setup renderer
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.container.appendChild(this.renderer.domElement);

    // Set renderer canvas style
    this.renderer.domElement.style.width = "100%";
    this.renderer.domElement.style.height = "100%";

    // Setup scene
    this.scene.add(this.mesh);
    this.scene.add(this.grid);
    this.setupLights();

    // Setup camera
    this.camera.position.set(4, 3, 4);
    this.camera.lookAt(0, 0, 0);

    // Start animation
    this.animate();

    // Handle resize
    window.addEventListener("resize", this.handleResize);

    // Initial resize
    this.handleResize();
  }

  private createMesh(): THREE.Mesh {
    const geometry = new THREE.BoxGeometry(2, 2, 2, 2, 2, 2);
    const material = new THREE.MeshPhysicalMaterial({
      color: "#2563eb",
      metalness: 0.2,
      roughness: 0.1,
      clearcoat: 0.8,
      clearcoatRoughness: 0.2,
      envMapIntensity: 1.0,
      transmission: 0,
      ior: 1.5,
      thickness: 0.5,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.position.y = 0.5;
    return mesh;
  }

  private setupLights(): void {
    this.scene.add(this.ambientLight);
    this.scene.add(this.mainLight);
    this.scene.add(this.fillLight);
    this.scene.add(this.rimLight);

    // Ground plane for shadows
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.ShadowMaterial({
      opacity: 0.3,
      color: "#1e293b",
      transparent: true,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1;
    ground.receiveShadow = true;
    this.scene.add(ground);
  }

  private handleResize = (): void => {
    if (!this.container) return;

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

  // Public methods for controlling the scene
  public setGeometry(
    type: "box" | "sphere" | "torus" | "octahedron" | "icosahedron" | "cylinder"
  ): void {
    let geometry: THREE.BufferGeometry;

    switch (type) {
      case "sphere":
        geometry = new THREE.SphereGeometry(1.2, 32, 32);
        break;
      case "torus":
        geometry = new THREE.TorusGeometry(1, 0.4, 32, 100);
        break;
      case "octahedron":
        geometry = new THREE.OctahedronGeometry(1.2);
        break;
      case "icosahedron":
        geometry = new THREE.IcosahedronGeometry(1.2);
        break;
      case "cylinder":
        geometry = new THREE.CylinderGeometry(0.8, 0.8, 2, 32);
        break;
      default:
        geometry = new THREE.BoxGeometry(2, 2, 2, 2, 2, 2);
    }

    this.mesh.geometry.dispose();
    this.mesh.geometry = geometry;
  }

  public setMaterialProperty(property: string, value: number | string | boolean): void {
    if (this.mesh.material instanceof THREE.MeshPhysicalMaterial) {
      switch (property) {
        case "metalness":
        case "roughness":
        case "clearcoat":
        case "clearcoatRoughness":
        case "transmission":
        case "ior":
        case "thickness":
          if (typeof value === "number") {
            this.mesh.material[property] = value;
          }
          break;
        case "color":
          if (typeof value === "string") {
            this.mesh.material.color.set(value);
          }
          break;
        case "wireframe":
          if (typeof value === "boolean") {
            this.mesh.material.wireframe = value;
          }
          break;
      }
    }
  }

  public setGridVisibility(visible: boolean): void {
    this.grid.visible = visible;
  }

  public setAutoRotate(enabled: boolean): void {
    this.controls.autoRotate = enabled;
  }

  public setRotationSpeed(speed: number): void {
    this.controls.autoRotateSpeed = speed;
  }

  public resetCamera(): void {
    this.camera.position.set(4, 3, 4);
    this.camera.lookAt(0, 0, 0);
    this.controls.reset();
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
    if (this.mesh.material instanceof THREE.Material) {
      this.mesh.material.dispose();
    }
  }
}
