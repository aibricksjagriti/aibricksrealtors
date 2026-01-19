// "use client";
// import { motion } from "framer-motion";
// import { CheckCircle } from "lucide-react";

// export default function MissionSection() {
//   return (
//     <section className="w-[90%] mx-auto py-20">
//       <div className="grid md:grid-cols-2 gap-12 items-center">
//         {/* Left Side: Overlapping Images */}
//         <div className="relative flex justify-center md:justify-start">
//           {/* Background Image */}
//           <motion.img
//             src="/home/dubai.webp" // replace with your image path
//             alt="Construction Plan"
//             className="rounded-2xl shadow-lg w-[85%] md:w-[90%] object-cover"
//             initial={{ opacity: 0, x: -50 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.8 }}
//             viewport={{ once: true }}
//           />

//           {/* Overlay Image */}
//           <motion.img
//             src="/home/sarjah.webp" // replace with your image path
//             alt="Engineers Discussing"
//             className="absolute bottom-[-30px] right-[20px] w-[55%] md:w-[60%] rounded-2xl shadow-2xl border-4 border-white object-cover"
//             initial={{ opacity: 0, x: 50 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.8, delay: 0.2 }}
//             viewport={{ once: true }}
//           />
//         </div>

//         {/* Right Side: Text Content */}
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//           viewport={{ once: true }}
//           className="space-y-6"
//         >
//           <h2 className="text-4xl md:text-5xl font-bold text-[var(--color-darkgray)]">
//             Our Mission
//           </h2>

//           <p className="text-gray-600 leading-relaxed text-lg">
//             To provide exceptional real estate and construction services that
//             exceed client expectations through innovation, craftsmanship, and a
//             commitment to sustainability. We aim to build lasting relationships
//             and create spaces that enhance communities and redefine modern
//             living.
//           </p>

//           <ul className="space-y-4">
//             {[
//               "Fostering Sustainable Growth and Green Development",
//               "Innovating for a Sustainable Future",
//               "Customer-Centric Approach",
//               "Building Stronger Communities",
//             ].map((point, index) => (
//               <li key={index} className="flex items-start gap-3 text-gray-700">
//                 <CheckCircle className="text-[#d5b258] mt-1 w-5 h-5 flex-shrink-0" />
//                 <span className="leading-snug">{point}</span>
//               </li>
//             ))}
//           </ul>
//         </motion.div>
//       </div>
//       <div className="grid md:grid-cols-2 gap-12 items-center mt-20">
//         {/* Left Side: Text Content */}
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//           viewport={{ once: true }}
//           className="space-y-6"
//         >
//           <h2 className="text-4xl md:text-5xl font-bold text-[var(--color-darkgray)]">
//             Our Vision
//           </h2>

//           <p className="text-gray-600 leading-relaxed text-lg">
//             To provide exceptional real estate and construction services that
//             exceed client expectations through innovation, craftsmanship, and a
//             commitment to sustainability. We aim to build lasting relationships
//             and create spaces that enhance communities and redefine modern
//             living.
//           </p>

//           <ul className="space-y-4">
//             {[
//               "Fostering Sustainable Growth and Green Development",
//               "Innovating for a Sustainable Future",
//               "Customer-Centric Approach",
//               "Building Stronger Communities",
//             ].map((point, index) => (
//               <li key={index} className="flex items-start gap-3 text-gray-700">
//                 <CheckCircle className="text-[#d5b258] mt-1 w-5 h-5 flex-shrink-0" />
//                 <span className="leading-snug">{point}</span>
//               </li>
//             ))}
//           </ul>
//         </motion.div>
//         {/* Right Side: Overlapping Images */}
//         <div className="relative flex justify-center md:justify-start">
//           {/* Background Image */}
//           <motion.img
//             src="/home/dubai.webp" // replace with your image path
//             alt="Construction Plan"
//             className="rounded-2xl shadow-lg w-[85%] md:w-[90%] object-cover"
//             initial={{ opacity: 0, x: -50 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.8 }}
//             viewport={{ once: true }}
//           />

//           {/* Overlay Image */}
//           <motion.img
//             src="/home/sarjah.webp" // replace with your image path
//             alt="Engineers Discussing"
//             className="absolute bottom-[-30px] right-[20px] w-[55%] md:w-[60%] rounded-2xl shadow-2xl border-4 border-white object-cover"
//             initial={{ opacity: 0, x: 50 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.8, delay: 0.2 }}
//             viewport={{ once: true }}
//           />
//         </div>
//       </div>
//     </section>
//   );
// }

// ***Without Hover Effect***

// "use client";
// import Image from "next/image";

// const MissionVisionSection = () => {
//   return (
//     <section className="w-full bg-[#f8f9fb] flex flex-col items-center justify-center lg:py-20 py-10 px-4 md:px-8 lg:px-16">
//       <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-10 items-center">
//         {/* Left side - Images */}
//         <div className="flex flex-col md:flex-row lg:flex-col xl:flex-row gap-4 justify-center">
//           {/* Large Image */}
//           <div className="w-full md:w-1/2 lg:w-full xl:w-1/2">
//             <div className="shadow-lg rounded-lg overflow-hidden">
//               <Image
//                 src="/home/dubai.webp"
//                 alt="Conference Room"
//                 width={600}
//                 height={400}
//                 className="object-cover w-full h-[400px]"
//               />
//             </div>
//           </div>

