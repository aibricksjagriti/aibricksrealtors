// "use client";
// import { useState, useEffect, useRef } from "react";
// import { Search } from "lucide-react";
// import { useRouter } from "next/navigation";

// export default function HeroSection() {
//   const router = useRouter();
//   const videoRef = useRef(null);

//   const videos = [
//     "/home/hero-bg.mp4",
//     "/home/hero-bg-2.mp4",
//     "/home/hero-bg-3.mp4",
//   ];

//   const [currentVideo, setCurrentVideo] = useState(0);
//   const [isFading, setIsFading] = useState(false);

//   // 🔍 Search states
//   const [searchText, setSearchText] = useState("");
//   const [propertyType, setPropertyType] = useState("");
//   const [city, setCity] = useState("");
//   const [developer, setDeveloper] = useState("");
//   const [minPrice, setMinPrice] = useState("");
//   const [maxPrice, setMaxPrice] = useState("");

//   // Video logic (unchanged)
//   useEffect(() => {
//     const videoEl = videoRef.current;
//     if (!videoEl) return;

//     const handleVideoEnd = () => {
//       setIsFading(true);
//       setTimeout(() => {
//         const nextIndex = (currentVideo + 1) % videos.length;
//         setCurrentVideo(nextIndex);
//         videoEl.src = videos[nextIndex];
//         videoEl.load();
//         videoEl.play().catch(() => {});
//         setIsFading(false);
//       }, 500);
//     };

//     videoEl.addEventListener("ended", handleVideoEnd);
//     return () => videoEl.removeEventListener("ended", handleVideoEnd);
//   }, [currentVideo, videos]);

//   useEffect(() => {
//     const videoEl = videoRef.current;
//     if (videoEl) {
//       videoEl.src = videos[currentVideo];
//       videoEl.load();
//       videoEl.play().catch(() => {});
//     }
//   }, []);

//   // 🔍 Handle search
//   const handleSearch = () => {
//     const params = new URLSearchParams();

//     if (searchText) params.append("q", searchText);
//     if (propertyType) params.append("propertyType", propertyType);
//     if (city) params.append("city", city);
//     if (developer) params.append("developer", developer);
//     if (minPrice) params.append("minPrice", minPrice);
//     if (maxPrice) params.append("maxPrice", maxPrice);

//     router.push(`/search?${params.toString()}`);
//   };

//   return (
//     <section className="relative h-[700px] w-full overflow-hidden">
//       {/* Background Video */}
//       <video
//         ref={videoRef}
//         className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-700 ${
//           isFading ? "opacity-0" : "opacity-100"
//         }`}
//         muted
//         playsInline
//         autoPlay
//       />

//       <div className="absolute inset-0 bg-black/30 z-5"></div>

//       {/* Content */}
//       <div className="absolute bottom-0 left-0 w-full flex flex-col items-center z-10 text-white pb-10 px-4">
//         <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 text-center">
//           Live The Future
//         </h1>

//         {/* Search Box */}
//         <div className="w-full md:w-[85%] lg:w-[80%] bg-white/10 backdrop-blur-md border border-brickred rounded-2xl p-6 shadow-2xl">
//           <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
//             <select
//               value={propertyType}
//               onChange={(e) => setPropertyType(e.target.value)}
//               className="p-3 rounded-lg bg-white text-black"
//             >
//               <option value="">Property Type</option>
//               <option value="Apartment">Apartments</option>
//               <option value="Villa">Villas</option>
//               <option value="Penthouse">Penthouses</option>
//               <option value="Commercials">Commercials</option>
//               <option value="Plots">Plots</option>
//               <option value="Investments">Investments</option>
//             </select>

//             <select
//               value={city}
//               onChange={(e) => setCity(e.target.value)}
//               className="p-3 rounded-lg bg-white text-black"
//             >
//               <option value="">City</option>
//               <option value="Mumbai">Mumbai</option>
//               <option value="Pune">Pune</option>
//               <option value="Dubai">Dubai</option>
//             </select>

