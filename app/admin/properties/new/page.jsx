"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Building2, MapPin, DollarSign, Home, Briefcase, User, Image as ImageIcon } from "lucide-react";
import { propertiesAPI } from "@/src/admin/utils/api";
import Link from "next/link";
import "@/src/admin/styles/admin.css";

const PROPERTY_TYPES = ["Apartment", "Villa", "Townhouse", "Penthouse", "Mansion", "Plot", "Commercial", "Office", "Shop", "Warehouse", "Industrial"];
const SUB_TYPES = ["1 BHK", "2 BHK", "3 BHK", "4 BHK", "5+ BHK", "Studio", "Duplex", "Penthouse", "Independent House"];
const LISTING_TYPES = ["Sale", "Rent", "PG", "Lease"];
const PROPERTY_STATUSES = ["Ready to Move", "Under Construction", "Resale"];
const FURNISHING_TYPES = ["Furnished", "Semi-Furnished", "Unfurnished"];
const FACING_DIRECTIONS = ["East", "West", "North", "South", "North-East", "North-West", "South-East", "South-West"];
const OWNERSHIP_TYPES = ["Freehold", "Leasehold"];
const SELLER_TYPES = ["Owner", "Agent", "Builder"];
const YES_NO = ["Yes", "No"];

const STEPS = [
  { id: 1, title: "Basic Info", icon: Building2 },
  { id: 2, title: "Location", icon: MapPin },
  { id: 3, title: "Pricing", icon: DollarSign },
  { id: 4, title: "Details", icon: Home },
  { id: 5, title: "Building Info", icon: Briefcase },
  { id: 6, title: "Seller Info", icon: User },
  { id: 7, title: "Media", icon: ImageIcon },
];

