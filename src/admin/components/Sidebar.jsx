"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Mail,
  Calendar,
  Heart,
  Menu,
  X,
  LogOut,
  Sparkles,
  Phone,
} from "lucide-react";
import { authAPI } from "../utils/api";
import "../styles/admin.css";

const menuItems = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Properties",
    href: "/admin/properties",
    icon: Building2,
  },
  {
    name: "Contact",
    href: "/admin/contact",
    icon: Mail,
  },
  {
    name: "Schedule Visits",
    href: "/admin/schedule-visits",
    icon: Calendar,
  },
  {
    name: "Interested",
    href: "/admin/interested",
    icon: Heart,
  },
  {
    name: "Call Requests",
    href: "/admin/call-requests",
    icon: Phone,
  },
];

export default function Sidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  const handleLogout = () => {
    authAPI.logout();
    window.location.href = "/admin/login";
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-3 rounded-xl bg-purple-600 text-white shadow-lg hover:shadow-xl transition-all"
        >
          {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-[260px] admin-sidebar
          transform transition-transform duration-300 ease-in-out z-40
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo Area */}
          <div className="px-5 py-4 border-b border-gray-200 h-16 flex items-center">
            <Link href="/admin" className="flex items-center space-x-2.5 group">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-purple-600" style={{ fontFamily: "'Inter', sans-serif" }}>
                AI BRICKS
              </span>
            </Link>
          </div>

          {/* User Profile Section */}
          <div className="px-5 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                  A
                </div>
                <div className="online-indicator"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">Admin User</p>
                <p className="text-xs text-gray-500 truncate">Administrator</p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto admin-scrollbar">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`
                    admin-sidebar-item flex items-center space-x-3 px-3 py-2.5
                    ${isActive ? "active" : "default"}
                  `}
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="px-4 py-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full admin-sidebar-item default flex items-center space-x-3 px-3 py-2.5"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}
