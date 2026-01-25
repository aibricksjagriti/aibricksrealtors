"use client";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Search,
  User,
  Phone,
  Building2,
  Mail,
  Clock,
  X,
} from "lucide-react";
import { scheduleVisitAPI } from "@/src/admin/utils/api";
import "@/src/admin/styles/admin.css";

export default function ScheduleVisitsPage() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const hasFetched = useRef(false);

  useEffect(() => {
    // Prevent duplicate calls in React Strict Mode
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    try {
      setLoading(true);
      const response = await scheduleVisitAPI.getAll({ limit: 100 });
      
      // Backend returns: { success: true, count: number, limit: number, data: array }
      if (response && response.success && Array.isArray(response.data)) {
        setVisits(response.data);
      } else if (response && response.success && !response.data) {
        // Handle case where data might be empty
        setVisits([]);
      } else {
        console.error("Invalid response format:", response);
        setVisits([]);
      }
    } catch (error) {
      console.error("Error fetching visits:", error);
      setVisits([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredVisits = visits.filter(
    (visit) =>
      visit.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.phone?.includes(searchTerm) ||
      visit.propertyTitle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (date) => {
    if (!date) return "N/A";
    try {
      let dateObj = null;
      
      // Handle Firestore Timestamp object with toDate method (before JSON serialization)
      if (date && typeof date === 'object' && typeof date.toDate === 'function') {
        dateObj = date.toDate();
      }
      // Handle Firestore timestamp object with _seconds property (after JSON serialization)
      else if (date && typeof date === 'object' && date._seconds !== undefined) {
        dateObj = new Date(date._seconds * 1000);
        if (date._nanoseconds) {
          dateObj = new Date(date._seconds * 1000 + Math.floor(date._nanoseconds / 1000000));
        }
      }
      // Handle ISO string or other date formats
      else if (typeof date === 'string' || typeof date === 'number') {
        dateObj = new Date(date);
      }
      // Handle Date object
      else if (date instanceof Date) {
        dateObj = date;
      }
      
      // Validate the date object
      if (dateObj && !isNaN(dateObj.getTime())) {
        return dateObj.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true
        });
      }
      
      return "N/A";
    } catch (error) {
      console.error('Error formatting date:', date, error);
      return "N/A";
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "admin-badge-success";
      case "pending":
        return "admin-badge-warning";
      case "cancelled":
        return "admin-badge-error";
      default:
        return "admin-badge-info";
    }
  };

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Schedule Visits</h1>
        <p className="text-sm text-gray-500">View and manage all scheduled property visits</p>
      </div>

      {/* Search */}
      <div className="admin-card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, email, phone, or property..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="admin-input admin-input-with-icon"
          />
        </div>
      </div>

      {/* Visits List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading visits...</p>
        </div>
      ) : filteredVisits.length === 0 ? (
        <div className="admin-card p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">
            {searchTerm ? "No visits found" : "No scheduled visits yet"}
          </p>
        </div>
      ) : (
        <div className="admin-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Visitor</th>
                  <th>Property</th>
                  <th>Visit Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVisits.map((visit, index) => (
                  <motion.tr
                    key={visit.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <td>
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mr-3 text-white font-semibold text-sm">
                          {visit.name?.[0] || "V"}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-700">{visit.name}</div>
                          <div className="text-sm text-gray-500">{visit.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center text-gray-600">
                        <Building2 className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="truncate max-w-xs">
                          {visit.propertyTitle || visit.propertyId || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center text-gray-500 text-sm">
                        <Clock className="w-4 h-4 mr-2 text-gray-400" />
                        {formatDate(visit.preferredDate)}
                      </div>
                    </td>
                    <td>
                      <span className={`admin-badge ${getStatusColor(visit.status)}`}>
                        {visit.status || "Pending"}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => {
                          setSelectedVisit(visit);
                          setShowModal(true);
                        }}
                        className="text-purple-600 hover:text-purple-700 font-semibold text-sm"
                      >
                        View Details
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showModal && selectedVisit && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="admin-card max-w-2xl w-full"
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Visit Details</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Visitor Name</p>
                  <p className="font-semibold text-gray-700">{selectedVisit.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <p className="text-gray-700">{selectedVisit.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Phone</p>
                  <p className="text-gray-700">{selectedVisit.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Status</p>
                  <span className={`admin-badge ${getStatusColor(selectedVisit.status)}`}>
                    {selectedVisit.status || "Pending"}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Preferred Date</p>
                  <p className="text-gray-700">{formatDate(selectedVisit.preferredDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Preferred Time</p>
                  <p className="text-gray-700">{selectedVisit.preferredTime || "N/A"}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500 mb-1">Property</p>
                  <p className="text-gray-700 font-semibold">
                    {selectedVisit.propertyTitle || selectedVisit.propertyId || "N/A"}
                  </p>
                </div>
                {selectedVisit.message && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500 mb-1">Message</p>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-gray-700">{selectedVisit.message}</p>
                    </div>
                  </div>
                )}
                <div className="col-span-2">
                  <p className="text-sm text-gray-500 mb-1">Submitted On</p>
                  <p className="text-gray-700">{formatDate(selectedVisit.createdAt)}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
