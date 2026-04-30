"use client";

import { useEffect, useState } from "react";
import { Menu, X, Home, ChevronLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

const sections = [
  { id: "overview", label: "OVERVIEW" },
  { id: "location", label: "LOCATION" },
  { id: "amenities", label: "AMENITIES" },
  { id: "pricing", label: "PRICING" },
  { id: "gallery", label: "GALLERY" },
  { id: "faq", label: "FAQ" },
];

export default function PropertySectionNav() {
  const [active, setActive] = useState("overview");
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const { id } = useParams(); // ✅ get property id

  // ✅ FETCH PROPERTY TITLE WITH TANSTACK QUERY
  const { data: property } = useQuery({
    queryKey: ["property", id],
    queryFn: async () => {
      const res = await fetch(`/api/v1/properties/${id}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      return data?.data || null;
    },
    enabled: !!id,
  });

  const propertyTitle = property?.propertyTitle || "Property Details";

  // ✅ SCROLL SPY
  useEffect(() => {
    const handleScroll = () => {
      let current = "overview";

      sections.forEach((section) => {
        const el = document.getElementById(section.id);
        if (el) {
          const offsetTop = el.offsetTop - 120;
          if (window.scrollY >= offsetTop) {
            current = section.id;
          }
        }
      });

      setActive(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ SCROLL FUNCTION
  const scrollToSection = (id) => {
    setIsOpen(false);

    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 100,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full bg-[var(--color-brickred)] shadow-md z-50">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center gap-4">
          {/* ✅ BACK BUTTON + PROPERTY NAME */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => router.back()}
              title="Go back"
              className="flex-shrink-0 p-2 hover:bg-[var(--color-ochre)]/20 rounded-lg transition text-[var(--color-ochre)]"
            >
              <ChevronLeft size={24} />
            </button>
            <div className="text-lg md:text-2xl font-bold text-[var(--color-ochre)] truncate">
              {propertyTitle || "Loading..."}
            </div>
          </div>

          {/* DESKTOP MENU */}
          <div className="hidden lg:flex items-center gap-6">
            {sections.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`font-sans text-sm transition-colors ${
                  active === item.id
                    ? "text-[var(--color-ochre)]"
                    : "text-[var(--color-lightcream)] hover:text-[var(--color-ochre)]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setIsOpen(true)}
            className="lg:hidden text-white"
          >
            <Menu size={26} />
          </button>
        </div>
      </nav>

      {/* MOBILE OVERLAY */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* MOBILE DRAWER */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white z-50 transition-transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between p-5 border-b">
          <span className="font-semibold">Menu</span>
          <X onClick={() => setIsOpen(false)} />
        </div>

        <div className="flex flex-col p-6 gap-4 text-md">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 text-brickred font-semibold pb-4 border-b"
          >
            <Home size={20} /> Back to Home
          </Link>
          {sections.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`text-left ${
                active === item.id
                  ? "text-[var(--color-ochre)] font-semibold"
                  : "text-gray-700"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
