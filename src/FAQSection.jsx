"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FAQSection({ faqs = [] }) {
  return (
    <section className="bg-gradient-to-r from-[#0F1E3E] via-[#23448b] to-[#DCE6F2] py-16 px-4">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* LEFT CONTENT */}
        <div className="text-center lg:text-left">
          <h2 className="text-3xl md:text-4xl font-semibold text-white leading-snug">
            Frequently Asked Question
          </h2>

          <p className="text-lightcream mt-4 max-w-md mx-auto text-lg lg:mx-0">
            Trusted by property buyers and investors across India. Get clear
            answers to help you make confident real estate decisions.
          </p>
        </div>

        {/* RIGHT ACCORDION */}
        <div className="bg-[linear-gradient(135deg,_#d5b258_0%,_#f1df9e_100%)] text-[var(--color-darkgray)] rounded-2xl p-6 md:p-8 shadow-xl">
          {faqs.map((faq, i) => (
            <Accordion key={i} faq={faq} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Accordion({ faq }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-600/30 last:border-none">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center py-5 text-left"
      >
        <span
          className={`font-medium text-lg transition ${
            open ? "text-brickred" : "text-darkgray"
          }`}
        >
          {faq.q}
        </span>

        <ChevronDown
          size={18}
          className={`transition-transform duration-300 ${
            open ? "rotate-180 text-brickred" : "text-darkgray"
          }`}
        />
      </button>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          open
            ? "grid-rows-[1fr] opacity-100 pb-5"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="text-darkgray text-md leading-relaxed">{faq.a}</p>
        </div>
      </div>
    </div>
  );
}
