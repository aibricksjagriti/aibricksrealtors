"use client";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Mail, Search, User, Phone, Calendar, X } from "lucide-react";
import { contactAPI } from "@/src/admin/utils/api";
import "@/src/admin/styles/admin.css";

export default function ContactPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const hasFetched = useRef(false);

  useEffect(() => {
    // Prevent duplicate calls in React Strict Mode
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await contactAPI.getAll({ limit: 100 });
      
      // Backend returns: { success: true, count: number, limit: number, data: array }
      if (response && response.success && Array.isArray(response.data)) {
        setContacts(response.data);
      } else if (response && response.success && !response.data) {
        // Handle case where data might be empty
        setContacts([]);
      } else {
        console.error("Invalid response format:", response);
        setContacts([]);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone?.includes(searchTerm)
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

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Contact Submissions</h1>
        <p className="text-sm text-gray-500">View and manage all contact form submissions</p>
      </div>

      {/* Search */}
      <div className="admin-card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="admin-input admin-input-with-icon"
          />
        </div>
      </div>

      {/* Contacts List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading contacts...</p>
        </div>
      ) : filteredContacts.length === 0 ? (
        <div className="admin-card p-12 text-center">
          <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">
            {searchTerm ? "No contacts found" : "No contact submissions yet"}
          </p>
        </div>
      ) : (
        <div className="admin-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.map((contact, index) => (
                  <motion.tr
                    key={contact.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <td>
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3 text-white font-semibold text-sm">
                          {contact.firstName?.[0] || "U"}
                        </div>
                        <div className="font-medium text-gray-700">
                          {contact.firstName} {contact.lastName}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center text-gray-600">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        {contact.email}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center text-gray-600">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        {contact.phone}
                      </div>
                    </td>
                    <td className="text-gray-500 text-sm">{formatDate(contact.createdAt)}</td>
                    <td>
                      <button
                        onClick={() => {
                          setSelectedContact(contact);
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
      {showModal && selectedContact && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="admin-card max-w-2xl w-full"
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Contact Details</h2>
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
                  <p className="text-sm text-gray-500 mb-1">First Name</p>
                  <p className="font-semibold text-gray-700">{selectedContact.firstName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Last Name</p>
                  <p className="font-semibold text-gray-700">{selectedContact.lastName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <p className="text-gray-700">{selectedContact.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Phone</p>
                  <p className="text-gray-700">{selectedContact.phone}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500 mb-1">Submitted On</p>
                  <p className="text-gray-700">{formatDate(selectedContact.createdAt)}</p>
                </div>
                {selectedContact.message && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500 mb-1">Message</p>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-gray-700">{selectedContact.message}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
