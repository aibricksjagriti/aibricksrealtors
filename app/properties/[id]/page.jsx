// "use client";
// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";

// export default function PropertyDetailPage() {
//   const { id } = useParams();
//   const [property, setProperty] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchProperty = async () => {
//       try {
//         const apiUrl = process.env.NEXT_PUBLIC_API_URL;
//         let url;

//         if (apiUrl) {
//           url = `${apiUrl}/api/v1/properties/${id}`;
//         } else {
//           // Use relative URL for client-side when API URL is not set
//           url = `/api/v1/properties/${id}`;
//         }

//         const res = await fetch(url);
//         const data = await res.json();
//         setProperty(data?.data || null);
//       } catch (error) {
//         console.error("Property fetch error:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) {
//       fetchProperty();
//     }
//   }, [id]);

//   if (loading) {
//     return (
//       <div className="min-h-[60vh] flex items-center justify-center text-gray-500">
//         Loading property details...
//       </div>
//     );
//   }

//   if (!property) {
//     return (
//       <div className="min-h-[60vh] flex items-center justify-center">
//         Property not found
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-28 mt-10">
//       {/* ---------------- HEADER ---------------- */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
//         {/* Image */}
//         <div className="bg-gray-200 rounded-2xl h-[300px] md:h-[430px] flex items-center justify-center text-gray-400">
//           Property Images
//         </div>

//         {/* Info */}
//         <div>
//           <h1 className="text-2xl md:text-3xl font-bold mb-2">
//             {property.propertyTitle}
//           </h1>

//           <p className="text-gray-600 mb-3">
//             {property.locality}, {property.city}, {property.state}
//           </p>

//           <p className="text-3xl font-bold text-brickred mb-4">
//             ₹ {(property.totalPrice / 10000000).toFixed(2)} Cr
//           </p>

//           <div className="flex flex-wrap gap-2 mb-6">
//             <Badge>{property.propertyType}</Badge>
//             <Badge>{property.subType}</Badge>
//             <Badge>{property.propertyStatus}</Badge>
//           </div>

//           <div className="flex flex-col sm:flex-row gap-4">
//             <button className="btn-primary">Enquire Now</button>
//             <button className="btn-outline">Contact Agent</button>
//           </div>
//         </div>
//       </div>

//       {/* ---------------- DETAILS GRID ---------------- */}
//       <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-8">
//         <Detail label="Built-up Area" value={`${property.builtUpArea} sq.ft`} />
//         <Detail label="Carpet Area" value={`${property.carpetArea} sq.ft`} />
//         <Detail
//           label="Floor"
//           value={`${property.floorNumber} / ${property.totalFloors}`}
//         />
//         <Detail label="Facing" value={property.facingDirection} />
//         <Detail label="Furnishing" value={property.furnishing} />
//         <Detail label="Ownership" value={property.ownershipType} />
//         <Detail label="Listing Type" value={property.listingType} />
//         <Detail label="Builder" value={property.builderName} />
//       </div>

//       {/* ---------------- AMENITIES (ENHANCED) ---------------- */}
//       {property.amenities?.length > 0 && (
//         <div className="mt-16">
//           <h2 className="section-title mb-6 ">Amenities</h2>

//           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
//             {property.amenities.map((amenity, index) => (
//               <div
//                 key={index}
//                 className="flex items-center gap-3 px-5 py-4 rounded-xl bg-white shadow-sm border hover:shadow-md transition"
//               >
//                 <div className="h-10 w-10 flex items-center justify-center rounded-full bg-brickred/10 text-brickred font-bold">
//                   ✓
//                 </div>
//                 <p className="text-lg font-medium text-gray-700">{amenity}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* ---------------- SELLER INFO (ENHANCED) ---------------- */}
//       <div className="mt-16">
//         <h2 className="section-title mb-6">Seller Information</h2>

//         <div className="rounded-2xl border bg-gradient-to-br from-gray-50 to-white p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
//           {/* Left */}
//           <div className="flex gap-4 items-center">
//             <div className="h-14 w-14 rounded-full bg-brickred text-white flex items-center justify-center text-xl font-bold">
//               {property.seller?.sellerName?.charAt(0)}
//             </div>

