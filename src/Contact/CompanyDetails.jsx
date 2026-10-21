"use client";

import { Phone, Mail, MapPin } from "lucide-react";
import {
  MAIN_CONTACT_DISPLAY,
  MAIN_CONTACT_TEL,
} from "@/lib/constants/contact";

export default function CompanyDetails() {
  const details = [
    {
      icon: <Phone className="w-10 h-10 text-ochre mx-auto" />,
      title: "Call Us",
      info: MAIN_CONTACT_DISPLAY,
      href: MAIN_CONTACT_TEL,
      subtext: "Monday – Friday: 10:00 am – 06:00 pm, Tuesday - Closed",
    },
    {
      icon: <Mail className="w-10 h-10 text-ochre mx-auto" />,
      title: "Send Message",
      info: "info@aibricksrealtors.com",
      subtext: "info@aibricksrealtors.com",
    },
    {
      icon: <MapPin className="w-10 h-10 text-ochre mx-auto" />,
      title: "Visit Our Office",
      info: "Office no 428",
      subtext:
        "The address Commercia, Hinjawadi Rd, Shankar Kalat Nagar, Wakad, Pune, Pimpri-Chinchwad, Maharashtra 411057",
    },
  ];

  return (
    <section className="w-full py-16 ">
      <div className="relative w-full h-[500px]">
        <img src="/home/dubai.webp" className="w-full h-full " alt="Dubai" />

        {/* BLACK BLUR OVERLAY */}
        <div className="absolute inset-0 bg-black/30 backdrop-blur-xs"></div>

        {/* CENTER TEXT */}
        <div className="absolute inset-0 flex items-center justify-center">
          <h2 className="text-white text-3xl md:text-5xl font-semibold text-center drop-shadow-lg line-clamp-3">
            Reach Out for Smart
            <br /> Real Estate Solutions
          </h2>
        </div>
      </div>
      {/* Heading */}
      <h2 className="text-center text-3xl md:text-4xl text-darkgray font-bold mt-16 mb-12">
        Our <span className="text-darkgray  bg-clip-text">Company Details</span>
      </h2>

      {/* Grid Section */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
        {details.map((item, i) => (
          <div
            key={i}
            className="flex flex-col items-center text-center py-10 px-6 space-y-3"
          >
            {item.icon}
            <h3 className="text-lg font-semibold text-gray-700">
              {item.title}
            </h3>
            {item.href ? (
              <a
                href={item.href}
                className="text-gray-800 font-medium text-base hover:text-ochre hover:underline"
              >
                {item.info}
              </a>
            ) : (
              <p className="text-gray-800 font-medium text-base">{item.info}</p>
            )}
            <hr className="w-1/2 border-gray-300" />
            <p className="text-sm text-gray-800">{item.subtext}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
