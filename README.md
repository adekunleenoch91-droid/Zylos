# Zylos — Luxury Real Estate

A world-class luxury real estate digital experience: cinematic storytelling,
an immersive WebGL-powered 3D hero, a complete design system and
production-grade engineering.

![Stack](https://img.shields.io/badge/Next.js%2015-App%20Router-black)
![React](https://img.shields.io/badge/React%2019-R3F%209-blue)
![Tailwind](https://img.shields.io/badge/Tailwind%20CSS-4-38bdf8)

## Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 15 (App Router, SSG/SSR) + TypeScript strict |
| 3D | Three.js + React Three Fiber + drei + postprocessing |
| Motion | Framer Motion (shared motion tokens, `prefers-reduced-motion` aware) |
| Styling | Tailwind CSS 4 with a token-first design system (`src/styles/globals.css`) |
| Icons | Lucide (thin, geometric) |
| Imagery | Original generated SVG artwork (`scripts/generate-artwork.mjs`) |

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (all routes prerendered)
npm run start      # serve the production build
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
npm run test       # Vitest unit suite
```

### Environment

Copy `.env.example` to `.env.local` (or configure in your host):

- `NEXT_PUBLIC_SITE_URL` — public origin for canonical URLs, sitemap and
  Open Graph metadata.
- `NEXT_PUBLIC_ANALYTICS_ID` — GA4 measurement ID. When set, GA4 +
  Core Web Vitals reporting load (anonymized IP) and the CSP automatically
  allows the Google Analytics origins. Blank disables all analytics.

## Architecture

```
src/
  app/            Routes: /, /properties(/[slug]), /agents(/[slug]),
                  /about, /blog(/[slug]), /contact, 404, sitemap, robots
  components/
    ui/           Design-system primitives (Button, Field, Modal, …)
    cards/        PropertyCard (3D tilt), AgentCard, BlogCard
    sections/     Homepage + shared page sections
    layout/       Navbar, Footer, ScrollProgress, PageTransition, …
    three/        WebGL: HeroVilla scene, ambient sculptures, interactive
                  per-property 3D viewer, quality tiers
    property/     Gallery/lightbox, floor plan, map, mortgage calculator
    forms/        Contact, viewing, agent, newsletter forms
    analytics/    Opt-in GA4 + Core Web Vitals reporting
    motion/       Reveal, CountUp, Parallax primitives
  services/       Content service — the CMS/API seam (components never
                  import src/data directly)
  data/           Typed static content (properties, agents, posts, …)
  types/          Domain models
  lib/            utils, SEO/JSON-LD builders, motion tokens, analytics
  hooks/          useScrolled, useQualityTier
  config/         Site/brand configuration
scripts/          generate-artwork.mjs — regenerates all SVG imagery
tests/            Vitest unit suite (services, utils, SEO builders)
```

### Error handling

`app/error.tsx` catches route-level exceptions with an on-brand recovery
screen; `app/global-error.tsx` is the self-contained last-resort boundary.

### Testing

`npm run test` runs the Vitest suite (26 tests) covering the content
service (filter/sort/lookup), formatting utilities and every JSON-LD
builder. Pure-logic tests run in a Node environment — fast and dependency-light.

### Design tokens

Color, typography (fluid clamp scale), spacing, radius, elevation and
motion timing all live in `src/styles/globals.css` under `@theme`. Every
component consumes tokens — no arbitrary values.

### 3D quality tiers

`useQualityTier` detects device capability and scales the experience:

- **high** — shadows, reflective pool, bloom + vignette post-processing
- **medium / low** — reduced DPR, no post-processing, fewer particles
- **fallback** — static art-directed hero when WebGL is unavailable

Rendering pauses entirely when scenes leave the viewport, and all motion
honors `prefers-reduced-motion`.

### Content

Static data ships in `src/data`, consumed exclusively through the async
service layer in `src/services/content.ts` — swap the function bodies for
a headless CMS, REST or GraphQL source without touching components.

### SEO

Per-page metadata + canonicals, Open Graph/Twitter cards, JSON-LD
(Organization/RealEstateAgent, WebSite + SearchAction, Residence, Person,
BlogPosting, BreadcrumbList), XML sitemap, robots.txt, and semantic HTML
throughout. Security headers (CSP, HSTS, frame/nosniff) are configured in
`next.config.ts`.

## Deployment

Optimized for Vercel (zero-config), and compatible with Netlify or
Cloudflare Pages. All 24 routes prerender at build time; `/properties`
server-renders to support search query params.
