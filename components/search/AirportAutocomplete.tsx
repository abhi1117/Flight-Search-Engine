/**
 * Airport Autocomplete Component
 * Provides search and selection for airports
 */

"use client";

import React, { useState, useEffect, useRef } from "react";
import { POPULAR_AIRPORTS } from "@/lib/constants";
import { AirportSearchResult } from "@/types/flight";

interface AirportAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (airport: { iataCode: string; city: string; name: string }) => void;
  label: string;
  placeholder?: string;
  error?: string;
}

export const AirportAutocomplete: React.FC<AirportAutocompleteProps> = ({
  value,
  onChange,
  onSelect,
  label,
  placeholder = "Search airport...",
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<AirportSearchResult[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search airports
  useEffect(() => {
    if (value.length < 2) {
      setResults([]);
      return;
    }

    // Search in popular airports
    const searchTerm = value.toLowerCase();
    const filtered = POPULAR_AIRPORTS.filter(
      (airport) =>
        airport.iataCode.toLowerCase().includes(searchTerm) ||
        airport.city.toLowerCase().includes(searchTerm) ||
        airport.name.toLowerCase().includes(searchTerm)
    ).map((airport) => ({
      ...airport,
      display: `${airport.city} (${airport.iataCode}) - ${airport.name}`,
    }));

    setResults(filtered.slice(0, 8));
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setIsOpen(true);
  };

  const handleSelect = (airport: AirportSearchResult) => {
    onChange(airport.iataCode);
    onSelect?.(airport);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

      {/* Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {results.map((airport) => (
            <button
              key={airport.iataCode}
              type="button"
              onClick={() => handleSelect(airport)}
              className="w-full px-4 py-2 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors"
            >
              <div className="font-medium text-gray-900">
                {airport.city} ({airport.iataCode})
              </div>
              <div className="text-sm text-gray-600">{airport.name}</div>
            </button>
          ))}
        </div>
      )}

      {/* Show popular airports if no search */}
      {isOpen && value.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          <div className="px-4 py-2 text-sm font-medium text-gray-500 border-b">
            Popular Airports
          </div>
          {POPULAR_AIRPORTS.slice(0, 6).map((airport) => (
            <button
              key={airport.iataCode}
              type="button"
              onClick={() =>
                handleSelect({
                  ...airport,
                  display: `${airport.city} (${airport.iataCode})`,
                })
              }
              className="w-full px-4 py-2 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors"
            >
              <div className="font-medium text-gray-900">
                {airport.city} ({airport.iataCode})
              </div>
              <div className="text-sm text-gray-600">{airport.name}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
