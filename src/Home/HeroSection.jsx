import HeroVideo from "./Hero/HeroVideo";
import HeroSearch from "./Hero/HeroSearch";

export default function HeroSection() {
  return (
    <>
      {/* HERO BANNER */}
      <section
        data-home-hero
        className="relative z-30 h-[360px] sm:h-[420px] md:h-[700px] w-full"
      >
        {/* <div className="absolute inset-0 overflow-hidden bg-[#172b51]">
          <img
            src="/home/hero-banner-home-mobile.webp"
            srcSet="/home/hero-banner-home-mobile.webp 828w, /home/hero-banner-home.webp 1600w"
            sizes="100vw"
            width={1600}
            height={792}
            alt="Luxury Properties"
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />

          <div className="absolute inset-0 bg-black/30" />
          <HeroVideo />

          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/45" />
        </div> */}

        <div className="relative h-full w-full overflow-hidden">
          {/* <img
            src="/home/hero-banner-home-mobile.webp"
            srcSet="/home/hero-banner-home-mobile.webp 828w, /home/hero-banner-home.webp 1600w"
            sizes="100vw"
            width={1600}
            height={792}
            alt="Luxury Properties"
            fetchPriority="high"
            className="block h-full w-full object-cover"
          /> */}

          <img
            src="/home/hero-banner-home-mobile.webp"
            srcSet="
    /home/hero-banner-home-mobile.webp 828w,
    /home/hero-banner-home.webp 1600w
  "
            sizes="100vw"
            width={1600}
            height={792}
            alt="Luxury Properties"
            fetchPriority="high"
            loading="eager"
            decoding="async"
            className="block h-full w-full object-cover"
          />

              <div className="absolute inset-0 bg-black/30" />
          <HeroVideo />

          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/45" />
        </div>

        {/* <div className="absolute inset-0 z-10 flex w-full flex-col items-center justify-center px-4 pt-16 text-white md:justify-end md:pb-10">
          <h1 className="text-center text-4xl sm:text-5xl lg:text-7xl font-serif font-bold drop-shadow-xl md:mb-6">
            Live The Future
          </h1>

          <div className="hidden w-full max-w-6xl md:block">
            <HeroSearch />
          </div>
        </div> */}

        <div className="absolute inset-0 z-10">
          <h1 className="absolute left-0 right-0 top-1/2 -translate-y-1/2 text-center text-4xl md:text-6xl font-bold text-white">
            Live The Future
          </h1>

          <div className="absolute bottom-10 left-1/2 hidden w-full max-w-6xl -translate-x-1/2 md:block">
            <HeroSearch />
          </div>
        </div>
      </section>

      <div
        data-home-search
        className="relative z-[70] block px-3 -mt-14 md:hidden"
      >
        <HeroSearch />
      </div>

      <div
        aria-hidden="true"
        className="relative z-0 -mt-2 h-24 overflow-hidden bg-gradient-to-b from-[#f8f8f8] via-[#e8eef6] to-[#0F1E3E]"
      >
        <div className="absolute -left-[10%] top-2 h-16 w-[120%] rounded-[50%] bg-white/35 blur-xl" />
      </div>
    </>
  );
}
