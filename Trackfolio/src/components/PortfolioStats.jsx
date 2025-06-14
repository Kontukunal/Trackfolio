// src/components/PortfolioStats.jsx
import { useEffect, useState } from "react";
import PortfolioSummary from "./PortfolioSummary";
import AssetAllocationChart from "./AssetAllocationChart";

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
