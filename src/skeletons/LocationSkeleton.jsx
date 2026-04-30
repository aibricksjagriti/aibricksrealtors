"use client";

/**
 * Locations Page Skeleton
 * Matches: app/locations/[slug]/page.jsx layout
 * Shows: Title + Filter buttons + 3-column card grid
 */
export function LocationSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 mt-30">
      {/* TITLE */}
      <div className="space-y-3 mb-6">
        <div className="h-10 w-full bg-gray-200 animate-pulse rounded-lg" style={{ maxWidth: 520 }} />
        <div className="h-4 w-full bg-gray-200 animate-pulse rounded-lg" style={{ maxWidth: 360 }} />
      </div>

      {/* FILTER BUTTONS */}
      <div className="flex flex-wrap gap-2 mb-8 w-full">
        <div className="h-10 w-24 bg-gray-200 animate-pulse rounded-sm" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 w-32 bg-gray-200 animate-pulse rounded-sm" />
        ))}
      </div>

      {/* PROJECT TYPE TABS */}
      <div className="flex gap-3 mb-10 flex-wrap">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="relative h-16 flex-1 bg-gray-200 animate-pulse rounded-md"
            style={{ minWidth: 120 }}
          >
            <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-3 h-3 bg-gray-300 rotate-45" />
          </div>
        ))}
      </div>

      {/* 3-COLUMN CARD GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="w-full bg-white rounded-3xl shadow-lg overflow-hidden border"
            style={{ maxWidth: 370 }}
          >
            {/* Image with tags */}
            <div className="relative h-56 sm:h-64 md:h-72 bg-gray-200 animate-pulse">
              <div className="absolute top-4 left-0 h-8 w-24 bg-gray-300 animate-pulse rounded-br-xl rounded-tr-xl" />
              <div className="absolute bottom-2 right-0 h-8 w-28 bg-gray-300 animate-pulse rounded-bl-xl rounded-tl-xl" />
            </div>

            {/* Content */}
            <div className="p-5 sm:p-6 space-y-3">
              {/* Title */}
              <div className="h-6 w-40 bg-gray-200 animate-pulse rounded-lg" />
              {/* Type */}
              <div className="h-4 w-32 bg-gray-200 animate-pulse rounded-lg" />

              {/* Details - 4 lines */}
              <div className="space-y-2 my-4">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div
                    key={j}
                    className="h-4 w-full bg-gray-200 animate-pulse rounded-lg"
                  />
                ))}
              </div>

              {/* Footer: Price + Button */}
              <div className="border-t pt-4 flex justify-between items-center">
                <div className="h-5 w-20 bg-gray-200 animate-pulse rounded-lg" />
                <div className="h-9 w-24 bg-gray-200 animate-pulse rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