//             <div>
//               <p className="text-lg font-semibold">
//                 {property.seller?.sellerName}
//               </p>
//               <p className="text-md text-gray-600">
//                 {property.seller?.sellerType}
//                 {property.seller?.verifiedBadge === "Yes" && (
//                   <span className="ml-2 text-green-600 font-medium">
//                     ✔ Verified
//                   </span>
//                 )}
//               </p>

//               {property.seller?.email && (
//                 <p className="text-md text-gray-500 mt-1">
//                   {property.seller.email}
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* Right CTA */}
//           <div className="flex gap-3 w-full md:w-auto">
//             <button className="flex-1 md:flex-none px-5 py-2.5 rounded-lg bg-brickred text-white font-semibold hover:bg-ochre transition">
//               Call Agent
//             </button>
//             <button className="flex-1 md:flex-none px-5 py-2.5 rounded-lg border border-brickred text-brickred font-semibold hover:bg-brickred hover:text-white transition">
//               Email
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ---------------- SMALL COMPONENTS ---------------- */

// function Detail({ label, value }) {
//   return (
//     <div>
//       <p className="text-md text-gray-500">{label}</p>
//       <p className="font-semibold">{value}</p>
//     </div>
//   );
// }

// function Badge({ children }) {
//   return (
//     <span className="px-3 py-1 text-md rounded-full bg-gray-100 text-gray-700 font-medium">
//       {children}
//     </span>
//   );
// }

// "use client";
// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";

// export default function PropertyDetailPage() {
//   const { id } = useParams();
//   const [property, setProperty] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchProperty() {
//       try {
//         const res = await fetch(`/api/v1/properties/${id}`);
//         const data = await res.json();
//         setProperty(data?.data || null);
//       } catch (error) {
//         console.error(error);
//       } finally {
//         setLoading(false);
//       }
//     }

//     if (id) fetchProperty();
//   }, [id]);

//   if (loading) {
//     return (
//       <div className="min-h-[60vh] flex items-center justify-center text-gray-500">
//         Loading property details...
//       </div>
//     );
//   }

//   if (!property) {
//     return (
//       <div className="min-h-[60vh] flex items-center justify-center">
//         Property not found
//       </div>
//     );
//   }

//   return (
//     <div className="bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 pt-28 pb-16">
//         {/* ================= HEADER ================= */}
//         <div className="mb-6">
//           <h1 className="text-2xl md:text-3xl font-bold">
//             {property.propertyTitle}
//           </h1>
//           <p className="text-gray-600 mt-1">
//             {property.locality}, {property.city}
//           </p>
//           <p className="text-2xl font-bold text-brickred mt-2">
//             ₹ {(property.totalPrice / 10000000).toFixed(2)} Cr
//           </p>
//         </div>

//         {/* ================= TOP GRID ================= */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* -------- IMAGE GALLERY -------- */}
//           <div className="lg:col-span-2">
//             <div className="grid grid-cols-2 gap-3">
//               <div className="col-span-2 h-[320px] bg-gray-200 rounded-xl flex items-center justify-center">
//                 Main Image
//               </div>
//               <div className="h-[150px] bg-gray-200 rounded-xl" />
//               <div className="h-[150px] bg-gray-200 rounded-xl" />
//             </div>
//           </div>

//           {/* -------- STICKY CTA CARD -------- */}
//           <div className="lg:sticky lg:top-28 h-fit">
//             <div className="bg-white rounded-2xl shadow p-6 space-y-4">
//               <button className="w-full bg-brickred text-white py-3 rounded-lg font-semibold">
//                 Call Agent
//               </button>
//               <button className="w-full border border-brickred text-brickred py-3 rounded-lg font-semibold">
//                 Enquire Now
//               </button>

//               <div className="text-sm text-gray-600">
//                 ✔ Free Site Visit <br />
//                 ✔ Verified Property <br />✔ Best Price Guaranteed
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* ================= OVERVIEW ================= */}
//         <Section title="Overview">
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//             <Detail
//               label="Built-up Area"
//               value={`${property.builtUpArea} sq.ft`}
//             />
//             <Detail
//               label="Carpet Area"
//               value={`${property.carpetArea} sq.ft`}
//             />
//             <Detail
//               label="Floor"
//               value={`${property.floorNumber}/${property.totalFloors}`}
//             />
//             <Detail label="Facing" value={property.facingDirection} />
//             <Detail label="Furnishing" value={property.furnishing} />
//             <Detail label="Ownership" value={property.ownershipType} />
//             <Detail label="Listing Type" value={property.listingType} />
//             <Detail label="Builder" value={property.builderName} />
//           </div>
//         </Section>

