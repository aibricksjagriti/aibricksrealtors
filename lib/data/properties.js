import { unstable_cache } from "next/cache";
import propertyModel from "@/lib/models/Property";
import { convertTimestamps } from "@/lib/utils/timestampConverter";

const memoryCache = new Map();
const MEMORY_TTL_MS = 5 * 60 * 1000;

function getCacheKey(filters) {
  return JSON.stringify(filters || {});
}

export const getCachedProperties = unstable_cache(
  async (filters = {}) => {
    const cacheKey = getCacheKey(filters);
    const cached = memoryCache.get(cacheKey);

    if (cached && Date.now() - cached.createdAt < MEMORY_TTL_MS) {
      return cached.data;
    }

    const properties = await propertyModel.getAll(filters);
    const data = properties.map((property) => convertTimestamps(property));

    memoryCache.set(cacheKey, {
      createdAt: Date.now(),
      data,
    });

    return data;
  },
  ["properties"],
  {
    revalidate: 300,
    tags: ["properties"],
  },
);
