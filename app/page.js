import React from "react";
import DemandSection from "@/src/Home/DemandSection";
import HeroSection from "@/src/Home/HeroSection";
import LogoSlider from "@/src/Home/LogoSlider";
import PropertyTypeSlider from "@/src/Home/PropertyTypeSlider";
import UpcomingProjects from "@/src/Home/UpcomingProjects";
import Cta from "@/src/Home/Cta";
import EasyForYou from "@/src/Home/EasyForYou";
import StatsSection from "@/src/Home/StatsSection";
// import TrendingProjects from "@/src/Home/TrendingProjects";
import TrendingProjectsClient from "@/src/Home/TrendingProjectsClient";

export default function Home() {
  return (
    <main className=" bg-background">
      <HeroSection />
      <UpcomingProjects />
      {/* <TrendingProjects /> */}
      <TrendingProjectsClient />
      <PropertyTypeSlider />
      <LogoSlider />
      <DemandSection />
      <Cta />
      <EasyForYou />
      <StatsSection />
    </main>
  );
}
