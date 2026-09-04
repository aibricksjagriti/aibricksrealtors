"use client";

import { useState, useEffect } from "react";
import PropertyEnquiryModal from "../Modal/PropertyEnquiryModal";

export function LocationMapWithLoading({ property }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

  const location = `${property.city}, ${property.state}`;

  useEffect(() => {
    // Set timeout to show loading state for max 3 seconds
    const timer = setTimeout(() => setIsLoading(false), 3000);

    return () => clearTimeout(timer);
  }, []);

  // Open enquiry modal
  const handleEnquire = (e) => {
    e.stopPropagation();
    setIsEnquiryOpen(true);
  };

  // Close enquiry modal
  const handleCloseEnquiry = () => {
    setIsEnquiryOpen(false);
  };

  return (
    <>
      <div className="bg-white border rounded-xl p-6 space-y-4">
        {/* Property Title + Enquiry Button */}
        <div className="flex items-center justify-between gap-4">
          {/* Property Title */}
          <h3 className="text-xl font-semibold text-darkGray">
            {property.propertyTitle} Location
          </h3>

          {/* Enquiry Button */}
          <button
            type="button"
            onClick={handleEnquire}
            className="
              shrink-0
              bg-brickred
              text-white
              px-4
              py-2
              rounded-md
              text-md
              font-medium
              hover:bg-ochre
              hover:text-darkgray
              transition
              cursor-pointer
              enquiry-blink
            "
          >
            Enquire Now
          </button>
        </div>

        {/* Map */}
        <div className="relative w-full h-80 rounded-lg overflow-hidden bg-gray-100">
          {isLoading && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
              <div className="text-gray-400 text-sm">Loading map...</div>
            </div>
          )}

          <iframe
            width="100%"
            height="100%"
            className="rounded-lg"
            onLoad={() => setIsLoading(false)}
            src={`https://maps.google.com/maps?q=${encodeURIComponent(
              location,
            )}&z=14&output=embed`}
            style={{
              border: "none",
              opacity: isLoading ? 0.5 : 1,
              transition: "opacity 0.3s ease-in-out",
            }}
          />
        </div>
      </div>

      {/* Property Enquiry Modal */}
      <PropertyEnquiryModal
        isOpen={isEnquiryOpen}
        onClose={handleCloseEnquiry}
        property={property}
      />
    </>
  );
}
