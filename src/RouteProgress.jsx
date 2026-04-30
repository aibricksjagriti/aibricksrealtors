"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function RouteProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    const handleClick = (event) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const anchor = event.target.closest("a[href]");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      const target = anchor.getAttribute("target");

      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("http") ||
        (target && target !== "_self")
      ) {
        return;
      }

      const current = `${window.location.pathname}${window.location.search}`;
      if (href === current) return;

      setIsNavigating(true);
    };

    window.addEventListener("click", handleClick, true);
    return () => window.removeEventListener("click", handleClick, true);
  }, []);

  useEffect(() => {
    setIsNavigating(false);
  }, [pathname, searchParams?.toString()]);

  if (!isNavigating) return null;

  return (
    <div className="fixed inset-x-0 top-0 h-1 bg-transparent" style={{ zIndex: 9999 }}>
      <div className="h-full w-full bg-ochre animate-route-progress" />
    </div>
  );
}
