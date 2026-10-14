import posthog from "posthog-js";

/**
 * PostHog, loaded once on the client before hydration (Next's
 * `instrumentation-client` convention — no provider, no layout change).
 *
 * The project token is public by design: it only allows sending events.
 * Production only, so local dev and Vercel previews don't pollute the stats.
 * Events go through `/ingest` (rewritten in next.config.js) so ad blockers
 * don't drop them.
 *
 * To exclude our own visits, open any page once with `?notrack` on each
 * browser: the opt-out is persisted, `?track` reverts it.
 */
if (process.env.NEXT_PUBLIC_VERCEL_ENV === "production") {
  const params = new URLSearchParams(window.location.search);
  const notrack = params.has("notrack");

  posthog.init("phc_BdhkiXCpod22xQtzVdSi2mLe8Ls4b7QdT6kipNirATuH", {
    api_host: "/ingest",
    ui_host: "https://eu.posthog.com",
    defaults: "2026-08-30",
    // Keeps the `?notrack` visit itself out of the stats.
    opt_out_capturing_by_default: notrack,
  });

  if (notrack) posthog.opt_out_capturing();
  if (params.has("track")) posthog.opt_in_capturing();
}
