/**
 * Flight Card Component
 * Displays individual flight offer
 */

"use client";

import React from "react";
import { FlightCardData } from "@/types/flight";
import { Card } from "@/components/ui/Card";
import Image from "next/image";

interface FlightCardProps {
  flight: FlightCardData;
}

export const FlightCard: React.FC<FlightCardProps> = ({ flight }) => {
  return (
    <Card hover className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Airline and Flight Times */}
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-4">
            {/* Airline Logo */}
            <div className="relative w-12 h-12 flex-shrink-0">
              <Image
                src={flight.airlineLogo}
                alt={flight.airline}
                width={48}
                height={48}
                className="object-contain"
                onError={(e) => {
                  // Fallback if logo fails to load
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>

            {/* Airline Name */}
            <div>
              <p className="font-medium text-gray-900">{flight.airline}</p>
              <p className="text-sm text-gray-500">
                {flight.segments.map((s) => s.number).join(", ")}
              </p>
            </div>
          </div>

          {/* Flight Times and Duration */}
          <div className="flex items-center gap-4">
            {/* Departure */}
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{flight.departureTime}</p>
              <p className="text-sm text-gray-600">{flight.departureAirport}</p>
            </div>

            {/* Duration and Stops */}
            <div className="flex-1 flex flex-col items-center">
              <p className="text-sm text-gray-500 mb-1">{flight.duration}</p>
              <div className="relative w-full h-px bg-gray-300">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                  {flight.stops === 0 ? (
                    <span className="text-xs font-medium text-green-600">Non-stop</span>
                  ) : (
                    <span className="text-xs font-medium text-gray-600">
                      {flight.stops} stop{flight.stops > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              </div>
              {flight.layovers && flight.layovers.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">via {flight.layovers.join(", ")}</p>
              )}
            </div>

            {/* Arrival */}
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{flight.arrivalTime}</p>
              <p className="text-sm text-gray-600">{flight.arrivalAirport}</p>
            </div>
          </div>
        </div>

        {/* Right: Price */}
        <div className="flex flex-col items-center md:items-end justify-center border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6">
          <p className="text-3xl font-bold text-gray-900">
            {flight.currency} {flight.price.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-1">per person</p>
          <button className="mt-4 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
            Select
          </button>
        </div>
      </div>

      {/* Expandable Details (Optional) */}
      {flight.segments.length > 1 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <details className="group">
            <summary className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-700 list-none flex items-center gap-2">
              <span>Flight Details</span>
              <svg
                className="w-4 h-4 transition-transform group-open:rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </summary>
            <div className="mt-3 space-y-3 text-sm">
              {flight.segments.map((segment, index) => (
                <div key={segment.id} className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">
                      Segment {index + 1}: {segment.departure.iataCode} →{" "}
                      {segment.arrival.iataCode}
                    </p>
                    <p className="text-gray-600">
                      {segment.carrierName} {segment.number} • {segment.aircraft.code}
                    </p>
                  </div>
                  <p className="text-gray-600">{segment.duration}</p>
                </div>
              ))}
            </div>
          </details>
        </div>
      )}
    </Card>
  );
};
