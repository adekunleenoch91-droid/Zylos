/**
 * Privacy-conscious analytics helper.
 *
 * Events are only dispatched when an analytics provider is actually present
 * on the page (e.g. GA4's `gtag`, injected when NEXT_PUBLIC_ANALYTICS_ID is
 * configured). With no provider, every call is a silent no-op — nothing is
 * collected and no requests are made. No personally identifying information
 * should ever be passed in `props`.
 */

type GtagFn = (
  command: "event",
  action: string,
  params?: Record<string, unknown>,
) => void;

declare global {
  interface Window {
    gtag?: GtagFn;
    dataLayer?: unknown[];
  }
}

/** Conversion and interaction events tracked across the site. */
export type AnalyticsEvent =
  | "property_view"
  | "property_save"
  | "contact_submit"
  | "viewing_request"
  | "agent_contact"
  | "newsletter_subscribe";

export function track(
  event: AnalyticsEvent,
  props: Record<string, string | number | boolean> = {},
): void {
  if (typeof window === "undefined") return;
  if (typeof window.gtag === "function") {
    window.gtag("event", event, props);
  } else if (process.env.NODE_ENV === "development") {
    // Visibility during local development without a provider configured.
    console.debug("[analytics]", event, props);
  }
}

export const analyticsId = process.env.NEXT_PUBLIC_ANALYTICS_ID;
