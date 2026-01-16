/**
 * Amadeus API Client
 * Handles authentication, token management, and API requests to Amadeus
 */

import axios, { AxiosInstance } from "axios";
import {
  AmadeusAuthResponse,
  AmadeusFlightOffersResponse,
  FlightSearchParams,
} from "@/types/flight";
import { API_CONFIG } from "./constants";

/**
 * Token cache to avoid unnecessary auth requests
 */
let cachedToken: string | null = null;
let tokenExpiryTime: number | null = null;

/**
 * Amadeus API Client Class
 */
class AmadeusClient {
  private apiKey: string;
  private apiSecret: string;
  private baseUrl: string;
  private axiosInstance: AxiosInstance;

  constructor() {
    this.apiKey = process.env.AMADEUS_API_KEY || "";
    this.apiSecret = process.env.AMADEUS_API_SECRET || "";
    this.baseUrl = process.env.AMADEUS_API_BASE_URL || API_CONFIG.AMADEUS_BASE_URL;

    if (!this.apiKey || !this.apiSecret) {
      console.warn(
        "Amadeus API credentials not found. Please set AMADEUS_API_KEY and AMADEUS_API_SECRET in .env.local"
      );
    }

    // Create axios instance with default config
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      timeout: 30000,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
  }

  /**
   * Get access token from Amadeus
   * Implements token caching to reduce API calls
   */
  private async getAccessToken(): Promise<string> {
    const now = Date.now();

    // Return cached token if still valid
    if (cachedToken && tokenExpiryTime && now < tokenExpiryTime) {
      return cachedToken;
    }

    try {
      const response = await this.axiosInstance.post<AmadeusAuthResponse>(
        "/v1/security/oauth2/token",
        new URLSearchParams({
          grant_type: "client_credentials",
          client_id: this.apiKey,
          client_secret: this.apiSecret,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      cachedToken = response.data.access_token;
      // Set expiry time with buffer
      tokenExpiryTime =
        now + (response.data.expires_in - API_CONFIG.TOKEN_EXPIRY_BUFFER) * 1000;

      return cachedToken;
    } catch (error) {
      console.error("❌ Failed to get Amadeus access token:", error);
      throw new Error("Authentication failed. Please check your API credentials.");
    }
  }

  /**
   * Search for flight offers
   */
  async searchFlights(params: FlightSearchParams): Promise<AmadeusFlightOffersResponse> {
    try {
      const token = await this.getAccessToken();

      // Build query parameters
      const queryParams = new URLSearchParams({
        originLocationCode: params.originLocationCode,
        destinationLocationCode: params.destinationLocationCode,
        departureDate: params.departureDate,
        adults: params.adults.toString(),
        max: (params.max || API_CONFIG.MAX_RESULTS).toString(),
        currencyCode: params.currencyCode || API_CONFIG.DEFAULT_CURRENCY,
      });

      // Add optional parameters
      if (params.returnDate) {
        queryParams.append("returnDate", params.returnDate);
      }
      if (params.children) {
        queryParams.append("children", params.children.toString());
      }
      if (params.infants) {
        queryParams.append("infants", params.infants.toString());
      }
      if (params.travelClass) {
        queryParams.append("travelClass", params.travelClass);
      }
      if (params.nonStop) {
        queryParams.append("nonStop", "true");
      }

      const response = await this.axiosInstance.get<AmadeusFlightOffersResponse>(
        "/v2/shopping/flight-offers",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: queryParams,
        }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const data = error.response?.data;

        console.error("❌ Amadeus API Error:", {
          status,
          data,
        });

        if (status === 401) {
          // Token expired, clear cache and retry once
          cachedToken = null;
          tokenExpiryTime = null;
          throw new Error("Authentication expired. Please try again.");
        }

        if (status === 400) {
          throw new Error(
            data?.errors?.[0]?.detail || "Invalid search parameters. Please check your inputs."
          );
        }

        if (status === 429) {
          throw new Error("Rate limit exceeded. Please wait a moment and try again.");
        }

        throw new Error(data?.errors?.[0]?.detail || "Failed to fetch flights.");
      }

      throw new Error("Network error. Please check your connection.");
    }
  }

  /**
   * Search for airport/city by keyword
   * Uses Amadeus Airport & City Search API
   */
  async searchLocation(keyword: string): Promise<
    Array<{
      iataCode: string;
      name: string;
      city: string;
      country: string;
    }>
  > {
    try {
      const token = await this.getAccessToken();

      const response = await this.axiosInstance.get("/v1/reference-data/locations", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          keyword,
          subType: "AIRPORT,CITY",
          "page[limit]": 10,
        },
      });

      // Transform response to our format
      return response.data.data.map(
        (location: {
          iataCode: string;
          name: string;
          address: { cityName: string; countryName: string };
        }) => ({
          iataCode: location.iataCode,
          name: location.name,
          city: location.address.cityName,
          country: location.address.countryName,
        })
      );
    } catch (error) {
      console.error("❌ Failed to search locations:", error);
      return [];
    }
  }
}

// Export singleton instance
export const amadeusClient = new AmadeusClient();