//         {/* ================= AMENITIES ================= */}
//         {property.amenities?.length > 0 && (
//           <Section title="Amenities">
//             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//               {property.amenities.map((amenity, i) => (
//                 <div
//                   key={i}
//                   className="flex items-center gap-3 p-4 bg-white rounded-xl border"
//                 >
//                   <span className="h-8 w-8 flex items-center justify-center bg-brickred/10 text-brickred rounded-full">
//                     ✓
//                   </span>
//                   <span className="text-sm font-medium">{amenity}</span>
//                 </div>
//               ))}
//             </div>
//           </Section>
//         )}

//         {/* ================= SELLER ================= */}
//         <Section title="Seller Information">
//           <div className="bg-white rounded-2xl border p-6 flex flex-col md:flex-row gap-6 justify-between">
//             <div className="flex gap-4 items-center">
//               <div className="h-14 w-14 rounded-full bg-brickred text-white flex items-center justify-center font-bold text-lg">
//                 {property.seller?.sellerName?.charAt(0)}
//               </div>
//               <div>
//                 <p className="font-semibold text-lg">
//                   {property.seller?.sellerName}
//                 </p>
//                 <p className="text-gray-600 text-sm">
//                   {property.seller?.sellerType}
//                 </p>
//               </div>
//             </div>

//             <div className="flex gap-3">
//               <button className="px-5 py-2 bg-brickred text-white rounded-lg">
//                 Call
//               </button>
//               <button className="px-5 py-2 border border-brickred text-brickred rounded-lg">
//                 Email
//               </button>
//             </div>
//           </div>
//         </Section>
//       </div>
//     </div>
//   );
// }

// /* ================= REUSABLE COMPONENTS ================= */

// function Section({ title, children }) {
//   return (
//     <div className="mt-14">
//       <h2 className="text-xl font-semibold mb-6">{title}</h2>
//       {children}
//     </div>
//   );
// }

// function Detail({ label, value }) {
//   return (
//     <div>
//       <p className="text-sm text-gray-500">{label}</p>
//       <p className="font-semibold">{value}</p>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Camera,
  ShieldCheck,
  Home,
  Dumbbell,
  Trees,
  Building2,
  Waves,
  Users,
  BookOpen,
  Film,
  Footprints,
} from "lucide-react";
import ContactSidebar from "@/src/Properties/ContactSidebar";
import BookSiteVisitCard from "@/src/Properties/BookSiteVisitCard";

/* ================= AMENITY ICON MAP ================= */

const AMENITY_ICONS = {
  "Video Door Phone": Camera,
  "Vitrified Tiles": Home,
  "Granite Kitchen": Home,
  "Branded Fittings": ShieldCheck,
  "D.G Backup": ShieldCheck,
  "CCTV Camera": Camera,

  "Swimming Pool": Waves,
  "Club House": Building2,
  "Jogging Track": Footprints,
  Garden: Trees,
  "Multipurpose Hall": Users,
  "Senior Citizen Area": Users,
  "Kids Pool": Waves,
  Library: BookOpen,
  "Movie Theatre": Film,
  Gym: Dumbbell,
};

/* ================= MAIN PAGE ================= */

