"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Wraps an image so it fades and slides up into view the first time it
 * scrolls into the viewport. Animates once (doesn't replay on scroll back
 * up/down) and is skipped entirely for users with prefers-reduced-motion.
 */
export default function AnimatedImage({
  src,
  alt,
  wrapperClassName = "",
  imgClassName = "",
  delayMs = 0,
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(node);
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -60px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delayMs}ms` }}
      className={`transition-all duration-700 ease-out will-change-transform ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } ${wrapperClassName}`}
    >
      <img src={src} alt={alt} className={imgClassName} />
    </div>
  );
}
