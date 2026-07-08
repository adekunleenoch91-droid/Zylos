"use client";

import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import {
  AmbientSculpture,
  type SculptureVariant,
} from "@/components/three/AmbientSculpture";

interface AmbientCanvasProps {
  variant: SculptureVariant;
  reducedMotion: boolean;
  active: boolean;
}

/** Lightweight canvas for sub-page hero backdrops — no shadows, no
 *  post-processing, capped DPR, paused off-screen. */
export default function AmbientCanvas({
  variant,
  reducedMotion,
  active,
}: AmbientCanvasProps) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop={active && !reducedMotion ? "always" : "demand"}
      camera={{ position: [0, 0.4, 7], fov: 40 }}
      gl={{
        antialias: true,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
      }}
      aria-hidden
      className="pointer-events-none"
    >
      <AmbientSculpture variant={variant} reducedMotion={reducedMotion} />
    </Canvas>
  );
}
