"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/src/Home/Navbar";
import Footer from "@/src/Footer";
import QueryProvider from "@/src/providers/QueryProvider";
import DeferredContactModal from "./DeferredContactModal";
import StickySectionNav from "./Developers/StickySectionNav";
import PropertySectionNav from "./Properties/PropertySectionNav";

export default function ConditionalLayout({ children, navBuilders = [], navLocations = [] }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  const isDeveloperPage =
    pathname === "/developers" || pathname?.startsWith("/developers/");
  const isPropertyPage = pathname?.startsWith("/properties/");
  const isSearchPage = pathname === "/search";
  const isSubdomainPage = pathname?.startsWith("/sub/");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  const content = (
    <div className="flex flex-col min-h-screen">
      {!isSubdomainPage && (
        isPropertyPage ? (
          <PropertySectionNav />
        ) : isDeveloperPage ? (
          <StickySectionNav />
        ) : (
          <Navbar initialBuilders={navBuilders} initialLocations={navLocations} />
        )
      )}

      <DeferredContactModal />

      <main className="flex-1">
        {children}
      </main>

      <Footer />
    </div>
  );

  return isPropertyPage || isSearchPage ? (
    <QueryProvider>{content}</QueryProvider>
  ) : content;
}
