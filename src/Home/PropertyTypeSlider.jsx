// "use client";
// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { ChevronLeft, ChevronRight, Building2 } from "lucide-react";

// const propertyTypes = [
//   {
//     title: "Apartments",
//     subtitle: "Modern City Living",
//     image: "/home/abu-dhabi.webp",
//   },
//   {
//     title: "Villas",
//     subtitle: "Luxury Private Homes",
//     image: "/home/ajman.webp",
//   },
//   {
//     title: "Penthouses",
//     subtitle: "Elite Sky-High Living",
//     image: "/home/dubai.webp",
//   },
//   {
//     title: "Commercials",
//     subtitle: "Prime Business Spaces",
//     image: "/home/sarjah.webp",
//   },
//   {
//     title: "Plots",
//     subtitle: "Build Your Dream Space",
//     image: "/home/rak.webp",
//   },
//   {
//     title: "Investments",
//     subtitle: "High-Return Opportunities",
//     image: "/home/ajman.webp",
//   },
// ];

// export default function PropertyTypeSlider() {
//   const [index, setIndex] = useState(0);

//   // Number of visible cards based on screen size
//   const visibleCards = 4; // You can adjust (3 or 4) — responsive behavior handled by CSS

//   const nextSlide = () => {
//     if (index < propertyTypes.length - visibleCards) {
//       setIndex(index + 1);
//     }
//   };

//   const prevSlide = () => {
//     if (index > 0) {
//       setIndex(index - 1);
//     }
//   };

//   return (
//     <section className="bg-[linear-gradient(135deg,_#f1df9e_0%,_#d5b258_100%)] text-white pt-16 pb-32 px-4 sm:px-6 md:px-10 relative overflow-hidden mt-16">
//       {/* Title */}
//       <div className="max-w-7xl mx-auto text-center mb-10">
//         <div className="pb-10">
//           <div className="flex justify-center mb-2">
//             <Building2 size={40} className="text-[var(--color-brickred)]" />
//           </div>
//           <h2 className="text-4xl font-serif font-bold text-[var(--color-darkgray)] uppercase">
//             One Size Doesn’t Fit All
//           </h2>
//         </div>
//       </div>

//       {/* Slider */}
//       <div className="relative flex items-center justify-center">
//         {/* Left Arrow */}
//         <button
//           onClick={prevSlide}
//           disabled={index === 0}
//           className={`absolute left-2 sm:left-6 z-10 bg-[var(--color-brickred)] rounded-full p-2 sm:p-3 transition-transform ${
//             index === 0 ? "opacity-40 cursor-not-allowed" : "hover:scale-110"
//           }`}
//         >
//           <ChevronLeft size={22} className="text-[var(--color-lightcream)]" />
//         </button>

//         {/* Motion Container */}
//         <div className="overflow-hidden w-full max-w-7xl">
//           <motion.div
//             className="flex gap-4"
//             animate={{ x: `-${index * (100 / visibleCards)}%` }}
//             transition={{ type: "spring", stiffness: 80, damping: 25 }}
//           >
//             {propertyTypes.map((type, i) => (
//               <motion.div
//                 key={i}
//                 className="relative min-w-[80%] sm:min-w-[45%] md:min-w-[30%] lg:min-w-[24%] rounded-3xl overflow-hidden group shadow-lg hover:shadow-2xl transition-all duration-500"
//               >
//                 <img
//                   src={type.image}
//                   alt={type.title}
//                   className="w-full h-[320px] sm:h-[360px] md:h-[400px] object-cover transition-transform duration-700 group-hover:scale-110"
//                 />
//                 {/* Top Shadow Overlay */}
//                 <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-brickred)]/80 via-[var(--color-brickred)]/40 to-transparent transition-all duration-500" />

//                 {/* Text (top-left corner) */}
//                 <div className="absolute top-4 left-5 sm:top-6 sm:left-6 text-left">
//                   <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-1 drop-shadow-md">
//                     {type.title}
//                   </h3>
//                   <p className="text-sm sm:text-base text-gray-200 drop-shadow-sm">
//                     {type.subtitle}
//                   </p>
//                 </div>
//               </motion.div>
//             ))}
//           </motion.div>
//         </div>

