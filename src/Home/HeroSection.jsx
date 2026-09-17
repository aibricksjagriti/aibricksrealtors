import Image from "next/image";
import HeroVideo from "./Hero/HeroVideo";
import HeroSearch from "./Hero/HeroSearch";

export default function HeroSection() {
  return (
    <>
      {/* HERO BANNER */}
      <section data-home-hero className="relative z-30 h-[430px] sm:h-[480px] md:h-[700px] w-full">
        <div className="absolute inset-0 overflow-hidden">
        {/* LCP IMAGE */}
        <Image
          src="/home/hero-banner-home.png"
          alt="Luxury Properties"
          fill
          priority
          fetchPriority="high"
          className="object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30" />

        {/* Video */}
        <HeroVideo />

        {/* Keep text legible over both the poster and video. */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/45" />
        </div>

        {/* HERO CONTENT */}
        <div className="absolute inset-0 z-10 flex w-full flex-col items-center justify-center px-4 pt-16 text-white md:justify-end md:pb-10">
          <h1 className="text-center text-4xl sm:text-5xl lg:text-7xl font-serif font-bold drop-shadow-xl md:mb-6">
            Live The Future
          </h1>

          {/* ✅ Desktop Search (inside banner) */}
          <div className="hidden w-full max-w-6xl md:block">
            <HeroSearch />
          </div>
        </div>
      </section>

      {/* ✅ Mobile Search (below banner) */}
      <div data-home-search className="block md:hidden px-3 -mt-8 relative z-20">
        <HeroSearch />
      </div>

      <div aria-hidden="true" className="relative z-0 -mt-2 h-24 overflow-hidden bg-gradient-to-b from-[#f8f8f8] via-[#e8eef6] to-[#0F1E3E]">
        <div className="absolute -left-[10%] top-2 h-16 w-[120%] rounded-[50%] bg-white/35 blur-xl" />
      </div>
    </>
  );
}
