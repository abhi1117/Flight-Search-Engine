/**
 * Flight List Component
 * Renders list of flight cards with loading and empty states
 */

"use client";

import React from "react";
import { FlightCard } from "./FlightCard";
import { FlightCardData } from "@/types/flight";

interface FlightListProps {
  flights: FlightCardData[];
  isLoading?: boolean;
}

export const FlightList: React.FC<FlightListProps> = ({ flights, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <FlightCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (flights.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <svg
          className="w-24 h-24 text-gray-300 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
          />
        </svg>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Flights Found</h3>
        <p className="text-gray-600 text-center max-w-md">
          No flights match your current filters. Try adjusting your search criteria or removing
          some filters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {flights.map((flight) => (
        <FlightCard key={flight.id} flight={flight} />
      ))}
    </div>
  );
};

/**
 * Skeleton loader for flight cards
 */
const FlightCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gray-200 rounded"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-12"></div>
            </div>

            <div className="flex-1">
              <div className="h-px bg-gray-200 w-full"></div>
            </div>

            <div className="text-center">
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-12"></div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <div className="h-10 bg-gray-200 rounded w-32 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-24 mb-4"></div>
          <div className="h-10 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
    </div>
  );
};
