"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { PropertyMassing } from "@/components/three/PropertyMassing";
import type { PropertyType } from "@/types";

interface PropertyViewerCanvasProps {
  type: PropertyType;
  autoRotate: boolean;
  active: boolean;
  highQuality: boolean;
}

/**
 * Interactive 3D viewer canvas. Drag to orbit the residence; auto-rotation
 * pauses on interaction and while off-screen. Zoom is bounded so the massing
 * always stays elegantly framed.
 */
export default function PropertyViewerCanvas({
  type,
  autoRotate,
  active,
  highQuality,
}: PropertyViewerCanvasProps) {
  return (
    <Canvas
      dpr={highQuality ? [1, 2] : [1, 1.5]}
      frameloop={active ? "always" : "demand"}
      camera={{ position: [4.5, 3, 5.5], fov: 40 }}
      gl={{
        antialias: true,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
      }}
    >
      <PropertyMassing type={type} autoRotate={autoRotate} />
      <OrbitControls
        enablePan={false}
        enableZoom
        minDistance={4.5}
        maxDistance={9}
        minPolarAngle={0.4}
        maxPolarAngle={Math.PI / 2.05}
        autoRotate={false}
        target={[0, 0.7, 0]}
        makeDefault
      />
    </Canvas>
  );
}
