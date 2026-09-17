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

import { useEffect, useRef } from "react";

export default function HeroVideo() {
  const videoRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.muted = true;
    videoRef.current.play().catch(() => {});
  }, []);

  return (
    <video
      ref={videoRef}
      className="absolute inset-0 h-full w-full object-cover object-center"
      muted
      autoPlay
      loop
      playsInline
      preload="metadata"
      poster="/home/hero-banner-home.png"
      disablePictureInPicture
      aria-hidden="true"
    >
      <source src="/home/home-hero-video-web.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}