//             <select
//               value={developer}
//               onChange={(e) => setDeveloper(e.target.value)}
//               className="p-3 rounded-lg bg-white text-black"
//             >
//               <option value="">Developer</option>
//               <option value="Shapoorji">Shapoorji Pallonji Real Estate</option>
//               <option value="Krisala Developers">Krisala Developers</option>
//               <option value="Hiranandani Developers">
//                 Hiranandani Developers
//               </option>
//               <option value="Tata Housing Development Company">
//                 Tata Housing Development Company
//               </option>
//               <option value="Gera Developers">Gera Developers</option>
//               <option value="Kolte Patil Developers">
//                 Kolte Patil Developers
//               </option>
//               <option value="Lodha Developers">Lodha Developers</option>
//               <option value="Godrej Developers">Godrej Developers</option>
//               <option value="Kohinoor Developers">Kohinoor Developers</option>
//               <option value="VTP Developers">VTP Developers</option>
//             </select>

//             <select
//               onChange={(e) => {
//                 const [min, max] = e.target.value.split("-");
//                 setMinPrice(min);
//                 setMaxPrice(max);
//               }}
//               className="p-3 rounded-lg bg-white text-black"
//             >
//               <option value="">Price</option>
//               <option value="0-5000000">Under ₹50 Lakhs</option>
//               <option value="5000000-10000000">₹50 Lakhs - ₹1 Crore</option>
//               <option value="10000000-15000000">₹1 - 1.5 Crores</option>
//               <option value="15000000-25000000">₹1.5 - 2.5 Crores</option>
//               <option value="25000000-40000000">₹2.5 - 4 Crores</option>
//               <option value="40000000-">Above ₹4 Crores</option>
//             </select>
//           </div>

//           {/* Search input */}
//           <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
//             <input
//               value={searchText}
//               onChange={(e) => setSearchText(e.target.value)}
//               placeholder="Search Properties..."
//               className="p-3 rounded-lg bg-white text-black lg:col-span-4"
//             />

//             <button
//               onClick={handleSearch}
//               className="flex items-center justify-center gap-2 bg-brickred text-white rounded-lg py-3 font-semibold hover:bg-ochre transition"
//             >
//               <Search size={18} />
//               Find
//             </button>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// "use client";

// import { useState, useRef, useCallback } from "react";
// import { Search } from "lucide-react";
// import { useRouter } from "next/navigation";

// const VIDEOS = [
//   "/home/hero-bg.mp4",
//   "/home/hero-bg-2.mp4",
//   "/home/hero-bg-3.mp4",
// ];

// export default function HeroSection() {
//   const router = useRouter();
//   const videoRef = useRef(null);

//   const [videoIndex, setVideoIndex] = useState(0);

//   // 🔁 Rotate video (NO reload, NO re-render heavy logic)
//   const handleVideoEnd = useCallback(() => {
//     setVideoIndex((prev) => (prev + 1) % VIDEOS.length);
//   }, []);

//   // 🔍 Search states (kept minimal)
//   const [filters, setFilters] = useState({
//     q: "",
//     propertyType: "",
//     city: "",
//     developer: "",
//     minPrice: "",
//     maxPrice: "",
//   });

//   const handleChange = (key, value) => {
//     setFilters((prev) => ({ ...prev, [key]: value }));
//   };

//   // 🚀 Fast search redirect
//   const handleSearch = () => {
//     const params = new URLSearchParams(
//       Object.entries(filters).filter(([, v]) => v),
//     );
//     router.push(`/search?${params.toString()}`);
//   };

//   return (
//     <section className="relative h-[700px] w-full overflow-hidden">
//       {/* 🎥 Optimized Video */}
//       <video
//         ref={videoRef}
//         key={videoIndex}
//         src={VIDEOS[videoIndex]}
//         className="absolute inset-0 h-full w-full object-cover"
//         autoPlay
//         muted
//         playsInline
//         preload="metadata"
//         onEnded={handleVideoEnd}
//       />

//       <div className="absolute inset-0 bg-black/30" />

//       {/* Content */}
//       <div className="absolute bottom-0 w-full px-4 pb-10 text-white z-10">
//         <h1 className="text-center text-3xl md:text-5xl lg:text-6xl font-serif font-bold mb-6">
//           Live The Future
//         </h1>

