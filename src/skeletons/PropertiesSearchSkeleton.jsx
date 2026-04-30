"use client";

export function PropertiesSearchSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT - PROPERTIES LIST */}
        <div className="lg:col-span-8 space-y-4">
          {/* Header */}
          <div className="bg-white border rounded-xl shadow-sm p-5 space-y-3">
            <div className="h-7 w-1/2 rounded-full bg-gray-200 animate-pulse" />
            <div className="h-4 w-full rounded-full bg-gray-200 animate-pulse" />
            <div className="h-4 w-5/6 rounded-full bg-gray-200 animate-pulse" />
          </div>

          {/* Property Cards */}
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="bg-white border rounded-xl p-4 flex flex-col md:flex-row gap-4 shadow-sm"
            >
              {/* Image */}
              <div className="relative w-full md:w-[260px] h-[180px] rounded-lg bg-gray-200 animate-pulse flex-shrink-0" />

              {/* Content */}
              <div className="flex-1 space-y-3">
                <div className="h-6 w-3/4 rounded-full bg-gray-200 animate-pulse" />
                <div className="h-4 w-1/3 rounded-full bg-gray-200 animate-pulse" />
                <div className="h-12 w-full rounded-lg bg-gray-200 animate-pulse" />
                <div className="h-4 w-full rounded-full bg-gray-200 animate-pulse" />
                <div className="flex gap-2 justify-between items-end">
                  <div className="space-y-2">
                    <div className="h-5 w-32 rounded-full bg-gray-200 animate-pulse" />
                    <div className="h-4 w-24 rounded-full bg-gray-200 animate-pulse" />
                  </div>
                  <div className="h-10 w-24 rounded-lg bg-gray-200 animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT - SIDEBAR */}
        <div className="hidden lg:block lg:col-span-4">
          <div className="sticky top-28 space-y-4">
            <div className="h-64 rounded-2xl bg-gray-200 animate-pulse" />
            <div className="h-80 rounded-2xl bg-gray-200 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
