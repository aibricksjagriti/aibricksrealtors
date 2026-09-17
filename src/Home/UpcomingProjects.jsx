"use client";

import { Building2, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import CtaModal from "../Modal/CtaModal";
import { useRef, useState } from "react";

export default function UpcomingProjects() {
  const [open, setOpen] = useState(false);
  const trackRef = useRef(null);
  const scroll = (direction) => trackRef.current?.scrollBy({ left: direction * Math.min(trackRef.current.clientWidth, 390), behavior: "smooth" });

  const projects = [
    {
      name: "Sobha Kharadi",
      city: "Pune",
      image: "/home/upcoming/sobha-kharadi.webp",
    },
    {
      name: "Godrej Hillside",
      city: "Pune",
      image: "/home/upcoming/godrej-hillside.jpg",
    },
    {
      name: "Emaar Creek Harbour",
      city: "Dubai",
      image: "/home/upcoming/dubai-creek-harbour.png",
    },
    {
      name: "DAMAC Lagoons",
      city: "Dubai",
      image: "/home/upcoming/DAMAC-Lagoons.jpg",
    },
    {
      name: "Sobha Hartland",
      city: "Dubai",
      image: "/home/upcoming/Sobha-Hartland.jpeg",
    },
    {
      name: "L&T Hinjewadi",
      city: "Pune",
      image: "/home/upcoming/L&T-Hinjewadi.jpg",
    },
  ];

  return (
    <section className="pt-16 bg-[#f8f8f8] text-center w-full">
      {/* Heading */}
      <div className="px-4">
        <div className="flex justify-center mb-2">
          <Building2 size={40} style={{ color: "var(--color-ochre)" }} />
        </div>
        <h2
          className="text-4xl font-serif font-bold uppercase"
          style={{ color: "var(--color-darkgray)" }}
        >
          Upcoming Projects
        </h2>
        <p className="text-gray-600 mt-2 text-xl">New upcoming developments</p>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-10">
        <button aria-label="Previous upcoming projects" onClick={() => scroll(-1)} className="hidden md:grid absolute left-0 top-1/2 z-10 h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white shadow-lg text-brickred"><ChevronLeft /></button>
        <div ref={trackRef} data-testid="upcoming-track" className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-4 no-scrollbar">
        {projects.map((project) => (
          <div
            key={project.name}
            className="group min-w-[86%] sm:min-w-[48%] lg:min-w-[calc(33.333%-1rem)] snap-start bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 text-left hover:-translate-y-1 hover:shadow-2xl transition-all duration-300"
          >
            <div className="relative h-72 overflow-hidden">
              <Image
                src={project.image}
                alt={project.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.1), transparent)",
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-white/80 text-sm mb-1">{project.city}</p>
                <h3 className="text-white text-2xl font-semibold leading-tight">
                  {project.name}
                </h3>
              </div>
            </div>

            <div className="p-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500">Upcoming project</p>
                <p className="font-semibold text-darkgray">Ready for launch</p>
              </div>

              <button
                onClick={() => setOpen(true)}
                className="shrink-0 bg-brickred text-white px-4 py-2 rounded-lg hover:bg-ochre transition"
              >
                Details
              </button>
            </div>
          </div>
        ))}
        </div>
        <button aria-label="Next upcoming projects" onClick={() => scroll(1)} className="hidden md:grid absolute right-0 top-1/2 z-10 h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white shadow-lg text-brickred"><ChevronRight /></button>
      </div>

      <CtaModal open={open} onClose={() => setOpen(false)} />
    </section>
  );
}
