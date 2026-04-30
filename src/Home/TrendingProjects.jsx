// "use client";

// import { useEffect, useState, useCallback, memo } from "react";
// import { useRouter } from "next/navigation";
// import { motion } from "framer-motion";
// import Image from "next/image";
// import { MapPin, Bed, Ruler, Calendar, Building2, Flame } from "lucide-react";
// import PropertyEnquiryModal from "../Modal/PropertyEnquiryModal";

// /* ---------------- CONSTANTS ---------------- */
// // const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";
// // const API_URL = `${API_BASE_URL}/v1/properties?activeStatus=Yes&limit=9`;
// const API_URL = "/api/v1/properties?activeStatus=Yes&limit=9";
// const FALLBACK_IMAGE = "/home/ajman.webp";

// /* ---------------- CARD COMPONENT ---------------- */
// const PropertyCard = memo(function PropertyCard({ property, onEnquire }) {
//   const router = useRouter();
//   const [imgSrc, setImgSrc] = useState(property.image || FALLBACK_IMAGE);

//   /* 🔥 CARD CLICK → DETAILS PAGE */
//   const handleCardClick = () => {
//     router.push(`/properties/${property.id}`);
//   };

//   return (
//     <div
//       onClick={handleCardClick}
//       className="relative bg-white rounded-3xl overflow-hidden shadow-lg w-full max-w-[370px]
//       cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
//     >
//       {/* Image */}
//       <div className="relative h-64">
//         <Image
//           src={imgSrc}
//           alt={property.name}
//           fill
//           sizes="(max-width: 768px) 100vw, 370px"
//           className="object-cover"
//           loading="lazy"
//           onError={() => {
//             if (imgSrc !== FALLBACK_IMAGE) {
//               setImgSrc(FALLBACK_IMAGE);
//             }
//           }}
//         />

//         {/* Builder */}
//         <div className="absolute top-4 bg-[#e8c13f] px-3 py-1 rounded-tr-xl rounded-br-xl font-semibold">
//           {property.developer}
//         </div>

//         {/* Trending */}
//         <div className="absolute bottom-2 right-0 bg-[#e8c13f] px-3 py-1 rounded-tl-xl rounded-bl-xl flex items-center gap-1 font-semibold">
//           <Flame size={18} /> Trending
//         </div>
//       </div>

//       {/* Content */}
//       <div className="p-5">
//         <h3 className="text-xl font-semibold text-[var(--color-darkgray)]">
//           {property.name}
//         </h3>

//         <p className="text-darkgray mb-3">{property.type}</p>

//         <div className="space-y-2 text-gray-600 text-sm font-semibold">
//           <p className="flex gap-2 items-center">
//             <MapPin size={14} /> {property.location}
//           </p>
//           <p className="flex gap-2 items-center">
//             <Bed size={14} /> {property.bedrooms}
//           </p>
//           <p className="flex gap-2 items-center">
//             <Ruler size={14} /> {property.area}
//           </p>
//           <p className="flex gap-2 items-center">
//             <Calendar size={14} /> {property.completion}
//           </p>
//         </div>

//         {/* Footer */}
//         <div className="border-t mt-4 pt-4 flex justify-between items-center">
//           <span className="font-bold text-brickred">{property.price}</span>

//           {/* ❌ STOP NAVIGATION HERE */}
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               onEnquire(property);
//             }}
//             className="bg-brickred text-white px-4 py-2 rounded-md text-sm hover:bg-ochre transition cursor-pointer"
//           >
//             Enquire Now
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// });

// /* ---------------- MAIN COMPONENT ---------------- */
// export default function TrendingProjects() {
//   const [properties, setProperties] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedProperty, setSelectedProperty] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   /* -------- FETCH DATA -------- */
//   useEffect(() => {
//     const fetchProperties = async () => {
//       try {
//         const res = await fetch(API_URL, { cache: "no-store" });
//         const json = await res.json();

//         const formatted = json.data.map((p) => ({
//           id: p.id,
//           name: p.projectName || p.propertyTitle,
//           developer: p.builderName,
//           type: p.propertyType,
//           location: `${p.city}, ${p.state}`,
//           bedrooms: p.subType,
//           area: `${p.builtUpArea} sq.ft`,
//           completion: p.propertyStatus,
//           price: `₹ ${(p.totalPrice / 10000000).toFixed(2)} Cr`,
//           image: p.imageGallery?.[0] || FALLBACK_IMAGE,
//         }));

//         setProperties(formatted.slice(0, 9));
//       } catch (error) {
//         console.error("Failed to fetch properties", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProperties();
//   }, []);

//   /* -------- MODAL HANDLER -------- */
//   const openEnquiry = useCallback((property) => {
//     setSelectedProperty(property);
//     setIsModalOpen(true);
//   }, []);

//   return (
//     <section className="bg-[#f8f8f8] py-16 px-4">
//       <div className="max-w-7xl mx-auto">
//         {/* Heading */}
//         <div className="text-center mb-16">
//           <Building2 size={40} className="mx-auto text-[var(--color-ochre)]" />
//           <h2 className="text-4xl font-serif font-bold uppercase">Trending</h2>
//         </div>

