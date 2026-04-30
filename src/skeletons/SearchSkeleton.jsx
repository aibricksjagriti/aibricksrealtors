"use client";

/**
 * Search results skeleton
 * Matches: src/Search/SearchClient.jsx layout
 * Shows: back link, filter bar, hero strip, result summary, property cards, sidebar
 */
export function SearchSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div className="h-11 w-44 rounded-lg bg-gray-200 animate-pulse" />

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-2">
            <div className="h-4 w-28 rounded-full bg-gray-200 animate-pulse" />
            <div className="h-3 w-52 rounded-full bg-gray-200 animate-pulse" />
          </div>
          <div className="h-10 w-28 rounded-xl bg-gray-200 animate-pulse" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-12 rounded-xl bg-gray-200 animate-pulse" />
          ))}
          <div className="h-12 rounded-xl bg-gray-200 animate-pulse" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
            <div className="h-6 w-2/3 rounded-full bg-gray-200 animate-pulse" />
            <div className="h-4 w-full rounded-full bg-gray-200 animate-pulse" />
            <div className="h-4 w-5/6 rounded-full bg-gray-200 animate-pulse" />
            <div className="flex items-center gap-2 pt-1">
              <div className="h-6 w-24 rounded-full bg-gray-200 animate-pulse" />
              <div className="h-6 w-28 rounded-full bg-gray-200 animate-pulse" />
            </div>
          </div>

          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col md:flex-row gap-4 shadow-sm"
            >
              <div
                className="relative w-full rounded-xl bg-gray-200 animate-pulse shrink-0"
                style={{ width: 260, height: 180 }}
              />

              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-16 rounded-full bg-gray-200 animate-pulse" />
                  <div className="h-5 w-16 rounded-full bg-gray-200 animate-pulse" />
                </div>

                <div className="h-6 w-3/4 rounded-full bg-gray-200 animate-pulse" />
                <div className="h-4 w-1/2 rounded-full bg-gray-200 animate-pulse" />

                <div className="grid grid-cols-3 gap-2">
                  <div className="h-10 rounded-lg bg-gray-200 animate-pulse" />
                  <div className="h-10 rounded-lg bg-gray-200 animate-pulse" />
                  <div className="h-10 rounded-lg bg-gray-200 animate-pulse" />
                </div>

                <div className="space-y-2">
                  <div className="h-4 w-full rounded-full bg-gray-200 animate-pulse" />
                  <div className="h-4 w-5/6 rounded-full bg-gray-200 animate-pulse" />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pt-1">
                  <div className="space-y-2">
                    <div className="h-5 w-32 rounded-full bg-gray-200 animate-pulse" />
                    <div className="h-4 w-24 rounded-full bg-gray-200 animate-pulse" />
                  </div>
                  <div className="flex gap-2">
                    <div className="h-10 w-28 rounded-lg bg-gray-200 animate-pulse" />
                    <div className="h-10 w-20 rounded-lg bg-gray-200 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="hidden lg:block lg:col-span-4">
          <div className="sticky top-28 space-y-6">
            <div className="h-36 rounded-2xl bg-gray-200 animate-pulse" />
            <div className="h-64 rounded-2xl bg-gray-200 animate-pulse" />
            <div className="h-80 rounded-2xl bg-gray-200 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
