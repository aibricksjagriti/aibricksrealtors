import type { Metadata } from "next";
import { cache } from "react";
import { notFound, redirect } from "next/navigation";

import propertyModel from "@/lib/models/Property";
import {
  cleanPropertyText,
  getPropertyMarketingDescription,
  getPropertyMetaTitle,
  getPropertyPageHeading,
  type PropertyMarketingRecord,
} from "@/lib/utils/propertyMarketing";
import { getPropertySlug } from "@/lib/utils/propertySlug";
import { buildMetadata } from "@/lib/utils/seo";
import { convertTimestamps } from "@/lib/utils/timestampConverter";
import PropertyDetailPageClient from "@/src/Properties/PropertyDetailPageClient";

export const revalidate = 300;

type RouteParams = Promise<{ id: string }>;

type MetadataInput = {
  title?: string;
  description?: string;
  keywords?: string | string[];
  canonicalUrl?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
};

type PropertyRecord = PropertyMarketingRecord & {
  id?: string;
  slug?: string;
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string | string[];
  canonicalUrl?: string;
  mainPropertyImage?: string;
  [key: string]: unknown;
};

const createMetadata = buildMetadata as unknown as (
  options: MetadataInput,
) => Metadata;

export async function generateStaticParams(): Promise<never[]> {
  return [];
}

const getPropertyByIdentifier = cache(
  async (identifier: string): Promise<PropertyRecord | null> => {
    const model = propertyModel as typeof propertyModel & {
      getByIdentifier?: (value: string) => Promise<PropertyRecord | null>;
      getById: (value: string) => Promise<PropertyRecord | null>;
    };

    return model.getByIdentifier
      ? model.getByIdentifier(identifier)
      : model.getById(identifier);
  },
);

const truncate = (value: unknown, max = 160): string | undefined => {
  const text = cleanPropertyText(value);
  if (!text) return undefined;
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
};

export async function generateMetadata({
  params,
}: {
  params: RouteParams;
}): Promise<Metadata> {
  const { id } = await params;

  let property: PropertyRecord | null = null;
  try {
    property = await getPropertyByIdentifier(id);
  } catch {
    // The page-level notFound boundary handles unavailable property records.
  }

  if (!property) {
    return createMetadata({
      title: "Premium Properties for Sale – AI Bricks Realtors",
      description:
        "Explore premium homes in prime locations with expert property guidance from AI Bricks Realtors.",
      path: `/properties/${id}`,
      noIndex: true,
    });
  }

  return createMetadata({
    title:
      cleanPropertyText(property.metaTitle) || getPropertyMetaTitle(property),
    description:
      cleanPropertyText(property.metaDescription) ||
      truncate(property.description) ||
      truncate(getPropertyMarketingDescription(property)),
    keywords: property.metaKeywords,
    canonicalUrl: property.canonicalUrl,
    path: `/properties/${getPropertySlug(property)}`,
    image: property.mainPropertyImage,
  });
}

export default async function PropertyDetailPage({
  params,
}: {
  params: RouteParams;
}) {
  const { id } = await params;
  const property = await getPropertyByIdentifier(id);

  if (!property) notFound();

  const canonicalSlug = getPropertySlug(property);
  if (id !== canonicalSlug) redirect(`/properties/${canonicalSlug}`);

  return (
    <PropertyDetailPageClient
      initialProperty={convertTimestamps(property)}
      pageHeading={getPropertyPageHeading(property)}
    />
  );
}
