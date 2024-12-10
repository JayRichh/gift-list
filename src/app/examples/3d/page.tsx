"use client";

import { Suspense, useEffect } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { ExampleContainer, ExampleSection } from "~/components/ExampleSection";
import { Card, CardContent } from "~/components/ui/Card";
import { CodePreview } from "~/components/ui/CodePreview";
import { TabGroup } from "~/components/ui/TabGroup";

import { useActiveSection } from "~/hooks/useActiveSection";

import { InteractiveExample } from "./components/InteractiveExample";
import { MaterialExample } from "./components/MaterialExample";
import { MorphExample } from "./components/MorphExample";
import { PhysicsExample } from "./components/PhysicsExample";

// Code examples with proper formatting and indentation
const materialCode = `import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export function MaterialExample() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 3;
    
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);
    
    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    
    // Add sphere with PBR material
    const geometry = new THREE.SphereGeometry(1, 64, 64);
    const material = new THREE.MeshStandardMaterial({
      metalness: 0.9,
      roughness: 0.1,
      envMapIntensity: 1.0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });
    
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Add lighting
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    // Add environment map
    const envMap = new THREE.CubeTextureLoader()
      .setPath('/textures/cube/')
      .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);
    
    scene.environment = envMap;
    scene.background = envMap;

    // Handle resize
    const handleResize = () => {
      const width = containerRef.current?.clientWidth || 1;
      const height = containerRef.current?.clientHeight || 1;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      sphere.rotation.y += 0.005;
      renderer.render(scene, camera);
    }
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      controls.dispose();
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full" />;
}`;

const interactiveCode = `import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export function InteractiveExample() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 5;
    
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);
    
    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    // Add interactive light
    const light = new THREE.PointLight(0xffffff, 1);
    light.position.set(2, 2, 2);
    const lightHelper = new THREE.PointLightHelper(light);
    scene.add(light);
    scene.add(lightHelper);
    scene.add(new THREE.AmbientLight(0xffffff, 0.2));

    // Add objects
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial();
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Add grid helper
    const gridHelper = new THREE.GridHelper(10, 10);
    scene.add(gridHelper);

    // Handle resize
    const handleResize = () => {
      const width = containerRef.current?.clientWidth || 1;
      const height = containerRef.current?.clientHeight || 1;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      cube.rotation.x += 0.005;
      cube.rotation.y += 0.005;
      renderer.render(scene, camera);
    }
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      controls.dispose();
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full" />;
}`;

const morphCode = `import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export function MorphExample() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 3;
    
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);
    
    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    
    // Create geometries for morphing
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const sphereGeometry = new THREE.SphereGeometry(0.8, 32, 32);
    
    // Convert sphere vertices to morph target
    geometry.morphAttributes.position = [];
    geometry.morphAttributes.position[0] = new THREE.Float32BufferAttribute(
      sphereGeometry.attributes.position.array,
      3
    );

    // Create mesh with morph targets
    const material = new THREE.MeshStandardMaterial({
      morphTargets: true,
      color: 0x2196f3,
      metalness: 0.5,
      roughness: 0.5,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Add lighting
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    // Handle resize
    const handleResize = () => {
      const width = containerRef.current?.clientWidth || 1;
      const height = containerRef.current?.clientHeight || 1;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // Animate morph target influence
    let morphInfluence = 0;
    let morphDirection = 1;

    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      
      // Update morph influence
      morphInfluence += 0.01 * morphDirection;
      if (morphInfluence >= 1) morphDirection = -1;
      if (morphInfluence <= 0) morphDirection = 1;
      
      mesh.morphTargetInfluences[0] = morphInfluence;
      mesh.rotation.y += 0.005;
      
      renderer.render(scene, camera);
    }
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      controls.dispose();
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full" />;
}`;

