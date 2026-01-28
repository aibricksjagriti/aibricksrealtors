"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";

export default function BookSiteVisitModal({ isOpen, onClose, property }) {
  const [step, setStep] = useState(1);
  const [visitDate, setVisitDate] = useState("");
  const [cabRequired, setCabRequired] = useState("yes");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [minDateTime, setMinDateTime] = useState("");

  /* ------------------ Helpers ------------------ */
  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 15);

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

  /* ------------------ Effects ------------------ */
  useEffect(() => {
    if (isOpen) {
      setMinDateTime(getMinDateTime());
      resetForm();
    }
  }, [isOpen]);

  /* ------------------ Reset ------------------ */
  const resetForm = () => {
    setStep(1);
    setVisitDate("");
    setCabRequired("yes");
    setPhone("");
    setName("");
    setEmail("");
    setLoading(false);
  };

  /* ------------------ Step 1 Next ------------------ */
  const handleNext = () => {
    if (!visitDate) {
      toast.error("Please select visit date & time");
      return;
    }
    setStep(2);
  };

  /* ------------------ Phone Handler ------------------ */
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length > 10) return;
    setPhone(value);
  };

  /* ------------------ Submit ------------------ */
  const handleSubmit = async () => {
    if (!phone || !name || !email || !visitDate) {
      toast.error("All fields are required");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      toast.error("Phone number must be exactly 10 digits");
      return;
    }

    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: name.trim(),
        phone,
        email: email.trim(),
        propertyId: property?.id || null,
        date: visitDate.split("T")[0],
        time: visitDate.split("T")[1],
        cabRequired,
        message: "Booked from website",
      };

      const res = await fetch("/api/v1/schedule-visit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        throw new Error(data?.error || "Booking failed");
      }

      toast.success("Site visit booked successfully!");
      resetForm();
      onClose();
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/20 flex items-center justify-center px-3">
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
          {/* Left Image */}
          <div className="hidden md:block bg-[#f2f5f9]">
            <img
              src="/1.png"
              alt="Site Visit"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right Form */}
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
                  <label className="text-md text-gray-500">
                    Visit Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full mt-1 border rounded px-3 py-2"
                    value={visitDate}
                    min={minDateTime}
                    onChange={(e) => setVisitDate(e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <label className="text-md font-medium block mb-2">
                    Pick & Drop *
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
                  onClick={handleNext}
                  className="w-full bg-brickred text-white py-3 rounded-lg"
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

                <input
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={10}
                  className="w-full mb-4 border-2 border-ochre rounded-lg px-4 py-3"
                  placeholder="Phone Number *"
                  value={phone}
                  onChange={handlePhoneChange}
                />

                <input
                  className="w-full mb-4 border-2 border-ochre rounded-lg px-4 py-3"
                  placeholder="Full Name *"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <input
                  type="email"
                  className="w-full mb-6 border-2 border-ochre rounded-lg px-4 py-3"
                  placeholder="Email Address *"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.trim())}
                />

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(1)}
                    className="w-1/2 bg-gray-200 py-3 rounded-lg"
                  >
                    Back
                  </button>

                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-1/2 bg-brickred text-white py-3 rounded-lg"
                  >
                    {loading ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
