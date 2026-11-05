"use client";

const Pulse = ({ className = "" }) => (
  <div className={`animate-pulse rounded-full bg-current/12 ${className}`} />
);

export function KohinoorAdLandingSkeleton() {
  return (
    <div className="min-h-screen bg-[#f2efe7] text-[#17352f] [font-family:var(--font-sans)]">
      <div className="h-18 border-b border-white/10 bg-[#17352f]">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-5 lg:px-8">
          <Pulse className="h-3 w-36 bg-white/25" />
          <div className="hidden gap-8 lg:flex">
            {Array.from({ length: 4 }).map((_, index) => (
              <Pulse key={index} className="h-3 w-18 bg-white/20" />
            ))}
          </div>
          <Pulse className="h-10 w-32 bg-[#d8c79c]/70" />
        </div>
      </div>

      <section className="relative min-h-[82svh] overflow-hidden bg-[#17352f] text-white">
        <div className="absolute inset-y-0 right-0 w-1/2 animate-pulse bg-white/5" />
        <div className="relative mx-auto flex min-h-[82svh] max-w-7xl flex-col justify-end px-5 pb-16 lg:px-8 lg:pb-24">
          <Pulse className="h-3 w-60 bg-[#d8c79c]/50" />
          <Pulse className="mt-8 h-12 w-full max-w-2xl bg-white/20 sm:h-16" />
          <Pulse className="mt-4 h-12 w-4/5 max-w-xl bg-[#d8c79c]/45 sm:h-16" />
          <Pulse className="mt-7 h-5 w-full max-w-xl bg-white/15" />
          <Pulse className="mt-3 h-5 w-2/3 max-w-md bg-white/15" />
          <div className="mt-8 flex flex-wrap gap-3">
            <Pulse className="h-10 w-24 bg-white/15" />
            <Pulse className="h-10 w-38 bg-white/15" />
            <Pulse className="h-10 w-32 bg-white/15" />
          </div>
          <div className="mt-9 flex gap-3">
            <Pulse className="h-13 w-56 bg-[#d8c79c]/60" />
            <Pulse className="h-13 w-44 bg-white/15" />
          </div>
        </div>
      </section>

      <section className="border-b border-[#17352f]/10 bg-[#e4d7b6]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px px-5 py-7 sm:grid-cols-4 lg:px-8">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="space-y-3 px-4 py-3 text-center">
              <Pulse className="mx-auto h-8 w-20 bg-[#17352f]/20" />
              <Pulse className="mx-auto h-3 w-24 bg-[#17352f]/15" />
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
        <Pulse className="h-3 w-48 bg-[#8b6d3d]/25" />
        <div className="mt-7 grid gap-10 lg:grid-cols-2">
          <div className="space-y-4">
            <Pulse className="h-11 w-full max-w-lg bg-[#17352f]/15" />
            <Pulse className="h-11 w-4/5 max-w-md bg-[#8b6d3d]/20" />
          </div>
          <div className="space-y-4">
            <Pulse className="h-4 w-full bg-[#17352f]/12" />
            <Pulse className="h-4 w-full bg-[#17352f]/12" />
            <Pulse className="h-4 w-3/4 bg-[#17352f]/12" />
          </div>
        </div>
      </section>

      <section className="bg-[#17352f] px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Pulse className="h-12 w-80 max-w-full bg-white/15" />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <Pulse className="aspect-[4/3] w-full rounded-2xl bg-white/12" />
            <Pulse className="aspect-[4/3] w-full rounded-2xl bg-white/12" />
          </div>
        </div>
      </section>
    </div>
  );
}

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
