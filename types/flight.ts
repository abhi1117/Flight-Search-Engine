/**
 * Core Flight Data Types
 * These types represent the domain models for the flight search engine
 */

export interface Airport {
  iataCode: string;
  city: string;
  name: string;
  country: string;
}

export interface FlightSegment {
  id: string;
  departure: {
    iataCode: string;
    terminal?: string;
    at: string; // ISO datetime
  };
  arrival: {
    iataCode: string;
    terminal?: string;
    at: string; // ISO datetime
  };
  carrierCode: string;
  carrierName: string;
  number: string;
  aircraft: {
    code: string;
  };
  duration: string; // ISO 8601 duration (e.g., "PT2H30M")
  numberOfStops: number;
}

export interface FlightItinerary {
  segments: FlightSegment[];
  duration: string; // Total duration ISO 8601
}

export interface FlightOffer {
  id: string;
  source: string;
  instantTicketingRequired: boolean;
  nonHomogeneous: boolean;
  oneWay: boolean;
  lastTicketingDate: string;
  numberOfBookableSeats: number;
  itineraries: FlightItinerary[];
  price: {
    currency: string;
    total: string;
    base: string;
    fees?: Array<{
      amount: string;
      type: string;
    }>;
    grandTotal: string;
  };
  pricingOptions: {
    fareType: string[];
    includedCheckedBagsOnly: boolean;
  };
  validatingAirlineCodes: string[];
  travelerPricings: Array<{
    travelerId: string;
    fareOption: string;
    travelerType: string;
    price: {
      currency: string;
      total: string;
      base: string;
    };
    fareDetailsBySegment: Array<{
      segmentId: string;
      cabin: string;
      fareBasis: string;
      brandedFare?: string;
      class: string;
      includedCheckedBags?: {
        quantity: number;
      };
    }>;
  }>;
}

/**
 * Search Parameters
 */
export interface FlightSearchParams {
  originLocationCode: string;
  destinationLocationCode: string;
  departureDate: string; // YYYY-MM-DD
  returnDate?: string; // YYYY-MM-DD
  adults: number;
  children?: number;
  infants?: number;
  travelClass?: "ECONOMY" | "PREMIUM_ECONOMY" | "BUSINESS" | "FIRST";
  nonStop?: boolean;
  currencyCode?: string;
  max?: number;
}

/**
 * Filter State
 */
export interface FlightFilters {
  priceRange: {
    min: number;
    max: number;
  };
  stops: number[]; // [0, 1, 2] represents non-stop, 1 stop, 2+ stops
  airlines: string[]; // Carrier codes
  sortBy: "price" | "duration" | "departure" | "arrival";
}

/**
 * UI State Models
 */
export interface FlightCardData {
  id: string;
  airline: string;
  airlineLogo: string;
  departureTime: string;
  arrivalTime: string;
  departureAirport: string;
  arrivalAirport: string;
  duration: string;
  stops: number;
  price: number;
  currency: string;
  segments: FlightSegment[];
  layovers?: string[];
}

/**
 * Chart Data Point
 */
export interface PriceDataPoint {
  time: string; // HH:mm or date string
  price: number;
  flightId: string;
  stops: number;
  airline: string;
}

/**
 * Amadeus API Response Types
 */
export interface AmadeusAuthResponse {
  type: string;
  username: string;
  application_name: string;
  client_id: string;
  token_type: string;
  access_token: string;
  expires_in: number;
  state: string;
  scope: string;
}

export interface AmadeusFlightOffersResponse {
  meta: {
    count: number;
    links?: {
      self: string;
    };
  };
  data: FlightOffer[];
  dictionaries?: {
    locations?: Record<string, {
      cityCode: string;
      countryCode: string;
    }>;
    aircraft?: Record<string, string>;
    currencies?: Record<string, string>;
    carriers?: Record<string, string>;
  };
}

export interface AmadeusError {
  errors: Array<{
    status: number;
    code: number;
    title: string;
    detail: string;
    source?: {
      parameter?: string;
      pointer?: string;
    };
  }>;
}

/**
 * Airport Search Types
 */
export interface AirportSearchResult {
  iataCode: string;
  name: string;
  city: string;
  country: string;
  display: string; // Formatted display string
}
