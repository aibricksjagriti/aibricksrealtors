/** @type {import('next').NextConfig} */
const nextConfig = {
  // Serve search-engine crawlers a fully blocking render (no streamed
  // loading shell) so notFound() in generateMetadata returns a real
  // HTTP 404 instead of a streamed 200 "soft 404".
  htmlLimitedBots:
    /Googlebot|Google-InspectionTool|Bingbot|Slurp|DuckDuckBot|Baiduspider|YandexBot|Applebot|facebookexternalhit|Twitterbot|LinkedInBot|WhatsApp|Mediapartners-Google|AdsBot-Google/i,
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
