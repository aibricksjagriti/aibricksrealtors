"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import ProjectGrid from "@/src/Developers/ProjectGrid";

export default function LocationDetailClient({ city, slug, projects, localities, cityDescription, banner, about }) {
  const [selected, setSelected] = useState([]); // array of selected locality names

  const toggle = (loc) => {
    setSelected((prev) =>
      prev.includes(loc) ? prev.filter((l) => l !== loc) : [...prev, loc]
    );
  };

  const clearAll = () => setSelected([]);

  const filtered = useMemo(() => {
    if (selected.length === 0) return projects;
    return projects.filter((p) => {
      const locality = p.locality?.trim() || "";
      return selected.some(
        (s) => locality.toLowerCase() === s.toLowerCase()
      );
    });
  }, [projects, selected]);

  return (
    <div>
      {/* BANNER */}
      {banner && (
        <div className="relative w-full h-64 md:h-80 overflow-hidden">
          <img src={banner} alt={city} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 flex items-end pb-8 px-6">
            <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow">{city}</h1>
          </div>
        </div>
      )}

    <div className="max-w-6xl mx-auto px-4 py-10 mt-30">
      {/* TITLE (when no banner) */}
      {!banner && (
        <h1 className="text-2xl md:text-4xl font-bold mb-2">
          Properties in {city}
        </h1>
      )}
      {banner && <h2 className="text-xl md:text-2xl font-semibold mb-2 mt-4">Properties in {city}</h2>}

      {cityDescription && (
        <p className="text-gray-500 mb-4 text-sm md:text-base">{cityDescription}</p>
      )}

      {about && (
        <p className="text-gray-600 mb-6 text-sm md:text-base leading-relaxed border-l-4 border-brickred pl-4">{about}</p>
      )}

      {/* LOCALITY FILTER */}
      {localities.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6 w-full">
          <button
            onClick={clearAll}
            className={`px-5 py-2 rounded-sm text-sm font-medium tracking-wide border-2 transition-all duration-300 ${
              selected.length === 0
                ? "bg-brickred text-white border-ochre shadow-lg"
                : "bg-white/70 text-gray-700 border-gray-200 hover:bg-brickred hover:text-white hover:shadow-md"
            }`}
          >
            All{selected.length > 0 ? ` (${projects.length})` : ""}
          </button>

          {localities.map((loc, i) => {
            const isActive = selected.includes(loc);
            const count = projects.filter(
              (p) => p.locality?.trim()?.toLowerCase() === loc.toLowerCase()
            ).length;

            return (
              <button
                key={i}
                onClick={() => toggle(loc)}
                className={`
                  px-5 py-2 rounded-sm text-sm font-medium tracking-wide
                  transition-all duration-300 ease-in-out
                  border backdrop-blur-md
                  ${
                    isActive
                      ? "bg-brickred text-white border-ochre shadow-lg scale-105"
                      : "bg-white/70 text-gray-700 border-gray-200 hover:bg-brickred hover:text-white hover:shadow-md hover:scale-105"
                  }
                `}
              >
                {loc}
                {count > 0 && (
                  <span className={`ml-1.5 text-xs ${isActive ? "text-white/80" : "text-gray-400"}`}>
                    ({count})
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {selected.length > 0 && (
        <p className="text-sm text-gray-500 mb-4">
          Showing {filtered.length} properties in{" "}
          <span className="font-medium text-gray-700">{selected.join(", ")}</span>
          {" — "}
          <button onClick={clearAll} className="text-brickred hover:underline">clear filter</button>
        </p>
      )}

      {/* PROJECT GRID or empty state */}
      {filtered.length > 0 ? (
        <ProjectGrid projects={filtered} builderName={city} />
      ) : (
        <div className="py-16 text-center text-gray-400">
          <p className="text-xl font-medium mb-2">
            No properties in {selected.length > 0 ? selected.join(", ") : city}
          </p>
          {selected.length > 0 && (
            <button onClick={clearAll} className="mt-2 text-brickred hover:underline text-sm">
              Show all properties in {city}
            </button>
          )}
        </div>
      )}
    </div>
    </div>
  );
}
