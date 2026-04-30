"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import CtaModal from "../Modal/CtaModal";

export default function Cta() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* CTA Section */}
      <section className="relative h-[70vh] w-full flex items-center justify-center text-center overflow-hidden">
        <Image
          src="/home/cta-banner-3.jpg"
          alt="AI Bricks Background"
          fill
          sizes="100vw"
          className="object-cover brightness-[0.55]"
        />

        <div className="relative z-10 max-w-4xl px-4 text-white flex flex-col items-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-lg sm:text-xl md:text-2xl mb-4"
          >
            Live The Future
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-serif mb-8"
          >
            AI BRICKS
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="text-xl sm:text-2xl md:text-2xl lg:text-3xl font-bold font-serif mb-8"
          >
            Hunt For Properties
          </motion.h2>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 bg-[var(--color-brickred)] text-white font-semibold px-6 sm:px-10 py-3 sm:py-4 rounded-2xl shadow-lg hover:bg-[var(--color-ochre)]"
          >
            Connect With Us
            <ArrowRight size={18} />
          </motion.button>
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent" />
      </section>

      {/* Modal */}
      <CtaModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
