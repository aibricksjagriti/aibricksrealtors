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

  useEffect(() => {
    const isSmallScreen = window.matchMedia("(max-width: 767px)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isSmallScreen || prefersReducedMotion || navigator.connection?.saveData) return;

    const timer = window.setTimeout(() => setShowVideo(true), 2500);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!showVideo || !videoRef.current) return;
    videoRef.current.play().catch(() => {});
  }, [showVideo]);

  if (!showVideo) return null;

  return (
    <video
      ref={videoRef}
      className="absolute inset-0 hidden h-full w-full object-cover object-center md:block"
      muted
      autoPlay
      loop
      playsInline
      preload="none"
      poster="/home/hero-banner-home.webp"
      disablePictureInPicture
      aria-hidden="true"
    >
      <source src="/home/home-hero-video-lite.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}
