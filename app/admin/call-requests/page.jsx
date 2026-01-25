"use client";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Phone,
  Search,
  Building2,
  Clock,
  CheckCircle,
  MoreVertical,
} from "lucide-react";
import { callRequestsAPI } from "@/src/admin/utils/api";
import "@/src/admin/styles/admin.css";

export default function CallRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await callRequestsAPI.getAll({ limit: 100 });
      
      if (data.success && Array.isArray(data.data)) {
        setRequests(data.data);
      } else {
        setRequests([]);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = requests.filter(
    (req) =>
      req.phoneNumber?.includes(searchTerm) ||
      req.propertyTitle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (date) => {
    if (!date) return "N/A";
    const d = new Date(date);
    return isNaN(d.getTime()) ? "N/A" : d.toLocaleString();
  };

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Call Requests</h1>
        <p className="text-sm text-gray-500">Manage "Call Me Instantly" requests</p>
      </div>

      {/* Search */}
      <div className="admin-card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by phone or property..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="admin-input admin-input-with-icon"
          />
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-brickred border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading requests...</p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="admin-card p-12 text-center">
          <Phone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">No call requests found</p>
        </div>
      ) : (
        <div className="admin-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Phone Number</th>
                  <th>Property</th>
                  <th>Requested On</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((req, index) => (
                  <motion.tr
                    key={req.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <td>
                      <div className="flex items-center font-medium text-gray-800">
                        <Phone className="w-4 h-4 mr-2 text-brickred" />
                        {req.phoneNumber}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center text-gray-600">
                        <Building2 className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="truncate max-w-xs">
                          {req.propertyTitle || "General Inquiry"}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center text-gray-500 text-sm">
                        <Clock className="w-4 h-4 mr-2 text-gray-400" />
                        {formatDate(req.createdAt)}
                      </div>
                    </td>
                    <td>
                      <span className={`admin-badge ${req.status === 'called' ? 'admin-badge-success' : 'admin-badge-warning'}`}>
                        {req.status || "Pending"}
                      </span>
                    </td>
                    <td>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
