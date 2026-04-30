"use client";

import { useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  MapPin,
  IndianRupee,
  Home,
  Waves,
  Trees,
  Dumbbell,
  ShieldCheck,
  Building2,
  Users,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import ContactSidebar from "@/src/Properties/ContactSidebar";
import BookSiteVisitCard from "@/src/Properties/BookSiteVisitCard";
import SellerContactActions from "@/src/Properties/SellerContactActions";
import LoginModal from "@/src/Auth/LoginModal";
import LeadCaptureModal from "@/src/LeadCapture/LeadCaptureModal";
import { downloadGalleryImages } from "@/src/utils/downloadGalleryImages";
import { PropertyDetailSkeleton } from "@/src/skeletons/PropertyDetailSkeleton";
import { LocationMapWithLoading } from "@/src/skeletons/LocationMapWithLoading";
import toast from "react-hot-toast";

/* ================= UTIL ================= */

// const formatPrice = (price) =>
//   price ? `₹ ${(price / 10000000).toFixed(2)} Cr` : "Price on request";
const formatPrice = (price) => {
  if (!price || isNaN(price)) return "Price on request";

  if (price < 10000000) {
    // Below 1 Cr → Lakhs
    return ` ${(price / 100000).toFixed(0)} Lakhs`;
  } else {
    // 1 Cr and above → Crores
    return ` ${(price / 10000000).toFixed(2)} Cr`;
  }
};

/* ================= PAGE ================= */

export default function PropertyDetailPage() {
  const { id } = useParams();

  /* ✅ FETCH MAIN PROPERTY */
  const {
    data: property,
    isLoading: loading,
    isError: propertyError,
  } = useQuery({
    queryKey: ["property", id],
    queryFn: async () => {
      const res = await fetch(`/api/v1/properties/${id}`);
      if (!res.ok) throw new Error("Failed to fetch property");
      const data = await res.json();
      return data?.data || null;
    },
    enabled: !!id,
  });

  if (loading) return <PropertyDetailSkeleton />;
  if (!property) return <CenterMsg msg="Property not found" />;

  return (
    <div className="bg-[#f4f6f9]">
      <div className="max-w-7xl mx-auto px-4 pt-28 pb-16">
        {/* ================= TITLE ROW ================= */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-6">
          <div>
            <h1 className="text-3xl font-bold">{property.propertyTitle}</h1>

            <div className="flex flex-wrap items-center gap-3 text-gray-600 mt-2">
              <span className="flex items-center gap-1">
                <MapPin size={16} />
                {property.locality}, {property.city}
              </span>

              <Badge text={property.propertyStatus} color="green" />
              <Badge text={property.propertyType} color="blue" />
              <Badge text={property.listingType} color="purple" />
            </div>
          </div>

          <div className="bg-white border rounded-xl px-6 py-4 shadow-sm text-right">
            <p className="text-gray-500 text-sm">Starting Price</p>
            <p className="text-3xl font-bold text-brickred flex items-center gap-1 justify-end">
              <IndianRupee size={24} />
              {formatPrice(property.totalPrice)}
            </p>
          </div>
        </div>

        {/* ================= MAIN GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ================= LEFT CONTENT ================= */}
          <div className="lg:col-span-2 space-y-10">
            <HeroGallery property={property} />
            <HighlightStrip property={property} />
            <div id="overview">
              <OverviewCard property={property} />
            </div>
            <div id="location">
              <LocationMapWithLoading property={property} />
            </div>
            <VideoSection />
            {/* <ProsCons /> */}
            <div id="amenities">
              <AmenitiesGrid amenities={property.amenities} />
            </div>
            <MasterPlan property={property} />
            <div id="pricing">
              <PricingCard property={property} />
            </div>
            <LegalDetails property={property} />
            <DocumentsSection property={property} />
            {/* <QRSection /> */}
            <BuilderSection property={property} />
            <div id="gallery">
              <GallerySlider property={property} />
            </div>
            <div id="faq">
              <FAQSection />
            </div>
          </div>

          {/* ================= SIDEBAR ================= */}
          <div className="lg:sticky lg:top-28 h-fit">
            <div className="space-y-4">
              <ContactSidebar property={property} />
              <BookSiteVisitCard property={property} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= HERO GALLERY ================= */

// function HeroGallery({ property }) {
//   return (
//     <div className="bg-white border rounded-xl p-3">
//       <div className="grid grid-cols-2 gap-3 h-auto">
//         <div className="row-span-2 bg-gray-200 rounded-lg flex items-center justify-center">
//           {property.mainPropertyImage ? (
//             <img
//               src={property.mainPropertyImage}
//               className="w-full h-full object-cover rounded-lg"
//             />
//           ) : (
//             "No Image"
//           )}
//         </div>

//         <GalleryItem src={property.imageGallery?.[0]} />
//         <GalleryItem src={property.imageGallery?.[1]} />
//       </div>
//     </div>
//   );
// }

function HeroGallery({ property }) {
  const hasImage = !!property.mainPropertyImage;

  return (
    <div className="bg-white border rounded-xl p-3">
      <div className="grid grid-cols-2 gap-3">
        {/* LEFT BIG IMAGE */}
        <div
            className="row-span-2 bg-gray-200 rounded-lg flex items-center justify-center"
            style={!hasImage ? { height: 420 } : undefined}
        >
          {hasImage ? (
            <img
              src={property.mainPropertyImage}
              className="w-full h-auto object-cover rounded-lg"
            />
          ) : (
            <span className="text-gray-500">No Image Available</span>
          )}
        </div>

        {/* RIGHT SIDE IMAGES */}
        <GalleryItem src={property.imageGallery?.[0]} />
        <GalleryItem src={property.imageGallery?.[1]} />
      </div>
    </div>
  );
}

/* ================= INFO STRIP ================= */

function HighlightStrip({ property }) {
  const items = [
    ["Built-up", `${property.builtUpArea} sq.ft`],
    ["Carpet", `${property.carpetArea} sq.ft`],
    ["Facing", property.facingDirection],
    ["Furnishing", property.furnishing],
    ["Ownership", property.ownershipType],
  ];

  return (
    <div className="bg-white border rounded-xl p-5 grid grid-cols-2 md:grid-cols-5 text-center">
      {items.map(([label, value], i) => (
        <div key={i}>
          <p className="text-gray-500 text-sm">{label}</p>
          <p className="font-semibold">{value}</p>
        </div>
      ))}
    </div>
  );
}

/* ================= OVERVIEW ================= */

function OverviewCard({ property }) {
  const items = [
    ["Builder", property.builderName],
    ["Project", property.projectName],
    ["City", property.city],
    ["State", property.state],
    ["Country", property.country],
    ["Landmark", property.landmark],
    ["Total Floors", property.totalFloors],
    ["Floor Number", property.floorNumber],
  ];

  return (
    <Card title="Overview">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map(([label, value], i) => (
          <Detail key={i} label={label} value={value} />
        ))}
      </div>
    </Card>
  );
}

/* ================= LOCATION ================= */

/* ================= VIDEO ================= */

function VideoSection() {
  return (
    <Card title="Project Video">
      <div className="h-80 bg-gray-100 rounded-lg flex items-center justify-center">
        Video player here
      </div>
    </Card>
  );
}

/* ================= PROS CONS ================= */

// function ProsCons() {
//   return (
//     <Card title="Pros & Cons">
//       <div className="space-y-3">
//         <Accordion title="Pros" />
//         <Accordion title="Cons" />
//       </div>
//     </Card>
//   );
// }

/* ================= AMENITIES ================= */

function AmenitiesGrid({ amenities = [] }) {
  return (
    <Card title="Amenities">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {amenities.map((a, i) => (
          <div key={i} className="border rounded-lg p-4 text-center bg-white">
            <div className="h-10 w-10 mx-auto flex items-center justify-center bg-brickred/10 text-brickred rounded-full">
              <Home size={20} />
            </div>
            <p className="text-sm mt-2">{a}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ================= MASTER PLAN ================= */

function MasterPlan({ property }) {
  const floorPlans = Array.isArray(property?.floorPlans)
    ? property.floorPlans
    : Array.isArray(property?.floorPlanImages)
      ? property.floorPlanImages.map((image, idx) => ({
          name: `Floor Plan ${idx + 1}`,
          image,
          carpetArea: "-",
          price: "-",
        }))
      : [];
  const [selectedFloorPlan, setSelectedFloorPlan] = useState(null);
  const [showPriceBreakupLead, setShowPriceBreakupLead] = useState(false);
  const [priceBreakupPlan, setPriceBreakupPlan] = useState(null);
  const formatPlanPrice = (price) => {
    const numericPrice = Number(price);
    if (!Number.isFinite(numericPrice) || numericPrice <= 0)
      return "Price on request";
    return formatPrice(numericPrice);
  };

  return (
    <>
    <Card title="Master & Floor Plan">
      {floorPlans.length === 0 ? (
        <div className="text-gray-500">Floor Plan Not Available</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {floorPlans.map((plan, idx) => (
            <div
              key={`${plan.image}-${idx}`}
              className="rounded-xl border border-gray-300 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="px-3 py-2 border-b border-gray-200">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {plan.name || `${idx + 1} BHK`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedFloorPlan(plan)}
                className="w-full px-3 pt-3 text-left"
              >
                <div className="h-36 bg-gray-100 rounded border overflow-hidden">
                  {plan.image ? (
                    <img
                      src={plan.image}
                      alt={plan.name || `Floor Plan ${idx + 1}`}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
              </button>
              <div className="px-3 pb-3 pt-2">
                <p className="text-xs text-gray-500">
                  Carpet Area:{" "}
                  {plan.carpetArea ? `${plan.carpetArea} sq ft` : "-"}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatPlanPrice(plan.price)}
                </p>
                <button
                  type="button"
                  onClick={() => { setPriceBreakupPlan(plan); setShowPriceBreakupLead(true); }}
                  className="mt-3 w-full bg-[#0f2f5f] hover:bg-[#123a73] text-white text-sm font-medium py-2 rounded-md"
                >
                  Price Breakup
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {selectedFloorPlan && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-xl p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              {selectedFloorPlan.name || "Floor Plan"}
            </h3>
            <img
              src={selectedFloorPlan.image}
              alt={selectedFloorPlan.name || "Floor Plan"}
              className="w-full max-h-80 object-contain rounded border mb-4"
            />
            <div className="grid grid-cols-2 gap-4 text-sm">
              <Detail
                label="Carpet Area"
                value={`${selectedFloorPlan.carpetArea || "-"} sq ft`}
              />
              <Detail
                label="Price"
                value={formatPlanPrice(selectedFloorPlan.price)}
              />
            </div>
            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={() => setSelectedFloorPlan(null)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </Card>

    <LeadCaptureModal
      open={showPriceBreakupLead}
      onClose={() => { setShowPriceBreakupLead(false); setPriceBreakupPlan(null); }}
      title="Get Price Breakup"
      subtitle={priceBreakupPlan ? `Request detailed price breakdown for ${priceBreakupPlan.name || "this unit"}` : "Fill in your details to receive the full price breakdown."}
      messagePrefix={`[Price Breakup Request] Property: ${property?.propertyTitle || ""} | Unit: ${priceBreakupPlan?.name || ""}`}
      submitLabel="Get Price Breakup"
      propertyId={property?.id ?? null}
      propertyTitle={property?.propertyTitle || property?.title || null}
      propertyName={property?.propertyTitle || property?.title || null}
      propertyLocation={[property?.locality, property?.city].filter(Boolean).join(", ") || null}
    />
    </>
  );
}

/* ================= PRICING ================= */

function PricingCard({ property }) {
  return (
    <Card title="Pricing">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Detail label="Total Price" value={formatPrice(property.totalPrice)} />
        <Detail
          label="Price / Sq.ft"
          value={`₹ ${property.pricePerSquareFoot}`}
        />
        <Detail label="Type" value={property.subType} />
        <Detail label="Listing Type" value={property.listingType} />
      </div>
    </Card>
  );
}

/* ================= LEGAL ================= */

function LegalDetails({ property }) {
  const items = [
    ["Ownership", property.ownershipType],
    ["Property Status", property.propertyStatus],
    ["Furnishing", property.furnishing],
    ["Facing", property.facingDirection],
  ];

  return (
    <Card title="Legal Details">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map(([l, v], i) => (
          <Detail key={i} label={l} value={v} />
        ))}
      </div>
    </Card>
  );
}

/* ================= DOCUMENTS ================= */

function DocumentsSection({ property }) {
  const brochures = property?.brochures || [];
  const [showLogin, setShowLogin] = useState(false);

  const isLoggedIn = () => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("token");
  };

  const handleDownload = (url, name) => {
    if (!isLoggedIn()) {
      setShowLogin(true);
      return;
    }

    if (!url) {
      toast.error("Document not available");
      return;
    }

    if (url) {
      window.open(url, "_blank");
      return;
    }

    const link = document.createElement("a");
    link.href = url;
    link.download = name || "Property_Brochure";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Card title="Documents">
        {brochures.length === 0 ? (
          <p className="text-gray-600">No documents available</p>
        ) : (
          <div className="space-y-3">
            {brochures.map((doc, i) => (
              <div
                key={i}
                className="flex items-center justify-between border rounded-lg p-3"
              >
                <p className="text-sm font-medium">{doc.name}</p>

                <button
                  onClick={() => handleDownload(doc.url, doc.name)}
                  className="bg-brickred text-white px-4 py-2 rounded-lg text-sm"
                >
                  Download
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* LOGIN MODAL */}
      <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
}

/* ================= GALLERY SLIDER ================= */

function GallerySlider({ property }) {
  const galleryImages = [
    property?.mainPropertyImage,
    ...(Array.isArray(property?.imageGallery) ? property.imageGallery : []),
  ].filter(Boolean);

  const [activeImage, setActiveImage] = useState(null);
  const [showDownloadLead, setShowDownloadLead] = useState(false);
  const scrollContainer = useRef(null);

  const galleryDownloadSlug =
    (property?.propertyTitle || property?.title || property?.id || "property")
      .toString()
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "gallery";

  const galleryLeadPrefix = `[Gallery download] Property: ${property?.propertyTitle || property?.title || "Listing"} (id: ${property?.id || "unknown"})`;

  const slideBy = (direction) => {
    if (!scrollContainer.current) return;
    const cardWidth = 260;
    scrollContainer.current.scrollBy({
      left: direction * cardWidth,
      behavior: "smooth",
    });
  };

  if (galleryImages.length === 0) {
    return (
      <Card title="Gallery">
        <p className="text-gray-500">No gallery images available</p>
      </Card>
    );
  }

  return (
    <>
      <Card title="Gallery">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <p className="text-sm text-gray-600">Swipe or use arrows to browse images.</p>
          <button
            type="button"
            onClick={() => setShowDownloadLead(true)}
            className="shrink-0 inline-flex items-center justify-center rounded-lg bg-brickred px-4 py-2 text-sm font-semibold text-white hover:bg-ochre transition"
          >
            Download Gallery
          </button>
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={() => slideBy(-1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white border border-gray-200 shadow flex items-center justify-center hover:bg-gray-50"
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} />
          </button>

          <div
            ref={scrollContainer}
            className="overflow-x-auto scroll-smooth hide-scrollbar px-12"
          >
            <div className="flex gap-4 w-max">
              {galleryImages.map((image, index) => (
                <button
                  type="button"
                  key={`${image}-${index}`}
                  onClick={() => setActiveImage(image)}
                  className="w-60 h-42.5 shrink-0 rounded-xl overflow-hidden border border-gray-200 bg-gray-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  <img
                    src={image}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => slideBy(1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white border border-gray-200 shadow flex items-center justify-center hover:bg-gray-50"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </Card>

      <LeadCaptureModal
        open={showDownloadLead}
        onClose={() => setShowDownloadLead(false)}
        title="Download property gallery"
        subtitle="Submit the interested form to download the gallery images."
        messagePrefix={galleryLeadPrefix}
        submitLabel="Submit & download"
        propertyId={property?.id ?? null}
        propertyTitle={property?.propertyTitle || property?.title || null}
        propertyName={property?.propertyTitle || property?.title || null}
        propertyLocation={
          [property?.locality, property?.city].filter(Boolean).join(", ") || null
        }
        onSuccess={() => {
          downloadGalleryImages(galleryImages, galleryDownloadSlug);
        }}
      />

      {activeImage && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl p-4">
            <img
              src={activeImage}
              alt="Gallery preview"
              className="w-full max-h-[75vh] object-contain rounded-lg border"
            />
            <div className="flex justify-end mt-3">
              <button
                type="button"
                onClick={() => setActiveImage(null)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ================= QR ================= */

// function QRSection() {
//   return (
//     <Card title="QR Code">
//       <div className="h-32 w-32 bg-gray-200 rounded-lg" />
//     </Card>
//   );
// }

/* ================= BUILDER ================= */

/* ================= BUILDER ================= */

function BuilderSection({ property }) {
  return (
    <Card title="About Builder">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-semibold">{property.sellerName}</p>
          <p className="text-gray-500 text-sm">Project Developer</p>
        </div>

        <SellerContactActions
          phone={property.phoneNumber}
          email={property.email}
          propertyTitle={property.propertyTitle}
        />
      </div>
    </Card>
  );
}

/* ================= FAQ ================= */

function FAQSection() {
  const faqs = [
    {
      q: "What is the possession timeline for this property?",
      a: "Possession depends on construction status. Ready-to-move properties are available immediately, while under-construction projects follow the RERA possession schedule. Contact our team for the latest timeline.",
    },
    {
      q: "Is home loan assistance available?",
      a: "Yes. Most properties are approved by leading banks and financial institutions. We assist buyers in securing home loans with competitive interest rates and quick processing.",
    },
    {
      q: "Are there additional charges beyond the listed price?",
      a: "The listed price usually covers the base cost. Additional charges may include registration, stamp duty, GST (if applicable), maintenance deposit, parking, and clubhouse fees.",
    },
    {
      q: "Can I schedule a site visit before booking?",
      a: "Absolutely. We encourage site visits so buyers can evaluate the property, amenities, and surroundings. Our team can arrange a guided visit at your convenience.",
    },
    {
      q: "Is the property legally verified and RERA registered?",
      a: "We prioritize transparency and list properties with proper documentation. Most projects are RERA registered and compliant with regulations. Document verification assistance is available on request.",
    },
  ];

  return (
    <Card title="Frequently Asked Questions">
      <div className="space-y-3">
        {faqs.map((item, i) => (
          <Accordion key={i} title={item.q} content={item.a} />
        ))}
      </div>
    </Card>
  );
}

function SameDeveloperCarousel({ developerName, properties, loading }) {
  const sliderRef = useRef(null);

  const slideBy = (direction) => {
    if (!sliderRef.current) return;
    sliderRef.current.scrollBy({
      left: direction * 300,
      behavior: "smooth",
    });
  };

  if (!developerName) return null;

  return (
    <Card title={`Properties From ${developerName}`}>
      {loading ? (
        <p className="text-gray-500">Loading properties...</p>
      ) : properties.length === 0 ? (
        <p className="text-gray-500">
          No other properties from this developer yet.
        </p>
      ) : (
        <div className="relative">
          <button
            type="button"
            onClick={() => slideBy(-1)}
            className="absolute left-1 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white border border-gray-200 shadow flex items-center justify-center hover:bg-gray-50"
            aria-label="Previous properties"
          >
            <ChevronLeft size={18} />
          </button>

          <div
            ref={sliderRef}
            className="overflow-x-auto scroll-smooth hide-scrollbar px-12"
          >
            <div className="flex gap-4 w-max">
              {properties.map((item) => (
                <a
                  key={item.id}
                  href={`/properties/${item.id}`}
                  className="w-70 shrink-0 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="h-44 bg-gray-100">
                    {item.mainPropertyImage ? (
                      <img
                        src={item.mainPropertyImage}
                        alt={item.propertyTitle || item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {item.propertyTitle || item.title || "Property"}
                    </p>
                    <p className="text-xs text-gray-500 truncate mt-1">
                      {item.locality || "-"}, {item.city || "-"}
                    </p>
                    <p className="text-lg font-bold text-brickred mt-2">
                      {formatPrice(item.totalPrice || item.price)}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => slideBy(1)}
            className="absolute right-1 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white border border-gray-200 shadow flex items-center justify-center hover:bg-gray-50"
            aria-label="Next properties"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </Card>
  );
}

/* ================= RELATED ================= */

// function RelatedProjects() {
//   return (
//     <Card title="Explore Related Projects">
//       <div className="grid md:grid-cols-2 gap-6">
//         <div className="h-40 bg-gray-100 rounded-lg" />
//         <div className="h-40 bg-gray-100 rounded-lg" />
//       </div>
//     </Card>
//   );
// }

/* ================= REUSABLE ================= */

function Card({ title, children }) {
  return (
    <div className="bg-white border rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
}

function Badge({ text, color }) {
  const map = {
    green: "bg-green-100 text-green-700",
    blue: "bg-blue-100 text-blue-700",
    purple: "bg-purple-100 text-purple-700",
  };
  return (
    <span className={`px-3 py-1 rounded-lg text-sm ${map[color]}`}>{text}</span>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-semibold">{value || "-"}</p>
    </div>
  );
}

function GalleryItem({ src }) {
  return (
    <div className="bg-gray-200 rounded-lg flex items-center justify-center">
      {src ? (
        <img src={src} className="w-full h-full object-cover rounded-lg" />
      ) : (
        "No Image"
      )}
    </div>
  );
}

function Accordion({ title, content }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center p-4 text-left font-medium text-md"
      >
        {title}
        <ChevronDown
          size={18}
          className={`transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="px-4 pb-4 text-gray-600 text-md leading-relaxed">
          {content}
        </div>
      )}
    </div>
  );
}

function CenterMsg({ msg }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center text-gray-500">
      {msg}
    </div>
  );
}
