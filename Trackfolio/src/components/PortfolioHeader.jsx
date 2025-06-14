// src/components/PortfolioHeader.jsx
import { motion } from "framer-motion";
import {
  FiDollarSign,
  FiTrendingUp,
  FiStar,
  FiTrendingDown,
} from "react-icons/fi";

const PortfolioHeader = ({ portfolioData }) => {
  const stats = [
    {
      title: "Total Value",
      value: `$${
        portfolioData?.totalValue?.toLocaleString(undefined, {
          maximumFractionDigits: 2,
        }) || "0"
      }`,
      icon: <FiDollarSign className="text-blue-500" size={20} />,
      change: portfolioData?.dayChangePercent,
      changeLabel: "vs yesterday",
    },
    {
      title: "Today's Change",
      value: `$${
        portfolioData?.dayChange?.toLocaleString(undefined, {
          maximumFractionDigits: 2,
        }) || "0"
      }`,
      icon:
        portfolioData?.dayChange >= 0 ? (
          <FiTrendingUp className="text-green-500" size={20} />
        ) : (
          <FiTrendingDown className="text-red-500" size={20} />
        ),
      change: portfolioData?.dayChangePercent,
      changeLabel: "vs yesterday",
    },
    {
      title: "Overall Gain",
      value: `$${
        portfolioData?.overallGain?.toLocaleString(undefined, {
          maximumFractionDigits: 2,
        }) || "0"
      }`,
      icon:
        portfolioData?.overallGain >= 0 ? (
          <FiTrendingUp className="text-purple-500" size={20} />
        ) : (
          <FiTrendingDown className="text-red-500" size={20} />
        ),
      change: portfolioData?.overallGainPercent,
      changeLabel: "vs initial",
    },
    {
      title: "Top Performer",
      value: `${portfolioData?.bestPerformer?.symbol || "--"} $${
        portfolioData?.bestPerformer?.price?.toFixed(2) || "N/A"
      }`,
      icon: <FiStar className="text-yellow-500" size={20} />,
      change: portfolioData?.bestPerformer?.changePercent,
      changeLabel: "today",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold mt-1 dark:text-white">
                  {stat.value}
                </p>
              </div>
              <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                {stat.icon}
              </div>
            </div>
            {stat.change !== undefined && (
              <div className="mt-3 flex items-center">
                <span
                  className={`text-sm ${
                    stat.change >= 0
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {stat.change >= 0 ? "↑" : "↓"}{" "}
                  {Math.abs(stat.change || 0).toFixed(2)}%
                </span>
                <span className="text-gray-500 dark:text-gray-400 text-xs ml-2">
                  {stat.changeLabel}
                </span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default PortfolioHeader;
