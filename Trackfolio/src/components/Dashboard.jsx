// src/components/Dashboard.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PortfolioSummary from "./PortfolioSummary";
import PerformanceChart from "./PerformanceChart";
import AssetAllocationChart from "./AssetAllocationChart";
import RecentTransactions from "./RecentTransactions";
import MarketOverview from "./MarketOverview";
import Watchlist from "./Watchlist";
import { useMarketData } from "../hooks/useMarketData";

// Define mockPortfolioData outside the component
const mockPortfolioData = {
  summary: {
    totalValue: 12543.67,
    dayChange: 342.51,
    dayChangePercent: 2.81,
    overallGain: 2543.67,
    overallGainPercent: 25.44,
  },
  allocation: [
    { name: "Stocks", value: 7500, color: "bg-blue-500" },
    { name: "Cryptocurrency", value: 3500, color: "bg-purple-500" },
    { name: "Bonds", value: 1000, color: "bg-green-500" },
    { name: "Cash", value: 543.67, color: "bg-gray-500" },
  ],
  performance: {
    "1D": [12000, 12100, 12250, 12300, 12450, 12500, 12543.67],
    "1W": [11000, 11200, 11500, 11700, 11900, 12200, 12543.67],
    "1M": [10000, 10500, 10700, 11000, 11500, 12000, 12543.67],
    "3M": [9000, 9500, 10000, 10500, 11000, 11500, 12543.67],
    "1Y": [8000, 8500, 9000, 9500, 10000, 11000, 12543.67],
    ALL: [5000, 6000, 7000, 8000, 9000, 10000, 12543.67],
  },
  recentTransactions: [
    {
      id: 1,
      asset: "AAPL",
      type: "Buy",
      amount: 2,
      price: 175.25,
      date: "2023-05-15",
    },
    {
      id: 2,
      asset: "BTC",
      type: "Sell",
      amount: 0.1,
      price: 28500,
      date: "2023-05-14",
    },
    {
      id: 3,
      asset: "TSLA",
      type: "Buy",
      amount: 5,
      price: 165.75,
      date: "2023-05-12",
    },
    {
      id: 4,
      asset: "ETH",
      type: "Buy",
      amount: 1,
      price: 1800,
      date: "2023-05-10",
    },
  ],
};

const Dashboard = () => {
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("1M");
  const { marketData } = useMarketData(["AAPL", "BTC", "ETH", "SPY"]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API fetch
        setTimeout(() => {
          setPortfolioData(mockPortfolioData);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching portfolio data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array to run only once

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Portfolio Overview
        </h2>
        <div className="flex space-x-2">
          {["1D", "1W", "1M", "3M", "1Y", "ALL"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-md text-sm ${
                timeRange === range
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              } transition`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <PortfolioSummary data={portfolioData.summary} marketData={marketData} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PerformanceChart
            data={portfolioData.performance}
            timeRange={timeRange}
          />
        </div>
        <div>
          <AssetAllocationChart data={portfolioData.allocation} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentTransactions transactions={portfolioData.recentTransactions} />
        </div>
        <div>
          <Watchlist marketData={marketData} />
        </div>
      </div>

      <MarketOverview marketData={marketData} />
    </div>
  );
};

export default Dashboard;
