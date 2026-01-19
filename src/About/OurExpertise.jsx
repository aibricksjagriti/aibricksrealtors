"use client";
import { Building2, Hammer, Globe, Landmark } from "lucide-react";
import { motion } from "framer-motion";

export default function OurExpertise() {
  const cards = [
    {
      icon: <Building2 className="w-8 h-8 mb-3" />,
      title: "Premium Real Estate Development",
      desc: "Crafting architectural landmarks that redefine modern living — from residential spaces to commercial hubs built with excellence.",
      active: true,
    },
    {
      icon: <Hammer className="w-8 h-8 mb-3" />,
      title: "Construction & Engineering",
      desc: "Delivering precision-engineered structures with the highest standards of safety, design, and durability.",
    },
    {
      icon: <Landmark className="w-8 h-8 mb-3" />,
      title: "Property Management System",
      desc: "Ensuring lasting value through expert property care, maintenance, and end-to-end real estate management solutions.",
    },
    {
      icon: <Globe className="w-8 h-8 mb-3" />,
      title: "Smart & Sustainable Spaces",
      desc: "Integrating innovation and sustainability to create energy-efficient, future-ready environments for tomorrow’s lifestyle.",
    },
  ];

  // Animation variants for cards
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2, // delay between each card animation
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  return (
    <section className="w-[90%] mx-auto py-16 px-6 md:px-12 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        {/* Header section with motion */}
        <motion.div
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <div>
            <h2 className="text-4xl font-semibold text-[var(--color-darkgray)]">
              OUR <span className="text-[var(--color-ochre)]">EXPERTISE</span>
            </h2>
            <p className="text-gray-600 mt-2 text-lg">
              At AiBricks Realtors, we blend innovation, craftsmanship, and
              trust to deliver real estate solutions that inspire confidence and
              elevate modern living.
            </p>
          </div>
        </motion.div>

        {/* Cards section with staggered animation */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {cards.map((card, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className={`rounded-2xl p-6 shadow-sm transition-all duration-300 hover:shadow-lg ${
                card.active
                  ? "bg-[linear-gradient(135deg,_#f1df9e_0%,_#d5b258_100%)] text-white"
                  : "bg-[#edece8] hover:bg-[#f1e5b4] text-gray-900"
              }`}
            >
              <div
                className={`${
                  card.active ? "text-white" : "text-[var(--color-brickred)]"
                } flex flex-col items-start`}
              >
                {card.icon}
                <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
                <p
                  className={`text-md ${
                    card.active ? "text-gray-100" : "text-gray-600"
                  } mb-4`}
                >
                  {card.desc}
                </p>
                <button
                  className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 ${
                    card.active
                      ? "bg-white text-[var(--color-brickred)] hover:bg-gray-100"
                      : "bg-[var(--color-brickred)] text-white hover:bg-[var(--color-ochre)]"
                  }`}
                >
                  Learn More
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
