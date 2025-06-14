// src/components/Dashboard.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import AssetManagement from "./AssetManagement";
import PortfolioOverview from "./PortfolioOverview";
import PerformanceComparison from "./PerformanceComparison";
import MarketNews from "./MarketNews"; // New component you'll create
import { useMarketData } from "../hooks/useMarketData";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

const Dashboard = () => {
  const { marketData } = useMarketData([
    "AAPL",
    "MSFT",
    "GOOGL",
    "AMZN",
    "TSLA",
    "BTC",
    "ETH",
    "SPY",
    "QQQ",
    "DIA",
    "GLD",
  ]);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <PortfolioOverview />
      </motion.div>

      <Tabs>
        <TabList className="flex border-b border-gray-200 dark:border-gray-700">
          <Tab className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none cursor-pointer">
            My Portfolio
          </Tab>
          <Tab className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none cursor-pointer">
            Performance Tools
          </Tab>
          <Tab className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none cursor-pointer">
            Market News
          </Tab>
        </TabList>

        <TabPanel>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="mt-4"
          >
            <AssetManagement marketData={marketData} />
          </motion.div>
        </TabPanel>
        <TabPanel>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="mt-4"
          >
            <PerformanceComparison />
          </motion.div>
        </TabPanel>
        <TabPanel>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="mt-4"
          >
            <MarketNews />
          </motion.div>
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default Dashboard;
