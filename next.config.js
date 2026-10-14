/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  cacheComponents: true,
  // `lib/blog.ts` reads `content/blog` at runtime too, when the nightly cron
  // rebuilds the lists: the files must ship with the server functions.
  outputFileTracingIncludes: {
    "/**": ["./content/blog/**/*.md"],
    "/blog-assets/**": ["./content/blog/**/*"],
  },
  // PostHog reverse proxy — see instrumentation-client.ts.
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://eu-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://eu.i.posthog.com/:path*",
      },
    ];
  },
  // PostHog API paths end with a trailing slash; don't redirect them away.
  skipTrailingSlashRedirect: true,
};

module.exports = nextConfig;
