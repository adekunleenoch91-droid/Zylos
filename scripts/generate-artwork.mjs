/**
 * Zylos original artwork generator — cinematic edition.
 *
 * Produces the site's original imagery as richly layered SVG scenes:
 * atmospheric dusk skies, volumetric light, form-modelled architecture with
 * warm interior glow, reflective water and soft foliage. Realism comes from
 * many stacked gradients (cheap for the browser to paint, so hero images stay
 * fast for Core Web Vitals) rather than heavy filters. Everything is seeded,
 * so regeneration is deterministic, and 100% original / license-clean.
 *
 * Run: node scripts/generate-artwork.mjs
 * Output: public/images/**
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUT = join(process.cwd(), "public", "images");

/** Deterministic PRNG (mulberry32). */
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

const round = (n) => Math.round(n * 100) / 100;

/* Dusk sky palettes — zenith, upper, mid, horizon haze, sun glow. */
const skies = [
  { a: "#050B1E", b: "#0A142F", c: "#1E2A4E", d: "#4A3B5C", sun: "#F0C36B", warm: "#E8945C" },
  { a: "#04091A", b: "#0B1430", c: "#182murky", d: "#2E3E68", sun: "#E5C76B", warm: "#D98B4A" },
  { a: "#060D22", b: "#101C3C", c: "#243256", d: "#5A3E52", sun: "#F4D68A", warm: "#E89A6B" },
  { a: "#050A1C", b: "#0C1730", c: "#20304F", d: "#3A4A72", sun: "#EAC978", warm: "#C77E52" },
];
// Fix a typo-safe palette (guard against accidental bad hex).
skies[1].c = "#1B2748";

const P = {
  deep: "#04091A",
  midnight: "#0A142F",
  charcoal: "#0E1424",
  graphite: "#1A2238",
  graphiteLo: "#141B30",
  slate: "#2A3552",
  gold: "#D4AF37",
  champagne: "#E5C76B",
  warmGlow: "#F0C97A",
  bronze: "#A97142",
  ivory: "#F8F7F3",
  silver: "#D9D9D9",
};

function open(w, h) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice">`;
}

/** Shared gradient/filter defs used by exterior scenes. */
function skyDefs(sky, sunX, sunY, w, h) {
  return `<defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${sky.a}"/>
      <stop offset="0.32" stop-color="${sky.b}"/>
      <stop offset="0.62" stop-color="${sky.c}"/>
      <stop offset="0.85" stop-color="${sky.d}"/>
      <stop offset="1" stop-color="${sky.warm}" stop-opacity="0.55"/>
    </linearGradient>
    <radialGradient id="sunGlow" cx="${round(sunX / w)}" cy="${round(sunY / h)}" r="0.6">
      <stop offset="0" stop-color="${sky.sun}" stop-opacity="0.95"/>
      <stop offset="0.18" stop-color="${sky.sun}" stop-opacity="0.5"/>
      <stop offset="0.45" stop-color="${sky.warm}" stop-opacity="0.18"/>
      <stop offset="1" stop-color="${sky.warm}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="sunCore" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#FFFDF5"/>
      <stop offset="0.35" stop-color="${sky.sun}"/>
      <stop offset="1" stop-color="${sky.warm}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="haze" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${sky.warm}" stop-opacity="0"/>
      <stop offset="1" stop-color="${sky.sun}" stop-opacity="0.35"/>
    </linearGradient>
    <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${sky.d}" stop-opacity="0.85"/>
      <stop offset="0.4" stop-color="${sky.c}" stop-opacity="0.6"/>
      <stop offset="1" stop-color="${P.deep}"/>
    </linearGradient>
    <radialGradient id="vignette" cx="0.5" cy="0.42" r="0.75">
      <stop offset="0" stop-color="#000000" stop-opacity="0"/>
      <stop offset="0.7" stop-color="#000000" stop-opacity="0"/>
      <stop offset="1" stop-color="${P.deep}" stop-opacity="0.55"/>
    </radialGradient>
    <radialGradient id="winGlow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#FFF0CE"/>
      <stop offset="0.5" stop-color="${P.warmGlow}"/>
      <stop offset="1" stop-color="#8A5A1E"/>
    </radialGradient>
    <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6"/>
    </filter>
    <filter id="hazeBlur" x="-10%" y="-10%" width="120%" height="120%">
      <feGaussianBlur stdDeviation="3"/>
    </filter>
  </defs>`;
}

