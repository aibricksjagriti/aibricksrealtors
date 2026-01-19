"use client";
import { useEffect, useState } from "react";

export default function ContactModal() {
  const [show, setShow] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // check localStorage
  useEffect(() => {
    const hasSeen = localStorage.getItem("contactModalSeen");
    if (!hasSeen) {
      const timer = setTimeout(() => setShow(true), 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const closeModal = () => {
    localStorage.setItem("contactModalSeen", "true");
    setShow(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    // Add API call here or email logic
    // Example:
    // await fetch("/api/contact", { method: "POST", body: ... });

    setTimeout(() => closeModal(), 1500);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-4 backdrop-blur-md bg-white/10">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          onClick={closeModal}
        >
          ✕
        </button>

        {!submitted ? (
          <>
            <h2 className="text-2xl font-bold text-darkgray text-center mb-4">
              Contact Us
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  // value={formData.name}
                  // onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-[var(--color-brickred)]"
                />
              </div>

              {/* Email */}
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  // value={formData.email}
                  // onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-[var(--color-brickred)]"
                />
              </div>

              {/* Phone */}
              <div>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  maxLength={10}
                  // value={formData.phone}
                  // onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-[var(--color-brickred)]"
                />
              </div>

              {/* Message */}
              <textarea
                name="message"
                rows="4"
                placeholder="Property Requirements"
                //   value={formData.message}
                //   onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-[var(--color-brickred)]"
              />

              <button
                type="submit"
                className="w-full bg-[var(--color-brickred)] text-white py-3 rounded-xl font-semibold hover:bg-[var(--color-ochre)] transition"
              >
                Submit Enquiry
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-6">
            <h3 className="text-xl font-bold text-[#1A73E8]">Thank you!</h3>
            <p className="mt-2 text-gray-700">We’ll get back to you soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}
