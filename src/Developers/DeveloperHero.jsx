// "use client";

// import { useState } from "react";
// import LeadCaptureModal from "@/src/LeadCapture/LeadCaptureModal";

// export default function DeveloperHero({ builderName, projects, developer }) {
//   const [open, setOpen] = useState(false);

//   const bannerImage = developer?.banner || "/developers/kolt_wagoh.jpg";
//   const projectCount = projects?.length || 0;
//   const tagline = developer?.tagline || `${builderName} Projects`;

//   return (
//     <section className="relative h-[600px] md:h-[650px]">
//       <img
//         src={bannerImage}
//         className="w-full h-full object-cover"
//         alt={builderName}
//       />

//       <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center text-white text-center px-4">
//         {developer?.logo && (
//           <img
//             src={developer.logo}
//             alt={builderName}
//             className="h-20 w-auto object-contain mb-4 rounded bg-white/10 p-2"
//           />
//         )}

//         <h1 className="text-2xl md:text-5xl font-bold">{tagline}</h1>

//         <p className="mt-2 text-sm md:text-lg">
//           {projectCount > 0
//             ? `${projectCount} Project${projectCount !== 1 ? "s" : ""} Available`
//             : "Coming Soon — Projects will be listed here"}
//         </p>

//         <button
//           onClick={() => setOpen(true)}
//           className="mt-4 bg-ochre px-6 py-2 rounded text-lg cursor-pointer"
//         >
//           Get Details
//         </button>
//       </div>

//       <LeadCaptureModal
//         open={open}
//         onClose={() => setOpen(false)}
//         title={`Enquire about ${builderName}`}
//         subtitle={`Fill in your details and our team will get back to you with ${builderName} project details.`}
//         submitLabel="Get Details"
//       />
//     </section>
//   );
// }

"use client";

import { useState } from "react";
import LeadCaptureModal from "@/src/LeadCapture/LeadCaptureModal";

export default function DeveloperHero({ builderName, projects, developer }) {
  const [open, setOpen] = useState(false);

  const bannerImage = developer?.banner || "/developers/kolt_wagoh.jpg";

  const projectCount = projects?.length || 0;

  const tagline = developer?.tagline || `${builderName} Projects`;

  return (
    <>
      <section className="relative min-h-[600px] overflow-hidden pt-20 pb-8 sm:min-h-[630px] md:min-h-[680px] md:pt-28 md:pb-16">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={bannerImage}
            alt={builderName}
            className="h-full w-full object-cover scale-105"
          />

          {/* Luxury Overlay */}
          {/* <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" /> */}
          <div className="absolute inset-y-0 left-0 w-full md:w-[70%] bg-gradient-to-r from-black/90 via-black/65 to-transparent" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.18),transparent_35%)]" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto flex min-h-[492px] items-center px-4 sm:min-h-[520px] sm:px-6 md:min-h-[540px] lg:px-10">
          <div className="mx-auto max-w-4xl text-center md:mx-0 md:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-white/10 backdrop-blur-md px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm text-[#D4AF37] mb-4 md:mb-6">
              ✦ Premium Developer
            </div>

            {developer?.logo && (
              <div className="mb-4 md:mb-6">
                <div className="inline-flex h-16 w-32 sm:h-20 sm:w-40 md:h-24 md:w-56 items-center justify-center bg-white/95 backdrop-blur-md rounded-xl md:rounded-2xl p-2.5 md:p-4 shadow-2xl overflow-hidden">
                  <img
                    src={developer.logo}
                    alt={builderName}
                    className="block max-h-full max-w-full object-contain"
                  />
                </div>
              </div>
            )}

            {/* Heading */}
            <h1 className="break-words text-white font-serif text-3xl md:text-4xl xl:text-5xl leading-tight font-bold">
              {tagline}
            </h1>

            <p className="mx-auto mt-3 sm:mt-4 md:mt-5 max-w-2xl text-gray-200 text-sm sm:text-base md:mx-0 md:text-lg leading-relaxed">
              Explore premium residences crafted by{" "}
              <span className="text-[#D4AF37] font-semibold">
                {builderName}
              </span>
              . Discover thoughtfully designed homes, world-class amenities and
              exceptional investment opportunities.
            </p>

            {/* Stats */}
            <div className="mt-4 md:mt-5 flex flex-wrap justify-center gap-4 md:justify-start">
              <div className="rounded-xl md:rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 px-5 py-3 md:px-6 md:py-4">
                <p className="text-2xl md:text-3xl font-bold text-[#D4AF37]">
                  {projectCount}
                </p>
                <p className="text-sm text-gray-300">Active Projects</p>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-4 md:mt-5 flex flex-col justify-center gap-2.5 sm:flex-row md:justify-start">
              <a
                href="#projects"
                className="w-full bg-[#D4AF37] hover:bg-[#c29e2f] text-center text-black font-semibold px-6 py-3 rounded-xl transition sm:w-auto"
              >
                Explore Projects
              </a>

              <button
                onClick={() => setOpen(true)}
                className="w-full border border-white/30 bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-xl hover:bg-white/20 transition cursor-pointer sm:w-auto"
              >
                Get Details
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/70 to-transparent" />
      </section>

      <LeadCaptureModal
        open={open}
        onClose={() => setOpen(false)}
        title={`Enquire about ${builderName}`}
        subtitle={`Fill in your details and our team will get back to you with ${builderName} project details.`}
        submitLabel="Get Details"
      />
    </>
  );
}
