
"use client";

import { useState, useRef, useEffect } from "react";
import { Calendar as CalendarIcon, Search } from "lucide-react";
import { DayPicker } from "react-day-picker";
import {
  format,
  startOfDay,
  isToday,
  parse,
  isAfter,
} from "date-fns";
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

export default function BookSiteVisitCard({ property = null }) {
  const inputRef = useRef(null);

  const [searchText, setSearchText] = useState(
    property?.propertyTitle || ""
  );
  const [selectedProperty, setSelectedProperty] = useState(
    property || null
  );
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [cabRequired, setCabRequired] = useState("yes");
  const [showCalendar, setShowCalendar] = useState(false);
  const [step, setStep] = useState("calendar");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [submitError, setSubmitError] = useState("");

  // Hide past time slots when the selected date is today.
  // Future dates continue to display all time slots.
  const availableTimeSlots = TIME_SLOTS.filter((slot) => {
    if (!selectedDate || !isToday(selectedDate)) {
      return true;
    }

    const slotTime = parse(slot, "hh:mm a", selectedDate);

    return isAfter(slotTime, new Date());
  });

  async function getProperties() {
    try {
      const res = await fetch("/api/v1/properties", {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(`API failed with status ${res.status}`);
      }

      return await res.json();
    } catch (err) {
      console.error("Error fetching properties:", err);
      return null;
    }
  }

  useEffect(() => {
    if (property) return;

    if (!searchText.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const delay = setTimeout(async () => {
      const data = await getProperties();

      if (!data?.success || !Array.isArray(data.data)) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      const filtered = data.data.filter((item) =>
        item.propertyTitle
          ?.toLowerCase()
          .includes(searchText.toLowerCase())
      );

      setSuggestions(filtered);
      setShowSuggestions(true);
    }, 400);

    return () => clearTimeout(delay);
  }, [searchText, property]);

  const handleSelect = (item) => {
    setSearchText(item.propertyTitle);
    setSelectedProperty(item);
    setShowSuggestions(false);
    setError("");
  };

  const toggleCalendar = () => {
    // Highlight today by default when the calendar first opens.
    setSelectedDate(
      (currentDate) => currentDate || startOfDay(new Date())
    );

    setStep("calendar");
    setShowCalendar(true);
    setError("");
  };

  const handleSubmit = () => {
    if (!selectedProperty) {
      setError("Please select a property first.");
      return;
    }

    if (!selectedDate) {
      setError("Please select a date.");
      toggleCalendar();
      return;
    }

    if (!selectedSlot) {
      setError("Please select a time slot.");
      setStep("slots");
      setShowCalendar(true);
      return;
    }

    // Recheck availability before opening the contact form.
    if (!availableTimeSlots.includes(selectedSlot)) {
      setSelectedSlot("");
      setError("That time has passed. Please select another time slot.");
      setStep("slots");
      setShowCalendar(true);
      return;
    }

    setError("");
    setSubmitError("");
    setShowModal(true);
  };

  const handlePhoneChange = (e) => {
    const numericValue = e.target.value.replace(/\D/g, "");

    if (numericValue.length > 10) return;

    setForm((prev) => ({
      ...prev,
      phone: numericValue,
    }));

    setSubmitError("");
  };

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

  const submitSiteVisit = async () => {
    if (!form.name.trim() || !form.phone || !form.email.trim()) {
      setSubmitError("All fields are required.");
      return;
    }

    if (!/^\d{10}$/.test(form.phone)) {
      setSubmitError("Phone number must be exactly 10 digits.");
      return;
    }

    if (!isValidEmail(form.email.trim())) {
      setSubmitError("Please enter a valid email address.");
      return;
    }

    if (!selectedProperty || !selectedDate || !selectedSlot) {
      setSubmitError(
        "Please select a property, date, and time slot."
      );
      return;
    }

    // Validate again because the selected time might have passed
    // while the user was filling out their contact details.
    if (!availableTimeSlots.includes(selectedSlot)) {
      setSelectedSlot("");
      setSubmitError(
        "That time has passed. Please select another time slot."
      );
      setShowModal(false);
      setStep("slots");
      setShowCalendar(true);
      return;
    }

    setLoading(true);
    setSubmitError("");

    try {
      const res = await fetch("/api/v1/schedule-visit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone,
          email: form.email.trim(),
          propertyId: selectedProperty?.id || null,
          date: format(selectedDate, "yyyy-MM-dd"),
          time: selectedSlot,
          cabRequired,
          message: "Booked via website",
        }),
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        setSubmitError(
          data?.error || "Booking failed. Please try again."
        );
        return;
      }

      toast.success("Site visit booked successfully!");

      setShowModal(false);
      setForm({
        name: "",
        phone: "",
        email: "",
      });
      setSelectedDate(null);
      setSelectedSlot("");
      setError("");
      setSubmitError("");
    } catch (err) {
      console.error("Error booking site visit:", err);
      setSubmitError("Something went wrong. Please try again.");
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative mx-auto w-full max-w-md rounded-2xl bg-white p-6 shadow-md">
      <Toaster position="top-right" />

      <div className="mb-5 flex overflow-hidden rounded-lg border">
        <div className="flex-1 border-b-2 border-ochre bg-white py-2 text-center text-lg font-medium text-textDark">
          Book Free Site Visit
        </div>
      </div>

      {property && (
        <p className="mt-1 mb-3 text-xs text-gray-500">
          Booking site visit for{" "}
          <strong>{property.propertyTitle}</strong>
        </p>
      )}

      {/* Property search */}
      <div className="relative mb-4">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          placeholder="Search projects"
          value={searchText}
          disabled={!!property}
          onChange={(e) => {
            setSearchText(e.target.value);
            setSelectedProperty(null);
            setError("");
          }}
          className={`w-full rounded-lg py-3 pl-10 pr-4 text-sm ${
            property
              ? "cursor-not-allowed bg-gray-200"
              : "bg-gray-100"
          }`}
        />

        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-lg bg-white shadow-lg">
            {suggestions.map((item) => (
              <li
                key={item.id}
                onClick={() => handleSelect(item)}
                className="cursor-pointer px-4 py-2 text-sm hover:bg-gray-100"
              >
                {item.propertyTitle}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Date and time selector */}
      <div className="relative mb-4" ref={inputRef}>
        <CalendarIcon
          size={18}
          onClick={toggleCalendar}
          className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer text-brickred"
        />

        <input
          type="text"
          readOnly
          placeholder="Select date & time"
          value={
            selectedDate
              ? `${format(selectedDate, "dd-MM-yyyy")}${
                  selectedSlot ? ` | ${selectedSlot}` : ""
                }`
              : ""
          }
          onClick={toggleCalendar}
          className="w-full cursor-pointer rounded-lg bg-gray-100 py-3 pl-10 pr-4"
        />

        {showCalendar && (
          <div
            className="fixed inset-0 z-[99999] flex items-start justify-center bg-black/30"
            onClick={() => setShowCalendar(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="mt-24 w-[95%] max-w-md rounded-xl bg-white p-4 shadow-2xl"
            >
              {/* Calendar step */}
              {step === "calendar" && (
                <>
                  <h3 className="mb-3 text-lg font-semibold">
                    Select Visit Date
                  </h3>

                  <DayPicker
                    mode="single"
                    selected={selectedDate ?? undefined}
                    onSelect={(date) => {
                      if (!date) return;

                      setSelectedDate(date);
                      setSelectedSlot("");
                      setError("");
                    }}
                    disabled={{
                      before: startOfDay(new Date()),
                    }}
                  />

                  <div className="mt-4 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowCalendar(false)}
                      className="rounded border px-4 py-2"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (!selectedDate) {
                          setError("Please select a date first.");
                          return;
                        }

                        setError("");
                        setStep("slots");
                      }}
                      className="rounded bg-brickred px-4 py-2 text-white"
                    >
                      Next
                    </button>
                  </div>
                </>
              )}

              {/* Time-slot step */}
              {step === "slots" && (
                <>
                  <h3 className="mb-1 text-lg font-semibold">
                    Select Visit Time
                  </h3>

                  {selectedDate && (
                    <p className="mb-4 text-sm text-gray-500">
                      {format(selectedDate, "EEEE, dd MMMM yyyy")}
                    </p>
                  )}

                  {availableTimeSlots.length > 0 ? (
                    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                      {availableTimeSlots.map((slot) => (
                        <button
                          type="button"
                          key={slot}
                          onClick={() => {
                            setSelectedSlot(slot);
                            setError("");
                          }}
                          className={`rounded border px-1 py-2 text-xs ${
                            selectedSlot === slot
                              ? "border-brickred bg-brickred text-white"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-gray-500">
                      No time slots remain for today. Please select
                      another date.
                    </p>
                  )}

                  <div className="mt-4 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setStep("calendar")}
                      className="rounded border px-4 py-2"
                    >
                      Back
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (!selectedDate) {
                          setError("Please select a date first.");
                          setStep("calendar");
                          return;
                        }

                        if (!availableTimeSlots.includes(selectedSlot)) {
                          setSelectedSlot("");
                          setError(
                            availableTimeSlots.length === 0
                              ? "No time slots remain for today. Please select another date."
                              : "Please select a valid time slot."
                          );
                          return;
                        }

                        setError("");
                        setShowCalendar(false);
                      }}
                      disabled={
                        availableTimeSlots.length === 0 ||
                        !availableTimeSlots.includes(selectedSlot)
                      }
                      className="rounded bg-brickred px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
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

      {error && (
        <p className="mb-3 text-sm text-red-500">{error}</p>
      )}

      {/* Transport */}
      <div className="mb-4 flex items-center gap-6">
        <label className="flex cursor-pointer items-center gap-2 text-sm">
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

        <label className="flex cursor-pointer items-center gap-2 text-sm">
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
      <ul className="mb-5 list-inside list-disc space-y-1 text-sm text-brickred">
        <li>Free Pick Up & Drop - Book Personal Cab</li>
        <li>Visit Your Selected 3 Projects in One Tour</li>
        <li>Just Visit & Decide later</li>
      </ul>

      <button
        type="button"
        onClick={handleSubmit}
        className="w-full rounded-full bg-ochre py-3 font-semibold text-white transition hover:bg-brickred"
      >
        Book Site Visit
      </button>

      <p className="mt-3 text-center text-xs text-gray-400">
        By continuing, you agree to our{" "}
        <span className="cursor-pointer text-brickred underline">
          Terms & Conditions
        </span>
      </p>

      {/* Contact details modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 p-4"
          onClick={() => {
            if (!loading) setShowModal(false);
          }}
        >
          <div
            className="relative w-full max-w-md rounded-xl bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => {
                if (!loading) setShowModal(false);
              }}
              disabled={loading}
              aria-label="Close modal"
              className="absolute right-3 top-3 disabled:opacity-50"
            >
              ✕
            </button>

            <h3 className="mb-2 text-lg font-semibold">
              Book Free Site Visit
            </h3>

            <p className="mb-4 text-sm text-gray-500">
              {selectedProperty?.propertyTitle}
              {selectedDate &&
                ` • ${format(selectedDate, "dd-MM-yyyy")}`}
              {selectedSlot && ` • ${selectedSlot}`}
            </p>

            <input
              type="text"
              placeholder="Enter name"
              value={form.name}
              className="mb-3 w-full rounded bg-gray-100 p-3"
              onChange={(e) => {
                setForm((prev) => ({
                  ...prev,
                  name: e.target.value,
                }));
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
              className="mb-3 w-full rounded bg-gray-100 p-3"
              onChange={handlePhoneChange}
            />

            <input
              type="email"
              placeholder="Email address"
              value={form.email}
              className="mb-4 w-full rounded bg-gray-100 p-3"
              onChange={(e) => {
                setForm((prev) => ({
                  ...prev,
                  email: e.target.value,
                }));
                setSubmitError("");
              }}
            />

            {submitError && (
              <p className="mb-3 text-sm text-red-500">
                {submitError}
              </p>
            )}

            <button
              type="button"
              onClick={submitSiteVisit}
              disabled={loading}
              className="w-full rounded bg-brickred py-3 text-white disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
