/**
 * Zylos image manifest.
 *
 * Every image slot the site renders, with its target path, dimensions and a
 * tailored photorealistic generation prompt. This is the single source used
 * by:
 *   - `scripts/generate-images.mjs` (produces real AI photographs via an
 *     image API, or writes the prompt sheet when no API is configured)
 *   - `docs/IMAGE-PROMPTS.md` (human-readable sheet, regenerated from here)
 *
 * Filenames match exactly what the app already references, so generated
 * photographs drop straight in with no code changes. Use `.jpg` (or `.webp`)
 * outputs; Next/Image will convert to AVIF/WebP and size them per device.
 */

const STYLE =
  "photorealistic, ultra-detailed architectural photography, cinematic dusk " +
  "lighting, warm golden interior glow against deep midnight-navy sky, " +
  "elegant and serene, luxury real estate editorial, shot on a full-frame " +
  "camera with a tilt-shift lens, high dynamic range, no people, no text, " +
  "no watermark, no logos";

const PORTRAIT_STYLE =
  "photorealistic professional headshot, luxury real estate advisor, " +
  "confident and approachable, soft cinematic studio lighting with a warm " +
  "gold rim light, dark graphite background, shallow depth of field, shot on " +
  "an 85mm portrait lens, editorial quality, no text, no watermark";

/** Compact visual descriptors for each property (4 images apiece). */
const propertyBriefs = [
  {
    n: 1,
    name: "Meridian Cliff Villa",
    place: "the Côte d'Azur, France",
    ext: "a glass-and-concrete modern villa carved into a Mediterranean cliff above a private cove, infinity pool tracing the cliff edge, board-formed concrete and warm travertine",
    int: "a double-height living room with floor-to-ceiling glazing framing the Mediterranean sea at dusk, travertine floors, minimalist furniture",
    det: "a sculptural floating staircase detail in travertine and bronze, warm evening light",
    view: "an evening view across a private Mediterranean cove from a cantilevered terrace",
  },
  {
    n: 2,
    name: "Aurum Sky Penthouse",
    place: "Tribeca, New York",
    ext: "the illuminated glass crown of a contemporary Manhattan residential tower at dusk",
    int: "a full-floor penthouse great room with panoramic floor-to-ceiling curtain-wall glazing over the Manhattan skyline at dusk, honed basalt and fluted walnut",
    det: "a gallery hall interior detail in honed basalt and fluted walnut with recessed warm lighting",
    view: "a private rooftop garden with a plunge pool overlooking the New York skyline at night",
  },
  {
    n: 3,
    name: "Solstice Lake Estate",
    place: "Lake Como, Italy",
    ext: "a series of low modernist glass pavilions reflected in a still alpine lake at dusk, surrounded by old-growth forest",
    int: "a lakeside living pavilion with sliding glass walls fully open to the lake, blackened steel and smoked oak",
    det: "a blackened-steel and smoked-oak staircase detail, soft evening light",
    view: "a view across a still forest lake from a private boathouse at dusk",
  },
  {
    n: 4,
    name: "Lumen Marina Residence",
    place: "Monaco",
    ext: "a sleek waterfront residence above an illuminated superyacht marina at dusk",
    int: "a yacht-inspired saloon living room with curved lacquered walls and brushed bronze detailing",
    det: "a brushed-bronze staircase and porthole light detail",
    view: "a deep teak terrace overlooking a superyacht marina at dusk",
  },
  {
    n: 5,
    name: "Ancora Desert House",
    place: "the high desert near Scottsdale, USA",
    ext: "a monolithic rammed-earth house alone in the high desert at dusk under a vast sky",
    int: "a serene living space with deep window reveals framing desert mountains, rammed-earth walls, golden evening light",
    det: "a rammed-earth wall texture detail catching warm low evening light",
    view: "a central courtyard with a black reflecting pool mirroring the desert night sky",
  },
  {
    n: 6,
    name: "Velaris Alpine Chalet",
    place: "Courchevel, France",
    ext: "a warmly lit cedar-and-granite alpine chalet against evening snow with a glacier beyond",
    int: "a double-height chalet great room with a suspended fireplace and triple-height glazing onto a glacier",
    det: "hand-hewn cedar and granite interior detailing, warm firelight",
    view: "a glacier view from an indoor-outdoor chalet pool at dusk",
  },
  {
    n: 7,
    name: "Isla Serena Retreat",
    place: "the Exuma Cays, Bahamas",
    ext: "an open-sided island villa with a floating timber roof beside calm turquoise water at dusk",
    int: "an open-air living pavilion under a floating timber roof, trade winds, white sand beyond",
    det: "an outdoor stone bath detail in a tropical guest pavilion at dusk",
    view: "a view along a white-sand private-island shore at sunset",
  },
  {
    n: 8,
    name: "Kiyomi Garden Residence",
    place: "Minami-Azabu, Tokyo",
    ext: "a shou-sugi-ban charred-timber residence facade facing a private moss garden at dusk",
    int: "a serene principal room opening onto a private moss garden with a mature maple, hand-troweled plaster, paper-filtered light",
    det: "paper-filtered light across hand-troweled plaster, quiet minimalist detail",
    view: "a tea pavilion and koi pond in a private moss garden in the evening",
  },
];

