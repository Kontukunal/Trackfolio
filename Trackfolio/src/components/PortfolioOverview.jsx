import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import { useMarketData } from "../hooks/useMarketData";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useTheme } from "../context/ThemeContext";

const COLORS = [
  "#0088FE", // Blue
  "#00C49F", // Teal
  "#FFBB28", // Yellow
  "#FF8042", // Orange
  "#8884D8", // Purple
  "#82CA9D", // Green
];

const PortfolioOverview = () => {
  const { theme } = useTheme();
  const { currentUser } = useAuth();
  const [assets, setAssets] = useState([]);
  const [timeRange, setTimeRange] = useState("1M");
  const [selectedAsset, setSelectedAsset] = useState(null);
  const { marketData } = useMarketData([
    "SPY",
    "QQQ",
    "DIA",
    "GLD",
    "BTC",
    "ETH",
  ]);

  // Custom theme configurations
  const themeConfig = {
    light: {
      card: "bg-white shadow-lg border border-gray-100",
      textPrimary: "text-gray-800",
      textSecondary: "text-gray-600",
      chartBg: "bg-gray-50",
      accent: "bg-indigo-600",
      bgTertiary: "bg-gray-100",
      tooltipBg: "bg-white",
      tooltipBorder: "border-gray-200",
      gridColor: "#E5E7EB",
      axisColor: "#D1D5DB",
      textColor: "#6B7280",
    },
    dark: {
      card: "bg-gray-800 shadow-lg border border-gray-700",
      textPrimary: "text-white",
      textSecondary: "text-gray-300",
      chartBg: "bg-gray-700",
      accent: "bg-indigo-500",
      bgTertiary: "bg-gray-600",
      tooltipBg: "bg-gray-700",
      tooltipBorder: "border-gray-600",
      gridColor: "#4B5563",
      axisColor: "#6B7280",
      textColor: "#9CA3AF",
    },
  };

  const currentTheme = themeConfig[theme];

  useEffect(() => {
    const fetchAssets = async () => {
      if (!currentUser) return;

      try {
        const querySnapshot = await getDocs(
          collection(db, "users", currentUser.uid, "assets")
        );
        const assetsData = [];
        querySnapshot.forEach((doc) => {
          assetsData.push({ id: doc.id, ...doc.data() });
        });
        setAssets(assetsData);
      } catch (error) {
        console.error("Error fetching assets:", error);
      }
    };

    fetchAssets();
  }, [currentUser]);

  // Generate portfolio allocation data
  const allocationData = assets.reduce((acc, asset) => {
    if (marketData[asset.symbol]) {
      const currentValue = asset.amount * marketData[asset.symbol].price;
      const existingType = acc.find((item) => item.name === asset.type);

      if (existingType) {
        existingType.value += currentValue;
      } else {
        acc.push({ name: asset.type, value: currentValue });
      }
    }
    return acc;
  }, []);

  // Generate performance data (simplified - in real app, fetch from API)
  const generatePerformanceData = () => {
    const days = timeRange === "1W" ? 7 : timeRange === "1M" ? 30 : 90;
    return Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - i));

      // Simplified calculation - in real app, use actual historical data
      const totalValue = assets.reduce((sum, asset) => {
        if (marketData[asset.symbol]) {
          const basePrice = marketData[asset.symbol].price;
          const randomFactor = 1 + (Math.random() * 0.1 - 0.05);
          return sum + asset.amount * basePrice * randomFactor;
        }
        return sum;
      }, 0);

      return {
        date: date.toLocaleDateString(),
        value: totalValue,
      };
    });
  };

  const performanceData = generatePerformanceData();

  return (
    <div className={`${currentTheme.card} rounded-xl p-6 mb-6`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-2xl font-bold ${currentTheme.textPrimary}`}>
          Portfolio Overview
        </h2>
        <div className="flex space-x-2">
          {["1W", "1M", "3M"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${
                timeRange === range
                  ? `${currentTheme.accent} text-white shadow-md`
                  : `${currentTheme.bgTertiary} ${currentTheme.textSecondary} hover:bg-opacity-80`
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Allocation Chart */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`${currentTheme.chartBg} p-4 rounded-lg border ${
            theme === "light" ? "border-gray-200" : "border-gray-600"
          }`}
        >
          <h3
            className={`text-lg font-semibold ${currentTheme.textPrimary} mb-4`}
          >
            Asset Allocation
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  onMouseEnter={(data) => setSelectedAsset(data)}
                >
                  {allocationData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`$${value.toLocaleString()}`, "Value"]}
                  contentStyle={{
                    backgroundColor: currentTheme.tooltipBg,
                    borderColor: currentTheme.tooltipBorder,
                    borderRadius: "0.5rem",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  }}
                  itemStyle={{
                    color: currentTheme.textPrimary,
                    fontWeight: 500,
                  }}
                />
                <Legend
                  wrapperStyle={{
                    color: currentTheme.textPrimary,
                    paddingTop: "20px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Performance Chart */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.1 } }}
          className={`${currentTheme.chartBg} p-4 rounded-lg border ${
            theme === "light" ? "border-gray-200" : "border-gray-600"
          }`}
        >
          <h3
            className={`text-lg font-semibold ${currentTheme.textPrimary} mb-4`}
          >
            Portfolio Performance
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={currentTheme.gridColor}
                />
                <XAxis
                  dataKey="date"
                  tick={{
                    fontSize: 12,
                    fill: currentTheme.textColor,
                  }}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return timeRange === "1W"
                      ? date.toLocaleDateString("en-US", { weekday: "short" })
                      : date.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        });
                  }}
                  stroke={currentTheme.axisColor}
                />
                <YAxis
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                  tick={{
                    fontSize: 12,
                    fill: currentTheme.textColor,
                  }}
                  stroke={currentTheme.axisColor}
                />
                <Tooltip
                  formatter={(value) => [
                    `$${value.toLocaleString()}`,
                    "Portfolio Value",
                  ]}
                  labelFormatter={(label) => `Date: ${label}`}
                  contentStyle={{
                    backgroundColor: currentTheme.tooltipBg,
                    borderColor: currentTheme.tooltipBorder,
                    borderRadius: "0.5rem",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  }}
                  itemStyle={{
                    color: currentTheme.textPrimary,
                    fontWeight: 500,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{
                    r: 6,
                    stroke: currentTheme.tooltipBg,
                    strokeWidth: 2,
                    fill: "#8884d8",
                  }}
                />
                <ReferenceLine
                  y={performanceData[0]?.value}
                  stroke="#82ca9d"
                  strokeDasharray="3 3"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Selected Asset Details */}
      {selectedAsset && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-6 ${currentTheme.chartBg} p-4 rounded-lg border ${
            theme === "light" ? "border-gray-200" : "border-gray-600"
          }`}
        >
          <h3
            className={`text-lg font-semibold ${currentTheme.textPrimary} mb-2`}
          >
            {selectedAsset.name} Details
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className={`text-sm ${currentTheme.textSecondary}`}>Value</p>
              <p className={`font-medium ${currentTheme.textPrimary}`}>
                ${selectedAsset.value.toLocaleString()}
              </p>
            </div>
            <div>
              <p className={`text-sm ${currentTheme.textSecondary}`}>
                Percentage
              </p>
              <p className={`font-medium ${currentTheme.textPrimary}`}>
                {(selectedAsset.percent * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PortfolioOverview;
