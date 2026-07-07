// import React from "react";
// import DemandSection from "@/src/Home/DemandSection";
// import HeroSection from "@/src/Home/HeroSection";
// import LogoSlider from "@/src/Home/LogoSlider";
// import PropertyTypeSlider from "@/src/Home/PropertyTypeSlider";
// import UpcomingProjects from "@/src/Home/UpcomingProjects";
// import Cta from "@/src/Home/Cta";
// import EasyForYou from "@/src/Home/EasyForYou";
// import StatsSection from "@/src/Home/StatsSection";
// import TrendingProjectsClient from "@/src/Home/TrendingProjectsClient";
// import FAQSection from "@/src/FAQSection";
// import { homeFaqs } from "@/data/faq";

// export const metadata = {
//   title: "AI Bricks Realtors | India’s First AI-Driven Real Estate Platform | ",
//   description:
//     "AI Bricks Realtors is India’s first AI-driven real estate platform, empowering buyers, sellers, and investors to make smarter property decisions with data-backed insights.",

//   alternates: {
//     canonical: "https://aibricksrealtors.com",
//   },

//   openGraph: {
//     title: "India’s First AI-Driven Real Estate Platform | AI Bricks Realtors",
//     description:
//       "Discover smarter ways to buy, sell, and invest in real estate with India’s first AI-driven property platform.",
//     url: "https://aibricksrealtors.com",
//     siteName: "AI Bricks Realtors",
//     images: [
//       {
//         url: "https://aibricksrealtors.com/og-image.png",
//         width: 1200,
//         height: 630,
//         alt: "AI Bricks Realtors – India’s First AI-Driven Real Estate Platform",
//       },
//     ],
//     type: "website",
//   },

//   robots: {
//     index: true,
//     follow: true,
//   },
// };

// export default function Home() {
//   return (
//     <main className=" bg-background">
//       <HeroSection />
//       <UpcomingProjects />
//       <TrendingProjectsClient />
//       <PropertyTypeSlider />
//       <LogoSlider />
//       <DemandSection />
//       <Cta />
//       <EasyForYou />
//       <FAQSection title="Frequently Asked Questions" faqs={homeFaqs} />
//       <StatsSection />
//     </main>
//   );
// }

import React from "react";
import DemandSection from "@/src/Home/DemandSection";
import HeroSection from "@/src/Home/HeroSection";
import LogoSlider from "@/src/Home/LogoSlider";
import PropertyTypeSlider from "@/src/Home/PropertyTypeSlider";
import UpcomingProjects from "@/src/Home/UpcomingProjects";
import Cta from "@/src/Home/Cta";
import EasyForYou from "@/src/Home/EasyForYou";
import StatsSection from "@/src/Home/StatsSection";
import TrendingProjectsClient from "@/src/Home/TrendingProjectsClient";
import FAQSection from "@/src/FAQSection";
import { homeFaqs } from "@/data/faq";

export const metadata = {
  title: "AI Bricks Realtors | India’s First AI-Driven Real Estate Platform",
  description:
    "AI Bricks Realtors is India’s first AI-driven real estate platform, empowering buyers, sellers, and investors to make smarter property decisions with data-backed insights.",

  alternates: {
    canonical: "https://aibricksrealtors.com",
  },

  openGraph: {
    title: "India’s First AI-Driven Real Estate Platform | AI Bricks Realtors",
    description:
      "Discover smarter ways to buy, sell, and invest in real estate with India’s first AI-driven property platform.",
    url: "https://aibricksrealtors.com",
    siteName: "AI Bricks Realtors",
    images: [
      {
        url: "https://aibricksrealtors.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "AI Bricks Realtors – India’s First AI-Driven Real Estate Platform",
      },
    ],
    type: "website",
  },

  robots: {
    index: true,
    follow: true,
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Corporation",
  name: "AIBicks",
  alternateName: "aibricks",
  url: "https://www.aibricksrealtors.com/",
  logo: "https://kommodo.ai/i/O6Ky4JxZwQrCH7KA2wXW",
  sameAs: [
    "https://www.instagram.com/aibricksrealtors/",
    "https://www.linkedin.com/company/aibricks-realtors/posts/?feedView=all",
    "https://www.aibricksrealtors.com/",
    "https://www.facebook.com/profile.php?id=61583805842475",
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is AI Bricks Realtors?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AI Bricks Realtors is India’s first AI-driven real estate platform designed to simplify property buying, selling, and investing through smart technology and expert guidance.",
      },
    },
    {
      "@type": "Question",
      name: "How does AI help me find the right property?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our AI analyzes your preferences such as budget, location, amenities, and investment goals to recommend properties that best match your needs.",
      },
    },
    {
      "@type": "Question",
      name: "Are the properties listed verified and trustworthy?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, every property undergoes a verification process to ensure legal clarity, authenticity, and accurate project details.",
      },
    },
    {
      "@type": "Question",
      name: "Can I get investment guidance through AI Bricks Realtors?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Our platform provides data-driven insights and expert assistance to help you choose properties with strong appreciation and rental potential.",
      },
    },
    {
      "@type": "Question",
      name: "Why should I choose AI Bricks Realtors over other property portals?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Unlike traditional portals, we combine AI-powered recommendations, verified listings, and expert support to provide a smarter and safer property search experience.",
      },
    },
  ],
};

export default function Home() {
  return (
    <>
      {/* Organization Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />

      <main className="bg-background">
        <HeroSection />
        <UpcomingProjects />
        <TrendingProjectsClient />
        <PropertyTypeSlider />
        <LogoSlider />
        <DemandSection />
        <Cta />
        <EasyForYou />
        <FAQSection title="Frequently Asked Questions" faqs={homeFaqs} />
        <StatsSection />
      </main>
    </>
  );
}
