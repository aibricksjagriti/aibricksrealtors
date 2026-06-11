import { unstable_cache } from "next/cache";
import Developer from "@/lib/models/Developer";
import Locality from "@/lib/models/Locality";
import Property from "@/lib/models/Property";

// Cached for 5 minutes. Do NOT use noStore() here: this runs in the root
// layout, so opting out of caching forces every page on the site into
// dynamic rendering — which disables ISR (`revalidate`), breaks real 404
// status codes (streamed responses always send 200 first), and hits
// Firestore on every page view.
export const getNavData = unstable_cache(
  async () => {
    try {
      const [developers, localityCities, propertyCities] = await Promise.all([
        Developer.getAll(),
        Locality.getCities(),
        Property.getCities(),
      ]);

      const builders = developers
        .filter((d) => d.name && d.slug)
        .map((d) => ({ name: d.name.trim(), slug: d.slug }))
        .sort((a, b) => a.name.localeCompare(b.name));

      const allCities = [...new Set([...localityCities, ...propertyCities])].sort();
      const locations = allCities.map((city) => ({
        city,
        slug: city.toLowerCase().replace(/\s+/g, "-"),
      }));

      return { builders, locations };
    } catch {
      return { builders: [], locations: [] };
    }
  },
  ["nav-data"],
  { revalidate: 300 }
);
