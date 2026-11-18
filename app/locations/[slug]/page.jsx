import { getCachedProperties } from "@/lib/data/properties";
import Locality from "@/lib/models/Locality";
import LocationPage from "@/lib/models/LocationPage";
import LocationDetailClient from "@/src/Locations/LocationDetailClient";
import { notFound } from "next/navigation";
import { buildMetadata, entityCanonical } from "@/lib/utils/seo";

export const revalidate = 300;

// Opt into on-demand ISR: paths are generated on first request, cached for
// `revalidate` seconds, and rendered blocking — so notFound() returns a real
// HTTP 404 instead of a streamed 200 soft-404.
export async function generateStaticParams() {
  return [];
}

function formatName(slug) {
  const value = Array.isArray(slug) ? slug[0] : slug;
  return value
    ?.split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

async function cityHasContent(city) {
  const name = city?.toLowerCase().trim();
  if (!name) return false;
  try {
    const [properties, localities] = await Promise.all([
      getCachedProperties({ activeStatus: "Yes" }),
      Locality.getAll({ city }).catch(() => []),
    ]);
    return (
      localities.length > 0 ||
      properties.some((item) => item?.city?.toLowerCase().trim() === name)
    );
  } catch {
    // Data source down: keep serving the page rather than 404ing real cities.
    return true;
  }
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  const cityFallback = formatName(slug);

  let page = null;
  try {
    page = await LocationPage.getBySlug(slug);
  } catch {}

  // Any /locations/<anything> used to render a 200 "No properties in X" page
  // that was indexable — a soft 404 for every mistyped or stale city. Return a
  // real 404 (before streaming starts) unless the city has a CMS page,
  // registered localities, or at least one active property.
  if (!page && !(await cityHasContent(cityFallback))) notFound();

  const cityName = page?.city || cityFallback;
  return buildMetadata({
    title: page?.metaTitle || `Properties in ${cityName} | AI Bricks Realtors`,
    description:
      page?.metaDescription ||
      page?.description ||
      `Discover residential and commercial properties in ${cityName} with AI Bricks Realtors.`,
    keywords: page?.metaKeywords,
    canonicalUrl: entityCanonical(page?.canonicalUrl, `/locations/${slug}`),
    path: `/locations/${slug}`,
    image: page?.banner,
  });
}

export default async function LocationPageRoute({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  const city = formatName(slug);

  let projects = [];
  let localities = [];
  let cityInfo = null;
  let locationPageData = null;

  try {
    const [properties, registeredLocalities, locationPage] = await Promise.all([
      getCachedProperties({ activeStatus: "Yes" }),
      Locality.getAll({ city }).catch(() => []),
      LocationPage.getBySlug(slug).catch(() => null),
    ]);

    locationPageData = locationPage;

    projects = properties.filter(
      (item) => item?.city?.toLowerCase().trim() === city?.toLowerCase().trim()
    );

    const fromProps = [...new Set(projects.map((p) => p.locality?.trim()).filter(Boolean))];
    const fromCollection = registeredLocalities.map((l) => l.name);
    localities = [...new Set([...fromProps, ...fromCollection])].sort();

    // Prefer LocationPage description, then fall back to Locality description
    cityInfo =
      locationPage?.description ||
      registeredLocalities.find((l) => l.description)?.description ||
      null;
  } catch (err) {
    console.error(err);
  }

  return (
    <LocationDetailClient
      city={locationPageData?.city || city}
      slug={slug}
      projects={projects}
      localities={localities}
      cityDescription={cityInfo}
      banner={locationPageData?.banner || null}
      about={locationPageData?.about || null}
    />
  );
}
