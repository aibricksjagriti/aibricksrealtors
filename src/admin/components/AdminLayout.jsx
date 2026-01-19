"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import { authAPI } from "../utils/api";
import "../styles/admin.css";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const authChecked = useRef(false);

  useEffect(() => {
    // Prevent multiple auth checks
    if (authChecked.current) {
      setIsLoading(false);
      return;
    }
    
    const checkAuth = async () => {
      // Check if token exists before making API call
      const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
      if (!token) {
        authChecked.current = true;
        setIsLoading(false);
        router.replace("/admin/login");
        return;
      }

      try {
        authChecked.current = true;
        const response = await authAPI.getCurrentUser();
        if (response.success && response.data) {
          // Check if user is admin
          if (response.data.role !== "admin") {
            router.replace("/admin/login");
            return;
          }
          setUser(response.data);
        } else {
          router.replace("/admin/login");
        }
      } catch (error) {
        router.replace("/admin/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#F7F5FA" }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 font-semibold">Loading Admin Panel...</p>
        </div>
      </div>
    );
  }

  // Don't render if redirecting to login
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen admin-container">
      <Sidebar />
      <div className="lg:ml-[260px] min-h-screen flex flex-col">
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
