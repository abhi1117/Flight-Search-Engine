/**
 * Filter Panel Component
 * Main container for all flight filters with real-time updates
 */

"use client";

import React, { useState } from "react";
import { useFlightStore, selectFilters, selectAvailableAirlines } from "@/store/flightStore";
import { STOP_OPTIONS, SORT_OPTIONS } from "@/lib/constants";
import { Card } from "@/components/ui/Card";

interface FilterPanelProps {
  isMobileOpen?: boolean;
  onClose?: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  isMobileOpen = false,
  onClose,
}) => {
  const filters = useFlightStore(selectFilters);
  const availableAirlines = useFlightStore(selectAvailableAirlines);
  const { updateFilters, resetFilters, absolutePriceRange } = useFlightStore();

  const [localPriceRange, setLocalPriceRange] = useState({
    min: filters.priceRange.min,
    max: filters.priceRange.max,
  });

  // Handle price range change with debounce effect
  const handlePriceChange = (type: "min" | "max", value: number) => {
    const newRange = { ...localPriceRange, [type]: value };
    setLocalPriceRange(newRange);
    // Update immediately for responsive feel
    updateFilters({ priceRange: newRange });
  };

  // Handle stops filter
  const handleStopsChange = (stopCount: number) => {
    const currentStops = [...filters.stops];
    const index = currentStops.indexOf(stopCount);

    if (index > -1) {
      currentStops.splice(index, 1);
    } else {
      currentStops.push(stopCount);
    }

    updateFilters({ stops: currentStops });
  };

  // Handle airline filter
  const handleAirlineChange = (airline: string) => {
    const currentAirlines = [...filters.airlines];
    const index = currentAirlines.indexOf(airline);

    if (index > -1) {
      currentAirlines.splice(index, 1);
    } else {
      currentAirlines.push(airline);
    }

    updateFilters({ airlines: currentAirlines });
  };

  // Handle sort change
  const handleSortChange = (sortBy: "price" | "duration" | "departure" | "arrival") => {
    updateFilters({ sortBy });
  };

  const filterContent = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        <button
          onClick={resetFilters}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Reset All
        </button>
      </div>

      {/* Sort By */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Sort By</h3>
        <select
          value={filters.sortBy}
          onChange={(e) =>
            handleSortChange(e.target.value as "price" | "duration" | "departure" | "arrival")
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {Object.entries(SORT_OPTIONS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Price Range</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              ${localPriceRange.min.toLocaleString()}
            </span>
            <span className="text-gray-600">
              ${localPriceRange.max.toLocaleString()}
            </span>
          </div>

          {/* Min Price Slider */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Minimum</label>
            <input
              type="range"
              min={absolutePriceRange.min}
              max={absolutePriceRange.max}
              value={localPriceRange.min}
              onChange={(e) => handlePriceChange("min", Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Max Price Slider */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Maximum</label>
            <input
              type="range"
              min={absolutePriceRange.min}
              max={absolutePriceRange.max}
              value={localPriceRange.max}
              onChange={(e) => handlePriceChange("max", Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </div>
      </div>

      {/* Stops Filter */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Number of Stops</h3>
        <div className="space-y-2">
          {STOP_OPTIONS.map((option) => (
            <label key={option.value} className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.stops.includes(option.value)}
                onChange={() => handleStopsChange(option.value)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Airlines Filter */}
      {availableAirlines.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Airlines</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {availableAirlines.map((airline) => (
              <label key={airline} className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.airlines.includes(airline)}
                  onChange={() => handleAirlineChange(airline)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                  {airline}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Mobile drawer
  if (isMobileOpen) {
    return (
      <>
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />

        {/* Drawer */}
        <div className="fixed inset-y-0 left-0 w-80 bg-white shadow-xl z-50 overflow-y-auto md:hidden">
          <div className="p-6">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            {filterContent}
          </div>
        </div>
      </>
    );
  }

  // Desktop sidebar
  return (
    <Card className="p-6 sticky top-4">
      {filterContent}
    </Card>
  );
};
