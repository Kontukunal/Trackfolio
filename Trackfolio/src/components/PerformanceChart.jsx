// src/components/PerformanceChart.jsx
import { useState, useMemo } from "react";
import { FiRefreshCw } from "react-icons/fi";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export const PerformanceChart = ({ portfolioHistory, onRefresh }) => {
  const [isLoading, setIsLoading] = useState(false);

  const chartData = useMemo(() => {
    if (!portfolioHistory) return [];

    return portfolioHistory.map((entry, index) => ({
      date: new Date(entry.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      value: entry.value,
      change:
        index > 0
          ? ((entry.value - portfolioHistory[index - 1].value) /
              portfolioHistory[index - 1].value) *
            100
          : 0,
    }));
  }, [portfolioHistory]);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      await onRefresh?.();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          Performance History
        </h3>
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="flex items-center text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition"
        >
          <FiRefreshCw className={`mr-1 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>
      <div className="h-80">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f0f0f0"
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: "#888" }}
                tickMargin={10}
              />
              <YAxis
                tickFormatter={(value) => `$${value.toLocaleString()}`}
                tick={{ fontSize: 12, fill: "#888" }}
                width={80}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600">
                        <p className="font-bold text-gray-800 dark:text-white">
                          {label}
                        </p>
                        <p className="text-blue-600 dark:text-blue-400 font-medium">
                          $
                          {payload[0].value.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                        <p
                          className={`text-sm ${
                            payload[0].payload.change >= 0
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {payload[0].payload.change >= 0 ? "↑" : "↓"}{" "}
                          {Math.abs(payload[0].payload.change).toFixed(2)}%
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#3B82F6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorValue)"
                activeDot={{ r: 5, strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
            No performance data available
          </div>
        )}
      </div>
    </div>
  );
};
