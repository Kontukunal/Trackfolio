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
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { FiX, FiPlus } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
];

const PerformanceComparison = () => {
  const { theme, themeConfig } = useTheme();
  const { currentUser } = useAuth();
  const [assets, setAssets] = useState([]);
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [benchmarks, setBenchmarks] = useState(["SPY", "QQQ"]);
  const [timeRange, setTimeRange] = useState("1M");
  const [comparisonData, setComparisonData] = useState([]);
  const [showAssetSelector, setShowAssetSelector] = useState(false);

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

  useEffect(() => {
    const generateComparisonData = () => {
      const days = timeRange === "1W" ? 7 : timeRange === "1M" ? 30 : 90;
      const data = [];

      for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(date.getDate() - (days - i));

        const entry = { date: date.toLocaleDateString() };

        // Add selected assets
        selectedAssets.forEach((asset) => {
          const basePrice = asset.averageCost;
          const randomFactor = 1 + (Math.random() * 0.1 - 0.05);
          entry[asset.symbol] = basePrice * randomFactor;
        });

        // Add benchmarks
        benchmarks.forEach((benchmark) => {
          const basePrice =
            benchmark === "SPY" ? 415 : benchmark === "QQQ" ? 350 : 340;
          const randomFactor = 1 + (Math.random() * 0.05 - 0.025);
          entry[benchmark] = basePrice * randomFactor;
        });

        data.push(entry);
      }

      return data;
    };

    setComparisonData(generateComparisonData());
  }, [selectedAssets, benchmarks, timeRange]);

  const handleAddAsset = (asset) => {
    if (!selectedAssets.some((a) => a.id === asset.id)) {
      setSelectedAssets([...selectedAssets, asset]);
    }
    setShowAssetSelector(false);
  };

  const handleRemoveAsset = (assetId) => {
    setSelectedAssets(selectedAssets.filter((asset) => asset.id !== assetId));
  };

  const handleToggleBenchmark = (benchmark) => {
    if (benchmarks.includes(benchmark)) {
      setBenchmarks(benchmarks.filter((b) => b !== benchmark));
    } else {
      setBenchmarks([...benchmarks, benchmark]);
    }
  };

  return (
    <div className={`${themeConfig[theme].card} rounded-lg shadow-sm p-6`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-xl font-bold ${themeConfig[theme].textPrimary}`}>
          Performance Comparison
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

      <div className="mb-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedAssets.map((asset, index) => (
            <motion.div
              key={asset.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-3 py-1 rounded-full text-sm"
            >
              {asset.symbol}
              <button
                onClick={() => handleRemoveAsset(asset.id)}
                className="ml-2 text-indigo-600 dark:text-indigo-300 hover:text-indigo-800 dark:hover:text-indigo-100"
              >
                <FiX size={14} />
              </button>
            </motion.div>
          ))}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAssetSelector(!showAssetSelector)}
            className={`flex items-center ${themeConfig[theme].buttonSecondary} px-3 py-1 rounded-full text-sm`}
          >
            <FiPlus size={14} className="mr-1" />
            Add Asset
          </motion.button>
        </div>

        <div className="flex flex-wrap gap-2">
          {["SPY", "QQQ", "DIA"].map((benchmark) => (
            <button
              key={benchmark}
              onClick={() => handleToggleBenchmark(benchmark)}
              className={`px-3 py-1 rounded-full text-sm ${
                benchmarks.includes(benchmark)
                  ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                  : `${themeConfig[theme].bgTertiary} ${themeConfig[theme].textSecondary}`
              }`}
            >
              {benchmark}
            </button>
          ))}
        </div>
      </div>

      {showAssetSelector && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className={`${themeConfig[theme].card} mb-6 p-4 rounded-lg shadow-sm overflow-hidden`}
        >
          <h3
            className={`text-md font-medium ${themeConfig[theme].textPrimary} mb-3`}
          >
            Select Assets to Compare
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {assets
              .filter((asset) => !selectedAssets.some((a) => a.id === asset.id))
              .map((asset) => (
                <button
                  key={asset.id}
                  onClick={() => handleAddAsset(asset)}
                  className={`px-3 py-2 ${themeConfig[theme].buttonSecondary} rounded-md text-sm`}
                >
                  {asset.symbol}
                </button>
              ))}
          </div>
        </motion.div>
      )}

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={comparisonData}>
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
              tickFormatter={(value) => `$${value.toFixed(2)}`}
              tick={{
                fontSize: 12,
                fill: theme === "dark" ? "#9CA3AF" : "#6B7280",
              }}
              stroke={theme === "dark" ? "#6B7280" : "#D1D5DB"}
            />
            <Tooltip
              formatter={(value, name) => [`$${value.toFixed(2)}`, name]}
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
            <Legend
              wrapperStyle={{
                color: theme === "dark" ? "#F3F4F6" : "#111827",
              }}
            />

            {selectedAssets.map((asset, index) => (
              <Line
                key={`asset-${asset.id}`}
                type="monotone"
                dataKey={asset.symbol}
                stroke={COLORS[index % COLORS.length]}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
            ))}

            {benchmarks.map((benchmark, index) => (
              <Line
                key={`benchmark-${benchmark}`}
                type="monotone"
                dataKey={benchmark}
                stroke={COLORS[(selectedAssets.length + index) % COLORS.length]}
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PerformanceComparison;
