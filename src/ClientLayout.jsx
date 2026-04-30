"use client";

import { Suspense } from "react";
import RouteProgress from "./RouteProgress";

export default function ClientLayout({ children }) {
  return (
    <>
      <Suspense fallback={null}>
        <RouteProgress />
      </Suspense>
      {children}
    </>
  );
}

// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Loader from "./Loader";

// export default function ClientLayout({ children }) {
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     // Simulate router events manually since next/navigation doesn’t expose them directly
//     const handleStart = () => setLoading(true);
//     const handleStop = () => {
//       setTimeout(() => setLoading(false), 700); // Smooth fade delay
//     };

//     // Intercept navigation (client transitions)
//     const originalPush = router.push;
//     const originalReplace = router.replace;

//     router.push = (...args) => {
//       handleStart();
//       return originalPush(...args).finally(handleStop);
//     };
//     router.replace = (...args) => {
//       handleStart();
//       return originalReplace(...args).finally(handleStop);
//     };

//     return () => {
//       router.push = originalPush;
//       router.replace = originalReplace;
//     };
//   }, [router]);

//   return (
//     <>
//       {loading && (
//         <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white dark:bg-black">
//           <Loader />
//         </div>
//       )}
//       <div
//         className={`transition-opacity duration-500 ${
//           loading ? "opacity-0" : "opacity-100"
//         }`}
//       >
//         {children}
//       </div>
//     </>
//   );
// }
