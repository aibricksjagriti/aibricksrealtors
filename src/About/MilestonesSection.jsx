"use client";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const milestones = [
  {
    value: 2000,
    suffix: "+",
    label: "Happy Clients",
    desc: "Families and investors served with verified, trusted property guidance",
  },
  {
    prefix: "₹",
    value: 1200,
    suffix: "Cr+",
    label: "Property Value Transacted",
    desc: "Total value of real estate successfully facilitated for our clients",
  },
  {
    value: 500,
    suffix: "+",
    label: "Verified Projects",
    desc: "Curated, RERA-compliant projects across Pune's prime micro-markets",
  },
  {
    value: 20,
    suffix: "+",
    label: "Years of Expertise",
    desc: "Deep market knowledge built over years of boots-on-ground experience",
  },
];

function CountUp({ target, prefix = "", suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1800;
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          const interval = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(interval);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function MilestonesSection() {
  return (
    <section className="w-[90%] mx-auto py-16 overflow-hidden">
      <motion.span
        className="inline-block bg-[var(--color-darkgray)] text-white text-xs font-semibold px-4 py-1.5 rounded mb-4 tracking-widest uppercase"
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        Achievements
      </motion.span>

      <motion.h2
        className="text-4xl md:text-5xl font-bold text-[var(--color-darkgray)] mb-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        Our Milestones
      </motion.h2>
      <motion.p
        className="text-gray-600 text-lg mb-12 max-w-2xl"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        Every number below represents a client who placed their trust in us —
        and a commitment we honoured with integrity, expertise, and dedication.
      </motion.p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {milestones.map((m, i) => (
          <motion.div
            key={i}
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.12 }}
          >
            <div className="text-4xl md:text-5xl font-bold text-[var(--color-darkgray)] mb-2">
              <CountUp
                target={m.value}
                prefix={m.prefix || ""}
                suffix={m.suffix}
              />
            </div>
            <p className="font-semibold text-gray-800 mb-1">{m.label}</p>
            <p className="text-gray-500 text-xs leading-relaxed">{m.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
