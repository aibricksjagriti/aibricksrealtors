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
import { useRouter } from "next/navigation";

const FALLBACK_IMAGE = "/home/indemand/4.jpg";

export default function DemandSection() {
  const [localities, setLocalities] = useState([]);
  const router = useRouter();

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

        // Extract unique localities
        const map = new Map();

        json.data.forEach((item) => {
          if (item?.locality && !map.has(item.locality)) {
            map.set(item.locality, {
              name: item.locality,
              image: item.image || FALLBACK_IMAGE,
            });
          }
        });

        setLocalities([...map.values()]);
      } catch (error) {
        console.error("Failed to fetch localities:", error);
      }
    };

    fetchLocalities();
  }, []);

  const handleClick = useCallback(
    (locality) => {
      router.push(`/search?locality=${encodeURIComponent(locality)}`);
    },
    [router],
  );

  if (!localities.length) return null;

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-darkgray mb-12">
          IN HIGH DEMAND
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {localities.map((loc) => (
            <motion.div
              key={loc.name}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              onClick={() => handleClick(loc.name)}
              className="relative cursor-pointer overflow-hidden rounded-3xl shadow-lg group"
            >
              <Image
                src={loc.image}
                alt={loc.name}
                width={500}
                height={350}
                className="object-cover w-full h-60 transition-transform duration-700 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

              <div className="absolute bottom-4 left-0 right-0 text-center">
                <h3 className="text-white text-lg font-semibold">{loc.name}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
