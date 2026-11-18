import Developer from "@/lib/models/Developer";
import { getCachedProperties } from "@/lib/data/properties";
import { getPropertyPath } from "@/lib/utils/propertySlug";

export const citySlug = (name) => name?.toLowerCase().trim().replace(/\s+/g, "-");

/**
 * Everything a crawler needs to reach every public page by plain <a href>
 * links: active properties, registered developers, and cities that have at
 * least one active property. Shared by the homepage "Explore" block, the
 * /developers index and the sitemap so the three never disagree.
 * Never throws — a failed source just yields an empty list.
 */
export async function getSiteDirectory() {
  const [propertiesResult, developersResult] = await Promise.allSettled([
    getCachedProperties({ activeStatus: "Yes" }),
    Developer.getAll(),
  ]);

  const rawProperties =
    propertiesResult.status === "fulfilled" ? propertiesResult.value || [] : [];
  const rawDevelopers =
    developersResult.status === "fulfilled" ? developersResult.value || [] : [];

  const seen = new Set();
  const properties = rawProperties
    .filter((p) => p?.id)
    .map((p) => ({
      id: p.id,
      path: getPropertyPath(p),
      name: p.projectName || p.propertyTitle || p.title || p.name || "Property",
      builderName: p.builderName?.trim() || "",
      city: p.city?.trim() || "",
      locality: p.locality?.trim() || "",
      updatedAt: p.updatedAt || p.createdAt,
    }))
    .filter((p) => (seen.has(p.path) ? false : seen.add(p.path)))
    .sort((a, b) => a.name.localeCompare(b.name));

  const developers = rawDevelopers
    .filter((d) => d?.slug)
    .map((d) => {
      const name = d.name?.trim() || d.slug;
      const n = name.toLowerCase();
      const projectCount = properties.filter((p) => {
        const b = p.builderName.toLowerCase();
        return b && (b === n || b.includes(n) || n.includes(b));
      }).length;
      return {
        slug: d.slug,
        path: `/developers/${d.slug}`,
        name,
        tagline: d.tagline || "",
        projectCount,
        updatedAt: d.updatedAt || d.createdAt,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  const cities = [...new Set(properties.map((p) => p.city).filter(Boolean))]
    .sort()
    .map((name) => ({ name, path: `/locations/${citySlug(name)}` }));

  return { properties, developers, cities };
}
