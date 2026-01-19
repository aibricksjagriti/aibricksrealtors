"use client";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PropertyEnquiryModal({ isOpen, onClose, property }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center px-4 backdrop-blur-md bg-black/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="
            relative w-full max-w-md 
            rounded-2xl 
            bg-white/30 backdrop-blur-xl 
            border border-white/30 
            shadow-2xl 
            p-6
          "
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-700 hover:text-black"
          >
            <X />
          </button>

          {/* Header */}
          <h3 className="text-2xl font-serif font-bold text-[var(--color-darkgray)] mb-1">
            Property Enquiry
          </h3>
          <p className="text-gray-700 mb-4 text-sm">
            Interested in{" "}
            <span className="font-semibold">{property?.name}</span>
          </p>

          {/* Form */}
          <form className="space-y-3">
            <input
              type="text"
              placeholder="Your Name"
              required
              className="w-full rounded-md px-3 py-2 bg-white/70 border focus:ring-2 focus:ring-[var(--color-brickred)] outline-none"
            />

            <input
              type="email"
              placeholder="Email Address"
              required
              className="w-full rounded-md px-3 py-2 bg-white/70 border focus:ring-2 focus:ring-[var(--color-brickred)] outline-none"
            />

            <input
              type="tel"
              placeholder="Phone Number"
              required
              className="w-full rounded-md px-3 py-2 bg-white/70 border focus:ring-2 focus:ring-[var(--color-brickred)] outline-none"
            />

            {/* Auto-filled */}
            <input
              type="text"
              value={`${property?.name} - ${property?.location}`}
              readOnly
              className="w-full rounded-md px-3 py-2 bg-gray-200 border text-gray-700"
            />

            <textarea
              rows="3"
              placeholder="Your Message"
              className="w-full rounded-md px-3 py-2 bg-white/70 border focus:ring-2 focus:ring-[var(--color-brickred)] outline-none"
            />

            <button
              type="submit"
              className="w-full bg-[var(--color-brickred)] text-white py-2 rounded-md hover:bg-[var(--color-ochre)] transition"
            >
              Submit Enquiry
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
