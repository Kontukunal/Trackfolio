// src/components/AssetManagement.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

const AssetManagement = ({ assets, marketData, onUpdateAssets }) => {
  const [activeAsset, setActiveAsset] = useState(null);
  const [editingAsset, setEditingAsset] = useState(null);
  const [widgets, setWidgets] = useState([
    { id: "portfolio", name: "Portfolio Overview" },
    { id: "performance", name: "Performance Chart" },
    { id: "allocation", name: "Asset Allocation" },
    { id: "watchlist", name: "Watchlist" },
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setWidgets((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleAssetClick = (asset) => {
    setActiveAsset(asset);
  };

  const handleCloseDetail = () => {
    setActiveAsset(null);
  };

  const handleSaveAsset = (updatedAsset) => {
    onUpdateAssets(
      assets.map((a) => (a.id === updatedAsset.id ? updatedAsset : a))
    );
    setEditingAsset(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          Customize Your Dashboard
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Drag and drop widgets to rearrange your dashboard layout
        </p>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={widgets}
            strategy={verticalListSortingStrategy}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {widgets.map((widget) => (
                <SortableItem key={widget.id} id={widget.id}>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 cursor-move">
                    <h3 className="font-medium text-gray-800 dark:text-white">
                      {widget.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Drag to reorder
                    </p>
                  </div>
                </SortableItem>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

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

      <AnimatePresence>
        {activeAsset && (
          <AssetDetailView
            asset={activeAsset}
            marketData={marketData[activeAsset.symbol]}
            onClose={handleCloseDetail}
            onEdit={() => setEditingAsset(activeAsset)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editingAsset && (
          <AssetEditor
            asset={editingAsset}
            onSave={handleSaveAsset}
            onClose={() => setEditingAsset(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AssetManagement;
