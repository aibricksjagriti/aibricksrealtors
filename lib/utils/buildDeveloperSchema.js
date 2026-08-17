// Builds a Schema.org JSON-LD object for a developer page.
// Used on both sides: the admin panel (live preview) and the public page
// (actual <script type="application/ld+json"> output) — so the preview the
// admin sees always matches what gets shipped.
//
// developer.schema shape:
// {
//   type: "RealEstateAgent" | "Organization" | "LocalBusiness",
//   fields: {
//     name, url, logo, image, telephone, email, priceRange,
//     streetAddress, addressLocality, addressRegion, postalCode, addressCountry,
//     sameAs: string[]
//   },
//   rawJsonLd: string   // if non-empty, takes full precedence
// }
export function buildDeveloperSchema(developer, { builderName, pageUrl } = {}) {
  const schema = developer?.schema;
  if (!schema) return null;

  // Raw JSON-LD override — full admin control, used as-is.
  if (schema.rawJsonLd && schema.rawJsonLd.trim()) {
    try {
      return JSON.parse(schema.rawJsonLd);
    } catch {
      // Invalid JSON should never reach here (validated on save), but fail
      // closed rather than shipping broken structured data to search engines.
      return null;
    }
  }

  const f = schema.fields || {};
  const type = schema.type || "RealEstateAgent";

  const address = {
    "@type": "PostalAddress",
    streetAddress: f.streetAddress || undefined,
    addressLocality: f.addressLocality || undefined,
    addressRegion: f.addressRegion || undefined,
    postalCode: f.postalCode || undefined,
    addressCountry: f.addressCountry || undefined,
  };
  const hasAddress = Object.keys(address).some(
    (key) => key !== "@type" && address[key]
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": type,
    name: f.name || builderName || undefined,
    url: f.url || pageUrl || undefined,
    logo: f.logo || undefined,
    image: f.image || f.logo || undefined,
    telephone: f.telephone || undefined,
    email: f.email || undefined,
    priceRange: f.priceRange || undefined,
    address: hasAddress ? address : undefined,
    sameAs:
      Array.isArray(f.sameAs) && f.sameAs.length ? f.sameAs : undefined,
  };

  // JSON round-trip strips every `undefined` key automatically.
  return JSON.parse(JSON.stringify(jsonLd));
}
