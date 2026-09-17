jest.mock("@/lib/models/Property", () => ({ getById: jest.fn(), getAll: jest.fn() }));
jest.mock("next/server", () => ({
  NextResponse: { json: (body, init = {}) => ({ status: init.status || 200, json: async () => body }) },
}));
const propertyModel = require("@/lib/models/Property");
const { GET } = require("@/app/api/v1/properties/[id]/related/route");

describe("related projects", () => {
  test("prioritizes developer/location/type matches and excludes current property", async () => {
    propertyModel.getById.mockResolvedValue({ id: "current", builderName: "Godrej", city: "Pune", locality: "Kharadi", propertyType: "Apartment", totalPrice: 100 });
    propertyModel.getAll.mockResolvedValue([
      { id: "current", builderName: "Godrej", city: "Pune" },
      { id: "weak", builderName: "Other", city: "Mumbai", propertyType: "Plot", totalPrice: 900 },
      { id: "strong", builderName: "Godrej", city: "Pune", locality: "Kharadi", propertyType: "Apartment", totalPrice: 110 },
      { id: "nearby", builderName: "Other", city: "Pune", propertyType: "Apartment", totalPrice: 100 },
    ]);
    const response = await GET(null, { params: Promise.resolve({ id: "current" }) });
    const body = await response.json();
    expect(body.data.map((item) => item.id)).toEqual(["strong", "nearby", "weak"]);
    expect(body.data).not.toEqual(expect.arrayContaining([expect.objectContaining({ id: "current" })]));
  });
});
