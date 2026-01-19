import HeroSection from "@/src/About/HeroSection";
import IntroSection from "@/src/About/IntroSection";
import MissionVision from "@/src/About/MissionVision";
import OurExpertise from "@/src/About/OurExpertise";
import TeamSlider from "@/src/About/TeamSlider";
import React from "react";

const PageAbout = () => {
  return (
    <div className=" bg-[var(--background)]">
      <HeroSection />
      <IntroSection />
      <MissionVision />
      <OurExpertise />
      <TeamSlider />
    </div>
  );
};

export default PageAbout;
