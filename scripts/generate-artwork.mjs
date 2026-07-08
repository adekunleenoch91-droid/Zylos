/**
 * Zylos original artwork generator.
 *
 * Produces the site's original SVG imagery — architectural dusk scenes,
 * interiors, abstract portraits and editorial compositions — from a seeded
 * generator so every asset is deterministic, license-clean and tiny.
 *
 * Run: node scripts/generate-artwork.mjs
 * Output: public/images/**
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUT = join(process.cwd(), "public", "images");

/** Deterministic PRNG (mulberry32) so regeneration is reproducible. */
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const P = {
  midnight: "#0A142F",
  deep: "#060D22",
  charcoal: "#111827",
  graphite: "#1A2238",
  graphiteLight: "#232D4A",
  gold: "#D4AF37",
  champagne: "#E5C76B",
  bronze: "#A97142",
  ivory: "#F8F7F3",
  silver: "#D9D9D9",
};

const skyPalettes = [
  { top: "#0A142F", mid: "#1A2238", low: "#3D2E4F", glow: "#E5C76B" },
  { top: "#060D22", mid: "#12203F", low: "#2B3A63", glow: "#D4AF37" },
  { top: "#0A142F", mid: "#232D4A", low: "#5A3A50", glow: "#E8A87C" },
  { top: "#081228", mid: "#16264A", low: "#31456F", glow: "#F0D890" },
];

function svgOpen(w, h) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">`;
}

/* ----------------------------------------------------------------------- */
/* Exterior: layered modern architecture at dusk                            */
/* ----------------------------------------------------------------------- */
function exterior(seed, w = 1600, h = 1000) {
  const r = rng(seed);
  const sky = skyPalettes[Math.floor(r() * skyPalettes.length)];
  const horizon = h * 0.62;
  const sunX = w * (0.25 + r() * 0.5);
  const sunY = horizon - h * (0.08 + r() * 0.2);
  const sunR = h * (0.06 + r() * 0.05);

  let s = svgOpen(w, h);
  s += `<defs>
  <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${sky.top}"/><stop offset="0.55" stop-color="${sky.mid}"/><stop offset="1" stop-color="${sky.low}"/>
  </linearGradient>
  <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
    <stop offset="0" stop-color="${sky.glow}" stop-opacity="0.9"/><stop offset="0.4" stop-color="${sky.glow}" stop-opacity="0.35"/><stop offset="1" stop-color="${sky.glow}" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${sky.low}" stop-opacity="0.75"/><stop offset="1" stop-color="${P.deep}"/>
  </linearGradient>
  </defs>`;
  s += `<rect width="${w}" height="${h}" fill="url(#sky)"/>`;
  s += `<circle cx="${sunX}" cy="${sunY}" r="${sunR * 4.5}" fill="url(#glow)"/>`;
  s += `<circle cx="${sunX}" cy="${sunY}" r="${sunR}" fill="${sky.glow}" opacity="0.95"/>`;

  // Distant skyline band
  let band = `<g fill="${P.charcoal}" opacity="0.55">`;
  let x = -20;
  while (x < w) {
    const bw = 60 + r() * 140;
    const bh = 30 + r() * 110;
    band += `<rect x="${x.toFixed(0)}" y="${(horizon - bh).toFixed(0)}" width="${bw.toFixed(0)}" height="${bh.toFixed(0)}"/>`;
    x += bw + r() * 30;
  }
  s += band + "</g>";

  // Foreground architecture: 3-5 overlapping modernist volumes
  const volumes = 3 + Math.floor(r() * 3);
  const shades = [P.graphite, P.graphiteLight, P.charcoal, "#2A3552"];
  for (let i = 0; i < volumes; i++) {
    const vw = w * (0.16 + r() * 0.2);
    const vh = h * (0.18 + r() * 0.3);
    const vx = (w / volumes) * i + r() * w * 0.1 - w * 0.04;
    const vy = horizon - vh;
    const fill = shades[Math.floor(r() * shades.length)];
    s += `<rect x="${vx.toFixed(0)}" y="${vy.toFixed(0)}" width="${vw.toFixed(0)}" height="${vh.toFixed(0)}" fill="${fill}"/>`;
    // Cantilevered slab
    if (r() > 0.4) {
      s += `<rect x="${(vx - vw * 0.12).toFixed(0)}" y="${(vy + vh * 0.28).toFixed(0)}" width="${(vw * 1.24).toFixed(0)}" height="${(vh * 0.06).toFixed(0)}" fill="${P.deep}"/>`;
    }
    // Lit windows — warm gold grid
    const cols = 2 + Math.floor(r() * 4);
    const rows = 2 + Math.floor(r() * 5);
    for (let c = 0; c < cols; c++) {
      for (let rr = 0; rr < rows; rr++) {
        if (r() > 0.45) continue;
        const wx = vx + vw * 0.12 + (c * vw * 0.76) / cols;
        const wy = vy + vh * 0.12 + (rr * vh * 0.76) / rows;
        const lum = 0.35 + r() * 0.6;
        s += `<rect x="${wx.toFixed(0)}" y="${wy.toFixed(0)}" width="${((vw * 0.5) / cols).toFixed(0)}" height="${((vh * 0.4) / rows).toFixed(0)}" fill="${r() > 0.3 ? P.champagne : P.gold}" opacity="${lum.toFixed(2)}"/>`;
      }
    }
  }

  // Water + reflection
  s += `<rect x="0" y="${horizon}" width="${w}" height="${h - horizon}" fill="url(#water)"/>`;
  s += `<ellipse cx="${sunX}" cy="${horizon + (h - horizon) * 0.3}" rx="${sunR * 2.4}" ry="${sunR * 0.5}" fill="${sky.glow}" opacity="0.22"/>`;
  for (let i = 0; i < 14; i++) {
    const ly = horizon + r() * (h - horizon) * 0.85;
    const lx = r() * w;
    const ll = 30 + r() * 160;
    s += `<rect x="${lx.toFixed(0)}" y="${ly.toFixed(0)}" width="${ll.toFixed(0)}" height="2" fill="${r() > 0.5 ? P.champagne : P.silver}" opacity="${(0.06 + r() * 0.16).toFixed(2)}"/>`;
  }
  // Fine grain vignette
  s += `<rect width="${w}" height="${h}" fill="${P.deep}" opacity="0.08"/>`;
  return s + "</svg>";
}