/** A softly glowing lit window with warm bloom. */
function litWindow(x, y, w, h, intensity) {
  return `<rect x="${round(x)}" y="${round(y)}" width="${round(w)}" height="${round(h)}" fill="url(#winGlow)" opacity="${round(0.45 + intensity * 0.5)}"/>`;
}

/** Distant skyline band with atmospheric haze. */
function skyline(r, w, horizon, sky) {
  let s = `<g opacity="0.5">`;
  let x = -20;
  while (x < w + 20) {
    const bw = 30 + r() * 90;
    const bh = 25 + r() * 130;
    const shade = `hsl(${222 + r() * 12}, ${18 + r() * 10}%, ${12 + r() * 8}%)`;
    s += `<rect x="${round(x)}" y="${round(horizon - bh)}" width="${round(bw)}" height="${round(bh + 4)}" fill="${shade}"/>`;
    // occasional distant lit windows
    if (r() > 0.5) {
      for (let k = 0; k < 3; k++) {
        if (r() > 0.5) continue;
        s += `<rect x="${round(x + 6 + r() * (bw - 12))}" y="${round(horizon - bh + 8 + r() * (bh - 16))}" width="3" height="3" fill="${sky.sun}" opacity="${round(0.3 + r() * 0.4)}"/>`;
      }
    }
    x += bw + r() * 18;
  }
  // atmospheric haze veil over the skyline base
  s += `<rect x="0" y="${round(horizon - 60)}" width="${w}" height="64" fill="url(#haze)" opacity="0.6"/>`;
  return s + "</g>";
}

