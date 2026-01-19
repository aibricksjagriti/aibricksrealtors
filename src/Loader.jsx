"use client";
import { motion } from "framer-motion";

export default function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[var(--color-lightcream)] z-[9999]">
      <motion.div
        className="relative flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Circle spinner */}
        <motion.div
          className="w-20 h-20 border-4 border-t-[#d5b258] border-[#555] rounded-full animate-spin"
          animate={{
            rotate: 360,
          }}
          transition={{
            repeat: Infinity,
            duration: 1.2,
            ease: "linear",
          }}
        />

        {/* Brand name */}
        <motion.h1
          className="mt-6 text-[#d5b258] font-semibold tracking-[6px] text-lg uppercase"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          AIBRICKS REALTORS
        </motion.h1>

        {/* Tagline shimmer effect */}
        <motion.div
          className="mt-2 text-sm text-gray-400 overflow-hidden relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <motion.span
            className="absolute left-0 w-full h-full bg-gradient-to-r from-transparent via-[#d5b258]/40 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "linear",
            }}
          />
          <span className="relative z-10">Live The Future</span>
        </motion.div>
      </motion.div>
    </div>
  );
}

// "use client";
// import { motion } from "framer-motion";

// export default function Loader() {
//   return (
//     <motion.div
//       className="flex flex-col items-center justify-center space-y-4"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       transition={{ duration: 0.6 }}
//     >
//       <motion.div
//         className="w-12 h-12 border-4 border-t-[#d5b258] border-gray-300 rounded-full animate-spin"
//         transition={{ repeat: Infinity, ease: "linear" }}
//       ></motion.div>
//       <motion.h1
//         className="text-lg font-semibold tracking-[0.2em] text-[#8b7329]"
//         initial={{ opacity: 0, y: 8 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.3, duration: 0.5 }}
//       >
//         AIBRICKS REALTORS
//       </motion.h1>
//     </motion.div>
//   );
// }
