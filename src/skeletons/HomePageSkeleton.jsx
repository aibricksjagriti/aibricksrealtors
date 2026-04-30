"use client";

/**
 * Home Page Skeleton
 * Matches: app/page.js sections in order
 * Shows: hero, upcoming projects, featured grids, CTA, FAQ, stats
 */
export function HomePageSkeleton() {
  return (
    <main className="bg-background">
      {/* HERO */}
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="h-12 w-3/4 bg-gray-200 animate-pulse rounded-lg" />
            <div className="h-5 w-full bg-gray-200 animate-pulse rounded-lg" />
            <div className="h-5 w-5/6 bg-gray-200 animate-pulse rounded-lg" />
            <div className="h-14 w-40 bg-gray-200 animate-pulse rounded-xl" />
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

          <div className="space-y-4">
            <div
              className="relative bg-gray-200 animate-pulse rounded-2xl"
              style={{ height: 320 }}
            />
            <div className="relative h-28 md:h-32 bg-gray-200 animate-pulse rounded-2xl md:ml-12" />
          </div>
        </div>
      </section>

      {/* UPCOMING PROJECTS */}
      <section className="pt-16 bg-[#f8f8f8] px-4">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <div className="mx-auto h-10 w-44 bg-gray-200 animate-pulse rounded-lg" />
          <div className="mx-auto h-5 w-72 bg-gray-200 animate-pulse rounded-lg" />
        </div>
        <div className="max-w-7xl mx-auto py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100">
              <div className="relative h-72 bg-gray-200 animate-pulse" />
              <div className="p-5 space-y-3">
                <div className="h-4 w-20 bg-gray-200 animate-pulse rounded-lg" />
                <div className="h-7 w-2/3 bg-gray-200 animate-pulse rounded-lg" />
                <div className="flex items-center justify-between gap-4 pt-2">
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-28 bg-gray-200 animate-pulse rounded-lg" />
                    <div className="h-5 w-36 bg-gray-200 animate-pulse rounded-lg" />
                  </div>
                  <div className="h-10 w-24 bg-gray-200 animate-pulse rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SIMPLE SECTION STRIPS */}
      <section className="py-10 px-4 max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-white rounded-2xl border p-6 space-y-4">
              <div className="h-5 w-24 bg-gray-200 animate-pulse rounded-lg" />
              <div className="h-24 bg-gray-200 animate-pulse rounded-xl" />
              <div className="h-4 w-5/6 bg-gray-200 animate-pulse rounded-lg" />
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border p-6 space-y-4">
          <div className="h-6 w-40 bg-gray-200 animate-pulse rounded-lg" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-24 bg-gray-200 animate-pulse rounded-xl" />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border p-6 space-y-4">
          <div className="h-6 w-36 bg-gray-200 animate-pulse rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="h-28 bg-gray-200 animate-pulse rounded-xl" />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border p-6 space-y-4">
          <div className="h-6 w-28 bg-gray-200 animate-pulse rounded-lg" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-12 bg-gray-200 animate-pulse rounded-lg" />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border p-6 space-y-4">
          <div className="h-6 w-24 bg-gray-200 animate-pulse rounded-lg" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-20 bg-gray-200 animate-pulse rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
