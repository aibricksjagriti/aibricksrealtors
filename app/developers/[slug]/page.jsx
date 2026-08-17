// import { developersFaqs } from "@/data/faq";
// import { formatBuilderName, createSlug } from "@/lib/utils/formatBuilderName";
// import AboutDeveloper from "@/src/Developers/AboutDeveloper";
// import DeveloperHero from "@/src/Developers/DeveloperHero";
// import DeveloperImpact from "@/src/Developers/DeveloperImpact";
// import ProjectGrid from "@/src/Developers/ProjectGrid";
// import FAQSection from "@/src/FAQSection";
// import { notFound } from "next/navigation";
// import { getCachedProperties } from "@/lib/data/properties";
// import Developer from "@/lib/models/Developer";
// import { convertTimestamps } from "@/lib/utils/timestampConverter";
// import { buildMetadata } from "@/lib/utils/seo";

// export const revalidate = 300;

// // Opt into on-demand ISR: paths are generated on first request, cached for
// // `revalidate` seconds, and rendered blocking — so notFound() returns a real
// // HTTP 404 instead of a streamed 200 soft-404.
// export async function generateStaticParams() {
//   return [];
// }

// function matchProjects(properties, builderName) {
//   const pageName = builderName.toLowerCase().trim();
//   return properties.filter((item) => {
//     if (!item?.builderName) return false;
//     const apiName = item.builderName.toLowerCase().trim();
//     return apiName === pageName || apiName.includes(pageName) || pageName.includes(apiName);
//   });
// }

// export async function generateMetadata({ params }) {
//   const { slug } = await params;

//   let developer = null;
//   try {
//     developer = await Developer.getBySlug(slug);
//   } catch {}

//   const name = developer?.name || formatBuilderName(slug);
//   // Canonical path defaults to this page's own URL
//   let path = `/developers/${slug}`;

//   if (!developer) {
//     // No registered developer for this slug — only allow the page if
//     // properties match the builder name; otherwise return a real 404.
//     // (notFound() here, before streaming starts, sets the HTTP status to 404 —
//     // throwing it only in the page body results in a 200 "soft 404".)
//     let projects = [];
//     try {
//       const properties = await getCachedProperties({ activeStatus: "Yes" });
//       projects = matchProjects(properties, name);
//     } catch {}

//     if (!projects.length) notFound();

//     // Fuzzy-matched alias slug (e.g. /developers/godrej-new matching "Godrej"):
//     // canonicalize to the builder's proper slug so search engines index one URL.
//     const properSlug = createSlug(projects[0].builderName.trim());
//     if (properSlug && properSlug !== slug) path = `/developers/${properSlug}`;
//   }

//   return buildMetadata({
//     title: developer?.metaTitle || `${name} Projects | AI Bricks Realtors`,
//     description:
//       developer?.metaDescription ||
//       developer?.description ||
//       developer?.tagline ||
//       `Explore ${name} residential and commercial projects, prices, floor plans and offers on AI Bricks Realtors.`,
//     keywords: developer?.metaKeywords,
//     canonicalUrl: developer?.canonicalUrl,
//     path,
//     image: developer?.banner || developer?.logo,
//   });
// }

// async function getDeveloperData(slug) {
//   // Try to find registered developer by slug first
//   let developer = null;
//   try {
//     developer = await Developer.getBySlug(slug);
//     if (developer) developer = convertTimestamps(developer);
//   } catch (err) {
//     console.error("Error fetching developer:", err);
//   }

//   // Get properties for this developer
//   const builderName = developer?.name || formatBuilderName(slug);

//   let projects = [];
//   try {
//     const properties = await getCachedProperties({ activeStatus: "Yes" });
//     projects = matchProjects(properties, builderName);
//   } catch (err) {
//     console.error("Error fetching projects:", err);
//   }

//   return { developer, projects, builderName };
// }

// export default async function DeveloperPage({ params }) {
//   const resolvedParams = await params;
//   const slug = resolvedParams?.slug;

//   const { developer, projects, builderName } = await getDeveloperData(slug);

//   if (!developer && !projects.length) return notFound();

