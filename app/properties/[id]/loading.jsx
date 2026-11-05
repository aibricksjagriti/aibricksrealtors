"use client";

import { useParams } from "next/navigation";
import {
  KohinoorAdLandingSkeleton,
  PropertyDetailSkeleton,
} from "@/src/skeletons/PropertyDetailSkeleton";

export default function PropertyLoading() {
  const { id } = useParams();

  if (id === "kohinoor-avantara-wakad") {
    return <KohinoorAdLandingSkeleton />;
  }

  return <PropertyDetailSkeleton />;
}
