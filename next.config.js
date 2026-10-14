/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  cacheComponents: true,
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
