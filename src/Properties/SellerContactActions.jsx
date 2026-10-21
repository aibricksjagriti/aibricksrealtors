"use client";

import { Mail, Phone } from "lucide-react";
import toast from "react-hot-toast";
import { MAIN_CONTACT_TEL } from "@/lib/constants/contact";

export default function SellerContactActions({ email, propertyTitle }) {
  const handleEmail = () => {
    if (email) {
      window.location.href = `mailto:${email}?subject=Enquiry for ${propertyTitle}`;
    } else {
      toast.error("Email not available");
    }
  };

  return (
    <>
      <div className="flex gap-3">
        <a
          href={MAIN_CONTACT_TEL}
          aria-label="Call AI Bricks Realtors"
          className="px-5 py-2 bg-brickred text-white rounded-lg cursor-pointer transition hover:bg-ochre"
        >
          <Phone />
        </a>

        <button
          onClick={handleEmail}
          className="px-5 py-2 border border-brickred text-brickred rounded-lg cursor-pointer transition hover:bg-brickred hover:text-white"
        >
          <Mail />
        </button>
      </div>
    </>
  );
}
