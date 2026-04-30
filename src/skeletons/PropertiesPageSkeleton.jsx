"use client";

/**
 * Properties Listing Skeleton
 * Matches: app/properties/page.jsx layout
 * Shows: Hero section placeholder, heading, paginated list cards, sidebar
 */
export function PropertiesPageSkeleton() {
  return (
    <div className="bg-background">
      {/* HERO */}
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="h-12 w-3/4 bg-gray-200 animate-pulse rounded-lg" />
            <div className="h-4 w-full bg-gray-200 animate-pulse rounded-lg" />
            <div className="h-4 w-5/6 bg-gray-200 animate-pulse rounded-lg" />
            <div className="flex gap-4 pt-2">
              <div className="h-12 w-32 bg-gray-200 animate-pulse rounded-md" />
            </div>
            <div className="bg-[#f8f8ff] border-2 border-gray-200 rounded-2xl p-4 md:p-6 shadow-sm space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="h-12 bg-gray-200 animate-pulse rounded-xl" />
                ))}
                <div className="sm:col-span-2 lg:col-span-3 flex flex-col sm:flex-row gap-4">
                  <div className="h-12 flex-1 bg-gray-200 animate-pulse rounded-xl" />
                  <div className="h-12 w-28 bg-gray-200 animate-pulse rounded-xl" />
                </div>
              </div>
            </div>
          </div>

          <div
            className="relative rounded-2xl bg-gray-200 animate-pulse"
            style={{ height: 280, width: "100%" }}
          />
        </div>
      </section>

      {/* HEADING */}
      <div className="mb-8">
        <div className="max-w-7xl mx-auto px-4 py-4 space-y-3">
          <div className="h-10 w-2/3 bg-gray-200 animate-pulse rounded-lg" />
          <div className="h-5 w-1/2 bg-gray-200 animate-pulse rounded-lg" />
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
        <div className="lg:col-span-8 space-y-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border p-4 flex flex-col sm:flex-row gap-4"
            >
              <div
                className="relative w-full rounded-lg bg-gray-200 animate-pulse shrink-0"
                style={{ width: 260, height: 180 }}
              />

              <div className="flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between gap-4">
                    <div className="h-6 w-2/3 bg-gray-200 animate-pulse rounded-lg" />
                    <div className="h-6 w-24 bg-gray-200 animate-pulse rounded-lg" />
                  </div>
                  <div className="h-4 w-1/3 bg-gray-200 animate-pulse rounded-lg" />
                  <div className="h-12 w-full bg-gray-200 animate-pulse rounded-lg" />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="space-y-2">
                    <div className="h-5 w-32 bg-gray-200 animate-pulse rounded-lg" />
                    <div className="h-4 w-24 bg-gray-200 animate-pulse rounded-lg" />
                  </div>
                  <div className="flex gap-3">
                    <div className="h-10 w-20 bg-gray-200 animate-pulse rounded-lg" />
                    <div className="h-10 w-28 bg-gray-200 animate-pulse rounded-lg" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="hidden lg:block lg:col-span-4 mb-10">
          <div className="sticky top-24 space-y-6">
            <div className="h-64 rounded-xl bg-gray-200 animate-pulse" />
            <div className="h-80 rounded-xl bg-gray-200 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
