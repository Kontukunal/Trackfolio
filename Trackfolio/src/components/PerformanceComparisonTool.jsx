// src/components/PerformanceComparisonTool.jsx
import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { FiPlus, FiX } from "react-icons/fi";

const PerformanceComparisonTool = ({ assets, marketData }) => {
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [benchmarks, setBenchmarks] = useState(["SPY"]); // Default to S&P 500
  const [timeRange, setTimeRange] = useState("1m");
  const [comparisonData, setComparisonData] = useState([]);
  const [isAddingAsset, setIsAddingAsset] = useState(false);
  const [availableAssets, setAvailableAssets] = useState([]);

  // Colors for the chart lines
  const COLORS = [
    "#3B82F6",
    "#8B5CF6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#6B7280",
  ];

  // Update available assets when assets or selectedAssets change
  useEffect(() => {
    setAvailableAssets(
      assets.filter(
        (asset) =>
          !selectedAssets.includes(asset.symbol) && marketData[asset.symbol]
      )
    );
  }, [assets, selectedAssets, marketData]);

  // Simulate fetching historical data (in a real app, this would be an API call)
  useEffect(() => {
    if (selectedAssets.length === 0 && benchmarks.length === 0) {
      setComparisonData([]);
      return;
    }

    // Generate mock comparison data based on time range
    const generateData = () => {
      const dataPoints =
        timeRange === "1m" ? 30 : timeRange === "3m" ? 90 : 365;
      const today = new Date();

      return Array.from({ length: dataPoints }, (_, i) => {
        const date = new Date(today);
        date.setDate(date.getDate() - (dataPoints - i));

        const entry = {
          date: date.toISOString().split("T")[0],
        };

        // Add selected assets
        selectedAssets.forEach((symbol) => {
          const asset = assets.find((a) => a.symbol === symbol);
          if (asset && marketData[symbol]) {
            const basePrice = marketData[symbol].price;
            // Simulate price movement with some randomness
            entry[symbol] =
              basePrice * (0.95 + Math.random() * 0.1 * (i / dataPoints));
          }
        });

        // Add benchmarks
        benchmarks.forEach((symbol) => {
          if (marketData[symbol]) {
            const basePrice = marketData[symbol].price;
            // Benchmarks have less volatility
            entry[symbol] =
              basePrice * (0.97 + Math.random() * 0.06 * (i / dataPoints));
          }
        });

        return entry;
      });
    };

    setComparisonData(generateData());
  }, [selectedAssets, benchmarks, timeRange, assets, marketData]);

  const addAsset = (symbol) => {
    if (!selectedAssets.includes(symbol)) {
      setSelectedAssets([...selectedAssets, symbol]);
    }
    setIsAddingAsset(false);
  };

  const removeAsset = (symbol) => {
    setSelectedAssets(selectedAssets.filter((s) => s !== symbol));
  };

  const toggleBenchmark = (symbol) => {
    if (benchmarks.includes(symbol)) {
      setBenchmarks(benchmarks.filter((b) => b !== symbol));
    } else {
      setBenchmarks([...benchmarks, symbol]);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          Performance Comparison
        </h3>
        <div className="flex gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="block pl-3 pr-8 py-1 text-base border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-700"
          >
            <option value="1m">1 Month</option>
            <option value="3m">3 Months</option>
            <option value="1y">1 Year</option>
          </select>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedAssets.map((symbol, index) => (
            <div
              key={`asset-${symbol}`}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200"
            >
              {symbol}
              <button
                onClick={() => removeAsset(symbol)}
                className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-indigo-600 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800"
              >
                <FiX size={12} />
              </button>
            </div>
          ))}

          {availableAssets.length > 0 && (
            <button
              onClick={() => setIsAddingAsset(!isAddingAsset)}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <FiPlus size={14} className="mr-1" />
              Add Asset
            </button>
          )}
        </div>

        {isAddingAsset && (
          <div className="mt-2 p-2 border border-gray-200 dark:border-gray-700 rounded-md">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {availableAssets.map((asset) => (
                <button
                  key={`available-${asset.symbol}`}
                  onClick={() => addAsset(asset.symbol)}
                  className="px-3 py-1 text-xs text-left rounded-md bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  {asset.symbol} - {asset.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Compare with Benchmarks
        </h4>
        <div className="flex flex-wrap gap-2">
          {["SPY", "QQQ", "DIA", "BTC"].map((symbol) => (
            <button
              key={`benchmark-${symbol}`}
              onClick={() => toggleBenchmark(symbol)}
              className={`px-3 py-1 rounded-md text-xs font-medium ${
                benchmarks.includes(symbol)
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {symbol}
            </button>
          ))}
        </div>
      </div>

      <div className="h-80">
        {comparisonData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={comparisonData}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f0f0f0"
              />
              <XAxis
                dataKey="date"
                tickFormatter={(date) => {
                  const d = new Date(date);
                  return `${d.getMonth() + 1}/${d.getDate()}`;
                }}
                tick={{ fontSize: 12, fill: "#888" }}
              />
              <YAxis
                tickFormatter={(value) => `$${value.toFixed(2)}`}
                tick={{ fontSize: 12, fill: "#888" }}
                width={80}
              />
              <Tooltip
                formatter={(value, name) => [`$${value.toFixed(2)}`, name]}
                labelFormatter={(date) => {
                  const d = new Date(date);
                  return d.toLocaleDateString();
                }}
              />
              <Legend />
              {[...selectedAssets, ...benchmarks].map((symbol, index) => (
                <Line
                  key={symbol}
                  type="monotone"
                  dataKey={symbol}
                  stroke={COLORS[index % COLORS.length]}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
            {selectedAssets.length === 0 && benchmarks.length === 0
              ? "Select assets or benchmarks to compare"
              : "Loading comparison data..."}
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceComparisonTool;
