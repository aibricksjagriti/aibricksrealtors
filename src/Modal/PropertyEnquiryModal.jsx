"use client";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function PropertyEnquiryModal({ isOpen, onClose, property }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const response = await fetch(`${apiUrl}/api/v1/interested`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name || null,
          email: formData.email || null,
          phone: formData.phone || null,
          propertyId: property?.id || null,
          propertyName: property?.propertyTitle || null,
          propertyLocation: property?.locality || null,
          message: formData.message || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit enquiry");
      }

      // Success
      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });

      // Close modal after 2 seconds
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
      setError("");
      setSuccess(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center px-4 backdrop-blur-md bg-black/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
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
            onClick={handleClose}
            disabled={loading}
            className="absolute top-3 right-3 text-gray-700 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X />
          </button>

          {/* Header */}
          <h3 className="text-2xl font-serif font-bold text-[var(--color-darkgray)] mb-1">
            Property Enquiry
          </h3>
          <p className="text-gray-700 mb-4 text-sm">
            Interested in{" "}
            <span className="font-semibold">
              {property?.propertyTitle || property?.name}
            </span>
          </p>

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
              <p className="text-sm font-medium">
                Thank you! Your enquiry has been submitted successfully.
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={loading || success}
              className="w-full rounded-md px-3 py-2 bg-white/70 border focus:ring-2 focus:ring-[var(--color-brickred)] outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              required
              onChange={handleChange}
              disabled={loading || success}
              className="w-full rounded-md px-3 py-2 bg-white/70 border focus:ring-2 focus:ring-[var(--color-brickred)] outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            />

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              required
              onChange={handleChange}
              disabled={loading || success}
              className="w-full rounded-md px-3 py-2 bg-white/70 border focus:ring-2 focus:ring-[var(--color-brickred)] outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            />

            {/* Auto-filled Property Info */}
            <input
              type="text"
              value={`${property?.propertyTitle || property?.name || ""} - ${property?.locality || property?.location || ""}`}
              readOnly
              className="w-full rounded-md px-3 py-2 bg-gray-200 border text-gray-700 cursor-not-allowed"
            />

            <textarea
              name="message"
              rows="3"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              disabled={loading || success}
              className="w-full rounded-md px-3 py-2 bg-white/70 border focus:ring-2 focus:ring-[var(--color-brickred)] outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            />

            <button
              type="submit"
              disabled={loading || success}
              className="w-full bg-[var(--color-brickred)] text-white py-2 rounded-md hover:bg-[var(--color-ochre)] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : success ? "Submitted!" : "Submit Enquiry"}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
