"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const options = [
  "2023",
  "2024",
  "2025",
  "2026",
  "2027",
  "2028",
  "2029",
  "2030",
  "TBD",
];

export default function MultiSelect() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState([]);

  const toggleOption = (option) => {
    setSelected((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  return (
    <div className="relative w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center bg-white text-black border border-gray-300 rounded-lg px-4 py-3 text-left shadow-sm hover:border-[var(--color-brickred)] focus:outline-none"
      >
        <span>{selected.length === 0 ? "Handover" : selected.join(", ")}</span>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {options.map((option) => (
            <label
              key={option}
              className="flex items-center gap-2 px-4 py-2 cursor-pointer text-black hover:bg-gray-100"
            >
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() => toggleOption(option)}
                className="w-4 h-4 accent-[var(--color-brickred)]"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
