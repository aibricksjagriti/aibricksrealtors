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
      <source src="/home/home-hero-video.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}