/* ----------------------------------------------------------------------- */
/* Exterior: cinematic modern architecture at dusk                          */
/* ----------------------------------------------------------------------- */
function exterior(seed, w = 1600, h = 1000) {
  const r = rng(seed);
  const sky = skies[Math.floor(r() * skies.length)];
  const horizon = h * (0.6 + r() * 0.06);
  const sunX = w * (0.2 + r() * 0.6);
  const sunY = horizon - h * (0.04 + r() * 0.16);

  let s = open(w, h) + skyDefs(sky, sunX, sunY, w, h);
  s += `<rect width="${w}" height="${h}" fill="url(#sky)"/>`;
  s += `<rect width="${w}" height="${round(horizon)}" fill="url(#sunGlow)"/>`;

  // Light rays fanning from the sun
  s += `<g opacity="0.10">`;
  for (let i = 0; i < 7; i++) {
    const spread = (i - 3) * 0.16;
    const bx = sunX + spread * w * 0.5;
    s += `<polygon points="${round(sunX)},${round(sunY)} ${round(bx - 30)},0 ${round(bx + 30)},0" fill="${sky.sun}"/>`;
  }
  s += `</g>`;

  // Soft clouds
  s += `<g filter="url(#soft)" opacity="0.5">`;
  for (let i = 0; i < 5; i++) {
    const cx = r() * w;
    const cy = horizon - h * (0.2 + r() * 0.32);
    const cw = 120 + r() * 260;
    s += `<ellipse cx="${round(cx)}" cy="${round(cy)}" rx="${round(cw)}" ry="${round(cw * 0.18)}" fill="${r() > 0.5 ? sky.warm : sky.c}" opacity="0.5"/>`;
  }
  s += `</g>`;

  // Sun
  s += `<circle cx="${round(sunX)}" cy="${round(sunY)}" r="${round(h * 0.13)}" fill="url(#sunCore)"/>`;

  // Distant skyline
  s += skyline(r, w, horizon, sky);

  // Foreground architecture — form-modelled modern volumes
  const shades = [
    ["#26314F", "#141B30"],
    ["#2E3A58", "#171E33"],
    ["#212B47", "#0F1526"],
    ["#333F60", "#1A2138"],
  ];
  const volumes = 3 + Math.floor(r() * 2);
  const lit = [];
  for (let i = 0; i < volumes; i++) {
    const vw = w * (0.18 + r() * 0.2);
    const vh = h * (0.2 + r() * 0.32);
    const vx = (w / volumes) * i + r() * w * 0.08 - w * 0.05;
    const vy = horizon - vh;
    const [top, bot] = shades[Math.floor(r() * shades.length)];
    const gid = `f${seed}${i}`;
    // lit side faces the sun
    const litLeft = vx + vw / 2 < sunX;
    s += `<linearGradient id="${gid}" x1="${litLeft ? 0 : 1}" y1="0" x2="${litLeft ? 1 : 0}" y2="1">
      <stop offset="0" stop-color="${top}"/>
      <stop offset="1" stop-color="${bot}"/>
    </linearGradient>`;
    s += `<rect x="${round(vx)}" y="${round(vy)}" width="${round(vw)}" height="${round(vh + 6)}" fill="url(#${gid})"/>`;
    // sunlit edge highlight
    s += `<rect x="${round(litLeft ? vx : vx + vw - 3)}" y="${round(vy)}" width="3" height="${round(vh)}" fill="${sky.warm}" opacity="0.5"/>`;
    // recessed floor band (kept within the volume, reads as a storey line)
    if (r() > 0.4) {
      s += `<rect x="${round(vx)}" y="${round(vy + vh * (0.32 + r() * 0.3))}" width="${round(vw)}" height="${round(vh * 0.03)}" fill="${P.deep}" opacity="0.6"/>`;
    }
    // gold trim line
    if (r() > 0.5) {
      s += `<rect x="${round(vx)}" y="${round(vy + 2)}" width="${round(vw)}" height="2" fill="${P.gold}" opacity="0.55"/>`;
    }
    // collect window grid
    const cols = 2 + Math.floor(r() * 4);
    const rows = 3 + Math.floor(r() * 5);
    for (let c = 0; c < cols; c++) {
      for (let rr = 0; rr < rows; rr++) {
        if (r() > 0.55) continue;
        const wx = vx + vw * 0.1 + (c * vw * 0.8) / cols;
        const wy = vy + vh * 0.08 + (rr * vh * 0.82) / rows;
        lit.push([wx, wy, (vw * 0.52) / cols, (vh * 0.42) / rows, 0.3 + r() * 0.7]);
      }
    }
  }

  // window bloom underlay (contained blur)
  s += `<g filter="url(#soft)" opacity="0.5">`;
  for (const [x, y, ww, hh, it] of lit) {
    s += `<rect x="${round(x - 3)}" y="${round(y - 3)}" width="${round(ww + 6)}" height="${round(hh + 6)}" fill="${P.warmGlow}" opacity="${round(it * 0.5)}"/>`;
  }
  s += `</g>`;
  // crisp windows
  for (const [x, y, ww, hh, it] of lit) s += litWindow(x, y, ww, hh, it);

  // Water + reflections
  s += `<rect x="0" y="${round(horizon)}" width="${w}" height="${round(h - horizon)}" fill="url(#water)"/>`;
  // soft, wide sun reflection column (broken shimmer, low opacity)
  s += `<g filter="url(#hazeBlur)">`;
  for (let i = 0; i < 5; i++) {
    const ry = (h - horizon) * (0.14 + i * 0.08);
    s += `<ellipse cx="${round(sunX)}" cy="${round(horizon + (h - horizon) * (0.08 + i * 0.14))}" rx="${round(h * (0.09 - i * 0.008))}" ry="${round(ry * 0.22)}" fill="${sky.sun}" opacity="${round(0.16 - i * 0.02)}"/>`;
  }
  s += `</g>`;
  // ripple streaks
  for (let i = 0; i < 22; i++) {
    const ly = horizon + r() * (h - horizon) * 0.92;
    const lx = r() * w;
    const ll = 30 + r() * 180;
    const near = (ly - horizon) / (h - horizon);
    s += `<rect x="${round(lx)}" y="${round(ly)}" width="${round(ll)}" height="${round(1 + near * 2)}" rx="1" fill="${r() > 0.55 ? sky.sun : P.silver}" opacity="${round(0.05 + r() * 0.14)}"/>`;
  }

  // Foreground cypress silhouettes anchored at the shoreline (edges only)
  const treeXs = [
    w * (0.03 + r() * 0.05),
    w * (0.1 + r() * 0.06),
    w * (0.88 + r() * 0.05),
    w * (0.95 + r() * 0.03),
  ];
  for (const tx of treeXs) {
    if (r() > 0.75) continue;
    const th = h * (0.16 + r() * 0.14);
    const tw = th * 0.13;
    const baseY = horizon + 6;
    s += `<path d="M ${round(tx)} ${round(baseY - th)} C ${round(tx + tw)} ${round(baseY - th * 0.5)} ${round(tx + tw)} ${round(baseY - th * 0.1)} ${round(tx + tw * 0.4)} ${round(baseY)} L ${round(tx - tw * 0.4)} ${round(baseY)} C ${round(tx - tw)} ${round(baseY - th * 0.1)} ${round(tx - tw)} ${round(baseY - th * 0.5)} ${round(tx)} ${round(baseY - th)} Z" fill="${P.deep}" opacity="0.92"/>`;
  }

  // Atmosphere + vignette
  s += `<rect width="${w}" height="${h}" fill="url(#vignette)"/>`;
  s += `<rect x="0" y="${round(horizon - 2)}" width="${w}" height="4" fill="${sky.sun}" opacity="0.12"/>`;
  return s + "</svg>";
}

