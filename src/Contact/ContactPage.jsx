"use client";
import { useState } from "react";

const INITIAL_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  message: "",
};

export default function ContactPage() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const validateForm = () => {
    if (!form.firstName || !form.lastName || !form.email || !form.phone) {
      return "First name, last name, email, and phone are required.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/v1/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to submit contact form");
      }

      setSuccess(true);
      setForm(INITIAL_FORM);

      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen text-gray-900 flex items-center justify-center px-6 lg:px-20 py-16">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-10 items-start">
        {/* Left Section */}
        <div className="overflow-hidden shadow-lg rounded-3xl">
          <img
            src="/home/dubai.webp"
            alt="Modern Building"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-gray-50 rounded-3xl shadow-md p-8 space-y-5"
        >
          <h3 className="text-4xl font-semibold">Let’s Get In Touch.</h3>
          <p className="text-gray-600">
            Or email us at{" "}
            <a
              href="mailto:info@aibricksrealtors.com"
              className="text-indigo-600 font-medium"
            >
              info@aibricksrealtors.com
            </a>
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="First name"
              className="input"
            />
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Last name"
              className="input"
            />
          </div>

          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email address"
            className="input"
          />

          <input
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone number"
            className="input"
          />

          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Your message (optional)"
            rows={4}
            maxLength={300}
            className="input resize-none"
          />

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">
              Thanks! Your message has been sent successfully.
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brickred text-white text-lg py-3 rounded-xl hover:bg-ochre transition disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Form →"}
          </button>
        </form>
      </div>

      {/* Small utility styles */}
      <style jsx>{`
        .input {
          width: 100%;
          padding: 0.75rem;
          border-radius: 0.75rem;
          border: 1px solid #d1d5db;
          outline: none;
        }
        .input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.3);
        }
      `}</style>
    </section>
  );
}