export default function PropertyDetailPage() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProperty() {
      try {
        const res = await fetch(`/api/v1/properties/${id}`);
        const data = await res.json();
        setProperty(data?.data || null);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-500">
        Loading property details...
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        Property not found
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 pt-28 pb-16">
        {/* ================= HEADER ================= */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">
            {property.propertyTitle}
          </h1>
          <p className="text-gray-600 mt-1">
            {property.locality}, {property.city}
          </p>
          <p className="text-2xl font-bold text-brickred mt-2">
            ₹ {(property.totalPrice / 10000000).toFixed(2)} Cr
          </p>
        </div>

        {/* ================= TOP GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* IMAGE GALLERY */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 h-[320px] bg-gray-200 rounded-xl flex items-center justify-center">
                Main Image
              </div>
              <div className="h-[150px] bg-gray-200 rounded-xl" />
              <div className="h-[150px] bg-gray-200 rounded-xl" />
            </div>
          </div>

          {/* CTA CARD */}
          <div className="lg:sticky lg:top-28 h-fit">
            <div className="bg-white rounded-2xl shadow p-6 space-y-4">
              {/* <button className="w-full bg-brickred text-white py-3 rounded-lg font-semibold">
                Call Agent
              </button>
              <button className="w-full border border-brickred text-brickred py-3 rounded-lg font-semibold">
                Enquire Now
              </button>

              <div className="text-sm text-gray-600">
                ✔ Free Site Visit <br />
                ✔ Verified Property <br />✔ Best Price Guaranteed
              </div> */}
              <ContactSidebar />
              <BookSiteVisitCard />
            </div>
          </div>
        </div>

        {/* ================= OVERVIEW ================= */}
        <Section title="Overview">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Detail
              label="Built-up Area"
              value={`${property.builtUpArea} sq.ft`}
            />
            <Detail
              label="Carpet Area"
              value={`${property.carpetArea} sq.ft`}
            />
            <Detail
              label="Floor"
              value={`${property.floorNumber}/${property.totalFloors}`}
            />
            <Detail label="Facing" value={property.facingDirection} />
            <Detail label="Furnishing" value={property.furnishing} />
            <Detail label="Ownership" value={property.ownershipType} />
            <Detail label="Listing Type" value={property.listingType} />
            <Detail label="Builder" value={property.builderName} />
          </div>
        </Section>

        {/* ================= AMENITIES ================= */}
        {property.amenities?.length > 0 && (
          <AmenitiesSection amenities={property.amenities} />
        )}

        {/* ================= SELLER ================= */}
        <Section title="Seller Information">
          <div className="bg-white rounded-2xl border p-6 flex flex-col md:flex-row gap-6 justify-between">
            <div className="flex gap-4 items-center">
              <div className="h-14 w-14 rounded-full bg-brickred text-white flex items-center justify-center font-bold text-lg">
                {property.seller?.sellerName?.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-lg">
                  {property.seller?.sellerName}
                </p>
                <p className="text-gray-600 text-sm">
                  {property.seller?.sellerType}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="px-5 py-2 bg-brickred text-white rounded-lg">
                Call
              </button>
              <button className="px-5 py-2 border border-brickred text-brickred rounded-lg">
                Email
              </button>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}

/* ================= AMENITIES COMPONENT ================= */

function AmenitiesSection({ amenities }) {
  const [showAll, setShowAll] = useState(false);

  const internalAmenities = amenities.filter((a) =>
    [
      "Video Door Phone",
      "Vitrified Tiles",
      "Granite Kitchen",
      "Branded Fittings",
      "D.G Backup",
      "CCTV Camera",
    ].includes(a),
  );

  const externalAmenities = amenities.filter(
    (a) => !internalAmenities.includes(a),
  );

  const visibleExternal = showAll
    ? externalAmenities
    : externalAmenities.slice(0, 8);

  return (
    <Section title="Amenities">
      {internalAmenities.length > 0 && (
        <>
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Internal Amenities
          </h3>
          <AmenityGrid items={internalAmenities} />
        </>
      )}

      {externalAmenities.length > 0 && (
        <>
          <h3 className="text-lg font-semibold mt-10 mb-4 text-gray-700">
            External Amenities
          </h3>

          <AmenityGrid items={visibleExternal} />

          {externalAmenities.length > 8 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="mt-4 px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-sm font-semibold"
            >
              {showAll ? "Show Less" : `+${externalAmenities.length - 8} More`}
            </button>
          )}
        </>
      )}
    </Section>
  );
}

/* ================= AMENITY GRID ================= */

function AmenityGrid({ items }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {items.map((amenity, index) => {
        const Icon = AMENITY_ICONS[amenity] || Home;

        return (
          <div
            key={index}
            className="flex flex-col items-center justify-center gap-2
                       bg-white border rounded-xl p-4 text-center
                       hover:shadow-md transition"
          >
            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-brickred/10 text-brickred">
              <Icon size={20} />
            </div>
            <p className="text-sm font-medium text-gray-700 leading-tight">
              {amenity}
            </p>
          </div>
        );
      })}
    </div>
  );
}

/* ================= REUSABLE ================= */

function Section({ title, children }) {
  return (
    <div className="mt-14">
      <h2 className="text-xl font-semibold mb-6">{title}</h2>
      {children}
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}
