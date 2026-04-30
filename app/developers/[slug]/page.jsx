import { developersFaqs } from "@/data/faq";
import { formatBuilderName } from "@/lib/utils/formatBuilderName";
import AboutDeveloper from "@/src/Developers/AboutDeveloper";
import DeveloperHero from "@/src/Developers/DeveloperHero";
import DeveloperImpact from "@/src/Developers/DeveloperImpact";
import ProjectGrid from "@/src/Developers/ProjectGrid";
import FAQSection from "@/src/FAQSection";
import { notFound } from "next/navigation";
import { getCachedProperties } from "@/lib/data/properties";
import Developer from "@/lib/models/Developer";
import { convertTimestamps } from "@/lib/utils/timestampConverter";

export const revalidate = 300;

async function getDeveloperData(slug) {
  // Try to find registered developer by slug first
  let developer = null;
  try {
    developer = await Developer.getBySlug(slug);
    if (developer) developer = convertTimestamps(developer);
  } catch (err) {
    console.error("Error fetching developer:", err);
  }

  // Get properties for this developer
  const builderName = developer?.name || formatBuilderName(slug);

  let projects = [];
  try {
    const properties = await getCachedProperties({ activeStatus: "Yes" });
    projects = properties.filter((item) => {
      if (!item?.builderName) return false;
      const apiName = item.builderName.toLowerCase().trim();
      const pageName = builderName.toLowerCase().trim();
      return apiName === pageName || apiName.includes(pageName) || pageName.includes(apiName);
    });
  } catch (err) {
    console.error("Error fetching projects:", err);
  }

  return { developer, projects, builderName };
}

export default async function DeveloperPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  const { developer, projects, builderName } = await getDeveloperData(slug);

  if (!developer && !projects.length) return notFound();

  return (
    <div>
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
