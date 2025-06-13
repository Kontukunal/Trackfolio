// src/components/RebalancingTool.jsx
import { useState, useEffect } from "react";
import { FiRefreshCw } from "react-icons/fi";

const RebalancingTool = ({ assets, marketData }) => {
  const [targetAllocation, setTargetAllocation] = useState({});
  const [currentAllocation, setCurrentAllocation] = useState({});
  const [totalValue, setTotalValue] = useState(0);
  const [suggestedActions, setSuggestedActions] = useState([]);

  useEffect(() => {
    if (!assets || !marketData) return;

    // Calculate current allocation
    const newTotalValue = assets.reduce((sum, asset) => {
      return sum + (marketData[asset.symbol]?.price || 0) * asset.amount;
    }, 0);

    setTotalValue(newTotalValue);

    const allocation = {};
    assets.forEach((asset) => {
      const assetValue = (marketData[asset.symbol]?.price || 0) * asset.amount;
      allocation[asset.symbol] = {
        currentPercent: (assetValue / newTotalValue) * 100,
        currentValue: assetValue,
        amount: asset.amount,
      };
    });

    setCurrentAllocation(allocation);
  }, [assets, marketData]);

  const handleTargetChange = (symbol, value) => {
    setTargetAllocation((prev) => ({
      ...prev,
      [symbol]: parseFloat(value) || 0,
    }));
  };

  const calculateRebalance = () => {
    if (totalValue <= 0) return;

    const actions = [];
    const remainingAssets = { ...currentAllocation };
    let remainingPercentage = 100;

    // Calculate suggested actions
    Object.keys(targetAllocation).forEach((symbol) => {
      if (targetAllocation[symbol] > 0) {
        const targetValue = (targetAllocation[symbol] / 100) * totalValue;
        const currentValue = currentAllocation[symbol]?.currentValue || 0;
        const difference = targetValue - currentValue;
        const price = marketData[symbol]?.price || 1;

        if (Math.abs(difference) > 1) {
          // Only suggest actions for > $1 difference
          actions.push({
            symbol,
            action: difference > 0 ? "BUY" : "SELL",
            amount: Math.abs(difference / price).toFixed(4),
            value: Math.abs(difference),
            currentPercent: currentAllocation[symbol]?.currentPercent || 0,
            targetPercent: targetAllocation[symbol],
          });
        }

        remainingPercentage -= targetAllocation[symbol];
        delete remainingAssets[symbol];
      }
    });

    // Distribute remaining percentage to other assets
    Object.keys(remainingAssets).forEach((symbol) => {
      const targetValue = (remainingPercentage / 100) * totalValue;
      const currentValue = remainingAssets[symbol].currentValue;
      const difference = targetValue - currentValue;
      const price = marketData[symbol]?.price || 1;

      if (Math.abs(difference) > 1) {
        actions.push({
          symbol,
          action: difference > 0 ? "BUY" : "SELL",
          amount: Math.abs(difference / price).toFixed(4),
          value: Math.abs(difference),
          currentPercent: remainingAssets[symbol].currentPercent,
          targetPercent:
            remainingPercentage / Object.keys(remainingAssets).length,
        });
      }
    });

    setSuggestedActions(actions);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        Portfolio Rebalancing Tool
      </h3>

      <div className="space-y-6">
        <div>
          <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
            Set Target Allocation (%)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assets.map((asset) => (
              <div key={asset.symbol} className="flex items-center space-x-2">
                <label className="w-24 text-gray-700 dark:text-gray-300">
                  {asset.symbol}:
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={targetAllocation[asset.symbol] || ""}
                  onChange={(e) =>
                    handleTargetChange(asset.symbol, e.target.value)
                  }
                  className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                />
                <span className="text-gray-500">%</span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={calculateRebalance}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
        >
          <FiRefreshCw />
          <span>Calculate Rebalance</span>
        </button>

        {suggestedActions.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
              Suggested Actions
            </h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Asset
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Action
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Value
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Allocation
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {suggestedActions.map((action, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {action.symbol}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            action.action === "BUY"
                              ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                              : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                          }`}
                        >
                          {action.action}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {action.amount}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        ${action.value.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {action.currentPercent.toFixed(1)}% →{" "}
                        {action.targetPercent.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RebalancingTool;
