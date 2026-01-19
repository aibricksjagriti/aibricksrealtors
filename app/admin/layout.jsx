"use client";
import { usePathname } from "next/navigation";
import AdminLayout from "@/src/admin/components/AdminLayout";

export default function Layout({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  // Don't wrap login page with AdminLayout
  if (isLoginPage) {
    return <>{children}</>;
  }

  return <AdminLayout>{children}</AdminLayout>;
}

