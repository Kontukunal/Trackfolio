// src/components/AssetManagement.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PortfolioStats  from "./PortfolioStats";
import AssetImportExport from "./AssetImportExport";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "./SortableItem";
import AssetDetailView from "./AssetDetailView";
import AssetEditor from "./AssetEditor";
import { FiPlus } from "react-icons/fi";
import {
  doc,
  collection,
  getDocs,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

const AssetManagement = ({ marketData }) => {
  const { currentUser } = useAuth();
  const [assets, setAssets] = useState([]);
  const [activeAsset, setActiveAsset] = useState(null);
  const [editingAsset, setEditingAsset] = useState(null);
  const [isAddingAsset, setIsAddingAsset] = useState(false);
  const [loading, setLoading] = useState(true);
  const [widgets, setWidgets] = useState([
    { id: "portfolio", name: "Portfolio Overview" },
    { id: "performance", name: "Performance Chart" },
    { id: "allocation", name: "Asset Allocation" },
    { id: "watchlist", name: "Watchlist" },
  ]);

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

  const handleAssetClick = (asset) => {
    setActiveAsset(asset);
  };

  const handleCloseDetail = () => {
    setActiveAsset(null);
  };

  const handleSaveAsset = async (asset) => {
    try {
      if (asset.id) {
        // Update existing asset
        await setDoc(
          doc(db, "users", currentUser.uid, "assets", asset.id),
          asset
        );
        setAssets(assets.map((a) => (a.id === asset.id ? asset : a)));
      } else {
        // Add new asset
        const newAssetRef = doc(
          collection(db, "users", currentUser.uid, "assets")
        );
        await setDoc(newAssetRef, asset);
        setAssets([...assets, { ...asset, id: newAssetRef.id }]);
      }
    } catch (error) {
      console.error("Error saving asset:", error);
    } finally {
      setEditingAsset(null);
      setIsAddingAsset(false);
    }
  };

  const handleDeleteAsset = async (assetId) => {
    try {
      await deleteDoc(doc(db, "users", currentUser.uid, "assets", assetId));
      setAssets(assets.filter((asset) => asset.id !== assetId));
      setActiveAsset(null);
    } catch (error) {
      console.error("Error deleting asset:", error);
    }
  };

  const handleAddNewAsset = () => {
    setEditingAsset({
      symbol: "",
      name: "",
      type: "Stock",
      amount: 0,
      averageCost: 0,
      purchaseDate: new Date().toISOString().split("T")[0],
    });
    setIsAddingAsset(true);
  };

  const handleImportAssets = async (importedAssets) => {
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
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PortfolioStats assets={assets} marketData={marketData} />

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          Your Assets
        </h2>
        <button
          onClick={handleAddNewAsset}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
        >
          <FiPlus />
          <span>Add Asset</span>
        </button>
      </div>

      {assets.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            You don't have any assets yet. Add your first asset to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assets.map((asset) => (
            <motion.div
              key={asset.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAssetClick(asset)}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-gray-800 dark:text-white">
                    {asset.symbol}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {asset.name}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                    {asset.type} • {asset.amount} shares
                  </p>
                </div>
                {marketData[asset.symbol] && (
                  <div className="text-right">
                    <p className="font-bold text-gray-800 dark:text-white">
                      ${marketData[asset.symbol].price.toLocaleString()}
                    </p>
                    <p
                      className={`text-sm ${
                        marketData[asset.symbol].changePercent >= 0
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {marketData[asset.symbol].changePercent >= 0 ? "↑" : "↓"}{" "}
                      {Math.abs(marketData[asset.symbol].changePercent)}%
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AssetImportExport assets={assets} onImport={handleImportAssets} />
      </div>

      <AnimatePresence>
        {activeAsset && (
          <AssetDetailView
            asset={activeAsset}
            marketData={marketData[activeAsset.symbol]}
            onClose={handleCloseDetail}
            onEdit={() => setEditingAsset(activeAsset)}
            onDelete={() => handleDeleteAsset(activeAsset.id)}
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
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AssetManagement;
