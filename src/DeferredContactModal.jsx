"use client";

import { useEffect, useState } from "react";

export default function DeferredContactModal() {
  const [ContactModal, setContactModal] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const load = () => {
      import("./Modal/ContactModal").then(({ default: Component }) => {
        if (!cancelled) setContactModal(() => Component);
      });
    };

    if (typeof window.requestIdleCallback === "function") {
      const idleId = window.requestIdleCallback(load, { timeout: 2500 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback(idleId);
      };
    }

    const timerId = window.setTimeout(load, 1500);
    return () => {
      cancelled = true;
      window.clearTimeout(timerId);
    };
  }, []);

  return ContactModal ? <ContactModal /> : null;
}