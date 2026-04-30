import SearchClient from "@/src/Search/SearchClient";
import { SearchSkeleton } from "@/src/skeletons/SearchSkeleton";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchSkeleton />}>
      <SearchClient />
    </Suspense>
  );
}
