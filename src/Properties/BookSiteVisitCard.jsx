"use client";

import { useState, useRef } from "react";
import { Calendar as CalendarIcon, Search } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import "react-day-picker/dist/style.css";
import { useRouter } from "next/navigation";

export default function BookSiteVisitCard() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("site");
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [openUpward, setOpenUpward] = useState(false);

  //  Search state (SAME AS ABOUT US HERO)
  const [searchText, setSearchText] = useState("");

  const inputRef = useRef(null);

  const toggleCalendar = () => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const calendarHeight = 360;
      setOpenUpward(spaceBelow < calendarHeight);
    }
    setShowCalendar((prev) => !prev);
  };

  //  Handle Search (IDENTICAL BEHAVIOR)
  const handleSearch = () => {
    if (!searchText.trim()) return;
    router.push(`/search?search=${encodeURIComponent(searchText)}`);
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

      {/* 🔍 Search */}
      <div className="relative mb-4">
        <Search
          size={18}
          onClick={handleSearch}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
        />
        <input
          type="text"
          placeholder="Search projects"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-100 text-sm focus:outline-none"
        />
      </div>

      {/* Date Picker Input */}
      <div className="relative mb-4" ref={inputRef}>
        <CalendarIcon
          size={18}
          onClick={toggleCalendar}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-brickred cursor-pointer"
        />

        <input
          readOnly
          onClick={toggleCalendar}
          value={format(selectedDate, "MM-dd-yyyy")}
          className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-100 text-sm text-gray-700 cursor-pointer focus:outline-none"
        />

        {/* Calendar Popover */}
        {showCalendar && (
          <div
            className={`absolute left-0 bg-white rounded-xl shadow-2xl p-4 ${
              openUpward ? "bottom-full mb-3" : "top-full mt-3"
            }`}
            style={{ zIndex: 9999 }}
          >
            <DayPicker
              mode="single"
              disabled={{ before: new Date() }}
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-lg"
              classNames={{
                caption: "flex justify-between items-center mb-4",
                day_selected: "bg-blue-900 text-white rounded-full",
                day_today: "text-blue-900 font-semibold",
                nav_button: "text-gray-500 hover:text-black",
              }}
            />

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowCalendar(false)}
                className="px-4 py-2 rounded-lg border text-xs hover:bg-ochre font-semibold hover:text-lightcream"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Transport */}
      <div className="flex items-center gap-6 mb-4">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="radio"
            name="transport"
            defaultChecked
            className="accent-brickred"
          />
          <span className="font-semibold">Cab</span>
        </label>

        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="radio" name="transport" className="accent-brickred" />
          <span>Not Required</span>
        </label>
      </div>

      {/* Benefits */}
      <ul className="text-sm text-brickred space-y-1 mb-5 list-disc list-inside">
        <li>Free Pick Up & Drop - Book Personal Cab</li>
        <li>Visit Your Selected 3 Projects in One Tour</li>
        <li>Just Visit & Decide later</li>
      </ul>

      {/* CTA */}
      <button className="w-full bg-ochre hover:bg-brickred transition text-white py-3 rounded-full text-md font-semibold mb-3">
        Book Site Visit
      </button>

      {/* Terms */}
      <p className="text-xs text-center text-gray-400">
        By continuing, you agree to our{" "}
        <span className="text-brickred underline cursor-pointer">
          Terms & Conditions
        </span>
      </p>
    </div>
  );
}
