"use client";

/**
 * Developer Detail Page Skeleton
 * Matches: app/developers/[slug]/page.jsx layout
 * Shows: hero, about, project grid, impact, faq
 */
export function DeveloperPageSkeleton() {
  return (
    <div className="bg-white">
      {/* HERO */}
      <section className="relative bg-gray-200 animate-pulse" style={{ minHeight: 600 }}>
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 space-y-4">
          <div className="h-10 w-72 bg-white/30 animate-pulse rounded-lg" />
          <div className="h-5 w-44 bg-white/30 animate-pulse rounded-lg" />
          <div className="h-11 w-36 bg-white/30 animate-pulse rounded-md" />
        </div>
      </section>

      {/* ABOUT */}
      <section className="py-10 max-w-7xl mx-auto px-4 space-y-4">
        <div className="h-10 w-80 bg-gray-200 animate-pulse rounded-lg" />
        <div className="space-y-3">
          <div className="h-4 w-full bg-gray-200 animate-pulse rounded-lg" />
          <div className="h-4 w-11/12 bg-gray-200 animate-pulse rounded-lg" />
          <div className="h-4 w-10/12 bg-gray-200 animate-pulse rounded-lg" />
          <div className="h-4 w-9/12 bg-gray-200 animate-pulse rounded-lg" />
        </div>
      </section>

      {/* PROJECT GRID */}
      <section id="projects" className="bg-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-8 w-96 bg-gray-200 animate-pulse rounded-lg mb-6" />
          <div className="flex gap-3 mb-10 flex-wrap">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-10 w-32 bg-gray-200 animate-pulse rounded-lg" />
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="relative bg-white rounded-3xl overflow-hidden shadow-lg border">
                <div className="relative h-60 bg-gray-200 animate-pulse">
                  <div className="absolute top-4 left-0 h-8 w-24 bg-gray-300 animate-pulse rounded-br-xl rounded-tr-xl" />
                  <div className="absolute bottom-2 right-0 h-8 w-28 bg-gray-300 animate-pulse rounded-bl-xl rounded-tl-xl" />
                </div>
                <div className="p-5 sm:p-6 space-y-3">
                  <div className="h-6 w-40 bg-gray-200 animate-pulse rounded-lg" />
                  <div className="h-4 w-32 bg-gray-200 animate-pulse rounded-lg" />
                  <div className="space-y-2 my-4">
                    {Array.from({ length: 4 }).map((_, j) => (
                      <div key={j} className="h-4 w-full bg-gray-200 animate-pulse rounded-lg" />
                    ))}
                  </div>
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

      {/* IMPACT */}
      <section className="bg-[#f5f5f5] py-12 md:py-16 px-4">
        <div className="max-w-6xl mx-auto space-y-5">
          <div className="h-8 w-2/3 bg-gray-200 animate-pulse rounded-lg mx-auto" />
          <div className="space-y-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 animate-pulse rounded-xl" />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4" style={{ background: "linear-gradient(to right, #5a082a, #8D0B41, #a63b1e)" }}>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-4">
            <div className="h-10 w-96 bg-white/20 animate-pulse rounded-lg" />
            <div className="h-5 w-80 bg-white/20 animate-pulse rounded-lg" />
          </div>
          <div
            className="rounded-2xl p-6 md:p-8 shadow-xl space-y-4"
            style={{ background: "linear-gradient(135deg, #d5b258 0%, #f1df9e 100%)" }}
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-14 bg-white/50 animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