const physicsCode = `import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';

export function PhysicsExample() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;

    // Physics world setup
    const world = new CANNON.World({
      gravity: new CANNON.Vec3(0, -9.82, 0),
    });

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.set(0, 5, 10);
    
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);
    
    // Add ground
    const groundBody = new CANNON.Body({
      type: CANNON.Body.STATIC,
      shape: new CANNON.Plane(),
    });
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    world.addBody(groundBody);

    // Add visual ground
    const groundGeometry = new THREE.PlaneGeometry(10, 10);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x808080,
      metalness: 0.3,
      roughness: 0.7,
    });
    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.receiveShadow = true;
    scene.add(groundMesh);

    // Add lighting
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    light.castShadow = true;
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    // Add grid helper
    const gridHelper = new THREE.GridHelper(10, 10);
    scene.add(gridHelper);

    // Dynamic objects array
    const objects: { body: CANNON.Body; mesh: THREE.Mesh }[] = [];

    // Function to add objects
    function addObject() {
      const radius = 0.2 + Math.random() * 0.3;
      const sphereBody = new CANNON.Body({
        mass: 1,
        shape: new CANNON.Sphere(radius),
        position: new CANNON.Vec3(
          (Math.random() - 0.5) * 4,
          5,
          (Math.random() - 0.5) * 4
        ),
      });
      world.addBody(sphereBody);

      const sphereGeometry = new THREE.SphereGeometry(radius);
      const sphereMaterial = new THREE.MeshStandardMaterial({
        color: Math.random() * 0xffffff,
        metalness: 0.7,
        roughness: 0.3,
      });
      const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphereMesh.castShadow = true;
      scene.add(sphereMesh);

      objects.push({ body: sphereBody, mesh: sphereMesh });
    }

    // Handle resize
    const handleResize = () => {
      const width = containerRef.current?.clientWidth || 1;
      const height = containerRef.current?.clientHeight || 1;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);
      
      world.step(1 / 60);
      
      // Update visual objects
      objects.forEach(({ body, mesh }) => {
        mesh.position.copy(body.position as any);
        mesh.quaternion.copy(body.quaternion as any);
      });
      
      renderer.render(scene, camera);
    }
    animate();

    // Add objects on click
    containerRef.current.addEventListener('click', addObject);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeEventListener('click', addObject);
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full" />;
}`;

const examples = [
  {
    id: "basic",
    title: "Physical Materials",
    description:
      "Explore physically based materials with real-time property adjustments. Demonstrates metalness, roughness, clearcoat, and transmission effects.",
    code: materialCode,
    component: <MaterialExample />,
  },
  {
    id: "interactive",
    title: "Interactive Controls",
    description:
      "Dynamic camera and lighting controls for interactive 3D scenes. Experiment with light positioning and orbit controls for scene exploration.",
    code: interactiveCode,
    component: <InteractiveExample />,
  },
  {
    id: "advanced",
    title: "Geometry Morphing",
    description:
      "Smooth transitions between different 3D shapes using vertex interpolation. Watch as one geometry seamlessly morphs into another.",
    code: morphCode,
    component: <MorphExample />,
  },
  {
    id: "physics",
    title: "Interactive Physics",
    description:
      "Real-time physics simulation with dynamic objects and collisions. Add objects, watch them fall, bounce, and interact with each other.",
    code: physicsCode,
    component: <PhysicsExample />,
  },
];

const tabs = examples.map((example) => ({
  id: example.id,
  label: example.title,
  content: null,
}));

function ThreeExamplesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { section: activeSection } = useActiveSection();

  // If no section is active, default to the first example
  const currentSection = activeSection || tabs[0]!.id;

  // Effect to handle initial section
  useEffect(() => {
    if (!searchParams.get("section")) {
      router.replace(`/examples/3d?section=${tabs[0]!.id}`);
    }
  }, [router, searchParams]);

  // Effect to handle scrolling when section changes
  useEffect(() => {
    if (activeSection) {
      const element = document.getElementById(activeSection);
      if (element) {
        const offset = 120; // Height of sticky header
        const elementRect = element.getBoundingClientRect();
        const scrollOffset = elementRect.top - offset;

        window.scrollBy({
          top: scrollOffset,
          behavior: "smooth",
        });
      }
    }
  }, [activeSection]);

  const handleSectionChange = (sectionId: string) => {
    // Update URL with section parameter
    router.push(`/examples/3d?section=${sectionId}`);
  };

  return (
    <>
      {/* Tab Navigation */}
      <div className="sticky top-24 z-30 bg-background/80 backdrop-blur-sm border-b border-border/10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <TabGroup
            tabs={tabs}
            value={currentSection}
            onChange={handleSectionChange}
            variant="pills"
          />
        </div>
      </div>

      {/* Examples */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-6 space-y-32">
          {examples.map((example) => (
            <ExampleSection
              key={example.id}
              id={example.id}
              category="3d"
              title={example.title}
              description={example.description}
            >
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                {/* Code Preview Card */}
                <Card className="overflow-hidden xl:sticky xl:top-48 xl:self-start">
                  <CardContent className="p-0">
                    <CodePreview code={example.code} />
                  </CardContent>
                </Card>

                {/* 3D Example Card */}
                <Card className="overflow-hidden">
                  <CardContent className="p-8">{example.component}</CardContent>
                </Card>
              </div>
            </ExampleSection>
          ))}
        </div>
      </div>
    </>
  );
}

export default function ThreeExamplesPage() {
  return (
    <ExampleContainer
      _category="3d"
      title="3D Graphics"
      description="Interactive 3D examples demonstrating advanced graphics techniques."
    >
      <Suspense fallback={<div>Loading...</div>}>
        <ThreeExamplesContent />
      </Suspense>
    </ExampleContainer>
  );
}
