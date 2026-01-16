/**
 * Price Trend Chart Component
 * Real-time interactive chart showing flight prices
 */

"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useFlightStore, selectChartData } from "@/store/flightStore";
import { Card } from "@/components/ui/Card";

export const PriceTrendChart: React.FC = () => {
  const chartData = useFlightStore(selectChartData);

  if (chartData.length === 0) {
    return null;
  }

  // Group data by time for better visualization
  const groupedData = chartData.reduce(
    (acc, point) => {
      const existing = acc.find((item) => item.time === point.time);
      if (existing) {
        // Keep the lowest price for each time slot
        if (point.price < existing.price) {
          existing.price = point.price;
          existing.flightId = point.flightId;
        }
      } else {
        acc.push({ ...point });
      }
      return acc;
    },
    [] as typeof chartData
  );

  // Sort by time
  groupedData.sort((a, b) => a.time.localeCompare(b.time));

  // Custom tooltip
  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Array<{
      value: number;
      payload: { time: string; airline: string; stops: number };
    }>;
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="font-semibold text-gray-900">${payload[0].value.toLocaleString()}</p>
          <p className="text-sm text-gray-600">Departure: {data.time}</p>
          <p className="text-sm text-gray-600">{data.airline}</p>
          <p className="text-sm text-gray-600">
            {data.stops === 0
              ? "Non-stop"
              : `${data.stops} stop${data.stops > 1 ? "s" : ""}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-6 mb-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Price Trends</h2>
        <p className="text-sm text-gray-600">
          Lowest prices by departure time • Updates with filters
        </p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={groupedData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 12 }}
            stroke="#6b7280"
            tickFormatter={(value) => value}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            stroke="#6b7280"
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: "12px" }}
            iconType="line"
            formatter={() => "Price"}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#2563eb"
            strokeWidth={2}
            dot={{ fill: "#2563eb", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
            name="Price"
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <p className="text-sm text-gray-600">Lowest Price</p>
          <p className="text-xl font-bold text-green-600">
            ${Math.min(...chartData.map((d) => d.price)).toLocaleString()}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Highest Price</p>
          <p className="text-xl font-bold text-red-600">
            ${Math.max(...chartData.map((d) => d.price)).toLocaleString()}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Average Price</p>
          <p className="text-xl font-bold text-blue-600">
            $
            {Math.round(
              chartData.reduce((acc, d) => acc + d.price, 0) / chartData.length
            ).toLocaleString()}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Total Flights</p>
          <p className="text-xl font-bold text-gray-900">{chartData.length}</p>
        </div>
      </div>
    </Card>
  );
};
