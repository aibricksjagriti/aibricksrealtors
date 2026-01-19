"use client";

import { useRef } from "react";
import Navbar from "./Home/Navbar";
import ContactModal from "./Modal/ContactModal";
import Footer from "./Footer";
import ClientLayout from "./ClientLayout";
import AuthModalController from "./Auth/AuthModalController";

export default function ClientLayoutWrapper({ children }) {
  const authModalRef = useRef(null);

  return (
    <ClientLayout>
      {/* Pass real handler to Navbar */}
      <Navbar onLoginClick={() => authModalRef.current?.openLogin()} />
      {/*  Modal controller */}
      <AuthModalController ref={authModalRef} />
      {children}
      <ContactModal />
      <Footer />
    </ClientLayout>
  );
}
