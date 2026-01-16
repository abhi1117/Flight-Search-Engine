/**
 * Search Results Page
 * Displays flight search results with filters and price chart
 */

"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useFlightStore } from "@/store/flightStore";
import { FlightList } from "@/components/results/FlightList";
import { FilterPanel } from "@/components/filters/FilterPanel";
import { PriceTrendChart } from "@/components/charts/PriceTrendChart";
import { FlightCardData } from "@/types/flight";

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const { setFlights, setLoading, setError, filteredFlights, isLoading, error } =
    useFlightStore();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    const fetchFlights = async () => {
      setLoading(true);
      setError(null);

      try {
        // Build API URL from search params
        const params = new URLSearchParams();
        searchParams.forEach((value, key) => {
          params.append(key, value);
        });

        const response = await fetch(`/api/flights?${params.toString()}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch flights");
        }

        if (data.success && data.data) {
          setFlights(data.data as FlightCardData[]);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load flights";
        setError(errorMessage);
        console.error("Failed to fetch flights:", err);
      }
    };

    if (searchParams.get("origin") && searchParams.get("destination")) {
      fetchFlights();
    }
  }, [searchParams, setFlights, setLoading, setError]);

  // Extract search details
  const origin = searchParams.get("origin");
  const destination = searchParams.get("destination");
  const departureDate = searchParams.get("departureDate");
  const returnDate = searchParams.get("returnDate");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {origin} → {destination}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {departureDate}
                {returnDate && ` - ${returnDate}`}
              </p>
            </div>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="md:hidden px-4 py-2 bg-blue-600 text-white rounded-lg font-medium flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
              Filters
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error State */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <svg
                className="w-5 h-5 text-red-600 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block lg:col-span-1">
            <FilterPanel />
          </aside>

          {/* Results */}
          <div className="lg:col-span-3">
            {/* Price Chart */}
            {!isLoading && !error && <PriceTrendChart />}

            {/* Results Header */}
            {!isLoading && !error && filteredFlights.length > 0 && (
              <div className="mb-4 flex items-center justify-between">
                <p className="text-gray-600">
                  <span className="font-semibold text-gray-900">
                    {filteredFlights.length}
                  </span>{" "}
                  flight{filteredFlights.length !== 1 ? "s" : ""} found
                </p>
              </div>
            )}

            {/* Flight List */}
            <FlightList flights={filteredFlights} isLoading={isLoading} />
          </div>
        </div>
      </main>

      {/* Mobile Filter Drawer */}
      <FilterPanel
        isMobileOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
      />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading search results...</p>
          </div>
        </div>
      }
    >
      <SearchResultsContent />
    </Suspense>
  );
}
