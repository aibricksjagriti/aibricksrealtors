import { getCachedProperties } from "@/lib/data/properties";
import Locality from "@/lib/models/Locality";
import LocationPage from "@/lib/models/LocationPage";
import LocationDetailClient from "@/src/Locations/LocationDetailClient";

export const revalidate = 300;

function formatName(slug) {
  const value = Array.isArray(slug) ? slug[0] : slug;
  return value
    ?.split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  try {
    const page = await LocationPage.getBySlug(slug);
    if (page?.metaTitle || page?.metaDescription) {
      return {
        title: page.metaTitle || undefined,
        description: page.metaDescription || undefined,
      };
    }
  } catch {}
  return {};
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
