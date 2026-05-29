// Tests for the new property data structure — ensures the fields expected by the
// display components actually exist and have the correct shape when a property
// is submitted from the admin form.

// Simulates what handleSubmit() produces from formData
function buildSubmitData(formData) {
  const submitData = {};
  Object.keys(formData).forEach((key) => {
    const value = formData[key];
    if (value !== "" && value !== null && value !== undefined) {
      if (Array.isArray(value)) {
        if (key === "brochures") {
          const valid = value.filter(b => b.name || b.url);
          if (valid.length > 0) submitData[key] = valid;
        } else if (key === "tokenTypes") {
          const valid = value.filter(t => (typeof t === "string" ? t.trim() : t.name));
          if (valid.length > 0) submitData[key] = valid;
        } else if (value.length > 0) {
          submitData[key] = value;
        }
      } else {
        submitData[key] = value;
      }
    }
  });
  return submitData;
}

const baseFormData = {
  propertyTitle: "Luxury 3 BHK",
  propertyType: "Apartment",
  subTypes: ["2 BHK", "3 BHK"],
  listingType: "Sale",
  propertyStatus: "Ready to Move",
  possessionDate: "",
  ageOfProperty: "0–1 Year",
  furnishing: "Furnished",
  builtUpArea: [{ subType: "2 BHK", area: 900 }, { subType: "3 BHK", area: 1200 }],
  carpetArea: [{ subType: "2 BHK", area: 780 }, { subType: "3 BHK", area: 1050 }],
  totalFloors: 15,
  ownershipType: "Freehold",
  country: "India",
  state: "Maharashtra",
  city: "Mumbai",
  locality: "Andheri",
  subLocality: "",
  streetName: "",
  landmark: "",
  pincode: "",
  latitude: "",
  longitude: "",
  nearestMetroStation: "",
  nearestRailwayStation: "",
  nearestBusStop: "",
  priceRangeMin: 7500000,
  priceRangeMax: 15000000,
  maintenanceCharges: "",
  tokenTypes: ["Gold Token - ₹25000", "Silver Token - ₹10000"],
  bookingAmount: 10,
  negotiable: "Yes",
  emiAvailable: "Yes",
  stampDuty: "",
  description: "A great property",
  amenities: ["Swimming Pool", "Gym"],
  projectName: "Skyline Heights",
  builderName: "Lodha Group",
  reraRegistrationNumber: "RERA123",
  totalUnitsInProject: 200,
  numberOfTowers: 3,
  numberOfLifts: "",
  powerBackup: "Yes",
  waterSupplyType: "",
  gatedCommunity: "Yes",
  fireSafetySystem: "",
  cctv: "Yes",
  security24x7: "Yes",
  mainPropertyImage: "https://storage.googleapis.com/bucket/img.jpg",
  imageGallery: ["https://storage.googleapis.com/bucket/img2.jpg"],
  floorPlans: [],
  floorPlanImages: [],
  videoWalkthrough: "",
  virtualTour360: "",
  brochures: [{ name: "Main Brochure", url: "https://storage.googleapis.com/bucket/brochure.pdf" }],
  listingDate: "",
  featuredListing: "No",
  premiumListing: "No",
  soldStatus: "No",
  activeStatus: "Yes",
};

describe("Property submit data structure", () => {
  let data;
  beforeAll(() => {
    data = buildSubmitData(baseFormData);
  });

  test("includes required basic fields", () => {
    expect(data.propertyTitle).toBe("Luxury 3 BHK");
    expect(data.propertyType).toBe("Apartment");
    expect(data.listingType).toBe("Sale");
    expect(data.propertyStatus).toBe("Ready to Move");
  });

  test("subTypes is an array with correct values", () => {
    expect(Array.isArray(data.subTypes)).toBe(true);
    expect(data.subTypes).toContain("2 BHK");
    expect(data.subTypes).toContain("3 BHK");
  });

  test("builtUpArea and carpetArea are arrays of objects with subType+area", () => {
    expect(Array.isArray(data.builtUpArea)).toBe(true);
    expect(data.builtUpArea[0]).toHaveProperty("subType");
    expect(data.builtUpArea[0]).toHaveProperty("area");
    expect(Array.isArray(data.carpetArea)).toBe(true);
  });

  test("uses priceRangeMin/Max (not totalPrice or monthlyRent)", () => {
    expect(data.priceRangeMin).toBe(7500000);
    expect(data.priceRangeMax).toBe(15000000);
    expect(data).not.toHaveProperty("totalPrice");
    expect(data).not.toHaveProperty("monthlyRent");
  });

  test("tokenTypes is included and filtered", () => {
    expect(Array.isArray(data.tokenTypes)).toBe(true);
    expect(data.tokenTypes.length).toBe(2);
  });

  test("empty tokenType strings are excluded", () => {
    const fd = { ...baseFormData, tokenTypes: ["Gold Token", "", ""] };
    const result = buildSubmitData(fd);
    expect(result.tokenTypes).toEqual(["Gold Token"]);
  });

  test("brochures with empty name and url are excluded", () => {
    const fd = { ...baseFormData, brochures: [{ name: "", url: "" }, { name: "B1", url: "http://x.com/b.pdf" }] };
    const result = buildSubmitData(fd);
    expect(result.brochures).toHaveLength(1);
    expect(result.brochures[0].name).toBe("B1");
  });

  test("empty string fields are stripped", () => {
    expect(data).not.toHaveProperty("subLocality");
    expect(data).not.toHaveProperty("streetName");
    expect(data).not.toHaveProperty("landmark");
    expect(data).not.toHaveProperty("stampDuty");
    expect(data).not.toHaveProperty("possessionDate");
  });

  test("no old deprecated fields", () => {
    expect(data).not.toHaveProperty("price");
    expect(data).not.toHaveProperty("floorNumber");
    expect(data).not.toHaveProperty("facingDirection");
    expect(data).not.toHaveProperty("securityDeposit");
    expect(data).not.toHaveProperty("registrationCharges");
  });
});
