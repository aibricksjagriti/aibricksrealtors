"use client";
import { motion } from "framer-motion";

const MissionVisionSection = () => {
  return (
    <section className="w-[90%] mx-auto py-16 lg:py-20 overflow-hidden">
      <motion.span
        className="inline-block bg-[var(--color-darkgray)] text-white text-xs font-semibold px-4 py-1.5 rounded mb-4 tracking-widest uppercase"
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        Vision &amp; Mission
      </motion.span>

      <motion.h2
        className="text-4xl md:text-5xl font-bold text-[var(--color-darkgray)] mb-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        Our Purpose
      </motion.h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Vision */}
        <motion.div
          className="bg-[var(--color-darkgray)] text-white rounded-2xl p-8 shadow-md"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-2xl mb-3">🔭</p>
          <h3 className="text-2xl font-bold text-[var(--color-ochre)] mb-4">
            Our Vision
          </h3>
          <p className="text-gray-200 text-lg leading-relaxed">
            To become Pune&apos;s most trusted real estate partner — a name
            synonymous with integrity, expertise, and unwavering client advocacy
            in every property decision.
          </p>
        </motion.div>

        {/* Mission */}
        <motion.div
          className="bg-[linear-gradient(135deg,_#f1df9e_0%,_#d5b258_100%)] rounded-2xl p-8 shadow-md"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <p className="text-2xl mb-3">🎯</p>
          <h3 className="text-2xl font-bold text-[var(--color-darkgray)] mb-4">
            Our Mission
          </h3>
          <p className="text-gray-800 text-lg leading-relaxed">
            To deliver verified properties from reputed, Grade A developers with
            honest, data-driven guidance — ensuring every buyer makes a
            confident, well-informed investment.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default MissionVisionSection;
