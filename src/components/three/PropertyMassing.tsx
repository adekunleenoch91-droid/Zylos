"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { DuskEnvironment, DuskLights } from "@/components/three/DuskEnvironment";
import type { PropertyType } from "@/types";

const stone = { color: "#232D4A", roughness: 0.55, metalness: 0.28 };
const stoneWarm = { color: "#2A3552", roughness: 0.6, metalness: 0.2 };
const glass = {
  color: "#3A2E10",
  emissive: "#E9C877",
  emissiveIntensity: 0.5,
  roughness: 0.2,
  metalness: 0.1,
  toneMapped: false,
};
const goldTrim = {
  color: "#D4AF37",
  emissive: "#D4AF37",
  emissiveIntensity: 0.5,
  roughness: 0.3,
  metalness: 0.9,
};

/** Deterministic window luminance so re-renders stay stable. */
function seeded(i: number) {
  const x = Math.sin(i * 91.73 + 47.11) * 43758.5453;
  return x - Math.floor(x);
}

/** A row of lit glazing panels across a facade. */
function Glazing({
  count,
  y,
  z,
  spread,
  size,
  seedBase,
}: {
  count: number;
  y: number;
  z: number;
  spread: number;
  size: [number, number];
  seedBase: number;
}) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const x = -spread / 2 + (i * spread) / (count - 1 || 1);
        return (
          <mesh key={i} position={[x, y, z]}>
            <planeGeometry args={size} />
            <meshStandardMaterial
              {...glass}
              emissiveIntensity={0.35 + seeded(seedBase + i) * 0.5}
            />
          </mesh>
        );
      })}
    </>
  );
}

