import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";

interface PhysicsObject {
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;
  acceleration: THREE.Vector3;
  boundingBox: THREE.Box3;
  isStatic: boolean; // Made required
  update: (deltaTime: number) => void;
}

type MaterialProperty =
  | "metalness"
  | "roughness"
  | "clearcoat"
  | "transmission"
  | "ior"
  | "thickness"
  | "color";

export class ThreeScene {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  private container: HTMLElement;
  private animationId: number | null = null;
  private clock: THREE.Clock;
  private grid: THREE.GridHelper;
  private mainMesh: THREE.Mesh;
  private mainPhysicsObj: PhysicsObject;
  private physicsObjects: PhysicsObject[] = [];
  private lights: THREE.Light[] = [];
  private stats: Stats;
  private debug: boolean = false;
  private debugHelpers: THREE.Box3Helper[] = [];
  private groundPhysicsObj!: PhysicsObject;
  private defaultCameraPosition = new THREE.Vector3(8, 6, 8);

  constructor(container: HTMLElement) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("#ffffff");
    this.camera = new THREE.PerspectiveCamera(50, this.getAspect(), 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    this.clock = new THREE.Clock();
    this.grid = this.createGrid();
    this.mainMesh = this.createMainMesh("box");
    this.mainPhysicsObj = this.createPhysicsObject(this.mainMesh, false);
    this.controls = this.createControls();

    this.stats = new Stats();
    this.stats.showPanel(0);
    this.stats.dom.style.cssText = "position:absolute;top:0;left:0;z-index:100;";

    this.container.style.position = "relative";
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
    controls.minDistance = 5;
    controls.maxDistance = 20;
    return controls;
  }

  private createGrid(): THREE.GridHelper {
    const grid = new THREE.GridHelper(40, 40, "#e2e8f0", "#e2e8f0");
    grid.position.y = 0;
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.5;
    return grid;
  }