//           {/* Two smaller images stacked */}
//           <div className="flex flex-col gap-4 w-full md:w-1/2 lg:w-full xl:w-1/2">
//             <div className="shadow-lg rounded-lg overflow-hidden lg:mt-[-100px] mt-0">
//               <Image
//                 src="/home/sarjah.webp"
//                 alt="Meeting Area"
//                 width={600}
//                 height={280}
//                 className="object-cover w-full h-[320px]"
//               />
//             </div>
//             <div className="shadow-lg rounded-lg overflow-hidden">
//               <Image
//                 src="/home/ajman.webp"
//                 alt="Office Interior"
//                 width={600}
//                 height={280}
//                 className="object-cover  h-[180px] w-full"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Right side - Text */}
//         <div className="flex flex-col gap-10">
//           {/* Mission */}
//           <div>
//             <h2 className="text-5xl font-bold text-gray-900">
//               <span className="text-[var(--color-darkgray)]">Our </span>
//               <span className="text-[var(--color-ochre)]">Mission</span>
//             </h2>
//             <p className="text-gray-700 text-lg mt-4 leading-relaxed">
//               Deliver industry-leading AV and IT solutions tailored to each
//               client’s unique needs. Empower businesses to communicate,
//               collaborate, and grow seamlessly with technology. Set new
//               benchmarks for quality, reliability, and client satisfaction in
//               every engagement.
//             </p>
//           </div>

//           {/* Vision */}
//           <div className="bg-gradient-to-r from-[#5a082a] via-[#8D0B41] to-[#a63b1e] text-white rounded-lg p-6 shadow-md lg:ml-[-70px] md:ml-[0px] sm:ml-[0px] lg:w-[90%] w-full">
//             <h2 className="text-5xl font-bold mb-4">
//               <span className="text-[var(--color-lightcream)]">Our </span>{" "}
//               <span className="text-[var(--color-ochre)]">Vision</span>
//             </h2>
//             <p className="text-lg leading-relaxed">
//               Become the foremost name in AV and IT innovation for
//               forward-thinking enterprises. Shape the landscape of
//               technology-driven workspaces across India and beyond. Inspire
//               businesses to reach new heights through world-class integrated
//               experiences.
//             </p>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default MissionVisionSection;

"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const MissionVisionSection = () => {
  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  };

  const fadeLeft = {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0 },
  };

  const fadeRight = {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <section className="w-[90%] mx-auto  flex flex-col items-center justify-center lg:py-20 py-10  px-4 md:px-8 lg:px-16 overflow-hidden">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ staggerChildren: 0.2 }}
        className="max-w-7xl w-full grid lg:grid-cols-2 gap-10 items-center"
      >
        {/* Left side - Images */}
        <motion.div
          variants={fadeLeft}
          className="flex flex-col md:flex-row lg:flex-col xl:flex-row gap-4 justify-center"
        >
          {/* Large Image */}
          <motion.div
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.4 }}
            className="w-full md:w-1/2 lg:w-full xl:w-1/2 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-[rgba(213,178,88,0.4)] transition-all duration-500"
          >
            <Image
              src="/home/dubai.webp"
              alt="Conference Room"
              width={600}
              height={400}
              className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-700"
            />
          </motion.div>

          {/* Two smaller images stacked */}
          <div className="flex flex-col gap-4 w-full md:w-1/2 lg:w-full xl:w-1/2">
            <motion.div
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.4 }}
              className="shadow-lg rounded-lg overflow-hidden lg:mt-[-100px] mt-0 hover:shadow-2xl hover:shadow-[rgba(213,178,88,0.4)] transition-all duration-500"
            >
              <Image
                src="/home/sarjah.webp"
                alt="Meeting Area"
                width={600}
                height={280}
                className="object-cover w-full h-[320px] transform hover:scale-105 transition-transform duration-700"
              />
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.4 }}
              className="shadow-lg rounded-lg overflow-hidden hover:shadow-2xl hover:shadow-[rgba(213,178,88,0.4)] transition-all duration-500"
            >
              <Image
                src="/home/ajman.webp"
                alt="Office Interior"
                width={600}
                height={280}
                className="object-cover w-full h-[180px] transform hover:scale-105 transition-transform duration-700"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Right side - Text */}
        <motion.div
          variants={fadeRight}
          className="flex flex-col gap-10 text-left"
        >
          {/* Mission */}
          <motion.div variants={fadeUp}>
            <h2 className="text-4xl font-bold text-gray-900">
              <span className="text-[var(--color-darkgray)]">Our </span>
              <span className="text-[var(--color-ochre)]">Mission</span>
            </h2>
            <p className="text-gray-700 text-lg mt-4 leading-relaxed">
              Deliver industry-leading AV and IT solutions tailored to each
              client’s unique needs. Empower businesses to communicate,
              collaborate, and grow seamlessly with technology. Set new
              benchmarks for quality, reliability, and client satisfaction in
              every engagement.
            </p>
          </motion.div>

          {/* Vision */}
          <motion.div
            variants={fadeUp}
            className="bg-gradient-to-r from-[#5a082a] via-[#8D0B41] to-[#a63b1e] text-white rounded-sm p-8 shadow-xl   w-full hover:shadow-[0_0_25px_rgba(213,178,88,0.5)] transition-shadow duration-700"
          >
            <h2 className="text-4xl font-bold mb-4">
              <span className="text-[var(--color-lightcream)]">Our </span>
              <span className="text-[var(--color-ochre)]">Vision</span>
            </h2>
            <p className="text-lg leading-relaxed">
              Become the foremost name in AV and IT innovation for
              forward-thinking enterprises. Shape the landscape of
              technology-driven workspaces across India and beyond. Inspire
              businesses to reach new heights through world-class integrated
              experiences.
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default MissionVisionSection;
