"use client";

import { useEffect, useState } from "react";
import { ArrowRight, ChevronDown, MapPin, Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getPropertyPath } from "@/lib/utils/propertySlug";

export default function Navbar({
  initialBuilders = [],
  initialLocations = [],
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [showDevDropdown, setShowDevDropdown] = useState(false);
  const [showMobileDev, setShowMobileDev] = useState(false);
  const [showLocDropdown, setShowLocDropdown] = useState(false);
  const [showMobileLoc, setShowMobileLoc] = useState(false);
  const [builders, setBuilders] = useState(initialBuilders);
  const [locations, setLocations] = useState(initialLocations);
  const [hoveredBuilder, setHoveredBuilder] = useState(null);
  const [builderProjects, setBuilderProjects] = useState({});
  const [projectsLoading, setProjectsLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    ["/", "/about", "/properties", "/contact", "/locations"].forEach((href) => {
      router.prefetch(href);
    });
  }, [router]);

  const toSlug = (name) => name.toLowerCase().replace(/\s+/g, "-");
  const cityToSlug = (name) => name.toLowerCase().replace(/\s+/g, "-");
  const builderName = (builder) => typeof builder === "object" ? builder.name : builder;

  useEffect(() => {
    if (!hoveredBuilder || builderProjects[hoveredBuilder]) return undefined;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setProjectsLoading(true);
      try {
        const response = await fetch(`/api/v1/properties/search?developer=${encodeURIComponent(hoveredBuilder)}&limit=3`, { signal: controller.signal });
        const json = await response.json();
        setBuilderProjects((current) => ({ ...current, [hoveredBuilder]: response.ok ? json.data || [] : [] }));
      } catch (error) {
        if (error.name !== "AbortError") setBuilderProjects((current) => ({ ...current, [hoveredBuilder]: [] }));
      } finally {
        if (!controller.signal.aborted) setProjectsLoading(false);
      }
    }, 160);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [hoveredBuilder, builderProjects]);

  return (
    <>
      <nav className="sticky top-0 left-0 w-full shrink-0 bg-[var(--color-lightblue)] shadow-md z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-4 md:py-6 flex justify-between items-center">
          <div className="text-2xl font-bold text-ochre w-[76px] sm:w-[90px] md:w-[100px]">
            <Link href="/" className="cursor-pointer">
              {/* AI BRICKS */}
              <img src="/aibricks-logo-2.png" alt="logo" />
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-8 text-darkgray">
            <Link href="/" className="nav-link cursor-pointer">
              HOME
            </Link>
            <Link href="/about" className="nav-link cursor-pointer">
              ABOUT
            </Link>
            <Link href="/properties" className="nav-link cursor-pointer">
              PROPERTIES
            </Link>

            <div
              className="relative"
              onMouseEnter={() => setShowDevDropdown(true)}
              onMouseLeave={() => setShowDevDropdown(false)}
            >
              <button className="flex items-center gap-1 text-darkgray hover:text-ochre cursor-pointer">
                DEVELOPERS <ChevronDown size={16} />
              </button>

              {showDevDropdown && (
                <>
                  <div className="absolute top-full left-0 w-full h-3" />
                  <div className="absolute top-full left-1/2 w-[min(720px,calc(100vw-32px))] -translate-x-1/2 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl z-50 text-darkgray">
                    <div className="grid grid-cols-[240px_1fr]">
                      <div className="border-r border-gray-100 bg-gray-50/80 p-3">
                        <p className="mb-2 px-3 text-xs font-bold uppercase tracking-[0.18em] text-gray-500">Developers</p>
                        <div className="header-menu-scroll max-h-80 space-y-1 overflow-y-auto pr-2">
                        {builders.map((builder, index) => (
                          <Link
                            key={index}
                            href={`/developers/${typeof builder === "object" ? builder.slug : toSlug(builder)}`}
                            onMouseEnter={() => setHoveredBuilder(builderName(builder))}
                            onFocus={() => setHoveredBuilder(builderName(builder))}
                            className={`block w-full rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition ${hoveredBuilder === builderName(builder) ? "bg-brickred text-white" : "hover:bg-white"}`}
                          >
                            {builderName(builder)}
                          </Link>
                        ))}
                        </div>
                        <p className="mt-2 px-3 text-[11px] text-gray-500">Scroll for more developers</p>
                      </div>
                      <div className="min-h-80 p-5">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-ochre">Project preview</p>
                        <h3 className="mt-1 text-xl font-bold">{hoveredBuilder || "Hover over a developer"}</h3>
                        {!hoveredBuilder ? (
                          <p className="mt-4 max-w-xs text-sm leading-6 text-gray-500">Move over a developer name to see their available properties without leaving this page.</p>
                        ) : projectsLoading && !builderProjects[hoveredBuilder] ? (
                          <div className="mt-4 space-y-3">{[0, 1, 2].map((item) => <div key={item} className="h-16 animate-pulse rounded-xl bg-gray-100" />)}</div>
                        ) : builderProjects[hoveredBuilder]?.length ? (
                          <div className="mt-4 space-y-2">
                            {builderProjects[hoveredBuilder].map((property) => (
                              <Link key={property.id} href={getPropertyPath(property)} className="group flex items-center justify-between gap-3 rounded-xl border border-gray-100 p-3 hover:border-ochre hover:bg-amber-50/50">
                                <span className="min-w-0"><span className="block truncate font-bold">{property.projectName || property.propertyTitle}</span><span className="mt-1 flex items-center gap-1 truncate text-xs text-gray-500"><MapPin size={12} />{[property.locality, property.city].filter(Boolean).join(", ")}</span></span>
                                <ArrowRight size={16} className="shrink-0 text-ochre transition group-hover:translate-x-1" />
                              </Link>
                            ))}
                          </div>
                        ) : <p className="mt-4 text-sm text-gray-500">No active properties listed yet.</p>}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div
              className="relative"
              onMouseEnter={() => setShowLocDropdown(true)}
              onMouseLeave={() => setShowLocDropdown(false)}
            >
              <button className="flex items-center gap-1 hover:text-ochre cursor-pointer">
                LOCATIONS <ChevronDown size={16} />
              </button>

              {showLocDropdown && (
                <>
                  <div className="absolute top-full left-0 w-full h-3" />
                  <div className="absolute top-full left-0 w-64 max-h-80 overflow-y-auto bg-white rounded-xl shadow-xl border z-50 p-4 space-y-4">
                    {locations.map((item, index) => (
                      <Link
                        key={index}
                        href={`/locations/${item.slug || cityToSlug(item.city)}`}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-darkgray cursor-pointer"
                      >
                        {item.city}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>

            <Link href="/contact" className="nav-link cursor-pointer">
              CONTACT
            </Link>
          </div>

          <button
            type="button"
            aria-label="Open navigation menu"
            onClick={() => setIsOpen(true)}
            className="md:hidden grid h-10 w-10 shrink-0 place-items-center rounded-lg text-brickred hover:bg-white/50 cursor-pointer"
          >
            <Menu size={26} />
          </button>
        </div>
      </nav>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white z-50 transition-transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between p-5 border-b items-center">
          <span className="font-semibold">Menu</span>
          <X
            onClick={() => setIsOpen(false)}
            className="cursor-pointer"
            size={22}
          />
        </div>

        <div className="flex flex-col p-6 gap-4 text-darkgray">
          <Link
            href="/"
            className="cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/about"
            className="cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>
          <Link
            href="/properties"
            className="cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            Properties
          </Link>

          <div>
            <button
              onClick={() => setShowMobileDev(!showMobileDev)}
              className="flex items-center justify-between w-full cursor-pointer"
            >
              Developers
              <ChevronDown
                size={18}
                className={`${showMobileDev ? "rotate-180" : ""}`}
              />
            </button>

            {showMobileDev && (
              <div className="mt-2 ml-2 border-l pl-3 space-y-3">
                <div className="max-h-44 overflow-y-auto no-scrollbar pr-2 space-y-1">
                  {builders.map((builder, index) => (
                    <Link
                      key={index}
                      href={`/developers/${typeof builder === "object" ? builder.slug : toSlug(builder)}`}
                      onClick={() => setIsOpen(false)}
                      className="block w-full text-left py-1 cursor-pointer"
                    >
                      {typeof builder === "object" ? builder.name : builder}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <button
              onClick={() => setShowMobileLoc(!showMobileLoc)}
              className="flex items-center justify-between w-full cursor-pointer"
            >
              Locations
              <ChevronDown
                size={18}
                className={`${showMobileLoc ? "rotate-180" : ""}`}
              />
            </button>

            {showMobileLoc && (
              <div className="mt-2 ml-2 border-l pl-3 space-y-2">
                {locations.map((item, index) => (
                  <Link
                    key={index}
                    href={`/locations/${item.slug || cityToSlug(item.city)}`}
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-darkgray cursor-pointer"
                  >
                    {item.city}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/contact"
            className="cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            Contact
          </Link>
        </div>
      </div>
    </>
  );
}
