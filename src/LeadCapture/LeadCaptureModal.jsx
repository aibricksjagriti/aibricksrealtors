"use client";

import { useState } from "react";
import toast from "react-hot-toast";

/**
 * Interested-form modal (same backend as PropertyEnquiryModal).
 * POST /api/v1/interested — optional property* fields for listing context.
 * messagePrefix is prepended to the user's message.
 */
export default function LeadCaptureModal({
  open,
  onClose,
  title = "I'm interested",
  subtitle,
  messagePrefix = "",
  submitLabel = "Submit enquiry",
  onSuccess,
  propertyId = null,
  propertyTitle = null,
  propertyName = null,
  propertyLocation = null,
}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    preferredLocation: propertyLocation || "",
    propertyType: "",
    budgetRange: "",
    purchaseTimeline: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const numericValue = value.replace(/\D/g, "").slice(0, 10);
      setForm((prev) => ({ ...prev, phone: numericValue }));
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name?.trim() || !form.phone?.trim() || !form.budgetRange) {
      toast.error("Please fill in name, phone, and budget");
      return;
    }
    if (!/^\d{10}$/.test(form.phone)) {
      toast.error("Phone number must be exactly 10 digits");
      return;
    }
    setSubmitting(true);
    try {
      const combinedMessage = [messagePrefix?.trim(), form.message?.trim()].filter(Boolean).join("\n\n");
      const res = await fetch("/api/v1/interested", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          preferredLocation: form.preferredLocation.trim() || null,
          propertyType: form.propertyType || null,
          budgetRange: form.budgetRange,
          purchaseTimeline: form.purchaseTimeline || null,
          message: combinedMessage || null,
          propertyId: propertyId || null,
          propertyTitle: propertyTitle || null,
          propertyName: propertyName || null,
          propertyLocation: propertyLocation || null,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Submission failed");
      }
      toast.success("Thank you! Your enquiry has been submitted.");
      setForm({ name: "", email: "", phone: "", preferredLocation: "", propertyType: "", budgetRange: "", purchaseTimeline: "", message: "" });
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
            {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-xl leading-none px-1"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Your name *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Email (optional)</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input aria-label="Preferred Location" name="preferredLocation" placeholder="Preferred Location" value={form.preferredLocation} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            <select aria-label="Property Type" name="propertyType" value={form.propertyType} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"><option value="">Property Type</option><option>Apartment</option><option>Villa</option><option>Plot</option><option>Commercial</option></select>
            <select aria-label="Budget Range" name="budgetRange" value={form.budgetRange} onChange={handleChange} required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"><option value="">Budget Range *</option><option>Under ₹50 Lakhs</option><option>₹50 Lakhs - ₹1 Crore</option><option>₹1 - 2 Crores</option><option>₹2 - 4 Crores</option><option>Above ₹4 Crores</option></select>
            <select aria-label="Purchase Timeline" name="purchaseTimeline" value={form.purchaseTimeline} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"><option value="">Purchase Timeline</option><option>Immediately</option><option>Within 3 months</option><option>3 - 6 months</option><option>6 - 12 months</option><option>Just exploring</option></select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Phone (10 digits) *</label>
            <input
              name="phone"
              type="tel"
              inputMode="numeric"
              maxLength={10}
              value={form.phone}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Message (optional)</label>
            <textarea
              name="message"
              rows={3}
              value={form.message}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm resize-none"
              placeholder="Any specific requirements?"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded-lg bg-brickred text-white text-sm font-semibold hover:bg-ochre disabled:opacity-50"
            >
              {submitting ? "Submitting…" : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
