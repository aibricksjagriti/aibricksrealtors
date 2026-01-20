import BookSiteVisitCard from "@/src/Properties/BookSiteVisitCard";
import ContactSidebar from "@/src/Properties/ContactSidebar";
import SearchClient from "@/src/Search/SearchClient";
import { Suspense } from "react";

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchFallback />}>
      {/* <SearchClient /> */}
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT LISTINGS */}
        <div className="lg:col-span-8 space-y-4 mt-">
          <SearchClient />
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="hidden lg:block lg:col-span-4">
          <div className="sticky top-28 space-y-6">
            <ContactSidebar />
            <BookSiteVisitCard />
          </div>
        </div>
      </div>
    </Suspense>
  );
}

function SearchFallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center text-gray-400">
      Preparing search results...
    </div>
  );
}
