// src/components/PortfolioSummary.jsx
import { motion } from "framer-motion";

const PortfolioSummary = ({ data = {}, marketData = {} }) => {
  // Provide default values for all required properties
  const {
    totalValue = 0,
    dayChange = 0,
    dayChangePercent = 0,
    overallGain = 0,
    overallGainPercent = 0,
  } = data;

  // Get top performer from market data
  const topPerformer = marketData
    ? Object.values(marketData).reduce(
        (top, current) =>
          !top ||
          current.price_change_percentage_24h > top.price_change_percentage_24h
            ? current
            : top,
        null
      )
    : null;

  const summaryItems = [
    {
      title: "Total Value",
      value: `$${totalValue.toLocaleString()}`,
      change: null,
      icon: (
        <svg
          className="w-6 h-6 text-indigo-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      title: "Today's Change",
      value: `$${dayChange.toLocaleString()}`,
      change: dayChangePercent,
      icon: (
        <svg
          className="w-6 h-6 text-blue-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      ),
    },
    {
      title: "Overall Gain",
      value: `$${overallGain.toLocaleString()}`,
      change: overallGainPercent,
      icon: (
        <svg
          className="w-6 h-6 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z"
          />
        </svg>
      ),
    },
    {
      title: "Top Performer",
      value: topPerformer
        ? `${topPerformer.symbol?.toUpperCase()} $${
            topPerformer.current_price?.toFixed(2) || "N/A"
          }`
        : "Loading...",
      change: topPerformer?.price_change_percentage_24h,
      icon: (
        <svg
          className="w-6 h-6 text-yellow-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {summaryItems.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700"
        >
          <div className="flex justify-between">
            <div>
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                {item.title}
              </h3>
              <p className="text-2xl font-bold mt-2 dark:text-white">
                {item.value}
              </p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700">
              {item.icon}
            </div>
          </div>

          {item.change !== null && (
            <div className="mt-4 flex items-center">
              <span
                className={`text-sm ${
                  item.change >= 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {item.change >= 0 ? "↑" : "↓"} {Math.abs(item.change)}%
              </span>
              <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">
                vs yesterday
              </span>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default PortfolioSummary;

