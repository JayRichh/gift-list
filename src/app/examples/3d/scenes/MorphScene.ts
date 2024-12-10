import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export class MorphScene {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private mesh: THREE.Mesh;
  private controls: OrbitControls;
  private container: HTMLElement;
  private animationId: number | null = null;
  private grid: THREE.GridHelper;
  private clock: THREE.Clock;

  constructor(container: HTMLElement) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("#f8fafc");
    this.camera = new THREE.PerspectiveCamera(50, this.getAspect(), 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    this.clock = new THREE.Clock();
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

  private createMesh(): THREE.Mesh {
    // Create base geometry (sphere)
    const geometry = new THREE.SphereGeometry(1, 32, 32);

    // Create cube morph target by cloning and modifying the sphere geometry
    const cubeGeometry = geometry.clone();
    const positionAttribute = cubeGeometry.getAttribute("position");

    if (!positionAttribute) {
      throw new Error("Position attribute is missing from geometry");
    }

    const positions = positionAttribute.array as Float32Array;

    for (let i = 0; i < positions.length; i += 3) {
      // Ensure we have valid numbers for the vertex coordinates
      const x = positions[i] ?? 0;
      const y = positions[i + 1] ?? 0;
      const z = positions[i + 2] ?? 0;

      const cubeVertex = this.sphereToCube(x, y, z);

      positions[i] = cubeVertex.x;
      positions[i + 1] = cubeVertex.y;
      positions[i + 2] = cubeVertex.z;
    }

    positionAttribute.needsUpdate = true;

    // Assign the morph target to the base geometry
    geometry.morphAttributes.position = [positionAttribute];

    // Clean up the cube geometry
    cubeGeometry.dispose();

    const material = new THREE.MeshPhysicalMaterial({
      color: "#2563eb",
      metalness: 0.2,
      roughness: 0.1,
      clearcoat: 0.8,
      wireframe: true,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.position.y = 0.5;
    mesh.morphTargetInfluences = [0];
    return mesh;
  }

  // Function to map sphere vertices to cube vertices
  private sphereToCube(x: number, y: number, z: number): THREE.Vector3 {
    const absX = Math.abs(x);
    const absY = Math.abs(y);
    const absZ = Math.abs(z);
    const max = Math.max(absX, absY, absZ);

    return new THREE.Vector3(x / max, y / max, z / max);
  }

  private setupLights(): void {
    const ambientLight = new THREE.AmbientLight("#ffffff", 0.5);
    this.scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight("#ffffff", 1);
    mainLight.position.set(5, 5, 5);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    this.scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight("#bfdbfe", 0.5);
    fillLight.position.set(-5, 0, -5);
    this.scene.add(fillLight);
  }

  private init(): void {
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);

    this.scene.add(this.mesh);
    this.scene.add(this.grid);
    this.setupLights();
    this.camera.position.set(4, 3, 4);
    this.camera.lookAt(0, 0, 0);

    this.animate();
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
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
    const delta = this.clock.getDelta();

    // Smoothly update morph target influences
    if (this.mesh.morphTargetInfluences) {
      for (let i = 0; i < this.mesh.morphTargetInfluences.length; i++) {
        const target = this.mesh.userData.targetInfluences?.[i] ?? 0;
        this.mesh.morphTargetInfluences[i] = THREE.MathUtils.lerp(
          this.mesh.morphTargetInfluences[i] ?? 0,
          target,
          delta * 3
        );
      }
    }

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  };

  public morphTo(shape: "sphere" | "cube"): void {
    if (!this.mesh.userData.targetInfluences) {
      this.mesh.userData.targetInfluences = [0];
    }

    switch (shape) {
      case "cube":
        this.mesh.userData.targetInfluences = [1];
        break;
      default:
        this.mesh.userData.targetInfluences = [0];
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
