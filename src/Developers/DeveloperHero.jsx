"use client";

import { useState } from "react";
import LeadCaptureModal from "@/src/LeadCapture/LeadCaptureModal";

export default function DeveloperHero({ builderName, projects, developer }) {
  const [open, setOpen] = useState(false);

  const bannerImage = developer?.banner || "/developers/kolt_wagoh.jpg";
  const projectCount = projects?.length || 0;
  const tagline = developer?.tagline || `${builderName} Projects`;

  return (
    <section className="relative h-[480px] md:h-[600px] overflow-hidden">
      {/* Banner image */}
      <img
        src={bannerImage}
        className="absolute inset-0 w-full h-full object-cover"
        alt={`${builderName} banner`}
      />

      {/* Layered overlays for legibility + brand tint */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/25" />
      <div className="absolute inset-0 bg-brickred/20 mix-blend-multiply" />

      {/* Content */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-5 sm:px-8 flex flex-col justify-end pb-12 md:pb-16">
        <div className="flex flex-col items-center text-center md:items-start md:text-left gap-5 md:gap-6 max-w-3xl">
          {/* Developer logo chip */}
          {developer?.logo && (
            <div className="bg-white rounded-xl shadow-lg shadow-black/30 px-4 py-3 inline-flex items-center justify-center">
              <img
                src={developer.logo}
                alt={`${builderName} logo`}
                className="h-12 md:h-16 w-auto max-w-[200px] object-contain"
              />
            </div>
          )}

          <div>
            <p className="text-ochre uppercase tracking-[0.3em] text-xs md:text-sm font-semibold mb-2">
              Premium Developer
            </p>
            <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-md">
              {tagline}
            </h1>
            <div className="h-1 w-20 bg-ochre rounded-full mt-4 mx-auto md:mx-0" />
          </div>

          <p className="text-white/90 text-sm md:text-lg font-light">
            {projectCount > 0
              ? `${projectCount} Project${projectCount !== 1 ? "s" : ""} Available`
              : "Coming Soon — Projects will be listed here"}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <button
              onClick={() => setOpen(true)}
              className="w-full sm:w-auto bg-ochre hover:bg-ochre/90 text-darkgray font-semibold px-8 py-3 rounded-lg shadow-lg shadow-black/30 transition-transform hover:-translate-y-0.5 cursor-pointer"
            >
              Get Details
            </button>
            {projectCount > 0 && (
              <a
                href="#projects"
                className="w-full sm:w-auto text-center border border-white/60 hover:border-ochre hover:text-ochre text-white font-semibold px-8 py-3 rounded-lg backdrop-blur-sm bg-white/10 transition-colors"
              >
                View Projects
              </a>
            )}
          </div>
        </div>
      </div>

      <LeadCaptureModal
        open={open}
        onClose={() => setOpen(false)}
        title={`Enquire about ${builderName}`}
        subtitle={`Fill in your details and our team will get back to you with ${builderName} project details.`}
        submitLabel="Get Details"
      />
    </section>
  );
}
