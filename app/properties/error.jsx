"use client";

export default function Error({ error, reset }) {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <h2 className="text-2xl font-semibold text-gray-800">
        Something went wrong
      </h2>

      <p className="mt-2 text-gray-500 max-w-md">
        We’re unable to load properties at the moment. Please try again after
        some time.
      </p>

      <button
        onClick={() => reset()}
        className="mt-6 bg-brickred text-white px-6 py-2 rounded-lg hover:bg-ochre transition"
      >
        Try Again
      </button>
    </div>
  );
}
