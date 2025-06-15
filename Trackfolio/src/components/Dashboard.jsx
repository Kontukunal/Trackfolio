import { useState } from "react";
import { motion } from "framer-motion";
import AssetManagement from "./AssetManagement";
import PortfolioOverview from "./PortfolioOverview";
import PerformanceComparison from "./PerformanceComparison";
import MarketNews from "./MarketNews";
import { useMarketData } from "../hooks/useMarketData";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { useTheme } from "../context/ThemeContext";
import "react-tabs/style/react-tabs.css";

const Dashboard = () => {
  const { theme, themeConfig } = useTheme();
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
    <div className={`min-h-screen ${themeConfig[theme].bgPrimary} pb-12`}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="px-4 pt-6"
      >
        <PortfolioOverview />
      </motion.div>

      <div className="px-4 mt-8">
        <Tabs>
          <TabList
            className={`flex space-x-1 rounded-lg p-1 ${
              theme === "light" ? "bg-gray-100" : "bg-gray-800"
            }`}
          >
            <Tab
              className={`px-4 py-2 text-sm font-medium rounded-md cursor-pointer transition-all duration-200 ${
                theme === "light"
                  ? "text-gray-700 hover:bg-white"
                  : "text-gray-300 hover:bg-gray-700"
              }`}
              selectedClassName={`${
                theme === "light"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "bg-gray-700 text-indigo-400"
              }`}
            >
              My Portfolio
            </Tab>
            <Tab
              className={`px-4 py-2 text-sm font-medium rounded-md cursor-pointer transition-all duration-200 ${
                theme === "light"
                  ? "text-gray-700 hover:bg-white"
                  : "text-gray-300 hover:bg-gray-700"
              }`}
              selectedClassName={`${
                theme === "light"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "bg-gray-700 text-indigo-400"
              }`}
            >
              Performance
            </Tab>
            <Tab
              className={`px-4 py-2 text-sm font-medium rounded-md cursor-pointer transition-all duration-200 ${
                theme === "light"
                  ? "text-gray-700 hover:bg-white"
                  : "text-gray-300 hover:bg-gray-700"
              }`}
              selectedClassName={`${
                theme === "light"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "bg-gray-700 text-indigo-400"
              }`}
            >
              Market News
            </Tab>
          </TabList>

          <TabPanel>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="mt-6"
            >
              <AssetManagement marketData={marketData} />
            </motion.div>
          </TabPanel>
          <TabPanel>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="mt-6"
            >
              <PerformanceComparison />
            </motion.div>
          </TabPanel>
          <TabPanel>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="mt-6"
            >
              <MarketNews />
            </motion.div>
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
