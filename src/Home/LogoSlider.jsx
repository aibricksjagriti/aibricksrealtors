"use client";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";

// const logos = [
//   { src: "/home/emaar.png", alt: "Emaar" },
//   { src: "/home/nakheel.png", alt: "Nakheel" },
//   { src: "/home/meraas.png", alt: "Meraas" },
//   { src: "/home/sobha.png", alt: "Sobha" },
//   { src: "/home/damac.png", alt: "Damac" },
//   { src: "/home/omniyat.png", alt: "Omniyat" },
//   { src: "/home/danube.png", alt: "Danube" },
//   //   { src: "/home/aldar.png", alt: "Aldar" },
//   { src: "/home/binghatti.png", alt: "Binghatti" },
// ];

const logos = [
  { src: "/home/logo/utp-logo.png", alt: "VTP Developers", href: "/developers/vtp" },
  { src: "/home/logo/kohinoor-logo.png", alt: "Kohinoor Developers", href: "/developers/kohinoor-group" },
  { src: "/home/logo/godrej-logo.png", alt: "Godrej Developers", href: "/developers/godrej" },
  { src: "/home/logo/lodha-logo.png", alt: "Lodha Developers", href: "/developers/lodha" },
  { src: "/home/logo/kolte-patil.png", alt: "Kolte Patil Developers", href: "/developers/kolte-patil" },
  { src: "/home/logo/gera-logo.png", alt: "Gera Developers", href: "/search?developer=Gera%20Developers" },
  { src: "/home/logo/tata-housing-logo.png", alt: "Tata Housing", href: "/search?developer=Tata%20Housing%20Development%20Company" },
  { src: "/home/logo/hiranandani-logo.png", alt: "Hiranandani Developers", href: "/developers/hiranandani" },
  { src: "/home/logo/krisala-logo.png", alt: "Krisala Developers", href: "/developers/krisala" },
  { src: "/home/logo/spoorji-logo.png", alt: "Shapoorji Pallonji", href: "/developers/shapoorji-pallonji" },
];

export default function LogoSlider() {
  const trackRef = useRef(null);
  const [selected, setSelected] = useState("");
  const scroll = (direction) => trackRef.current?.scrollBy({ left: direction * 320, behavior: "smooth" });
  return (
    <section className="w-full py-16 px-4">
      <div className="mx-auto mb-7 max-w-7xl text-center"><p className="text-sm font-bold uppercase tracking-[0.2em] text-ochre">Trusted brands</p><h2 className="mt-2 text-3xl md:text-4xl font-bold">Explore Developers</h2></div>
      <div className="relative w-full max-w-7xl mx-auto overflow-hidden rounded-3xl border-2 border-brickred shadow-lg">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100/50 via-blue-50/30 to-blue-100/50 backdrop-blur-sm rounded-3xl" />

        {/* Moving track */}
        <button aria-label="Previous developers" onClick={() => scroll(-1)} className="absolute left-2 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white shadow"><ChevronLeft /></button>
        <div ref={trackRef} className="relative flex snap-x gap-5 overflow-x-auto scroll-smooth py-7 px-16 no-scrollbar">
          {logos.map((logo) => (
            <Link
              href={logo.href}
              onClick={() => setSelected(logo.href)}
              key={logo.href}
              className={`flex-shrink-0 snap-start w-44 sm:w-52 h-28 rounded-2xl bg-white p-4 flex items-center justify-center border-2 transition hover:-translate-y-1 hover:shadow-lg ${selected === logo.href ? "border-ochre ring-4 ring-ochre/20" : "border-transparent"}`}
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={200}
                height={100}
                className="object-contain w-full h-[80px]"
              />
            </Link>
          ))}
        </div>
        <button aria-label="Next developers" onClick={() => scroll(1)} className="absolute right-2 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white shadow"><ChevronRight /></button>
      </div>
    </section>
  );
}
