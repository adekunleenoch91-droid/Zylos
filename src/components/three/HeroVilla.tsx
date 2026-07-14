"use client";

import { MeshReflectorMaterial, Sparkles, Stars } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import type { MotionValue } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";
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
 * cypress silhouettes and drifting fireflies.
 *
 * The camera plays a two-act, scroll-driven journey: a wide establishing
 * push-in, then a smooth eye-level glide that travels laterally past the
 * glass-fronted rooms — as if moving from one room to the next. Cursor
 * movement adds a gentle parallax throughout, so the frame responds to the
 * visitor even when they are not scrolling. All motion is critically
 * damped, so it stays film-smooth at any scroll or pointer speed.
 */
export function HeroVilla({ progress, tier, reducedMotion }: HeroVillaProps) {
  // Scratch vectors reused every frame (no per-frame allocation).
  const orbPos = useMemo(() => new THREE.Vector3(), []);
  const glidePos = useMemo(() => new THREE.Vector3(), []);
  const desired = useMemo(() => new THREE.Vector3(), []);
  const lookTarget = useMemo(() => new THREE.Vector3(0, 1.3, 0), []);
  const estTgt = useMemo(() => new THREE.Vector3(), []);
  const glideTgt = useMemo(() => new THREE.Vector3(), []);

  // Normalized pointer (-1..1) tracked at window level so it works even
  // though the canvas itself is pointer-events-none.
  const pointer = useRef({ x: 0, y: 0 });
  const smoothPtr = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (reducedMotion) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reducedMotion]);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    const t = reducedMotion ? 0.28 : progress.get();

    // Smoothly ease the pointer so parallax never snaps.
    const kp = 1 - Math.exp(-delta * 3);
    smoothPtr.current.x +=
      ((reducedMotion ? 0 : pointer.current.x) - smoothPtr.current.x) * kp;
    smoothPtr.current.y +=
      ((reducedMotion ? 0 : pointer.current.y) - smoothPtr.current.y) * kp;
    const px = smoothPtr.current.x;
    const py = smoothPtr.current.y;

    // 0 = wide establishing shot, 1 = travelling through the rooms.
    const travel = THREE.MathUtils.smoothstep(t, 0.4, 0.85);

    // Act I — wide establishing orbit that pushes in.
    const angle = 0.5 - t * 0.55 + Math.sin(time * 0.08) * 0.03;
    const orbR = 16.5 - t * 9;
    const orbH = 6.4 - t * 4.2;
    orbPos.set(
      Math.sin(angle) * orbR,
      Math.max(orbH, 2.2),
      Math.cos(angle) * orbR,
    );

    // Act II — eye-level dolly gliding laterally in front of the glazing.
    const sweep = t <= 0.4 ? 0 : (t - 0.4) / 0.6;
    glidePos.set(
      THREE.MathUtils.lerp(5.6, -5.6, sweep) + px * 1.4,
      1.55 + py * 0.5 + Math.sin(time * 0.1) * 0.03,
      8.4 + Math.sin(sweep * Math.PI) * 0.5,
    );

    desired.lerpVectors(orbPos, glidePos, travel);
    // Whole-scene look-around from the cursor, strongest while establishing.
    desired.x += px * 0.8 * (1 - travel);
    desired.y += py * 0.5 * (1 - travel);

    const smoothing = reducedMotion ? 1 : 1 - Math.exp(-delta * 2.6);
    state.camera.position.lerp(desired, smoothing);

    // Look target eases from the whole villa to the room passing in front.
    estTgt.set(px * 0.4, 1.3 - t * 0.3, 0);
    glideTgt.set(
      THREE.MathUtils.lerp(4.2, -4.2, sweep) + px * 1.6,
      1.35 + py * 0.6,
      2.2,
    );
    lookTarget.lerpVectors(estTgt, glideTgt, travel);
    state.camera.lookAt(lookTarget);
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

  // Simple interior silhouettes, revealed through the glazing on the glide.
  const furniture = useMemo(
    () =>
      [
        // [x, y, z, w, h, d] — sofa, coffee table, dining, bed, console
        [-2.4, 0.2, 0.7, 1.7, 0.4, 0.7],
        [-2.4, 0.11, 1.5, 0.85, 0.16, 0.5],
        [0.2, 0.19, 0.1, 1.5, 0.36, 0.75],
        [2.5, 0.2, -0.4, 1.5, 0.36, 2.0],
        [0.2, 0.35, -2.0, 2.4, 0.6, 0.18],
      ] as const,
    [],
  );

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
        {/* Lower volume — an open, glass-fronted room shell so the interior
            reads when the camera glides past. Walls + floor + ceiling frame
            the volume; the front is glass. */}
        <group>
          <mesh position={[0, 0.02, 0]} receiveShadow>
            <boxGeometry args={[8, 0.08, 5]} />
            <meshStandardMaterial color="#241C10" roughness={0.85} metalness={0.1} />
          </mesh>
          {/* back wall */}
          <mesh position={[0, 0.62, -2.44]} castShadow receiveShadow>
            <boxGeometry args={[8, 1.28, 0.14]} />
            <meshStandardMaterial color="#1E2745" roughness={0.55} metalness={0.25} />
          </mesh>
          {/* side walls */}
          <mesh position={[-3.94, 0.62, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.14, 1.28, 5]} />
            <meshStandardMaterial color="#1B2440" roughness={0.6} metalness={0.2} />
          </mesh>
          <mesh position={[3.94, 0.62, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.14, 1.28, 5]} />
            <meshStandardMaterial color="#1B2440" roughness={0.6} metalness={0.2} />
          </mesh>
          {/* ceiling slab capping the room */}
          <mesh position={[0, 1.28, 0]} castShadow>
            <boxGeometry args={[8, 0.1, 5]} />
            <meshStandardMaterial color="#161E38" roughness={0.5} metalness={0.3} />
          </mesh>
          {/* glass front */}
          <mesh position={[0, 0.62, 2.5]}>
            <planeGeometry args={[8, 1.28]} />
            <meshStandardMaterial
              color="#9FB6C9"
              transparent
              opacity={0.14}
              roughness={0.05}
              metalness={0.9}
              envMapIntensity={1.4}
            />
          </mesh>
        </group>

        {/* Interior silhouettes */}
        {furniture.map(([x, y, z, w, h, d], i) => (
          <mesh key={i} position={[x, y, z]} castShadow>
            <boxGeometry args={[w, h, d]} />
            <meshStandardMaterial color="#17110A" roughness={0.85} metalness={0.1} />
          </mesh>
        ))}
        {/* Warm interior light so the rooms glow through the glass */}
        {tier !== "low" && (
          <>
            <pointLight
              position={[-2.2, 0.95, 0.3]}
              intensity={highQuality ? 3.2 : 2.2}
              color="#F0C878"
              distance={5.5}
              decay={2}
            />
            {highQuality && (
              <pointLight
                position={[2.3, 0.95, -0.3]}
                intensity={2.6}
                color="#E8B268"
                distance={5.5}
                decay={2}
              />
            )}
          </>
        )}
        {/* A small emissive lamp accent inside */}
        <mesh position={[-3.2, 0.5, 1.9]}>
          <sphereGeometry args={[0.09, 12, 12]} />
          <meshStandardMaterial
            color="#3A2E10"
            emissive="#F4D48A"
            emissiveIntensity={1.4}
            toneMapped={false}
          />
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
