/**
 * Search Form Component
 * Main flight search form with validation
 */

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { AirportAutocomplete } from "./AirportAutocomplete";
import { Button } from "@/components/ui/Button";
import { CABIN_CLASSES, SEARCH_CONSTRAINTS } from "@/lib/constants";

// Validation schema
const searchSchema = z
  .object({
    origin: z
      .string()
      .min(3, "Please select an origin airport")
      .max(3, "Invalid airport code"),
    destination: z
      .string()
      .min(3, "Please select a destination airport")
      .max(3, "Invalid airport code"),
    departureDate: z.string().min(1, "Departure date is required"),
    returnDate: z.string().optional(),
    adults: z
      .number()
      .min(SEARCH_CONSTRAINTS.MIN_ADULTS, "At least 1 adult required")
      .max(SEARCH_CONSTRAINTS.MAX_ADULTS, "Maximum 9 adults"),
    children: z.number().min(0).max(SEARCH_CONSTRAINTS.MAX_CHILDREN).optional(),
    infants: z.number().min(0).max(SEARCH_CONSTRAINTS.MAX_INFANTS).optional(),
    travelClass: z.enum(["ECONOMY", "PREMIUM_ECONOMY", "BUSINESS", "FIRST"]).optional(),
  })
  .refine((data) => data.origin !== data.destination, {
    message: "Origin and destination must be different",
    path: ["destination"],
  })
  .refine(
    (data) => {
      if (!data.returnDate) return true;
      return new Date(data.returnDate) >= new Date(data.departureDate);
    },
    {
      message: "Return date must be after departure date",
      path: ["returnDate"],
    }
  );

type SearchFormData = z.infer<typeof searchSchema>;

interface SearchFormProps {
  defaultValues?: Partial<SearchFormData>;
}

export const SearchForm: React.FC<SearchFormProps> = ({ defaultValues }) => {
  const router = useRouter();
  const [tripType, setTripType] = useState<"roundTrip" | "oneWay">(
    defaultValues?.returnDate ? "roundTrip" : "oneWay"
  );

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      origin: defaultValues?.origin || "",
      destination: defaultValues?.destination || "",
      departureDate: defaultValues?.departureDate || "",
      returnDate: defaultValues?.returnDate || "",
      adults: defaultValues?.adults || 1,
      children: defaultValues?.children || 0,
      infants: defaultValues?.infants || 0,
      travelClass: defaultValues?.travelClass || "ECONOMY",
    },
  });

  // Get today's date in YYYY-MM-DD format
  const today = format(new Date(), "yyyy-MM-dd");
  const departureDate = watch("departureDate");

  const onSubmit = async (data: SearchFormData) => {
    // Build search params
    const params = new URLSearchParams({
      origin: data.origin,
      destination: data.destination,
      departureDate: data.departureDate,
      adults: data.adults.toString(),
    });

    if (tripType === "roundTrip" && data.returnDate) {
      params.append("returnDate", data.returnDate);
    }
    if (data.children && data.children > 0) {
      params.append("children", data.children.toString());
    }
    if (data.infants && data.infants > 0) {
      params.append("infants", data.infants.toString());
    }
    if (data.travelClass && data.travelClass !== "ECONOMY") {
      params.append("travelClass", data.travelClass);
    }

    // Navigate to search results
    router.push(`/search?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Trip Type Toggle */}
      <div className="flex gap-4">
        <label className="flex items-center cursor-pointer">
          <input
            type="radio"
            value="roundTrip"
            checked={tripType === "roundTrip"}
            onChange={(e) => {
              setTripType(e.target.value as "roundTrip");
            }}
            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-gray-700">Round Trip</span>
        </label>
        <label className="flex items-center cursor-pointer">
          <input
            type="radio"
            value="oneWay"
            checked={tripType === "oneWay"}
            onChange={(e) => {
              setTripType(e.target.value as "oneWay");
              setValue("returnDate", "");
            }}
            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-gray-700">One Way</span>
        </label>
      </div>

      {/* Airport Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name="origin"
          control={control}
          render={({ field }) => (
            <AirportAutocomplete
              value={field.value}
              onChange={field.onChange}
              label="From"
              placeholder="Origin airport"
              error={errors.origin?.message}
            />
          )}
        />

        <Controller
          name="destination"
          control={control}
          render={({ field }) => (
            <AirportAutocomplete
              value={field.value}
              onChange={field.onChange}
              label="To"
              placeholder="Destination airport"
              error={errors.destination?.message}
            />
          )}
        />
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Departure Date
          </label>
          <input
            type="date"
            min={today}
            {...register("departureDate")}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.departureDate ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.departureDate && (
            <p className="mt-1 text-sm text-red-600">{errors.departureDate.message}</p>
          )}
        </div>

        {tripType === "roundTrip" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Return Date
            </label>
            <input
              type="date"
              min={departureDate || today}
              {...register("returnDate")}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.returnDate ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.returnDate && (
              <p className="mt-1 text-sm text-red-600">{errors.returnDate.message}</p>
            )}
          </div>
        )}
      </div>

      {/* Passengers and Class */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Adults</label>
          <input
            type="number"
            min={SEARCH_CONSTRAINTS.MIN_ADULTS}
            max={SEARCH_CONSTRAINTS.MAX_ADULTS}
            {...register("adults", { valueAsNumber: true })}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.adults ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.adults && (
            <p className="mt-1 text-sm text-red-600">{errors.adults.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Children (2-11)
          </label>
          <input
            type="number"
            min={0}
            max={SEARCH_CONSTRAINTS.MAX_CHILDREN}
            {...register("children", { valueAsNumber: true })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Infants (&lt;2)
          </label>
          <input
            type="number"
            min={0}
            max={SEARCH_CONSTRAINTS.MAX_INFANTS}
            {...register("infants", { valueAsNumber: true })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
          <select
            {...register("travelClass")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {Object.entries(CABIN_CLASSES).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isSubmitting}
        className="w-full"
      >
        Search Flights
      </Button>
    </form>
  );
};
