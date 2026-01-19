"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Edit,
  Trash2,
  MapPin,
  Building2,
  DollarSign,
  Home,
  Briefcase,
  User,
  Image as ImageIcon,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  Calendar,
  Eye,
} from "lucide-react";
import { propertiesAPI } from "@/src/admin/utils/api";
import Link from "next/link";
import "@/src/admin/styles/admin.css";

export default function PropertyViewPage() {
  const params = useParams();
  const router = useRouter();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProperty();
  }, [params.id]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const response = await propertiesAPI.getById(params.id);
      if (response.success && response.data) {
        setProperty(response.data);
      } else {
        setError("Property not found");
      }
    } catch (error) {
      console.error("Error fetching property:", error);
      setError(error.message || "Failed to load property");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this property? This action cannot be undone.")) return;

    try {
      await propertiesAPI.delete(params.id);
      router.push("/admin/properties");
    } catch (error) {
      alert("Error deleting property: " + error.message);
    }
  };

  const formatPrice = (price) => {
    if (!price) return "N/A";
    return `₹${Number(price).toLocaleString("en-IN")}`;
  };

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
        // Convert seconds to milliseconds
        dateObj = new Date(date._seconds * 1000);
        // Add nanoseconds if present (convert to milliseconds)
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
        return dateObj.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
      
      return "N/A";
    } catch (error) {
      console.error('Error formatting date:', date, error);
      return "N/A";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 font-semibold">Loading property...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="space-y-6">
        <Link href="/admin/properties" className="inline-flex items-center text-gray-600 hover:text-gray-800">
          <ArrowLeft size={18} className="mr-2" />
          Back to Properties
        </Link>
        <div className="admin-card p-12 text-center">
          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">{error || "Property not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/properties" className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-2">
            <ArrowLeft size={18} className="mr-2" />
            Back to Properties
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">{property.propertyTitle || property.title || "Property Details"}</h1>
          <p className="text-sm text-gray-500">View complete property information</p>
        </div>
        <div className="flex items-center space-x-2">
          <Link
            href={`/admin/properties/${params.id}/edit`}
            className="admin-btn-secondary flex items-center space-x-2"
          >
            <Edit size={18} />
            <span>Edit</span>
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors flex items-center space-x-2"
          >
            <Trash2 size={18} />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Main Image */}
      {property.mainPropertyImage && (
        <div className="admin-card p-0 overflow-hidden">
          <img
            src={property.mainPropertyImage}
            alt={property.propertyTitle || "Property"}
            className="w-full h-96 object-cover"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="admin-card p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Building2 className="mr-2 text-purple-600" size={24} />
              Basic Information
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Property Type</p>
                <p className="font-semibold text-gray-800">{property.propertyType || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Sub Type</p>
                <p className="font-semibold text-gray-800">{property.subType || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Listing Type</p>
                <p className="font-semibold text-gray-800">{property.listingType || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Property Status</p>
                <p className="font-semibold text-gray-800">{property.propertyStatus || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Furnishing</p>
                <p className="font-semibold text-gray-800">{property.furnishing || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Ownership Type</p>
                <p className="font-semibold text-gray-800">{property.ownershipType || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Built-up Area</p>
                <p className="font-semibold text-gray-800">{property.builtUpArea ? `${property.builtUpArea} sq ft` : "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Carpet Area</p>
                <p className="font-semibold text-gray-800">{property.carpetArea ? `${property.carpetArea} sq ft` : "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Floor Number</p>
                <p className="font-semibold text-gray-800">{property.floorNumber || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Floors</p>
                <p className="font-semibold text-gray-800">{property.totalFloors || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Facing Direction</p>
                <p className="font-semibold text-gray-800">{property.facingDirection || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Age of Property</p>
                <p className="font-semibold text-gray-800">{property.ageOfProperty ? `${property.ageOfProperty} years` : "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="admin-card p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <MapPin className="mr-2 text-purple-600" size={24} />
              Location
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Country</p>
                <p className="font-semibold text-gray-800">{property.country || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">State</p>
                <p className="font-semibold text-gray-800">{property.state || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">City</p>
                <p className="font-semibold text-gray-800">{property.city || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Locality</p>
                <p className="font-semibold text-gray-800">{property.locality || "N/A"}</p>
              </div>
              {property.subLocality && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Sub Locality</p>
                  <p className="font-semibold text-gray-800">{property.subLocality}</p>
                </div>
              )}
              {property.landmark && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Landmark</p>
                  <p className="font-semibold text-gray-800">{property.landmark}</p>
                </div>
              )}
              {property.pincode && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Pincode</p>
                  <p className="font-semibold text-gray-800">{property.pincode}</p>
                </div>
              )}
            </div>
            {(property.nearestMetroStation || property.nearestRailwayStation || property.nearestBusStop) && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Nearby Facilities</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  {property.nearestMetroStation && <p>Metro: {property.nearestMetroStation}</p>}
                  {property.nearestRailwayStation && <p>Railway: {property.nearestRailwayStation}</p>}
                  {property.nearestBusStop && <p>Bus Stop: {property.nearestBusStop}</p>}
                </div>
              </div>
            )}
          </div>

          {/* Pricing */}
          <div className="admin-card p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <DollarSign className="mr-2 text-purple-600" size={24} />
              Pricing & Financial Information
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Price</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {formatPrice(property.totalPrice)}
                </p>
              </div>
              {property.pricePerSquareFoot && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Price Per Square Foot</p>
                  <p className="font-semibold text-gray-800">{formatPrice(property.pricePerSquareFoot)}</p>
                </div>
              )}
              {property.monthlyRent && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Monthly Rent</p>
                  <p className="font-semibold text-gray-800">{formatPrice(property.monthlyRent)}</p>
                </div>
              )}
              {property.maintenanceCharges && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Maintenance Charges</p>
                  <p className="font-semibold text-gray-800">{formatPrice(property.maintenanceCharges)}</p>
                </div>
              )}
              {property.securityDeposit && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Security Deposit</p>
                  <p className="font-semibold text-gray-800">{formatPrice(property.securityDeposit)}</p>
                </div>
              )}
              {property.bookingAmount && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Booking Amount</p>
                  <p className="font-semibold text-gray-800">{formatPrice(property.bookingAmount)}</p>
                </div>
              )}
              {property.negotiable && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Negotiable</p>
                  <p className="font-semibold text-gray-800">{property.negotiable}</p>
                </div>
              )}
              {property.emiAvailable && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">EMI Available</p>
                  <p className="font-semibold text-gray-800">{property.emiAvailable}</p>
                </div>
              )}
            </div>
          </div>

          {/* Room Configuration */}
          <div className="admin-card p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Home className="mr-2 text-purple-600" size={24} />
              Room Configuration
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Bedrooms</p>
                <p className="font-semibold text-gray-800">{property.numberOfBedrooms || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Bathrooms</p>
                <p className="font-semibold text-gray-800">{property.numberOfBathrooms || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Balconies</p>
                <p className="font-semibold text-gray-800">{property.numberOfBalconies || "N/A"}</p>
              </div>
              {property.hall && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Hall</p>
                  <p className="font-semibold text-gray-800">{property.hall}</p>
                </div>
              )}
              {property.kitchen && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Kitchen</p>
                  <p className="font-semibold text-gray-800">{property.kitchen}</p>
                </div>
              )}
              {property.storeRoom && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Store Room</p>
                  <p className="font-semibold text-gray-800">{property.storeRoom}</p>
                </div>
              )}
              {property.studyRoom && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Study Room</p>
                  <p className="font-semibold text-gray-800">{property.studyRoom}</p>
                </div>
              )}
              {property.poojaRoom && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Pooja Room</p>
                  <p className="font-semibold text-gray-800">{property.poojaRoom}</p>
                </div>
              )}
            </div>
            {property.amenities && property.amenities.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((amenity, idx) => (
                    <span key={idx} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Building Information */}
          {(property.projectName || property.builderName) && (
            <div className="admin-card p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Briefcase className="mr-2 text-purple-600" size={24} />
                Building & Project Information
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {property.projectName && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Project Name</p>
                    <p className="font-semibold text-gray-800">{property.projectName}</p>
                  </div>
                )}
                {property.builderName && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Builder Name</p>
                    <p className="font-semibold text-gray-800">{property.builderName}</p>
                  </div>
                )}
                {property.reraRegistrationNumber && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">RERA Registration</p>
                    <p className="font-semibold text-gray-800">{property.reraRegistrationNumber}</p>
                  </div>
                )}
                {property.totalUnitsInProject && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Total Units</p>
                    <p className="font-semibold text-gray-800">{property.totalUnitsInProject}</p>
                  </div>
                )}
                {property.numberOfTowers && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Number of Towers</p>
                    <p className="font-semibold text-gray-800">{property.numberOfTowers}</p>
                  </div>
                )}
                {property.numberOfLifts && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Number of Lifts</p>
                    <p className="font-semibold text-gray-800">{property.numberOfLifts}</p>
                  </div>
                )}
                {property.powerBackup && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Power Backup</p>
                    <p className="font-semibold text-gray-800">{property.powerBackup}</p>
                  </div>
                )}
                {property.gatedCommunity && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Gated Community</p>
                    <p className="font-semibold text-gray-800">{property.gatedCommunity}</p>
                  </div>
                )}
                {property.fireSafetySystem && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Fire Safety System</p>
                    <p className="font-semibold text-gray-800">{property.fireSafetySystem}</p>
                  </div>
                )}
                {property.cctv && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">CCTV</p>
                    <p className="font-semibold text-gray-800">{property.cctv}</p>
                  </div>
                )}
                {property.security24x7 && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">24x7 Security</p>
                    <p className="font-semibold text-gray-800">{property.security24x7}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Media */}
          {(property.imageGallery?.length > 0 || property.floorPlanImages?.length > 0 || property.videoWalkthrough || property.virtualTour360) && (
            <div className="admin-card p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <ImageIcon className="mr-2 text-purple-600" size={24} />
                Media & Visual Content
              </h2>
              {property.imageGallery && property.imageGallery.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Image Gallery</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {property.imageGallery.map((url, idx) => (
                      <img key={idx} src={url} alt={`Property ${idx + 1}`} className="w-full h-48 object-cover rounded-lg" />
                    ))}
                  </div>
                </div>
              )}
              {property.floorPlanImages && property.floorPlanImages.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Floor Plans</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {property.floorPlanImages.map((url, idx) => (
                      <img key={idx} src={url} alt={`Floor Plan ${idx + 1}`} className="w-full h-48 object-cover rounded-lg" />
                    ))}
                  </div>
                </div>
              )}
              {property.videoWalkthrough && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Video Walkthrough</h3>
                  <a href={property.videoWalkthrough} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                    {property.videoWalkthrough}
                  </a>
                </div>
              )}
              {property.virtualTour360 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Virtual Tour 360</h3>
                  <a href={property.virtualTour360} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                    {property.virtualTour360}
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Seller Information */}
          {property.seller && (
            <div className="admin-card p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <User className="mr-2 text-purple-600" size={24} />
                Seller Information
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Seller Type</p>
                  <p className="font-semibold text-gray-800">{property.seller.sellerType || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Name</p>
                  <p className="font-semibold text-gray-800">{property.seller.sellerName || "N/A"}</p>
                </div>
                {property.seller.phoneNumber && (
                  <div className="flex items-center space-x-2">
                    <Phone size={16} className="text-gray-400" />
                    <a href={`tel:${property.seller.phoneNumber}`} className="text-purple-600 hover:underline">
                      {property.seller.phoneNumber}
                    </a>
                  </div>
                )}
                {property.seller.email && (
                  <div className="flex items-center space-x-2">
                    <Mail size={16} className="text-gray-400" />
                    <a href={`mailto:${property.seller.email}`} className="text-purple-600 hover:underline">
                      {property.seller.email}
                    </a>
                  </div>
                )}
                {property.seller.companyName && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Company</p>
                    <p className="font-semibold text-gray-800">{property.seller.companyName}</p>
                  </div>
                )}
                {property.seller.verifiedBadge && (
                  <div className="flex items-center space-x-2">
                    {property.seller.verifiedBadge === "Yes" ? (
                      <CheckCircle className="text-green-500" size={20} />
                    ) : (
                      <XCircle className="text-gray-400" size={20} />
                    )}
                    <span className="text-sm text-gray-600">
                      {property.seller.verifiedBadge === "Yes" ? "Verified" : "Not Verified"}
                    </span>
                  </div>
                )}
                {property.seller.rating && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Rating</p>
                    <p className="font-semibold text-gray-800">{property.seller.rating}/5</p>
                  </div>
                )}
                {property.seller.responseRate && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Response Rate</p>
                    <p className="font-semibold text-gray-800">{property.seller.responseRate}%</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Status & Metadata */}
          <div className="admin-card p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Calendar className="mr-2 text-purple-600" size={24} />
              Status & Metadata
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Active Status</span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${property.activeStatus === "Yes" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {property.activeStatus || "No"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Featured</span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${property.featuredListing === "Yes" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-700"}`}>
                  {property.featuredListing || "No"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Premium</span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${property.premiumListing === "Yes" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-700"}`}>
                  {property.premiumListing || "No"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Sold</span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${property.soldStatus === "Yes" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"}`}>
                  {property.soldStatus || "No"}
                </span>
              </div>
              {property.totalViews && (
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <span className="text-sm text-gray-500 flex items-center">
                    <Eye size={16} className="mr-1" />
                    Views
                  </span>
                  <span className="font-semibold text-gray-800">{property.totalViews}</span>
                </div>
              )}
              {property.totalInquiries && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Inquiries</span>
                  <span className="font-semibold text-gray-800">{property.totalInquiries}</span>
                </div>
              )}
              {property.shortlistedCount && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Shortlisted</span>
                  <span className="font-semibold text-gray-800">{property.shortlistedCount}</span>
                </div>
              )}
              {property.createdAt && (
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-1">Created</p>
                  <p className="font-semibold text-gray-800">{formatDate(property.createdAt)}</p>
                </div>
              )}
              {property.updatedAt && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Last Updated</p>
                  <p className="font-semibold text-gray-800">{formatDate(property.updatedAt)}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

