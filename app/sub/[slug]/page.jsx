import { developersFaqs } from "@/data/faq";
import { formatBuilderName } from "@/lib/utils/formatBuilderName";
import AboutDeveloper from "@/src/Developers/AboutDeveloper";
import DeveloperHero from "@/src/Developers/DeveloperHero";
import DeveloperImpact from "@/src/Developers/DeveloperImpact";
import ProjectGrid from "@/src/Developers/ProjectGrid";
import FAQSection from "@/src/FAQSection";
import StickySectionNav from "@/src/Developers/StickySectionNav";
import Navbar from "@/src/Home/Navbar";
import { getCachedProperties } from "@/lib/data/properties";
import Developer from "@/lib/models/Developer";
import { convertTimestamps } from "@/lib/utils/timestampConverter";
import Locality from "@/lib/models/Locality";
import LocationPage from "@/lib/models/LocationPage";
import LocationDetailClient from "@/src/Locations/LocationDetailClient";
import { notFound } from "next/navigation";

export const revalidate = 300;

function formatCityName(slug) {
  return slug
    ?.split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export async function generateMetadata({ params }) {
  const { slug } = await params;

  // Try developer metadata first
  try {
    const developer = await Developer.getBySlug(slug);
    if (developer?.name) {
      return { title: developer.name, description: developer.tagline || undefined };
    }
  } catch {}

  // Fall back to city metadata
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

export default async function SubdomainPage({ params }) {
  const { slug } = await params;

  // ── Try developer first ──────────────────────────────────────────────────
  let developer = null;
  try {
    developer = await Developer.getBySlug(slug);
    if (developer) developer = convertTimestamps(developer);
  } catch {}

  const builderName = developer?.name || formatBuilderName(slug);
  const allProperties = await getCachedProperties({ activeStatus: "Yes" });

  const projects = allProperties.filter((item) => {
    if (!item?.builderName) return false;
    const a = item.builderName.toLowerCase().trim();
    const b = builderName.toLowerCase().trim();
    return a === b || a.includes(b) || b.includes(a);
  });

  if (developer || projects.length > 0) {
    return (
      <div>
        <StickySectionNav />
        <DeveloperHero builderName={builderName} projects={projects} developer={developer} />
        <section id="about">
          <AboutDeveloper builderName={builderName} developer={developer} />
        </section>
        <section id="projects">
          <ProjectGrid projects={projects} builderName={builderName} />
        </section>
        <section id="impact">
          <DeveloperImpact builderName={builderName} developer={developer} />
        </section>
        <section id="faq">
          <FAQSection faqs={developersFaqs} />
        </section>
      </div>
    );
  }

  // ── Fall back to city page ───────────────────────────────────────────────
  const city = formatCityName(slug);

  let cityProjects = [];
  let localities = [];
  let cityDescription = null;
  let locationPageData = null;

  try {
    const [registeredLocalities, locationPage] = await Promise.all([
      Locality.getAll({ city }).catch(() => []),
      LocationPage.getBySlug(slug).catch(() => null),
    ]);

    locationPageData = locationPage;
    cityProjects = allProperties.filter(
      (p) => p?.city?.toLowerCase().trim() === city.toLowerCase().trim()
    );

    const fromProps = [...new Set(cityProjects.map((p) => p.locality?.trim()).filter(Boolean))];
    const fromCollection = registeredLocalities.map((l) => l.name);
    localities = [...new Set([...fromProps, ...fromCollection])].sort();

    cityDescription =
      locationPage?.description ||
      registeredLocalities.find((l) => l.description)?.description ||
      null;
  } catch {}

  if (cityProjects.length === 0 && !locationPageData) return notFound();

  return (
    <>
      <Navbar />
      <LocationDetailClient
      city={locationPageData?.city || city}
      slug={slug}
      projects={cityProjects}
      localities={localities}
      cityDescription={cityDescription}
      banner={locationPageData?.banner || null}
      about={locationPageData?.about || null}
    />
    </>
  );
}
