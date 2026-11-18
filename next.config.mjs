/** @type {import('next').NextConfig} */
const nextConfig = {
  // Serve search-engine crawlers a fully blocking render (no streamed
  // loading shell) so notFound() in generateMetadata returns a real
  // HTTP 404 instead of a streamed 200 "soft 404".
  htmlLimitedBots:
    /Googlebot|Google-InspectionTool|Bingbot|Slurp|DuckDuckBot|Baiduspider|YandexBot|Applebot|facebookexternalhit|Twitterbot|LinkedInBot|WhatsApp|Mediapartners-Google|AdsBot-Google/i,
  // Belt and braces for private areas: robots.txt already disallows them, but
  // a linked URL can still be indexed without a crawl. X-Robots-Tag keeps them
  // out of search even then.
  async headers() {
    return ["/admin", "/admin/:path*", "/dashboard", "/dashboard/:path*"].map((source) => ({
      source,
      headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
    }));
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
      },
    ],
  },
};

export default nextConfig;
