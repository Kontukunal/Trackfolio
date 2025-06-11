// src/components/AssetAllocationEditor.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export const AssetAllocationEditor = ({ allocation, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [tempAllocation, setTempAllocation] = useState([...allocation]);
  const [newAsset, setNewAsset] = useState({ name: "", value: 0 });

  const handleValueChange = (index, value) => {
    const updated = [...tempAllocation];
    updated[index].value = parseFloat(value) || 0;
    setTempAllocation(updated);
  };

  const handleAddAsset = () => {
    if (newAsset.name && newAsset.value > 0) {
      setTempAllocation([...tempAllocation, { ...newAsset }]);
      setNewAsset({ name: "", value: 0 });
    }
  };

  const handleRemoveAsset = (index) => {
    const updated = tempAllocation.filter((_, i) => i !== index);
    setTempAllocation(updated);
  };

  const chartData = {
    labels: tempAllocation.map((item) => item.name),
    datasets: [
      {
        data: tempAllocation.map((item) => item.value),
        backgroundColor: [
          "#3B82F6",
          "#8B5CF6",
          "#10B981",
          "#6B7280",
          "#EC4899",
          "#F59E0B",
          "#EF4444",
        ],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          Asset Allocation
        </h3>
        {editing ? (
          <div className="flex space-x-2">
            <button
              onClick={() => {
                onSave(tempAllocation);
                setEditing(false);
              }}
              className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition"
            >
              Save
            </button>
            <button
              onClick={() => {
                setTempAllocation([...allocation]);
                setEditing(false);
              }}
              className="px-3 py-1 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-md text-sm hover:bg-gray-300 dark:hover:bg-gray-500 transition"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 transition"
          >
            Edit
          </button>
        )}
      </div>

      {editing ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="h-64">
                <Doughnut data={chartData} />
              </div>
            </div>
            <div className="space-y-4">
              {tempAllocation.map((asset, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={asset.name}
                    onChange={(e) => {
                      const updated = [...tempAllocation];
                      updated[index].name = e.target.value;
                      setTempAllocation(updated);
                    }}
                    className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  />
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500 dark:text-gray-400">$</span>
                    <input
                      type="number"
                      value={asset.value}
                      onChange={(e) => handleValueChange(index, e.target.value)}
                      className="w-24 p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    />
                    <button
                      onClick={() => handleRemoveAsset(index)}
                      className="p-2 text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="text"
                  placeholder="Asset name"
                  value={newAsset.name}
                  onChange={(e) =>
                    setNewAsset({ ...newAsset, name: e.target.value })
                  }
                  className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                />
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500 dark:text-gray-400">$</span>
                  <input
                    type="number"
                    placeholder="Value"
                    value={newAsset.value}
                    onChange={(e) =>
                      setNewAsset({
                        ...newAsset,
                        value: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-24 p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  />
                  <button
                    onClick={handleAddAsset}
                    className="p-2 text-green-500 hover:text-green-700"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-64">
          <Doughnut data={chartData} />
        </div>
      )}
    </div>
  );
};
