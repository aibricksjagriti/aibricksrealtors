"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Building2, MapPin, IndianRupee, Home, Briefcase, User, Image as ImageIcon, Plus } from "lucide-react";
import { propertiesAPI, developersAPI, localitiesAPI, locationPagesAPI } from "@/src/admin/utils/api";
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
  { id: 3, title: "Pricing", icon: IndianRupee },
  { id: 4, title: "Details", icon: Home },
  { id: 5, title: "Building Info", icon: Briefcase },
  { id: 6, title: "Seller Info", icon: User },
  { id: 7, title: "Media", icon: ImageIcon },
];

export default function NewPropertyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    developersAPI.getAll().then((res) => setDevelopers(res.data || [])).catch(() => {});

    Promise.all([
      locationPagesAPI.getAll().catch(() => ({ data: [] })),
      localitiesAPI.getAll().catch(() => ({ data: [] })),
    ]).then(([cityRes, locRes]) => {
      const cities = (cityRes.data || [])
        .filter((p) => p.city)
        .map((p) => p.city.trim())
        .sort();
      setAllCities(cities);

      const map = {};
      (locRes.data || []).forEach((l) => {
        if (!l.city || !l.name) return;
        const city = l.city.trim();
        if (!map[city]) map[city] = new Set();
        map[city].add(l.name.trim());
      });
      const finalMap = {};
      Object.keys(map).forEach((c) => { finalMap[c] = [...map[c]].sort(); });
      setLocalityMap(finalMap);
      setCitiesLoading(false);
    });
  }, []);

  // Pre-fill from URL params
  useEffect(() => {
    const devParam = searchParams.get("developer");
    const cityParam = searchParams.get("city");
    const localityParam = searchParams.get("locality");
    if (devParam || cityParam || localityParam) {
      setFormData((prev) => ({
        ...prev,
        ...(devParam ? { builderName: devParam } : {}),
        ...(cityParam ? { city: cityParam } : {}),
        ...(localityParam ? { locality: localityParam } : {}),
      }));
      // Always start from step 1 — pre-filled values are visible as user progresses
    }
  }, [searchParams]);

  // Suppress browser extension errors (common with React DevTools, etc.)
  useEffect(() => {
    const handleError = (event) => {
      // Suppress known browser extension errors
      if (event.message && event.message.includes("message channel closed")) {
        event.preventDefault();
        return false;
      }
      if (event.error && event.error.message && event.error.message.includes("message channel closed")) {
        event.preventDefault();
        return false;
      }
    };

    const handleUnhandledRejection = (event) => {
      // Suppress known browser extension promise rejection errors
      if (event.reason && event.reason.message && event.reason.message.includes("message channel closed")) {
        event.preventDefault();
        return false;
      }
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, []);
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
    floorPlans: [],
    floorPlanImages: [],
    videoWalkthrough: "",
    virtualTour360: "",
    brochures: [{ name: "", url: "" }],
    
    // Additional
    listingDate: "",
    featuredListing: "No",
    premiumListing: "No",
    soldStatus: "No",
    activeStatus: "Yes",
  });

  const [developers, setDevelopers] = useState([]);
  const [allCities, setAllCities] = useState([]);
  const [citiesLoading, setCitiesLoading] = useState(true);
  const [localityMap, setLocalityMap] = useState({});
  const [amenityInput, setAmenityInput] = useState("");
  const [uploading, setUploading] = useState({});
  const [showFloorPlanModal, setShowFloorPlanModal] = useState(false);
  const [floorPlanDraft, setFloorPlanDraft] = useState({
    name: "",
    image: "",
    carpetArea: "",
    price: "",
  });
  const imageGalleryInputRef = useRef(null);

  const handleFileUpload = async (file, fieldName, isArray = false) => {
    if (!file) return;
    
    setUploading(prev => ({ ...prev, [fieldName]: true }));
    const formData = new FormData();
    formData.append("file", file);
    formData.append("path", "properties");

    try {
      // Use absolute URL to prevent any navigation issues
      const uploadUrl = typeof window !== 'undefined' 
        ? `${window.location.origin}/api/upload`
        : '/api/upload';
      
      const res = await fetch(uploadUrl, { 
        method: "POST", 
        body: formData,
        // Prevent any redirects or navigation
        redirect: 'manual',
        credentials: 'same-origin'
      });
      
      // Handle redirects manually
      if (res.type === 'opaqueredirect' || res.status === 0) {
        throw new Error("Upload request was redirected. Please check authentication.");
      }
      
      if (!res.ok) {
        // Try to get error message from response
        let errorMessage = `Upload failed with status: ${res.status}`;
        try {
          const errorData = await res.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (e) {
          // If response is not JSON, use status text
          errorMessage = res.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }
      
      const data = await res.json();
      
      if (data.success) {
        if (isArray) {
           setFormData(prev => ({
             ...prev,
             [fieldName]: [...prev[fieldName], data.url]
           }));
        } else {
           setFormData(prev => ({
             ...prev,
             [fieldName]: data.url
           }));
        }
      } else {
        alert("Upload failed: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Upload error:", error);
      // Only show alert, don't cause any navigation
      alert("Upload error: " + (error.message || "Failed to upload file"));
    } finally {
      setUploading(prev => ({ ...prev, [fieldName]: false }));
    }
  };

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

  const removeImageUrl = (url) => {
    setFormData((prev) => ({
      ...prev,
      imageGallery: prev.imageGallery.filter((u) => u !== url),
    }));
  };

  const handleImageGalleryFiles = async (files) => {
    if (!files || files.length === 0) return;
    for (const file of files) {
      // Keep existing upload behavior and append one-by-one
      // eslint-disable-next-line no-await-in-loop
      await handleFileUpload(file, "imageGallery", true);
    }
  };

  const resetFloorPlanDraft = () => {
    setFloorPlanDraft({
      name: "",
      image: "",
      carpetArea: "",
      price: "",
    });
  };

  const uploadFloorPlanImage = async (file) => {
    if (!file) return;
    setUploading((prev) => ({ ...prev, floorPlanDraftImage: true }));
    const fileFormData = new FormData();
    fileFormData.append("file", file);
    fileFormData.append("path", "properties/floor-plans");
    try {
      const uploadUrl = typeof window !== "undefined" ? `${window.location.origin}/api/upload` : "/api/upload";
      const res = await fetch(uploadUrl, {
        method: "POST",
        body: fileFormData,
        redirect: "manual",
        credentials: "same-origin",
      });
      if (!res.ok) {
        throw new Error(`Upload failed with status: ${res.status}`);
      }
      const data = await res.json();
      if (data.success && data.url) {
        setFloorPlanDraft((prev) => ({ ...prev, image: data.url }));
      } else {
        alert("Upload failed: " + (data.error || "Unknown error"));
      }
    } catch (uploadError) {
      alert("Upload error: " + (uploadError.message || "Failed to upload image"));
    } finally {
      setUploading((prev) => ({ ...prev, floorPlanDraftImage: false }));
    }
  };

  const addFloorPlan = () => {
    if (!floorPlanDraft.name || !floorPlanDraft.image || !floorPlanDraft.carpetArea || !floorPlanDraft.price) {
      alert("Please fill name, image, carpet area and price for floor plan");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      floorPlans: [
        ...prev.floorPlans,
        {
          name: floorPlanDraft.name.trim(),
          image: floorPlanDraft.image,
          carpetArea: Number(floorPlanDraft.carpetArea),
          price: Number(floorPlanDraft.price),
        },
      ],
      floorPlanImages: [...prev.floorPlanImages, floorPlanDraft.image],
    }));
    resetFloorPlanDraft();
    setShowFloorPlanModal(false);
  };

  const removeFloorPlan = (index) => {
    setFormData((prev) => {
      const floorPlans = prev.floorPlans.filter((_, idx) => idx !== index);
      return {
        ...prev,
        floorPlans,
        floorPlanImages: floorPlans.map((plan) => plan.image).filter(Boolean),
      };
    });
  };

  const handleBrochureUpload = async (file, index) => {
    if (!file) return;
    
    // Validate PDF file
    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file');
      return;
    }
    
    setUploading(prev => ({ ...prev, [`brochure-${index}`]: true }));
    const formData = new FormData();
    formData.append("file", file);
    formData.append("path", "properties/brochures");

    try {
      const uploadUrl = typeof window !== 'undefined' 
        ? `${window.location.origin}/api/upload`
        : '/api/upload';
      
      const res = await fetch(uploadUrl, { 
        method: "POST", 
        body: formData,
        redirect: 'manual',
        credentials: 'same-origin'
      });
      
      if (res.type === 'opaqueredirect' || res.status === 0) {
        throw new Error("Upload request was redirected. Please check authentication.");
      }
      
      if (!res.ok) {
        let errorMessage = `Upload failed with status: ${res.status}`;
        try {
          const errorData = await res.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (e) {
          errorMessage = res.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }
      
      const data = await res.json();
      
      if (data.success) {
        setFormData(prev => ({
          ...prev,
          brochures: prev.brochures.map((brochure, idx) => 
            idx === index ? { ...brochure, url: data.url } : brochure
          )
        }));
      } else {
        alert("Upload failed: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload error: " + (error.message || "Failed to upload file"));
    } finally {
      setUploading(prev => ({ ...prev, [`brochure-${index}`]: false }));
    }
  };

  const addBrochure = () => {
    setFormData(prev => ({
      ...prev,
      brochures: [...prev.brochures, { name: "", url: "" }]
    }));
  };

  const removeBrochure = (index) => {
    setFormData(prev => ({
      ...prev,
      brochures: prev.brochures.filter((_, idx) => idx !== index)
    }));
  };

  const handleBrochureNameChange = (index, name) => {
    setFormData(prev => ({
      ...prev,
      brochures: prev.brochures.map((brochure, idx) => 
        idx === index ? { ...brochure, name } : brochure
      )
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
        if (!formData.city || !formData.city.trim()) {
          setError("City is required before continuing");
          return false;
        }
        break;
      case 3:
        // Pricing is optional
        break;
      case 4:
      case 5:
      case 6:
      case 7:
        // All other steps including media are optional
        break;
      default:
        break;
    }
    setError("");
    return true;
  };

  const nextStep = (e) => {
    // Prevent any default behavior
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Prevent navigation if already submitting
    if (isSubmitting || loading) {
      console.warn("Navigation prevented - form is submitting");
      return;
    }
    
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => {
        const nextStep = Math.min(prev + 1, STEPS.length);
        // Clear any errors when moving to next step
        setError("");
        console.log("Navigating to step:", nextStep);
        return nextStep;
      });
    } else {
      console.warn("Navigation prevented - validation failed for step:", currentStep);
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Prevent double submission
    if (isSubmitting || loading) {
      return;
    }
    
    // Only allow submission on the last step
    if (currentStep !== STEPS.length) {
      console.warn("Form submission attempted on step", currentStep, "but should only submit on step", STEPS.length);
      return;
    }
    
    if (!validateStep(currentStep)) return;

    setError("");
    setIsSubmitting(true);
    setLoading(true);

    try {
      // Clean up form data - remove empty strings and convert to proper types
      const submitData = {};
      
      Object.keys(formData).forEach((key) => {
        const value = formData[key];
        if (value !== "" && value !== null && value !== undefined) {
          if (Array.isArray(value)) {
            if (key === 'brochures') {
              // Filter out empty brochures (those without both name and url)
              const validBrochures = value.filter(b => b.name || b.url);
              if (validBrochures.length > 0) submitData[key] = validBrochures;
            } else if (value.length > 0) {
              submitData[key] = value;
            }
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
      setIsSubmitting(false);
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  City <span className="text-red-500">*</span>
                </label>
                {citiesLoading ? (
                  <select disabled className="admin-input w-full opacity-50 cursor-not-allowed">
                    <option>— Loading cities… —</option>
                  </select>
                ) : (
                  <select
                    name="city"
                    value={formData.city}
                    onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value, locality: "" }))}
                    className="admin-input w-full"
                  >
                    <option value="">— Select City —</option>
                    {allCities.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Locality</label>
                {!formData.city ? (
                  <select disabled className="admin-input w-full opacity-50 cursor-not-allowed">
                    <option>— Select a city first —</option>
                  </select>
                ) : (localityMap[formData.city] || []).length > 0 ? (
                  <select
                    name="locality"
                    value={formData.locality}
                    onChange={handleChange}
                    className="admin-input w-full"
                  >
                    <option value="">— Select Locality —</option>
                    {(localityMap[formData.city] || []).map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                ) : (
                  <select disabled className="admin-input w-full opacity-50 cursor-not-allowed">
                    <option>— No localities for {formData.city} — add in Localities admin —</option>
                  </select>
                )}
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
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addAmenity())}
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">Builder / Developer</label>
                <select name="builderName" value={formData.builderName} onChange={handleChange} className="admin-input w-full">
                  <option value="">Select Developer</option>
                  {developers.map((d) => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
                {formData.builderName && !developers.find((d) => d.name === formData.builderName) && (
                  <p className="text-xs text-amber-600 mt-1">Current value: "{formData.builderName}" — not in developers list</p>
                )}
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
              <label className="block text-sm font-semibold text-gray-700 mb-2">Main Property Image</label>
              <div className="flex flex-col gap-2">
                {formData.mainPropertyImage && (
                  <img src={formData.mainPropertyImage} alt="Main" className="h-40 w-auto object-cover rounded border" />
                )}
                <div className="flex items-center gap-2">
                    <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => {
                            e.stopPropagation();
                            if(e.target.files && e.target.files[0]) {
                                handleFileUpload(e.target.files[0], "mainPropertyImage");
                            }
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                        onMouseDown={(e) => {
                            e.stopPropagation();
                        }}
                        className="admin-input w-full"
                    />
                    {uploading["mainPropertyImage"] && <span className="text-blue-600 animate-pulse">Uploading...</span>}
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Image Gallery</label>
              <input
                ref={imageGalleryInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  e.stopPropagation();
                  if (e.target.files?.length) {
                    handleImageGalleryFiles(Array.from(e.target.files));
                    e.target.value = null;
                  }
                }}
              />
              <button
                type="button"
                onClick={() => imageGalleryInputRef.current?.click()}
                className="w-28 h-28 border-2 border-dashed border-purple-300 rounded-lg flex flex-col items-center justify-center text-purple-600 hover:bg-purple-50 transition-colors"
              >
                <Plus size={26} />
                <span className="text-xs mt-1">Add Images</span>
              </button>
              {uploading["imageGallery"] && <span className="text-blue-600 animate-pulse text-sm">Uploading...</span>}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                {formData.imageGallery.map((url, idx) => (
                  <div key={idx} className="relative group">
                    <img src={url} alt={`Gallery ${idx}`} className="h-24 w-full object-cover rounded border" />
                    <button type="button" onClick={() => removeImageUrl(url)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Floor Plans</label>
              <button
                type="button"
                onClick={() => setShowFloorPlanModal(true)}
                className="w-28 h-28 border-2 border-dashed border-purple-300 rounded-lg flex flex-col items-center justify-center text-purple-600 hover:bg-purple-50 transition-colors"
              >
                <Plus size={26} />
                <span className="text-xs mt-1">Add Plan</span>
              </button>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {formData.floorPlans.map((plan, idx) => (
                  <div key={`${plan.image}-${idx}`} className="border rounded-lg p-3 bg-white">
                    <img src={plan.image} alt={plan.name || `Floor Plan ${idx + 1}`} className="h-28 w-full object-cover rounded border mb-2" />
                    <p className="text-sm font-semibold text-gray-800">{plan.name}</p>
                    <p className="text-xs text-gray-600">Carpet: {plan.carpetArea} sq ft</p>
                    <p className="text-xs text-gray-600">Price: {plan.price}</p>
                    <button type="button" onClick={() => removeFloorPlan(idx)} className="mt-2 text-xs text-red-600 hover:text-red-700">
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Video Walkthrough URL</label>
              <input 
                type="url" 
                name="videoWalkthrough" 
                value={formData.videoWalkthrough} 
                onChange={handleChange} 
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                }}
                className="admin-input w-full" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Virtual Tour 360 URL</label>
              <input 
                type="url" 
                name="virtualTour360" 
                value={formData.virtualTour360} 
                onChange={handleChange} 
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                }}
                className="admin-input w-full" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Property Brochures</label>
              <div className="space-y-4">
                {formData.brochures.map((brochure, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-700">Brochure {index + 1}</h4>
                      {formData.brochures.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeBrochure(index)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Brochure Name</label>
                      <input
                        type="text"
                        value={brochure.name}
                        onChange={(e) => handleBrochureNameChange(index, e.target.value)}
                        placeholder="e.g., Main Brochure, Floor Plans, Amenities Guide"
                        className="admin-input w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Upload PDF</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={(e) => {
                            e.stopPropagation();
                            if (e.target.files && e.target.files[0]) {
                              handleBrochureUpload(e.target.files[0], index);
                              e.target.value = null;
                            }
                          }}
                          onClick={(e) => e.stopPropagation()}
                          onMouseDown={(e) => e.stopPropagation()}
                          className="admin-input flex-1"
                        />
                        {uploading[`brochure-${index}`] && (
                          <span className="text-blue-600 animate-pulse text-sm">Uploading...</span>
                        )}
                      </div>
                      {brochure.url && (
                        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                          <p className="text-sm text-green-700">
                            ✓ PDF uploaded: <a href={brochure.url} target="_blank" rel="noopener noreferrer" className="underline">View PDF</a>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addBrochure}
                  className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-500 hover:text-purple-600 transition-colors text-sm font-medium"
                >
                  + Add More Brochures
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Listing Date</label>
                <input 
                  type="date" 
                  name="listingDate" 
                  value={formData.listingDate} 
                  onChange={handleChange} 
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      e.stopPropagation();
                    }
                  }}
                  className="admin-input w-full" 
                />
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
      {showFloorPlanModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-800">Add Floor Plan</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={floorPlanDraft.name}
                onChange={(e) => setFloorPlanDraft((prev) => ({ ...prev, name: e.target.value }))}
                className="admin-input w-full"
                placeholder="e.g., 2 BHK Premium"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    uploadFloorPlanImage(e.target.files[0]);
                    e.target.value = null;
                  }
                }}
                className="admin-input w-full"
              />
              {uploading.floorPlanDraftImage && <p className="text-xs text-blue-600 mt-1">Uploading...</p>}
              {floorPlanDraft.image && <img src={floorPlanDraft.image} alt="Floor plan draft" className="h-24 w-full object-cover rounded border mt-2" />}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Carpet Area (sq ft)</label>
                <input
                  type="number"
                  min="0"
                  value={floorPlanDraft.carpetArea}
                  onChange={(e) => setFloorPlanDraft((prev) => ({ ...prev, carpetArea: e.target.value }))}
                  className="admin-input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={floorPlanDraft.price}
                  onChange={(e) => setFloorPlanDraft((prev) => ({ ...prev, price: e.target.value }))}
                  className="admin-input w-full"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                className="admin-btn-secondary"
                onClick={() => {
                  resetFloorPlanDraft();
                  setShowFloorPlanModal(false);
                }}
              >
                Cancel
              </button>
              <button type="button" className="admin-btn-primary" onClick={addFloorPlan}>
                Add Floor Plan
              </button>
            </div>
          </div>
        </div>
      )}
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
                  <button
                    type="button"
                    onClick={() => setCurrentStep(step.id)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      isActive
                        ? "bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg scale-110"
                        : isCompleted
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "bg-gray-200 text-gray-500 hover:bg-gray-300"
                    }`}
                  >
                    {isCompleted ? <Check size={20} /> : <Icon size={20} />}
                  </button>
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
      <form 
        onSubmit={(e) => {
          // Extra safety check - prevent submission if not on last step
          if (currentStep !== STEPS.length) {
            e.preventDefault();
            e.stopPropagation();
            console.warn("Form submission prevented - not on last step. Current step:", currentStep);
            setError("Please complete all steps before submitting.");
            return false;
          }
          // Prevent if already submitting
          if (isSubmitting || loading) {
            e.preventDefault();
            e.stopPropagation();
            return false;
          }
          // Call the actual submit handler
          handleSubmit(e);
        }}
        noValidate
        onKeyDown={(e) => {
          // Prevent form submission on Enter key in all inputs
          // Only allow submission when explicitly clicking the submit button
          if (e.key === "Enter") {
            const target = e.target;
            // Only allow Enter on submit button
            if (target.type === "submit" || (target.tagName === "BUTTON" && target.type === "submit")) {
              // Double check we're on the last step
              if (currentStep !== STEPS.length) {
                e.preventDefault();
                e.stopPropagation();
                return false;
              }
              return; // Allow submission
            }
            // Prevent Enter key from submitting form in all other cases
            e.preventDefault();
            e.stopPropagation();
            return false;
          }
        }}
        onClick={(e) => {
          // Prevent form submission from clicks on file inputs or other non-button elements
          const target = e.target;
          if (target.type === "file") {
            e.stopPropagation();
          }
          // Prevent form submission if not on last step
          if (currentStep !== STEPS.length && target.type === "submit") {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
        onMouseDown={(e) => {
          // Additional protection for file inputs
          const target = e.target;
          if (target.type === "file") {
            e.stopPropagation();
          }
        }}
      >
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
                disabled={loading || isSubmitting || currentStep !== STEPS.length}
                onClick={(e) => {
                  // Ensure we're on the last step before allowing submission
                  if (currentStep !== STEPS.length) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                  }
                }}
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
