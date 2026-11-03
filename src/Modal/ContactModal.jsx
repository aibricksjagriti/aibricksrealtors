"use client";

import { useEffect, useState } from "react";
import { MessageSquareMore } from "lucide-react";
import LeadCaptureModal from "@/src/LeadCapture/LeadCaptureModal";

export default function ContactModal() {
  const [open, setOpen] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const completionStorageKey = "enquiryLeadSubmitted";

  useEffect(() => {
    let completed = false;

    try {
      completed = Boolean(localStorage.getItem(completionStorageKey));
      setHasSubmitted(completed);
    } catch {
      // Storage may be unavailable; the dismissible popup can still be shown.
    }

    if (completed) return undefined;

    const timerId = window.setTimeout(() => setOpen(true), 6000);
    return () => window.clearTimeout(timerId);
  }, []);

  const recordCompletion = () => {
    setHasSubmitted(true);

    try {
      localStorage.setItem(
        completionStorageKey,
        JSON.stringify({ submitted: true, submittedAt: new Date().toISOString() }),
      );
      localStorage.removeItem("enquiryPopupSeen");
    } catch {
      // The in-memory flag still allows the successful submitter to continue.
    }
  };

  const closePopup = () => {
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
        aria-label="Open enquiry form"
        title="Enquiry"
        className="fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] right-[max(0.75rem,env(safe-area-inset-right))] z-40 grid h-13 w-13 place-items-center rounded-full bg-ochre text-brickred shadow-[0_6px_20px_rgba(15,30,62,0.32)] transition hover:scale-105 active:scale-95 md:hidden"
      >
        <MessageSquareMore size={23} aria-hidden="true" />
        <span className="sr-only">Enquiry</span>
      </button>

      <LeadCaptureModal
        open={open}
        onClose={closePopup}
        onSuccess={recordCompletion}
        requireCompletion={false}
        title={hasSubmitted ? "Quick enquiry" : "Tell us what you need"}
        subtitle={hasSubmitted
          ? "Share your details and our team will get back to you."
          : "Share your details and our team will get back to you."}
        submitLabel="Submit enquiry"
      />
    </>
  );
}
