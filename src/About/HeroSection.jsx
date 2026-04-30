"use client";
import { motion } from "framer-motion";
import { useState } from "react";

export default function HeroSection() {
  const [imgError, setImgError] = useState(false);

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        {!imgError && (
          <img
            src="/about/hero-bg.jpg"
            alt=""
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background: imgError
              ? "linear-gradient(135deg, #0d0d1a 0%, #1a1a3a 50%, #0d1a2e 100%)"
              : "rgba(10,10,25,0.75)",
          }}
        />
      </div>

      <motion.div
        className="relative z-10 text-center px-6 max-w-4xl mx-auto py-24"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
          AiBricks Realtors
        </h1>
        <p className="text-xl md:text-2xl text-blue-400 font-medium italic mb-6">
          Building Trust. Delivering Value.
        </p>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
          Pune&apos;s premier real estate advisory firm — connecting discerning
          homebuyers and investors with reputed, verified developers. We don&apos;t
          just sell property; we build lasting relationships.
        </p>
      </motion.div>
    </section>
  );
}
