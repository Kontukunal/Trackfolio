// src/components/MarketOverview.jsx
import { motion } from "framer-motion";

const MarketOverview = ({ marketData }) => {
  const marketIndices = [
    { name: "S&P 500", symbol: "SPY" },
    { name: "NASDAQ", symbol: "QQQ" },
    { name: "DOW", symbol: "DIA" },
    { name: "Bitcoin", symbol: "BTC" },
    { name: "Ethereum", symbol: "ETH" },
    { name: "Gold", symbol: "GLD" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700"
    >
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        Market Overview
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {marketIndices.map((index) => (
          <div
            key={index.symbol}
            className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700"
          >
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {index.name}
            </h4>
            {marketData[index.symbol] ? (
              <>
                <p className="text-lg font-bold mt-1 dark:text-white">
                  $
                  {marketData[index.symbol].price.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </p>
                <p
                  className={`text-sm ${
                    marketData[index.symbol].changePercent >= 0
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {marketData[index.symbol].changePercent >= 0 ? "↑" : "↓"}{" "}
                  {Math.abs(marketData[index.symbol].changePercent).toFixed(2)}%
                </p>
              </>
            ) : (
              <div className="h-10 flex items-center">
                <div className="w-full h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default MarketOverview;
