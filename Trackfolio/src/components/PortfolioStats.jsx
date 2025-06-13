// src/components/PortfolioStats.jsx
import { useEffect, useState } from "react";
import { FiTrendingUp, FiTrendingDown, FiDollarSign } from "react-icons/fi";

const PortfolioStats = ({ assets, marketData }) => {
  const [stats, setStats] = useState({
    totalValue: 0,
    totalGain: 0,
    bestPerformer: null,
    worstPerformer: null,
  });

  useEffect(() => {
    if (!assets || !marketData) return;

    let totalValue = 0;
    let totalCost = 0;
    let bestPerformer = { gainPercent: -Infinity };
    let worstPerformer = { gainPercent: Infinity };

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
      }
    });

    setStats({
      totalValue,
      totalGain: totalValue - totalCost,
      bestPerformer,
      worstPerformer,
    });
  }, [assets, marketData]);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        Portfolio Statistics
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
              <FiTrendingUp
                className="text-green-600 dark:text-green-400"
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
            <div className="p-3 bg-red-100 dark:bg-red-900 rounded-full">
              <FiTrendingDown
                className="text-red-600 dark:text-red-400"
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
  );
};

export default PortfolioStats;
