import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export class MaterialScene {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private mesh: THREE.Mesh;
  private controls: OrbitControls;
  private container: HTMLElement;
  private animationId: number | null = null;
  private grid: THREE.GridHelper;

  constructor(container: HTMLElement) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("#f8fafc");
    this.camera = new THREE.PerspectiveCamera(50, this.getAspect(), 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    this.mesh = this.createMesh();
    this.grid = this.createGrid();
    this.controls = this.createControls();

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
    return controls;
  }

  private createGrid(): THREE.GridHelper {
    const grid = new THREE.GridHelper(20, 20, "#e2e8f0", "#e2e8f0");
    grid.position.y = -1;
    grid.material.transparent = true;
    grid.material.opacity = 0.5;
    return grid;
  }

  private init(): void {
    // Setup renderer
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);

    // Setup scene
    this.scene.add(this.mesh);
    this.scene.add(this.grid);
    this.setupLights();
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
    const geometry = new THREE.SphereGeometry(1.2, 32, 32);
    const material = new THREE.MeshPhysicalMaterial({
      color: "#2563eb",
      metalness: 0.2,
      roughness: 0.1,
      clearcoat: 0.8,
      clearcoatRoughness: 0.2,
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
    // Ambient light
    const ambientLight = new THREE.AmbientLight("#ffffff", 0.5);
    this.scene.add(ambientLight);

    // Main directional light
    const mainLight = new THREE.DirectionalLight("#ffffff", 1);
    mainLight.position.set(5, 5, 5);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    this.scene.add(mainLight);

    // Fill light
    const fillLight = new THREE.DirectionalLight("#bfdbfe", 0.5);
    fillLight.position.set(-5, 0, -5);
    this.scene.add(fillLight);

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

  public setMaterialProperty(property: string, value: number): void {
    if (this.mesh.material instanceof THREE.MeshPhysicalMaterial) {
      switch (property) {
        case "metalness":
        case "roughness":
        case "clearcoat":
        case "transmission":
        case "ior":
          this.mesh.material[property] = value;
          break;
      }
    }
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
