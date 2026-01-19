"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Building2 } from "lucide-react";
import ProjectSlider from "./ProjectSlider";

export default function UpcomingProjects() {
  return (
    <section className="pt-16  bg-[#f8f8f8] text-center w-full">
      {/* Heading */}
      <div className="">
        <div className="flex justify-center mb-2">
          <Building2 size={40} className="text-[var(--color-ochre)]" />
        </div>
        <h2 className="text-4xl font-serif font-bold text-[var(--color-darkgray)] uppercase">
          Upcoming Projects
        </h2>
        <p className="text-gray-600 mt-2 text-xl">New upcoming developments</p>
      </div>
      <ProjectSlider />
    </section>
  );
}
