"use client";

import { useEffect, useState } from "react";
import { Menu, X, User } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Navbar({ onLoginClick }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState(null);

  const router = useRouter();

  //  Check login on load
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  //  Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/");
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full bg-[var(--color-brickred)] shadow-md z-50">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          {/* LOGO */}
          <div className="text-2xl font-bold text-[var(--color-ochre)]">
            <a href="/">AI BRICKS</a>
          </div>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="/"
              className="text-[var(--color-lightcream)] font-sans hover:text-[var(--color-ochre)] transition-colors"
            >
              HOME
            </a>
            <a
              href="/about"
              className="text-[var(--color-lightcream)] font-sans hover:text-[var(--color-ochre)] transition-colors"
            >
              ABOUT
            </a>
            <a
              href="/properties"
              className="text-[var(--color-lightcream)] font-sans hover:text-[var(--color-ochre)] transition-colors"
            >
              PROPERTIES
            </a>
            <a
              href="/contact"
              className="text-[var(--color-lightcream)] font-sans hover:text-[var(--color-ochre)] transition-colors"
            >
              CONTACT
            </a>

            {/* LOGIN / USER */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 text-white bg-ochre p-2 rounded-full"
                >
                  <User size={24} />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-3 w-44 bg-white rounded-lg shadow-lg border">
                    <button
                      onClick={() => router.push("/dashboard")}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="ml-4 bg-[var(--color-ochre)] text-[var(--color-darkgray)] px-5 py-2 rounded-full font-sans font-semibold hover:bg-[var(--color-brickred)] hover:border-2 hover:border-[var(--color-lightcream)] hover:text-[var(--color-lightcream)] transition-all"
              >
                LOGIN
              </button>
            )}
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

      {/* MOBILE DRAWER */}
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
        <div className="flex justify-between p-5 border-b">
          <span className="font-semibold">Menu</span>
          <X onClick={() => setIsOpen(false)} />
        </div>

        <div className="flex flex-col p-6 gap-4 text-md">
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/properties">Properties</a>
          <a href="/contact">Contact</a>

          {user ? (
            <>
              <button
                className="bg-ochre p-2 text-left text-md"
                onClick={() => router.push("/dashboard")}
              >
                Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="text-lightcream bg-red-800 text-left p-2 text-lg font-semibold"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={onLoginClick}
              className="bg-brickred text-white py-2 rounded"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </>
  );
}
