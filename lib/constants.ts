/**
 * Application Constants
 */

// Cabin Classes
export const CABIN_CLASSES = {
  ECONOMY: "Economy",
  PREMIUM_ECONOMY: "Premium Economy",
  BUSINESS: "Business",
  FIRST: "First Class",
} as const;

export type CabinClass = keyof typeof CABIN_CLASSES;

// Sort Options
export const SORT_OPTIONS = {
  price: "Price (Low to High)",
  duration: "Duration (Shortest)",
  departure: "Departure Time",
  arrival: "Arrival Time",
} as const;

// Stop Filters
export const STOP_OPTIONS = [
  { value: 0, label: "Non-stop" },
  { value: 1, label: "1 Stop" },
  { value: 2, label: "2+ Stops" },
];

// Popular Airlines (for display purposes)
export const AIRLINE_NAMES: Record<string, string> = {
  AA: "American Airlines",
  DL: "Delta Air Lines",
  UA: "United Airlines",
  BA: "British Airways",
  LH: "Lufthansa",
  AF: "Air France",
  KL: "KLM",
  EK: "Emirates",
  QR: "Qatar Airways",
  SQ: "Singapore Airlines",
  CX: "Cathay Pacific",
  QF: "Qantas",
  AC: "Air Canada",
  NH: "ANA",
  JL: "Japan Airlines",
  TK: "Turkish Airlines",
  EY: "Etihad Airways",
  SV: "Saudi Arabian Airlines",
  WN: "Southwest Airlines",
  B6: "JetBlue",
  AS: "Alaska Airlines",
  F9: "Frontier Airlines",
  NK: "Spirit Airlines",
};

// Major Airports
export const POPULAR_AIRPORTS = [
  { iataCode: "JFK", city: "New York", name: "John F. Kennedy International", country: "US" },
  { iataCode: "LAX", city: "Los Angeles", name: "Los Angeles International", country: "US" },
  { iataCode: "LHR", city: "London", name: "Heathrow", country: "GB" },
  { iataCode: "DXB", city: "Dubai", name: "Dubai International", country: "AE" },
  { iataCode: "HND", city: "Tokyo", name: "Haneda", country: "JP" },
  { iataCode: "CDG", city: "Paris", name: "Charles de Gaulle", country: "FR" },
  { iataCode: "FRA", city: "Frankfurt", name: "Frankfurt Airport", country: "DE" },
  { iataCode: "SIN", city: "Singapore", name: "Changi Airport", country: "SG" },
  { iataCode: "AMS", city: "Amsterdam", name: "Schiphol", country: "NL" },
  { iataCode: "SFO", city: "San Francisco", name: "San Francisco International", country: "US" },
  { iataCode: "ORD", city: "Chicago", name: "O'Hare International", country: "US" },
  { iataCode: "ATL", city: "Atlanta", name: "Hartsfield-Jackson", country: "US" },
  { iataCode: "MIA", city: "Miami", name: "Miami International", country: "US" },
  { iataCode: "BOS", city: "Boston", name: "Logan International", country: "US" },
  { iataCode: "SEA", city: "Seattle", name: "Seattle-Tacoma International", country: "US" },
  { iataCode: "DEN", city: "Denver", name: "Denver International", country: "US" },
  { iataCode: "LAS", city: "Las Vegas", name: "McCarran International", country: "US" },
  { iataCode: "MCO", city: "Orlando", name: "Orlando International", country: "US" },
  { iataCode: "DFW", city: "Dallas", name: "Dallas/Fort Worth International", country: "US" },
  { iataCode: "IAH", city: "Houston", name: "George Bush Intercontinental", country: "US" },
];

// API Configuration
export const API_CONFIG = {
  AMADEUS_BASE_URL: "https://test.api.amadeus.com",
  TOKEN_EXPIRY_BUFFER: 60, // seconds before actual expiry to refresh
  MAX_RESULTS: 50,
  DEFAULT_CURRENCY: "USD",
} as const;

// Date Formats
export const DATE_FORMATS = {
  API: "yyyy-MM-dd",
  DISPLAY: "MMM dd, yyyy",
  TIME: "HH:mm",
  DATETIME: "MMM dd, HH:mm",
} as const;

// Search Constraints
export const SEARCH_CONSTRAINTS = {
  MIN_ADULTS: 1,
  MAX_ADULTS: 9,
  MAX_CHILDREN: 9,
  MAX_INFANTS: 9,
  MAX_TOTAL_PASSENGERS: 9,
  MIN_SEARCH_LENGTH: 2,
} as const;

// Price Range Defaults
export const PRICE_RANGE_DEFAULTS = {
  MIN: 0,
  MAX: 10000,
  STEP: 50,
} as const;

// Airline Logo URL Template
export const AIRLINE_LOGO_URL = (carrierCode: string) =>
  `https://images.kiwi.com/airlines/64/${carrierCode}.png`;

// Error Messages
export const ERROR_MESSAGES = {
  GENERIC: "An error occurred. Please try again.",
  NO_RESULTS: "No flights found for your search criteria.",
  API_ERROR: "Unable to fetch flights. Please check your API credentials.",
  INVALID_DATES: "Please select valid travel dates.",
  INVALID_AIRPORTS: "Please select valid origin and destination airports.",
  NETWORK_ERROR: "Network error. Please check your internet connection.",
} as const;