/** Type-specific building massing, composed from shared materials. */
function Massing({ type }: { type: PropertyType }) {
  switch (type) {
    case "penthouse":
      return (
        <group position={[0, -0.2, 0]}>
          {/* Tower shaft */}
          <mesh position={[0, 0.9, 0]} castShadow>
            <boxGeometry args={[1.7, 3.4, 1.7]} />
            <meshStandardMaterial {...stone} />
          </mesh>
          {/* Crown penthouse volume */}
          <mesh position={[0, 2.85, 0]} castShadow>
            <boxGeometry args={[2.1, 0.7, 2.1]} />
            <meshStandardMaterial {...stoneWarm} />
          </mesh>
          {/* Roof slab + garden */}
          <mesh position={[0, 3.24, 0]}>
            <boxGeometry args={[2.3, 0.08, 2.3]} />
            <meshStandardMaterial {...goldTrim} />
          </mesh>
          {[1.75, 2.85].map((y, r) => (
            <group key={r}>
              <Glazing count={4} y={y - 0.9 + 0.9} z={0.86} spread={1.2} size={[0.22, 0.6]} seedBase={r * 10} />
            </group>
          ))}
          <Glazing count={4} y={2.85} z={1.06} spread={1.4} size={[0.28, 0.45]} seedBase={30} />
        </group>
      );
    case "estate":
      return (
        <group position={[0, -0.2, 0]}>
          {/* Three low pavilions */}
          {[
            [-1.6, 0, 0.3, 1.4],
            [0.2, 0, -0.4, 1.8],
            [1.9, 0, 0.5, 1.2],
          ].map(([x, , z, w], i) => (
            <group key={i} position={[x, 0, z]}>
              <mesh position={[0, 0.5, 0]} castShadow>
                <boxGeometry args={[w, 1, 1.3]} />
                <meshStandardMaterial {...(i === 1 ? stoneWarm : stone)} />
              </mesh>
              <mesh position={[0, 1.02, 0]}>
                <boxGeometry args={[w + 0.2, 0.06, 1.5]} />
                <meshStandardMaterial {...stone} color="#0D1530" />
              </mesh>
              <Glazing count={3} y={0.5} z={0.66} spread={w * 0.6} size={[0.22, 0.5]} seedBase={i * 12} />
            </group>
          ))}
          {/* Connecting gold walkway */}
          <mesh position={[0.15, 0.06, 1]}>
            <boxGeometry args={[3.8, 0.04, 0.12]} />
            <meshStandardMaterial {...goldTrim} emissiveIntensity={0.4} />
          </mesh>
        </group>
      );
    case "chalet":
      return (
        <group position={[0, -0.2, 0]}>
          {/* Base */}
          <mesh position={[0, 0.55, 0]} castShadow>
            <boxGeometry args={[2.4, 1.1, 1.9]} />
            <meshStandardMaterial {...stoneWarm} color="#3A2E22" roughness={0.85} metalness={0.05} />
          </mesh>
          {/* Pitched roof */}
          <mesh position={[0, 1.55, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
            <coneGeometry args={[1.9, 0.9, 4]} />
            <meshStandardMaterial color="#1A2238" roughness={0.7} metalness={0.1} />
          </mesh>
          <Glazing count={4} y={0.6} z={0.96} spread={1.7} size={[0.26, 0.6]} seedBase={5} />
          <mesh position={[0, 1.02, 0]}>
            <boxGeometry args={[2.6, 0.04, 2.1]} />
            <meshStandardMaterial {...goldTrim} emissiveIntensity={0.35} />
          </mesh>
        </group>
      );
    case "apartment":
      return (
        <group position={[0, -0.2, 0]}>
          <mesh position={[0, 1.1, 0]} castShadow>
            <boxGeometry args={[2.6, 2.2, 1.4]} />
            <meshStandardMaterial {...stone} />
          </mesh>
          {/* Terrace cantilever */}
          <mesh position={[0, 0.7, 0.9]} castShadow>
            <boxGeometry args={[2.6, 0.08, 0.5]} />
            <meshStandardMaterial {...goldTrim} emissiveIntensity={0.3} />
          </mesh>
          {[0.7, 1.35, 2].map((y, r) => (
            <Glazing key={r} count={5} y={y} z={0.71} spread={2} size={[0.24, 0.4]} seedBase={r * 8} />
          ))}
        </group>
      );
    case "villa":
    default:
      return (
        <group position={[0, -0.2, 0]}>
          {/* Lower volume */}
          <mesh position={[0, 0.5, 0]} castShadow>
            <boxGeometry args={[2.8, 1, 1.8]} />
            <meshStandardMaterial {...stone} />
          </mesh>
          {/* Upper cantilevered volume */}
          <mesh position={[-0.3, 1.35, -0.2]} castShadow>
            <boxGeometry args={[2.2, 0.9, 1.5]} />
            <meshStandardMaterial {...stoneWarm} />
          </mesh>
          {/* Floating roof */}
          <mesh position={[-0.3, 1.84, -0.2]}>
            <boxGeometry args={[2.5, 0.07, 1.7]} />
            <meshStandardMaterial color="#0D1530" roughness={0.4} metalness={0.5} />
          </mesh>
          <mesh position={[-0.3, 1.84, 0.66]}>
            <boxGeometry args={[2.5, 0.04, 0.05]} />
            <meshStandardMaterial {...goldTrim} />
          </mesh>
          <Glazing count={5} y={0.5} z={0.91} spread={2.1} size={[0.26, 0.55]} seedBase={2} />
          <Glazing count={4} y={1.35} z={0.56} spread={1.6} size={[0.24, 0.45]} seedBase={40} />
          {/* Reflecting pool */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.2, 0.01, 1.7]}>
            <planeGeometry args={[2.6, 1]} />
            <meshStandardMaterial color="#12224C" roughness={0.15} metalness={0.8} envMapIntensity={1.3} />
          </mesh>
        </group>
      );
  }
}

interface PropertyMassingProps {
  type: PropertyType;
  autoRotate: boolean;
}

/** Rotating architectural massing of a specific residence. */
export function PropertyMassing({ type, autoRotate }: PropertyMassingProps) {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (group.current && autoRotate) {
      group.current.rotation.y += delta * 0.18;
    }
  });

  const platform = useMemo(() => new THREE.Color("#141B33"), []);

  return (
    <>
      <color attach="background" args={["#0A142F"]} />
      <fog attach="fog" args={["#0A142F", 7, 20]} />
      <DuskLights sunPosition={[6, 5, 4]} shadows={false} />
      <DuskEnvironment />
      <group ref={group}>
        {/* Terrace platform */}
        <mesh position={[0, -0.28, 0]} receiveShadow>
          <cylinderGeometry args={[3, 3.2, 0.16, 48]} />
          <meshStandardMaterial color={platform} roughness={0.9} metalness={0.05} />
        </mesh>
        {/* Thin gold rim traced around the platform edge */}
        <mesh position={[0, -0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.98, 0.012, 12, 64]} />
          <meshStandardMaterial {...goldTrim} emissiveIntensity={0.35} />
        </mesh>
        <Massing type={type} />
      </group>
    </>
  );
}
