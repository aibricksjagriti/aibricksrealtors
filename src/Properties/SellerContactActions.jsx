"use client";

import { Mail, Phone } from "lucide-react";
import {
  MAIN_CONTACT_MAILTO,
  MAIN_CONTACT_TEL,
} from "@/lib/constants/contact";

export default function SellerContactActions({ propertyTitle }) {
  const emailHref = `${MAIN_CONTACT_MAILTO}?subject=${encodeURIComponent(
    `Enquiry for ${propertyTitle || "a project"}`,
  )}`;

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

        <a
          href={emailHref}
          aria-label="Email AI Bricks Realtors"
          className="px-5 py-2 border border-brickred text-brickred rounded-lg cursor-pointer transition hover:bg-brickred hover:text-white"
        >
          <Mail />
        </a>
      </div>
    </>
  );
}
