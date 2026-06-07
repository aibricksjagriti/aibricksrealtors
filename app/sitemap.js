import { SITE_URL } from "@/lib/utils/seo";
import Developer from "@/lib/models/Developer";
import LocationPage from "@/lib/models/LocationPage";
import { getCachedProperties } from "@/lib/data/properties";

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
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/news`, changeFrequency: "weekly", priority: 0.4 },
    { url: `${SITE_URL}/privacy-policy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/disclaimer`, changeFrequency: "yearly", priority: 0.2 },
  ].map((route) => ({ ...route, lastModified: new Date() }));

  let propertyRoutes = [];
  try {
    const properties = await getCachedProperties({ activeStatus: "Yes" });
    propertyRoutes = properties
      .filter((p) => p?.id)
      .map((p) => ({
        url: `${SITE_URL}/properties/${p.id}`,
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

  return [...staticRoutes, ...propertyRoutes, ...developerRoutes, ...locationRoutes];
}
