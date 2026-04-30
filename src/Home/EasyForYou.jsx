"use client";

import { Home } from "lucide-react";
import Link from "next/link";

export default function EasyForYou() {
  return (
    <section className="py-16 px-6 sm:px-10 md:px-20 flex flex-col items-center text-center">
      {/* Heading Section */}
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--color-darkgray)] leading-tight mb-4">
        We make it easy for <br className="sm:hidden" />
        <span className="text-6xl sm:text-7xl font-extrabold text-[var(--color-darkgray)]">
          You
        </span>
      </h2>

      <p className="text-gray-800 max-w-3xl text-sm sm:text-base md:text-lg mb-12">
        Whether it’s selling your current home, getting financing, or buying a
        new home, we make it easy and efficient. The best part? You’ll save a
        bunch of money and time with our services.
      </p>

      {/* Cards Section */}

      <div className="max-w-5xl w-full">
        <Link href="/contact">
          <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-8 flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#e9eaff] flex items-center justify-center">
              <Home className="text-[var(--color-ochre)]" size={24} />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-lg text-gray-900 mb-1">
                Find the best deal
              </h3>
              <p className="text-gray-800 text-sm sm:text-base">
                Browse thousands of properties, save your favorites and set up
                search alerts so you don’t miss the best home deal!
              </p>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
