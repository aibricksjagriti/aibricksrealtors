"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const sections = [
  { id: "about", label: "ABOUT" },
  { id: "projects", label: "PROJECTS" },
  { id: "impact", label: "IMPACT" },
  { id: "faq", label: "FAQ" },
];

function slugToName(slug) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function StickySectionNav() {
  const [active, setActive] = useState("about");
  const [isOpen, setIsOpen] = useState(false);
  const [developerName, setDeveloperName] = useState("AI BRICKS");
  const [developerLogo, setDeveloperLogo] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    // Try pathname first (direct /developers/slug access)
    const pathMatch =
      pathname?.match(/^\/developers\/([^/]+)/) ||
      pathname?.match(/^\/sub\/([^/]+)/);

    let slug = pathMatch ? pathMatch[1] : null;

    // Fallback: read subdomain from hostname (middleware rewrites hide the path)
    if (!slug) {
      const host = window.location.hostname; // e.g. lodha.localhost or lodha.domain.com
      const parts = host.split('.');
      const isSubdomain =
        (host.endsWith('.localhost') && parts.length >= 2) ||
        (!host.endsWith('.localhost') && parts.length >= 3);
      if (isSubdomain && parts[0] !== 'www') slug = parts[0];
    }

    if (slug) {
      setDeveloperName(slugToName(slug));
      fetch(`/api/v1/developers/${slug}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.success && data.data) {
            if (data.data.name) setDeveloperName(data.data.name);
            if (data.data.logo) setDeveloperLogo(data.data.logo);
          }
        })
        .catch(() => {});
    }
  }, [pathname]);

  // SCROLL SPY
  useEffect(() => {
    const handleScroll = () => {
      let current = "about";

      sections.forEach((section) => {
        const el = document.getElementById(section.id);
        if (el) {
          const offsetTop = el.offsetTop - 120;
          if (window.scrollY >= offsetTop) {
            current = section.id;
          }
        }
      });

      setActive(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // SCROLL FUNCTION
  const scrollToSection = (id) => {
    setIsOpen(false); // close mobile drawer
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 100,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full bg-[var(--color-brickred)] shadow-md z-50">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          {/* LOGO */}
          <div className="flex items-center gap-3 text-xl font-bold text-[var(--color-ochre)]">
            {developerLogo ? (
              <img src={developerLogo} alt={developerName} className="h-9 w-auto object-contain" />
            ) : (
              <span>{developerName}</span>
            )}
          </div>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-8">
            {sections.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`font-sans transition-colors ${
                  active === item.id
                    ? "text-[var(--color-ochre)]"
                    : "text-[var(--color-lightcream)] hover:text-[var(--color-ochre)]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setIsOpen(true)}
            className="md:hidden text-white"
          >
            <Menu size={26} />
          </button>
        </div>
      </nav>

      {/* MOBILE OVERLAY */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* MOBILE DRAWER */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white z-50 transition-transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between p-5 border-b">
          <span className="font-semibold">Menu</span>
          <X onClick={() => setIsOpen(false)} />
        </div>

        <div className="flex flex-col p-6 gap-4 text-md">
          {sections.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`text-left ${
                active === item.id
                  ? "text-[var(--color-ochre)] font-semibold"
                  : "text-gray-700"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
