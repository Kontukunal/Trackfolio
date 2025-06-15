import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PortfolioStats from "./PortfolioStats";
import AssetImportExport from "./AssetImportExport";
import AssetDetailView from "./AssetDetailView";
import AssetEditor from "./AssetEditor";
import { FiPlus, FiSettings } from "react-icons/fi";
import {
  doc,
  collection,
  getDocs,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import AssetFilters from "./AssetFilters";
import PerformanceComparisonTool from "./PerformanceComparisonTool";
import FeatureToggle from "./FeatureToggle";
import { useTheme } from "../context/ThemeContext";

const AssetManagement = ({ marketData }) => {
  const { theme, themeConfig } = useTheme();
  const { currentUser } = useAuth();
  const [assets, setAssets] = useState([]);
  const [activeAsset, setActiveAsset] = useState(null);
  const [editingAsset, setEditingAsset] = useState(null);
  const [isAddingAsset, setIsAddingAsset] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [featureToggles, setFeatureToggles] = useState({
    assetFilters: true,
    performanceComparison: true,
  });
  const [filters, setFilters] = useState({});

  // Custom theme adjustments for light mode
  const lightModeThemeConfig = {
    ...themeConfig.light,
    card: "bg-gray-50 shadow-md",
    button: "bg-indigo-600 text-white hover:bg-indigo-700",
    buttonSecondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    inputBg: "bg-white",
    borderPrimary: "border-gray-200",
  };

  const currentThemeConfig =
    theme === "light" ? lightModeThemeConfig : themeConfig.dark;

  // Memoize filtered assets based on filters and assets
  const filteredAssets = useMemo(() => {
    if (!filters || Object.keys(filters).length === 0) {
      return assets;
    }

    let result = [...assets];

    // Apply search filter if present
    if (filters.searchTerm) {
      const searchTermLower = filters.searchTerm.toLowerCase();
      result = result.filter(
        (asset) =>
          asset.symbol.toLowerCase().includes(searchTermLower) ||
          asset.name.toLowerCase().includes(searchTermLower)
      );
    }

    // Apply type filter if types are selected
    if (filters.selectedTypes?.length > 0) {
      result = result.filter((asset) =>
        filters.selectedTypes.includes(asset.type)
      );
    }

    // Apply performance filter if set
    if (filters.performanceFilter) {
      result = result.filter((asset) => {
        if (!marketData[asset.symbol]) return false;

        const currentValue = asset.amount * marketData[asset.symbol].price;
        const costBasis = asset.amount * asset.averageCost;
        const gainPercent =
          costBasis > 0 ? ((currentValue - costBasis) / costBasis) * 100 : 0;

        switch (filters.performanceFilter) {
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

    return result;
  }, [assets, filters, marketData]);

  // Fetch assets from Firestore
  useEffect(() => {
    const fetchAssets = async () => {
      if (!currentUser) return;

      try {
        const querySnapshot = await getDocs(
          collection(db, "users", currentUser.uid, "assets")
        );
        const assetsData = [];
        querySnapshot.forEach((doc) => {
          assetsData.push({ id: doc.id, ...doc.data() });
        });
        setAssets(assetsData);
      } catch (error) {
        console.error("Error fetching assets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, [currentUser]);

  // Stable filter handler
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  const handleAssetClick = (asset) => {
    setActiveAsset(asset);
  };

  const handleCloseDetail = () => {
    setActiveAsset(null);
  };

  const handleSaveAsset = useCallback(
    async (asset) => {
      if (!currentUser) return;

      try {
        if (asset.id) {
          // Update existing asset
          await setDoc(
            doc(db, "users", currentUser.uid, "assets", asset.id),
            asset
          );
          setAssets((prevAssets) =>
            prevAssets.map((a) => (a.id === asset.id ? asset : a))
          );
        } else {
          // Add new asset
          const newAssetRef = doc(
            collection(db, "users", currentUser.uid, "assets")
          );
          await setDoc(newAssetRef, asset);
          setAssets((prevAssets) => [
            ...prevAssets,
            { ...asset, id: newAssetRef.id },
          ]);
        }
      } catch (error) {
        console.error("Error saving asset:", error);
      } finally {
        setEditingAsset(null);
        setIsAddingAsset(false);
      }
    },
    [currentUser]
  );

  const handleDeleteAsset = useCallback(
    async (assetId) => {
      if (!currentUser) return;

      try {
        await deleteDoc(doc(db, "users", currentUser.uid, "assets", assetId));
        setAssets((prevAssets) =>
          prevAssets.filter((asset) => asset.id !== assetId)
        );
        setActiveAsset(null);
      } catch (error) {
        console.error("Error deleting asset:", error);
      }
    },
    [currentUser]
  );

  const handleAddNewAsset = useCallback(() => {
    setEditingAsset({
      symbol: "",
      name: "",
      type: "Stock",
      amount: 0,
      averageCost: 0,
      purchaseDate: new Date().toISOString().split("T")[0],
    });
    setIsAddingAsset(true);
  }, []);

  const handleImportAssets = useCallback(
    async (importedAssets) => {
      if (!currentUser) return;

      try {
        // First delete all existing assets
        const batch = [];
        const querySnapshot = await getDocs(
          collection(db, "users", currentUser.uid, "assets")
        );

        querySnapshot.forEach((doc) => {
          batch.push(deleteDoc(doc.ref));
        });

        await Promise.all(batch);

        // Then add the new imported assets
        const newAssets = [];
        for (const asset of importedAssets) {
          const newAssetRef = doc(
            collection(db, "users", currentUser.uid, "assets")
          );
          await setDoc(newAssetRef, asset);
          newAssets.push({ ...asset, id: newAssetRef.id });
        }

        setAssets(newAssets);
      } catch (error) {
        console.error("Error importing assets:", error);
      }
    },
    [currentUser]
  );

  const toggleFeature = useCallback((feature) => {
    setFeatureToggles((prev) => ({
      ...prev,
      [feature]: !prev[feature],
    }));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className={`text-2xl font-bold ${currentThemeConfig.textPrimary}`}>
          Asset Portfolio
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-md ${currentThemeConfig.buttonSecondary}`}
            title="Feature settings"
          >
            <FiSettings size={20} />
          </button>
          <button
            onClick={handleAddNewAsset}
            className={`flex items-center space-x-2 px-4 py-2 ${currentThemeConfig.button} rounded-md transition shadow-sm hover:shadow-md`}
          >
            <FiPlus />
            <span>Add Asset</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className={`${currentThemeConfig.card} p-4 rounded-lg shadow-md mb-6 overflow-hidden border ${currentThemeConfig.borderPrimary}`}
          >
            <h3
              className={`text-lg font-medium ${currentThemeConfig.textPrimary} mb-4`}
            >
              Feature Settings
            </h3>
            <div className="space-y-2">
              <FeatureToggle
                featureName="Asset Filters"
                isEnabled={featureToggles.assetFilters}
                onToggle={() => toggleFeature("assetFilters")}
                description="Enable advanced filtering and sorting of your assets"
              />
              <FeatureToggle
                featureName="Performance Comparison"
                isEnabled={featureToggles.performanceComparison}
                onToggle={() => toggleFeature("performanceComparison")}
                description="Compare performance of assets against benchmarks"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <PortfolioStats
        assets={assets}
        marketData={marketData}
        themeConfig={currentThemeConfig}
      />

      {featureToggles.assetFilters && (
        <AssetFilters
          assets={assets}
          onFilter={handleFilterChange}
          marketData={marketData}
          themeConfig={currentThemeConfig}
        />
      )}

      <div className="grid grid-cols-1 gap-6">
        {filteredAssets.length === 0 ? (
          <div
            className={`${currentThemeConfig.card} p-8 rounded-lg shadow-md text-center border ${currentThemeConfig.borderPrimary}`}
          >
            <p className={currentThemeConfig.textSecondary}>
              {assets.length === 0
                ? "You don't have any assets yet. Add your first asset to get started."
                : "No assets match your current filters."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAssets.map((asset) => (
              <motion.div
                key={asset.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAssetClick(asset)}
                className={`${currentThemeConfig.card} p-4 rounded-lg shadow-md cursor-pointer border ${currentThemeConfig.borderPrimary}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3
                      className={`font-bold text-lg ${currentThemeConfig.textPrimary}`}
                    >
                      {asset.symbol}
                    </h3>
                    <p className={currentThemeConfig.textSecondary}>
                      {asset.name}
                    </p>
                    <p
                      className={`${currentThemeConfig.textTertiary} text-xs mt-1`}
                    >
                      {asset.type} • {asset.amount} shares
                    </p>
                  </div>
                  {marketData[asset.symbol] && (
                    <div className="text-right">
                      <p
                        className={`font-bold ${currentThemeConfig.textPrimary}`}
                      >
                        ${marketData[asset.symbol].price.toLocaleString()}
                      </p>
                      <p
                        className={`text-sm ${
                          marketData[asset.symbol].changePercent >= 0
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {marketData[asset.symbol].changePercent >= 0
                          ? "↑"
                          : "↓"}{" "}
                        {Math.abs(marketData[asset.symbol].changePercent)}%
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AssetImportExport
          assets={assets}
          onImport={handleImportAssets}
          themeConfig={currentThemeConfig}
        />

        {featureToggles.performanceComparison && (
          <PerformanceComparisonTool
            assets={assets}
            marketData={marketData}
            themeConfig={currentThemeConfig}
          />
        )}
      </div>

      <AnimatePresence>
        {activeAsset && (
          <AssetDetailView
            asset={activeAsset}
            marketData={marketData[activeAsset.symbol]}
            onClose={handleCloseDetail}
            onEdit={() => setEditingAsset(activeAsset)}
            onDelete={() => handleDeleteAsset(activeAsset.id)}
            themeConfig={currentThemeConfig}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(editingAsset || isAddingAsset) && (
          <AssetEditor
            asset={editingAsset}
            onSave={handleSaveAsset}
            onClose={() => {
              setEditingAsset(null);
              setIsAddingAsset(false);
            }}
            themeConfig={currentThemeConfig}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AssetManagement;
