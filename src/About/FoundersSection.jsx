"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const founders = [
  {
    name: "Abhishek Saigal",
    role: "Co-Founder",
    highlights: [
      "12+ years in Pune residential real estate",
      "₹500Cr+ in personal transactions",
      "Deep corridor expertise across Pune micro-markets",
    ],
    image:'/about/abhishek.png',
  },
  {
    name: "Sumit Kumar",
    role: "Co-Founder",
    highlights: [
      "Investment advisory specialist",
      "Portfolio structuring & ROI analysis",
      "Financial risk profiling",
    ],
    image: "/about/sumit.png",
  },
  {
    name: "Deepak Kumar (Shah)",
    role: "Co-Founder",
    highlights: [
      "Channel partnerships & scaling",
      "Developer relations lead",
      "Network & growth strategy",
    ],
    image: '/about/deepak.jpg',
  },
];

export default function FoundersSection() {
  return (
    <section className="w-full bg-[var(--color-darkgray)] py-16 overflow-hidden">
      <div className="w-[90%] mx-auto">
        <motion.span
          className="inline-block bg-[var(--color-ochre)] text-[var(--color-darkgray)] text-xs font-semibold px-4 py-1.5 rounded mb-4 tracking-widest uppercase"
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Founder&apos;s Profile
        </motion.span>

        <motion.h2
          className="text-4xl md:text-5xl font-bold text-white mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Abhishek Saigal, Sumit Kumar, Deepak Shah
        </motion.h2>

        <motion.p
          className="text-gray-300 text-lg mb-12 max-w-3xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          With deep-rooted 20+ years of expertise spanning real estate advisory
          and marketing, the founders of AiBricks Realtors established the firm
          with a clear conviction: that the Pune property market deserved an
          advisory brand built on radical transparency and genuine buyer advocacy.
        </motion.p>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {founders.map((f, i) => (
            <motion.div
              key={i}
              className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-[var(--color-ochre)]/50 transition-colors duration-300"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.15 }}
            >
              {/* Placeholder avatar */}
              <div className="w-24 h-24 rounded-full bg-white/10 mb-5 mx-auto border-2 border-[var(--color-ochre)]/40 relative overflow-hidden">
                <Image src={f.image} alt={f.name} fill className="object-cover" />
              </div>

              <h3 className="text-xl font-bold text-white text-center mb-1">
                {f.name}
              </h3>
              <p className="text-[var(--color-ochre)] text-sm font-medium text-center mb-6">
                {f.role} — AiBricks Realtors
              </p>

              <ul className="space-y-3">
                {f.highlights.map((h, j) => (
                  <li key={j} className="flex items-start gap-2 text-gray-300 text-sm">
                    <span className="text-[var(--color-ochre)] mt-0.5 shrink-0">▸</span>
                    {h}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Quote */}
        <motion.div
          className="bg-[var(--color-ochre)]/10 border border-[var(--color-ochre)]/30 rounded-2xl p-8 max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <p className="text-white text-lg leading-relaxed italic mb-4">
            &ldquo;Real estate is not just property — it&apos;s a long-term relationship.
            At AiBricks, we honour that responsibility with every client we serve.&rdquo;
          </p>
          <p className="text-[var(--color-ochre)] font-semibold">
            — AiBricks Realtors
          </p>
        </motion.div>
      </div>
    </section>
  );
}
