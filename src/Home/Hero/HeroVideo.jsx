// "use client";

// import { useEffect, useRef, useState } from "react";

// const VIDEOS = [
//   "/home/hero-bg-2.mp4",
//   "/home/hero-bg-3.mp4",
//   "/home/hero-bg.mp4",
// ];

// export default function HeroVideo() {
//   const videoRef = useRef(null);
//   const [index, setIndex] = useState(0);
//   const [showVideo, setShowVideo] = useState(false);

//   // Delay for LCP
//   useEffect(() => {
//     const t = setTimeout(() => {
//       const prefersReducedMotion = window.matchMedia(
//         "(prefers-reduced-motion: reduce)",
//       ).matches;
//       const isSmallScreen = window.matchMedia("(max-width: 767px)").matches;
//       const saveData = navigator.connection?.saveData;

//       if (prefersReducedMotion || isSmallScreen || saveData) return;

//       setShowVideo(true);
//     }, 1500);

//     return () => clearTimeout(t);
//   }, []);

//   // Play video safely
//   useEffect(() => {
//     if (!videoRef.current) return;

//     const video = videoRef.current;

//     video.play().catch(() => {});
//   }, [index]);

//   if (!showVideo) return null;

//   return (
//     <video
//       ref={videoRef}
//       className="absolute inset-0 w-full h-full object-cover"
//       muted
//       playsInline
//       autoPlay
//       preload="metadata"
//       onEnded={() => setIndex((i) => (i + 1) % VIDEOS.length)}
//     >
//       <source src={VIDEOS[index]} type="video/mp4" />
//     </video>
//   );
// }

"use client";

import { useEffect, useRef, useState } from "react";

export default function HeroVideo() {
  const videoRef = useRef(null);
  const [showVideo, setShowVideo] = useState(false);

  // Delay loading video for better LCP
  useEffect(() => {
    const t = setTimeout(() => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const isSmallScreen = window.matchMedia("(max-width: 767px)").matches;

      const saveData =
        navigator.connection?.saveData ||
        navigator.mozConnection?.saveData ||
        navigator.webkitConnection?.saveData;

      if (prefersReducedMotion || isSmallScreen || saveData) return;

      setShowVideo(true);
    }, 1500);

    return () => clearTimeout(t);
  }, []);

  // Play video when it becomes visible
  useEffect(() => {
    if (!showVideo || !videoRef.current) return;

    videoRef.current.play().catch(() => {});
  }, [showVideo]);

  if (!showVideo) return null;

  return (
    <video
      ref={videoRef}
      className="absolute inset-0 w-full h-full object-cover mt-20"
      muted
      autoPlay
      loop
      playsInline
      preload="metadata"
    >
      <source src="/home/home-hero-video.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}
