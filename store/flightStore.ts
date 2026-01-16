/**
 * Flight Store - Zustand State Management
 * Manages flight search results, filters, and derived data
 */

import { create } from "zustand";
import { FlightCardData, FlightFilters, PriceDataPoint } from "@/types/flight";
import {
  filterFlights,
  sortFlights,
  extractUniqueAirlines,
  extractPriceRange,
  generatePriceChartData,
} from "@/lib/flightTransformers";

interface FlightState {
  // Raw data
  allFlights: FlightCardData[];
  isLoading: boolean;
  error: string | null;

  // Filters
  filters: FlightFilters;

  // Derived/computed data
  filteredFlights: FlightCardData[];
  chartData: PriceDataPoint[];
  availableAirlines: string[];
  absolutePriceRange: { min: number; max: number };

  // Actions
  setFlights: (flights: FlightCardData[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateFilters: (filters: Partial<FlightFilters>) => void;
  resetFilters: () => void;
  clearSearch: () => void;
}

const DEFAULT_FILTERS: FlightFilters = {
  priceRange: {
    min: 0,
    max: 10000,
  },
  stops: [], // Empty means all stops allowed
  airlines: [],
  sortBy: "price",
};

/**
 * Apply filters and sorting to flights
 */
function applyFiltersAndSort(
  flights: FlightCardData[],
  filters: FlightFilters
): FlightCardData[] {
  // First filter
  let result = filterFlights(flights, {
    priceRange: filters.priceRange,
    stops: filters.stops,
    airlines: filters.airlines,
  });

  // Then sort
  result = sortFlights(result, filters.sortBy);

  return result;
}

/**
 * Main Flight Store
 */
export const useFlightStore = create<FlightState>((set, get) => ({
  // Initial state
  allFlights: [],
  isLoading: false,
  error: null,
  filters: DEFAULT_FILTERS,
  filteredFlights: [],
  chartData: [],
  availableAirlines: [],
  absolutePriceRange: { min: 0, max: 10000 },

  // Set flights from API
  setFlights: (flights: FlightCardData[]) => {
    const priceRange = extractPriceRange(flights);
    const airlines = extractUniqueAirlines(flights);

    // Reset filters with new price range
    const newFilters: FlightFilters = {
      ...DEFAULT_FILTERS,
      priceRange,
    };

    // Apply initial filtering
    const filtered = applyFiltersAndSort(flights, newFilters);
    const chartData = generatePriceChartData(filtered);

    set({
      allFlights: flights,
      filteredFlights: filtered,
      chartData,
      availableAirlines: airlines,
      absolutePriceRange: priceRange,
      filters: newFilters,
      isLoading: false,
      error: null,
    });
  },

  // Set loading state
  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  // Set error
  setError: (error: string | null) => {
    set({ error, isLoading: false });
  },

  // Update filters and recompute derived data
  updateFilters: (partialFilters: Partial<FlightFilters>) => {
    const state = get();
    const newFilters = { ...state.filters, ...partialFilters };

    // Recompute filtered flights
    const filtered = applyFiltersAndSort(state.allFlights, newFilters);
    const chartData = generatePriceChartData(filtered);

    set({
      filters: newFilters,
      filteredFlights: filtered,
      chartData,
    });
  },

  // Reset all filters
  resetFilters: () => {
    const state = get();
    const resetFilters: FlightFilters = {
      ...DEFAULT_FILTERS,
      priceRange: state.absolutePriceRange,
    };

    const filtered = applyFiltersAndSort(state.allFlights, resetFilters);
    const chartData = generatePriceChartData(filtered);

    set({
      filters: resetFilters,
      filteredFlights: filtered,
      chartData,
    });
  },

  // Clear all search data
  clearSearch: () => {
    set({
      allFlights: [],
      filteredFlights: [],
      chartData: [],
      availableAirlines: [],
      absolutePriceRange: { min: 0, max: 10000 },
      filters: DEFAULT_FILTERS,
      isLoading: false,
      error: null,
    });
  },
}));

/**
 * Selectors for optimized component subscriptions
 */
export const selectFilteredFlights = (state: FlightState) => state.filteredFlights;
export const selectChartData = (state: FlightState) => state.chartData;
export const selectFilters = (state: FlightState) => state.filters;
export const selectAvailableAirlines = (state: FlightState) => state.availableAirlines;
export const selectIsLoading = (state: FlightState) => state.isLoading;
export const selectError = (state: FlightState) => state.error;
