import Developer from "@/lib/models/Developer";
import Locality from "@/lib/models/Locality";
import Property from "@/lib/models/Property";

export async function getNavData() {
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
}
