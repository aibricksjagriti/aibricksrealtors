// "use client";

// import Image from "next/image";
// import { useState } from "react";

// export default function InDemandSection() {
//   // Hover states for each row
//   const [hoveredRow1, setHoveredRow1] = useState(0); // First card expanded by default
//   const [hoveredRow2, setHoveredRow2] = useState(3); // Fourth card expanded by default

//   const locations = [
//     { name: "Palm Jebel Ali", image: "/home/indemand/1.jpg" },
//     { name: "Dubai South", image: "/home/indemand/2.jpg" },
//     { name: "City Walk", image: "/home/indemand/3.jpg" },
//     { name: "Dubai Creek Harbour", image: "/home/indemand/4.jpg" },
//     { name: "Palm Jumeirah", image: "/home/indemand/5.jpg" },
//     { name: "Downtown Dubai", image: "/home/indemand/6.jpg" },
//     { name: "Business Bay", image: "/home/indemand/7.jpg" },
//     { name: "Bluewaters Island", image: "/home/indemand/8.jpg" },
//   ];

//   const firstRow = locations.slice(0, 4);
//   const secondRow = locations.slice(4, 8);

//   return (
//     <div className="py-10 md:py-16">
//       <div className="max-w-[1380px] mx-auto px-4 space-y-10">
//         {/* Title */}
//         <h2 className="text-center text-3xl sm:text-4xl font-bold text-[var(--color-darkgray)] mb-12 tracking-wide pb-10">
//           IN HIGH DEMAND
//         </h2>
//         {/* ===== First Row (4 cards) ===== */}
//         <ul className="flex flex-wrap justify-center items-center gap-3 md:gap-5">
//           {firstRow.map((location, index) => (
//             <li
//               key={index}
//               className={`relative rounded-xl overflow-hidden transition-all duration-500 cursor-pointer ${
//                 hoveredRow1 === index
//                   ? "md:w-[30%] w-[80%]"
//                   : "md:w-[15%] w-[45%]"
//               } h-[45vh] md:h-[50vh] min-w-[120px]`}
//               onMouseEnter={() => setHoveredRow1(index)}
//               onMouseLeave={() => setHoveredRow1(0)} // reset to first expanded
//             >
//               <Image
//                 src={location.image}
//                 alt={location.name}
//                 width={600}
//                 height={600}
//                 className="w-full h-full object-cover rounded-xl"
//               />
//               <div className="absolute bottom-3 left-3 bg-black/50 text-[var(--color-lightcream)] md:text-base px-3 py-1 rounded-xl text-xl">
//                 {location.name}
//               </div>
//             </li>
//           ))}
//         </ul>

//         {/* ===== Second Row (4 cards) ===== */}
//         <ul className="flex flex-wrap justify-center items-center gap-3 md:gap-5">
//           {secondRow.map((location, index) => (
//             <li
//               key={index}
//               className={`relative rounded-xl overflow-hidden transition-all duration-500 cursor-pointer ${
//                 hoveredRow2 === index
//                   ? "md:w-[30%] w-[80%]"
//                   : "md:w-[15%] w-[45%]"
//               } h-[45vh] md:h-[50vh] min-w-[120px]`}
//               onMouseEnter={() => setHoveredRow2(index)}
//               onMouseLeave={() => setHoveredRow2(3)} // reset to fourth expanded
//             >
//               <Image
//                 src={location.image}
//                 alt={location.name}
//                 width={600}
//                 height={600}
//                 className="w-full h-full object-cover rounded-xl"
//               />
//               <div className="absolute bottom-3 left-3 bg-black/50 text-[var(--color-lightcream)] md:text-base px-3 py-1 rounded-xl text-xl">
//                 {location.name}
//               </div>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }

"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