//   return (
//     <div>
//       <DeveloperHero builderName={builderName} projects={projects} developer={developer} />

//       <section id="about">
//         <AboutDeveloper builderName={builderName} developer={developer} />
//       </section>

//       <section id="projects">
//         <ProjectGrid projects={projects} builderName={builderName} />
//       </section>

//       <section id="impact">
//         <DeveloperImpact builderName={builderName} developer={developer} />
//       </section>

//       <section id="faq">
//         <FAQSection faqs={developersFaqs} />
//       </section>
//     </div>
//   );
// }

import { developersFaqs } from "@/data/faq";
import { formatBuilderName, createSlug } from "@/lib/utils/formatBuilderName";
import AboutDeveloper from "@/src/Developers/AboutDeveloper";
import DeveloperHero from "@/src/Developers/DeveloperHero";
import DeveloperImpact from "@/src/Developers/DeveloperImpact";
import ProjectGrid from "@/src/Developers/ProjectGrid";
import FAQSection from "@/src/FAQSection";
import { notFound } from "next/navigation";
import { getCachedProperties } from "@/lib/data/properties";
import Developer from "@/lib/models/Developer";
import { convertTimestamps } from "@/lib/utils/timestampConverter";
import { buildMetadata } from "@/lib/utils/seo";
import { buildDeveloperSchema } from "@/lib/utils/buildDeveloperSchema";

export const revalidate = 300;

// Opt into on-demand ISR: paths are generated on first request, cached for
// `revalidate` seconds, and rendered blocking — so notFound() returns a real
// HTTP 404 instead of a streamed 200 soft-404.
export async function generateStaticParams() {
  return [];
}

function matchProjects(properties, builderName) {
  const pageName = builderName.toLowerCase().trim();
  return properties.filter((item) => {
    if (!item?.builderName) return false;
    const apiName = item.builderName.toLowerCase().trim();
    return (
      apiName === pageName ||
      apiName.includes(pageName) ||
      pageName.includes(apiName)
    );
  });
}

export async function generateMetadata({ params }) {
  const { slug } = await params;

  let developer = null;
  try {
    developer = await Developer.getBySlug(slug);
  } catch {}

  const name = developer?.name || formatBuilderName(slug);
  // Canonical path defaults to this page's own URL
  let path = `/developers/${slug}`;

  if (!developer) {
    // No registered developer for this slug — only allow the page if
    // properties match the builder name; otherwise return a real 404.
    // (notFound() here, before streaming starts, sets the HTTP status to 404 —
    // throwing it only in the page body results in a 200 "soft 404".)
    let projects = [];
    try {
      const properties = await getCachedProperties({ activeStatus: "Yes" });
      projects = matchProjects(properties, name);
    } catch {}

    if (!projects.length) notFound();

    // Fuzzy-matched alias slug (e.g. /developers/godrej-new matching "Godrej"):
    // canonicalize to the builder's proper slug so search engines index one URL.
    const properSlug = createSlug(projects[0].builderName.trim());
    if (properSlug && properSlug !== slug) path = `/developers/${properSlug}`;
  }

  return buildMetadata({
    title: developer?.metaTitle || `${name} Projects | AI Bricks Realtors`,
    description:
      developer?.metaDescription ||
      developer?.description ||
      developer?.tagline ||
      `Explore ${name} residential and commercial projects, prices, floor plans and offers on AI Bricks Realtors.`,
    keywords: developer?.metaKeywords,
    canonicalUrl: developer?.canonicalUrl,
    path,
    image: developer?.banner || developer?.logo,
  });
}

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
    projects = matchProjects(properties, builderName);
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

  // Admin-configured structured data (Schema.org JSON-LD) for this
  // developer — returns null if the admin hasn't set anything up yet for
  // this developer, in which case nothing is rendered.
  const developerSchema = buildDeveloperSchema(developer, {
    builderName,
    pageUrl: `https://www.aibricksrealtors.com/developers/${developer?.slug || slug}`,
  });

  return (
    <div>
      {developerSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(developerSchema) }}
        />
      )}

      <DeveloperHero
        builderName={builderName}
        projects={projects}
        developer={developer}
      />

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
