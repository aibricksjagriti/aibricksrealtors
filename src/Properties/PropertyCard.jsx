"use client";
import Image from "next/image";
import {
  MapPin,
  Heart,
  CarTaxiFront,
  CarFront,
  MessageCircleMore,
  Phone,
} from "lucide-react";
import Link from "next/link";
import BookSiteVisitModal from "./BookSiteVisitModal";
import { useState } from "react";

export default function PropertyCard({ property }) {
  const [openTour, setOpenTour] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden border-gray-500">
      <div className="flex flex-col sm:flex-row gap-4 p-4">
        {/* LEFT IMAGE */}
        <div className="relative w-full sm:w-[260px] h-[180px] rounded-lg overflow-hidden bg-gray-200">
          <Image
            src={
              property.imageGallery?.[0] || "/home/upcoming/sobha-kharadi.webp"
            }
            alt={property.propertyTitle}
            fill
            className="object-cover"
          />
        </div>

        {/* RIGHT CONTENT */}
        <div className="flex-1 flex flex-col justify-between">
          {/* TOP INFO */}
          <div>
            <div className="flex justify-between items-start">
              <h2 className="text-lg font-semibold text-darkGray">
                {property.propertyTitle}
              </h2>

              <p className="text-lg font-semibold text-darkGray">
                ₹ {Number(property.totalPrice).toLocaleString("en-IN")}
              </p>
            </div>

            {/* LOCATION */}
            <p className="flex items-center gap-1 text-sm text-gray-500 mt-1">
              <MapPin size={14} />
              {property.locality}
            </p>

            {/* CONFIG ROW (Single – as per API) */}
            <div className="mt-3 border rounded-md overflow-hidden">
              <div className="grid grid-cols-3 text-sm bg-gray-50 px-3 py-2">
                <span className="font-medium">{property.subType}</span>
                <span className="text-center">{property.builtUpArea} sqft</span>
                <span className="text-right font-medium">
                  ₹ {Number(property.totalPrice).toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>

          {/* BOTTOM INFO */}
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            {/* BUILDER */}
            <div>
              <p className="text-md font-medium text-darkGray">
                {property.builderName}
              </p>
              <p className="text-sm text-gray-500">
                {property.seller?.sellerType}
              </p>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-3">
              <a
                href={`tel:${property.seller?.phoneNumber || ""}`}
                className="flex items-center gap-1 border bg-ochre border-gray-300 px-4 py-2 rounded-lg text-lg hover:bg-brickred text-lightcream transition"
              >
                <Phone /> Call
              </a>

              <button
                onClick={() => setOpenTour(true)}
                className="flex items-center gap-1 border bg-ochre border-gray-300 px-4 py-2 rounded-lg text-lg hover:bg-brickred text-lightcream transition"
              >
                <CarFront /> Tour
              </button>

              <BookSiteVisitModal
                isOpen={openTour}
                onClose={() => setOpenTour(false)}
                property={property}
              />

              <Link
                href={`/properties/${property.id}`}
                className="flex items-center gap-1 bg-brickred text-white px-4 py-2 rounded-lg text-md hover:bg-ochre transition"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
