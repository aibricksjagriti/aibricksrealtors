"use client";
import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const response = await fetch(`${apiUrl}/api/v1/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || data.errors?.[0]?.msg || "Failed to submit form"
        );
      }

      // Success
      setSuccess(true);
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
      });

      // Reset success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen text-gray-900 flex flex-col items-center justify-center px-6 lg:px-20 py-16 ">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-10 items-start ">
        {/* Left Side Image + Info */}
        <div className="space-y-10">
          <div className="overflow-hidden shadow-lg">
            <img
              src="/home/dubai.webp"
              alt="Modern Building"
              className="w-full h-full object-cover"
            />
          </div>

          {/* <div className="space-y-6">
            <h2 className="text-3xl font-semibold">
              We’d Love to Hear From You.
            </h2>
            <p className="text-gray-600">
              Or just reach out manually to{" "}
              <a
                href="mailto:hello@aibricksrealtors.com"
                className="text-indigo-600 font-medium"
              >
                hello@aibricksrealtors.com
              </a>
              .
            </p>

            <div className="grid sm:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-1">Email Support</h4>
                <p className="text-sm text-gray-600">
                  Our team can respond in real time.
                </p>
                <a
                  href="mailto:hello@aibricksrealtors.com"
                  className="text-indigo-600 text-sm"
                >
                  hello@aibricksrealtors.com
                </a>
              </div>

              <div>
                <h4 className="font-semibold mb-1">Visit Our Office</h4>
                <p className="text-sm text-gray-600">
                  Visit our location in real life.
                </p>
                <p className="text-sm">22th Elementary Avenue, NY</p>
              </div>

              <div>
                <h4 className="font-semibold mb-1">Call Us Directly</h4>
                <p className="text-sm text-gray-600">Available during hours.</p>
                <p className="text-sm">(+1) 234 - 4567 - 789</p>
              </div>
            </div>
          </div> */}
        </div>

        {/* Right Side Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-gray-50 rounded-3xl shadow-md p-8 space-y-5"
        >
          <h3 className="text-4xl font-semibold mb-4">Let’s Get In Touch.</h3>
          <p className="text-md text-gray-600 mb-6">
            Or just reach out manually to{" "}
            <a
              href="mailto:info@aibricksrealtors.com"
              className="text-indigo-600 font-medium"
            >
              info@aibricksrealtors.com
            </a>
            .
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="firstName"
              placeholder="Enter your first name"
              value={form.firstName}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Enter your last name"
              value={form.lastName}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <input
            type="email"
            name="email"
            placeholder="Enter your email address"
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <input
            type="tel"
            name="phone"
            placeholder="+44 (000) 000-0000"
            value={form.phone}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <textarea
            name="message"
            placeholder="Enter your main text here..."
            rows="4"
            maxLength="300"
            value={form.message}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">
              Form submitted successfully! We'll get back to you soon.
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--color-brickred)] text-white text-lg py-3 rounded-xl hover:bg-[var(--color-ochre)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Submitting..." : "Submit Form →"}
          </button>
        </form>
      </div>
    </section>
  );
}
