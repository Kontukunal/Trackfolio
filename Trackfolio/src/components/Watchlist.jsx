// src/components/Watchlist.jsx
import { motion } from "framer-motion";

const Watchlist = ({ marketData }) => {
  const watchlistItems = [
    { symbol: "AAPL", name: "Apple Inc." },
    { symbol: "TSLA", name: "Tesla Inc." },
    { symbol: "GOOGL", name: "Alphabet Inc." },
    { symbol: "BTC", name: "Bitcoin" },
    { symbol: "ETH", name: "Ethereum" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700"
    >
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        Your Watchlist
      </h3>

      <div className="space-y-3">
        {watchlistItems.map((item) => (
          <div
            key={item.symbol}
            className="flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition"
          >
            <div>
              <h4 className="font-medium dark:text-white">{item.symbol}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {item.name}
              </p>
            </div>
            {marketData[item.symbol] ? (
              <div className="text-right">
                <p className="font-medium dark:text-white">
                  $
                  {marketData[item.symbol].price.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </p>
                <p
                  className={`text-sm ${
                    marketData[item.symbol].changePercent >= 0
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {marketData[item.symbol].changePercent >= 0 ? "↑" : "↓"}{" "}
                  {Math.abs(marketData[item.symbol].changePercent).toFixed(2)}%
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="w-20 h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                <div className="w-12 h-3 bg-gray-200 dark:bg-gray-600 rounded animate-pulse ml-auto"></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default Watchlist;
