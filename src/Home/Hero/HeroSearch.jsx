"use client";

import { Search, MapPin, Building2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getPropertyPath } from "@/lib/utils/propertySlug";

export default function HeroSearch() {
  const router = useRouter();
  const [suggestions, setSuggestions] = useState([]);
  const [suggesting, setSuggesting] = useState(false);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const searchBoxRef = useRef(null);

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
    setSuggestionsOpen(false);
    const params = new URLSearchParams(
      Object.entries(filters).filter(([, v]) => v),
    );
    router.push(`/search?${params.toString()}`);
  };

  useEffect(() => {
    const closeOnOutsidePress = (event) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(event.target)) {
        setSuggestionsOpen(false);
      }
    };
    document.addEventListener("pointerdown", closeOnOutsidePress);
    return () => document.removeEventListener("pointerdown", closeOnOutsidePress);
  }, []);

  useEffect(() => {
    const query = filters.q.trim();
    if (query.length < 2) {
      setSuggestions([]);
      return undefined;
    }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setSuggesting(true);
      try {
        const response = await fetch(`/api/v1/properties/search?q=${encodeURIComponent(query)}&limit=6`, {
          signal: controller.signal,
        });
        const data = await response.json();
        setSuggestions(response.ok ? (data.data || []).slice(0, 6) : []);
      } catch (error) {
        if (error.name !== "AbortError") setSuggestions([]);
      } finally {
        setSuggesting(false);
      }
    }, 250);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [filters.q]);

  return (
    <div className="relative z-[60] mx-auto w-full max-w-6xl bg-white/15 backdrop-blur-xl border border-white/35 md:border-brickred rounded-2xl p-3 sm:p-4 md:p-6 shadow-[0_18px_50px_rgba(15,30,62,0.28)] ring-1 ring-black/5">
      <form
        className="grid grid-cols-[1fr_auto] lg:grid-cols-5 gap-2 md:gap-4 mb-3 md:mb-4"
        onSubmit={(event) => { event.preventDefault(); handleSearch(); }}
      >
        <div ref={searchBoxRef} className="relative lg:col-span-4">
        <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-gray-400" size={18} />
        <input
          aria-label="Search by project, location or developer"
          placeholder="Project, location or developer"
          value={filters.q}
          onFocus={() => filters.q.trim().length >= 2 && setSuggestionsOpen(true)}
          onKeyDown={(event) => event.key === "Escape" && setSuggestionsOpen(false)}
          onChange={(e) => {
            handleChange("q", e.target.value);
            setSuggestionsOpen(e.target.value.trim().length >= 2);
          }}
          className="w-full rounded-lg border border-gray-200 bg-white py-3 pl-10 pr-3 text-black"
        />
        {suggestionsOpen && filters.q.trim().length >= 2 && (
          <div className="absolute z-[100] left-0 right-0 top-full mt-2 max-h-80 overflow-y-auto overscroll-contain rounded-xl border border-gray-100 bg-white text-left text-gray-900 shadow-2xl">
            {suggesting ? (
              <p className="px-4 py-3 text-sm text-gray-500">Finding projects…</p>
            ) : suggestions.length ? suggestions.map((item) => (
              <button type="button" key={item.id} onClick={() => { setSuggestionsOpen(false); router.push(getPropertyPath(item)); }} className="flex w-full min-w-0 items-start gap-3 border-b border-gray-100 px-4 py-3 text-left hover:bg-blue-50 last:border-0">
                <Building2 className="mt-0.5 shrink-0 text-ochre" size={18} />
                <span className="min-w-0 flex-1 text-left"><span className="block truncate text-left font-semibold">{item.projectName || item.propertyTitle}</span><span className="flex min-w-0 items-center justify-start gap-1 text-left text-xs text-gray-500"><MapPin className="shrink-0" size={12} /><span className="truncate text-left">{[item.locality, item.city, item.builderName].filter(Boolean).join(" · ")}</span></span></span>
              </button>
            )) : <p className="px-4 py-3 text-sm text-gray-600">No projects found</p>}
          </div>
        )}
        </div>
        <button type="submit" aria-label="Find properties" className="flex items-center justify-center gap-2 bg-brickred text-white rounded-lg px-4 py-3 font-semibold"><Search size={18} /><span className="hidden sm:inline">Find</span></button>
      </form>

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
        <select
          value={filters.propertyType}
          onChange={(e) => handleChange("propertyType", e.target.value)}
          className="min-w-0 p-2.5 md:p-3 rounded-lg border border-gray-200 bg-white text-sm md:text-base text-black"
        >
          <option value="">Property Type</option>
          <option value="Apartment">Apartments</option>
          <option value="Villa">Villas</option>
          <option value="Penthouse">Penthouses</option>
          <option value="Commercial">Commercials</option>
          <option value="Plot">Plots</option>
        </select>

        <select
          value={filters.city}
          onChange={(e) => handleChange("city", e.target.value)}
          className="min-w-0 p-2.5 md:p-3 rounded-lg border border-gray-200 bg-white text-sm md:text-base text-black"
        >
          <option value="">City</option>
          <option>Mumbai</option>
          <option>Pune</option>
          <option>Dubai</option>
        </select>

        <select
          value={filters.developer}
          onChange={(e) => handleChange("developer", e.target.value)}
          className="min-w-0 p-2.5 md:p-3 rounded-lg border border-gray-200 bg-white text-sm md:text-base text-black"
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
          value={filters.minPrice || filters.maxPrice ? `${filters.minPrice}-${filters.maxPrice}` : ""}
          onChange={(e) => {
            const [min, max] = e.target.value.split("-");
            handleChange("minPrice", min);
            handleChange("maxPrice", max || "");
          }}
          className="min-w-0 p-2.5 md:p-3 rounded-lg border border-gray-200 bg-white text-sm md:text-base text-black"
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

    </div>
  );
}
