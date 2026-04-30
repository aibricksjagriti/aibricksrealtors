"use client";

import { Mail, Phone } from "lucide-react";
import toast from "react-hot-toast";

export default function SellerContactActions({ phone, email, propertyTitle }) {
  const handleCall = () => {
    if (phone) {
      window.location.href = `tel:${phone}`;
    } else {
      toast.error("Agent contact details are currently unavailable", {
        icon: "ℹ️",
      });
    }
  };

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
        <button
          onClick={handleCall}
          className="px-5 py-2 bg-brickred text-white rounded-lg cursor-pointer transition hover:bg-ochre"
        >
          <Phone />
        </button>

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