//         {/* Grid */}
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           viewport={{ once: true }}
//           className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center"
//         >
//           {loading
//             ? Array.from({ length: 9 }).map((_, i) => (
//                 <div
//                   key={i}
//                   className="w-full max-w-[370px] h-[420px] bg-gray-200 animate-pulse rounded-3xl"
//                 />
//               ))
//             : properties.map((property) => (
//                 <PropertyCard
//                   key={property.id}
//                   property={property}
//                   onEnquire={openEnquiry}
//                 />
//               ))}
//         </motion.div>
//       </div>

//       <PropertyEnquiryModal
//         isOpen={isModalOpen}
//         property={selectedProperty}
//         onClose={() => setIsModalOpen(false)}
//       />
//     </section>
//   );
// }

"use client";

import { useEffect, useState, useCallback, memo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { MapPin, Bed, Ruler, Calendar, Building2, Flame } from "lucide-react";
import PropertyEnquiryModal from "../Modal/PropertyEnquiryModal";

/* ---------------- CONSTANTS ---------------- */
const API_URL = "/api/v1/properties?activeStatus=Yes&limit=9&includeTotal=false";
const FALLBACK_IMAGE = "/home/ajman.webp";

/* ---------------- PRICE FORMATTER ---------------- */
const formatPrice = (price) => {
  if (!price) return "₹ N/A";

  if (price < 10000000) {
    // Below 1 Cr → show in Lakhs
    return `₹ ${(price / 100000).toFixed(0)} Lakhs`;
  } else {
    // 1 Cr and above → show in Crores
    return `₹ ${(price / 10000000).toFixed(2)} Cr`;
  }
};

/* ---------------- CARD COMPONENT ---------------- */
const PropertyCard = memo(function PropertyCard({ property, onEnquire }) {
  const router = useRouter();
  const [imgSrc, setImgSrc] = useState(property.image || FALLBACK_IMAGE);

  const handleCardClick = () => {
    router.push(`/properties/${property.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="relative bg-white rounded-3xl overflow-hidden shadow-lg w-full max-w-[370px]
      cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative h-64">
        <Image
          src={imgSrc}
          alt={property.name}
          fill
          sizes="(max-width: 768px) 100vw, 370px"
          className="object-cover"
          loading="lazy"
          onError={() => {
            if (imgSrc !== FALLBACK_IMAGE) {
              setImgSrc(FALLBACK_IMAGE);
            }
          }}
        />

        <div className="absolute top-4 bg-[#e8c13f] px-3 py-1 rounded-tr-xl rounded-br-xl font-semibold">
          {property.developer}
        </div>

        <div className="absolute bottom-2 right-0 bg-[#e8c13f] px-3 py-1 rounded-tl-xl rounded-bl-xl flex items-center gap-1 font-semibold">
          <Flame size={18} /> Trending
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-xl font-semibold text-[var(--color-darkgray)]">
          {property.name}
        </h3>

        <p className="text-darkgray mb-3">{property.type}</p>

        <div className="space-y-2 text-gray-600 text-sm font-semibold">
          <p className="flex gap-2 items-center">
            <MapPin size={14} /> {property.location}
          </p>
          <p className="flex gap-2 items-center">
            <Bed size={14} /> {property.bedrooms}
          </p>
          <p className="flex gap-2 items-center">
            <Ruler size={14} /> {property.area}
          </p>
          <p className="flex gap-2 items-center">
            <Calendar size={14} /> {property.completion}
          </p>
        </div>

        {/* Footer */}
        <div className="border-t mt-4 pt-4 flex justify-between items-center">
          <span className="font-bold text-brickred">{property.price}</span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onEnquire(property);
            }}
            className="bg-brickred text-white px-4 py-2 rounded-md text-sm hover:bg-ochre transition cursor-pointer"
          >
            Enquire Now
          </button>
        </div>
      </div>
    </div>
  );
});

/* ---------------- MAIN COMPONENT ---------------- */
export default function TrendingProjects() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch(API_URL, { cache: "no-store" });
        const json = await res.json();

        const formatted = json.data.map((p) => ({
          id: p.id,
          name: p.projectName || p.propertyTitle,
          developer: p.builderName,
          type: p.propertyType,
          location: `${p.city}, ${p.state}`,
          bedrooms: p.subType,
          area: `${p.builtUpArea} sq.ft`,
          completion: p.propertyStatus,
          price: formatPrice(p.totalPrice), // ✅ FIXED HERE
          image: p.imageGallery?.[0] || FALLBACK_IMAGE,
        }));

        setProperties(formatted.slice(0, 9));
      } catch (error) {
        console.error("Failed to fetch properties", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const openEnquiry = useCallback((property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  }, []);

  return (
    <section className="bg-[#f8f8f8] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Building2 size={40} className="mx-auto text-[var(--color-ochre)]" />
          <h2 className="text-4xl font-serif font-bold uppercase">Trending</h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center"
        >
          {loading
            ? Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className="w-full max-w-[370px] h-[420px] bg-gray-200 animate-pulse rounded-3xl"
                />
              ))
            : properties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onEnquire={openEnquiry}
                />
              ))}
        </motion.div>
      </div>

      <PropertyEnquiryModal
        isOpen={isModalOpen}
        property={selectedProperty}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
}
