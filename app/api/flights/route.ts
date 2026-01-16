/**
 * Flight Search API Route
 * Server-side endpoint for searching flights via Amadeus API
 */

import { NextRequest, NextResponse } from "next/server";
import { amadeusClient } from "@/lib/amadeus";
import { transformFlightOffers } from "@/lib/flightTransformers";
import { FlightSearchParams } from "@/types/flight";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Extract and validate search parameters
    const params: FlightSearchParams = {
      originLocationCode: searchParams.get("origin") || "",
      destinationLocationCode: searchParams.get("destination") || "",
      departureDate: searchParams.get("departureDate") || "",
      returnDate: searchParams.get("returnDate") || undefined,
      adults: parseInt(searchParams.get("adults") || "1"),
      children: searchParams.get("children")
        ? parseInt(searchParams.get("children")!)
        : undefined,
      infants: searchParams.get("infants")
        ? parseInt(searchParams.get("infants")!)
        : undefined,
      travelClass: (searchParams.get("travelClass") as
        | "ECONOMY"
        | "PREMIUM_ECONOMY"
        | "BUSINESS"
        | "FIRST") || undefined,
      max: 50,
    };

    // Validate required parameters
    if (!params.originLocationCode || !params.destinationLocationCode) {
      return NextResponse.json(
        { error: "Origin and destination are required" },
        { status: 400 }
      );
    }

    if (!params.departureDate) {
      return NextResponse.json({ error: "Departure date is required" }, { status: 400 });
    }

    if (params.originLocationCode === params.destinationLocationCode) {
      return NextResponse.json(
        { error: "Origin and destination must be different" },
        { status: 400 }
      );
    }

    // Call Amadeus API
    console.log("Searching flights:", params);
    const response = await amadeusClient.searchFlights(params);

    // Transform response
    const flights = transformFlightOffers(response);

    console.log(`Found ${flights.length} flights`);

    return NextResponse.json({
      success: true,
      count: flights.length,
      data: flights,
    });
  } catch (error) {
    console.error("❌ Flight search error:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
