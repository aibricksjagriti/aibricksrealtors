"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CarFront } from "lucide-react";
import BookSiteVisitModal from "../Properties/BookSiteVisitModal";

export default function SearchClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [readMore, setReadMore] = useState(false);
  const [openTour, setOpenTour] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  /* -------------------- SEARCH PARAMS -------------------- */
  const city = searchParams.get("city");
  const propertyType = searchParams.get("propertyType");
  const builder = searchParams.get("builder");
  const listingType = searchParams.get("listingType");

  /* -------------------- DYNAMIC TITLE & DESCRIPTION -------------------- */
  const { title, description } = useMemo(() => {
    let titleText = "Properties Available";
    let descText = "Explore the best real estate options matching your search.";

    if (builder && city) {
      titleText = `Top Projects by ${builder} in ${city}`;
      descText = `Explore premium residential projects by ${builder} in ${city}. Discover thoughtfully designed homes with world-class amenities and excellent connectivity.`;
    } else if (propertyType && city) {
      titleText = `${propertyType}s for Sale in ${city}`;
      descText = `Browse a wide range of ${propertyType.toLowerCase()}s available in ${city}. Compare prices, locations, amenities, and find the perfect home that suits your lifestyle.`;
    } else if (city) {
      titleText = `Properties for Sale in ${city}`;
      descText = `Find the best residential and commercial properties for sale in ${city}. Explore verified listings with detailed pricing and project information.`;
    } else if (propertyType) {
      titleText = `${propertyType}s Available`;
      descText = `Explore a curated list of ${propertyType.toLowerCase()}s across prime locations. Compare projects, prices, and amenities effortlessly.`;
    }

    return { title: titleText, description: descText };
  }, [city, propertyType, builder, listingType]);

  /* -------------------- API CALL -------------------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(false);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || ""}/api/v1/properties/search?${searchParams.toString()}`,
        );

        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();
        setProperties(data?.data || []);
      } catch (err) {
        console.error("Search API error:", err);
        setError(true);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);

  /* -------------------- STATES -------------------- */

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-500">
        Loading properties...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-red-500">
        Something went wrong. Please try again.
      </div>
    );
  }

  if (!properties.length) {
    return (
      <div className="min-h-[110vh] flex flex-col items-center justify-center text-center px-6 mt-10">
        <h2 className="text-3xl font-semibold text-gray-800 mb-2">
          No properties match your search
        </h2>
        <p className="text-gray-500 max-w-md mb-6 text-lg">
          Try adjusting your filters or searching with different keywords.
        </p>
        <button
          onClick={() => router.push("/")}
          className="px-6 py-3 rounded-lg bg-brickred text-white font-semibold hover:bg-ochre transition text-lg cursor-pointer"
        >
          Back to Search
        </button>
      </div>
    );
  }

  /* -------------------- RESULTS -------------------- */

  return (
    <div className="max-w-7xl mx-auto px-4 py-24 space-y-6">
      {/*  SEARCH LANDING MESSAGE */}
      <div className="bg-white border rounded-xl shadow-sm p-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
            {title}
          </h1>
        </div>

        <p className="text-sm text-gray-600 mt-3 leading-relaxed">
          {description}
          {readMore && (
            <>
              {" "}
              Compare verified listings, explore floor plans, check pricing
              trends, and connect with trusted developers to make an informed
              property decision.
            </>
          )}
          <button
            onClick={() => setReadMore(!readMore)}
            className="ml-1 text-green-600 font-medium"
          >
            {readMore ? "Read Less" : "Read More"}
          </button>
        </p>
      </div>

      {/*  PROPERTY LIST */}
      {properties.map((item) => (
        <div
          key={item.id}
          className="bg-white border rounded-xl p-4 flex flex-col md:flex-row gap-4 hover:shadow-lg transition"
        >
          {/* IMAGE */}
          <div className="w-full md:w-56 h-40 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
            Image Coming Soon
          </div>

          {/* DETAILS */}
          <div className="flex-1">
            <div className="flex gap-2 mb-1">
              {item.featuredListing === "Yes" && (
                <span className="text-xs bg-brickred text-white px-2 py-1 rounded">
                  Featured
                </span>
              )}
              {item.premiumListing === "Yes" && (
                <span className="text-xs bg-ochre text-white px-2 py-1 rounded">
                  Premium
                </span>
              )}
            </div>

            <h3 className="font-semibold text-lg mb-1">{item.propertyTitle}</h3>

            <p className="text-sm text-gray-600 mb-1">
              {item.locality}, {item.city}
            </p>

            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-2">
              <span>{item.propertyType}</span>
              <span>{item.subType}</span>
              <span>{item.listingType}</span>
            </div>

            <div className="flex flex-wrap gap-6 text-sm text-gray-600 mb-2">
              <span>{item.builtUpArea} sq.ft</span>
              <span>{item.carpetArea} sq.ft</span>
              <span>{item.propertyStatus}</span>
            </div>

            <p className="text-sm text-gray-600 mb-2">
              Builder: <span className="font-medium">{item.builderName}</span>
            </p>

            {item.amenities?.length > 0 && (
              <p className="text-sm text-gray-500">
                Amenities: {item.amenities.slice(0, 3).join(" • ")}
              </p>
            )}
          </div>

          {/* ACTIONS */}
          <div className="md:w-52 flex flex-col justify-between">
            <p className="text-xl font-semibold text-brickred text-right mb-4">
              ₹ {(item.totalPrice / 10000000).toFixed(2)} Cr
            </p>

            <div className="flex md:flex-col gap-2 ">
              <button
                onClick={() => router.push(`/properties/${item.id}`)}
                className="w-full border border-brickred text-brickred rounded-lg py-2 text-md font-semibold hover:bg-brickred hover:text-white transition"
              >
                View Details
              </button>

              <button
                onClick={() => {
                  setSelectedProperty(item);
                  setOpenTour(true);
                }}
                className="flex items-center justify-center gap-1 border bg-ochre border-gray-300 px-4 py-2 rounded-lg text-lg hover:bg-brickred text-lightcream transition"
              >
                <CarFront /> Tour
              </button>

              <BookSiteVisitModal
                isOpen={openTour}
                onClose={() => setOpenTour(false)}
                property={selectedProperty}
              />

              {/* <button className="w-full bg-brickred text-white rounded-lg py-2 text-sm font-medium hover:bg-green-700">
                Live Chat
              </button> */}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
