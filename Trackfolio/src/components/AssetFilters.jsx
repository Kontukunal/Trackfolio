// src/components/AssetFilters.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiFilter,
  FiX,
  FiSearch,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";

const AssetFilters = ({ assets, onFilter, marketData }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [performanceFilter, setPerformanceFilter] = useState(null);
  const [groupBy, setGroupBy] = useState(null);
  const [expandedGroups, setExpandedGroups] = useState({});

  // Get all unique asset types
  const assetTypes = [...new Set(assets.map((asset) => asset.type))];

  // Apply filters when any filter changes
  useEffect(() => {
    let filteredAssets = [...assets];

    // Apply search filter
    if (searchTerm) {
      filteredAssets = filteredAssets.filter(
        (asset) =>
          asset.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
          asset.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply type filter
    if (selectedTypes.length > 0) {
      filteredAssets = filteredAssets.filter((asset) =>
        selectedTypes.includes(asset.type)
      );
    }

    // Apply performance filter
    if (performanceFilter) {
      filteredAssets = filteredAssets.filter((asset) => {
        if (!marketData[asset.symbol]) return false;

        const currentValue = asset.amount * marketData[asset.symbol].price;
        const costBasis = asset.amount * asset.averageCost;
        const gainPercent =
          costBasis > 0 ? ((currentValue - costBasis) / costBasis) * 100 : 0;

        switch (performanceFilter) {
          case "topGainers":
            return gainPercent > 0;
          case "topLosers":
            return gainPercent < 0;
          case "highestGain":
            return gainPercent >= 10;
          case "lowestLoss":
            return gainPercent <= -5;
          default:
            return true;
        }
      });
    }

    // Group assets if grouping is enabled
    let groupedAssets = {};
    if (groupBy) {
      filteredAssets.forEach((asset) => {
        const groupKey = asset[groupBy] || "Other";
        if (!groupedAssets[groupKey]) {
          groupedAssets[groupKey] = [];
        }
        groupedAssets[groupKey].push(asset);
      });
    }

    onFilter(groupBy ? groupedAssets : filteredAssets);
  }, [
    assets,
    searchTerm,
    selectedTypes,
    performanceFilter,
    groupBy,
    marketData,
  ]);

  const toggleType = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleGroup = (group) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedTypes([]);
    setPerformanceFilter(null);
    setGroupBy(null);
  };

  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search assets..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-800 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <FiFilter className="mr-2" />
            Filters
          </button>

          <select
            value={groupBy || ""}
            onChange={(e) => setGroupBy(e.target.value || null)}
            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-700"
          >
            <option value="">No grouping</option>
            <option value="type">Group by Type</option>
            <option value="sector">Group by Sector</option>
          </select>
        </div>
      </div>

      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 mb-4 overflow-hidden"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Filters
              </h3>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Asset Type
                </h4>
                <div className="space-y-2">
                  {assetTypes.map((type) => (
                    <div key={type} className="flex items-center">
                      <input
                        id={`type-${type}`}
                        type="checkbox"
                        checked={selectedTypes.includes(type)}
                        onChange={() => toggleType(type)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor={`type-${type}`}
                        className="ml-3 text-sm text-gray-700 dark:text-gray-300"
                      >
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Performance
                </h4>
                <div className="space-y-2">
                  {[
                    { value: "topGainers", label: "Top Gainers" },
                    { value: "topLosers", label: "Top Losers" },
                    { value: "highestGain", label: "Highest Gain (>10%)" },
                    { value: "lowestLoss", label: "Lowest Loss (<5%)" },
                  ].map((option) => (
                    <div key={option.value} className="flex items-center">
                      <input
                        id={`perf-${option.value}`}
                        type="radio"
                        name="performance"
                        checked={performanceFilter === option.value}
                        onChange={() =>
                          setPerformanceFilter(
                            performanceFilter === option.value
                              ? null
                              : option.value
                          )
                        }
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      />
                      <label
                        htmlFor={`perf-${option.value}`}
                        className="ml-3 text-sm text-gray-700 dark:text-gray-300"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={resetFilters}
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
              >
                Reset all filters
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AssetFilters;
