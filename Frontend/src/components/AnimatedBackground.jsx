import React, { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const RadialTunnel = () => {
  const groupRef = useRef();
  const { mouse } = useThree();

  const spokesCount = 12;
  const ringsCount = 8;
  const maxRadius = 18;
  const depth = 28;

  const points = useMemo(() => {
    const pts = [];

    // Long perspective spokes from center to depth.
    for (let i = 0; i < spokesCount; i++) {
      const angle = (i / spokesCount) * Math.PI * 2;
      pts.push(new THREE.Vector3(0, 0, -0.8));
      pts.push(
        new THREE.Vector3(
          Math.cos(angle) * maxRadius,
          Math.sin(angle) * maxRadius,
          -depth
        )
      );
    }
    
    // Broken arc rings to mimic reference image styling.
    for (let r = 1; r <= ringsCount; r++) {
      const t = r / ringsCount;
      const radius = Math.pow(t, 1.4) * maxRadius;
      const z = -1 - t * depth;
      const segmentCount = 5;

      for (let s = 0; s < segmentCount; s++) {
        const start = (s / segmentCount) * Math.PI * 2 + 0.12;
        const end = start + (Math.PI * 2) / segmentCount - 0.55;
        const steps = 14;

        for (let step = 0; step < steps; step++) {
          const a1 = start + ((end - start) * step) / steps;
          const a2 = start + ((end - start) * (step + 1)) / steps;
          pts.push(new THREE.Vector3(Math.cos(a1) * radius, Math.sin(a1) * radius, z));
          pts.push(new THREE.Vector3(Math.cos(a2) * radius, Math.sin(a2) * radius, z));
        }
      }
    }

    return pts;
  }, [spokesCount, ringsCount, depth, maxRadius]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    return geo;
  }, [points]);

  useFrame((_, delta) => {
    if (groupRef.current) {
      const targetX = mouse.y * 0.18;
      const targetY = mouse.x * 0.22;

      groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.045;
      groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * 0.045;
      groupRef.current.rotation.z += delta * 0.03;
    }
  });

  return (
    <group ref={groupRef} position={[0.6, -0.2, 0]}>
      <lineSegments geometry={geometry}>
        <lineBasicMaterial color="#d4d4d8" transparent opacity={0.44} />
      </lineSegments>
    </group>
  );
};

const EmberParticles = () => {
  const emberRef = useRef();
  const particleCount = 44;

  const positions = useMemo(() => {
    const data = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.8 + Math.random() * 8;
      const z = -0.5 - Math.random() * 24;
      data[i * 3] = Math.cos(angle) * radius;
      data[i * 3 + 1] = Math.sin(angle) * radius;
      data[i * 3 + 2] = z;
    }
    return data;
  }, []);

  useFrame((_, delta) => {
    if (emberRef.current) {
      emberRef.current.rotation.z += delta * 0.07;
      emberRef.current.position.z += delta * 1.25;
      if (emberRef.current.position.z > 2) {
        emberRef.current.position.z = -10;
      }
    }
  });

  return (
    <points ref={emberRef} position={[0.7, -0.2, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particleCount} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.13} color="#fd5c36" transparent opacity={0.78} sizeAttenuation />
    </points>
  );
};

export default function AnimatedBackground({ className = "", sceneOpacity = 1, overlayOpacity = 0.54 }) {
  return (
    <div className={`absolute inset-0 z-0 bg-transparent overflow-hidden pointer-events-none ${className}`}>
      <Canvas camera={{ position: [0, 0, 5.5], fov: 66 }} style={{ opacity: sceneOpacity }}>
        <color attach="background" args={["#000000"]} />
        <ambientLight intensity={0.86} />
        <RadialTunnel />
        <EmberParticles />
      </Canvas>
      <div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/30 to-[#050505]/86 pointer-events-none"
        style={{ opacity: overlayOpacity }} 
      />
    </div>
  );
}
