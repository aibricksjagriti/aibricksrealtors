"use client";

import {
  Facebook,
  Linkedin,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
  Copyright,
  Send,
} from "lucide-react";

import { ImLinkedin } from "react-icons/im";
import { FaSquareInstagram } from "react-icons/fa6";
import { FaFacebookSquare } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="relative bg-[var(--color-brickred)] text-[var(--color-lightcream)] pt-12 pb-4 overflow-hidden">
      <div className="relative z-10 container mx-auto px-6 md:px-12 w-[90%]">
        {/* Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 text-sm md:text-base">
          {/* Company Info */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">AI BRICKS</h2>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Features</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="hover:text-[var(--color-ochre)]">
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/properties"
                  className="hover:text-[var(--color-ochre)]"
                >
                  Properties
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-[var(--color-ochre)]">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {/* <li>
                <a href="/news" className="hover:text-[var(--color-ochre)]">
                  News
                </a>
              </li> */}
              <li>
                <a href="/about" className="hover:text-[var(--color-ochre)]">
                  About Us
                </a>
              </li>
              {/* <li>
                <a href="/team" className="hover:text-[var(--color-ochre)]">
                  Our Team
                </a>
              </li> */}
            </ul>
          </div>

          {/* Team and Policies */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Team and Policies</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/disclaimer"
                  className="hover:text-[var(--color-ochre)]"
                >
                  Disclaimer
                </a>
              </li>
              <li>
                <a
                  href="/privacy-policy"
                  className="hover:text-[var(--color-ochre)]"
                >
                  Privacy Policy
                </a>
              </li>
              {/* <li>
                <a href="/security" className="hover:text-[var(--color-ochre)]">
                  Security
                </a>
              </li> */}
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Contact Us</h3>
            <p className="mb-2">
              <span className="font-semibold">Call:</span> 8130120098
            </p>

            <p className="mb-2">
              <span className="font-semibold">Address:</span> Office no 428, The
              address Commercia, Hinjawadi Rd, Pune, Pimpri-Chinchwad,
              Maharashtra 411057
            </p>
            <p className="mb-4">
              <span className="font-semibold">Email:</span>{" "}
              <a
                href="mailto:info@aibricksrealtors.com"
                className="hover:underline text-[var(--color-ochre)]"
              >
                info@aibricksrealtors.com
              </a>
            </p>

            {/* Social Icons */}
            <div className="flex flex-wrap gap-3">
              <a
                href="https://www.linkedin.com/company/aibricks-realtors/"
                target="_blank"
                className="bg-white text-[#0A66C2] rounded-lg p-2 hover:scale-110 transition-transform"
              >
                {/* <Linkedin size={20} /> */}
                <ImLinkedin />
              </a>
              <a
                href="https://www.instagram.com/aibricksrealtors/?igsh=MXd4b2xpaTcyb2dhNQ%3D%3D#"
                target="_blank"
                className="bg-white text-[#E1306C] rounded-lg p-2 hover:scale-110 transition-transform"
              >
                <FaSquareInstagram />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/20 mt-10 pt-4 text-center text-sm">
          <p>
            © Copyright {new Date().getFullYear()}{" "}
            <span className="font-semibold">Ai Bricks</span> - All Rights
            Reserved.
          </p>
        </div>
      </div>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/8130120098"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 bg-green-500 text-white rounded-full p-4 shadow-lg hover:scale-110 transition-transform"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          fill="currentColor"
          className="w-6 h-6"
        >
          <path d="M16 .063C7.16.063.063 7.158.063 16c0 2.82.738 5.516 2.146 7.922L0 32l8.313-2.145A15.857 15.857 0 0 0 16 31.938C24.844 31.938 31.938 24.844 31.938 16S24.844.063 16 .063zm0 29.156c-2.67 0-5.23-.725-7.465-2.098l-.535-.32-4.938 1.27 1.313-4.812-.344-.492A13.116 13.116 0 0 1 2.875 16c0-7.242 5.883-13.125 13.125-13.125S29.125 8.758 29.125 16 23.242 29.219 16 29.219zm7.32-9.344c-.4-.2-2.367-1.172-2.734-1.305-.367-.137-.637-.2-.906.2s-1.039 1.305-1.273 1.57-.469.305-.869.1c-.4-.2-1.688-.625-3.218-1.992-1.188-1.063-1.984-2.375-2.219-2.774s-.023-.625.176-.825c.176-.175.4-.456.6-.68.2-.225.268-.375.4-.625.133-.25.067-.469-.033-.668-.1-.2-.906-2.187-1.243-2.992-.326-.793-.656-.684-.906-.695l-.776-.014c-.25 0-.656.094-1 .469s-1.313 1.28-1.313 3.125 1.344 3.625 1.531 3.875c.188.25 2.645 4.031 6.398 5.656.895.387 1.594.617 2.137.793.9.287 1.719.246 2.367.15.723-.109 2.367-.969 2.699-1.906.332-.938.332-1.738.232-1.906-.1-.175-.367-.275-.768-.475z" />
        </svg>
      </a>
    </footer>
  );
}
