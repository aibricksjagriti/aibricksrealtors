import SearchClient from "@/src/Search/SearchClient";
import { SearchSkeleton } from "@/src/skeletons/SearchSkeleton";
import { Suspense } from "react";
import { buildMetadata } from "@/lib/utils/seo";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "Search Properties | AI Bricks Realtors",
  description: "Search residential and commercial properties across India on AI Bricks Realtors.",
  path: "/search",
  noIndex: true,
});

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchSkeleton />}>
      <SearchClient />
    </Suspense>
  );
}
