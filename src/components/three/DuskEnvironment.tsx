"use client";

import { Environment, Lightformer } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";

/**
 * Shared lighting philosophy for every Zylos scene: a warm low sun,
 * cool ambient blue fill, and a dusk-gradient sky dome. Entirely
 * procedural — no HDR downloads — so it works offline and under CSP.
 */

const skyVertex = /* glsl */ `
  varying vec3 vWorldPosition;
  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const skyFragment = /* glsl */ `
  varying vec3 vWorldPosition;
  uniform vec3 uTop;
  uniform vec3 uHorizon;
  uniform vec3 uGlow;
  uniform vec3 uGlowDirection;
  void main() {
    vec3 dir = normalize(vWorldPosition);
    float h = clamp(dir.y * 0.5 + 0.5, 0.0, 1.0);
    vec3 sky = mix(uHorizon, uTop, pow(h, 0.55));
    // Warm glow around the low sun position
    float glowAmount = pow(max(dot(dir, normalize(uGlowDirection)), 0.0), 6.0);
    sky += uGlow * glowAmount * 0.85;
    gl_FragColor = vec4(sky, 1.0);
  }
`;

export function SkyDome({ sunDirection }: { sunDirection: [number, number, number] }) {
  const uniforms = useMemo(
    () => ({
      uTop: { value: new THREE.Color("#060D22") },
      uHorizon: { value: new THREE.Color("#2B3A63") },
      uGlow: { value: new THREE.Color("#D4AF37") },
      uGlowDirection: { value: new THREE.Vector3(...sunDirection) },
    }),
    [sunDirection],
  );

  return (
    <mesh scale={200}>
      <sphereGeometry args={[1, 32, 24]} />
      <shaderMaterial
        side={THREE.BackSide}
        depthWrite={false}
        vertexShader={skyVertex}
        fragmentShader={skyFragment}
        uniforms={uniforms}
      />
    </mesh>
  );
}

/** Procedural environment map: warm horizon light + cool zenith fill. */
export function DuskEnvironment() {
  return (
    <Environment resolution={64} frames={1}>
      <Lightformer
        intensity={2.4}
        color="#E5C76B"
        position={[8, 1.5, -6]}
        scale={[14, 3, 1]}
        form="rect"
      />
      <Lightformer
        intensity={0.9}
        color="#3B5BA5"
        position={[0, 10, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[24, 24, 1]}
        form="rect"
      />
      <Lightformer
        intensity={0.5}
        color="#F8F7F3"
        position={[-8, 3, 4]}
        scale={[6, 2, 1]}
        form="rect"
      />
    </Environment>
  );
}

/** Key + fill lights shared by every scene. */
export function DuskLights({
  sunPosition = [14, 4, -10] as [number, number, number],
  shadows = true,
}: {
  sunPosition?: [number, number, number];
  shadows?: boolean;
}) {
  return (
    <>
      <ambientLight intensity={0.35} color="#4A5B8C" />
      <directionalLight
        position={sunPosition}
        intensity={2.2}
        color="#E9C877"
        castShadow={shadows}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={60}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-bias={-0.0004}
      />
      <directionalLight
        position={[-10, 6, 8]}
        intensity={0.4}
        color="#5B79C4"
      />
    </>
  );
}
