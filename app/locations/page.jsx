import Link from "next/link";
import { getCachedProperties } from "@/lib/data/properties";
import Locality from "@/lib/models/Locality";

export const revalidate = 300;

function createSlug(name) {
  return name?.toLowerCase().replace(/\s+/g, "-");
}

async function getCities() {
  try {
    const [properties, localities] = await Promise.all([
      getCachedProperties({ activeStatus: "Yes" }),
      Locality.getAll().catch(() => []),
    ]);

    const fromProperties = properties.map((item) => item?.city).filter(Boolean);
    const fromLocalities = localities.map((l) => l.city).filter(Boolean);

    return [...new Set([...fromProperties, ...fromLocalities])].sort();
  } catch (err) {
    console.error(err);
    return [];
  }
}

export default async function LocationsPage() {
  const cities = await getCities();

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 mt-28">
      <h1 className="text-2xl md:text-4xl font-bold mb-2 text-center">
        Explore Cities
      </h1>
      <p className="text-center text-gray-500 mb-8">Find properties across top cities</p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {cities.map((city, i) => (
          <Link
            key={i}
            href={`/locations/${createSlug(city)}`}
            className="border rounded-xl p-5 text-center hover:shadow-md hover:border-brickred transition-all"
          >
            <p className="font-semibold text-gray-800">{city}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
