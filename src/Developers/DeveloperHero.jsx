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
      <section className="relative h-auto overflow-hidden pt-12 md:pt-20 xl:pt-30 pb-0 md:pb-10 xl:pb-10">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={bannerImage}
            alt={builderName}
            className="h-full w-full object-cover scale-105"
          />

          {/* Luxury Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.18),transparent_35%)]" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-5 lg:px-10 min-h-[85vh] flex items-center">
          <div className="max-w-4xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-white/10 backdrop-blur-md px-4 py-2 text-sm text-[#D4AF37] mb-6">
              ✦ Premium Developer
            </div>

            {/* Logo */}
            {developer?.logo && (
              <div className="mb-8">
                <div className="inline-flex bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-2xl">
                  <img
                    src={developer.logo}
                    alt={builderName}
                    className="h-10 md:h-10 object-contain"
                  />
                </div>
              </div>
            )}

            {/* Heading */}
            <h1 className="text-white font-serif text-2xl md:text-3xl xl:text-5xl leading-tight font-bold">
              {tagline}
            </h1>

            <p className="mt-6 max-w-2xl text-gray-300 text-base md:text-lg leading-relaxed">
              Explore premium residences crafted by{" "}
              <span className="text-[#D4AF37] font-semibold">
                {builderName}
              </span>
              . Discover thoughtfully designed homes, world-class amenities and
              exceptional investment opportunities.
            </p>

            {/* Stats */}
            <div className="mt-4 flex flex-wrap gap-4">
              <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 px-6 py-4">
                <p className="text-3xl font-bold text-[#D4AF37]">
                  {projectCount}
                </p>
                <p className="text-sm text-gray-300">Active Projects</p>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-4 flex flex-wrap gap-4">
              <a
                href="#projects"
                className="bg-[#D4AF37] hover:bg-[#c29e2f] text-black font-semibold px-8 py-4 rounded-xl transition"
              >
                Explore Projects
              </a>

              <button
                onClick={() => setOpen(true)}
                className="border border-white/30 bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-xl hover:bg-white/20 transition cursor-pointer"
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
