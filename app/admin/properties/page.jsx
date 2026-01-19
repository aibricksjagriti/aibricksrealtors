"use client";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Plus,
  Edit,
  Trash2,
  Search,
  Eye,
} from "lucide-react";
import { propertiesAPI } from "@/src/admin/utils/api";
import Link from "next/link";
import "@/src/admin/styles/admin.css";

export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const hasFetched = useRef(false);

  useEffect(() => {
    // Prevent duplicate calls in React Strict Mode
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await propertiesAPI.getAll({ limit: 100 });
      
      // Backend returns: { success: true, count: number, data: array }
      if (response && response.success && Array.isArray(response.data)) {
        setProperties(response.data);
      } else if (response && response.success && !response.data) {
        // Handle case where data might be empty
        setProperties([]);
      } else {
        console.error("Invalid response format:", response);
        setProperties([]);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this property?")) return;

    try {
      await propertiesAPI.delete(id);
      fetchProperties();
    } catch (error) {
      alert("Error deleting property: " + error.message);
    }
  };

  const filteredProperties = properties.filter((property) => {
    const title = property.title || property.propertyTitle || '';
    const city = property.location?.city || property.city || '';
    return (
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Properties</h1>
          <p className="text-sm text-gray-500">Manage all properties in the system</p>
        </div>
        <Link
          href="/admin/properties/new"
          className="admin-btn-primary inline-flex items-center space-x-2"
        >
          <Plus size={18} />
          <span>Add Property</span>
        </Link>
      </div>

      {/* Search */}
      <div className="admin-card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10 pointer-events-none" />
          <input
            type="text"
            placeholder="Search properties by title or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="admin-input admin-input-with-icon"
          />
        </div>
      </div>

      {/* Properties List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading properties...</p>
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="admin-card p-12 text-center">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">
            {searchTerm ? "No properties found" : "No properties yet"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="admin-card overflow-hidden"
            >
              {/* Property Image */}
              <div className="h-48 bg-gradient-to-br from-purple-100 to-pink-100 relative">
                {property.imageGallery?.[0] ? (
                  <img
                    src={property.imageGallery[0]}
                    alt={property.title || property.propertyTitle || "Property"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Building2 className="w-16 h-16 text-gray-300" />
                  </div>
                )}
                {property.isTrending && (
                  <span className="absolute top-3 right-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                    Trending
                  </span>
                )}
              </div>

              {/* Property Info */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-800 mb-1 truncate">
                  {property.title || property.propertyTitle || "Untitled Property"}
                </h3>
                <p className="text-sm text-gray-500 mb-3">
                  {property.location?.city || property.city || ""}, {property.location?.state || property.state || ""}
                </p>
                <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                  ₹{(property.price || property.totalPrice || property.monthlyRent || 0).toLocaleString("en-IN")}
                </p>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <Link
                    href={`/admin/properties/${property.id}`}
                    className="flex-1 flex items-center justify-center space-x-1 bg-purple-50 text-purple-600 px-3 py-2 rounded-lg hover:bg-purple-100 transition-colors font-medium text-sm"
                  >
                    <Eye size={16} />
                    <span>View</span>
                  </Link>
                  <Link
                    href={`/admin/properties/${property.id}/edit`}
                    className="flex-1 flex items-center justify-center space-x-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm"
                  >
                    <Edit size={16} />
                    <span>Edit</span>
                  </Link>
                  <button
                    onClick={() => handleDelete(property.id)}
                    className="flex items-center justify-center bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

    </div>
  );
}
