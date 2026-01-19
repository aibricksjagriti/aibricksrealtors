"use client";

import { Phone, Mail, MapPin } from "lucide-react";

export default function CompanyDetails() {
  const details = [
    {
      icon: <Phone className="w-10 h-10 text-[var(--color-ochre)] mx-auto" />,
      title: "Call Us",
      info: "(+91) - 8130120098",
      subtext: "Monday – Friday: 10:00 am – 06:00 pm",
    },
    {
      icon: <Mail className="w-10 h-10 text-[var(--color-ochre)] mx-auto" />,
      title: "Send Message",
      info: "info@aibricksrealtors.com",
      subtext: "info@aibricksrealtors.com",
    },
    {
      icon: <MapPin className="w-10 h-10 text-[var(--color-ochre)] mx-auto" />,
      title: "Visit Our Office",
      info: "Office no 428",
      subtext:
        "The address Commercia, Hinjawadi Rd, Shankar Kalat Nagar, Wakad, Pune, Pimpri-Chinchwad, Maharashtra 411057",
    },
  ];

  return (
    <section className="w-full py-16 ">
      <div className="w-full h-[500px]">
        <img src="/home/dubai.webp" className="w-full h-full" />
      </div>
      {/* Heading */}
      <h2 className="text-center text-3xl md:text-4xl text-[var(--color-darkgray)] font-bold mt-16 mb-12">
        Our{" "}
        <span className="text-[var(--color-darkgray)]  bg-clip-text">
          Company Details
        </span>
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
            <p className="text-gray-800 font-medium text-base">{item.info}</p>
            <hr className="w-1/2 border-gray-300" />
            <p className="text-sm text-gray-600">{item.subtext}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
