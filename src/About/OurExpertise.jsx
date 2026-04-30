"use client";
import { motion } from "framer-motion";
import { Home, TrendingUp, MapPin, ShieldCheck, HandshakeIcon, BarChart2, UserCheck } from "lucide-react";

const specialisms = [
  {
    icon: <Home className="w-8 h-8" />,
    title: "Residential Properties",
    desc: "Curated 2BHK, 3BHK, and luxury homes across Pune's prime corridors — ready-to-move and under-construction.",
  },
  {
    icon: <TrendingUp className="w-8 h-8" />,
    title: "Investment Advisory",
    desc: "Strategic guidance on capital appreciation, rental yield, and long-term wealth creation through Pune real estate.",
  },
  {
    icon: <MapPin className="w-8 h-8" />,
    title: "Location Expertise",
    desc: "Deep knowledge of Hinjewadi, Wakad, Punawale, Baner, and emerging micro-markets with high growth potential.",
  },
];

const usps = [
  {
    title: "Trusted Developer Network Only",
    desc: "We exclusively collaborate with authority-grade, RERA-compliant developers. No fly-by-night projects, no unverified listings — ever.",
  },
  {
    title: "End-to-End Assistance",
    desc: "From initial site visits and due diligence to loan facilitation and final booking — we are with you at every step.",
  },
  {
    title: "Strong Market Insights",
    desc: "Data-driven intelligence on pricing trends, upcoming developments, and micro-market dynamics to inform smarter decisions.",
  },
  {
    title: "Personalised Consultation",
    desc: "No generic advice. Every client receives a tailored recommendation aligned with their budget, lifestyle, and investment goals.",
  },
];

const advantages = [
  {
    icon: <ShieldCheck className="w-8 h-8 text-[var(--color-ochre)]" />,
    title: "No Fake Commitments",
    desc: "We present only what we can deliver — honest timelines, accurate pricing, and real project status.",
  },
  {
    icon: <BarChart2 className="w-8 h-8 text-[var(--color-ochre)]" />,
    title: "Data-Driven Recommendations",
    desc: "Every suggestion is backed by current market data, price history, and location intelligence.",
  },
  {
    icon: <HandshakeIcon className="w-8 h-8 text-[var(--color-ochre)]" />,
    title: "Exclusive Deals & Offers",
    desc: "Access to pre-launch pricing, developer-exclusive inventory, and special incentive packages.",
  },
  {
    icon: <UserCheck className="w-8 h-8 text-[var(--color-ochre)]" />,
    title: "Dedicated Relationship Manager",
    desc: "A single point of contact who understands your needs and ensures a seamless experience throughout.",
  },
];

export default function OurExpertise() {
  return (
    <>
      {/* What We Specialise In */}
      <section className="w-[90%] mx-auto py-16 overflow-hidden">
        <motion.span
          className="inline-block bg-[var(--color-darkgray)] text-white text-xs font-semibold px-4 py-1.5 rounded mb-4 tracking-widest uppercase"
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Our Expertise
        </motion.span>

        <motion.h2
          className="text-4xl md:text-5xl font-bold text-[var(--color-darkgray)] mb-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          What We Specialise In
        </motion.h2>
        <motion.p
          className="text-gray-600 text-lg mb-10 max-w-3xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          From first-time homebuyers exploring 2BHK options to seasoned
          investors seeking high-yield assets, AiBricks Realtors offers
          end-to-end expertise across Pune&apos;s most sought-after micro-markets.
        </motion.p>

        <div className="grid md:grid-cols-3 gap-6">
          {specialisms.map((s, i) => (
            <motion.div
              key={i}
              className="bg-[#edece8] rounded-2xl p-7 hover:shadow-lg transition-all duration-300 hover:bg-[#f1e5b4]"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
            >
              <div className="text-[var(--color-brickred)] mb-4">{s.icon}</div>
              <h3 className="text-lg font-bold text-[var(--color-darkgray)] mb-2">
                {s.title}
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why AiBricks Stands Apart */}
      <section className="w-full bg-[var(--color-darkgray)] py-16 overflow-hidden">
        <div className="w-[90%] mx-auto">
          <motion.span
            className="inline-block bg-[var(--color-ochre)] text-[var(--color-darkgray)] text-xs font-semibold px-4 py-1.5 rounded mb-4 tracking-widest uppercase"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Our USP
          </motion.span>

          <motion.h2
            className="text-4xl md:text-5xl font-bold text-white mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Why AiBricks Stands Apart
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-5">
            {usps.map((u, i) => (
              <motion.div
                key={i}
                className="border border-[var(--color-ochre)]/40 rounded-xl p-6 hover:border-[var(--color-ochre)] transition-colors duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <h3 className="text-lg font-bold text-[var(--color-ochre)] mb-2">
                  {u.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">{u.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The AiBricks Advantage */}
      <section className="w-[90%] mx-auto py-16 overflow-hidden">
        <motion.span
          className="inline-block bg-[var(--color-darkgray)] text-white text-xs font-semibold px-4 py-1.5 rounded mb-4 tracking-widest uppercase"
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Why Choose Us
        </motion.span>

        <motion.h2
          className="text-4xl md:text-5xl font-bold text-[var(--color-darkgray)] mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          The AiBricks Advantage
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-x-16 gap-y-10">
          {advantages.map((a, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <div className="mb-3">{a.icon}</div>
              <h3 className="text-lg font-bold text-[var(--color-darkgray)] mb-2">
                {a.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">{a.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}
