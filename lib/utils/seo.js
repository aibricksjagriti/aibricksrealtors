const SITE_URL = "https://aibricksrealtors.com";
const SITE_NAME = "AI Bricks Realtors";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

/**
 * Build a complete Next.js metadata object (title, description, keywords,
 * canonical, robots, Open Graph, Twitter) from CMS-managed SEO fields.
 *
 * @param {Object} opts
 * @param {string} [opts.title]        Meta title (from admin panel or fallback)
 * @param {string} [opts.description]  Meta description
 * @param {string|string[]} [opts.keywords] Comma-separated string or array
 * @param {string} [opts.canonicalUrl] Explicit canonical URL (admin override)
 * @param {string} [opts.path]         Page path used to build the default canonical
 * @param {string} [opts.image]        OG image URL
 * @param {boolean} [opts.noIndex]     Set true to block indexing
 */
function buildMetadata({
  title,
  description,
  keywords,
  canonicalUrl,
  path = "/",
  image,
  noIndex = false,
} = {}) {
  const canonical = canonicalUrl || `${SITE_URL}${path}`;
  const ogImage = image || DEFAULT_OG_IMAGE;

  const metadata = {
    title: title || undefined,
    description: description || undefined,
    alternates: { canonical },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
    openGraph: {
      title: title || SITE_NAME,
      description: description || undefined,
      url: canonical,
      siteName: SITE_NAME,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title || SITE_NAME }],
      type: "website",
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title: title || SITE_NAME,
      description: description || undefined,
      images: [ogImage],
    },
  };

  if (keywords) {
    metadata.keywords = Array.isArray(keywords)
      ? keywords
      : String(keywords)
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean);
  }

  return metadata;
}

module.exports = { buildMetadata, SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE };
