import { buildMetadata } from "@/lib/utils/seo";
import { aboutFaqs } from "@/data/faq";

export const metadata = buildMetadata({
  title: "About Us | AI Bricks Realtors",
  description:
    "Learn about AI Bricks Realtors — India's first AI-driven real estate platform helping buyers, sellers, and investors make smarter property decisions.",
  path: "/about",
});
import HeroSection from "@/src/About/HeroSection";
import IntroSection from "@/src/About/IntroSection";
import MissionVision from "@/src/About/MissionVision";
import OurExpertise from "@/src/About/OurExpertise";
import FoundersSection from "@/src/About/FoundersSection";
import MilestonesSection from "@/src/About/MilestonesSection";
import FAQSection from "@/src/FAQSection";
import React from "react";

const PageAbout = () => {
  return (
    <div className="bg-[var(--background)]">
      <HeroSection />
      <IntroSection />
      <MissionVision />
      <OurExpertise />
      <FoundersSection />
      <MilestonesSection />
      <FAQSection title="Frequently Asked Questions" faqs={aboutFaqs} />
    </div>
  );
};

export default PageAbout;
