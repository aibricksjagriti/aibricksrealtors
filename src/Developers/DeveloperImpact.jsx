"use client";

import { useParams } from "next/navigation";

/* 🔁 Convert slug → Proper Name */
function formatBuilderName(slug) {
  if (!slug) return "";

  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export const defaultImpactPoints = [
  {
    title: "Economic Contribution",
    desc: "The development of residential, commercial, and retail projects by the builder has significantly contributed to job creation and economic growth in the region. These developments not only generate direct employment in construction and real estate sectors but also create indirect opportunities in allied industries such as retail, logistics, and services.",
  },
  {
    title: "Focus on Sustainability",
    desc: "The builder emphasizes eco-friendly construction practices by incorporating green building concepts, energy-efficient technologies, rainwater harvesting systems, and sustainable materials. This commitment helps reduce environmental impact while promoting long-term sustainability in urban development.",
  },
  {
    title: "Enhanced Infrastructure",
    desc: "Through large-scale residential and commercial developments, the builder has played a crucial role in improving local infrastructure. This includes better road connectivity, upgraded public utilities, enhanced transportation access, and overall improvement in civic amenities surrounding the project areas.",
  },
  {
    title: "Influence on Market Trends",
    desc: "The builder has set new benchmarks in the real estate industry by introducing innovative architectural designs, modern amenities, and smart living solutions. Their projects influence market trends and raise the overall standard of quality and lifestyle expectations among homebuyers.",
  },
  {
    title: "Customer Satisfaction",
    desc: "Customer-centric approach, timely project delivery, and transparent dealings have helped the builder establish a strong reputation in the market. By maintaining quality standards and fulfilling commitments, they have built trust and long-term relationships with buyers and investors.",
  },
  {
    title: "Integrated Township Development",
    desc: "The builder focuses on creating integrated townships that offer a complete lifestyle experience. These developments include residential units along with schools, hospitals, retail spaces, parks, and recreational facilities, ensuring convenience and a self-sustained community environment.",
  },
  {
    title: "Technological Innovation",
    desc: "Adoption of modern construction technologies and smart home features has enabled the builder to deliver high-quality projects efficiently. Use of automation, advanced materials, and digital solutions enhances both construction quality and user experience.",
  },
];

export default function DeveloperImpact({ builderName: providedBuilderName, developer }) {
  const params = useParams();

  // get slug from URL
  const slug = params?.slug;

  // convert to proper builder name
  const builderName = providedBuilderName || formatBuilderName(slug);
  const impactPoints = Array.isArray(developer?.impactPoints) && developer.impactPoints.length
    ? developer.impactPoints
    : defaultImpactPoints;

  return (
    <section className="bg-[#f5f5f5] py-12 md:py-16 px-4 relative">
      <div className="max-w-6xl mx-auto">
        {/* HEADING */}
        <h2 className="text-2xl md:text-4xl font-semibold text-center mb-6 leading-snug">
          Impact of {builderName} builders in Real Estate.
        </h2>

        {/* CONTENT */}
        <div className="text-gray-700 text-sm md:text-base leading-relaxed space-y-5">
          <p>
            {builderName} Developers Limited is a well-known real estate company
            with a significant presence. They have played a notable role in
            shaping the real estate landscape in the city.
          </p>

          <p>
            Recognizing the demand for affordable housing, {builderName} has
            been involved in projects aimed at providing cost-effective housing
            solutions.
          </p>

          {/* <ul className="list-disc pl-5 space-y-3">
            <li>
              <span className="font-semibold">Economic Contribution - </span>
              Generates employment and boosts economic growth.
            </li>

            <li>
              <span className="font-semibold">Focus on Sustainability - </span>
              Uses eco-friendly and energy-efficient practices.
            </li>

            <li>
              <span className="font-semibold">Enhanced Infrastructure - </span>
              Improves connectivity and civic amenities.
            </li>

            <li>
              <span className="font-semibold">Market Influence - </span>
              Sets trends with innovation and quality.
            </li>

            <li>
              <span className="font-semibold">Customer Satisfaction - </span>
              Focuses on timely delivery and transparency.
            </li>

            <li>
              <span className="font-semibold">Collaborative Ventures - </span>
              Partners with industry experts for better projects.
            </li>
          </ul> */}
          <ul className="space-y-4">
            {impactPoints.map((item, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-xl">•</span>
                <p>
                  <span className="font-semibold">{item.title} - </span>
                  {item.desc}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