/* ----------------------------------------------------------------------- */
/* Interior: window wall with dusk view, warm planes                        */
/* ----------------------------------------------------------------------- */
function interior(seed, w = 1600, h = 1000) {
  const r = rng(seed);
  const sky = skyPalettes[Math.floor(r() * skyPalettes.length)];
  let s = svgOpen(w, h);
  s += `<defs>
  <linearGradient id="room" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${P.charcoal}"/><stop offset="1" stop-color="${P.deep}"/>
  </linearGradient>
  <linearGradient id="view" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${sky.top}"/><stop offset="0.7" stop-color="${sky.low}"/><stop offset="1" stop-color="${P.deep}"/>
  </linearGradient>
  <linearGradient id="floor" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="${P.graphite}"/><stop offset="0.5" stop-color="#2A3049"/><stop offset="1" stop-color="${P.graphite}"/>
  </linearGradient>
  </defs>`;
  s += `<rect width="${w}" height="${h}" fill="url(#room)"/>`;

  // Window wall
  const wx = w * 0.12,
    wy = h * 0.1,
    ww = w * 0.76,
    wh = h * 0.62;
  s += `<rect x="${wx}" y="${wy}" width="${ww}" height="${wh}" fill="url(#view)"/>`;
  // Skyline inside the view
  let bx = wx;
  while (bx < wx + ww) {
    const bw = 40 + r() * 110;
    const bh = 30 + r() * wh * 0.4;
    s += `<rect x="${bx.toFixed(0)}" y="${(wy + wh - bh).toFixed(0)}" width="${bw.toFixed(0)}" height="${bh.toFixed(0)}" fill="${P.charcoal}" opacity="0.8"/>`;
    bx += bw + r() * 26;
  }
  const sunX = wx + ww * (0.2 + r() * 0.6);
  s += `<circle cx="${sunX.toFixed(0)}" cy="${(wy + wh * 0.35).toFixed(0)}" r="${(wh * 0.09).toFixed(0)}" fill="${sky.glow}" opacity="0.9"/>`;
  // Mullions
  const panes = 4 + Math.floor(r() * 3);
  for (let i = 1; i < panes; i++) {
    s += `<rect x="${(wx + (ww / panes) * i).toFixed(0)}" y="${wy}" width="6" height="${wh}" fill="${P.deep}"/>`;
  }
  s += `<rect x="${wx}" y="${wy}" width="${ww}" height="${wh}" fill="none" stroke="${P.deep}" stroke-width="14"/>`;

  // Floor with warm light spill
  s += `<rect x="0" y="${wy + wh}" width="${w}" height="${h - wy - wh}" fill="url(#floor)"/>`;
  s += `<polygon points="${wx},${h} ${wx + ww},${h} ${wx + ww * 0.82},${wy + wh} ${wx + ww * 0.18},${wy + wh}" fill="${sky.glow}" opacity="0.08"/>`;
  // Minimal furniture silhouettes
  s += `<rect x="${w * 0.2}" y="${h * 0.78}" width="${w * 0.28}" height="${h * 0.05}" rx="10" fill="${P.deep}"/>`;
  s += `<rect x="${w * 0.22}" y="${h * 0.7}" width="${w * 0.24}" height="${h * 0.09}" rx="14" fill="#0D1530"/>`;
  s += `<circle cx="${w * 0.72}" cy="${h * 0.62}" r="${h * 0.014}" fill="${P.champagne}"/>`;
  s += `<rect x="${w * 0.717}" y="${h * 0.62}" width="4" height="${h * 0.2}" fill="${P.deep}"/>`;
  return s + "</svg>";
}

