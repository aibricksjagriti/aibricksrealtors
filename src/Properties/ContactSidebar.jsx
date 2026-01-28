"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ContactSidebar({ property }) {
  const [mounted, setMounted] = useState(false);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  //  Allow numbers only + max 10 digits
  const handlePhoneChange = (e) => {
    const numericValue = e.target.value.replace(/\D/g, "");
    if (numericValue.length > 10) return;
    setPhone(numericValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!phone) {
      toast.error("Please enter your phone number");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      toast.error("Phone number must be exactly 10 digits");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/v1/call-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: phone,
          propertyId: property?.id || null,
          propertyTitle: property?.propertyTitle || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to submit request");
      }

      toast.success("Request received! We’ll call you shortly!");
      setPhone("");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <h3 className="text-xl font-semibold text-darkGray mb-2">
        Call Me Instantly
      </h3>

      <p className="text-md text-gray-500 mb-4">
        Our executive will call you right now
      </p>

      <form onSubmit={handleSubmit}>
        <input
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={10}
          placeholder="Enter phone number"
          className="w-full border rounded-lg px-4 py-3 mb-3 focus:outline-none focus:ring-2 focus:ring-brickred"
          value={phone}
          onChange={handlePhoneChange}
          disabled={loading}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brickred text-white py-3 rounded-lg font-semibold hover:bg-ochre transition disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? "Requesting..." : "Call Me Now"}
        </button>
      </form>
    </div>
  );
}
