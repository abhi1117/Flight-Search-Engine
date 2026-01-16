/**
 * Flight Data Transformers
 * Converts raw Amadeus API responses to clean internal models
 */

import { format, parseISO, differenceInMinutes } from "date-fns";
import {
  FlightOffer,
  FlightCardData,
  PriceDataPoint,
  AmadeusFlightOffersResponse,
} from "@/types/flight";
import { AIRLINE_NAMES, AIRLINE_LOGO_URL } from "./constants";

/**
 * Parse ISO 8601 duration to human-readable format
 * e.g., "PT2H30M" -> "2h 30m"
 */
export function parseDuration(duration: string): string {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return duration;

  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;

  if (hours && minutes) {
    return `${hours}h ${minutes}m`;
  } else if (hours) {
    return `${hours}h`;
  } else if (minutes) {
    return `${minutes}m`;
  }
  return duration;
}

/**
 * Calculate number of stops from segments
 */
function calculateStops(segments: FlightOffer["itineraries"][0]["segments"]): number {
  return Math.max(0, segments.length - 1);
}

/**
 * Get airline name from carrier code
 */
function getAirlineName(carrierCode: string, dictionaries?: Record<string, string>): string {
  return dictionaries?.[carrierCode] || AIRLINE_NAMES[carrierCode] || carrierCode;
}

/**
 * Calculate layover information
 */
function getLayovers(segments: FlightOffer["itineraries"][0]["segments"]): string[] {
  const layovers: string[] = [];

  for (let i = 0; i < segments.length - 1; i++) {
    const arrivalTime = parseISO(segments[i].arrival.at);
    const nextDepartureTime = parseISO(segments[i + 1].departure.at);
    const layoverMinutes = differenceInMinutes(nextDepartureTime, arrivalTime);
    const layoverHours = Math.floor(layoverMinutes / 60);
    const layoverMins = layoverMinutes % 60;

    const airport = segments[i].arrival.iataCode;
    const layoverText =
      layoverHours > 0 ? `${layoverHours}h ${layoverMins}m` : `${layoverMins}m`;

    layovers.push(`${airport} (${layoverText})`);
  }

  return layovers;
}

/**
 * Transform a single FlightOffer to FlightCardData
 */
export function transformFlightOffer(
  offer: FlightOffer,
  carrierDictionary?: Record<string, string>
): FlightCardData {
  // Use the first itinerary (outbound)
  const itinerary = offer.itineraries[0];
  const firstSegment = itinerary.segments[0];
  const lastSegment = itinerary.segments[itinerary.segments.length - 1];

  // Get primary carrier
  const primaryCarrier = offer.validatingAirlineCodes[0] || firstSegment.carrierCode;

  return {
    id: offer.id,
    airline: getAirlineName(primaryCarrier, carrierDictionary),
    airlineLogo: AIRLINE_LOGO_URL(primaryCarrier),
    departureTime: format(parseISO(firstSegment.departure.at), "HH:mm"),
    arrivalTime: format(parseISO(lastSegment.arrival.at), "HH:mm"),
    departureAirport: firstSegment.departure.iataCode,
    arrivalAirport: lastSegment.arrival.iataCode,
    duration: parseDuration(itinerary.duration),
    stops: calculateStops(itinerary.segments),
    price: parseFloat(offer.price.grandTotal),
    currency: offer.price.currency,
    segments: itinerary.segments.map((segment) => ({
      ...segment,
      carrierName: getAirlineName(segment.carrierCode, carrierDictionary),
    })),
    layovers: getLayovers(itinerary.segments),
  };
}

/**
 * Transform all flight offers from API response
 */
export function transformFlightOffers(response: AmadeusFlightOffersResponse): FlightCardData[] {
  const carrierDictionary = response.dictionaries?.carriers;

  return response.data.map((offer) => transformFlightOffer(offer, carrierDictionary));
}

/**
 * Generate price chart data from flight offers
 */
export function generatePriceChartData(flights: FlightCardData[]): PriceDataPoint[] {
  return flights.map((flight) => ({
    time: flight.departureTime,
    price: flight.price,
    flightId: flight.id,
    stops: flight.stops,
    airline: flight.airline,
  }));
}

/**
 * Get unique airlines from flight list
 */
export function extractUniqueAirlines(flights: FlightCardData[]): string[] {
  const airlines = new Set(flights.map((f) => f.airline));
  return Array.from(airlines).sort();
}

/**
 * Get price range from flight list
 */
export function extractPriceRange(flights: FlightCardData[]): { min: number; max: number } {
  if (flights.length === 0) {
    return { min: 0, max: 1000 };
  }

  const prices = flights.map((f) => f.price);
  return {
    min: Math.floor(Math.min(...prices)),
    max: Math.ceil(Math.max(...prices)),
  };
}

/**
 * Sort flights by given criteria
 */
export function sortFlights(
  flights: FlightCardData[],
  sortBy: "price" | "duration" | "departure" | "arrival"
): FlightCardData[] {
  const sorted = [...flights];

  switch (sortBy) {
    case "price":
      return sorted.sort((a, b) => a.price - b.price);
    case "duration":
      // Parse duration for comparison
      return sorted.sort((a, b) => {
        const aDuration = parseDurationToMinutes(a.duration);
        const bDuration = parseDurationToMinutes(b.duration);
        return aDuration - bDuration;
      });
    case "departure":
      return sorted.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
    case "arrival":
      return sorted.sort((a, b) => a.arrivalTime.localeCompare(b.arrivalTime));
    default:
      return sorted;
  }
}

/**
 * Helper: Convert duration string to minutes
 */
function parseDurationToMinutes(duration: string): number {
  const match = duration.match(/(\d+)h\s*(\d+)?m?/);
  if (!match) return 0;

  const hours = parseInt(match[1]) || 0;
  const minutes = parseInt(match[2]) || 0;

  return hours * 60 + minutes;
}

/**
 * Filter flights by criteria
 */
export function filterFlights(
  flights: FlightCardData[],
  filters: {
    priceRange: { min: number; max: number };
    stops: number[];
    airlines: string[];
  }
): FlightCardData[] {
  return flights.filter((flight) => {
    // Price filter
    if (flight.price < filters.priceRange.min || flight.price > filters.priceRange.max) {
      return false;
    }

    // Stops filter
    if (filters.stops.length > 0) {
      const matchesStops = filters.stops.some((stopCount) => {
        if (stopCount === 2) {
          // 2+ stops
          return flight.stops >= 2;
        }
        return flight.stops === stopCount;
      });

      if (!matchesStops) return false;
    }

    // Airlines filter
    if (filters.airlines.length > 0 && !filters.airlines.includes(flight.airline)) {
      return false;
    }

    return true;
  });
}
