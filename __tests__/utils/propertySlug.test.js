import {
  getPropertyPath,
  getPropertySlug,
  slugifyProperty,
} from "@/lib/utils/propertySlug";

describe("property URL helpers", () => {
  test("prefers the persisted slug", () => {
    expect(getPropertyPath({
      id: "random-id",
      propertyTitle: "Renamed Property",
      slug: "saved-property-slug",
    })).toBe("/properties/saved-property-slug");
  });

  test("uses the property title before the document ID", () => {
    expect(getPropertyPath({
      id: "ad1eNkMjwz4A3Vb2NsLS",
      propertyTitle: "Godrej Aqua Retreat Hinjewadi",
    })).toBe("/properties/godrej-aqua-retreat-hinjewadi");
  });

  test("supports formatted cards that expose only name", () => {
    expect(getPropertySlug({
      id: "random-id",
      name: "Kohinoor Central Park",
    })).toBe("kohinoor-central-park");
  });

  test("normalizes punctuation and ampersands consistently", () => {
    expect(slugifyProperty("VTP Aurelia, Kharadi & Pune"))
      .toBe("vtp-aurelia-kharadi-and-pune");
  });
});
