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
    <div className={`space-y-6 ${themeConfig[theme].bgPrimary}`}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <PortfolioOverview />
      </motion.div>

      <Tabs>
        <TabList
          className={`flex border-b ${themeConfig[theme].borderPrimary}`}
        >
          <Tab
            className={`px-4 py-2 text-sm font-medium ${themeConfig[theme].textSecondary} hover:${themeConfig[theme].textPrimary} focus:outline-none cursor-pointer`}
            selectedClassName={`${themeConfig[theme].textPrimary} border-b-2 ${themeConfig[theme].accentText} font-semibold`}
          >
            My Portfolio
          </Tab>
          <Tab
            className={`px-4 py-2 text-sm font-medium ${themeConfig[theme].textSecondary} hover:${themeConfig[theme].textPrimary} focus:outline-none cursor-pointer`}
            selectedClassName={`${themeConfig[theme].textPrimary} border-b-2 ${themeConfig[theme].accentText} font-semibold`}
          >
            Performance Tools
          </Tab>
          <Tab
            className={`px-4 py-2 text-sm font-medium ${themeConfig[theme].textSecondary} hover:${themeConfig[theme].textPrimary} focus:outline-none cursor-pointer`}
            selectedClassName={`${themeConfig[theme].textPrimary} border-b-2 ${themeConfig[theme].accentText} font-semibold`}
          >
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
