"use client";

import { useState } from "react";
import { X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function BookSiteVisitModal({ isOpen, onClose, property }) {
  const [step, setStep] = useState(1);

  const [visitDate, setVisitDate] = useState("");
  const [cabRequired, setCabRequired] = useState("yes");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setStep(1);
    setVisitDate("");
    setCabRequired("yes");
    setPhone("");
    setName("");
    setEmail("");
  };

  const handleSubmit = async () => {
    try {
      if (!name || !phone || !visitDate) {
        toast.error("Name, phone and visit date are required");
        return;
      }

      setLoading(true);

      const payload = {
        name,
        phone,
        email,
        propertyId: property?.id || null,
        date: visitDate.split("T")[0], // YYYY-MM-DD
        time: visitDate.split("T")[1] || "", // HH:MM
        message: "Booked from website",
      };

      const res = await fetch("/api/v1/schedule-visit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("API Error:", data);
        throw new Error(data?.error || "Booking failed");
      }

      toast.success("Site visit booked successfully!");
      resetForm();
      onClose();
    } catch (error) {
      console.error("BOOKING ERROR:", error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/10 flex items-center justify-center px-3">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl relative overflow-hidden h-[520px] mt-10">
        <button
          onClick={() => {
            resetForm();
            onClose();
          }}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          <X size={22} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="hidden md:block bg-[#f2f5f9]">
            <img src="/1.png" alt="Site Visit" className="w-full h-full " />
          </div>

          <div className="p-6 md:p-10">
            {step === 1 && (
              <>
                <h2 className="text-2xl font-semibold mb-4">
                  Book Free Site Visit
                </h2>

                <div className="mb-4">
                  <label className="text-md text-gray-500">
                    Selected Project
                  </label>
                  <div className="mt-1 bg-gray-100 px-3 py-2 rounded">
                    {property?.propertyTitle}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="text-md text-gray-500">Visit Date</label>
                  <input
                    type="datetime-local"
                    className="w-full mt-1 border rounded px-3 py-2"
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <label className="text-md font-medium block mb-2">
                    Pick & Drop
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={cabRequired === "yes"}
                        onChange={() => setCabRequired("yes")}
                        className="accent-brickred"
                      />
                      Cab
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={cabRequired === "no"}
                        onChange={() => setCabRequired("no")}
                        className="accent-brickred"
                      />
                      Not Required
                    </label>
                  </div>
                </div>

                {/* Info */}
                <ul className="text-md text-gray-600 space-y-1 mb-5">
                  <li>• Free Pick Up & Drop</li>
                  <li>• Visit up to 3 projects</li>
                  <li>• No brokerage</li>
                </ul>

                <button
                  onClick={() => setStep(2)}
                  className="w-full bg-brickred text-white py-3 rounded-lg cursor-pointer"
                >
                  Book Site Visit
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="text-2xl font-semibold mb-6">
                  Enter Your Details
                </h2>

                {/* Phone */}
                <div className="mb-4">
                  <label className="block text-md text-gray-600 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter phone number"
                    className="w-full border-2 border-ochre rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brickred"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                {/* Name */}
                <div className="mb-4">
                  <label className="block text-md text-gray-600 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="w-full border-2 border-ochre rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brickred"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                {/* Email */}
                <div className="mb-6">
                  <label className="block text-md text-gray-600 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Enter email address"
                    className="w-full border-2 border-ochre rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brickred"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(1)}
                    className="w-1/2 bg-gray-200 py-3 rounded-lg font-medium hover:bg-gray-300 transition cursor-pointer"
                  >
                    Back
                  </button>

                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-1/2 bg-brickred text-white py-3 rounded-lg font-medium hover:opacity-90 cursor-pointer transition"
                  >
                    {loading ? "Submitting..." : "Submit"}
                  </button>
                </div>

                <p className="text-xs text-center mt-4 text-gray-500">
                  By continuing you agree to our{" "}
                  <span className="text-brickred cursor-pointer">
                    Terms & Conditions
                  </span>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
