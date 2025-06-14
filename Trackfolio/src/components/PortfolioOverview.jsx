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
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
];

const PortfolioOverview = () => {
  const { theme, themeConfig } = useTheme();
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
  const [historicalData, setHistoricalData] = useState([]);

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
    <div className={`${themeConfig[theme].card} rounded-lg shadow-sm p-6`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-xl font-bold ${themeConfig[theme].textPrimary}`}>
          Portfolio Overview
        </h2>
        <div className="flex space-x-2">
          {["1W", "1M", "3M"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-md text-sm ${
                timeRange === range
                  ? `${themeConfig[theme].accent} text-white`
                  : `${themeConfig[theme].bgTertiary} ${themeConfig[theme].textSecondary}`
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Allocation Chart */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`${themeConfig[theme].chartBg} p-4 rounded-lg`}
        >
          <h3
            className={`text-lg font-medium ${themeConfig[theme].textPrimary} mb-4`}
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
                    backgroundColor: theme === "dark" ? "#1F2937" : "#FFFFFF",
                    borderColor: theme === "dark" ? "#374151" : "#E5E7EB",
                    borderRadius: "0.5rem",
                  }}
                  itemStyle={{
                    color: theme === "dark" ? "#F3F4F6" : "#111827",
                  }}
                />
                <Legend
                  wrapperStyle={{
                    color: theme === "dark" ? "#F3F4F6" : "#111827",
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
          className={`${themeConfig[theme].chartBg} p-4 rounded-lg`}
        >
          <h3
            className={`text-lg font-medium ${themeConfig[theme].textPrimary} mb-4`}
          >
            Portfolio Performance
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={theme === "dark" ? "#4B5563" : "#E5E7EB"}
                />
                <XAxis
                  dataKey="date"
                  tick={{
                    fontSize: 12,
                    fill: theme === "dark" ? "#9CA3AF" : "#6B7280",
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
                  stroke={theme === "dark" ? "#6B7280" : "#D1D5DB"}
                />
                <YAxis
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                  tick={{
                    fontSize: 12,
                    fill: theme === "dark" ? "#9CA3AF" : "#6B7280",
                  }}
                  stroke={theme === "dark" ? "#6B7280" : "#D1D5DB"}
                />
                <Tooltip
                  formatter={(value) => [
                    `$${value.toLocaleString()}`,
                    "Portfolio Value",
                  ]}
                  labelFormatter={(label) => `Date: ${label}`}
                  contentStyle={{
                    backgroundColor: theme === "dark" ? "#1F2937" : "#FFFFFF",
                    borderColor: theme === "dark" ? "#374151" : "#E5E7EB",
                    borderRadius: "0.5rem",
                  }}
                  itemStyle={{
                    color: theme === "dark" ? "#F3F4F6" : "#111827",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
                <ReferenceLine y={performanceData[0]?.value} stroke="#82ca9d" />
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
          className={`mt-6 ${themeConfig[theme].chartBg} p-4 rounded-lg`}
        >
          <h3
            className={`text-lg font-medium ${themeConfig[theme].textPrimary} mb-2`}
          >
            {selectedAsset.name} Details
          </h3>
          <p className={themeConfig[theme].textSecondary}>
            Value: ${selectedAsset.value.toLocaleString()}
          </p>
          <p className={themeConfig[theme].textSecondary}>
            Percentage: {(selectedAsset.percent * 100).toFixed(1)}%
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default PortfolioOverview;
