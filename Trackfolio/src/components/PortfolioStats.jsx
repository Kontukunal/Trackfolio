// src/components/PortfolioStats.jsx
import { useEffect, useState } from "react";
import {
  FiTrendingUp,
  FiTrendingDown,
  FiDollarSign,
  FiPieChart,
} from "react-icons/fi";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

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

        // Group by asset type
        if (!allocationMap[asset.type]) {
          allocationMap[asset.type] = 0;
        }
        allocationMap[asset.type] += currentValue;
      }
    });

    const allocation = Object.keys(allocationMap).map((type) => ({
      name: type,
      value: allocationMap[type],
      color: getColorForType(type),
    }));

    setStats({
      totalValue,
      totalGain: totalValue - totalCost,
      bestPerformer,
      worstPerformer,
      allocation,
    });
  }, [assets, marketData]);

  const getColorForType = (type) => {
    const colors = {
      Stock: "#3B82F6",
      Crypto: "#8B5CF6",
      ETF: "#10B981",
      Bond: "#F59E0B",
      Other: "#6B7280",
    };
    return colors[type] || "#6B7280";
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        Portfolio Statistics
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <FiDollarSign
                    className="text-blue-600 dark:text-blue-400"
                    size={20}
                  />
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Total Value
                  </p>
                  <p className="text-xl font-bold dark:text-white">
                    $
                    {stats.totalValue.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <div
                  className={`p-3 rounded-full ${
                    stats.totalGain >= 0
                      ? "bg-green-100 dark:bg-green-900"
                      : "bg-red-100 dark:bg-red-900"
                  }`}
                >
                  {stats.totalGain >= 0 ? (
                    <FiTrendingUp
                      className="text-green-600 dark:text-green-400"
                      size={20}
                    />
                  ) : (
                    <FiTrendingDown
                      className="text-red-600 dark:text-red-400"
                      size={20}
                    />
                  )}
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Total Gain/Loss
                  </p>
                  <p
                    className={`text-xl font-bold ${
                      stats.totalGain >= 0
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {stats.totalGain >= 0 ? "+" : ""}$
                    {Math.abs(stats.totalGain).toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                  <FiTrendingUp
                    className="text-purple-600 dark:text-purple-400"
                    size={20}
                  />
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Best Performer
                  </p>
                  <div className="flex items-center">
                    <p className="text-xl font-bold dark:text-white mr-2">
                      {stats.bestPerformer?.symbol || "--"}
                    </p>
                    {stats.bestPerformer && (
                      <span className="text-green-600 dark:text-green-400 text-sm">
                        +{stats.bestPerformer.gainPercent.toFixed(2)}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-full">
                  <FiTrendingDown
                    className="text-orange-600 dark:bg-orange-400"
                    size={20}
                  />
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Worst Performer
                  </p>
                  <div className="flex items-center">
                    <p className="text-xl font-bold dark:text-white mr-2">
                      {stats.worstPerformer?.symbol || "--"}
                    </p>
                    {stats.worstPerformer && (
                      <span className="text-red-600 dark:text-red-400 text-sm">
                        {stats.worstPerformer.gainPercent.toFixed(2)}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg h-full">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-700 dark:text-gray-300">
              Asset Allocation
            </h4>
            <FiPieChart className="text-gray-400" />
          </div>
          <div className="h-64">
            {stats.allocation.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.allocation}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {stats.allocation.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [
                      `$${value.toLocaleString()}`,
                      "Value",
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                No allocation data available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioStats;
