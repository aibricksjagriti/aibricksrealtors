import BookSiteVisitCard from "@/src/Properties/BookSiteVisitCard";
import ContactSidebar from "@/src/Properties/ContactSidebar";
import HeroSection from "@/src/Properties/HeroSection";
import PropertyCard from "@/src/Properties/PropertyCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import FAQSection from "@/src/FAQSection";
import { propertyFaqs } from "@/data/faq";
import { getCachedProperties } from "@/lib/data/properties";

const ITEMS_PER_PAGE = 10;

export const revalidate = 300;

// async function getProperties() {
//   try {
//     // For server-side, construct absolute URL
//     const apiUrl = process.env.NEXT_PUBLIC_API_URL;
//     let url;

//     if (apiUrl) {
//       url = `${apiUrl}/api/v1/properties`;
//     } else {
//       // Fallback: use localhost for development or construct from request
//       // In Next.js server components, we can use relative URLs for internal routes
//       url = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/v1/properties`;
//     }

//     const res = await fetch(url, { cache: "no-store" });

//     if (!res.ok) {
//       throw new Error("API response not OK");
//     }

//     return await res.json();
//   } catch (error) {
//     console.error("Error fetching properties:", error);
//     // This will trigger error.jsx
//     throw new Error("Failed to load properties");
//   }
// }

async function getProperties() {
  try {
    const properties = await getCachedProperties({ activeStatus: "Yes" });
    return { success: true, data: properties };
  } catch (error) {
    console.error("Error fetching properties:", error);
    throw new Error("Failed to load properties");
  }
}

export default async function PageProperties({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams?.page) || 1;
  const cityFilter = resolvedSearchParams?.city?.trim().toLowerCase() || "";
  const propertyTypeFilter =
    resolvedSearchParams?.propertyType?.trim().toLowerCase() || "";
  const developerFilter =
    resolvedSearchParams?.developer?.trim().toLowerCase() ||
    resolvedSearchParams?.builder?.trim().toLowerCase() ||
    "";
  const minPrice = Number(resolvedSearchParams?.minPrice) || null;
  const maxPrice = Number(resolvedSearchParams?.maxPrice) || null;

  const response = await getProperties();
  const properties = (response?.data || []).filter((property) => {
    const propertyCity = property.city?.trim().toLowerCase() || "";
    const propertyType = property.propertyType?.trim().toLowerCase() || "";
    const builderName = property.builderName?.trim().toLowerCase() || "";
    const totalPrice = Number(property.totalPrice) || 0;

    if (cityFilter && propertyCity !== cityFilter) return false;
    if (propertyTypeFilter && propertyType !== propertyTypeFilter) return false;
    if (developerFilter && !builderName.includes(developerFilter)) return false;
    if (minPrice && totalPrice < minPrice) return false;
    if (maxPrice && totalPrice > maxPrice) return false;

    return true;
  });

  const totalPages = Math.ceil(properties.length / ITEMS_PER_PAGE);
  const currentPage = Math.min(page, totalPages || 1);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedProperties = properties.slice(startIndex, endIndex);

  const buildPageHref = (nextPage) => {
    const params = new URLSearchParams();

    Object.entries(resolvedSearchParams || {}).forEach(([key, value]) => {
      if (key === "page" || value == null || value === "") return;
      params.set(key, String(value));
    });

    params.set("page", String(nextPage));

    return `?${params.toString()}`;
  };

  return (
    <div className="bg-background">
      <HeroSection searchBasePath="/search" />

      {/* Heading */}
      <div className="mb-8">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
            <div>
              <h1 className="text-3xl font-semibold text-darkGray">
                Top Projects by AI Bricks Realtors in Pune
              </h1>
              <p className="text-lg text-gray-500 mt-1">
                Buy directly from builders • No brokerage • Verified projects
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
        {/* LEFT LISTINGS */}
        <div className="lg:col-span-8 space-y-4">
          {paginatedProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}

          {/* PREMIUM PAGINATION */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <div className="inline-flex items-center gap-1 rounded-full bg-white px-4 py-2 shadow-md">
                {/* Previous */}
                <Link
                  href={buildPageHref(currentPage - 1)}
                  className={`flex items-center justify-center w-9 h-9 rounded-full transition ${
                    page === 1
                      ? "pointer-events-none text-gray-300"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  aria-label="Previous page"
                >
                  <ChevronLeft />
                </Link>

                {/* Page Numbers */}
                {Array.from({ length: totalPages })
                  .map((_, i) => i + 1)
                  .filter(
                    (p) =>
                      p === 1 || p === totalPages || Math.abs(p - page) <= 1,
                  )
                  .map((p, index, arr) => (
                    <Link
                      key={p}
                      href={buildPageHref(p)}
                      className={`flex items-center justify-center w-9 h-9 rounded-full text-sm font-medium transition ${
                        page === p
                          ? "bg-brickred text-white shadow"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {p}
                    </Link>
                  ))}

                {/* Next */}
                <Link
                  href={buildPageHref(currentPage + 1)}
                  className={`flex items-center justify-center w-9 h-9 rounded-full transition ${
                    page === totalPages
                      ? "pointer-events-none text-gray-300"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  aria-label="Next page"
                >
                  <ChevronRight />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="hidden lg:block lg:col-span-4 mb-10">
          <div className="sticky top-24 space-y-6">
            <ContactSidebar />
            <BookSiteVisitCard />
          </div>
        </div>
      </div>
      <FAQSection title="Frequently Asked Questions" faqs={propertyFaqs} />
    </div>
  );
}
