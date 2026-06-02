import { unstable_cache } from "next/cache";
import propertyModel from "@/lib/models/Property";
import { convertTimestamps } from "@/lib/utils/timestampConverter";

export const getCachedProperties = unstable_cache(
  async (filters = {}) => {
    const properties = await propertyModel.getAll(filters);
    return properties.map((property) => convertTimestamps(property));
  },
  ["properties"],
  {
    revalidate: 300,
    tags: ["properties"],
  },
);
