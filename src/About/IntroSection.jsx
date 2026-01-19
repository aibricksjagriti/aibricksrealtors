"use client";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";

const IntroSection = () => {
  return (
    <section className="py-10 px-6 md:px-12 overflow-hidden ">
      <div className="bg-[linear-gradient(135deg,_#f1df9e_0%,_#d5b258_100%)] py-10 px-6 md:px-12 overflow-hidden ">
        <div className=" max-w-6xl mx-auto flex flex-col md:flex-row items-center md:space-x-10">
          {/* Left Image with animation */}
          <motion.div
            className="w-full md:w-1/2 mb-8 md:mb-0"
            initial={{ opacity: 0, x: -80 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <Image
              src="/about/about-1.jpg" // Replace with actual real estate image
              alt="AI Bricks Realtors"
              width={500}
              height={400}
              className="shadow-md w-full object-cover rounded-lg"
            />
          </motion.div>

          {/* Right Text Section with animation */}
          <motion.div
            className="w-full md:w-1/2"
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true }}
          >
            <motion.span
              className="bg-[#e9e3dd] text-[#5a3a2b] px-3 py-1 rounded text-sm font-medium inline-block"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
              viewport={{ once: true }}
            >
              Meet Our Founder
            </motion.span>

            <motion.h2
              className="text-3xl md:text-4xl font-semibold text-[var(--color-darkgray)] mt-4 mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              Abhishek Saigal
            </motion.h2>

            <motion.h3
              className="text-lg md:text-xl font-medium text-gray-700 mb-4"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              viewport={{ once: true }}
            >
              Founder, AI Bricks Realtors
            </motion.h3>

            <motion.p
              className="text-gray-600 leading-relaxed mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true }}
            >
              Abhishek Saigal is the driving force behind AI Bricks Realtors, a
              brand built on innovation, trust, and excellence in modern real
              estate. With a clear vision to revolutionize the property
              landscape, Abhishek brings together architectural precision,
              cutting-edge technology, and human-centered design to redefine how
              people experience living spaces.
            </motion.p>

            <motion.p
              className="text-gray-600 leading-relaxed mb-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
            >
              A firm believer in transparent dealings and long-term value
              creation, he has led AI Bricks Realtors with integrity and purpose
              — ensuring that every project reflects quality, sustainability,
              and thoughtful craftsmanship. His forward-thinking approach blends
              creativity with strategic insight, turning every venture into a
              statement of reliability and innovation.
            </motion.p>

            <motion.p
              className="text-gray-600 leading-relaxed mb-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
            >
              Under his leadership, AI Bricks Realtors continues to shape the
              future of real estate, building not just homes — but lasting
              relationships and thriving communities.
            </motion.p>

            {/* <motion.button
            className="bg-[var(--color-brickred)] text-white px-6 py-3 rounded-md hover:bg-[#2b1a19] transition"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            viewport={{ once: true }}
          >
            Explore Our Projects
          </motion.button> */}
          </motion.div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:space-x-10 lg:mt-24 mt-10 mb-10">
        {/* Right Image — show first on mobile */}
        <motion.div
          className="w-full md:w-1/2 mb-8 md:mb-0 order-1 md:order-2"
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <Image
            src="/about/about-2.jpg" // Replace with actual founder image
            alt="Anshika Rana - Founder, AI Bricks Realtors"
            width={500}
            height={400}
            className="shadow-md w-full object-cover rounded-lg"
          />
        </motion.div>

        {/* Left Text Section */}
        <motion.div
          className="w-full md:w-1/2 order-2 md:order-1"
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: true }}
        >
          <motion.span
            className="bg-[#e9e3dd] text-[#5a3a2b] px-3 py-1 rounded text-sm font-medium inline-block"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
            viewport={{ once: true }}
          >
            Meet Our Founder
          </motion.span>

          <motion.h2
            className="text-3xl md:text-4xl font-semibold text-[var(--color-darkgray)] mt-4 mb-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            Anshika Rana
          </motion.h2>

          <motion.h3
            className="text-lg md:text-xl font-medium text-gray-700 mb-4"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            viewport={{ once: true }}
          >
            Founder, AI Bricks Realtors
          </motion.h3>

          <motion.p
            className="text-gray-600 leading-relaxed mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
          >
            Anshika Rana is the visionary Founder of AI Bricks Realtors, a
            company redefining the real estate landscape through innovation,
            transparency, and client-centric values. With a deep passion for
            architecture and modern living, Anshika established AI Bricks
            Realtors to create homes that blend intelligent design with
            sustainability and comfort.
          </motion.p>

          <motion.p
            className="text-gray-600 leading-relaxed mb-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          >
            Guided by a forward-thinking approach and a belief in
            technology-driven solutions, Anshika leads AI Bricks Realtors toward
            a future of smart, seamless, and sustainable real estate
            experiences. Her leadership embodies integrity, innovation, and a
            commitment to crafting spaces that inspire trust, elevate
            lifestyles, and stand the test of time.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default IntroSection;
