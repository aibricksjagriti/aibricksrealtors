export type PropertyMarketingRecord = {
  propertyTitle?: string;
  projectName?: string;
  title?: string;
  name?: string;
  propertyType?: string;
  locality?: string;
  subLocality?: string;
  city?: string;
  subTypes?: unknown[];
  builtUpArea?: Array<{ subType?: unknown }>;
  floorPlans?: Array<{ name?: unknown }>;
};

const FALLBACK_PROPERTY_NAME = "Premium Residential Project";

export const cleanPropertyText = (value: unknown): string =>
  typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";

export const getPropertyMarketingName = (
  property: PropertyMarketingRecord,
): string =>
  cleanPropertyText(
    property.projectName ||
      property.propertyTitle ||
      property.title ||
      property.name,
  ) || FALLBACK_PROPERTY_NAME;

const getBhkValues = (property: PropertyMarketingRecord): number[] => {
  const labels = [
    ...(Array.isArray(property.subTypes) ? property.subTypes : []),
    ...(Array.isArray(property.builtUpArea)
      ? property.builtUpArea.map((item) => item?.subType)
      : []),
    ...(Array.isArray(property.floorPlans)
      ? property.floorPlans.map((item) => item?.name)
      : []),
  ];

  return [
    ...new Set(
      labels.flatMap((label) => {
        const match = cleanPropertyText(label).match(/(\d+(?:\.\d+)?)\s*BHK/i);
        return match ? [Number(match[1])] : [];
      }),
    ),
  ].sort((a, b) => a - b);
};

const formatList = (values: string[]): string => {
  if (values.length <= 1) return values[0] || "";
  if (values.length === 2) return `${values[0]} & ${values[1]}`;
  return `${values.slice(0, -1).join(", ")} & ${values.at(-1)}`;
};

const getBhkLabel = (property: PropertyMarketingRecord): string => {
  const bhkValues = getBhkValues(property).map(String);
  return bhkValues.length > 0 ? `${formatList(bhkValues)} BHK` : "";
};

export const getResidenceMarketingLabel = (
  property: PropertyMarketingRecord,
): string => {
  const bhkLabel = getBhkLabel(property);
  if (bhkLabel) return `${bhkLabel} Flats`;

  const propertyType = cleanPropertyText(property.propertyType).toLowerCase();
  if (propertyType.includes("villa")) return "Luxury Villas";
  if (propertyType.includes("plot")) return "Premium Residential Plots";
  if (propertyType.includes("commercial")) return "Premium Commercial Spaces";
  return "Premium Homes";
};

export const getPropertyMetaTitle = (
  property: PropertyMarketingRecord,
): string => {
  const location =
    cleanPropertyText(property.locality) ||
    cleanPropertyText(property.subLocality) ||
    cleanPropertyText(property.city) ||
    "Prime Location";

  return `${getPropertyMarketingName(property)} | ${getResidenceMarketingLabel(property)} for Sale in ${location}`;
};

export const getPropertyPageHeading = (
  property: PropertyMarketingRecord,
): string =>
  cleanPropertyText(property.propertyTitle) || getPropertyMarketingName(property);

export const getPropertyMarketingDescription = (
  property: PropertyMarketingRecord,
): string => {
  const location = [property.locality || property.subLocality, property.city]
    .map(cleanPropertyText)
    .filter(Boolean)
    .join(", ");

  return `Explore ${getResidenceMarketingLabel(property).toLowerCase()} at ${getPropertyMarketingName(property)}${
    location ? ` in ${location}` : " in a prime location"
  }. Discover thoughtfully planned residences, lifestyle features, pricing and site visit assistance.`;
};
