"use client";

import Navbar from "./Home/Navbar";
import Footer from "./Footer";
import ClientLayout from "./ClientLayout";
import ContactModal from "./Modal/ContactModal";

export default function ClientLayoutWrapper({ children }) {
  return (
    <ClientLayout>
      <Navbar />
      <ContactModal />
      {children}
      <Footer />
    </ClientLayout>
  );
}
