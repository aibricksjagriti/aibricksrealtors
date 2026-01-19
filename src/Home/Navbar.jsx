"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar({ onLoginClick }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-[var(--color-brickred)] shadow-md z-50">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          {/* Logo */}
          <div className="text-2xl md:text-3xl font-serif font-bold text-[var(--color-ochre)] tracking-wider">
            <a href="/">AI BRICKS</a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
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
              CONTACT US
            </a>

            <button
              onClick={onLoginClick}
              className="ml-4 bg-[var(--color-ochre)] text-[var(--color-darkgray)] px-5 py-2 rounded-full font-sans font-semibold hover:bg-[var(--color-brickred)] hover:border-2 hover:border-[var(--color-lightcream)] hover:text-[var(--color-lightcream)] transition-all"
            >
              Login
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(true)}
            className="md:hidden text-[var(--color-darkgray)] focus:outline-none"
          >
            <Menu size={28} />
          </button>
        </div>
      </nav>

      {/* Overlay (background blur when drawer is open) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Side Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-[var(--color-lightcream)] shadow-2xl z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-5 border-b border-[var(--color-ochre)]">
          <span className="text-xl font-serif font-semibold text-[var(--color-brickred)]">
            Menu
          </span>
          <button
            onClick={() => setIsOpen(false)}
            className="text-[var(--color-darkgray)] focus:outline-none"
          >
            <X size={26} />
          </button>
        </div>

        <div className="flex flex-col mt-6 space-y-6 px-6">
          <a
            href="/"
            className="text-[var(--color-darkgray)] font-sans text-lg hover:text-[var(--color-brickred)] transition"
            onClick={() => setIsOpen(false)}
          >
            Home
          </a>
          <a
            href="/about"
            className="text-[var(--color-darkgray)] font-sans text-lg hover:text-[var(--color-brickred)] transition"
            onClick={() => setIsOpen(false)}
          >
            About
          </a>
          <a
            href="/properties"
            className="text-[var(--color-darkgray)] font-sans text-lg hover:text-[var(--color-brickred)] transition"
            onClick={() => setIsOpen(false)}
          >
            Property Listed
          </a>
          <a
            href="/contact"
            className="text-[var(--color-darkgray)] font-sans text-lg hover:text-[var(--color-brickred)] transition"
            onClick={() => setIsOpen(false)}
          >
            Contact Us
          </a>

          <button
            onClick={onLoginClick}
            className="bg-[var(--color-brickred)] text-[var(--color-lightcream)] px-6 py-2 rounded-full font-sans font-semibold hover:bg-[var(--color-ochre)] transition"
          >
            Login
          </button>
        </div>
      </div>
    </>
  );
}
