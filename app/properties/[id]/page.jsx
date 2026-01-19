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
//         const res = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/api/v1/properties/${id}`
//         );
//         const data = await res.json();
//         setProperty(data?.data || null);
//       } catch (error) {
//         console.error("Property fetch error:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProperty();
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
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         {/* Image */}
//         <div className="bg-gray-200 rounded-xl h-[300px] md:h-[420px] flex items-center justify-center text-gray-400">
//           Property Images
//         </div>

//         {/* Main Info */}
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

//           {/* Badges */}
//           <div className="flex flex-wrap gap-2 mb-6">
//             <span className="badge">{property.propertyType}</span>
//             <span className="badge">{property.subType}</span>
//             <span className="badge">{property.propertyStatus}</span>
//           </div>

//           {/* CTA */}
//           <div className="flex flex-col sm:flex-row gap-4">
//             <button className="btn-primary">Enquire Now</button>
//             <button className="btn-outline">Contact Agent</button>
//           </div>
//         </div>
//       </div>

//       {/* ---------------- DETAILS GRID ---------------- */}
//       <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
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

//       {/* ---------------- AMENITIES ---------------- */}
//       {property.amenities?.length > 0 && (
//         <div className="mt-12">
//           <h2 className="section-title">Amenities</h2>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
//             {property.amenities.map((amenity, index) => (
//               <div
//                 key={index}
//                 className="border rounded-lg px-4 py-3 text-sm text-gray-700"
//               >
//                 {amenity}
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* ---------------- SELLER ---------------- */}
//       <div className="mt-12 border rounded-xl p-6 bg-gray-50">
//         <h2 className="section-title mb-4">Seller Information</h2>

//         <p className="font-semibold">{property.seller?.sellerName}</p>

//         <p className="text-sm text-gray-600">
//           {property.seller?.sellerType}
//           {property.seller?.verifiedBadge === "Yes" && " • Verified"}
//         </p>

//         {property.seller?.email && (
//           <p className="text-sm mt-2">{property.seller.email}</p>
//         )}
//       </div>
//     </div>
//   );
// }

// /* ---------------- SMALL COMPONENTS ---------------- */

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

export default function PropertyDetailPage() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        let url;
        
        if (apiUrl) {
          url = `${apiUrl}/api/v1/properties/${id}`;
        } else {
          // Use relative URL for client-side when API URL is not set
          url = `/api/v1/properties/${id}`;
        }
        
        const res = await fetch(url);
        const data = await res.json();
        setProperty(data?.data || null);
      } catch (error) {
        console.error("Property fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    }
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
    <div className="max-w-7xl mx-auto px-4 py-28 mt-10">
      {/* ---------------- HEADER ---------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Image */}
        <div className="bg-gray-200 rounded-2xl h-[300px] md:h-[430px] flex items-center justify-center text-gray-400">
          Property Images
        </div>

        {/* Info */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            {property.propertyTitle}
          </h1>

          <p className="text-gray-600 mb-3">
            {property.locality}, {property.city}, {property.state}
          </p>

          <p className="text-3xl font-bold text-brickred mb-4">
            ₹ {(property.totalPrice / 10000000).toFixed(2)} Cr
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            <Badge>{property.propertyType}</Badge>
            <Badge>{property.subType}</Badge>
            <Badge>{property.propertyStatus}</Badge>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button className="btn-primary">Enquire Now</button>
            <button className="btn-outline">Contact Agent</button>
          </div>
        </div>
      </div>

      {/* ---------------- DETAILS GRID ---------------- */}
      <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-8">
        <Detail label="Built-up Area" value={`${property.builtUpArea} sq.ft`} />
        <Detail label="Carpet Area" value={`${property.carpetArea} sq.ft`} />
        <Detail
          label="Floor"
          value={`${property.floorNumber} / ${property.totalFloors}`}
        />
        <Detail label="Facing" value={property.facingDirection} />
        <Detail label="Furnishing" value={property.furnishing} />
        <Detail label="Ownership" value={property.ownershipType} />
        <Detail label="Listing Type" value={property.listingType} />
        <Detail label="Builder" value={property.builderName} />
      </div>

      {/* ---------------- AMENITIES (ENHANCED) ---------------- */}
      {property.amenities?.length > 0 && (
        <div className="mt-16">
          <h2 className="section-title mb-6 ">Amenities</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {property.amenities.map((amenity, index) => (
              <div
                key={index}
                className="flex items-center gap-3 px-5 py-4 rounded-xl bg-white shadow-sm border hover:shadow-md transition"
              >
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-brickred/10 text-brickred font-bold">
                  ✓
                </div>
                <p className="text-lg font-medium text-gray-700">{amenity}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------- SELLER INFO (ENHANCED) ---------------- */}
      <div className="mt-16">
        <h2 className="section-title mb-6">Seller Information</h2>

        <div className="rounded-2xl border bg-gradient-to-br from-gray-50 to-white p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          {/* Left */}
          <div className="flex gap-4 items-center">
            <div className="h-14 w-14 rounded-full bg-brickred text-white flex items-center justify-center text-xl font-bold">
              {property.seller?.sellerName?.charAt(0)}
            </div>

            <div>
              <p className="text-lg font-semibold">
                {property.seller?.sellerName}
              </p>
              <p className="text-md text-gray-600">
                {property.seller?.sellerType}
                {property.seller?.verifiedBadge === "Yes" && (
                  <span className="ml-2 text-green-600 font-medium">
                    ✔ Verified
                  </span>
                )}
              </p>

              {property.seller?.email && (
                <p className="text-md text-gray-500 mt-1">
                  {property.seller.email}
                </p>
              )}
            </div>
          </div>

          {/* Right CTA */}
          <div className="flex gap-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none px-5 py-2.5 rounded-lg bg-brickred text-white font-semibold hover:bg-ochre transition">
              Call Agent
            </button>
            <button className="flex-1 md:flex-none px-5 py-2.5 rounded-lg border border-brickred text-brickred font-semibold hover:bg-brickred hover:text-white transition">
              Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- SMALL COMPONENTS ---------------- */

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-md text-gray-500">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}

function Badge({ children }) {
  return (
    <span className="px-3 py-1 text-md rounded-full bg-gray-100 text-gray-700 font-medium">
      {children}
    </span>
  );
}
