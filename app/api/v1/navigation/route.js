import { NextResponse } from "next/server";
import { getNavData } from "@/lib/data/nav";

export async function GET() {
  const data = await getNavData();

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
}