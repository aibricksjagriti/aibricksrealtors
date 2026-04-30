"use client";

/**
 * 3-Column Card Grid Skeleton
 * Used by: Home Properties, Locations, Developers
 * Matches: AllProperties & ProjectGrid card layout
 */
export function CardGridSkeleton() {
  return (
    <section className="py-16 px-4 sm:px-6 md:px-10 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <div className="h-10 w-10 rounded-lg bg-gray-200 animate-pulse" />
          </div>
          <div className="h-10 w-64 rounded-lg bg-gray-200 animate-pulse mx-auto" />
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="w-full max-w-[370px] bg-white rounded-3xl shadow-lg overflow-hidden"
            >
              {/* Image with tags */}
              <div className="relative h-56 sm:h-64 md:h-72 bg-gray-200 animate-pulse">
                {/* Developer tag skeleton */}
                <div className="absolute top-4 left-0 h-8 w-24 bg-gray-300 animate-pulse rounded-br-xl rounded-tr-xl" />
                {/* Trending tag skeleton */}
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
    </section>
  );
}
