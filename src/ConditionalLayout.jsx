// "use client";
// import { useRef } from "react";
// import { usePathname } from "next/navigation";
// import Navbar from "@/src/Home/Navbar";
// import Footer from "@/src/Footer";
// import ClientLayout from "@/src/ClientLayout";
// import AuthModalController from "@/src/Auth/AuthModalController";

// export default function ConditionalLayout({ children }) {
//   const pathname = usePathname();
//   const isAdminRoute = pathname?.startsWith("/admin");
//   const authModalRef = useRef(null);

//   // Don't render website Navbar/Footer for admin routes
//   if (isAdminRoute) {
//     return <>{children}</>;
//   }

//   // Render normal website layout with Navbar and Footer
//   return (
//     <ClientLayout>
//       <Navbar onLoginClick={() => authModalRef.current?.openLogin()} />
//       <AuthModalController ref={authModalRef} />
//       {children}
//       <Footer />
//     </ClientLayout>
//   );
// }

"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/src/Home/Navbar";
import Footer from "@/src/Footer";
import ClientLayout from "@/src/ClientLayout";
import ContactModal from "@/src/Modal/ContactModal";
import StickySectionNav from "./Developers/StickySectionNav";
import PropertySectionNav from "./Properties/PropertySectionNav";

export default function ConditionalLayout({ children, navBuilders = [], navLocations = [] }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  const isDeveloperPage =
    pathname === "/developers" || pathname?.startsWith("/developers/");
  const isPropertyPage = pathname?.startsWith("/properties/");
  const isSubdomainPage = pathname?.startsWith("/sub/");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <ClientLayout>
      {!isSubdomainPage && (
        isPropertyPage ? (
          <PropertySectionNav />
        ) : isDeveloperPage ? (
          <StickySectionNav />
        ) : (
          <Navbar initialBuilders={navBuilders} initialLocations={navLocations} />
        )
      )}

      <ContactModal />

      {children}

      <Footer />
    </ClientLayout>
  );
}
