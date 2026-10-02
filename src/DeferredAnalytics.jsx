"use client";

import { useEffect } from "react";

export default function DeferredAnalytics() {
  useEffect(() => {
    const loadAnalytics = () => {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });

      window.gtag = function gtag() {
        window.dataLayer.push(arguments);
      };
      window.gtag("js", new Date());
      window.gtag("config", "G-R36MTXRGKK");

      const gtm = document.createElement("script");
      gtm.async = true;
      gtm.src = "https://www.googletagmanager.com/gtm.js?id=GTM-MN6PS8NQ";
      document.head.appendChild(gtm);

      const ga = document.createElement("script");
      ga.async = true;
      ga.src = "https://www.googletagmanager.com/gtag/js?id=G-R36MTXRGKK";
      document.head.appendChild(ga);
    };

    const timerId = window.setTimeout(loadAnalytics, 10000);
    return () => window.clearTimeout(timerId);
  }, []);

  return null;
}