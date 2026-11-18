import { SITE_URL } from "@/lib/utils/seo";
import Developer from "@/lib/models/Developer";
import LocationPage from "@/lib/models/LocationPage";
import { getCachedProperties } from "@/lib/data/properties";
import { getPropertyPath } from "@/lib/utils/propertySlug";
import { citySlug } from "@/lib/data/siteDirectory";

export const revalidate = 3600;

const toDate = (value) => {
  try {
    if (!value) return new Date();
    if (typeof value.toDate === "function") return value.toDate();
    const d = new Date(value);
    return isNaN(d.getTime()) ? new Date() : d;
  } catch {
    return new Date();
  }
};

export default async function sitemap() {
  const staticRoutes = [
    { url: `${SITE_URL}`, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/properties`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/locations`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/developers`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/privacy-policy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/disclaimer`, changeFrequency: "yearly", priority: 0.2 },
  ].map((route) => ({ ...route, lastModified: new Date() }));

  let propertyRoutes = [];
  let cityRoutes = [];
  try {
    const properties = await getCachedProperties({ activeStatus: "Yes" });
    // /locations links to one page per city with active properties; those
    // pages are indexable, so they belong in the sitemap even without a CMS
    // LocationPage record.
    cityRoutes = [...new Set(properties.map((p) => citySlug(p?.city)).filter(Boolean))].map(
      (slug) => ({
        url: `${SITE_URL}/locations/${slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      })
    );
    propertyRoutes = properties
      .filter((p) => p?.id)
      .map((p) => ({
        url: `${SITE_URL}${getPropertyPath(p)}`,
        lastModified: toDate(p.updatedAt || p.createdAt),
        changeFrequency: "weekly",
        priority: 0.8,
      }));
  } catch (err) {
    console.error("sitemap: failed to load properties", err);
  }

  let developerRoutes = [];
  try {
    const developers = await Developer.getAll();
    developerRoutes = developers
      .filter((d) => d?.slug)
      .map((d) => ({
        url: `${SITE_URL}/developers/${d.slug}`,
        lastModified: toDate(d.updatedAt || d.createdAt),
        changeFrequency: "weekly",
        priority: 0.7,
      }));
  } catch (err) {
    console.error("sitemap: failed to load developers", err);
  }

  let locationRoutes = [];
  try {
    const pages = await LocationPage.getAll();
    locationRoutes = pages
      .filter((p) => p?.slug)
      .map((p) => ({
        url: `${SITE_URL}/locations/${p.slug}`,
        lastModified: toDate(p.updatedAt || p.createdAt),
        changeFrequency: "weekly",
        priority: 0.7,
      }));
  } catch (err) {
    console.error("sitemap: failed to load location pages", err);
  }

  // De-duplicate by URL (a city can come from both properties and the CMS).
  const byUrl = new Map();
  for (const entry of [...staticRoutes, ...propertyRoutes, ...developerRoutes, ...locationRoutes, ...cityRoutes]) {
    if (!byUrl.has(entry.url)) byUrl.set(entry.url, entry);
  }
  return [...byUrl.values()];
}
