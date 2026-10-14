import posthog from "posthog-js";

/**
 * PostHog, loaded once on the client before hydration (Next's
 * `instrumentation-client` convention — no provider, no layout change).
 *
 * The project token is public by design: it only allows sending events.
 * Production only, so local dev and Vercel previews don't pollute the stats.
 * Events go through `/ingest` (rewritten in next.config.js) so ad blockers
 * don't drop them.
 */
if (process.env.NEXT_PUBLIC_VERCEL_ENV === "production") {
  posthog.init("phc_BdhkiXCpod22xQtzVdSi2mLe8Ls4b7QdT6kipNirATuH", {
    api_host: "/ingest",
    ui_host: "https://eu.posthog.com",
    defaults: "2026-08-30",
  });
}
