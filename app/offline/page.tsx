"use client";
export default function OfflinePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#f0eee7] px-6 text-center">
      <div className="max-w-md">
        <h1 className="text-4xl font-bold text-[#284b36] mb-4">
          Eataliano
        </h1>

        <div className="text-6xl mb-6">📡</div>

        <h2 className="text-2xl font-semibold text-[#284b36] mb-3">
          You are offline
        </h2>

        <p className="text-gray-600 mb-8">
          It looks like you have lost your internet connection.
          Please reconnect to continue ordering your favorite Italian food.
        </p>

        <button
          onClick={() => window.location.reload()}
          className="rounded-lg bg-[#284b36] px-6 py-3 font-semibold text-white hover:bg-[#1d3828] transition"
        >
          Try Again
        </button>
      </div>
    </main>
  );
}