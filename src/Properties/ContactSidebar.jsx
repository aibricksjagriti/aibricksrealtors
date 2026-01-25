"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function ContactSidebar({ property }) {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!phone) {
      toast.error("Please enter a phone number");
      return;
    }

    if (phone.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/v1/call-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: phone,
          propertyId: property?.id,
          propertyTitle: property?.propertyTitle,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to submit request");

      toast.success("Request received! We will call you shortly.");
      setPhone("");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" bg-white rounded-xl shadow-sm p-5">
      <h3 className="text-xl font-semibold text-darkGray mb-3">
        Call Me Instantly
      </h3>

      <p className="text-md text-gray-500 mb-4">
        Our executive will call you right now
      </p>

      <input
        type="tel"
        placeholder="Enter Phone Number"
        className="w-full border rounded-lg px-4 py-3 mb-3 focus:outline-none focus:ring-2 focus:ring-[var(--brick-red)]"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <button 
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-brickred text-white py-3 rounded-lg font-semibold hover:bg-ochre transition disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? "Requesting..." : "Call Me Now"}
      </button>

      {/* <div className="mt-5 border-t pt-4">
        <button className="w-full border border-brickred text-brickred py-3 rounded-lg hover:bg-ochre hover:text-white transition">
          Book Free Site Visit
        </button>
      </div> */}
    </div>
  );
}
