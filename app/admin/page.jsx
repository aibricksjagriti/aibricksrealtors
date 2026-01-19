"use client";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Mail,
  Calendar,
  Heart,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
} from "lucide-react";
import {
  propertiesAPI,
  contactAPI,
  scheduleVisitAPI,
  interestedAPI,
} from "@/src/admin/utils/api";
import "@/src/admin/styles/admin.css";

const StatCard = ({ title, value, change, changeType, icon: Icon, gradient, delay = 0 }) => {
  const isPositive = changeType === "increase";
  const changeColor = isPositive ? "text-green-300" : "text-red-300";
  const ChangeIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`admin-stat-card ${gradient} relative`}
    >
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <p className="text-white/80 text-sm font-medium">{title}</p>
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>
        <h3 className="text-3xl font-bold text-white mb-2">{value}</h3>
        <div className="flex items-center space-x-2">
          {change && (
            <>
              <ChangeIcon className="w-4 h-4 text-green-300" />
              <p className={`text-sm font-semibold ${changeColor}`}>
                {change}
              </p>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    properties: 0,
    contacts: 0,
    visits: 0,
    interested: 0,
    loading: true,
  });
  const hasFetched = useRef(false);

  useEffect(() => {
    // Prevent duplicate calls in React Strict Mode
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchStats = async () => {
      try {
        const [propertiesRes, contactsRes, visitsRes, interestedRes] =
          await Promise.all([
            propertiesAPI.getAll({ limit: 1 }),
            contactAPI.getAll({ limit: 1 }),
            scheduleVisitAPI.getAll({ limit: 1 }),
            interestedAPI.getAll({ limit: 1 }),
          ]);

        setStats({
          properties: propertiesRes.count || 0,
          contacts: contactsRes.count || 0,
          visits: visitsRes.count || 0,
          interested: interestedRes.count || 0,
          loading: false,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
        setStats((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500">Overview of your admin panel</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <BarChart3 className="w-4 h-4" />
          <span>Overview</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Properties"
          value={stats.loading ? "..." : stats.properties.toLocaleString()}
          change="Increased by 12%"
          changeType="increase"
          icon={Building2}
          gradient="admin-stat-card-pink"
          delay={0.1}
        />
        <StatCard
          title="Contact Submissions"
          value={stats.loading ? "..." : stats.contacts.toLocaleString()}
          change="Increased by 8%"
          changeType="increase"
          icon={Mail}
          gradient="admin-stat-card-blue"
          delay={0.2}
        />
        <StatCard
          title="Scheduled Visits"
          value={stats.loading ? "..." : stats.visits.toLocaleString()}
          change="Increased by 5%"
          changeType="increase"
          icon={Calendar}
          gradient="admin-stat-card-teal"
          delay={0.3}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visit And Sales Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="admin-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Visit And Sales Statistics</h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span className="text-xs text-gray-600">Properties</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                <span className="text-xs text-gray-600">Visits</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                <span className="text-xs text-gray-600">Contacts</span>
              </div>
            </div>
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Chart visualization</p>
            </div>
          </div>
        </motion.div>

        {/* Traffic Sources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="admin-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Traffic Sources</h2>
            <SettingsIcon className="w-5 h-5 text-gray-400" />
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl relative">
            <div className="text-center">
              <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Pie chart visualization</p>
            </div>
            <div className="absolute bottom-4 left-4 right-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                  <span className="text-gray-600">Direct</span>
                </div>
                <span className="font-semibold text-gray-900">40%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                  <span className="text-gray-600">Search</span>
                </div>
                <span className="font-semibold text-gray-900">30%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-teal-400"></div>
                  <span className="text-gray-600">Referral</span>
                </div>
                <span className="font-semibold text-gray-900">30%</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function SettingsIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}
