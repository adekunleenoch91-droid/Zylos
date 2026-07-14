/**
 * Process user-supplied reference photographs into the site's image slots.
 *
 * Reads the curated source photos from assets/reference/ and cover-crops /
 * optimizes each into the exact filenames the app references under
 * public/images/**. Watermarked or unsuitable sources are intentionally
 * excluded upstream (only clean photos live in assets/reference/).
 *
 * Run: node scripts/process-photos.mjs
 */

import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const SRC = join(ROOT, "assets", "reference");
const OUT = join(ROOT, "public", "images");

const LANDSCAPE = [1600, 1000];
const PORTRAIT = [900, 1200];

/**
 * Per-property photo assignment: [exterior, interior, detail, view].
 * Exteriors are dusk architectural shots; interiors are matched to each
 * residence's character. Some reuse is intentional across eight homes.
 */
const properties = [
  ["ref-10", "ref-04", "ref-03", "ref-11"], // 1 Meridian Cliff Villa
  ["ref-13", "ref-04", "ref-07", "ref-08"], // 2 Aurum Sky Penthouse
  ["ref-06", "ref-07", "ref-12", "ref-02"], // 3 Solstice Lake Estate
  ["ref-08", "ref-09", "ref-04", "ref-13"], // 4 Lumen Marina Residence
  ["ref-02", "ref-03", "ref-05", "ref-06"], // 5 Ancora Desert House
  ["ref-11", "ref-09", "ref-12", "ref-10"], // 6 Velaris Alpine Chalet
  ["ref-10", "ref-05", "ref-07", "ref-11"], // 7 Isla Serena Retreat
  ["ref-06", "ref-05", "ref-03", "ref-08"], // 8 Kiyomi Garden Residence
];

const blog = ["ref-10", "ref-04", "ref-08", "ref-13", "ref-09", "ref-05"];
const neighborhoods = ["ref-11", "ref-13", "ref-08", "ref-10"];
const brand = {
  "about-hero": "ref-10",
  lifestyle: "ref-05",
  journey: "ref-04",
  "services-bg": "ref-13",
};

/** Cover-crop + optimize a source into a target slot. */
async function emit(source, relTarget, [w, h]) {
  const target = join(OUT, relTarget);
  mkdirSync(dirname(target), { recursive: true });
  await sharp(join(SRC, `${source}.jpg`))
    .resize(w, h, { fit: "cover", position: "attention" })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(target);
  return relTarget;
}

async function run() {
  const jobs = [];
  const kinds = ["exterior", "interior", "detail", "view"];

  properties.forEach((set, i) => {
    set.forEach((src, k) => {
      jobs.push(
        emit(src, `properties/property-${i + 1}-${kinds[k]}.jpg`, LANDSCAPE),
      );
    });
  });
  blog.forEach((src, i) =>
    jobs.push(emit(src, `blog/post-${i + 1}.jpg`, LANDSCAPE)),
  );
  neighborhoods.forEach((src, i) =>
    jobs.push(emit(src, `neighborhoods/neighborhood-${i + 1}.jpg`, PORTRAIT)),
  );
  for (const [name, src] of Object.entries(brand)) {
    jobs.push(emit(src, `brand/${name}.jpg`, LANDSCAPE));
  }

  const done = await Promise.all(jobs);
  console.log(`Processed ${done.length} photographs into public/images:`);
  console.log(`  ${properties.length * 4} property images`);
  console.log(`  ${blog.length} blog heroes`);
  console.log(`  ${neighborhoods.length} neighborhood images`);
  console.log(`  ${Object.keys(brand).length} brand images`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
