// src/components/AssetDetailView.jsx

import { motion } from "framer-motion";
import { FiX, FiEdit } from "react-icons/fi";
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

const AssetDetailView = ({ asset, marketData, onClose, onEdit }) => {
  // Mock historical data for the asset
  const historicalData = [
    { date: "2023-01-01", price: 120 },
    { date: "2023-02-01", price: 135 },
    { date: "2023-03-01", price: 145 },
    { date: "2023-04-01", price: 160 },
    { date: "2023-05-01", price: 175 },
    { date: "2023-06-01", price: marketData?.price || 180 },
  ];

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
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center z-10">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            {asset.name} ({asset.symbol})
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={onEdit}
              className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-700 rounded-full"
            >
              <FiEdit size={20} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                Current Price
              </h3>
              <p className="text-2xl font-bold mt-1 dark:text-white">
                ${marketData?.price.toLocaleString() || "N/A"}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                24h Change
              </h3>
              <p
                className={`text-2xl font-bold mt-1 ${
                  marketData?.changePercent >= 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {marketData?.changePercent >= 0 ? "+" : ""}
                {marketData?.changePercent}%
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                Your Holdings
              </h3>
              <p className="text-2xl font-bold mt-1 dark:text-white">
                {asset.amount} {asset.symbol}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Price History (6 Months)
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip
                    formatter={(value) => [`$${value}`, "Price"]}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Legend />
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
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="text-gray-800 dark:text-white font-medium mb-2">
                Asset Details
              </h3>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    Type:
                  </span>{" "}
                  <span className="dark:text-white">{asset.type}</span>
                </p>
                <p className="text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    Purchase Date:
                  </span>{" "}
                  <span className="dark:text-white">{asset.purchaseDate}</span>
                </p>
                <p className="text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    Average Cost:
                  </span>{" "}
                  <span className="dark:text-white">
                    ${asset.averageCost?.toLocaleString() || "N/A"}
                  </span>
                </p>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="text-gray-800 dark:text-white font-medium mb-2">
                Performance
              </h3>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    Total Return:
                  </span>{" "}
                  <span
                    className={
                      asset.totalReturn >= 0
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }
                  >
                    {asset.totalReturn >= 0 ? "+" : ""}
                    {asset.totalReturn}%
                  </span>
                </p>
                <p className="text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    Annualized Return:
                  </span>{" "}
                  <span
                    className={
                      asset.annualizedReturn >= 0
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }
                  >
                    {asset.annualizedReturn >= 0 ? "+" : ""}
                    {asset.annualizedReturn}%
                  </span>
                </p>
                <p className="text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    Dividend Yield:
                  </span>{" "}
                  <span className="dark:text-white">
                    {asset.dividendYield || 0}%
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AssetDetailView;