//         {/* Right Arrow */}
//         <button
//           onClick={nextSlide}
//           disabled={index >= propertyTypes.length - visibleCards}
//           className={`absolute right-2 sm:right-6 z-10 bg-[var(--color-brickred)] rounded-full p-2 sm:p-3 transition-transform ${
//             index >= propertyTypes.length - visibleCards
//               ? "opacity-40 cursor-not-allowed"
//               : "hover:scale-110"
//           }`}
//         >
//           <ChevronRight size={22} className="text-[var(--color-lightcream)]" />
//         </button>
//       </div>
//     </section>
//   );
// }

"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Building2 } from "lucide-react";
import { useRouter } from "next/navigation";

const propertyTypes = [
  {
    title: "Apartment",
    subtitle: "Modern City Living",
    image: "/home/abu-dhabi.webp",
  },
  {
    title: "Villa",
    subtitle: "Luxury Private Homes",
    image: "/home/ajman.webp",
  },
  {
    title: "Penthouse",
    subtitle: "Elite Sky-High Living",
    image: "/home/dubai.webp",
  },
  {
    title: "Commercial",
    subtitle: "Prime Business Spaces",
    image: "/home/sarjah.webp",
  },
  {
    title: "Plot",
    subtitle: "Build Your Dream Space",
    image: "/home/rak.webp",
  },
  {
    title: "Investment",
    subtitle: "High-Return Opportunities",
    image: "/home/ajman.webp",
  },
];

export default function PropertyTypeSlider() {
  const [index, setIndex] = useState(0);
  const router = useRouter();

  const visibleCards = 4;

  const nextSlide = () => {
    if (index < propertyTypes.length - visibleCards) {
      setIndex((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (index > 0) {
      setIndex((prev) => prev - 1);
    }
  };

  /** 🔹 Optimized click handler */
  const handleCardClick = useCallback(
    (title) => {
      router.push(`/search?propertyType=${encodeURIComponent(title)}`);
    },
    [router],
  );

  return (
    <section className="bg-[linear-gradient(135deg,_#f1df9e_0%,_#d5b258_100%)] pt-16 pb-32 px-4 sm:px-6 md:px-10 relative overflow-hidden mt-16">
      {/* Title */}
      <div className="max-w-7xl mx-auto text-center mb-10">
        <div className="pb-10">
          <div className="flex justify-center mb-2">
            <Building2 size={40} className="text-[var(--color-brickred)]" />
          </div>
          <h2 className="text-4xl font-serif font-bold text-[var(--color-darkgray)] uppercase">
            One Size Doesn’t Fit All
          </h2>
        </div>
      </div>

      {/* Slider */}
      <div className="relative flex items-center justify-center">
        {/* Left Arrow */}
        <button
          onClick={prevSlide}
          disabled={index === 0}
          className={`absolute left-2 sm:left-6 z-10 bg-[var(--color-brickred)] rounded-full p-2 sm:p-3 ${
            index === 0 ? "opacity-40" : "hover:scale-110"
          }`}
        >
          <ChevronLeft size={22} className="text-[var(--color-lightcream)]" />
        </button>

        {/* Cards */}
        <div className="overflow-hidden w-full max-w-7xl">
          <motion.div
            className="flex gap-4"
            animate={{ x: `-${index * (100 / visibleCards)}%` }}
            transition={{ type: "spring", stiffness: 80, damping: 25 }}
          >
            {propertyTypes.map((type) => (
              <motion.div
                key={type.title}
                onClick={() => handleCardClick(type.title)}
                role="button"
                tabIndex={0}
                className="relative cursor-pointer min-w-[80%] sm:min-w-[45%] md:min-w-[30%] lg:min-w-[24%] rounded-3xl overflow-hidden group shadow-lg hover:shadow-2xl transition-all duration-500"
              >
                <img
                  src={type.image}
                  alt={type.title}
                  className="w-full h-[320px] sm:h-[360px] md:h-[400px] object-cover group-hover:scale-110 transition-transform duration-700"
                />

                <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-brickred)]/80 via-[var(--color-brickred)]/40 to-transparent" />

                <div className="absolute top-4 left-5 sm:top-6 sm:left-6 text-left">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white">
                    {type.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-200">
                    {type.subtitle}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Right Arrow */}
        <button
          onClick={nextSlide}
          disabled={index >= propertyTypes.length - visibleCards}
          className={`absolute right-2 sm:right-6 z-10 bg-[var(--color-brickred)] rounded-full p-2 sm:p-3 ${
            index >= propertyTypes.length - visibleCards
              ? "opacity-40"
              : "hover:scale-110"
          }`}
        >
          <ChevronRight size={22} className="text-[var(--color-lightcream)]" />
        </button>
      </div>
    </section>
  );
}
