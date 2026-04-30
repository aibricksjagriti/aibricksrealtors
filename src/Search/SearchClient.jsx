"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { CarFront } from "lucide-react";
import Link from "next/link";
import BookSiteVisitModal from "../Properties/BookSiteVisitModal";
import ContactSidebar from "../Properties/ContactSidebar";
import BookSiteVisitCard from "../Properties/BookSiteVisitCard";
import LeadCaptureModal from "../LeadCapture/LeadCaptureModal";
import Image from "next/image";

export default function SearchClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  /* ✅ UI STATE */
  const [readMore, setReadMore] = useState(false);
  const [openTour, setOpenTour] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showDeveloperLead, setShowDeveloperLead] = useState(false);
  const [filters, setFilters] = useState(() => ({
    city: searchParams.get("city") || "",
    propertyType: searchParams.get("propertyType") || "",
    developer:
      searchParams.get("developer") || searchParams.get("builder") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
  }));

  /* -------------------- SEARCH PARAMS -------------------- */
  const city = searchParams.get("city");
  const propertyType = searchParams.get("propertyType");
  const developerName =
    searchParams.get("developer") || searchParams.get("builder") || "";
  const listingType = searchParams.get("listingType");

  const developerLeadPrefix = useMemo(() => {
    const parts = ["[Developer category — Get Details]"];
    if (developerName) parts.push(`Developer: ${developerName}`);
    if (city) parts.push(`City: ${city}`);
    if (propertyType) parts.push(`Property type: ${propertyType}`);
    return parts.join(" | ");
  }, [developerName, city, propertyType]);

  const developerInterestedContext = useMemo(
    () =>
      developerName
        ? {
            propertyId: null,
            propertyTitle: `Developer: ${developerName}`,
            propertyName: `Developer: ${developerName}`,
            propertyLocation: city || null,
          }
        : {
            propertyId: null,
            propertyTitle: null,
            propertyName: null,
            propertyLocation: null,
          },
    [developerName, city],
  );

  useEffect(() => {
    setFilters({
      city: searchParams.get("city") || "",
      propertyType: searchParams.get("propertyType") || "",
      developer:
        searchParams.get("developer") || searchParams.get("builder") || "",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
    });
  }, [searchParams]);

  /* -------------------- DYNAMIC TITLE & DESCRIPTION -------------------- */
  const { title, description } = useMemo(() => {
    let titleText = "Properties Available";
    let descText = "Explore the best real estate options matching your search.";

    if (developerName && city) {
      titleText = `Top Projects by ${developerName} in ${city}`;
      descText = `Explore premium residential projects by ${developerName} in ${city}. Discover thoughtfully designed homes with world-class amenities and excellent connectivity.`;
    } else if (developerName) {
      titleText = `Projects by ${developerName}`;
      descText = `Browse verified listings from ${developerName}. Compare floor plans, pricing, and availability across locations.`;
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
  }, [city, propertyType, developerName, listingType]);

  /* -------------------- TANSTACK QUERY -------------------- */
  const { data: properties = [], isLoading: loading, isError: error } = useQuery({
    queryKey: ["properties", searchParams.toString()],
    queryFn: async () => {
      const res = await fetch(
        `/api/v1/properties/search?${searchParams.toString()}`,
      );
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      return data?.data || [];
    },
  });

  const openDeveloperLead = useCallback(() => setShowDeveloperLead(true), []);

  const clearFilters = useCallback(() => {
    setFilters({
      city: "",
      propertyType: "",
      developer: "",
      minPrice: "",
      maxPrice: "",
    });
    router.replace("/search");
  }, [router]);

  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.city) params.set("city", filters.city);
    if (filters.propertyType) params.set("propertyType", filters.propertyType);
    if (filters.developer) params.set("developer", filters.developer);
    if (filters.minPrice) params.set("minPrice", filters.minPrice);
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);

    const nextQueryString = params.toString();
    const currentQueryString = searchParams.toString();

    if (nextQueryString === currentQueryString) return;

    router.replace(nextQueryString ? `/search?${nextQueryString}` : "/search");
  }, [filters, router, searchParams]);

  const filterPanel = (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-darkgray">Refine results</p>
            <p className="text-xs text-gray-500">Filters apply as soon as you change them.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <select
          value={filters.city}
          onChange={(e) => setFilters((current) => ({ ...current, city: e.target.value }))}
          className="input"
        >
          <option value="">All Cities</option>
          <option value="Mumbai">Mumbai</option>
          <option value="Pune">Pune</option>
          <option value="Dubai">Dubai</option>
        </select>

        <select
          value={filters.propertyType}
          onChange={(e) => setFilters((current) => ({ ...current, propertyType: e.target.value }))}
          className="input"
        >
          <option value="">All Types</option>
          <option value="Apartment">Apartment</option>
          <option value="Villa">Villa</option>
          <option value="Penthouse">Penthouse</option>
          <option value="Commercial">Commercial</option>
          <option value="Plot">Plot</option>
        </select>

        <select
          value={filters.developer}
          onChange={(e) => setFilters((current) => ({ ...current, developer: e.target.value }))}
          className="input"
        >
          <option value="">All Developers</option>
          <option value="Shapoorji">Shapoorji</option>
          <option value="Krisala Developers">Krisala Developers</option>
          <option value="Hiranandani Developers">Hiranandani Developers</option>
          <option value="Gera Developers">Gera Developers</option>
          <option value="Kolte Patil Developers">Kolte Patil Developers</option>
          <option value="Lodha Developers">Lodha Developers</option>
          <option value="Godrej Developers">Godrej Developers</option>
          <option value="Kohinoor Developers">Kohinoor Developers</option>
          <option value="VTP Developers">VTP Developers</option>
        </select>

        <select
          value={filters.minPrice}
          onChange={(e) => {
            const [min, max] = e.target.value.split("-");
            setFilters((current) => ({
              ...current,
              minPrice: min || "",
              maxPrice: max || "",
            }));
          }}
          className="input"
        >
          <option value="">Any Price</option>
          <option value="0-5000000">Under ₹50 Lakhs</option>
          <option value="5000000-10000000">₹50 Lakhs - ₹1 Crore</option>
          <option value="10000000-15000000">₹1 - 1.5 Crores</option>
          <option value="15000000-25000000">₹1.5 - 2.5 Crores</option>
          <option value="25000000-40000000">₹2.5 - 4 Crores</option>
          <option value="40000000-">Above ₹4 Crores</option>
        </select>

        <button
          type="button"
          onClick={clearFilters}
          className="rounded-xl border border-gray-300 px-5 py-3 font-semibold text-darkgray transition hover:bg-gray-50"
        >
          Clear
        </button>
      </div>
    </div>
  );
  const backLink = (
    <div className="mb-4 flex items-center justify-between gap-3">
      <Link
        href="/properties"
        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-darkgray hover:bg-gray-50"
      >
        Back to Properties
      </Link>
    </div>
  );

  /* -------------------- STATES -------------------- */

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        {backLink}
        {filterPanel}
        {developerName ? (
          <DeveloperCategoryHero
            developerName={developerName}
            city={city}
            onGetDetails={openDeveloperLead}
          />
        ) : null}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white border rounded-xl shadow-sm p-5 space-y-4">
              <div className="h-6 w-2/3 rounded-full bg-gray-200 animate-pulse" />
              <div className="h-4 w-full rounded-full bg-gray-200 animate-pulse" />
              <div className="h-4 w-5/6 rounded-full bg-gray-200 animate-pulse" />
            </div>

            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="bg-white border rounded-xl p-4 flex flex-col md:flex-row gap-4 shadow-sm"
              >
                <div
                  className="relative w-full rounded-lg overflow-hidden bg-gray-200 animate-pulse"
                  style={{ width: 260, height: 180 }}
                />
                <div className="flex-1 space-y-4">
                  <div className="h-6 w-3/4 rounded-full bg-gray-200 animate-pulse" />
                  <div className="h-4 w-1/3 rounded-full bg-gray-200 animate-pulse" />
                  <div className="h-4 w-full rounded-full bg-gray-200 animate-pulse" />
                  <div className="h-4 w-5/6 rounded-full bg-gray-200 animate-pulse" />
                  <div className="h-10 w-36 rounded-lg bg-gray-200 animate-pulse" />
                </div>
              </div>
            ))}
          </div>

          <div className="hidden lg:block lg:col-span-4">
            <div className="sticky top-28 space-y-6">
              <div className="h-64 rounded-2xl bg-gray-200 animate-pulse" />
              <div className="h-80 rounded-2xl bg-gray-200 animate-pulse" />
            </div>
          </div>
        </div>
        <LeadCaptureModal
          {...developerInterestedContext}
          open={showDeveloperLead}
          onClose={() => setShowDeveloperLead(false)}
          title="Get project details"
          subtitle="Share your details and our team will reach out with inventory, pricing, and offers."
          messagePrefix={developerLeadPrefix}
          submitLabel="Submit enquiry"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        {backLink}
        {filterPanel}
        {developerName ? (
          <DeveloperCategoryHero
            developerName={developerName}
            city={city}
            onGetDetails={openDeveloperLead}
          />
        ) : null}
        <div className="min-h-[40vh] flex items-center justify-center text-red-500">
          Something went wrong. Please try again.
        </div>
        <LeadCaptureModal
          {...developerInterestedContext}
          open={showDeveloperLead}
          onClose={() => setShowDeveloperLead(false)}
          title="Get project details"
          subtitle="Share your details and our team will reach out."
          messagePrefix={developerLeadPrefix}
          submitLabel="Submit enquiry"
        />
      </div>
    );
  }

  if (!properties.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        {backLink}
        {filterPanel}
        {developerName ? (
          <DeveloperCategoryHero
            developerName={developerName}
            city={city}
            onGetDetails={openDeveloperLead}
          />
        ) : null}
        <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-6">
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
        <LeadCaptureModal
          {...developerInterestedContext}
          open={showDeveloperLead}
          onClose={() => setShowDeveloperLead(false)}
          title="Get project details"
          subtitle="Share your details and our team will reach out."
          messagePrefix={developerLeadPrefix}
          submitLabel="Submit enquiry"
        />
      </div>
    );
  }

  /* -------------------- RESULTS -------------------- */

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-12">{backLink}</div>
      <div className="lg:col-span-12">{filterPanel}</div>
      {/*  SEARCH LANDING MESSAGE */}
      <div className="lg:col-span-8 space-y-4 mt-">
        {developerName ? (
          <DeveloperCategoryHero
            developerName={developerName}
            city={city}
            onGetDetails={openDeveloperLead}
          />
        ) : null}
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
            className="bg-white border rounded-xl p-4 flex flex-col md:flex-row gap-4 hover:shadow-lg transition cursor-pointer"
          >
            {/* IMAGE */}
            {/* <div className="w-full md:w-56 h-40 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
              Image Coming Soon
            </div> */}
            <div
              className="relative w-full rounded-lg overflow-hidden bg-gray-200"
              style={{ width: 260, height: 180 }}
            >
              <Image
                src={
                  item.mainPropertyImage ||
                  item.imageGallery?.[0] ||
                  "/home/upcoming/sobha-kharadi.webp"
                }
                alt={item.propertyTitle}
                fill
                className="object-cover"
              />
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

              <h3 className="font-semibold text-lg mb-1">
                {item.propertyTitle}
              </h3>

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
                {item.totalPrice < 10000000
                  ? `₹ ${(item.totalPrice / 100000).toFixed(0)} Lakhs`
                  : `₹ ${(item.totalPrice / 10000000).toFixed(2)} Cr`}
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
      <div className="hidden lg:block lg:col-span-4">
        <div className="sticky top-28 space-y-6">
          <ContactSidebar />
          <BookSiteVisitCard />
        </div>
      </div>

      {/* MOBILE SIDEBAR */}
      {/* <div className="lg:hidden col-span-1 space-y-6 mt-6">
        <ContactSidebar />
        <BookSiteVisitCard />
      </div> */}

      <LeadCaptureModal
        {...developerInterestedContext}
        open={showDeveloperLead}
        onClose={() => setShowDeveloperLead(false)}
        title="Get project details"
        subtitle="Enter your details and we will share brochures, payment plans, and availability."
        messagePrefix={developerLeadPrefix}
        submitLabel="Submit enquiry"
      />
    </div>
  );
}

function DeveloperCategoryHero({ developerName, city, onGetDetails }) {
  return (
    <div
      className="rounded-2xl overflow-hidden border border-gray-200 shadow-md text-white"
      style={{ background: "linear-gradient(to right, #1a2b4a, #243a5c, #8D0B41)" }}
    >
      <div className="px-6 py-8 md:px-10 md:py-10 md:flex md:items-center md:justify-between gap-6">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/75 mb-2">
            Developer
          </p>
          <h2 className="text-2xl md:text-3xl font-bold leading-tight">{developerName}</h2>
          {city ? <p className="mt-2 text-base text-white/90">{city}</p> : null}
          <p className="mt-4 text-sm text-white/85 leading-relaxed">
            Request inventory, pricing, floor plans, and payment options. Our team will contact you with tailored project details.
          </p>
        </div>
        <button
          type="button"
          onClick={onGetDetails}
          className="mt-6 md:mt-0 shrink-0 bg-white text-brickred font-semibold px-8 py-3 rounded-xl shadow-md hover:bg-gray-100 transition w-full md:w-auto"
        >
          Get Details
        </button>
      </div>
    </div>
  );
}
