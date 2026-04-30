"use client";

import { useEffect, useState } from "react";
import { MessageSquareMore } from "lucide-react";
import LeadCaptureModal from "@/src/LeadCapture/LeadCaptureModal";

export default function ContactModal() {
  const [open, setOpen] = useState(false);
  const [autoOpened, setAutoOpened] = useState(false);

  useEffect(() => {
    const hasSeen = localStorage.getItem("enquiryPopupSeen");

    if (hasSeen) {
      return;
    }

    const timer = setTimeout(() => {
      setOpen(true);
      setAutoOpened(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const closePopup = () => {
    localStorage.setItem("enquiryPopupSeen", "true");
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed right-0 top-1/2 z-40 hidden md:flex -translate-y-1/2 flex-col items-center justify-center gap-2 rounded-l-2xl bg-brickred px-3 py-4 text-lightcream shadow-2xl transition hover:bg-ochre cursor-pointer"
      >
        <MessageSquareMore size={18} className="rotate-90" />
        <span
          className="text-sm font-semibold tracking-[0.2em]"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          ENQUIRY
        </span>
      </button>

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-40 md:hidden rounded-full bg-brickred px-4 py-3 text-lightcream shadow-2xl cursor-pointer"
      >
        Enquiry
      </button>

      <LeadCaptureModal
        open={open}
        onClose={closePopup}
        title={autoOpened ? "Tell us what you need" : "Quick enquiry"}
        subtitle="Share your details and our team will get back to you."
        submitLabel="Submit enquiry"
      />
    </>
  );
}
