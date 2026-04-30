"use client";

import { useState } from "react";
import LeadCaptureModal from "@/src/LeadCapture/LeadCaptureModal";

export default function DeveloperHero({ builderName, projects, developer }) {
  const [open, setOpen] = useState(false);

  const bannerImage = developer?.banner || "/developers/kolt_wagoh.jpg";
  const projectCount = projects?.length || 0;
  const tagline = developer?.tagline || `${builderName} Projects`;

  return (
    <section className="relative h-[600px] md:h-[650px]">
      <img
        src={bannerImage}
        className="w-full h-full object-cover"
        alt={builderName}
      />

      <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center text-white text-center px-4">
        {developer?.logo && (
          <img
            src={developer.logo}
            alt={builderName}
            className="h-20 w-auto object-contain mb-4 rounded bg-white/10 p-2"
          />
        )}

        <h1 className="text-2xl md:text-5xl font-bold">{tagline}</h1>

        <p className="mt-2 text-sm md:text-lg">
          {projectCount > 0
            ? `${projectCount} Project${projectCount !== 1 ? "s" : ""} Available`
            : "Coming Soon — Projects will be listed here"}
        </p>

        <button
          onClick={() => setOpen(true)}
          className="mt-4 bg-ochre px-6 py-2 rounded text-lg cursor-pointer"
        >
          Get Details
        </button>
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
