import Image from "next/image";
import HeroVideo from "./Hero/HeroVideo";
import HeroSearch from "./Hero/HeroSearch";

export default function HeroSection() {
  return (
    <section className="relative h-[700px] w-full overflow-hidden">
      {/* LCP IMAGE (fastest render) */}
      <Image
        src="/home/hero-banner-home.png"
        alt="Luxury Properties"
        fill
        priority
        fetchPriority="high"
        className="object-cover"
      />

      <div className="absolute inset-0 bg-black/30" />

      {/* Video (loads AFTER page paint) */}
      <HeroVideo />

      {/* UI (UNCHANGED) */}
      <div className="absolute bottom-0 w-full px-4 pb-10 text-white z-10">
        <h1 className="text-center text-3xl md:text-5xl lg:text-6xl font-serif font-bold mb-6">
          Live The Future
        </h1>

        <HeroSearch />
      </div>
    </section>
  );
}
