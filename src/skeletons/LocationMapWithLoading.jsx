"use client";

import { useState, useEffect } from "react";

export function LocationMapWithLoading({ property }) {
  const [isLoading, setIsLoading] = useState(true);
  const location = `${property.city}, ${property.state}`;

  useEffect(() => {
    // Set timeout to show loading state for max 3 seconds then assume iframe loaded
    const timer = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-white border rounded-xl p-6 space-y-4">
      <h3 className="text-xl font-semibold text-darkGray">Location</h3>
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
          src={`https://maps.google.com/maps?q=${encodeURIComponent(location)}&z=14&output=embed`}
          style={{
            border: "none",
            opacity: isLoading ? 0.5 : 1,
            transition: "opacity 0.3s ease-in-out",
          }}
        />
      </div>
    </div>
  );
}