/* ----------------------------------------------------------------------- */
/* Interior: window wall onto a dusk view, warm modelled room               */
/* ----------------------------------------------------------------------- */
function interior(seed, w = 1600, h = 1000) {
  const r = rng(seed);
  const sky = skies[Math.floor(r() * skies.length)];
  const wx = w * 0.1,
    wy = h * 0.08,
    ww = w * 0.8,
    wh = h * 0.6;
  const sunX = wx + ww * (0.2 + r() * 0.6);
  const sunY = wy + wh * (0.3 + r() * 0.3);

  let s = open(w, h);
  s += `<defs>
    <linearGradient id="room" x1="0" y1="0" x2="0.4" y2="1">
      <stop offset="0" stop-color="#161D30"/>
      <stop offset="0.6" stop-color="#0E1424"/>
      <stop offset="1" stop-color="${P.deep}"/>
    </linearGradient>
    <linearGradient id="view" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${sky.a}"/>
      <stop offset="0.45" stop-color="${sky.c}"/>
      <stop offset="0.8" stop-color="${sky.d}"/>
      <stop offset="1" stop-color="${sky.warm}" stop-opacity="0.7"/>
    </linearGradient>
    <radialGradient id="ivGlow" cx="${round((sunX - wx) / ww)}" cy="${round((sunY - wy) / wh)}" r="0.7">
      <stop offset="0" stop-color="${sky.sun}" stop-opacity="0.85"/>
      <stop offset="0.4" stop-color="${sky.warm}" stop-opacity="0.25"/>
      <stop offset="1" stop-color="${sky.warm}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#242B40"/>
      <stop offset="1" stop-color="#0C1120"/>
    </linearGradient>
    <linearGradient id="spill" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${sky.sun}" stop-opacity="0.22"/>
      <stop offset="1" stop-color="${sky.sun}" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="ivVig" cx="0.5" cy="0.45" r="0.8">
      <stop offset="0.65" stop-color="#000" stop-opacity="0"/>
      <stop offset="1" stop-color="${P.deep}" stop-opacity="0.5"/>
    </radialGradient>
    <filter id="ivSoft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="7"/></filter>
  </defs>`;
  s += `<rect width="${w}" height="${h}" fill="url(#room)"/>`;

  // ceiling plane shading
  s += `<polygon points="0,0 ${w},0 ${round(w * 0.82)},${round(wy)} ${round(w * 0.18)},${round(wy)}" fill="#0C1220" opacity="0.6"/>`;

  // Window view
  s += `<rect x="${round(wx)}" y="${round(wy)}" width="${round(ww)}" height="${round(wh)}" fill="url(#view)"/>`;
  // distant skyline in the view
  let bx = wx;
  while (bx < wx + ww) {
    const bw = 34 + r() * 90;
    const bh = 24 + r() * wh * 0.42;
    s += `<rect x="${round(bx)}" y="${round(wy + wh - bh)}" width="${round(bw)}" height="${round(bh)}" fill="hsl(${220 + r() * 14}, 22%, ${11 + r() * 7}%)" opacity="0.85"/>`;
    if (r() > 0.5)
      s += `<rect x="${round(bx + 5)}" y="${round(wy + wh - bh + 8)}" width="3" height="3" fill="${sky.sun}" opacity="0.5"/>`;
    bx += bw + r() * 16;
  }
  s += `<circle cx="${round(sunX)}" cy="${round(sunY)}" r="${round(wh * 0.1)}" fill="${sky.sun}" opacity="0.9"/>`;
  s += `<rect x="${round(wx)}" y="${round(wy)}" width="${round(ww)}" height="${round(wh)}" fill="url(#ivGlow)"/>`;

  // Mullions + frame
  const panes = 4 + Math.floor(r() * 3);
  for (let i = 1; i < panes; i++)
    s += `<rect x="${round(wx + (ww / panes) * i)}" y="${round(wy)}" width="5" height="${round(wh)}" fill="${P.deep}"/>`;
  s += `<rect x="${round(wx)}" y="${round(wy)}" width="${round(ww)}" height="${round(wh)}" fill="none" stroke="${P.deep}" stroke-width="16"/>`;
  s += `<rect x="${round(wx)}" y="${round(wy)}" width="${round(ww)}" height="${round(wh)}" fill="none" stroke="${P.gold}" stroke-width="1.5" opacity="0.3"/>`;

  // Floor + warm light spill
  s += `<rect x="0" y="${round(wy + wh)}" width="${w}" height="${round(h - wy - wh)}" fill="url(#floor)"/>`;
  s += `<polygon points="${round(wx)},${h} ${round(wx + ww)},${h} ${round(wx + ww * 0.78)},${round(wy + wh)} ${round(wx + ww * 0.22)},${round(wy + wh)}" fill="url(#spill)"/>`;

  // Furniture silhouettes with soft shadow
  s += `<g filter="url(#ivSoft)" opacity="0.5"><ellipse cx="${round(w * 0.33)}" cy="${round(h * 0.9)}" rx="${round(w * 0.18)}" ry="18" fill="#000"/></g>`;
  s += `<rect x="${round(w * 0.2)}" y="${round(h * 0.74)}" width="${round(w * 0.26)}" height="${round(h * 0.1)}" rx="14" fill="#12192B"/>`;
  s += `<rect x="${round(w * 0.22)}" y="${round(h * 0.8)}" width="${round(w * 0.22)}" height="${round(h * 0.05)}" rx="8" fill="#0C1120"/>`;
  // floor lamp with warm pool
  s += `<g filter="url(#ivSoft)"><circle cx="${round(w * 0.72)}" cy="${round(h * 0.6)}" r="26" fill="${sky.sun}" opacity="0.55"/></g>`;
  s += `<circle cx="${round(w * 0.72)}" cy="${round(h * 0.6)}" r="7" fill="#FFF0CE"/>`;
  s += `<rect x="${round(w * 0.717)}" y="${round(h * 0.6)}" width="3" height="${round(h * 0.22)}" fill="#0C1120"/>`;

  s += `<rect width="${w}" height="${h}" fill="url(#ivVig)"/>`;
  return s + "</svg>";
}

