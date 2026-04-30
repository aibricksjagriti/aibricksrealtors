"use client";

/**
 * Developer Projects Skeleton
 * Matches: src/Developers/ProjectGrid.jsx layout
 * Shows: Heading + Tabs + 3-column card grid (with filtration)
 */
export function DeveloperProjectsSkeleton() {
  return (
    <section className="bg-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* HEADING */}
        <div className="h-8 w-96 bg-gray-200 animate-pulse rounded-lg mb-6" />

        {/* TABS */}
        <div className="flex gap-3 mb-8 flex-wrap mb-10">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-10 w-32 bg-gray-200 animate-pulse rounded-lg"
            />
          ))}
        </div>

        {/* 3-COLUMN CARD GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="relative bg-white rounded-3xl overflow-hidden shadow-lg border"
            >
              {/* Image with tags */}
              <div className="relative h-60 bg-gray-200 animate-pulse">
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
    </section>
  );
}
