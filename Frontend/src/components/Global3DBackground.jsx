import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

const PeriodicShockwave = () => {
  const meshRef1 = useRef();
  const meshRef2 = useRef();
  const matRef1 = useRef();
  const matRef2 = useRef();

  useFrame((state) => {
    // Cycles every 10 seconds
    const t = state.clock.elapsedTime % 10;
    
    // First leading pulse
    if (t < 4) {
      // Normalizing time locally for 4 seconds of animation
      const p1 = t / 4; 
      // Scales explosively but smoothly up to large radius
      const s1 = 0.1 + p1 * 25; 
      if (meshRef1.current) meshRef1.current.scale.set(s1, s1, s1);
      // Fades out gracefully as it expands
      if (matRef1.current) matRef1.current.opacity = 0.6 * (1 - Math.pow(p1, 1.5));
    } else {
      if (matRef1.current) matRef1.current.opacity = 0;
    }

    // Second trailing pulse (delayed by 0.5s)
    if (t > 0.5 && t < 4.5) {
      const p2 = (t - 0.5) / 4;
      const s2 = 0.1 + p2 * 25;
      if (meshRef2.current) meshRef2.current.scale.set(s2, s2, s2);
      if (matRef2.current) matRef2.current.opacity = 0.3 * (1 - Math.pow(p2, 1.5));
    } else {
      if (matRef2.current) matRef2.current.opacity = 0;
    }
  });

  return (
    <group rotation={[Math.PI / -2.5, 0, 0]} position={[0, -1, -5]}>
      <mesh ref={meshRef1}>
        <ringGeometry args={[0.98, 1, 64]} />
        <meshBasicMaterial ref={matRef1} color="#fd5c36" transparent blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={meshRef2}>
        <ringGeometry args={[0.95, 1, 64]} />
        <meshBasicMaterial ref={matRef2} color="#aa3bff" transparent blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

const FloatingShapes = () => {
  return (
    <>
      {/* Background large floating wireframe structure */}
      <Float speed={1.5} rotationIntensity={1.5} floatIntensity={2}>
        <mesh position={[-3.5, 1.5, -4]}>
          <torusKnotGeometry args={[1.5, 0.4, 128, 16]} />
          <meshBasicMaterial color="#aa3bff" wireframe transparent opacity={0.15} blending={THREE.AdditiveBlending} />
        </mesh>
      </Float>

      <Float speed={2.5} rotationIntensity={2} floatIntensity={1.5}>
        <mesh position={[4, -1, -2]}>
          <icosahedronGeometry args={[1.2, 1]} />
          <meshBasicMaterial color="#fd5c36" wireframe transparent opacity={0.2} blending={THREE.AdditiveBlending} />
        </mesh>
      </Float>

      <Float speed={1} rotationIntensity={0.5} floatIntensity={3}>
        <mesh position={[0, -2.5, -6]}>
          <octahedronGeometry args={[2.5, 0]} />
          <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.06} blending={THREE.AdditiveBlending} />
        </mesh>
      </Float>
    </>
  );
};

const ParticleSwarm = ({ count, color, size, radius, speedX, speedY }) => {
  const ref = useRef();

  const positions = useMemo(() => {
    const coords = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // creating an appealing swirling galaxy / neural cloud shape
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos((Math.random() * 2) - 1);
      const r = radius + (Math.random() - 0.5) * 2;
      
      coords[i * 3] = r * Math.sin(phi) * Math.cos(theta); // x
      coords[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta); // y
      coords[i * 3 + 2] = r * Math.cos(phi); // z
    }
    return coords;
  }, [count, radius]);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * speedY;
      ref.current.rotation.x += delta * speedX;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={color}
        size={size}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

export default function Global3DBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-[#030303] overflow-hidden">
      <Canvas camera={{ position: [0, 0, 4], fov: 60 }} dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        
        {/* Floating Abstract Tech Geometries */}
        <FloatingShapes />

        {/* 10-second repeating radar/sonar shockwave */}
        <PeriodicShockwave />

        {/* Core vibrant orange/red swarm mimicking future AI energy */}
        <ParticleSwarm count={4000} color="#fd5c36" size={0.015} radius={2.2} speedX={0.02} speedY={0.04} />
        {/* Deep tech purple accent swarm */}
        <ParticleSwarm count={3000} color="#aa3bff" size={0.02} radius={3.2} speedX={-0.015} speedY={-0.025} />
        {/* Sparse white stardust for depth */}
        <ParticleSwarm count={1500} color="#ffffff" size={0.01} radius={4.5} speedX={0.01} speedY={0.015} />
      </Canvas>
      {/* Dynamic overlays to ensure text readability globally */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#030303_100%)] opacity-70" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
    </div>
  );
}