/* ----------------------------------------------------------------------- */
/* Detail: abstract architectural editorial composition                     */
/* ----------------------------------------------------------------------- */
function detail(seed, w = 1600, h = 1000) {
  const r = rng(seed);
  let s = svgOpen(w, h);
  s += `<defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${P.midnight}"/><stop offset="1" stop-color="${P.graphite}"/>
  </linearGradient></defs>`;
  s += `<rect width="${w}" height="${h}" fill="url(#bg)"/>`;
  // Concentric golden arcs
  const cx = w * (0.3 + r() * 0.4);
  const cy = h * (0.35 + r() * 0.3);
  for (let i = 0; i < 6; i++) {
    const rad = h * (0.12 + i * 0.11);
    s += `<circle cx="${cx.toFixed(0)}" cy="${cy.toFixed(0)}" r="${rad.toFixed(0)}" fill="none" stroke="${i % 2 ? P.gold : P.bronze}" stroke-width="${(2.5 - i * 0.3).toFixed(1)}" opacity="${(0.5 - i * 0.06).toFixed(2)}"/>`;
  }
  // Column rhythm
  const cols = 5 + Math.floor(r() * 4);
  for (let i = 0; i < cols; i++) {
    const x = w * 0.08 + (i * w * 0.84) / cols;
    s += `<rect x="${x.toFixed(0)}" y="${h * 0.55}" width="${(w * 0.5) / cols / 3}" height="${h * 0.45}" fill="${P.graphiteLight}" opacity="0.85"/>`;
  }
  s += `<rect x="0" y="${h * 0.53}" width="${w}" height="${h * 0.02}" fill="${P.gold}" opacity="0.6"/>`;
  s += `<circle cx="${(cx + w * 0.2).toFixed(0)}" cy="${(cy - h * 0.1).toFixed(0)}" r="${h * 0.035}" fill="${P.champagne}" opacity="0.9"/>`;
  return s + "</svg>";
}

