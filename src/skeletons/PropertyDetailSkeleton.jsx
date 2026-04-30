"use client";

export function PropertyDetailSkeleton() {
  return (
    <div className="bg-[#f4f6f9] min-h-screen pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        {/* TITLE ROW */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex-1 space-y-3">
            <div className="h-10 w-2/3 rounded-full bg-gray-200 animate-pulse" />
            <div className="h-4 w-1/3 bg-gray-200 animate-pulse rounded-lg" />
            <div className="flex gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-6 w-16 bg-gray-200 animate-pulse rounded-lg" />
              ))}
            </div>
          </div>
          <div className="w-full lg:w-64 h-28 rounded-xl bg-gray-200 animate-pulse" />
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT CONTENT */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Gallery */}
            <div className="bg-white rounded-xl p-3 border">
              <div className="grid grid-cols-2 gap-3">
                <div className="row-span-2 h-80 rounded-lg bg-gray-200 animate-pulse" />
                <div className="h-40 rounded-lg bg-gray-200 animate-pulse" />
                <div className="h-40 rounded-lg bg-gray-200 animate-pulse" />
              </div>
            </div>

            {/* Highlight Strip */}
            <div className="bg-white rounded-xl p-4 border">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="space-y-2 text-center">
                    <div className="h-3 w-12 rounded-full bg-gray-200 animate-pulse mx-auto" />
                    <div className="h-4 w-16 rounded-full bg-gray-200 animate-pulse mx-auto" />
                  </div>
                ))}
              </div>
            </div>

            {/* Overview */}
            <div className="bg-white rounded-xl p-6 border space-y-4">
              <div className="h-6 w-24 rounded-full bg-gray-200 animate-pulse" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-3 w-16 rounded-full bg-gray-200 animate-pulse" />
                    <div className="h-4 w-20 rounded-full bg-gray-200 animate-pulse" />
                  </div>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-xl p-6 border space-y-4">
              <div className="h-6 w-24 rounded-full bg-gray-200 animate-pulse" />
              <div className="h-80 rounded-lg bg-gray-200 animate-pulse" />
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-xl p-6 border space-y-4">
              <div className="h-6 w-24 rounded-full bg-gray-200 animate-pulse" />
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="h-24 rounded-lg bg-gray-200 animate-pulse" />
                ))}
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-xl p-6 border space-y-4">
              <div className="h-6 w-24 rounded-full bg-gray-200 animate-pulse" />
              <div className="h-64 rounded-lg bg-gray-200 animate-pulse" />
            </div>

            {/* Gallery */}
            <div className="bg-white rounded-xl p-6 border space-y-4">
              <div className="h-6 w-24 rounded-full bg-gray-200 animate-pulse" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-40 rounded-lg bg-gray-200 animate-pulse" />
                ))}
              </div>
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-4">
            <div className="h-80 rounded-xl bg-gray-200 animate-pulse" />
            <div className="h-64 rounded-xl bg-gray-200 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
