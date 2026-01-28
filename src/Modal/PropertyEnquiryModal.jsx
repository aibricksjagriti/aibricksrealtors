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

  if (!isOpen) return null;

  // ✅ Handle input change with phone validation
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Phone: allow only numbers & max 10 digits
    if (name === "phone") {
      const numericValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, phone: numericValue }));
      setError("");
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    // ✅ Final phone validation (important)
    if (!/^\d{10}$/.test(formData.phone)) {
      setError("Phone number must be exactly 10 digits.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/v1/interested", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name || null,
          email: formData.email || null,
          phone: formData.phone || null,
          message: formData.message || null,

          propertyId: property?.id || null,
          propertyTitle: property?.propertyTitle || property?.name || null,
          propertyName: property?.propertyTitle || property?.name || null,
          propertyLocation: property?.locality || property?.location || null,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data?.error || "Failed to submit enquiry");
      }

      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });

      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    setFormData({
      name: "",
      email: "",
      phone: "",
      message: "",
    });
    setError("");
    setSuccess(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-md rounded-2xl bg-white/80 backdrop-blur-xl border shadow-xl p-6"
        >
          <button
            onClick={handleClose}
            disabled={loading}
            className="absolute top-3 right-3 text-gray-700 hover:text-black disabled:opacity-50"
          >
            <X />
          </button>

          <h3 className="text-2xl font-serif font-bold mb-1">
            Property Enquiry
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Interested in{" "}
            <span className="font-semibold">
              {property?.propertyTitle || property?.name}
            </span>
          </p>

          {success && (
            <div className="mb-4 rounded-md border border-green-400 bg-green-100 p-3 text-green-700 text-sm">
              Thank you! Your enquiry has been submitted.
            </div>
          )}

          {error && (
            <div className="mb-4 rounded-md border border-red-400 bg-red-100 p-3 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={loading || success}
              className="w-full rounded-md border px-3 py-2 bg-white focus:ring-2 focus:ring-brickred outline-none"
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading || success}
              className="w-full rounded-md border px-3 py-2 bg-white focus:ring-2 focus:ring-brickred outline-none"
            />

            {/* ✅ Phone number validation */}
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              inputMode="numeric"
              pattern="[0-9]{10}"
              maxLength={10}
              minLength={10}
              required
              disabled={loading || success}
              className="w-full rounded-md border px-3 py-2 bg-white focus:ring-2 focus:ring-brickred outline-none"
            />

            <input
              readOnly
              value={`${property?.propertyTitle || property?.name || ""} - ${property?.locality || property?.location || ""}`}
              className="w-full rounded-md border px-3 py-2 bg-gray-200 text-gray-700"
            />

            <textarea
              name="message"
              rows="3"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              disabled={loading || success}
              className="w-full rounded-md border px-3 py-2 bg-white focus:ring-2 focus:ring-brickred outline-none"
            />

            <button
              type="submit"
              disabled={loading || success}
              className="w-full rounded-md bg-brickred py-2 text-white hover:bg-ochre transition disabled:opacity-50"
            >
              {loading
                ? "Submitting..."
                : success
                  ? "Submitted!"
                  : "Submit Enquiry"}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
