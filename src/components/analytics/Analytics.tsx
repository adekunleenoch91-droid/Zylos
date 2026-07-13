"use client";

import Script from "next/script";
import { useReportWebVitals } from "next/web-vitals";
import { analyticsId } from "@/lib/analytics";

/**
 * Loads Google Analytics 4 and reports Core Web Vitals — but only when
 * NEXT_PUBLIC_ANALYTICS_ID is configured. Without it, nothing loads and no
 * data leaves the browser, keeping the default experience privacy-clean and
 * the initial payload lean. Scripts load with `afterInteractive` so they
 * never block LCP or interactivity.
 */
export function Analytics() {
  useReportWebVitals((metric) => {
    if (typeof window.gtag === "function") {
      window.gtag("event", metric.name, {
        value: Math.round(
          metric.name === "CLS" ? metric.value * 1000 : metric.value,
        ),
        metric_id: metric.id,
        metric_rating: metric.rating,
        non_interaction: true,
      });
    }
  });

  if (!analyticsId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${analyticsId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${analyticsId}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
