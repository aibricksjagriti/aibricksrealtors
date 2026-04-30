export default function LocationsPageLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="h-10 w-64 bg-gray-200 animate-pulse rounded-lg mb-6 mx-auto" />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="border rounded-xl p-4 h-20 bg-gray-200 animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}