/* ----------------------------------------------------------------------- */
/* Aerial: dusk skyline / neighbourhood                                     */
/* ----------------------------------------------------------------------- */
function aerial(seed, w = 1600, h = 1000) {
  const r = rng(seed);
  const sky = skies[Math.floor(r() * skies.length)];
  const horizon = h * 0.42;
  const sunX = w * (0.3 + r() * 0.4);
  const sunY = horizon - h * 0.06;
  let s = open(w, h) + skyDefs(sky, sunX, sunY, w, h);
  s += `<rect width="${w}" height="${h}" fill="url(#sky)"/>`;
  s += `<rect width="${w}" height="${round(horizon + 60)}" fill="url(#sunGlow)"/>`;
  s += `<circle cx="${round(sunX)}" cy="${round(sunY)}" r="${round(h * 0.09)}" fill="url(#sunCore)"/>`;
  s += skyline(r, w, horizon, sky);

  // dense mid & foreground towers with lit windows
  const rows = 3;
  for (let row = 0; row < rows; row++) {
    const base = horizon + (row * (h - horizon)) / rows + 40;
    const scale = 1 + row * 0.7;
    let x = -30;
    while (x < w + 30) {
      const bw = (34 + r() * 70) * scale;
      const bh = (60 + r() * 150) * scale;
      const top = `hsl(222, 22%, ${16 - row * 3 + r() * 6}%)`;
      const bot = `hsl(224, 26%, ${9 - row * 2}%)`;
      const gid = `t${seed}${row}${Math.round(x)}`;
      s += `<linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bot}"/></linearGradient>`;
      s += `<rect x="${round(x)}" y="${round(base - bh)}" width="${round(bw)}" height="${round(bh + 6)}" fill="url(#${gid})"/>`;
      // windows
      const cols = Math.max(2, Math.floor(bw / 14));
      const wr = Math.max(3, Math.floor(bh / 18));
      for (let c = 0; c < cols; c++)
        for (let k = 0; k < wr; k++) {
          if (r() > 0.4) continue;
          s += `<rect x="${round(x + 5 + (c * (bw - 10)) / cols)}" y="${round(base - bh + 8 + (k * (bh - 16)) / wr)}" width="${round((bw * 0.5) / cols)}" height="${round((bh * 0.4) / wr)}" fill="${sky.sun}" opacity="${round(0.25 + r() * 0.55)}"/>`;
        }
      x += bw + r() * 14;
    }
  }
  s += `<rect width="${w}" height="${h}" fill="url(#vignette)"/>`;
  return s + "</svg>";
}

