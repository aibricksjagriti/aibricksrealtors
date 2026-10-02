import PropertyDetailPageClient from "@/src/Properties/PropertyDetailPageClient";
import propertyModel from "@/lib/models/Property";
import { buildMetadata } from "@/lib/utils/seo";
import { getPropertySlug } from "@/lib/utils/propertySlug";
import { cache } from "react";

export const revalidate = 300;

// Opt into on-demand ISR: paths are generated on first request, cached for
// `revalidate` seconds, and rendered blocking — so notFound() returns a real
// HTTP 404 instead of a streamed 200 soft-404.
export async function generateStaticParams() {
  return [];
}

const getPropertyByIdentifier = cache(async (identifier) => (
  propertyModel.getByIdentifier
    ? propertyModel.getByIdentifier(identifier)
    : propertyModel.getById(identifier)
));

const truncate = (text, max = 160) => {
  if (!text) return undefined;
  const clean = String(text).replace(/\s+/g, " ").trim();
  return clean.length > max ? `${clean.slice(0, max - 1).trimEnd()}…` : clean;
};

export async function generateMetadata({ params }) {
  const { id } = await params;

  let property = null;
  try {
    property = await getPropertyByIdentifier(id);
  } catch {}

  if (!property) {
    return buildMetadata({
      title: "Property | AI Bricks Realtors",
      path: `/properties/${id}`,
    });
  }

  const locationText = [property.locality, property.city].filter(Boolean).join(", ");
  return buildMetadata({
    title:
      property.metaTitle ||
      `${property.propertyTitle || "Property"}${locationText ? ` in ${locationText}` : ""} | AI Bricks Realtors`,
    description:
      property.metaDescription ||
      truncate(property.description) ||
      `View details, price, floor plans and photos of ${property.propertyTitle || "this property"}${locationText ? ` in ${locationText}` : ""}.`,
    keywords: property.metaKeywords,
    canonicalUrl: property.canonicalUrl,
    path: `/properties/${getPropertySlug(property)}`,
    image: property.mainPropertyImage,
  });
}

export default async function PropertyDetailPage({ params }) {
  return <PropertyDetailPageClient />;
}