export default function InDemandSection() {
  const [hoveredRow1, setHoveredRow1] = useState(0);
  const [hoveredRow2, setHoveredRow2] = useState(3);
  const [isMobile, setIsMobile] = useState(false);

  const locations = [
    { name: "Palm Jebel Ali", image: "/home/indemand/1.jpg" },
    { name: "Dubai South", image: "/home/indemand/2.jpg" },
    { name: "City Walk", image: "/home/indemand/3.jpg" },
    { name: "Dubai Creek Harbour", image: "/home/indemand/4.jpg" },
    { name: "Palm Jumeirah", image: "/home/indemand/5.jpg" },
    { name: "Downtown Dubai", image: "/home/indemand/6.jpg" },
    { name: "Business Bay", image: "/home/indemand/7.jpg" },
    { name: "Bluewaters Island", image: "/home/indemand/8.jpg" },
  ];

  const firstRow = locations.slice(0, 4);
  const secondRow = locations.slice(4, 8);

  // Detect mobile screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="py-10 md:py-16">
      <div className="max-w-[1380px] mx-auto px-4 space-y-10">
        {/* ===== Title ===== */}
        <h2 className="text-center text-3xl sm:text-4xl font-bold text-[var(--color-darkgray)] mb-12 tracking-wide pb-6">
          IN HIGH DEMAND
        </h2>

        {/* ===== First Row ===== */}
        <ul className="flex flex-wrap justify-center items-center gap-4 md:gap-6">
          {firstRow.map((location, index) => (
            <li
              key={index}
              className={`relative rounded-xl overflow-hidden transition-all duration-500 cursor-pointer ${
                isMobile
                  ? "w-[46%] h-[35vh]" // 2 per row on mobile
                  : hoveredRow1 === index
                  ? "md:w-[30%] w-[80%]"
                  : "md:w-[15%] w-[45%]"
              } md:h-[50vh] min-w-[140px]`}
              onMouseEnter={() => !isMobile && setHoveredRow1(index)}
              onMouseLeave={() => !isMobile && setHoveredRow1(0)}
            >
              <Image
                src={location.image}
                alt={location.name}
                width={600}
                height={600}
                className="w-full h-full object-cover rounded-xl"
              />
              <div className="absolute bottom-3 left-3 bg-black/50 text-white text-sm sm:text-base md:text-lg px-3 py-1 rounded-xl">
                {location.name}
              </div>
            </li>
          ))}
        </ul>

        {/* ===== Second Row ===== */}
        <ul className="flex flex-wrap justify-center items-center gap-4 md:gap-6">
          {secondRow.map((location, index) => (
            <li
              key={index}
              className={`relative rounded-xl overflow-hidden transition-all duration-500 cursor-pointer ${
                isMobile
                  ? "w-[46%] h-[35vh]" // 2 per row on mobile
                  : hoveredRow2 === index
                  ? "md:w-[30%] w-[80%]"
                  : "md:w-[15%] w-[45%]"
              } md:h-[50vh] min-w-[140px]`}
              onMouseEnter={() => !isMobile && setHoveredRow2(index)}
              onMouseLeave={() => !isMobile && setHoveredRow2(3)}
            >
              <Image
                src={location.image}
                alt={location.name}
                width={600}
                height={600}
                className="w-full h-full object-cover rounded-xl"
              />
              <div className="absolute bottom-3 left-3 bg-black/50 text-white text-sm sm:text-base md:text-lg px-3 py-1 rounded-xl">
                {location.name}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// "use client";

// import Image from "next/image";
// import { useState } from "react";
// import { ChevronLeft, ChevronRight } from "lucide-react";

// export default function HeaderBanner() {
//   const [hovered, setHovered] = useState(null);
//   const [startIndex, setStartIndex] = useState(0); // Track visible cards

//   const locations = [
//     { name: "Palm Jebel Ali", image: "/home/indemand/1.jpg" },
//     { name: "Dubai South", image: "/home/indemand/2.jpg" },
//     { name: "City Walk", image: "/home/indemand/3.jpg" },
//     { name: "Dubai Creek Harbour", image: "/home/indemand/4.jpg" },
//     { name: "Palm Jumeirah", image: "/home/indemand/5.jpg" },
//     { name: "Downtown Dubai", image: "/home/indemand/6.jpg" },
//     { name: "Business Bay", image: "/home/indemand/7.jpg" },
//     { name: "Bluewaters Island", image: "/home/indemand/8.jpg" },
//   ];

//   // Scroll one card left/right
//   const nextSlide = () => {
//     if (startIndex < locations.length - 4) {
//       setStartIndex(startIndex + 1);
//     }
//   };

//   const prevSlide = () => {
//     if (startIndex > 0) {
//       setStartIndex(startIndex - 1);
//     }
//   };

//   // Visible cards
//   const visibleCards = locations.slice(startIndex, startIndex + 4);

//   return (
//     <div className="py-10 md:py-16 relative">
//       <div className="max-w-[1380px] mx-auto px-4">
//         {/* ===== Title ===== */}
//         <h2 className="text-center text-3xl sm:text-4xl font-bold text-[var(--color-darkgray)] mb-12 tracking-wide pb-10">
//           IN HIGH DEMAND
//         </h2>

//         {/* ===== Slider Container ===== */}
//         <div className="relative flex items-center justify-center">
//           {/* ===== Prev Button ===== */}
//           <button
//             onClick={prevSlide}
//             className={`absolute left-0 z-10 bg-black/30 hover:bg-black/60 text-white p-3 rounded-full transition ${
//               startIndex === 0 ? "opacity-40 cursor-not-allowed" : ""
//             }`}
//           >
//             <ChevronLeft size={28} />
//           </button>

//           {/* ===== Cards Wrapper ===== */}
//           <div className="overflow-hidden w-full">
//             <ul className="flex transition-transform duration-500 ease-in-out gap-5 justify-center">
//               {visibleCards.map((location, index) => (
//                 <li
//                   key={index}
//                   className={`relative rounded-xl overflow-hidden transition-all duration-500 cursor-pointer ${
//                     hovered === index
//                       ? "md:w-[30%] w-[80%]"
//                       : "md:w-[18%] w-[45%]"
//                   } h-[45vh] md:h-[50vh] min-w-[180px]`}
//                   onMouseEnter={() => setHovered(index)}
//                   onMouseLeave={() => setHovered(null)}
//                 >
//                   <Image
//                     src={location.image}
//                     alt={location.name}
//                     width={600}
//                     height={600}
//                     className="w-full h-full object-cover rounded-xl transition-transform duration-500 hover:scale-105"
//                   />
//                   <div className="absolute bottom-3 left-3 bg-black/50 text-white text-base md:text-lg px-3 py-1 rounded-xl">
//                     {location.name}
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* ===== Next Button ===== */}
//           <button
//             onClick={nextSlide}
//             className={`absolute right-0 z-10 bg-black/30 hover:bg-black/60 text-white p-3 rounded-full transition ${
//               startIndex >= locations.length - 4
//                 ? "opacity-40 cursor-not-allowed"
//                 : ""
//             }`}
//           >
//             <ChevronRight size={28} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// "use client";

// import Image from "next/image";
// import { useState } from "react";
// import { ChevronLeft, ChevronRight } from "lucide-react";

// export default function HeaderBanner() {
//   const [hovered, setHovered] = useState(0); // Default expanded card index (first card)
//   const [startIndex, setStartIndex] = useState(0); // Track visible cards

//   const locations = [
//     { name: "Palm Jebel Ali", image: "/home/indemand/1.jpg" },
//     { name: "Dubai South", image: "/home/indemand/2.jpg" },
//     { name: "City Walk", image: "/home/indemand/3.jpg" },
//     { name: "Dubai Creek Harbour", image: "/home/indemand/4.jpg" },
//     { name: "Palm Jumeirah", image: "/home/indemand/5.jpg" },
//     { name: "Downtown Dubai", image: "/home/indemand/6.jpg" },
//     { name: "Business Bay", image: "/home/indemand/7.jpg" },
//     { name: "Bluewaters Island", image: "/home/indemand/8.jpg" },
//   ];

//   // Scroll one card left/right
//   const nextSlide = () => {
//     if (startIndex < locations.length - 4) {
//       setStartIndex(startIndex + 1);
//       setHovered(0); // Reset expanded card to first visible on slide change
//     }
//   };

//   const prevSlide = () => {
//     if (startIndex > 0) {
//       setStartIndex(startIndex - 1);
//       setHovered(0); // Reset expanded card to first visible on slide change
//     }
//   };

//   // Visible cards (4 per slide)
//   const visibleCards = locations.slice(startIndex, startIndex + 4);

//   return (
//     <div className="py-10 md:py-16 relative">
//       <div className="max-w-[1380px] mx-auto px-4">
//         {/* ===== Title ===== */}
//         <h2 className="text-center text-3xl sm:text-4xl font-bold text-[var(--color-darkgray)] mb-12 tracking-wide pb-10">
//           IN HIGH DEMAND
//         </h2>

//         {/* ===== Slider Container ===== */}
//         <div className="relative flex items-center justify-center">
//           {/* ===== Prev Button ===== */}
//           <button
//             onClick={prevSlide}
//             className={`absolute left-0 z-10 bg-black/30 hover:bg-black/60 text-white p-3 rounded-full transition ${
//               startIndex === 0 ? "opacity-40 cursor-not-allowed" : ""
//             }`}
//           >
//             <ChevronLeft size={28} />
//           </button>

//           {/* ===== Cards Wrapper ===== */}
//           <div className="overflow-hidden w-full">
//             <ul className="flex transition-transform duration-500 ease-in-out gap-5 justify-center">
//               {visibleCards.map((location, index) => (
//                 <li
//                   key={index}
//                   className={`relative rounded-xl overflow-hidden transition-all duration-500 cursor-pointer ${
//                     hovered === index
//                       ? "md:w-[30%] w-[80%]"
//                       : "md:w-[18%] w-[45%]"
//                   } h-[45vh] md:h-[50vh] min-w-[180px]`}
//                   onMouseEnter={() => setHovered(index)}
//                   onMouseLeave={() => setHovered(0)} // default expanded first card
//                 >
//                   <Image
//                     src={location.image}
//                     alt={location.name}
//                     width={600}
//                     height={600}
//                     className="w-full h-full object-cover rounded-xl transition-transform duration-500 hover:scale-105"
//                   />
//                   <div className="absolute bottom-3 left-3 bg-black/50 text-white text-base md:text-lg px-3 py-1 rounded-xl">
//                     {location.name}
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* ===== Next Button ===== */}
//           <button
//             onClick={nextSlide}
//             className={`absolute right-0 z-10 bg-black/30 hover:bg-black/60 text-white p-3 rounded-full transition ${
//               startIndex >= locations.length - 4
//                 ? "opacity-40 cursor-not-allowed"
//                 : ""
//             }`}
//           >
//             <ChevronRight size={28} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
