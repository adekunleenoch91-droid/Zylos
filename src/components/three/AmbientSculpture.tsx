"use client";

import { Float, Sparkles } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import {
  DuskEnvironment,
  DuskLights,
} from "@/components/three/DuskEnvironment";

export type SculptureVariant =
  | "monolith"
  | "orbit"
  | "panels"
  | "columns"
  | "gallery";

const stone = { color: "#232D4A", roughness: 0.55, metalness: 0.3 };
const goldMat = {
  color: "#D4AF37",
  emissive: "#D4AF37",
  emissiveIntensity: 0.35,
  roughness: 0.25,
  metalness: 0.9,
};
const glass = {
  color: "#1A2238",
  roughness: 0.15,
  metalness: 0.6,
  transparent: true,
  opacity: 0.75,
};

/** Variant geometry: each page receives its own abstract composition
 *  built from the same material language for cross-scene continuity. */
function SculptureGeometry({ variant }: { variant: SculptureVariant }) {
  const elements = useMemo(() => {
    switch (variant) {
      case "monolith":
        return (
          <>
            {[0, 1, 2, 3].map((i) => (
              <mesh key={i} position={[0, i * 0.62 - 0.9, 0]} rotation={[0, i * 0.35, 0]}>
                <boxGeometry args={[2.4 - i * 0.35, 0.5, 2.4 - i * 0.35]} />
                <meshStandardMaterial {...stone} />
              </mesh>
            ))}
            <mesh position={[0, 1.68, 0]} rotation={[0, 1.4, 0]}>
              <boxGeometry args={[1.15, 0.08, 1.15]} />
              <meshStandardMaterial {...goldMat} />
            </mesh>
          </>
        );
      case "orbit":
        return (
          <>
            <mesh rotation={[Math.PI / 2.4, 0, 0]}>
              <torusGeometry args={[1.9, 0.035, 16, 96]} />
              <meshStandardMaterial {...goldMat} />
            </mesh>
            <mesh>
              <boxGeometry args={[1.1, 1.5, 1.1]} />
              <meshStandardMaterial {...stone} />
            </mesh>
            {[0, 1, 2, 3, 4].map((i) => {
              const a = (i / 5) * Math.PI * 2;
              return (
                <mesh key={i} position={[Math.cos(a) * 1.9, Math.sin(a) * 0.5, Math.sin(a) * 1.6]}>
                  <boxGeometry args={[0.3, 0.3, 0.3]} />
                  <meshStandardMaterial {...glass} />
                </mesh>
              );
            })}
          </>
        );
      case "panels":
        return (
          <>
            {[-1.4, 0, 1.4].map((x, i) => (
              <mesh key={i} position={[x, i * 0.25 - 0.2, -Math.abs(x) * 0.4]} rotation={[0, -x * 0.25, 0]}>
                <boxGeometry args={[1.15, 1.6, 0.06]} />
                <meshStandardMaterial {...glass} />
              </mesh>
            ))}
            <mesh position={[0, -1.15, 0]}>
              <boxGeometry args={[4.4, 0.08, 0.5]} />
              <meshStandardMaterial {...goldMat} />
            </mesh>
          </>
        );
      case "columns":
        return (
          <>
            {[-1.8, -0.6, 0.6, 1.8].map((x, i) => (
              <mesh key={i} position={[x, (i % 2) * 0.3 - 0.4, (i % 2) * -0.6]}>
                <cylinderGeometry args={[0.16, 0.2, 2.2 + (i % 2) * 0.6, 24]} />
                <meshStandardMaterial {...stone} />
              </mesh>
            ))}
            <mesh position={[0, 1.15, -0.3]} rotation={[0, 0.15, 0]}>
              <boxGeometry args={[4.4, 0.1, 1.2]} />
              <meshStandardMaterial {...goldMat} />
            </mesh>
          </>
        );
      case "gallery":
        return (
          <>
            {[-1.5, 0.2, 1.7].map((x, i) => (
              <group key={i} position={[x, i * 0.3 - 0.3, -i * 0.5]} rotation={[0, -0.2 + i * 0.2, 0]}>
                <mesh>
                  <boxGeometry args={[1.3, 0.9, 0.05]} />
                  <meshStandardMaterial {...glass} />
                </mesh>
                <mesh position={[0, 0, -0.01]}>
                  <boxGeometry args={[1.42, 1.02, 0.03]} />
                  <meshStandardMaterial {...goldMat} emissiveIntensity={0.2} />
                </mesh>
              </group>
            ))}
          </>
        );
    }
  }, [variant]);

  return <>{elements}</>;
}

interface AmbientSculptureProps {
  variant: SculptureVariant;
  reducedMotion: boolean;
}

/** Slowly rotating abstract architectural composition with dusk lighting. */
export function AmbientSculpture({
  variant,
  reducedMotion,
}: AmbientSculptureProps) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current || reducedMotion) return;
    group.current.rotation.y = state.clock.elapsedTime * 0.08;
  });

  return (
    <>
      <color attach="background" args={["#0A142F"]} />
      <fog attach="fog" args={["#0A142F", 6, 18]} />
      <DuskLights sunPosition={[8, 4, -6]} shadows={false} />
      <DuskEnvironment />
      <Float
        speed={reducedMotion ? 0 : 1.4}
        rotationIntensity={reducedMotion ? 0 : 0.12}
        floatIntensity={reducedMotion ? 0 : 0.5}
      >
        <group ref={group}>
          <SculptureGeometry variant={variant} />
        </group>
      </Float>
      <Sparkles
        count={30}
        scale={[9, 5, 6]}
        size={1.6}
        speed={reducedMotion ? 0 : 0.2}
        color="#E5C76B"
        opacity={0.5}
      />
    </>
  );
}