export default function NewPropertyPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    propertyTitle: "",
    propertyType: "Apartment",
    subType: "",
    listingType: "Sale",
    propertyStatus: "Ready to Move",
    furnishing: "",
    ageOfProperty: "",
    builtUpArea: "",
    carpetArea: "",
    floorNumber: "",
    totalFloors: "",
    facingDirection: "",
    ownershipType: "",
    
    // Step 2: Location
    country: "India",
    state: "",
    city: "",
    locality: "",
    subLocality: "",
    streetName: "",
    landmark: "",
    pincode: "",
    latitude: "",
    longitude: "",
    nearestMetroStation: "",
    nearestRailwayStation: "",
    nearestBusStop: "",
    
    // Step 3: Pricing
    totalPrice: "",
    pricePerSquareFoot: "",
    monthlyRent: "",
    maintenanceCharges: "",
    securityDeposit: "",
    bookingAmount: "",
    negotiable: "",
    emiAvailable: "",
    stampDuty: "",
    registrationCharges: "",
    
    // Step 4: Details
    numberOfBedrooms: "",
    numberOfBathrooms: "",
    numberOfBalconies: "",
    hall: "",
    kitchen: "",
    storeRoom: "",
    studyRoom: "",
    poojaRoom: "",
    amenities: [],
    
    // Step 5: Building Info
    projectName: "",
    builderName: "",
    reraRegistrationNumber: "",
    totalUnitsInProject: "",
    numberOfTowers: "",
    numberOfLifts: "",
    powerBackup: "",
    waterSupplyType: "",
    gatedCommunity: "",
    fireSafetySystem: "",
    cctv: "",
    security24x7: "",
    
    // Step 6: Seller Info
    sellerType: "Agent",
    sellerName: "",
    phoneNumber: "",
    email: "",
    companyName: "",
    verifiedBadge: "No",
    responseRate: "",
    totalListings: "",
    rating: "",
    
    // Step 7: Media
    mainPropertyImage: "",
    imageGallery: [],
    floorPlanImages: [],
    videoWalkthrough: "",
    virtualTour360: "",
    propertyBrochure: "",
    
    // Additional
    listingDate: "",
    featuredListing: "No",
    premiumListing: "No",
    soldStatus: "No",
    activeStatus: "Yes",
  });

  const [amenityInput, setAmenityInput] = useState("");
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [floorPlanUrlInput, setFloorPlanUrlInput] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes("Area") || name.includes("numberOf") || name.includes("Price") || name.includes("Charges") || name.includes("Deposit") || name.includes("Amount") || name.includes("Duty") || name.includes("Rate") || name.includes("rating") || name.includes("ageOf") || name.includes("floor") || name.includes("Floors") || name.includes("Units") || name.includes("Towers") || name.includes("Lifts") || name.includes("latitude") || name.includes("longitude") || name.includes("pricePerSquareFoot")
        ? value === "" ? "" : (isNaN(value) ? prev[name] : Number(value))
        : value,
    }));
  };

  const addAmenity = () => {
    if (amenityInput.trim() && !formData.amenities.includes(amenityInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        amenities: [...prev.amenities, amenityInput.trim()],
      }));
      setAmenityInput("");
    }
  };

  const removeAmenity = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((a) => a !== amenity),
    }));
  };

  const addImageUrl = () => {
    if (imageUrlInput.trim() && !formData.imageGallery.includes(imageUrlInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        imageGallery: [...prev.imageGallery, imageUrlInput.trim()],
      }));
      setImageUrlInput("");
    }
  };

  const removeImageUrl = (url) => {
    setFormData((prev) => ({
      ...prev,
      imageGallery: prev.imageGallery.filter((u) => u !== url),
    }));
  };

  const addFloorPlanUrl = () => {
    if (floorPlanUrlInput.trim() && !formData.floorPlanImages.includes(floorPlanUrlInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        floorPlanImages: [...prev.floorPlanImages, floorPlanUrlInput.trim()],
      }));
      setFloorPlanUrlInput("");
    }
  };

  const removeFloorPlanUrl = (url) => {
    setFormData((prev) => ({
      ...prev,
      floorPlanImages: prev.floorPlanImages.filter((u) => u !== url),
    }));
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!formData.propertyTitle || formData.propertyTitle.length < 3) {
          setError("Property title is required (minimum 3 characters)");
          return false;
        }
        if (!formData.propertyType) {
          setError("Property type is required");
          return false;
        }
        break;
      case 2:
        // Location is optional but validate if provided
        break;
      case 3:
        // Pricing is optional
        break;
      default:
        break;
    }
    setError("");
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;

    setError("");
    setLoading(true);

    try {
      // Clean up form data - remove empty strings and convert to proper types
      const submitData = {};
      
      Object.keys(formData).forEach((key) => {
        const value = formData[key];
        if (value !== "" && value !== null && value !== undefined) {
          if (Array.isArray(value)) {
            if (value.length > 0) submitData[key] = value;
          } else {
            submitData[key] = value;
          }
        }
      });

      const response = await propertiesAPI.create(submitData);
      
      if (response.success) {
        router.push(`/admin/properties/${response.data.id}`);
      } else {
        setError(response.error || response.message || "Failed to create property");
      }
    } catch (error) {
      console.error("Error creating property:", error);
      setError(error.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Property Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="propertyTitle"
                value={formData.propertyTitle}
                onChange={handleChange}
                required
                className="admin-input w-full"
                placeholder="e.g., Luxury 3 BHK Apartment in Andheri"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Property Type <span className="text-red-500">*</span>
                </label>
                <select name="propertyType" value={formData.propertyType} onChange={handleChange} className="admin-input w-full" required>
                  {PROPERTY_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Sub Type</label>
                <select name="subType" value={formData.subType} onChange={handleChange} className="admin-input w-full">
                  <option value="">Select Sub Type</option>
                  {SUB_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Listing Type</label>
                <select name="listingType" value={formData.listingType} onChange={handleChange} className="admin-input w-full">
                  {LISTING_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Property Status</label>
                <select name="propertyStatus" value={formData.propertyStatus} onChange={handleChange} className="admin-input w-full">
                  {PROPERTY_STATUSES.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Furnishing</label>
                <select name="furnishing" value={formData.furnishing} onChange={handleChange} className="admin-input w-full">
                  <option value="">Select Furnishing</option>
                  {FURNISHING_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Age of Property (years)</label>
                <input type="number" name="ageOfProperty" value={formData.ageOfProperty} onChange={handleChange} className="admin-input w-full" min="0" max="100" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Built-up Area (sq ft)</label>
                <input type="number" name="builtUpArea" value={formData.builtUpArea} onChange={handleChange} className="admin-input w-full" min="0" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Carpet Area (sq ft)</label>
                <input type="number" name="carpetArea" value={formData.carpetArea} onChange={handleChange} className="admin-input w-full" min="0" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Floor Number</label>
                <input type="number" name="floorNumber" value={formData.floorNumber} onChange={handleChange} className="admin-input w-full" min="0" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Total Floors</label>
                <input type="number" name="totalFloors" value={formData.totalFloors} onChange={handleChange} className="admin-input w-full" min="1" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Facing Direction</label>
                <select name="facingDirection" value={formData.facingDirection} onChange={handleChange} className="admin-input w-full">
                  <option value="">Select Direction</option>
                  {FACING_DIRECTIONS.map((dir) => (
                    <option key={dir} value={dir}>{dir}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Ownership Type</label>
                <select name="ownershipType" value={formData.ownershipType} onChange={handleChange} className="admin-input w-full">
                  <option value="">Select Ownership</option>
                  {OWNERSHIP_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
                <input type="text" name="country" value={formData.country} onChange={handleChange} className="admin-input w-full" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                <input type="text" name="state" value={formData.state} onChange={handleChange} className="admin-input w-full" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} className="admin-input w-full" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Locality</label>
                <input type="text" name="locality" value={formData.locality} onChange={handleChange} className="admin-input w-full" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Sub Locality</label>
                <input type="text" name="subLocality" value={formData.subLocality} onChange={handleChange} className="admin-input w-full" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Street Name</label>
                <input type="text" name="streetName" value={formData.streetName} onChange={handleChange} className="admin-input w-full" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Landmark</label>
                <input type="text" name="landmark" value={formData.landmark} onChange={handleChange} className="admin-input w-full" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Pincode</label>
                <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} className="admin-input w-full" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Latitude</label>
                <input type="number" name="latitude" value={formData.latitude} onChange={handleChange} className="admin-input w-full" step="any" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Longitude</label>
                <input type="number" name="longitude" value={formData.longitude} onChange={handleChange} className="admin-input w-full" step="any" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nearest Metro Station</label>
                <input type="text" name="nearestMetroStation" value={formData.nearestMetroStation} onChange={handleChange} className="admin-input w-full" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nearest Railway Station</label>
                <input type="text" name="nearestRailwayStation" value={formData.nearestRailwayStation} onChange={handleChange} className="admin-input w-full" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nearest Bus Stop</label>
                <input type="text" name="nearestBusStop" value={formData.nearestBusStop} onChange={handleChange} className="admin-input w-full" />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Total Price (₹)</label>
                <input type="number" name="totalPrice" value={formData.totalPrice} onChange={handleChange} className="admin-input w-full" min="0" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Price Per Square Foot (₹)</label>
                <input type="number" name="pricePerSquareFoot" value={formData.pricePerSquareFoot} onChange={handleChange} className="admin-input w-full" min="0" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Monthly Rent (₹)</label>
                <input type="number" name="monthlyRent" value={formData.monthlyRent} onChange={handleChange} className="admin-input w-full" min="0" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Maintenance Charges (₹)</label>
                <input type="number" name="maintenanceCharges" value={formData.maintenanceCharges} onChange={handleChange} className="admin-input w-full" min="0" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Security Deposit (₹)</label>
                <input type="number" name="securityDeposit" value={formData.securityDeposit} onChange={handleChange} className="admin-input w-full" min="0" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Booking Amount (₹)</label>
                <input type="number" name="bookingAmount" value={formData.bookingAmount} onChange={handleChange} className="admin-input w-full" min="0" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Negotiable</label>
                <select name="negotiable" value={formData.negotiable} onChange={handleChange} className="admin-input w-full">
                  <option value="">Select</option>
                  {YES_NO.map((val) => (
                    <option key={val} value={val}>{val}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">EMI Available</label>
                <select name="emiAvailable" value={formData.emiAvailable} onChange={handleChange} className="admin-input w-full">
                  <option value="">Select</option>
                  {YES_NO.map((val) => (
                    <option key={val} value={val}>{val}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Stamp Duty (₹)</label>
                <input type="number" name="stampDuty" value={formData.stampDuty} onChange={handleChange} className="admin-input w-full" min="0" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Registration Charges (₹)</label>
                <input type="number" name="registrationCharges" value={formData.registrationCharges} onChange={handleChange} className="admin-input w-full" min="0" />
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Number of Bedrooms</label>
                <input type="number" name="numberOfBedrooms" value={formData.numberOfBedrooms} onChange={handleChange} className="admin-input w-full" min="0" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Number of Bathrooms</label>
                <input type="number" name="numberOfBathrooms" value={formData.numberOfBathrooms} onChange={handleChange} className="admin-input w-full" min="0" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Number of Balconies</label>
                <input type="number" name="numberOfBalconies" value={formData.numberOfBalconies} onChange={handleChange} className="admin-input w-full" min="0" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Hall</label>
                <select name="hall" value={formData.hall} onChange={handleChange} className="admin-input w-full">
                  <option value="">Select</option>
                  {YES_NO.map((val) => (
                    <option key={val} value={val}>{val}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Kitchen</label>
                <select name="kitchen" value={formData.kitchen} onChange={handleChange} className="admin-input w-full">
                  <option value="">Select</option>
                  {YES_NO.map((val) => (
                    <option key={val} value={val}>{val}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Store Room</label>
                <select name="storeRoom" value={formData.storeRoom} onChange={handleChange} className="admin-input w-full">
                  <option value="">Select</option>
                  {YES_NO.map((val) => (
                    <option key={val} value={val}>{val}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Study Room</label>
                <select name="studyRoom" value={formData.studyRoom} onChange={handleChange} className="admin-input w-full">
                  <option value="">Select</option>
                  {YES_NO.map((val) => (
                    <option key={val} value={val}>{val}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Pooja Room</label>
                <select name="poojaRoom" value={formData.poojaRoom} onChange={handleChange} className="admin-input w-full">
                  <option value="">Select</option>
                  {YES_NO.map((val) => (
                    <option key={val} value={val}>{val}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Amenities</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={amenityInput}
                  onChange={(e) => setAmenityInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addAmenity())}
                  className="admin-input flex-1"
                  placeholder="Add amenity (e.g., Swimming Pool, Gym)"
                />
                <button type="button" onClick={addAmenity} className="admin-btn-primary px-4">
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.amenities.map((amenity, idx) => (
                  <span key={idx} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    {amenity}
                    <button type="button" onClick={() => removeAmenity(amenity)} className="hover:text-red-600">×</button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Project Name</label>
                <input type="text" name="projectName" value={formData.projectName} onChange={handleChange} className="admin-input w-full" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Builder Name</label>
                <input type="text" name="builderName" value={formData.builderName} onChange={handleChange} className="admin-input w-full" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">RERA Registration Number</label>
                <input type="text" name="reraRegistrationNumber" value={formData.reraRegistrationNumber} onChange={handleChange} className="admin-input w-full" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Total Units in Project</label>
                <input type="number" name="totalUnitsInProject" value={formData.totalUnitsInProject} onChange={handleChange} className="admin-input w-full" min="1" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Number of Towers</label>
                <input type="number" name="numberOfTowers" value={formData.numberOfTowers} onChange={handleChange} className="admin-input w-full" min="1" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Number of Lifts</label>
                <input type="number" name="numberOfLifts" value={formData.numberOfLifts} onChange={handleChange} className="admin-input w-full" min="0" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Power Backup</label>
                <select name="powerBackup" value={formData.powerBackup} onChange={handleChange} className="admin-input w-full">
                  <option value="">Select</option>
                  {YES_NO.map((val) => (
                    <option key={val} value={val}>{val}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Water Supply Type</label>
                <input type="text" name="waterSupplyType" value={formData.waterSupplyType} onChange={handleChange} className="admin-input w-full" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Gated Community</label>
                <select name="gatedCommunity" value={formData.gatedCommunity} onChange={handleChange} className="admin-input w-full">
                  <option value="">Select</option>
                  {YES_NO.map((val) => (
                    <option key={val} value={val}>{val}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Fire Safety System</label>
                <select name="fireSafetySystem" value={formData.fireSafetySystem} onChange={handleChange} className="admin-input w-full">
                  <option value="">Select</option>
                  {YES_NO.map((val) => (
                    <option key={val} value={val}>{val}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">CCTV</label>
                <select name="cctv" value={formData.cctv} onChange={handleChange} className="admin-input w-full">
                  <option value="">Select</option>
                  {YES_NO.map((val) => (
                    <option key={val} value={val}>{val}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">24x7 Security</label>
                <select name="security24x7" value={formData.security24x7} onChange={handleChange} className="admin-input w-full">
                  <option value="">Select</option>
                  {YES_NO.map((val) => (
                    <option key={val} value={val}>{val}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Seller Type</label>
                <select name="sellerType" value={formData.sellerType} onChange={handleChange} className="admin-input w-full">
                  {SELLER_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Seller Name</label>
                <input type="text" name="sellerName" value={formData.sellerName} onChange={handleChange} className="admin-input w-full" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="admin-input w-full" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="admin-input w-full" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name</label>
                <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="admin-input w-full" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Verified Badge</label>
                <select name="verifiedBadge" value={formData.verifiedBadge} onChange={handleChange} className="admin-input w-full">
                  {YES_NO.map((val) => (
                    <option key={val} value={val}>{val}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Response Rate (%)</label>
                <input type="number" name="responseRate" value={formData.responseRate} onChange={handleChange} className="admin-input w-full" min="0" max="100" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Total Listings</label>
                <input type="number" name="totalListings" value={formData.totalListings} onChange={handleChange} className="admin-input w-full" min="0" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Rating (0-5)</label>
                <input type="number" name="rating" value={formData.rating} onChange={handleChange} className="admin-input w-full" min="0" max="5" step="0.1" />
              </div>
            </div>
          </div>
        );
      case 7:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Main Property Image URL</label>
              <input type="url" name="mainPropertyImage" value={formData.mainPropertyImage} onChange={handleChange} className="admin-input w-full" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Image Gallery URLs</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="url"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addImageUrl())}
                  className="admin-input flex-1"
                  placeholder="Add image URL"
                />
                <button type="button" onClick={addImageUrl} className="admin-btn-primary px-4">
                  Add
                </button>
              </div>
              <div className="space-y-2">
                {formData.imageGallery.map((url, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                    <span className="flex-1 text-sm truncate">{url}</span>
                    <button type="button" onClick={() => removeImageUrl(url)} className="text-red-600 hover:text-red-700">Remove</button>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Floor Plan Image URLs</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="url"
                  value={floorPlanUrlInput}
                  onChange={(e) => setFloorPlanUrlInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFloorPlanUrl())}
                  className="admin-input flex-1"
                  placeholder="Add floor plan URL"
                />
                <button type="button" onClick={addFloorPlanUrl} className="admin-btn-primary px-4">
                  Add
                </button>
              </div>
              <div className="space-y-2">
                {formData.floorPlanImages.map((url, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                    <span className="flex-1 text-sm truncate">{url}</span>
                    <button type="button" onClick={() => removeFloorPlanUrl(url)} className="text-red-600 hover:text-red-700">Remove</button>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Video Walkthrough URL</label>
              <input type="url" name="videoWalkthrough" value={formData.videoWalkthrough} onChange={handleChange} className="admin-input w-full" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Virtual Tour 360 URL</label>
              <input type="url" name="virtualTour360" value={formData.virtualTour360} onChange={handleChange} className="admin-input w-full" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Property Brochure URL</label>
              <input type="url" name="propertyBrochure" value={formData.propertyBrochure} onChange={handleChange} className="admin-input w-full" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Listing Date</label>
                <input type="date" name="listingDate" value={formData.listingDate} onChange={handleChange} className="admin-input w-full" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Featured Listing</label>
                <select name="featuredListing" value={formData.featuredListing} onChange={handleChange} className="admin-input w-full">
                  {YES_NO.map((val) => (
                    <option key={val} value={val}>{val}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Premium Listing</label>
                <select name="premiumListing" value={formData.premiumListing} onChange={handleChange} className="admin-input w-full">
                  {YES_NO.map((val) => (
                    <option key={val} value={val}>{val}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Active Status</label>
                <select name="activeStatus" value={formData.activeStatus} onChange={handleChange} className="admin-input w-full">
                  {YES_NO.map((val) => (
                    <option key={val} value={val}>{val}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/properties" className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-2">
            <ArrowLeft size={18} className="mr-2" />
            Back to Properties
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Add New Property</h1>
          <p className="text-sm text-gray-500">Fill in the property details step by step</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="admin-card p-6">
        <div className="flex items-center justify-between mb-6">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            return (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      isActive
                        ? "bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg scale-110"
                        : isCompleted
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {isCompleted ? <Check size={20} /> : <Icon size={20} />}
                  </div>
                  <span className={`text-xs mt-2 font-medium ${isActive ? "text-purple-600" : "text-gray-500"}`}>
                    {step.title}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 ${isCompleted ? "bg-green-500" : "bg-gray-200"}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="admin-card p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-bold text-gray-800 mb-4">{STEPS[currentStep - 1].title}</h2>
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>

          {error && (
            <div className="mt-4 bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded text-sm">
              {error}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="admin-btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <ArrowLeft size={18} />
              <span>Previous</span>
            </button>
            <div className="text-sm text-gray-500">
              Step {currentStep} of {STEPS.length}
            </div>
            {currentStep < STEPS.length ? (
              <button
                type="button"
                onClick={nextStep}
                className="admin-btn-primary flex items-center space-x-2"
              >
                <span>Next</span>
                <ArrowRight size={18} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="admin-btn-primary flex items-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Check size={18} />
                    <span>Create Property</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
