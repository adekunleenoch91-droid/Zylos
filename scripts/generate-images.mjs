/**
 * Zylos real-photograph generator.
 *
 * Reads scripts/image-manifest.mjs and, when an image API is configured,
 * produces real photorealistic images for every slot and writes them into
 * public/images/** with the exact filenames the app already uses. When no
 * API is configured it simply (re)writes docs/IMAGE-PROMPTS.md so you can
 * generate the images by hand and drop them in.
 *
 * Usage:
 *   node scripts/generate-images.mjs            # write prompt sheet (+ generate if API set)
 *   node scripts/generate-images.mjs --force    # overwrite existing images
 *   node scripts/generate-images.mjs --only=properties/property-1-exterior.jpg
 *
 * Configure via environment (OpenAI Images-compatible by default):
 *   IMAGE_API_KEY   — your API key (required to generate)
 *   IMAGE_API_URL   — endpoint (default: https://api.openai.com/v1/images/generations)
 *   IMAGE_MODEL     — model id   (default: gpt-image-1)
 *
 * Other providers (Replicate, fal.ai, Stability, Imagen) use different
 * request/response shapes — adapt `callImageApi` below; the manifest and
 * file layout stay the same.
 */

import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { buildManifest } from "./image-manifest.mjs";

const ROOT = process.cwd();
const OUT = join(ROOT, "public", "images");
const args = process.argv.slice(2);
const force = args.includes("--force");
const only = args.find((a) => a.startsWith("--only="))?.split("=")[1];

const API_KEY = process.env.IMAGE_API_KEY;
const API_URL =
  process.env.IMAGE_API_URL ?? "https://api.openai.com/v1/images/generations";
const MODEL = process.env.IMAGE_MODEL ?? "gpt-image-1";

const manifest = buildManifest();

/* Map arbitrary target dimensions to an allowed API aspect ratio. */
function apiSize(w, h) {
  if (w > h) return "1536x1024";
  if (h > w) return "1024x1536";
  return "1024x1024";
}

/** Write the human-readable prompt sheet, grouped by section. */
function writePromptSheet() {
  const groups = new Map();
  for (const item of manifest) {
    const section = item.file.split("/")[0];
    if (!groups.has(section)) groups.set(section, []);
    groups.get(section).push(item);
  }
  let md = `# Zylos — Image Prompt Sheet\n\n`;
  md += `Generated from \`scripts/image-manifest.mjs\`. Produce each image with your\n`;
  md += `preferred AI image tool, save it at the given path under \`public/images/\`\n`;
  md += `(keep the exact filename), and it drops straight into the site — every\n`;
  md += `page already references these paths. Prefer \`.jpg\` or \`.webp\`; Next/Image\n`;
  md += `converts to AVIF/WebP and resizes per device automatically.\n\n`;
  md += `> ${manifest.length} images total. Suggested aspect ratios are noted; exact\n`;
  md += `> pixel size is not critical since images are responsively resized.\n\n`;
  for (const [section, items] of groups) {
    md += `## ${section}\n\n`;
    for (const it of items) {
      md += `### \`public/images/${it.file}\`  \n`;
      md += `_${it.w}×${it.h} (${it.w > it.h ? "landscape" : it.h > it.w ? "portrait" : "square"})_\n\n`;
      md += `${it.prompt}\n\n`;
    }
  }
  const docPath = join(ROOT, "docs", "IMAGE-PROMPTS.md");
  mkdirSync(dirname(docPath), { recursive: true });
  writeFileSync(docPath, md);
  console.log(`Wrote prompt sheet → docs/IMAGE-PROMPTS.md (${manifest.length} prompts)`);
}

/** OpenAI Images-compatible call. Returns a Buffer of image bytes. */
async function callImageApi(prompt, size) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      prompt,
      size,
      n: 1,
      output_format: "jpeg",
    }),
  });
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText} — ${await res.text()}`);
  }
  const json = await res.json();
  const b64 = json?.data?.[0]?.b64_json;
  if (b64) return Buffer.from(b64, "base64");
  const url = json?.data?.[0]?.url;
  if (url) {
    const img = await fetch(url);
    return Buffer.from(await img.arrayBuffer());
  }
  throw new Error("Unexpected API response shape (no b64_json or url).");
}

async function generate() {
  const jobs = only ? manifest.filter((m) => m.file === only) : manifest;
  let done = 0;
  let skipped = 0;
  for (const item of jobs) {
    const target = join(OUT, item.file);
    if (!force && existsSync(target)) {
      skipped++;
      continue;
    }
    mkdirSync(dirname(target), { recursive: true });
    process.stdout.write(`  generating ${item.file} … `);
    try {
      const bytes = await callImageApi(item.prompt, apiSize(item.w, item.h));
      writeFileSync(target, bytes);
      console.log("ok");
      done++;
      // Gentle pacing to respect rate limits.
      await new Promise((r) => setTimeout(r, 800));
    } catch (err) {
      console.log("FAILED");
      console.error(`    ${err.message}`);
    }
  }
  console.log(`\nGenerated ${done} image(s), skipped ${skipped} existing.`);
  if (skipped > 0) console.log("Pass --force to regenerate existing images.");
}

writePromptSheet();

if (!API_KEY) {
  console.log(
    "\nNo IMAGE_API_KEY set — prompt sheet written, but no images generated.",
  );
  console.log(
    "To produce real photographs: set IMAGE_API_KEY (and optionally",
  );
  console.log(
    "IMAGE_API_URL / IMAGE_MODEL), then re-run: node scripts/generate-images.mjs",
  );
  process.exit(0);
}

console.log(`\nGenerating ${only ? 1 : manifest.length} image(s) via ${MODEL} …`);
await generate();
