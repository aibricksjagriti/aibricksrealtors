import { NextResponse } from "next/server";
import propertyModel from "@/lib/models/Property";

const priceOf = (property) => Number(property.priceRangeMin || property.totalPrice || property.monthlyRent || 0);

export async function GET(_request, { params }) {
  try {
    const { id } = await params;
    const current = await propertyModel.getById(id);
    if (!current) return NextResponse.json({ success: false, error: "Property not found" }, { status: 404 });
    const candidates = await propertyModel.getAll({ activeStatus: "Yes" });
    const currentPrice = priceOf(current);
    const scored = candidates.filter((item) => item.id !== id).map((item) => {
      let score = 0;
      if (item.builderName && item.builderName === current.builderName) score += 5;
      if (item.locality && item.locality === current.locality) score += 4;
      else if (item.city && item.city === current.city) score += 3;
      if (item.propertyType && item.propertyType === current.propertyType) score += 2;
      const candidatePrice = priceOf(item);
      if (currentPrice && candidatePrice && Math.abs(candidatePrice - currentPrice) / currentPrice <= 0.25) score += 2;
      return { item, score };
    }).sort((a, b) => b.score - a.score).slice(0, 6).map(({ item }) => item);
    return NextResponse.json({ success: true, data: scored });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to load related projects" }, { status: 500 });
  }
}
