import type { NextConfig } from "next";

/**
 * Security headers applied to every route. CSP allows self-hosted assets
 * only; inline styles are required by Next.js font optimization and
 * framer-motion, and blob workers are used by DRACO/KTX2 decoders. Google
 * Analytics origins are appended to the policy only when analytics is
 * actually enabled, so the default posture stays as tight as possible.
 */
const analyticsEnabled = Boolean(process.env.NEXT_PUBLIC_ANALYTICS_ID);
const gaScript = analyticsEnabled
  ? " https://www.googletagmanager.com https://www.google-analytics.com"
  : "";
const gaConnect = analyticsEnabled
  ? " https://www.google-analytics.com https://region1.google-analytics.com"
  : "";
const gaImg = analyticsEnabled ? " https://www.google-analytics.com" : "";

/**
 * Optional external image host (a CDN or object store holding real
 * photographs). When NEXT_PUBLIC_IMAGE_HOST is set, it is allow-listed for
 * next/image optimization and added to the CSP img-src. Unset by default —
 * all imagery is served same-origin from /public.
 */
const imageHost = process.env.NEXT_PUBLIC_IMAGE_HOST;
const imgHostCsp = imageHost ? ` https://${imageHost}` : "";

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline' 'unsafe-eval'${gaScript}`,
      "style-src 'self' 'unsafe-inline'",
      `img-src 'self' data: blob:${gaImg}${imgHostCsp}`,
      "font-src 'self' data:",
      `connect-src 'self' blob:${gaConnect}`,
      "worker-src 'self' blob:",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [320, 640, 768, 1024, 1280, 1536, 1920, 2560],
    // Allow real photographs served from an external CDN/object store when
    // NEXT_PUBLIC_IMAGE_HOST is configured; otherwise images stay same-origin.
    remotePatterns: imageHost
      ? [{ protocol: "https", hostname: imageHost }]
      : [],
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        source: "/:all*(glb|ktx2|woff2|avif|webp)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
