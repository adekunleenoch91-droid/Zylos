"use client";

import { Canvas } from "@react-three/fiber";
import {
  Bloom,
  EffectComposer,
  Vignette,
} from "@react-three/postprocessing";
import type { MotionValue } from "framer-motion";
import * as THREE from "three";
import { HeroVilla } from "@/components/three/HeroVilla";
import type { QualityTier } from "@/hooks/useQualityTier";

interface HeroCanvasProps {
  progress: MotionValue<number>;
  tier: Exclude<QualityTier, "fallback">;
  reducedMotion: boolean;
  active: boolean;
}

/**
 * WebGL canvas for the homepage hero. Device pixel ratio, shadows and
 * post-processing all scale with the detected quality tier, and rendering
 * pauses entirely while the hero is off-screen.
 */
export default function HeroCanvas({
  progress,
  tier,
  reducedMotion,
  active,
}: HeroCanvasProps) {
  const dpr: [number, number] =
    tier === "high" ? [1, 2] : tier === "medium" ? [1, 1.5] : [1, 1.25];

  return (
    <Canvas
      dpr={dpr}
      shadows={tier === "high"}
      frameloop={active ? "always" : "never"}
      camera={{ position: [8.6, 6.2, 13.7], fov: 42, near: 0.1, far: 250 }}
      gl={{
        antialias: tier !== "low",
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
      }}
      aria-hidden
      className="pointer-events-none"
    >
      <HeroVilla progress={progress} tier={tier} reducedMotion={reducedMotion} />
      {tier === "high" && (
        <EffectComposer multisampling={4}>
          <Bloom
            intensity={0.55}
            luminanceThreshold={0.85}
            luminanceSmoothing={0.3}
            mipmapBlur
          />
          <Vignette eskil={false} offset={0.18} darkness={0.72} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
