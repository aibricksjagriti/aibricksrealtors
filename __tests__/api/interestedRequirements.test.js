jest.mock("@/lib/models/Interested", () => ({ create: jest.fn() }));
jest.mock("@/lib/middleware/auth", () => ({ protect: jest.fn() }));
jest.mock("@/lib/middleware/authorize", () => ({ authorizeAdmin: jest.fn() }));
jest.mock("@/lib/logger", () => ({ info: jest.fn(), error: jest.fn() }));
jest.mock("next/server", () => ({
  NextResponse: { json: (body, init = {}) => ({ status: init.status || 200, json: async () => body }) },
}));

const interestedModel = require("@/lib/models/Interested");
const { POST } = require("@/app/api/v1/interested/route");

const request = (body) => ({ json: async () => body });

describe("interested enquiry requirements", () => {
  beforeEach(() => jest.clearAllMocks());

  test("rejects submissions without a budget", async () => {
    const response = await POST(request({ name: "Asha", phone: "9876543210" }));
    expect(response.status).toBe(400);
    expect(interestedModel.create).not.toHaveBeenCalled();
  });

  test("stores requirement fields and keeps email optional", async () => {
    interestedModel.create.mockResolvedValue({ id: "lead-1" });
    const response = await POST(request({
      name: "Asha", phone: "9876543210", budgetRange: "₹1 - 2 Crores",
      preferredLocation: "Pune", propertyType: "Apartment",
      purchaseTimeline: "Within 3 months", message: "3 BHK",
    }));
    expect(response.status).toBe(201);
    expect(interestedModel.create).toHaveBeenCalledWith(expect.objectContaining({
      email: null, preferredLocation: "Pune", propertyType: "Apartment",
      budgetRange: "₹1 - 2 Crores", purchaseTimeline: "Within 3 months", message: "3 BHK",
    }));
  });
});