/* ----------------------------------------------------------------------- */
/* Portrait: abstract elegant profile on graphite                           */
/* ----------------------------------------------------------------------- */
function portrait(seed, w = 800, h = 1000) {
  const r = rng(seed);
  const tones = ["#2A3552", "#232D4A", "#31456F", "#1F2A47"];
  const tone = tones[Math.floor(r() * tones.length)];
  let s = svgOpen(w, h);
  s += `<defs><linearGradient id="pb" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${P.graphite}"/><stop offset="1" stop-color="${P.deep}"/>
  </linearGradient>
  <linearGradient id="rim" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="${P.gold}" stop-opacity="0"/><stop offset="1" stop-color="${P.gold}" stop-opacity="0.85"/>
  </linearGradient></defs>`;
  s += `<rect width="${w}" height="${h}" fill="url(#pb)"/>`;
  s += `<circle cx="${w / 2}" cy="${h * 0.42}" r="${w * 0.34}" fill="none" stroke="${P.gold}" stroke-width="1.5" opacity="0.5"/>`;
  // Bust silhouette
  const headR = w * 0.16;
  const cx = w / 2 + (r() - 0.5) * w * 0.06;
  s += `<circle cx="${cx.toFixed(0)}" cy="${h * 0.36}" r="${headR}" fill="${tone}"/>`;
  s += `<path d="M ${cx - w * 0.26} ${h * 0.78} Q ${cx - w * 0.24} ${h * 0.55} ${cx - w * 0.1} ${h * 0.52} L ${cx + w * 0.1} ${h * 0.52} Q ${cx + w * 0.24} ${h * 0.55} ${cx + w * 0.26} ${h * 0.78} L ${cx + w * 0.26} ${h} L ${cx - w * 0.26} ${h} Z" fill="${tone}"/>`;
  // Gold rim light
  s += `<path d="M ${cx + headR * 0.55} ${h * 0.36 - headR * 0.8} A ${headR} ${headR} 0 0 1 ${cx + headR * 0.98} ${h * 0.36 + headR * 0.2}" fill="none" stroke="url(#rim)" stroke-width="5" stroke-linecap="round"/>`;
  s += `<rect x="0" y="${h * 0.92}" width="${w}" height="2" fill="${P.gold}" opacity="0.4"/>`;
  return s + "</svg>";
}

/* ----------------------------------------------------------------------- */
/* OG image                                                                 */
/* ----------------------------------------------------------------------- */
function ogImage() {
  const w = 1200,
    h = 630;
  let s = exterior(910, w, h).replace("</svg>", "");
  s += `<rect width="${w}" height="${h}" fill="${P.deep}" opacity="0.45"/>`;
  s += `<text x="${w / 2}" y="${h * 0.47}" text-anchor="middle" font-family="Georgia, serif" font-size="110" letter-spacing="26" fill="${P.ivory}">ZYLOS</text>`;
  s += `<rect x="${w / 2 - 60}" y="${h * 0.53}" width="120" height="3" fill="${P.gold}"/>`;
  s += `<text x="${w / 2}" y="${h * 0.63}" text-anchor="middle" font-family="Georgia, serif" font-size="28" letter-spacing="8" fill="${P.champagne}">LUXURY REAL ESTATE</text>`;
  return s + "</svg>";
}

/* ----------------------------------------------------------------------- */
/* Generate                                                                 */
/* ----------------------------------------------------------------------- */
const jobs = [];
const dirs = ["properties", "agents", "blog", "neighborhoods", "brand"];
for (const d of dirs) mkdirSync(join(OUT, d), { recursive: true });

// 8 properties × 4 images
for (let p = 1; p <= 8; p++) {
  jobs.push([`properties/property-${p}-exterior.svg`, exterior(1000 + p * 7)]);
  jobs.push([`properties/property-${p}-interior.svg`, interior(2000 + p * 13)]);
  jobs.push([`properties/property-${p}-detail.svg`, detail(3000 + p * 17)]);
  jobs.push([`properties/property-${p}-view.svg`, exterior(4000 + p * 23)]);
}
// 5 agent portraits + 6 testimonial avatars
for (let a = 1; a <= 5; a++)
  jobs.push([`agents/agent-${a}.svg`, portrait(5000 + a * 11)]);
for (let t = 1; t <= 6; t++)
  jobs.push([`agents/avatar-${t}.svg`, portrait(6000 + t * 19, 400, 400)]);
// 6 blog heroes
for (let b = 1; b <= 6; b++) {
  const fn = b % 2 ? detail : interior;
  jobs.push([`blog/post-${b}.svg`, fn(7000 + b * 29)]);
}
// 4 neighborhoods
for (let n = 1; n <= 4; n++)
  jobs.push([`neighborhoods/neighborhood-${n}.svg`, exterior(8000 + n * 31)]);
// Brand imagery
jobs.push(["brand/about-hero.svg", detail(9101)]);
jobs.push(["brand/lifestyle.svg", interior(9203)]);
jobs.push(["brand/office.svg", exterior(9307)]);
jobs.push(["brand/journey.svg", interior(9409)]);
jobs.push(["brand/og-image.svg", ogImage()]);

for (const [file, svg] of jobs) writeFileSync(join(OUT, file), svg);
console.log(`Generated ${jobs.length} original artworks in public/images`);
