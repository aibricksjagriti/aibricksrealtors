"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HeroSearch() {
  const router = useRouter();

  const [filters, setFilters] = useState({
    q: "",
    propertyType: "",
    city: "",
    developer: "",
    minPrice: "",
    maxPrice: "",
  });

  const handleChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    const params = new URLSearchParams(
      Object.entries(filters).filter(([, v]) => v),
    );
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="mx-auto max-w-6xl bg-white/10 backdrop-blur-md border border-brickred rounded-2xl p-6 shadow-xl">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
        <select
          onChange={(e) => handleChange("propertyType", e.target.value)}
          className="p-3 rounded-lg bg-white text-black"
        >
          <option value="">Property Type</option>
          <option value="Apartment">Apartments</option>
          <option value="Villa">Villas</option>
          <option value="Penthouse">Penthouses</option>
          <option value="Commercials">Commercials</option>
          <option value="Plots">Plots</option>
          <option value="Investments">Investments</option>
        </select>

        <select
          onChange={(e) => handleChange("city", e.target.value)}
          className="p-3 rounded-lg bg-white text-black"
        >
          <option value="">City</option>
          <option>Mumbai</option>
          <option>Pune</option>
          <option>Dubai</option>
        </select>

        <select
          onChange={(e) => handleChange("developer", e.target.value)}
          className="p-3 rounded-lg bg-white text-black"
        >
          <option value="">Developer</option>
          <option value="Shapoorji">Shapoorji Pallonji Real Estate</option>
          <option value="Krisala Developers">Krisala Developers</option>
          <option value="Hiranandani Developers">Hiranandani Developers</option>
          <option value="Tata Housing Development Company">
            Tata Housing Development Company
          </option>
          <option value="Gera Developers">Gera Developers</option>
          <option value="Kolte Patil Developers">Kolte Patil Developers</option>
          <option value="Lodha Developers">Lodha Developers</option>
          <option value="Godrej Developers">Godrej Developers</option>
          <option value="Kohinoor Developers">Kohinoor Developers</option>
          <option value="VTP Developers">VTP Developers</option>
        </select>

        <select
          onChange={(e) => {
            const [min, max] = e.target.value.split("-");
            handleChange("minPrice", min);
            handleChange("maxPrice", max || "");
          }}
          className="p-3 rounded-lg bg-white text-black"
        >
          <option value="">Price</option>
          <option value="0-5000000">Under ₹50 Lakhs</option>
          <option value="5000000-10000000">₹50 Lakhs - ₹1 Crore</option>
          <option value="10000000-15000000">₹1 - 1.5 Crores</option>
          <option value="15000000-25000000">₹1.5 - 2.5 Crores</option>
          <option value="25000000-40000000">₹2.5 - 4 Crores</option>
          <option value="40000000-">Above ₹4 Crores</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <input
          placeholder="Search properties..."
          onChange={(e) => handleChange("q", e.target.value)}
          className="p-3 rounded-lg bg-white text-black lg:col-span-4"
        />

        <button
          onClick={handleSearch}
          className="flex items-center justify-center gap-2 bg-brickred text-white rounded-lg py-3 font-semibold"
        >
          <Search size={18} />
          Find
        </button>
      </div>
    </div>
  );
}
