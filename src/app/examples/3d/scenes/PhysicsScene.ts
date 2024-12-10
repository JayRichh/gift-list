import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

interface PhysicsObject {
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;
  acceleration: THREE.Vector3;
  radius: number;
  update: (deltaTime: number) => void;
}

export class PhysicsScene {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  private container: HTMLElement;
  private animationId: number | null = null;
  private grid: THREE.GridHelper;
  private clock: THREE.Clock;
  private objects: PhysicsObject[] = [];

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
    controls.autoRotate = false;
    return controls;
  }

  private createGrid(): THREE.GridHelper {
    const grid = new THREE.GridHelper(20, 20, "#e2e8f0", "#e2e8f0");
    grid.position.y = 0;
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
    this.scene.add(this.grid);
    this.setupLights();
    this.camera.position.set(8, 6, 8);
    this.camera.lookAt(0, 0, 0);

    // Create ground
    this.createGround();

    // Start animation
    this.animate();

    // Handle resize
    window.addEventListener("resize", this.handleResize);

    // Initial resize
    this.handleResize();
  }

  private createGround(): void {
    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: "#f1f5f9",
      metalness: 0,
      roughness: 1,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);
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
    mainLight.shadow.camera.left = -10;
    mainLight.shadow.camera.right = 10;
    mainLight.shadow.camera.top = 10;
    mainLight.shadow.camera.bottom = -10;
    this.scene.add(mainLight);

    // Fill light
    const fillLight = new THREE.DirectionalLight("#bfdbfe", 0.5);
    fillLight.position.set(-5, 0, -5);
    this.scene.add(fillLight);
  }

  private handleResize = (): void => {
    if (!this.container) return;

    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  private updatePhysics(deltaTime: number): void {
    for (const obj of this.objects) {
      // Update object
      obj.update(deltaTime);

      // Check collisions with other objects
      for (const other of this.objects) {
        if (obj === other) continue;

        const distance = obj.mesh.position.distanceTo(other.mesh.position);
        const minDistance = obj.radius + other.radius;

        if (distance < minDistance) {
          // Calculate collision normal
          const normal = obj.mesh.position.clone().sub(other.mesh.position).normalize();

          // Move objects apart
          const overlap = minDistance - distance;
          obj.mesh.position.add(normal.clone().multiplyScalar(overlap * 0.5));
          other.mesh.position.add(normal.clone().multiplyScalar(-overlap * 0.5));

          // Reflect velocities
          const relativeVelocity = obj.velocity.clone().sub(other.velocity);
          const normalVelocity = normal.clone().multiplyScalar(relativeVelocity.dot(normal));

          obj.velocity.sub(normalVelocity.multiplyScalar(1.5));
          other.velocity.add(normalVelocity.multiplyScalar(1.5));

          // Add some energy loss
          obj.velocity.multiplyScalar(0.98);
          other.velocity.multiplyScalar(0.98);
        }
      }
    }
  }

  private animate = (): void => {
    this.animationId = requestAnimationFrame(this.animate);
    const deltaTime = Math.min(this.clock.getDelta(), 0.1);

    this.updatePhysics(deltaTime);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  };

  public addObject(type: "box" | "sphere", position: { x: number; y: number; z: number }): void {
    let geometry: THREE.BufferGeometry;
    let radius: number;

    if (type === "sphere") {
      radius = 0.5;
      geometry = new THREE.SphereGeometry(radius, 32, 32);
    } else {
      radius = 0.5 * Math.sqrt(3);
      geometry = new THREE.BoxGeometry(1, 1, 1);
    }

    const material = new THREE.MeshPhysicalMaterial({
      color: "#" + Math.floor(Math.random() * 16777215).toString(16),
      metalness: 0.2,
      roughness: 0.1,
      clearcoat: 0.8,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.position.set(position.x, position.y, position.z);
    this.scene.add(mesh);

    const physicsObj: PhysicsObject = {
      mesh,
      velocity: new THREE.Vector3(0, 0, 0),
      acceleration: new THREE.Vector3(0, -9.81, 0),
      radius,
      update: (deltaTime: number) => {
        // Update velocity and position
        physicsObj.velocity.add(physicsObj.acceleration.clone().multiplyScalar(deltaTime));
        physicsObj.mesh.position.add(physicsObj.velocity.clone().multiplyScalar(deltaTime));

        // Ground collision
        if (physicsObj.mesh.position.y < physicsObj.radius) {
          physicsObj.mesh.position.y = physicsObj.radius;
          physicsObj.velocity.y = -physicsObj.velocity.y * 0.5; // bounce
          physicsObj.velocity.x *= 0.98; // friction
          physicsObj.velocity.z *= 0.98;
        }

        // Wall collisions
        const bounds = 9;
        if (Math.abs(physicsObj.mesh.position.x) > bounds) {
          physicsObj.mesh.position.x = Math.sign(physicsObj.mesh.position.x) * bounds;
          physicsObj.velocity.x = -physicsObj.velocity.x * 0.5;
        }
        if (Math.abs(physicsObj.mesh.position.z) > bounds) {
          physicsObj.mesh.position.z = Math.sign(physicsObj.mesh.position.z) * bounds;
          physicsObj.velocity.z = -physicsObj.velocity.z * 0.5;
        }
      },
    };

    this.objects.push(physicsObj);
  }

  public clearObjects(): void {
    for (const obj of this.objects) {
      this.scene.remove(obj.mesh);
      obj.mesh.geometry.dispose();
      if (obj.mesh.material instanceof THREE.Material) {
        obj.mesh.material.dispose();
      }
    }
    this.objects = [];
  }

  public dispose(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
    }

    this.clearObjects();
    window.removeEventListener("resize", this.handleResize);
    this.controls.dispose();
    this.renderer.dispose();
    this.container.removeChild(this.renderer.domElement);
  }
}
