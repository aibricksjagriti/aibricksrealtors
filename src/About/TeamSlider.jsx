"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import Image from "next/image";
import { ArrowRight, User, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";

const team = [
  {
    name: "Arjun Mehta",
    role: "Founder & Managing Director",
    tags: ["VISIONARY", "LEADER", "REAL ESTATE"],
    image: "/about/team/arjun.jpg",
    desc: "With over a decade of experience in premium real estate, Arjun leads AIBricks Realtors with innovation, integrity, and a commitment to creating landmark properties that redefine luxury living.",
  },
  {
    name: "Priya Nair",
    role: "Head of Sales & Client Relations",
    tags: ["STRATEGY", "CLIENT CARE", "GROWTH"],
    image: "/about/team/priya.jpg",
    desc: "Priya’s deep understanding of client needs and market dynamics ensures every buyer and investor finds the perfect property match with a seamless, transparent experience.",
  },
  {
    name: "Rohit Sharma",
    role: "Senior Property Consultant",
    tags: ["NEGOTIATION", "MARKET EXPERT", "ADVISOR"],
    image: "/about/team/rohit.jpg",
    desc: "Known for his market expertise and personalized approach, Rohit helps clients make informed investment decisions and discover properties that truly align with their goals.",
  },
  {
    name: "Sneha Kapoor",
    role: "Marketing & Brand Strategist",
    tags: ["CREATIVE", "INNOVATION", "DIGITAL"],
    image: "/about/team/sneha.jpg",
    desc: "Sneha drives the brand presence of AIBricks Realtors across digital and print platforms, blending creativity with strategic innovation to showcase every project’s unique story.",
  },
  {
    name: "Amit Deshmukh",
    role: "Operations & Project Head",
    tags: ["EFFICIENCY", "QUALITY", "DELIVERY"],
    image: "/about/team/amit.jpg",
    desc: "Amit ensures every AIBricks project consistently runs smoothly and efficiently — from planning to handover — maintaining the highest standards of quality, safety, and timely execution.",
  },
];

export default function TeamSection() {
  const swiperRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const handleNext = () => {
    if (!swiperRef.current) return;
    swiperRef.current.slideNext();
    swiperRef.current.autoplay.start();
    setIsBeginning(swiperRef.current.isBeginning);
    setIsEnd(swiperRef.current.isEnd);
  };

  const handlePrev = () => {
    if (!swiperRef.current) return;
    swiperRef.current.slidePrev();
    swiperRef.current.autoplay.start();
    setIsBeginning(swiperRef.current.isBeginning);
    setIsEnd(swiperRef.current.isEnd);
  };

  return (
    <section className="w-full py-16 px-4 bg-gradient-to-r from-[#5a082a] via-[#8D0B41] to-[#a63b1e]">
      {/* Header + Buttons */}
      <div className="w-[85%] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase text-[var(--color-ochre)] mb-2">
            Our Team
          </p>
          <h2 className="text-4xl md:text-5xl font-semibold text-white">
            Meet <span className="text-[var(--color-ochre)]">our Team</span>
          </h2>
          <h3 className="text-3xl md:text-4xl font-light text-[var(--color-lightcream)]">
            Passionate. Proactive. Expert.
          </h3>
          <p className="text-white mt-4 max-w-2xl text-lg">
            We lead with care — our core value — and a shared passion for
            connecting the world.
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <button
            onClick={handlePrev}
            disabled={isBeginning}
            className={`p-3 rounded-full border shadow-sm transition ${
              isBeginning
                ? "bg-gray-100 border-gray-200 cursor-not-allowed opacity-50"
                : "bg-white border-gray-300 hover:bg-gray-100"
            }`}
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          <button
            onClick={handleNext}
            disabled={isEnd}
            className={`p-3 rounded-full border shadow-sm transition ${
              isEnd
                ? "bg-gray-100 border-gray-200 cursor-not-allowed opacity-50"
                : "bg-white border-gray-300 hover:bg-gray-100"
            }`}
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Swiper Slider */}
      <div className="max-w-7xl mx-auto mt-10">
        <Swiper
          modules={[Autoplay]}
          spaceBetween={30}
          pagination={{ clickable: true }}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }}
          onSlideChange={(swiper) => {
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }}
          onMouseEnter={() => swiperRef.current?.autoplay?.stop()}
          onMouseLeave={() => swiperRef.current?.autoplay?.start()}
          breakpoints={{
            320: { slidesPerView: 1 },
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-10"
        >
          {team.map((member, index) => (
            <SwiperSlide key={index}>
              <div
                className="bg-[var(--color-lightcream)] rounded-2xl p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all duration-300 mb-10"
                onMouseEnter={() => swiperRef.current?.autoplay?.stop()}
                onMouseLeave={() => swiperRef.current?.autoplay?.start()}
              >
                <div className="w-44 h-44 rounded-2xl overflow-hidden mb-5">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={200}
                    height={200}
                    className="object-cover w-full h-full"
                  />
                </div>

                <h3 className="text-xl font-semibold text-gray-900">
                  {member.name}
                </h3>
                <p className="text-gray-500 text-sm mb-3">{member.role}</p>

                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  {member.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="text-gray-600 text-sm leading-relaxed mb-5">
                  {member.desc}
                </p>

                <div className="flex gap-3 flex-wrap justify-center">
                  <button className="flex items-center gap-2 bg-[var(--color-brickred)] text-white px-5 py-2 rounded-full text-sm hover:bg-[var(--color-ochre)] transition">
                    Start Chat <ArrowRight className="w-4 h-4" />
                  </button>
                  <button className="flex items-center gap-2 border border-gray-300 text-gray-700 px-5 py-2 rounded-full text-sm hover:bg-gray-100 transition">
                    <User className="w-4 h-4" /> View Profile
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
