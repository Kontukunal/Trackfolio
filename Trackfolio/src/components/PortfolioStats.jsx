import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiTrendingUp, FiTrendingDown, FiPieChart } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";

const PortfolioStats = ({ assets, marketData }) => {
  const { theme, themeConfig } = useTheme();
  const [stats, setStats] = useState({
    totalValue: 0,
    totalCost: 0,
    totalGain: 0,
    gainPercentage: 0,
    bestPerformer: null,
    worstPerformer: null,
    allocation: [],
  });

  useEffect(() => {
    if (!assets || !marketData || Object.keys(marketData).length === 0) return;

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
            name: asset.name,
            gainPercent,
            gain,
          };
        }

        if (gainPercent < worstPerformer.gainPercent) {
          worstPerformer = {
            symbol: asset.symbol,
            name: asset.name,
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

    const totalGain = totalValue - totalCost;
    const gainPercentage = totalCost > 0 ? (totalGain / totalCost) * 100 : 0;

    setStats({
      totalValue,
      totalCost,
      totalGain,
      gainPercentage,
      bestPerformer,
      worstPerformer,
      allocation,
    });
  }, [assets, marketData]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Portfolio Value */}
      <motion.div
        whileHover={{ y: -5 }}
        className={`${themeConfig[theme].card} rounded-lg shadow-sm p-4`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3
              className={`text-sm font-medium ${themeConfig[theme].textSecondary}`}
            >
              Portfolio Value
            </h3>
            <p
              className={`text-2xl font-bold ${themeConfig[theme].textPrimary}`}
            >
              $
              {stats.totalValue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
          <div
            className={`p-3 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300`}
          >
            <FiPieChart size={20} />
          </div>
        </div>
      </motion.div>

      {/* Total Gain/Loss */}
      <motion.div
        whileHover={{ y: -5 }}
        className={`rounded-lg shadow-sm p-4 ${
          stats.totalGain >= 0
            ? "bg-green-50 dark:bg-green-900 border-green-100 dark:border-green-800"
            : "bg-red-50 dark:bg-red-900 border-red-100 dark:border-red-800"
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3
              className={`text-sm font-medium ${
                stats.totalGain >= 0
                  ? "text-green-600 dark:text-green-300"
                  : "text-red-600 dark:text-red-300"
              }`}
            >
              Total {stats.totalGain >= 0 ? "Gain" : "Loss"}
            </h3>
            <p
              className={`text-2xl font-bold ${
                stats.totalGain >= 0
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {stats.totalGain >= 0 ? "+" : ""}$
              {Math.abs(stats.totalGain).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
              <span className="text-sm ml-2">
                ({stats.gainPercentage >= 0 ? "+" : ""}
                {stats.gainPercentage.toFixed(2)}%)
              </span>
            </p>
          </div>
          <div
            className={`p-3 rounded-full ${
              stats.totalGain >= 0
                ? "bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300"
                : "bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-300"
            }`}
          >
            {stats.totalGain >= 0 ? (
              <FiTrendingUp size={20} />
            ) : (
              <FiTrendingDown size={20} />
            )}
          </div>
        </div>
      </motion.div>

      {/* Best Performer */}
      {stats.bestPerformer && (
        <motion.div
          whileHover={{ y: -5 }}
          className="bg-green-50 dark:bg-green-900 rounded-lg shadow-sm p-4 border border-green-100 dark:border-green-800"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-green-600 dark:text-green-300">
                Best Performer
              </h3>
              <p
                className={`text-lg font-bold ${themeConfig[theme].textPrimary}`}
              >
                {stats.bestPerformer.symbol}
              </p>
              <p className="text-green-600 dark:text-green-400">
                +{stats.bestPerformer.gainPercent.toFixed(2)}%
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300">
              <FiTrendingUp size={20} />
            </div>
          </div>
        </motion.div>
      )}

      {/* Worst Performer */}
      {stats.worstPerformer && (
        <motion.div
          whileHover={{ y: -5 }}
          className="bg-red-50 dark:bg-red-900 rounded-lg shadow-sm p-4 border border-red-100 dark:border-red-800"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-red-600 dark:text-red-300">
                Worst Performer
              </h3>
              <p
                className={`text-lg font-bold ${themeConfig[theme].textPrimary}`}
              >
                {stats.worstPerformer.symbol}
              </p>
              <p className="text-red-600 dark:text-red-400">
                {stats.worstPerformer.gainPercent.toFixed(2)}%
              </p>
            </div>
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-300">
              <FiTrendingDown size={20} />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PortfolioStats;
