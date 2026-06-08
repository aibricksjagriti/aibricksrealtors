import Image from "next/image";
import HeroVideo from "./Hero/HeroVideo";
import HeroSearch from "./Hero/HeroSearch";

export default function HeroSection() {
  return (
    <>
      {/* HERO BANNER */}
      <section className="relative h-[450px] md:h-[700px] lg:h-[700px] w-full overflow-hidden">
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

        {/* HERO CONTENT */}
        <div className="absolute bottom-0 w-full px-4 pb-10 text-white z-10">
          <h1 className="text-center text-4xl md:text-5xl lg:text-7xl font-serif font-bold mb-6">
            Live The Future
          </h1>

          {/* ✅ Desktop Search (inside banner) */}
          <div className="hidden md:block">
            <HeroSearch />
          </div>
        </div>
      </section>

      {/* ✅ Mobile Search (below banner) */}
      <div className="block md:hidden px-4 -mt-6 relative z-20">
        <HeroSearch />
      </div>
    </>
  );
}