/* ----------------------------------------------------------------------- */
/* Detail: architectural editorial abstract (refined)                       */
/* ----------------------------------------------------------------------- */
function detail(seed, w = 1600, h = 1000) {
  const r = rng(seed);
  const sky = skies[Math.floor(r() * skies.length)];
  let s = open(w, h);
  s += `<defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0.6" y2="1">
      <stop offset="0" stop-color="${P.midnight}"/>
      <stop offset="0.6" stop-color="#141C33"/>
      <stop offset="1" stop-color="${P.deep}"/>
    </linearGradient>
    <radialGradient id="dGlow" cx="0.35" cy="0.32" r="0.6">
      <stop offset="0" stop-color="${sky.sun}" stop-opacity="0.4"/>
      <stop offset="1" stop-color="${sky.sun}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="col" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#333F60"/>
      <stop offset="1" stop-color="#161E33"/>
    </linearGradient>
    <radialGradient id="dVig" cx="0.5" cy="0.45" r="0.8">
      <stop offset="0.65" stop-color="#000" stop-opacity="0"/>
      <stop offset="1" stop-color="${P.deep}" stop-opacity="0.5"/>
    </radialGradient>
  </defs>`;
  s += `<rect width="${w}" height="${h}" fill="url(#bg)"/>`;
  s += `<rect width="${w}" height="${h}" fill="url(#dGlow)"/>`;
  const cx = w * (0.3 + r() * 0.35);
  const cy = h * (0.34 + r() * 0.24);
  for (let i = 0; i < 6; i++) {
    const rad = h * (0.12 + i * 0.12);
    s += `<circle cx="${round(cx)}" cy="${round(cy)}" r="${round(rad)}" fill="none" stroke="${i % 2 ? P.gold : P.bronze}" stroke-width="${round(2.4 - i * 0.28)}" opacity="${round(0.5 - i * 0.06)}"/>`;
  }
  const cols = 5 + Math.floor(r() * 4);
  for (let i = 0; i < cols; i++) {
    const x = w * 0.08 + (i * w * 0.84) / cols;
    const cw = w * 0.5 / cols / 3;
    s += `<rect x="${round(x)}" y="${round(h * 0.52)}" width="${round(cw)}" height="${round(h * 0.48)}" fill="url(#col)"/>`;
    s += `<rect x="${round(x)}" y="${round(h * 0.52)}" width="2" height="${round(h * 0.48)}" fill="${sky.sun}" opacity="0.18"/>`;
  }
  s += `<rect x="0" y="${round(h * 0.52)}" width="${w}" height="3" fill="${P.gold}" opacity="0.55"/>`;
  s += `<circle cx="${round(cx + w * 0.18)}" cy="${round(cy - h * 0.08)}" r="${round(h * 0.03)}" fill="${P.champagne}"/>`;
  s += `<rect width="${w}" height="${h}" fill="url(#dVig)"/>`;
  return s + "</svg>";
}

