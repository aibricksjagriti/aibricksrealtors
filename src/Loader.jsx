"use client";
import { motion } from "framer-motion";

export default function Loader() {
  return (
    <div className="fixed inset-0 z-[9999] bg-[var(--color-lightcream)]/95 backdrop-blur-sm">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4">
        <motion.div
          className="w-full max-w-3xl rounded-[2rem] border border-white/70 bg-white/70 p-6 shadow-2xl"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-gray-200 animate-pulse" />
            <div className="space-y-2 flex-1">
              <div className="h-4 w-40 rounded-full bg-gray-200 animate-pulse" />
              <div className="h-3 w-64 rounded-full bg-gray-200 animate-pulse" />
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="space-y-3 rounded-2xl bg-white p-4 shadow-sm">
                <div className="h-44 rounded-2xl bg-gray-200 animate-pulse" />
                <div className="h-4 w-4/5 rounded-full bg-gray-200 animate-pulse" />
                <div className="h-3 w-2/3 rounded-full bg-gray-200 animate-pulse" />
              </div>
            ))}
          </div>

          <div className="mt-8 h-3 overflow-hidden rounded-full bg-gray-200">
            <motion.div
              className="h-full w-1/3 rounded-full bg-[var(--color-ochre)]"
              animate={{ x: ["-120%", "320%"] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}
            />
          </div>
        </motion.div>
      </div>
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
