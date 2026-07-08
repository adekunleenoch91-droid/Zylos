"use client";

import { MeshReflectorMaterial, Sparkles, Stars } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import type { MotionValue } from "framer-motion";
import { useMemo } from "react";
import * as THREE from "three";
import {
  DuskEnvironment,
  DuskLights,
  SkyDome,
} from "@/components/three/DuskEnvironment";
import type { QualityTier } from "@/hooks/useQualityTier";

const SUN_POSITION: [number, number, number] = [16, 3.2, -12];

/* Deterministic pseudo-random for window lighting. */
function seeded(i: number) {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

interface HeroVillaProps {
  /** Scroll progress 0→1 across the hero's scroll range. */
  progress: MotionValue<number>;
  tier: Exclude<QualityTier, "fallback">;
  reducedMotion: boolean;
}

/**
 * The Zylos hero environment: an original modernist villa at dusk —
 * cantilevered volumes with warm lit glazing above a reflecting pool,
 * cypress silhouettes, drifting fireflies and a slow cinematic camera
 * that pushes in as the visitor scrolls.
 */
export function HeroVilla({ progress, tier, reducedMotion }: HeroVillaProps) {
  const cameraTarget = useMemo(() => new THREE.Vector3(0, 1.3, 0), []);
  const desired = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    const t = reducedMotion ? 0.35 : progress.get();
    const time = state.clock.elapsedTime;

    // Cinematic dolly: wide establishing shot → low intimate push-in,
    // with a slow orbital drift so the frame never feels static.
    const angle = 0.55 - t * 0.85 + (reducedMotion ? 0 : Math.sin(time * 0.08) * 0.04);
    const radius = 16.5 - t * 8.5;
    const height = 6.2 - t * 4.2 + (reducedMotion ? 0 : Math.sin(time * 0.12) * 0.08);

    desired.set(
      Math.sin(angle) * radius,
      Math.max(height, 1.4),
      Math.cos(angle) * radius,
    );
    // Critically-damped easing keeps movement film-smooth at any scroll speed.
    const smoothing = 1 - Math.exp(-delta * 2.6);
    state.camera.position.lerp(desired, reducedMotion ? 1 : smoothing);

    cameraTarget.set(0, 1.3 - t * 0.35, 0);
    state.camera.lookAt(cameraTarget);
  });

  const windows = useMemo(() => {
    const list: {
      position: [number, number, number];
      size: [number, number];
      intensity: number;
    }[] = [];
    // Lower volume glazing band (front face)
    for (let i = 0; i < 7; i++) {
      list.push({
        position: [-3.1 + i * 1.05, 0.62, 2.53],
        size: [0.82, 0.88],
        intensity: 0.55 + seeded(i) * 0.45,
      });
    }
    // Upper volume glazing
    for (let i = 0; i < 5; i++) {
      list.push({
        position: [-3.4 + i * 1.06, 1.86, 1.53],
        size: [0.84, 0.72],
        intensity: 0.4 + seeded(i + 20) * 0.6,
      });
    }
    // Core tower slit windows
    for (let i = 0; i < 3; i++) {
      list.push({
        position: [3.05, 0.7 + i * 0.85, 1.16],
        size: [0.5, 0.32],
        intensity: 0.5 + seeded(i + 40) * 0.5,
      });
    }
    return list;
  }, []);

  const cypresses = useMemo(
    () =>
      [
        [-7.5, 0, 1.5, 1.8],
        [-6.3, 0, 3.4, 2.4],
        [7.2, 0, 2.2, 2.1],
        [8.4, 0, -0.6, 1.6],
        [-8.6, 0, -1.8, 2.0],
        [6.1, 0, 4.4, 1.5],
      ] as const,
    [],
  );

  const highQuality = tier === "high";

  return (
    <>
      <SkyDome sunDirection={SUN_POSITION} />
      <DuskLights sunPosition={SUN_POSITION} shadows={highQuality} />
      <DuskEnvironment />
      <fog attach="fog" args={["#0A142F", 18, 90]} />

      {/* Night sky */}
      <Stars
        radius={120}
        depth={40}
        count={tier === "low" ? 800 : 2200}
        factor={3}
        saturation={0}
        fade
        speed={reducedMotion ? 0 : 0.4}
      />

      {/* Stone terrace platform */}
      <mesh position={[0, -0.14, 0]} receiveShadow>
        <cylinderGeometry args={[11.5, 12.2, 0.28, 48]} />
        <meshStandardMaterial color="#141B33" roughness={0.9} metalness={0.05} />
      </mesh>

      {/* The villa */}
      <group position={[0, 0, 0]}>
        {/* Lower volume */}
        <mesh position={[0, 0.62, 0]} castShadow receiveShadow>
          <boxGeometry args={[8, 1.28, 5]} />
          <meshStandardMaterial color="#1E2745" roughness={0.55} metalness={0.25} />
        </mesh>
        {/* Upper cantilevered volume */}
        <mesh position={[-0.8, 1.86, -0.5]} castShadow receiveShadow>
          <boxGeometry args={[6.4, 1.12, 4]} />
          <meshStandardMaterial color="#232D4A" roughness={0.5} metalness={0.3} />
        </mesh>
        {/* Floating roof slab */}
        <mesh position={[-0.8, 2.52, -0.5]} castShadow>
          <boxGeometry args={[7.2, 0.14, 4.7]} />
          <meshStandardMaterial color="#0D1530" roughness={0.4} metalness={0.5} />
        </mesh>
        {/* Roof gold trim */}
        <mesh position={[-0.8, 2.52, 1.88]}>
          <boxGeometry args={[7.2, 0.05, 0.06]} />
          <meshStandardMaterial
            color="#D4AF37"
            emissive="#D4AF37"
            emissiveIntensity={0.6}
            roughness={0.3}
            metalness={0.9}
          />
        </mesh>
        {/* Stone core tower */}
        <mesh position={[3.1, 1.5, 0.5]} castShadow receiveShadow>
          <boxGeometry args={[1.3, 3, 1.3]} />
          <meshStandardMaterial color="#2A3552" roughness={0.75} metalness={0.15} />
        </mesh>
        {/* Warm lit glazing */}
        {windows.map((win, i) => (
          <mesh key={i} position={win.position}>
            <planeGeometry args={win.size} />
            <meshStandardMaterial
              color="#3A2E10"
              emissive="#E9C877"
              emissiveIntensity={win.intensity}
              roughness={0.2}
              metalness={0.1}
              toneMapped={false}
            />
          </mesh>
        ))}
        {/* Entry light column */}
        <pointLight position={[0, 1.2, 3.2]} intensity={4} color="#E5C76B" distance={9} decay={2} />
      </group>

      {/* Infinity pool */}
      <group position={[0.4, 0.02, 4.6]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[7.5, 3.4]} />
          {highQuality ? (
            <MeshReflectorMaterial
              blur={[280, 60]}
              resolution={512}
              mixBlur={0.9}
              mixStrength={2.2}
              roughness={0.6}
              depthScale={0.4}
              minDepthThreshold={0.4}
              maxDepthThreshold={1.2}
              color="#0E1B3E"
              metalness={0.55}
              mirror={0.75}
            />
          ) : (
            <meshStandardMaterial
              color="#12224C"
              roughness={0.15}
              metalness={0.8}
              envMapIntensity={1.4}
            />
          )}
        </mesh>
        {/* Bronze pool rim */}
        <mesh position={[0, 0.015, 1.74]}>
          <boxGeometry args={[7.7, 0.06, 0.12]} />
          <meshStandardMaterial color="#8A7A55" roughness={0.4} metalness={0.6} />
        </mesh>
      </group>

      {/* Cypress silhouettes */}
      {cypresses.map(([x, y, z, h], i) => (
        <group key={i} position={[x, y, z]}>
          <mesh position={[0, h / 2, 0]} castShadow>
            <coneGeometry args={[h * 0.16, h, 8]} />
            <meshStandardMaterial color="#0C1428" roughness={1} />
          </mesh>
        </group>
      ))}

      {/* Fireflies drifting over the garden */}
      {tier !== "low" && (
        <Sparkles
          count={tier === "high" ? 90 : 40}
          scale={[18, 4, 14]}
          position={[0, 1.6, 2]}
          size={2.2}
          speed={reducedMotion ? 0 : 0.28}
          color="#E5C76B"
          opacity={0.7}
        />
      )}
    </>
  );
}
