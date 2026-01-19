"use client";
import { motion } from "framer-motion";

export default function ComingSoon() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-[var(--color-lightcream)] text-[var(--color-darkgray)] overflow-hidden px-6">
      {/* Soft Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-lightcream)] via-[#f9efd9] to-[var(--color-ochre)] opacity-[0.15] animate-pulse-slow"></div>

      {/* Main Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center space-y-8"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        {/* Heading */}
        <h1 className="text-5xl md:text-7xl font-serif font-bold text-[var(--color-lightgray)] tracking-wide drop-shadow-sm">
          Coming Soon
        </h1>
        <p className="text-lg md:text-xl max-w-xl text-[var(--color-darkgray)] font-sans font-500">
          We’re building something extraordinary — stay tuned for the grand
          reveal.
        </p>

        {/* Countdown */}
        <div className="flex gap-6 md:gap-10 mt-4">
          {[
            { label: "Days", value: "15" },
            { label: "Hours", value: "12" },
            { label: "Minutes", value: "45" },
          ].map((item) => (
            <motion.div
              key={item.label}
              className="flex flex-col items-center"
              whileHover={{ scale: 1.08 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <span className="text-5xl md:text-6xl font-serif font-bold text-[var(--color-brickred)] drop-shadow-md">
                {item.value}
              </span>
              <span className="text-xs md:text-sm uppercase tracking-widest text-[var(--color-darkgray)]">
                {item.label}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Email Subscribe Section */}
        {/* <form className="mt-10 flex flex-col sm:flex-row items-center gap-3 w-full max-w-md">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-3 rounded-lg border border-[var(--color-ochre)] bg-white/90 text-[var(--color-darkgray)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brickred)] transition-shadow duration-300 shadow-sm"
          />
          <button
            type="submit"
            className="btn-primary px-6 py-3 rounded-lg text-sm font-semibold"
          >
            Notify Me
          </button>
        </form> */}

        {/* Footer */}
        <footer className="pt-10 text-sm text-[var(--color-darkgray)] opacity-75 font-sans">
          © {new Date().getFullYear()} AI Bricks. All rights reserved.
        </footer>
      </motion.div>

      {/* Luxury Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 w-[500px] h-[500px] bg-[var(--color-ochre)] opacity-20 blur-[120px] rounded-full -translate-x-1/2 -z-0"></div>
    </div>
  );
}
