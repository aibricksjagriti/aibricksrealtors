"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, ChevronLeft } from "lucide-react";
import Link from "next/link";

function slugToName(slug) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function LocationNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const match = pathname?.match(/^\/locations\/([^/]+)/);
  const citySlug = match ? match[1] : null;
  const cityName = citySlug ? slugToName(citySlug) : "Location";

  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-[var(--color-brickred)] shadow-md z-50">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          {/* City name as brand */}
          <div className="text-xl font-bold text-[var(--color-ochre)]">
            {cityName}
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8 text-[var(--color-lightcream)]">
            <Link href="/locations" className="hover:text-[var(--color-ochre)] transition-colors">
              ALL LOCATIONS
            </Link>
            <Link href="/properties" className="hover:text-[var(--color-ochre)] transition-colors">
              PROPERTIES
            </Link>
            <Link href="/" className="hover:text-[var(--color-ochre)] transition-colors">
              HOME
            </Link>
            <Link href="/contact" className="hover:text-[var(--color-ochre)] transition-colors">
              CONTACT
            </Link>
          </div>

          <button onClick={() => setIsOpen(true)} className="md:hidden text-white">
            <Menu size={26} />
          </button>
        </div>
      </nav>

      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setIsOpen(false)} />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white z-50 transition-transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between p-5 border-b items-center">
          <span className="font-semibold">{cityName}</span>
          <X onClick={() => setIsOpen(false)} className="cursor-pointer" size={22} />
        </div>
        <div className="flex flex-col p-6 gap-4 text-darkgray">
          <Link href="/locations" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
            <ChevronLeft size={16} /> All Locations
          </Link>
          <Link href="/properties" onClick={() => setIsOpen(false)}>Properties</Link>
          <Link href="/" onClick={() => setIsOpen(false)}>Home</Link>
          <Link href="/contact" onClick={() => setIsOpen(false)}>Contact</Link>
        </div>
      </div>
    </>
  );
}