  private createMainMesh(shape: "box" | "sphere" | "torus"): THREE.Mesh {
    let geometry: THREE.BufferGeometry;

    switch (shape) {
      case "sphere":
        geometry = new THREE.SphereGeometry(1.2, 32, 32);
        break;
      case "torus":
        geometry = new THREE.TorusGeometry(1, 0.4, 32, 48);
        break;
      default:
        geometry = new THREE.BoxGeometry(2, 2, 2);
    }

    const material = new THREE.MeshPhysicalMaterial({
      color: "#2563eb",
      metalness: 0.2,
      roughness: 0.1,
      clearcoat: 0.8,
      clearcoatRoughness: 0.2,
      transmission: 0,
      ior: 1.5,
      thickness: 0.5,
      envMapIntensity: 1.0,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.position.y = 5;
    return mesh;
  }

  private createPhysicsObject(mesh: THREE.Mesh, isStatic: boolean = false): PhysicsObject {
    const boundingBox = new THREE.Box3().setFromObject(mesh);

    if (this.debug) {
      const helper = new THREE.Box3Helper(boundingBox, new THREE.Color(0xff0000));
      this.scene.add(helper);
      this.debugHelpers.push(helper);
    }

    const velocity = new THREE.Vector3(0, 0, 0);
    const acceleration = new THREE.Vector3(0, isStatic ? 0 : -9.81, 0);

    return {
      mesh,
      velocity,
      acceleration,
      boundingBox,
      isStatic,
      update: function (this: PhysicsObject, deltaTime: number) {
        if (!this.isStatic) {
          this.velocity.add(this.acceleration.clone().multiplyScalar(deltaTime));
          this.mesh.position.add(this.velocity.clone().multiplyScalar(deltaTime));
        }
        this.boundingBox.setFromObject(this.mesh);
      },
    };
  }

  private init(): void {
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;

    this.container.appendChild(this.renderer.domElement);
    this.container.appendChild(this.stats.dom);

    const axesHelper = new THREE.AxesHelper(5);
    this.scene.add(axesHelper);

    this.scene.add(this.grid);
    this.scene.add(this.mainMesh);
    this.setupLights();
    this.setupEnvironment();
    this.setupGroundPhysics();

    // Add main physics object to physics array
    this.physicsObjects.push(this.mainPhysicsObj);

    this.camera.position.copy(this.defaultCameraPosition);
    this.camera.lookAt(0, 0, 0);

    this.animate();
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  }

  private setupGroundPhysics(): void {
    const groundGeometry = new THREE.BoxGeometry(100, 1, 100);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: "#dddddd",
      transparent: true,
      opacity: 0.5,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.position.y = -0.5;
    ground.receiveShadow = true;
    this.scene.add(ground);

    this.groundPhysicsObj = this.createPhysicsObject(ground, true);
    this.physicsObjects.push(this.groundPhysicsObj);
  }

  private setupLights(): void {
    const ambientLight = new THREE.AmbientLight("#ffffff", 0.5);
    this.scene.add(ambientLight);
    this.lights.push(ambientLight);

    const mainLight = new THREE.DirectionalLight("#ffffff", 1);
    mainLight.position.set(5, 5, 5);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.camera.near = 0.1;
    mainLight.shadow.camera.far = 20;
    mainLight.shadow.camera.left = -10;
    mainLight.shadow.camera.right = 10;
    mainLight.shadow.camera.top = 10;
    mainLight.shadow.camera.bottom = -10;
    mainLight.shadow.bias = -0.0001;
    this.scene.add(mainLight);
    this.lights.push(mainLight);

    const fillLight = new THREE.DirectionalLight("#e2e8f0", 0.5);
    fillLight.position.set(-5, 0, -5);
    this.scene.add(fillLight);
    this.lights.push(fillLight);
  }

  private setupEnvironment(): void {
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 100;
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 20;
      positions[i3 + 1] = Math.random() * 10;
      positions[i3 + 2] = (Math.random() - 0.5) * 20;

      velocities[i3] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;
    }

    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute("velocity", new THREE.BufferAttribute(velocities, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: "#2563eb",
      size: 0.1,
      transparent: true,
      opacity: 0.3,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    this.scene.add(particles);
  }

  private handleCollision(obj1: PhysicsObject, obj2: PhysicsObject): void {
    if (obj1.boundingBox.intersectsBox(obj2.boundingBox)) {
      const intersection = new THREE.Box3();
      intersection.copy(obj1.boundingBox).intersect(obj2.boundingBox);

      const size = new THREE.Vector3();
      intersection.getSize(size);

      const center1 = new THREE.Vector3();
      const center2 = new THREE.Vector3();
      obj1.boundingBox.getCenter(center1);
      obj2.boundingBox.getCenter(center2);
      const normal = center1.clone().sub(center2).normalize();

      const relativeVelocity = obj1.velocity.clone().sub(obj2.velocity);
      const normalVelocity = relativeVelocity.dot(normal);

      if (normalVelocity < 0) {
        const restitution = 0.3;
        const j = -(1 + restitution) * normalVelocity;
        const impulse = normal.multiplyScalar(j);

        if (!obj1.isStatic) {
          obj1.velocity.add(impulse);
          obj1.mesh.position.add(normal.clone().multiplyScalar(0.01));
        }
        if (!obj2.isStatic) {
          obj2.velocity.sub(impulse);
          obj2.mesh.position.sub(normal.clone().multiplyScalar(0.01));
        }

        if (!obj1.isStatic) obj1.velocity.multiplyScalar(0.95);
        if (!obj2.isStatic) obj2.velocity.multiplyScalar(0.95);
      }
    }
  }

  private updatePhysics(deltaTime: number): void {
    // First update positions
    for (const obj of this.physicsObjects) {
      obj.update(deltaTime);
    }

    // Then check all collisions
    for (let i = 0; i < this.physicsObjects.length; i++) {
      for (let j = i + 1; j < this.physicsObjects.length; j++) {
        this.handleCollision(this.physicsObjects[i]!, this.physicsObjects[j]!);
      }
    }

    // Apply position constraints
    for (const obj of this.physicsObjects) {
      if (!obj.isStatic) {
        const pos = obj.mesh.position;
        if (Math.abs(pos.x) > 20) {
          pos.x = Math.sign(pos.x) * 20;
          obj.velocity.x *= -0.5;
        }
        if (Math.abs(pos.z) > 20) {
          pos.z = Math.sign(pos.z) * 20;
          obj.velocity.z *= -0.5;
        }
      }
    }
  }

  private updateParticles(): void {
    const particles = this.scene.children.find(
      (child): child is THREE.Points => child instanceof THREE.Points
    );
    if (!particles) return;

    const geometry = particles.geometry as THREE.BufferGeometry;

    const positionAttribute = geometry.getAttribute("position") as THREE.BufferAttribute;
    const velocityAttribute = geometry.getAttribute("velocity") as THREE.BufferAttribute;

    const positions = positionAttribute.array as NonNullable<Float32Array>;
    const velocities = velocityAttribute.array as NonNullable<Float32Array>;

    for (let i = 0; i < positionAttribute.count; i++) {
      const i3 = i * 3;

      positions[i3]! += velocities[i3]!;
      positions[i3 + 1]! += velocities[i3 + 1]!;
      positions[i3 + 2]! += velocities[i3 + 2]!;

      // Check bounds and reflect particles
      for (let j = 0; j < 3; j++) {
        const idx = i3 + j;
        if (Math.abs(positions[idx]!) > 10) {
          positions[idx] = positions[idx]! * -0.9;
        }
      }
    }

    positionAttribute.needsUpdate = true;
  }

  private animate = (): void => {
    this.stats.begin();

    this.animationId = requestAnimationFrame(this.animate);
    const deltaTime = Math.min(this.clock.getDelta(), 0.1);

    this.updatePhysics(deltaTime);
    this.updateParticles();
    this.controls.update();
    this.renderer.render(this.scene, this.camera);

    this.stats.end();
  };

  private handleResize = (): void => {
    if (!this.container) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  public setMainMeshMaterial(property: MaterialProperty, value: number | string): void {
    if (this.mainMesh.material instanceof THREE.MeshPhysicalMaterial) {
      const material = this.mainMesh.material;

      if (property === "color" && typeof value === "string") {
        material.color.set(value);
      } else if (property !== "color" && typeof value === "number") {
        material[property] = value;
      }
    }
  }

  public morphMainMesh(shape: "box" | "sphere" | "torus"): void {
    const oldMaterial = this.mainMesh.material as THREE.MeshPhysicalMaterial;
    const materialProps = {
      color: oldMaterial.color.getHex(),
      metalness: oldMaterial.metalness,
      roughness: oldMaterial.roughness,
      clearcoat: oldMaterial.clearcoat,
      transmission: oldMaterial.transmission,
      ior: oldMaterial.ior,
      thickness: oldMaterial.thickness,
    };

    // Remove old mesh and physics object
    this.scene.remove(this.mainMesh);
    this.mainMesh.geometry.dispose();
    if (Array.isArray(this.mainMesh.material)) {
      this.mainMesh.material.forEach((material) => material.dispose());
    } else {
      this.mainMesh.material.dispose();
    }

    // Remove old physics object from array
    this.physicsObjects = this.physicsObjects.filter((obj) => obj !== this.mainPhysicsObj);

    // Create new mesh
    this.mainMesh = this.createMainMesh(shape);
    const material = this.mainMesh.material as THREE.MeshPhysicalMaterial;
    material.color.setHex(materialProps.color);
    material.metalness = materialProps.metalness;
    material.roughness = materialProps.roughness;
    material.clearcoat = materialProps.clearcoat;
    material.transmission = materialProps.transmission;
    material.ior = materialProps.ior;
    material.thickness = materialProps.thickness;

    // Create new physics object
    this.mainPhysicsObj = this.createPhysicsObject(this.mainMesh, false);
    this.physicsObjects.push(this.mainPhysicsObj);

    // Add new mesh to scene
    this.scene.add(this.mainMesh);
  }

  public addPhysicsObject(
    type: "box" | "sphere",
    position: { x: number; y: number; z: number }
  ): void {
    let geometry: THREE.BufferGeometry;

    if (type === "sphere") {
      geometry = new THREE.SphereGeometry(0.5, 32, 32);
    } else {
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

    const physicsObj = this.createPhysicsObject(mesh, false);
    this.physicsObjects.push(physicsObj);
  }

  public clearPhysicsObjects(): void {
    const objectsToRemove = this.physicsObjects.filter(
      (obj) => obj !== this.groundPhysicsObj && obj !== this.mainPhysicsObj
    );

    for (const obj of objectsToRemove) {
      this.scene.remove(obj.mesh);
      obj.mesh.geometry.dispose();
      if (obj.mesh.material instanceof THREE.Material) {
        obj.mesh.material.dispose();
      }
    }

    this.physicsObjects = [this.groundPhysicsObj, this.mainPhysicsObj];

    for (const helper of this.debugHelpers) {
      this.scene.remove(helper);
    }
    this.debugHelpers = [];
  }

  public setAutoRotate(enabled: boolean): void {
    this.controls.autoRotate = enabled;
  }

  public setRotationSpeed(speed: number): void {
    this.controls.autoRotateSpeed = speed;
  }

  public resetCamera(): void {
    this.camera.position.copy(this.defaultCameraPosition);
    this.camera.lookAt(0, 0, 0);
    this.controls.target.set(0, 0, 0);
    this.controls.update();
  }

  public dispose(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
    }

    this.clearPhysicsObjects();
    window.removeEventListener("resize", this.handleResize);
    this.controls.dispose();
    this.renderer.dispose();
    this.container.removeChild(this.renderer.domElement);
    this.container.removeChild(this.stats.dom);

    if (this.mainMesh.geometry) {
      this.mainMesh.geometry.dispose();
    }
    if (this.mainMesh.material instanceof THREE.Material) {
      this.mainMesh.material.dispose();
    }

    this.lights.forEach((light) => {
      this.scene.remove(light);
    });
  }
}
