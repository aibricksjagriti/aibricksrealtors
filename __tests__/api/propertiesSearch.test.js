jest.mock("@/lib/models/Property", () => ({
  advancedSearch: jest.fn(),
}));
jest.mock("next/server", () => ({
  NextResponse: {
    json: (body, init = {}) => ({
      status: init.status || 200,
      json: async () => body,
    }),
  },
}));

const propertyModel = require("@/lib/models/Property");
const { GET } = require("@/app/api/v1/properties/search/route");

describe("properties search API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    propertyModel.advancedSearch.mockResolvedValue({ results: [], total: 0, page: 1, limit: 20, totalPages: 0 });
  });

  test("passes text, city, type, developer and price filters together", async () => {
    const request = { url: "http://localhost/api/v1/properties/search?q=park&city=Pune&propertyType=Commercial&developer=Godrej&minPrice=5000000&maxPrice=10000000" };
    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(propertyModel.advancedSearch).toHaveBeenCalledWith(expect.objectContaining({
      searchText: "park",
      city: "Pune",
      propertyType: "Commercial",
      developer: "Godrej",
      minPrice: "5000000",
      maxPrice: "10000000",
      activeStatus: "Yes",
    }));
  });

  test.each(["Apartment", "Villa", "Penthouse", "Commercial", "Plot"])("accepts the %s property type", async (propertyType) => {
    await GET({ url: `http://localhost/api/v1/properties/search?propertyType=${propertyType}` });
    expect(propertyModel.advancedSearch).toHaveBeenLastCalledWith(expect.objectContaining({ propertyType }));
  });
});