/* ----------------------------------------------------------------------- */
/* Portrait: refined studio silhouette with rim light                       */
/* ----------------------------------------------------------------------- */
function portrait(seed, w = 800, h = 1000) {
  const r = rng(seed);
  const warm = r() > 0.5;
  const bgTop = warm ? "#2A2440" : "#1E2A44";
  const bgBot = "#0A0F1E";
  const figure = warm ? "#2E2A3E" : "#232D46";
  let s = open(w, h);
  s += `<defs>
    <radialGradient id="pbg" cx="0.5" cy="0.32" r="0.85">
      <stop offset="0" stop-color="${bgTop}"/>
      <stop offset="1" stop-color="${bgBot}"/>
    </radialGradient>
    <linearGradient id="fig" x1="0" y1="0" x2="1" y2="0.4">
      <stop offset="0" stop-color="#0C1120"/>
      <stop offset="0.5" stop-color="${figure}"/>
      <stop offset="1" stop-color="#0A0F1C"/>
    </linearGradient>
    <linearGradient id="rim" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0.55" stop-color="${P.gold}" stop-opacity="0"/>
      <stop offset="1" stop-color="${P.champagne}" stop-opacity="0.9"/>
    </linearGradient>
    <radialGradient id="key" cx="0.3" cy="0.28" r="0.5">
      <stop offset="0" stop-color="${P.warmGlow}" stop-opacity="0.35"/>
      <stop offset="1" stop-color="${P.warmGlow}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="pvig" cx="0.5" cy="0.4" r="0.75">
      <stop offset="0.6" stop-color="#000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity="0.55"/>
    </radialGradient>
    <filter id="pSoft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="12"/></filter>
  </defs>`;
  s += `<rect width="${w}" height="${h}" fill="url(#pbg)"/>`;
  s += `<rect width="${w}" height="${h}" fill="url(#key)"/>`;
  const cx = w / 2 + (r() - 0.5) * w * 0.05;
  const headR = w * 0.17;
  const headY = h * 0.34;
  // subtle directional key wash from the upper left (not a halo behind the head)
  s += `<g filter="url(#pSoft)" opacity="0.16"><ellipse cx="${round(cx - headR * 1.5)}" cy="${round(headY - headR * 1.1)}" rx="${round(headR * 1.4)}" ry="${round(headR * 1.8)}" fill="${P.warmGlow}"/></g>`;
  // shoulders / bust
  s += `<path d="M ${round(cx - w * 0.3)} ${h} Q ${round(cx - w * 0.28)} ${round(h * 0.62)} ${round(cx - w * 0.12)} ${round(h * 0.56)} L ${round(cx + w * 0.12)} ${round(h * 0.56)} Q ${round(cx + w * 0.28)} ${round(h * 0.62)} ${round(cx + w * 0.3)} ${h} Z" fill="url(#fig)"/>`;
  // head
  s += `<ellipse cx="${round(cx)}" cy="${round(headY)}" rx="${round(headR)}" ry="${round(headR * 1.15)}" fill="url(#fig)"/>`;
  // rim light on head + shoulder
  s += `<path d="M ${round(cx + headR * 0.5)} ${round(headY - headR * 0.9)} A ${round(headR)} ${round(headR * 1.15)} 0 0 1 ${round(cx + headR * 0.75)} ${round(headY + headR * 0.7)}" fill="none" stroke="url(#rim)" stroke-width="4" stroke-linecap="round"/>`;
  s += `<path d="M ${round(cx + w * 0.11)} ${round(h * 0.57)} Q ${round(cx + w * 0.26)} ${round(h * 0.63)} ${round(cx + w * 0.29)} ${round(h * 0.8)}" fill="none" stroke="url(#rim)" stroke-width="3.5" stroke-linecap="round"/>`;
  s += `<rect width="${w}" height="${h}" fill="url(#pvig)"/>`;
  s += `<rect x="0" y="${round(h - 3)}" width="${w}" height="3" fill="${P.gold}" opacity="0.4"/>`;
  return s + "</svg>";
}

