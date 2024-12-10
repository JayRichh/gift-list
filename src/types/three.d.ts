import { OrbitControls } from "@react-three/drei";
import { ReactThreeFiber } from "@react-three/fiber";
import * as THREE from "three";

declare module "@react-three/fiber" {
  interface ThreeElements {
    orbitControls: ReactThreeFiber.Object3DNode<OrbitControls, typeof OrbitControls>;
    mesh: ReactThreeFiber.Object3DNode<THREE.Mesh, typeof THREE.Mesh> & {
      castShadow?: boolean;
      receiveShadow?: boolean;
    };
    ambientLight: ReactThreeFiber.Object3DNode<THREE.AmbientLight, typeof THREE.AmbientLight> & {
      intensity?: number;
    };
    directionalLight: ReactThreeFiber.Object3DNode<
      THREE.DirectionalLight,
      typeof THREE.DirectionalLight
    > & {
      intensity?: number;
      castShadow?: boolean;
      "shadow-mapSize"?: number[];
    };
    boxGeometry: ReactThreeFiber.BufferGeometryNode<THREE.BoxGeometry, typeof THREE.BoxGeometry>;
    sphereGeometry: ReactThreeFiber.BufferGeometryNode<
      THREE.SphereGeometry,
      typeof THREE.SphereGeometry
    >;
    meshStandardMaterial: ReactThreeFiber.MaterialNode<
      THREE.MeshStandardMaterial,
      typeof THREE.MeshStandardMaterial
    > & {
      color?: string | number;
    };
    planeGeometry: ReactThreeFiber.BufferGeometryNode<
      THREE.PlaneGeometry,
      typeof THREE.PlaneGeometry
    >;
    pointLight: ReactThreeFiber.Object3DNode<THREE.PointLight, typeof THREE.PointLight>;
    spotLight: ReactThreeFiber.Object3DNode<THREE.SpotLight, typeof THREE.SpotLight>;
    group: ReactThreeFiber.Object3DNode<THREE.Group, typeof THREE.Group>;
  }
}

declare module "three-stdlib" {
  export * from "three/examples/jsm/controls/OrbitControls";
}
