"use client";
import { motion } from "framer-motion";
import { Info, ShieldCheck, Eye, Heart } from "lucide-react";

const coreValues = [
  {
    icon: <ShieldCheck className="w-5 h-5" />,
    title: "Trust First",
    desc: "Every developer we partner with is rigorously vetted",
  },
  {
    icon: <Eye className="w-5 h-5" />,
    title: "Transparency",
    desc: "Honest advice — no hidden agendas, no inflated claims",
  },
  {
    icon: <Heart className="w-5 h-5" />,
    title: "Long-Term View",
    desc: "We invest in relationships, not just transactions",
  },
];

const IntroSection = () => {
  return (
    <section className="w-[90%] mx-auto py-16 lg:py-20 overflow-hidden">
      <motion.span
        className="inline-block bg-[var(--color-darkgray)] text-white text-xs font-semibold px-4 py-1.5 rounded mb-4 tracking-widest uppercase"
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        About Us
      </motion.span>

      <motion.h2
        className="text-4xl md:text-5xl font-bold text-[var(--color-darkgray)] mb-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        Who We Are
      </motion.h2>

      <div className="grid lg:grid-cols-2 gap-10 items-start">
        {/* Left — text */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-gray-700 text-lg leading-relaxed mb-5">
            AiBricks Realtors is a Pune-based real estate advisory firm built on
            a singular promise —{" "}
            <strong className="text-[var(--color-darkgray)]">
              trust, transparency, and long-term relationships
            </strong>
            . In a market crowded with noise and incomplete information, we serve
            as a clear, honest bridge between homebuyers and the city&apos;s most
            reputed developers.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed mb-8">
            We believe every buyer deserves verified listings, genuine guidance,
            and a partner who stands with them from the very first query to final
            possession and beyond. Our team brings deep local knowledge, market
            expertise, and a client-first ethos to every interaction.
          </p>

          {/* Quote */}
          <div className="flex items-start gap-3 bg-[#f0f4f8] border-l-4 border-[var(--color-ochre)] rounded-r-xl p-5">
            <Info className="w-5 h-5 text-[var(--color-ochre)] mt-0.5 shrink-0" />
            <p className="text-gray-700 text-base leading-relaxed">
              We are not brokers. We are advisors — with your best interest at
              the centre of every recommendation.
            </p>
          </div>
        </motion.div>

        {/* Right — Core Values card */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="bg-[linear-gradient(135deg,_#f1df9e_0%,_#d5b258_100%)] rounded-2xl p-8 shadow-lg"
        >
          <h3 className="text-xl font-bold text-[var(--color-darkgray)] mb-6">
            Our Core Values
          </h3>
          <div className="flex flex-col gap-6">
            {coreValues.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              >
                <div className="flex items-center gap-2 mb-1 text-[var(--color-darkgray)] font-semibold text-lg">
                  {v.icon}
                  {v.title}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed pl-7">
                  {v.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default IntroSection;
