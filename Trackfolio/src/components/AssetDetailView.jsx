import { motion } from "framer-motion";
import { FiX, FiEdit, FiTrash2 } from "react-icons/fi";
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
import { format } from "date-fns";
import { useTheme } from "../context/ThemeContext";

const AssetDetailView = ({ asset, marketData, onClose, onEdit, onDelete }) => {
  const { theme, themeConfig } = useTheme();

  // Calculate current value and gain/loss
  const currentValue = marketData ? asset.amount * marketData.price : 0;
  const costBasis = asset.amount * asset.averageCost;
  const gainLoss = currentValue - costBasis;
  const gainLossPercent = costBasis > 0 ? (gainLoss / costBasis) * 100 : 0;

  // Generate historical data for the chart
  const generateHistoricalData = () => {
    const months = 6;
    const data = [];
    const today = new Date();

    // Helper function to get random price movement
    const getRandomPrice = (basePrice, volatility) => {
      const changePercent = Math.random() * volatility * 2 - volatility;
      return basePrice * (1 + changePercent / 100);
    };

    // Start from current price or market price if available
    let lastPrice = marketData?.price || asset.averageCost;

    for (let i = months; i >= 0; i--) {
      const date = new Date(today);
      date.setMonth(date.getMonth() - i);

      // Generate price with some random movement (5% volatility)
      const price = i === 0 ? lastPrice : getRandomPrice(lastPrice, 5);
      lastPrice = price;

      data.push({
        date: format(date, "MMM yyyy"),
        price: parseFloat(price.toFixed(2)),
        volume: Math.floor(Math.random() * 10000) + 5000,
      });
    }

    return data;
  };

  const historicalData = generateHistoricalData();

  // Calculate annualized return if we have purchase date
  const calculateAnnualizedReturn = () => {
    if (!asset.purchaseDate) return 0;

    const purchaseDate = new Date(asset.purchaseDate);
    const today = new Date();
    const years = (today - purchaseDate) / (1000 * 60 * 60 * 24 * 365);

    if (years <= 0) return 0;

    const annualizedReturn =
      (Math.pow(1 + gainLossPercent / 100, 1 / years) - 1) * 100;
    return annualizedReturn;
  };

  const annualizedReturn = calculateAnnualizedReturn();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className={`${themeConfig[theme].card} rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border ${themeConfig[theme].borderPrimary}`}
      >
        <div
          className={`sticky top-0 ${themeConfig[theme].bgPrimary} p-4 border-b ${themeConfig[theme].borderPrimary} flex justify-between items-center z-10`}
        >
          <h2 className={`text-xl font-bold ${themeConfig[theme].textPrimary}`}>
            {asset.name} ({asset.symbol})
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={onEdit}
              className={`p-2 ${
                theme === "light"
                  ? "text-indigo-600 hover:bg-indigo-50"
                  : "text-indigo-400 hover:bg-gray-700"
              } rounded-full`}
              aria-label="Edit asset"
            >
              <FiEdit size={20} />
            </button>
            <button
              onClick={() => {
                if (
                  window.confirm(
                    `Are you sure you want to delete ${asset.symbol} from your portfolio?`
                  )
                ) {
                  onDelete();
                }
              }}
              className={`p-2 ${
                theme === "light"
                  ? "text-red-600 hover:bg-red-50"
                  : "text-red-400 hover:bg-gray-700"
              } rounded-full`}
              aria-label="Delete asset"
            >
              <FiTrash2 size={20} />
            </button>
            <button
              onClick={onClose}
              className={`p-2 ${
                theme === "light"
                  ? "text-gray-500 hover:bg-gray-100"
                  : "text-gray-400 hover:bg-gray-700"
              } rounded-full`}
              aria-label="Close details"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              className={`${themeConfig[theme].chartBg} p-4 rounded-lg border ${themeConfig[theme].borderPrimary}`}
            >
              <h3
                className={`text-sm font-medium ${themeConfig[theme].textSecondary}`}
              >
                Current Value
              </h3>
              <p
                className={`text-2xl font-bold mt-1 ${themeConfig[theme].textPrimary}`}
              >
                $
                {currentValue.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </p>
              <p className={`text-sm ${themeConfig[theme].textTertiary} mt-1`}>
                {asset.amount} shares × $
                {marketData?.price.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            <div
              className={`${themeConfig[theme].chartBg} p-4 rounded-lg border ${themeConfig[theme].borderPrimary}`}
            >
              <h3
                className={`text-sm font-medium ${themeConfig[theme].textSecondary}`}
              >
                Gain/Loss
              </h3>
              <p
                className={`text-2xl font-bold mt-1 ${
                  gainLoss >= 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {gainLoss >= 0 ? "+" : ""}$
                {Math.abs(gainLoss).toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </p>
              <p
                className={`text-sm ${
                  gainLossPercent >= 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {gainLossPercent >= 0 ? "+" : ""}
                {Math.abs(gainLossPercent).toFixed(2)}%
              </p>
            </div>
            <div
              className={`${themeConfig[theme].chartBg} p-4 rounded-lg border ${themeConfig[theme].borderPrimary}`}
            >
              <h3
                className={`text-sm font-medium ${themeConfig[theme].textSecondary}`}
              >
                Investment
              </h3>
              <p
                className={`text-xl font-bold mt-1 ${themeConfig[theme].textPrimary}`}
              >
                $
                {costBasis.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </p>
              <p className={`text-sm ${themeConfig[theme].textTertiary} mt-1`}>
                $
                {asset.averageCost.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}{" "}
                avg cost
              </p>
            </div>
          </div>

          <div
            className={`${themeConfig[theme].card} p-4 rounded-lg border ${themeConfig[theme].borderPrimary}`}
          >
            <h3
              className={`text-lg font-semibold ${themeConfig[theme].textPrimary} mb-4`}
            >
              Price History
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={theme === "dark" ? "#4B5563" : "#E5E7EB"}
                  />
                  <XAxis
                    dataKey="date"
                    stroke={theme === "dark" ? "#9CA3AF" : "#6B7280"}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    stroke={theme === "dark" ? "#9CA3AF" : "#6B7280"}
                    domain={["auto", "auto"]}
                    tickFormatter={(value) => `$${value}`}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(value, name) => [
                      name === "price" ? `$${value}` : value.toLocaleString(),
                      name === "price" ? "Price" : "Volume",
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
                  <Legend
                    wrapperStyle={{
                      color: theme === "dark" ? "#F3F4F6" : "#111827",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    activeDot={{ r: 6 }}
                    name="Price (USD)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              className={`${themeConfig[theme].chartBg} p-4 rounded-lg border ${themeConfig[theme].borderPrimary}`}
            >
              <h3
                className={`font-medium ${themeConfig[theme].textPrimary} mb-2`}
              >
                Asset Details
              </h3>
              <div className="space-y-3">
                <div>
                  <p className={`text-sm ${themeConfig[theme].textSecondary}`}>
                    Type
                  </p>
                  <p className={themeConfig[theme].textPrimary}>{asset.type}</p>
                </div>
                <div>
                  <p className={`text-sm ${themeConfig[theme].textSecondary}`}>
                    Quantity
                  </p>
                  <p className={themeConfig[theme].textPrimary}>
                    {asset.amount} shares
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${themeConfig[theme].textSecondary}`}>
                    Average Cost
                  </p>
                  <p className={themeConfig[theme].textPrimary}>
                    $
                    {asset.averageCost.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${themeConfig[theme].textSecondary}`}>
                    Purchase Date
                  </p>
                  <p className={themeConfig[theme].textPrimary}>
                    {asset.purchaseDate
                      ? format(new Date(asset.purchaseDate), "MMM d, yyyy")
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`${themeConfig[theme].chartBg} p-4 rounded-lg border ${themeConfig[theme].borderPrimary}`}
            >
              <h3
                className={`font-medium ${themeConfig[theme].textPrimary} mb-2`}
              >
                Performance
              </h3>
              <div className="space-y-3">
                <div>
                  <p className={`text-sm ${themeConfig[theme].textSecondary}`}>
                    Current Price
                  </p>
                  <p className={themeConfig[theme].textPrimary}>
                    $
                    {marketData?.price.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    }) || "N/A"}
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${themeConfig[theme].textSecondary}`}>
                    24h Change
                  </p>
                  <p
                    className={
                      marketData?.changePercent >= 0
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }
                  >
                    {marketData?.changePercent >= 0 ? "+" : ""}
                    {marketData?.changePercent?.toFixed(2) || 0}%
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${themeConfig[theme].textSecondary}`}>
                    Total Return
                  </p>
                  <p
                    className={
                      gainLossPercent >= 0
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }
                  >
                    {gainLossPercent >= 0 ? "+" : ""}
                    {gainLossPercent.toFixed(2)}%
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${themeConfig[theme].textSecondary}`}>
                    Annualized Return
                  </p>
                  <p
                    className={
                      annualizedReturn >= 0
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }
                  >
                    {annualizedReturn >= 0 ? "+" : ""}
                    {annualizedReturn.toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AssetDetailView;