/* OG banner */
function ogImage() {
  const w = 1200,
    h = 630;
  let s = exterior(910, w, h).replace("</svg>", "");
  s += `<rect width="${w}" height="${h}" fill="${P.deep}" opacity="0.4"/>`;
  s += `<text x="${w / 2}" y="${h * 0.46}" text-anchor="middle" font-family="Georgia, serif" font-size="112" letter-spacing="26" fill="${P.ivory}">ZYLOS</text>`;
  s += `<rect x="${w / 2 - 64}" y="${h * 0.53}" width="128" height="3" fill="${P.gold}"/>`;
  s += `<text x="${w / 2}" y="${h * 0.63}" text-anchor="middle" font-family="Georgia, serif" font-size="27" letter-spacing="8" fill="${P.champagne}">LUXURY REAL ESTATE</text>`;
  return s + "</svg>";
}

/* ----------------------------------------------------------------------- */
/* Generate                                                                 */
/* ----------------------------------------------------------------------- */
const jobs = [];
for (const d of ["properties", "agents", "blog", "neighborhoods", "brand"])
  mkdirSync(join(OUT, d), { recursive: true });

for (let p = 1; p <= 8; p++) {
  jobs.push([`properties/property-${p}-exterior.svg`, exterior(1000 + p * 7)]);
  jobs.push([`properties/property-${p}-interior.svg`, interior(2000 + p * 13)]);
  jobs.push([`properties/property-${p}-detail.svg`, detail(3000 + p * 17)]);
  jobs.push([`properties/property-${p}-view.svg`, exterior(4000 + p * 23)]);
}
for (let a = 1; a <= 5; a++)
  jobs.push([`agents/agent-${a}.svg`, portrait(5000 + a * 11)]);
for (let t = 1; t <= 6; t++)
  jobs.push([`agents/avatar-${t}.svg`, portrait(6000 + t * 19, 400, 400)]);
for (let b = 1; b <= 6; b++) {
  const fn = b % 3 === 0 ? detail : b % 3 === 1 ? interior : aerial;
  jobs.push([`blog/post-${b}.svg`, fn(7000 + b * 29)]);
}
for (let n = 1; n <= 4; n++)
  jobs.push([`neighborhoods/neighborhood-${n}.svg`, aerial(8000 + n * 31)]);
jobs.push(["brand/about-hero.svg", detail(9101)]);
jobs.push(["brand/lifestyle.svg", interior(9203)]);
jobs.push(["brand/office.svg", aerial(9307)]);
jobs.push(["brand/journey.svg", interior(9409)]);
jobs.push(["brand/og-image.svg", ogImage()]);

for (const [file, svg] of jobs) writeFileSync(join(OUT, file), svg);
console.log(`Generated ${jobs.length} cinematic artworks in public/images`);
