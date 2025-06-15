import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiFilter, FiX, FiSearch } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";

const AssetFilters = ({ assets, onFilter, marketData }) => {
  const { theme, themeConfig } = useTheme();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [performanceFilter, setPerformanceFilter] = useState(null);
  const [groupBy, setGroupBy] = useState(null);

  // Custom theme adjustments for better light mode visibility
  const lightModeThemeConfig = {
    ...themeConfig.light,
    card: "bg-gray-50 shadow-md border border-gray-200",
    inputBg: "bg-white",
    buttonSecondary: "bg-white hover:bg-gray-100 text-gray-700",
    borderPrimary: "border-gray-300",
  };

  const currentThemeConfig =
    theme === "light" ? lightModeThemeConfig : themeConfig.dark;

  // Get all unique asset types
  const assetTypes = useMemo(
    () => [...new Set(assets.map((asset) => asset.type))],
    [assets]
  );

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      updateFilters();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Update filters when any filter changes
  const updateFilters = useCallback(() => {
    onFilter({
      searchTerm,
      selectedTypes,
      performanceFilter,
      groupBy,
    });
  }, [searchTerm, selectedTypes, performanceFilter, groupBy, onFilter]);

  // Call updateFilters when relevant states change
  useEffect(() => {
    updateFilters();
  }, [selectedTypes, performanceFilter, groupBy, updateFilters]);

  const toggleType = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
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
            <FiSearch className={currentThemeConfig.textTertiary} />
          </div>
          <input
            type="text"
            placeholder="Search assets..."
            className={`block w-full pl-10 pr-3 py-2 ${currentThemeConfig.borderPrimary} rounded-md leading-5 ${currentThemeConfig.inputBg} placeholder-${currentThemeConfig.textTertiary} focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`inline-flex items-center px-4 py-2 ${currentThemeConfig.borderPrimary} rounded-md shadow-sm text-sm font-medium ${currentThemeConfig.textSecondary} ${currentThemeConfig.buttonSecondary} focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors`}
          >
            <FiFilter className="mr-2" />
            Filters
            {selectedTypes.length > 0 || performanceFilter ? (
              <span className="ml-2 inline-flex items-center justify-center h-5 w-5 rounded-full bg-indigo-100 text-indigo-800 text-xs">
                {selectedTypes.length + (performanceFilter ? 1 : 0)}
              </span>
            ) : null}
          </button>

          <select
            value={groupBy || ""}
            onChange={(e) => setGroupBy(e.target.value || null)}
            className={`block w-full pl-3 pr-10 py-2 text-base ${currentThemeConfig.borderPrimary} focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md ${currentThemeConfig.inputBg} shadow-sm`}
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
            className={`${currentThemeConfig.card} p-4 rounded-lg shadow-md mb-4 overflow-hidden border ${currentThemeConfig.borderPrimary}`}
          >
            <div className="flex justify-between items-center mb-3">
              <h3
                className={`text-lg font-semibold ${currentThemeConfig.textPrimary}`}
              >
                Filters
              </h3>
              <button
                onClick={() => setIsFilterOpen(false)}
                className={`p-1 rounded-full ${
                  theme === "light" ? "hover:bg-gray-100" : "hover:bg-gray-700"
                }`}
              >
                <FiX size={20} className={currentThemeConfig.textSecondary} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4
                  className={`text-sm font-medium ${currentThemeConfig.textSecondary} mb-3`}
                >
                  Asset Type
                </h4>
                <div className="space-y-3">
                  {assetTypes.map((type) => (
                    <div key={type} className="flex items-center">
                      <input
                        id={`type-${type}`}
                        type="checkbox"
                        checked={selectedTypes.includes(type)}
                        onChange={() => toggleType(type)}
                        className={`h-4 w-4 text-indigo-600 focus:ring-indigo-500 ${
                          currentThemeConfig.borderPrimary
                        } rounded ${
                          theme === "light" ? "bg-white" : "bg-gray-700"
                        }`}
                      />
                      <label
                        htmlFor={`type-${type}`}
                        className={`ml-3 text-sm ${currentThemeConfig.textSecondary}`}
                      >
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4
                  className={`text-sm font-medium ${currentThemeConfig.textSecondary} mb-3`}
                >
                  Performance
                </h4>
                <div className="space-y-3">
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
                        className={`h-4 w-4 text-indigo-600 focus:ring-indigo-500 ${currentThemeConfig.borderPrimary}`}
                      />
                      <label
                        htmlFor={`perf-${option.value}`}
                        className={`ml-3 text-sm ${currentThemeConfig.textSecondary}`}
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={resetFilters}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  theme === "light"
                    ? "text-indigo-600 hover:bg-indigo-50"
                    : "text-indigo-400 hover:bg-gray-700"
                }`}
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
