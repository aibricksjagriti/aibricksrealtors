"use client";

import { useState, useCallback, memo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MapPin, Bed, Ruler, Calendar, Flame } from "lucide-react";
import PropertyEnquiryModal from "../Modal/PropertyEnquiryModal";

/* ---------------- CONSTANTS ---------------- */
const FALLBACK_IMAGE = "/home/ajman.webp";

/* ---------------- PRICE FORMATTER ---------------- */
const formatPrice = (price) => {
  if (!price) return "₹ N/A";

  if (price < 10000000) {
    return `₹ ${(price / 100000).toFixed(0)} Lakhs`;
  } else {
    return `₹ ${(price / 10000000).toFixed(2)} Cr`;
  }
};

/* ---------------- CARD ---------------- */
const PropertyCard = memo(function PropertyCard({ property, onEnquire }) {
  const router = useRouter();
  const [imgSrc, setImgSrc] = useState(property.image || FALLBACK_IMAGE);

  return (
    <div
      onClick={() => router.push(`/properties/${property.id}`)}
      className="relative bg-white rounded-3xl overflow-hidden shadow-lg w-full max-w-[370px]
      cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
    >
      {/* IMAGE */}
      <div className="relative h-60">
        <Image
          src={imgSrc}
          alt={property.name}
          fill
          className="object-cover"
          onError={() => setImgSrc(FALLBACK_IMAGE)}
        />

        {/* BUILDER */}
        <div className="absolute top-3 left-0 bg-[#e8c13f] px-3 py-1 rounded-tr-xl rounded-br-xl text-sm font-semibold">
          {property.developer}
        </div>

        {/* TRENDING */}
        <div className="absolute bottom-2 right-0 bg-[#e8c13f] px-3 py-1 rounded-tl-xl rounded-bl-xl flex items-center gap-1 text-sm font-semibold">
          <Flame size={16} /> Trending
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-5">
        <h3 className="text-lg font-semibold">{property.name}</h3>
        <p className="text-gray-500 text-sm mb-2">{property.type}</p>

        <div className="space-y-1 text-sm text-gray-600">
          <p className="flex items-center gap-2">
            <MapPin size={14} /> {property.location}
          </p>
          <p className="flex items-center gap-2">
            <Bed size={14} /> {property.bedrooms}
          </p>
          <p className="flex items-center gap-2">
            <Ruler size={14} /> {property.area}
          </p>
          <p className="flex items-center gap-2">
            <Calendar size={14} /> {property.completion}
          </p>
        </div>

        {/* FOOTER */}
        <div className="border-t mt-4 pt-4 flex justify-between items-center">
          <span className="font-bold text-brickred">{property.price}</span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onEnquire(property);
            }}
            className="bg-brickred text-white px-4 py-2 rounded-md text-sm hover:bg-ochre"
          >
            Enquire Now
          </button>
        </div>
      </div>
    </div>
  );
});

/* ---------------- MAIN ---------------- */
export default function ProjectGrid({ projects, builderName }) {
  const [activeTab, setActiveTab] = useState("Residential");
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tabs = ["Residential", "Commercial", "Plots"];

  /* ---------- FORMAT API DATA ---------- */
  const formattedProjects = projects.map((p) => ({
    id: p.id,
    name: p.projectName || p.propertyTitle,
    developer: p.builderName,
    type: p.propertyType,
    location: `${p.city}, ${p.state}`,
    bedrooms: p.subType,
    area: `${p.builtUpArea} sq.ft`,
    completion: p.propertyStatus,
    price: formatPrice(p.totalPrice),
    image: p.imageGallery?.[0] || FALLBACK_IMAGE,
    rawType: p.propertyType,
  }));

  /* ---------- FILTER ---------- */
  const filteredProjects = formattedProjects.filter((item) => {
    if (activeTab === "Residential") {
      return item.rawType === "Apartment" || item.rawType === "Villa";
    }
    if (activeTab === "Commercial") {
      return item.rawType === "Commercial";
    }
    if (activeTab === "Plots") {
      return item.rawType === "Plot";
    }
    return true;
  });

  /* ---------- ENQUIRY ---------- */
  const openEnquiry = useCallback((property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  }, []);

  return (
    <section className="bg-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* HEADING */}
        <h2 className="text-2xl md:text-4xl font-semibold mb-6">
          {projects.length > 0
            ? `Projects by ${builderName || projects[0]?.builderName || "Developer"}`
            : `No Projects Listed Yet`}
        </h2>

        {/* TABS */}
        <div className="flex gap-3 mb-8 flex-wrap mb-10">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-8 py-4 rounded-md text-lg font-medium w-[32%] ${
                activeTab === tab ? "bg-ochre text-darkgray" : "bg-gray-200"
              }`}
            >
              {tab}

              {activeTab === tab && (
                <span className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-3 h-3 bg-yellow-600 rotate-45"></span>
              )}
            </button>
          ))}
        </div>

        {/* GRID OR EMPTY */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">
            {filteredProjects.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onEnquire={openEnquiry}
              />
            ))}
          </div>
        ) : (
          <div className="h-[300px] max-h-[500px] flex flex-col justify-center items-center bg-white rounded-xl shadow">
            <h3 className="text-lg font-semibold">No Properties Available</h3>
            <p className="text-gray-500">No {activeTab} properties found</p>
          </div>
        )}
      </div>

      {/* MODAL */}
      <PropertyEnquiryModal
        isOpen={isModalOpen}
        property={selectedProperty}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
}
