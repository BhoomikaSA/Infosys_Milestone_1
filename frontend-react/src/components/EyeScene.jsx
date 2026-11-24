
import { useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

function RetinaModel() {
  const retinaRef = useRef();

  const texture = useLoader(
    THREE.TextureLoader,
    "/retina-texture.png"
  );

  texture.colorSpace = THREE.SRGBColorSpace;

  useFrame((state) => {
    if (retinaRef.current) {
      retinaRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.2) * 0.08;
    }
  });

  return (
    <group ref={retinaRef}>
      <mesh>
        <sphereGeometry
          args={[1.45, 96, 96, 0, Math.PI * 2, 0.15, 1.25]}
        />
        <meshPhysicalMaterial
          map={texture}
          roughness={0.55}
          metalness={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

export default function EyeScene() {
  return (
    <Canvas camera={{ position: [0, 0, 4.5], fov: 42 }} dpr={[1, 2]}>
      <ambientLight intensity={1.2} />
      <directionalLight position={[3, 3, 4]} intensity={2} />
      <pointLight
        position={[-3, 1, 3]}
        color="#168BFF"
        intensity={8}
      />

      <Float speed={1} rotationIntensity={0.05} floatIntensity={0.1}>
        <RetinaModel />
      </Float>
    </Canvas>
  );
}
