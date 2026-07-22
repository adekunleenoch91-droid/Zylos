/**
 * Process the advisor portfolio photos into the team portrait slots.
 *
 * Sources live in assets/reference/team/. Each is cover-cropped to the 4:5
 * portrait ratio the advisor cards use and optimized, then written to the
 * exact filenames agents.ts references. Face-aware cropping keeps each
 * subject centered.
 *
 * Run: node scripts/process-team.mjs
 */

import { mkdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const SRC = join(ROOT, "assets", "reference", "team");
const OUT = join(ROOT, "public", "images", "agents");
const [W, H] = [800, 1000];

// source → advisor portrait (matched to each advisor's gender & seniority)
const map = [
  ["founder", "agent-1"], // Founding Partner — navy suit, brown waistcoat
  ["man-black-suit", "agent-2"], // Managing Partner — formal black suit
  ["woman", "agent-3"], // Director, Alpine & Riviera — the female advisor
  ["man-flannel", "agent-4"], // Senior Advisor, Architectural — design-forward
  ["man-green-suit", "agent-5"], // Director, Asia-Pacific — approachable
];

mkdirSync(OUT, { recursive: true });
await Promise.all(
  map.map(([src, out]) =>
    sharp(join(SRC, `${src}.png`))
      .resize(W, H, { fit: "cover", position: "attention" })
      .jpeg({ quality: 86, mozjpeg: true })
      .toFile(join(OUT, `${out}.jpg`)),
  ),
);
console.log(`Processed ${map.length} advisor portraits into public/images/agents`);
