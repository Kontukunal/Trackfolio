// src/components/PortfolioStats.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FiTrendingUp,
  FiTrendingDown,
  FiDollarSign,
  FiPieChart,
} from "react-icons/fi";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const PortfolioSummary = ({ data = {}, marketData = {} }) => {
  const {
    totalValue = 0,
    totalGain = 0,
    bestPerformer = null,
    worstPerformer = null,
  } = data;

  const summaryItems = [
    {
      title: "Total Value",
      value: `$${totalValue.toLocaleString(undefined, {
        maximumFractionDigits: 2,
      })}`,
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
      title: "Total Gain/Loss",
      value: `${totalGain >= 0 ? "+" : ""}$${Math.abs(totalGain).toLocaleString(
        undefined,
        {
          maximumFractionDigits: 2,
        }
      )}`,
      change: totalValue > 0 ? (totalGain / totalValue) * 100 : 0,
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
      title: "Best Performer",
      value: bestPerformer
        ? `${bestPerformer.symbol} ${
            bestPerformer.gainPercent
              ? `+${bestPerformer.gainPercent.toFixed(2)}%`
              : ""
          }`
        : "--",
      change: bestPerformer?.gainPercent,
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
    {
      title: "Worst Performer",
      value: worstPerformer
        ? `${worstPerformer.symbol} ${
            worstPerformer.gainPercent
              ? `${worstPerformer.gainPercent.toFixed(2)}%`
              : ""
          }`
        : "--",
      change: worstPerformer?.gainPercent,
      icon: (
        <svg
          className="w-6 h-6 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
                {item.change >= 0 ? "↑" : "↓"}{" "}
                {Math.abs(item.change).toFixed(2)}%
              </span>
              <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">
                {item.title.includes("Performer") ? "total change" : ""}
              </span>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

const AssetAllocationChart = ({ data = [], isLoading = false }) => {
  const COLORS = ["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B", "#6B7280"];

  if (isLoading) {
    return (
      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg h-full">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-gray-700 dark:text-gray-300">
            Asset Allocation
          </h4>
          <FiPieChart className="text-gray-400" />
        </div>
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg h-full">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-gray-700 dark:text-gray-300">
            Asset Allocation
          </h4>
          <FiPieChart className="text-gray-400" />
        </div>
        <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
          No allocation data available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg h-full">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-gray-700 dark:text-gray-300">
          Asset Allocation
        </h4>
        <FiPieChart className="text-gray-400" />
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`$${value.toLocaleString()}`, "Value"]}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const PortfolioStats = ({ assets, marketData }) => {
  const [stats, setStats] = useState({
    totalValue: 0,
    totalGain: 0,
    bestPerformer: null,
    worstPerformer: null,
    allocation: [],
  });

  useEffect(() => {
    if (!assets || !marketData) return;

    let totalValue = 0;
    let totalCost = 0;
    let bestPerformer = { gainPercent: -Infinity };
    let worstPerformer = { gainPercent: Infinity };
    const allocationMap = {};

    assets.forEach((asset) => {
      if (marketData[asset.symbol]) {
        const currentValue = asset.amount * marketData[asset.symbol].price;
        const costBasis = asset.amount * asset.averageCost;
        const gain = currentValue - costBasis;
        const gainPercent = costBasis > 0 ? (gain / costBasis) * 100 : 0;

        totalValue += currentValue;
        totalCost += costBasis;

        if (gainPercent > bestPerformer.gainPercent) {
          bestPerformer = {
            symbol: asset.symbol,
            gainPercent,
            gain,
          };
        }

        if (gainPercent < worstPerformer.gainPercent) {
          worstPerformer = {
            symbol: asset.symbol,
            gainPercent,
            gain,
          };
        }

        if (!allocationMap[asset.type]) {
          allocationMap[asset.type] = 0;
        }
        allocationMap[asset.type] += currentValue;
      }
    });

    const allocation = Object.keys(allocationMap).map((type) => ({
      name: type,
      value: allocationMap[type],
    }));

    setStats({
      totalValue,
      totalGain: totalValue - totalCost,
      bestPerformer,
      worstPerformer,
      allocation,
    });
  }, [assets, marketData]);

  return (
    <div>
      <PortfolioSummary data={stats} marketData={marketData} />

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Portfolio Statistics
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AssetAllocationChart data={stats.allocation} />
        </div>
      </div>
    </div>
  );
};

export default PortfolioStats;
