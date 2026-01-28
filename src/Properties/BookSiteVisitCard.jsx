"use client";

import { useState, useRef, useEffect } from "react";
import { Calendar as CalendarIcon, Search } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import "react-day-picker/dist/style.css";
import toast, { Toaster } from "react-hot-toast";

const TIME_SLOTS = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "01:00 PM",
  "01:30 PM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
  "05:00 PM",
  "05:30 PM",
  "06:00 PM",
  "06:30 PM",
];

export default function BookSiteVisitCard() {
  const router = useRouter();
  const inputRef = useRef(null);

  const [activeTab, setActiveTab] = useState("site");
  const [searchText, setSearchText] = useState("");
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState("");
  const [cabRequired, setCabRequired] = useState("yes");
  const [showCalendar, setShowCalendar] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("calendar");

  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const [submitError, setSubmitError] = useState("");

  /* ---------------- SEARCH API ---------------- */

  async function getProperties() {
    try {
      let url;

      //  Prefer public API URL if available
      if (process.env.NEXT_PUBLIC_API_URL) {
        url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/properties`;
      } else {
        //  Client-safe fallback (relative URL)
        url = `/api/v1/properties`;
      }

      const res = await fetch(url, {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(`API failed with status ${res.status}`);
      }

      const text = await res.text();

      // Prevent JSON crash
      if (!text || text.startsWith("<")) {
        throw new Error("Invalid JSON response");
      }

      return JSON.parse(text);
    } catch (error) {
      console.error("Error fetching properties:", error);
      return null; //  client should not throw
    }
  }

  useEffect(() => {
    if (!searchText.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const delay = setTimeout(async () => {
      const data = await getProperties();

      if (!data?.success || !Array.isArray(data.data)) return;

      const filtered = data.data.filter((item) =>
        item.propertyTitle?.toLowerCase().includes(searchText.toLowerCase()),
      );

      setSuggestions(filtered);
      setShowSuggestions(true);
    }, 400);

    return () => clearTimeout(delay);
  }, [searchText]);

  /* ---------------- HANDLERS ---------------- */

  const handleSelect = (item) => {
    setSearchText(item.propertyTitle);
    setSelectedProperty(item);
    setShowSuggestions(false);
    setError("");
  };

  const toggleCalendar = () => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setOpenUpward(window.innerHeight - rect.bottom < 350);
    }
    setStep("calendar");
    setShowCalendar(true);
  };

  const handleSubmit = () => {
    if (!selectedProperty) {
      setError("Please select a property first.");
      return;
    }

    if (!selectedSlot) {
      setError("Please select date & time.");
      return;
    }

    setShowCalendar(false);
    setError("");
    setShowModal(true); // 🔥 open modal

    // console.log({
    //   property: selectedProperty,
    //   date: selectedDate,
    //   time: selectedSlot,
    // });

    // router.push("/thank-you");
  };

  const handlePhoneChange = (e) => {
    const numericValue = e.target.value.replace(/\D/g, "");
    if (numericValue.length > 10) return;
    setForm({ ...form, phone: numericValue });
    setSubmitError("");
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  };

  const submitSiteVisit = async () => {
    if (!form.name || !form.phone || !form.email) {
      setSubmitError("All fields are required");
      return;
    }

    if (!/^\d{10}$/.test(form.phone)) {
      setSubmitError("Phone number must be exactly 10 digits");
      return;
    }

    if (!isValidEmail(form.email)) {
      setSubmitError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/v1/schedule-visit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          propertyId: selectedProperty?.id || null,
          date: format(selectedDate, "yyyy-MM-dd"),
          time: selectedSlot,
          cabRequired,
          message: "Booked via website",
        }),
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        setSubmitError(data?.error || "Booking failed");
        return;
      }

      toast.success("Site visit booked successfully!");
      setShowModal(false);
      setForm({ name: "", phone: "", email: "" });
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-md p-6 relative">
      {/* Tabs */}
      <div className="flex rounded-lg overflow-hidden border mb-5">
        <button
          onClick={() => setActiveTab("site")}
          className={`flex-1 py-2 text-lg font-medium transition ${
            activeTab === "site"
              ? "bg-white text-textDark border-b-2 border-ochre"
              : "bg-gray-100 text-gray-400"
          }`}
        >
          Book Free Site Visit
        </button>
      </div>
      {/* Search */}
      <div className="relative mb-4">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          placeholder="Search projects"
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            setSelectedProperty(null);
          }}
          className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-100 text-sm"
        />

        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {suggestions.map((item) => (
              <li
                key={item.id}
                onClick={() => handleSelect(item)}
                className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
              >
                {item.propertyTitle}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Date & Time */}
      <div className="relative mb-4" ref={inputRef}>
        <CalendarIcon
          size={18}
          onClick={toggleCalendar}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-brickred cursor-pointer"
        />

        <input
          readOnly
          value={
            selectedSlot
              ? `${format(selectedDate, "dd-MM-yyyy")} | ${selectedSlot}`
              : format(selectedDate, "dd-MM-yyyy")
          }
          onClick={toggleCalendar}
          className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-100 cursor-pointer"
        />

        {showCalendar && (
          <div
            className="fixed inset-0 z-[99999] flex items-start justify-center bg-black/30"
            onClick={() => setShowCalendar(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="mt-24 bg-white rounded-xl shadow-2xl p-4 w-[95%] max-w-md"
            >
              {step === "calendar" && (
                <>
                  <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={{ before: new Date() }}
                  />

                  <div className="flex justify-end gap-3 mt-4">
                    <button
                      onClick={() => setShowCalendar(false)}
                      className="px-4 py-2 border rounded"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => setStep("slots")}
                      className="px-4 py-2 bg-brickred text-white rounded"
                    >
                      Next
                    </button>
                  </div>
                </>
              )}

              {step === "slots" && (
                <>
                  <div className="grid grid-cols-4 gap-3">
                    {TIME_SLOTS.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2 rounded text-xs border ${
                          selectedSlot === slot
                            ? "bg-brickred text-white"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-end gap-3 mt-4">
                    <button
                      onClick={() => setStep("calendar")}
                      className="px-4 py-2 border rounded"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setShowCalendar(false)}
                      className="px-4 py-2 bg-brickred text-white rounded"
                    >
                      Done
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      {/* Transport */}
      <div className="flex items-center gap-6 mb-4">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="radio"
            name="transport"
            value="yes"
            checked={cabRequired === "yes"}
            onChange={() => setCabRequired("yes")}
            className="accent-brickred"
          />
          Cab
        </label>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="radio"
            name="transport"
            value="no"
            checked={cabRequired === "no"}
            onChange={() => setCabRequired("no")}
            className="accent-brickred"
          />
          Not Required
        </label>
      </div>

      {/* Benefits */}
      <ul className="text-sm text-brickred space-y-1 mb-5 list-disc list-inside">
        <li>Free Pick Up & Drop - Book Personal Cab</li>
        <li>Visit Your Selected 3 Projects in One Tour</li>
        <li>Just Visit & Decide later</li>
      </ul>

      {/* CTA */}
      <button
        onClick={handleSubmit}
        className="w-full bg-ochre hover:bg-brickred transition text-white py-3 rounded-full font-semibold"
      >
        Book Site Visit
      </button>

      <p className="text-xs text-center text-gray-400 mt-3">
        By continuing, you agree to our{" "}
        <span className="text-brickred underline cursor-pointer">
          Terms & Conditions
        </span>
      </p>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[99999]">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-md relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3"
            >
              ✕
            </button>

            <h3 className="text-lg font-semibold mb-4">Book Free Site Visit</h3>

            <input
              type="text"
              placeholder="Enter name"
              value={form.name}
              className="w-full mb-3 p-3 bg-gray-100 rounded"
              onChange={(e) => {
                setForm({ ...form, name: e.target.value });
                setSubmitError("");
              }}
            />

            <input
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={10}
              placeholder="Phone number"
              value={form.phone}
              className="w-full mb-3 p-3 bg-gray-100 rounded"
              onChange={handlePhoneChange}
            />

            <input
              type="email"
              placeholder="Email address"
              value={form.email}
              className="w-full mb-4 p-3 bg-gray-100 rounded"
              onChange={(e) => {
                setForm({ ...form, email: e.target.value.trim() });
                setSubmitError("");
              }}
            />

            {submitError && (
              <p className="text-red-500 text-sm mb-2">{submitError}</p>
            )}

            <button
              onClick={submitSiteVisit}
              disabled={loading}
              className="w-full bg-brickred text-white py-3 rounded"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