const agentBriefs = [
  { n: 1, who: "a poised woman in her late 40s, founding partner, elegant tailored dark blazer" },
  { n: 2, who: "a confident man in his 40s, managing partner, sharp navy suit" },
  { n: 3, who: "a refined woman in her late 30s, alpine and riviera director, understated luxury" },
  { n: 4, who: "a distinguished man in his 40s, architectural-homes advisor, considered and calm" },
  { n: 5, who: "a composed woman in her 40s, Asia-Pacific director, quiet elegance" },
];

const postBriefs = [
  { n: 1, topic: "a serene private courtyard house with an internal moss garden at dusk" },
  { n: 2, topic: "a trophy penthouse interior with panoramic city glazing at dusk" },
  { n: 3, topic: "a prime alpine chalet exterior against a glacier at golden hour" },
  { n: 4, topic: "a discreet grand estate glimpsed through trees at dusk, editorial and quiet" },
  { n: 5, topic: "a beautifully lit luxury interior at dusk emphasising layered lighting design" },
  { n: 6, topic: "a generational family estate with a great table and warm evening light" },
];

const neighborhoodBriefs = [
  { n: 1, name: "Cap Lumière, Côte d'Azur", scene: "a guarded Riviera peninsula of pine and glass villas above the sea at dusk, aerial" },
  { n: 2, name: "Tribeca, New York", scene: "cast-iron Tribeca streets and full-floor loft buildings at dusk, warm windows" },
  { n: 3, name: "Les Hauts, Courchevel", scene: "the highest chalets of an alpine valley at dusk with a glacier beyond" },
  { n: 4, name: "Minami-Azabu, Tokyo", scene: "a quiet embassy-district street of garden-walled Tokyo residences at dusk" },
];

/** Build the full manifest. */
export function buildManifest() {
  const items = [];
  const add = (file, w, h, prompt) => items.push({ file, w, h, prompt });

  for (const p of propertyBriefs) {
    add(`properties/property-${p.n}-exterior.jpg`, 1600, 1000, `${p.ext}, in ${p.place}. ${STYLE}`);
    add(`properties/property-${p.n}-interior.jpg`, 1600, 1000, `${p.int}. ${STYLE}`);
    add(`properties/property-${p.n}-detail.jpg`, 1600, 1000, `${p.det}. ${STYLE}`);
    add(`properties/property-${p.n}-view.jpg`, 1600, 1000, `${p.view}. ${STYLE}`);
  }
  for (const a of agentBriefs)
    add(`agents/agent-${a.n}.jpg`, 800, 1000, `${a.who}. ${PORTRAIT_STYLE}`);
  for (let t = 1; t <= 6; t++)
    add(`agents/avatar-${t}.jpg`, 400, 400, `a satisfied luxury real estate client, warm genuine expression. ${PORTRAIT_STYLE}`);
  for (const b of postBriefs)
    add(`blog/post-${b.n}.jpg`, 1600, 1000, `${b.topic}. ${STYLE}`);
  for (const nb of neighborhoodBriefs)
    add(`neighborhoods/neighborhood-${nb.n}.jpg`, 1600, 1000, `${nb.scene}. ${STYLE}`);

  add("brand/about-hero.jpg", 1600, 1000, `an abstract architectural composition of golden arcs over a colonnade at dusk, editorial. ${STYLE}`);
  add("brand/lifestyle.jpg", 1600, 1000, `a tranquil luxury living space at dusk, warm light across the floor, aspirational. ${STYLE}`);
  add("brand/office.jpg", 1600, 1000, `a refined luxury real estate gallery office interior at dusk in Tribeca, New York. ${STYLE}`);
  add("brand/journey.jpg", 1600, 1000, `a serene residence interior at dusk with warm light across the floor. ${STYLE}`);

  return items;
}
