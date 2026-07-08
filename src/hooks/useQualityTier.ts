"use client";

import { useEffect, useState } from "react";

export type QualityTier = "high" | "medium" | "low" | "fallback";

interface NavigatorCapabilities extends Navigator {
  deviceMemory?: number;
}

/**
 * Heuristic device-capability detection driving adaptive 3D quality:
 *  - high:    desktops with ample memory/cores — full post-processing
 *  - medium:  tablets / mid-range — reduced DPR, no expensive effects
 *  - low:     constrained mobiles — minimal geometry, no post-processing
 *  - fallback: WebGL unavailable — static hero is rendered instead
 */
export function useQualityTier(): QualityTier | null {
  const [tier, setTier] = useState<QualityTier | null>(null);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl2") ?? canvas.getContext("webgl");
      if (!gl) {
        setTier("fallback");
        return;
      }

      const nav = navigator as NavigatorCapabilities;
      const memory = nav.deviceMemory ?? 8;
      const cores = navigator.hardwareConcurrency ?? 8;
      const coarse = window.matchMedia("(pointer: coarse)").matches;
      const small = window.innerWidth < 768;

      if (small || memory <= 2 || cores <= 2) setTier("low");
      else if (coarse || memory <= 4 || cores <= 4) setTier("medium");
      else setTier("high");
    } catch {
      setTier("fallback");
    }
  }, []);

  return tier;
}
