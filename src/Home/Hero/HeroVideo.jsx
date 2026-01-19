"use client";

import { useEffect, useRef, useState } from "react";

const VIDEOS = [
  "/home/hero-bg.mp4",
  "/home/hero-bg-2.mp4",
  "/home/hero-bg-3.mp4",
];

export default function HeroVideo() {
  const videoRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  // Delay for LCP
  useEffect(() => {
    const t = setTimeout(() => {
      setShowVideo(true);
    }, 1500);

    return () => clearTimeout(t);
  }, []);

  // Play video safely
  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;

    video.load(); // REQUIRED
    video.play().catch(() => {});
  }, [index]);

  if (!showVideo) return null;

  return (
    <video
      ref={videoRef}
      className="absolute inset-0 w-full h-full object-cover"
      muted
      playsInline
      autoPlay
      preload="metadata"
      onEnded={() => setIndex((i) => (i + 1) % VIDEOS.length)}
    >
      <source src={VIDEOS[index]} type="video/mp4" />
    </video>
  );
}
