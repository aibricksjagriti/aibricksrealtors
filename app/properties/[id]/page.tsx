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
import KohinoorAdLandingPage from "@/src/Properties/KohinoorAdLandingPage";

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

  const canonicalSlug = getPropertySlug(property);
  const isKohinoorAdPage = canonicalSlug === "kohinoor-avantara-wakad";

  return createMetadata({
    title:
      cleanPropertyText(property.metaTitle) || getPropertyMetaTitle(property),
    description:
      cleanPropertyText(property.metaDescription) ||
      (isKohinoorAdPage
        ? "Explore premium 2 and 3 BHK flats at Kohinoor Avantara in Wakad, Pune. View pricing, floor plans, amenities and book a guided site visit."
        : truncate(property.description) ||
          truncate(getPropertyMarketingDescription(property))),
    keywords: property.metaKeywords,
    canonicalUrl: property.canonicalUrl,
    path: `/properties/${canonicalSlug}`,
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

  if (canonicalSlug === "kohinoor-avantara-wakad") {
    const projectRera = cleanPropertyText(property.description).match(/\bPR\d{8,}\b/i)?.[0];
    const schema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          name: "Kohinoor Avantara | 2 & 3 BHK Flats for Sale in Wakad",
          url: "https://www.aibricksrealtors.com/properties/kohinoor-avantara-wakad",
          description:
            "Explore premium 2 and 3 BHK flats at Kohinoor Avantara in Wakad, Pune.",
          primaryImageOfPage: property.mainPropertyImage,
        },
        {
          "@type": "ApartmentComplex",
          name: property.projectName || property.propertyTitle,
          image: property.mainPropertyImage,
          identifier: projectRera || undefined,
          address: {
            "@type": "PostalAddress",
            addressLocality: property.subLocality || property.locality || "Wakad",
            addressRegion: property.state || "Maharashtra",
            addressCountry: "IN",
          },
        },
        {
          "@type": "FAQPage",
          mainEntity: [
            ["What configurations are available at Kohinoor Avantara?", "Kohinoor Avantara offers 2 and 3 BHK residences in Wakad, Pune."],
            ["What is the starting price of Kohinoor Avantara?", "Indicative all-inclusive pricing starts from ₹85.90 lakh. Request the latest authorised price sheet."],
            ["When is possession expected?", "The current RERA possession timeline is March 2032. Buyers should verify the latest schedule from authorised documents."],
            ["Can I schedule a site visit?", "Yes. Submit the site-visit form and a property advisor will coordinate a guided visit."],
          ].map(([name, text]) => ({
            "@type": "Question",
            name,
            acceptedAnswer: { "@type": "Answer", text },
          })),
        },
      ],
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
          }}
        />
        <KohinoorAdLandingPage property={convertTimestamps(property)} />
      </>
    );
  }

  return (
    <PropertyDetailPageClient
      initialProperty={convertTimestamps(property)}
      pageHeading={getPropertyPageHeading(property)}
    />
  );
}
