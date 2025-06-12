import { useState, useEffect, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { FiRefreshCw } from "react-icons/fi";

const PerformanceChart = ({ data, timeRange, onRefresh }) => {
  const [isLoading, setIsLoading] = useState(false);

  // Memoize the chart data to prevent unnecessary recalculations
  const chartData = useMemo(() => {
    const rangeData = data[timeRange] || [];
    return rangeData.map((value, index) => ({
      name: `Day ${index + 1}`,
      value,
      volume: Math.floor(Math.random() * 10000) + 5000,
    }));
  }, [data, timeRange]);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      await onRefresh();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 h-96">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          Portfolio Performance
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
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" stroke="#888" tick={{ fontSize: 12 }} />
            <YAxis
              stroke="#888"
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600">
                      <p className="font-bold">{label}</p>
                      <p className="text-blue-600 dark:text-blue-400">
                        Value: ${payload[0].value.toLocaleString()}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400">
                        Volume: {payload[0].payload.volume.toLocaleString()}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#3B82F6"
              fillOpacity={1}
              fill="url(#colorValue)"
              activeDot={{ r: 6 }}
              name="Portfolio Value"
              isAnimationActive={false} // Disable animations to prevent issues
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PerformanceChart;
