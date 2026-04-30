// "use client";
// import Image from "next/image";
// import { motion } from "framer-motion";

// const locations = [
//   // Dubai Area
//   {
//     name: "Palm Jebel Ali",
//     image: "/home/indemand/1.jpg",
//   },
//   {
//     name: "Dubai South",
//     image: "/home/indemand/2.jpg",
//   },
//   {
//     name: "City Walk",
//     image: "/home/indemand/3.jpg",
//   },
//   {
//     name: "Dubai Creek Harbour",
//     image: "/home/indemand/4.jpg",
//   },
//   // Pune Areas
//   { name: "Koregaon Park", image: "/home/indemand/koregaon-park.jpg" },
//   { name: "Hinjewadi", image: "/home/indemand/hinjewadi.jpg" },
//   { name: "Baner", image: "/home/indemand/baner.webp" },
//   { name: "Kharadi", image: "/home/indemand/kharadi.jpeg" },

//   // Mumbai Areas
//   { name: "Bandra West", image: "/home/indemand/bandra-west.jpg" },
//   { name: "Powai", image: "/home/indemand/powai.webp" },
//   { name: "Worli", image: "/home/indemand/worli.webp" },
//   { name: "Andheri East", image: "/home/indemand/andheri-east.jpg" },
// ];

// export default function DemandSection() {
//   return (
//     <section className="py-16 ">
//       <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
//         {/* Title */}
//         <h2 className="text-3xl sm:text-4xl font-bold text-darkgray mb-12 tracking-wide pb-10">
//           IN HIGH DEMAND
//         </h2>

//         {/* Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           {locations.map((loc, index) => (
//             <motion.div
//               key={index}
//               whileHover={{ scale: 1.03 }}
//               transition={{ type: "spring", stiffness: 200, damping: 20 }}
//               className="relative overflow-hidden rounded-3xl shadow-lg group"
//             >
//               {/* Background Image */}
//               <Image
//                 src={loc.image}
//                 alt={loc.name}
//                 width={500}
//                 height={350}
//                 className="object-cover w-full h-60 sm:h-64 md:h-72 lg:h-60 transition-transform duration-700 group-hover:scale-110"
//               />

//               {/* Gradient Overlay */}
//               <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-darkgray)]/80 via-transparent to-transparent group-hover:from-[#061151]/70 transition-all duration-500"></div>

//               {/* Location Name */}
//               <div className="absolute bottom-4 left-0 right-0 text-center">
//                 <h3 className="text-white text-lg sm:text-xl font-semibold">
//                   {loc.name}
//                 </h3>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState, useCallback } from "react";

const FALLBACK_IMAGE = "/home/indemand/4.jpg";

export default function DemandSection() {
  const [areaCards, setAreaCards] = useState([]);

  useEffect(() => {
    const fetchLocalities = async () => {
      try {
        const res = await fetch("/api/v1/properties/search?limit=100", {
          method: "GET",
          cache: "no-store",
        });

        if (!res.ok) {
          const err = await res.text();
          console.error("API Error:", err);
          return;
        }

        const json = await res.json();

        if (!json?.success || !Array.isArray(json.data)) {
          console.error("Invalid API response", json);
          return;
        }

        const groups = new Map();

        json.data.forEach((item) => {
          const city = item?.city?.trim();
          const locality = item?.locality?.trim();

          if (!city || !locality) return;

          const groupKey = `${city}::${locality}`;

          if (!groups.has(groupKey)) {
            groups.set(groupKey, {
              city,
              locality,
              image: item.image || item.mainPropertyImage || FALLBACK_IMAGE,
            });
          }
        });

        const cityOrder = new Map([
          ["pune", 0],
          ["mumbai", 1],
          ["dubai", 2],
        ]);

        const formatted = Array.from(groups.values()).sort((a, b) => {
          const aCity = a.city.trim().toLowerCase();
          const bCity = b.city.trim().toLowerCase();
          const aRank = cityOrder.has(aCity) ? cityOrder.get(aCity) : 99;
          const bRank = cityOrder.has(bCity) ? cityOrder.get(bCity) : 99;

          if (aRank !== bRank) return aRank - bRank;

          const cityCompare = a.city.localeCompare(b.city);
          if (cityCompare !== 0) return cityCompare;

          return a.locality.localeCompare(b.locality);
        });

        setAreaCards(formatted);
      } catch (error) {
        console.error("Failed to fetch localities:", error);
      }
    };

    fetchLocalities();
  }, []);

  if (!areaCards.length) return null;

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-darkgray mb-12">
          IN HIGH DEMAND
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {areaCards.map((card) => (
            <motion.div
              key={`${card.city}-${card.locality}`}
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="relative overflow-hidden rounded-3xl shadow-lg group bg-white"
            >
              <div className="relative">
                <Image
                  src={card.image}
                  alt={`${card.locality}, ${card.city}`}
                  width={500}
                  height={350}
                  className="object-cover w-full h-60 transition-transform duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-linear-to-t from-black/75 via-transparent to-transparent" />

                <div className="absolute bottom-4 left-0 right-0 text-center px-4">
                  <p className="text-white/80 text-sm uppercase tracking-[0.2em]">
                    {card.city}
                  </p>
                  <h3 className="text-white text-xl font-semibold mt-1">
                    {card.locality}
                  </h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
