export const slugifyProperty = (value) =>
  String(value || "property")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "property";

export const getPropertySlug = (property) =>
  property?.slug ||
  slugifyProperty(
    property?.propertyTitle || property?.projectName || property?.title || property?.id,
  );

export const getPropertyPath = (property) =>
  `/properties/${getPropertySlug(property)}`;