//         {/* 🔍 Search Box */}
//         <div className="mx-auto max-w-6xl bg-white/10 backdrop-blur-md border border-brickred rounded-2xl p-6 shadow-xl">
//           <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
//             <select
//               onChange={(e) => handleChange("propertyType", e.target.value)}
//               className="p-3 rounded-lg bg-white text-black"
//             >
//               <option value="">Property Type</option>
//               <option value="Apartment">Apartments</option>
//               <option value="Villa">Villas</option>
//               <option value="Penthouse">Penthouses</option>
//               <option value="Commercials">Commercials</option>
//               <option value="Plots">Plots</option>
//               <option value="Investments">Investments</option>
//             </select>

//             <select
//               onChange={(e) => handleChange("city", e.target.value)}
//               className="p-3 rounded-lg bg-white text-black"
//             >
//               <option value="">City</option>
//               <option>Mumbai</option>
//               <option>Pune</option>
//               <option>Dubai</option>
//             </select>

//             <select
//               onChange={(e) => handleChange("developer", e.target.value)}
//               className="p-3 rounded-lg bg-white text-black"
//             >
//               <option value="">Developer</option>
//               <option value="Shapoorji">Shapoorji Pallonji Real Estate</option>
//               <option value="Krisala Developers">Krisala Developers</option>
//               <option value="Hiranandani Developers">
//                 Hiranandani Developers
//               </option>
//               <option value="Tata Housing Development Company">
//                 Tata Housing Development Company
//               </option>
//               <option value="Gera Developers">Gera Developers</option>
//               <option value="Kolte Patil Developers">
//                 Kolte Patil Developers
//               </option>
//               <option value="Lodha Developers">Lodha Developers</option>
//               <option value="Godrej Developers">Godrej Developers</option>
//               <option value="Kohinoor Developers">Kohinoor Developers</option>
//               <option value="VTP Developers">VTP Developers</option>
//             </select>

//             <select
//               onChange={(e) => {
//                 const [min, max] = e.target.value.split("-");
//                 handleChange("minPrice", min);
//                 handleChange("maxPrice", max || "");
//               }}
//               className="p-3 rounded-lg bg-white text-black"
//             >
//               <option value="">Price</option>
//               <option value="0-5000000">Under ₹50 Lakhs</option>
//               <option value="5000000-10000000">₹50 Lakhs - ₹1 Crore</option>
//               <option value="10000000-15000000">₹1 - 1.5 Crores</option>
//               <option value="15000000-25000000">₹1.5 - 2.5 Crores</option>
//               <option value="25000000-40000000">₹2.5 - 4 Crores</option>
//               <option value="40000000-">Above ₹4 Crores</option>
//             </select>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
//             <input
//               placeholder="Search properties..."
//               onChange={(e) => handleChange("q", e.target.value)}
//               className="p-3 rounded-lg bg-white text-black lg:col-span-4"
//             />

//             <button
//               onClick={handleSearch}
//               className="flex items-center justify-center gap-2 bg-brickred text-white rounded-lg py-3 font-semibold hover:bg-ochre transition"
//             >
//               <Search size={18} />
//               Find
//             </button>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

import Image from "next/image";
import HeroVideo from "./Hero/HeroVideo";
import HeroSearch from "./Hero/HeroSearch";

export default function HeroSection() {
  return (
    <section className="relative h-[700px] w-full overflow-hidden">
      {/* LCP IMAGE (fastest render) */}
      <Image
        src="/home/hero-banner-home.png"
        alt="Luxury Properties"
        fill
        priority
        fetchPriority="high"
        className="object-cover"
      />

      <div className="absolute inset-0 bg-black/30" />

      {/* Video (loads AFTER page paint) */}
      <HeroVideo />

      {/* UI (UNCHANGED) */}
      <div className="absolute bottom-0 w-full px-4 pb-10 text-white z-10">
        <h1 className="text-center text-3xl md:text-5xl lg:text-6xl font-serif font-bold mb-6">
          Live The Future
        </h1>

        <HeroSearch />
      </div>
    </section>
  );
}
