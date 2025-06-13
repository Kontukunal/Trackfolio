// src/components/AssetImportExport.jsx
import { useState } from "react";
import { FiDownload, FiUpload } from "react-icons/fi";
import { toast } from "react-toastify";

const AssetImportExport = ({ assets, onImport }) => {
  const [importData, setImportData] = useState("");

  const handleExport = () => {
    const exportData = JSON.stringify(assets, null, 2);
    const blob = new Blob([exportData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `portfolio-assets-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Assets exported successfully!");
  };

  const handleImport = () => {
    try {
      const parsedData = JSON.parse(importData);
      if (!Array.isArray(parsedData)) {
        throw new Error("Invalid data format");
      }
      onImport(parsedData);
      toast.success("Assets imported successfully!");
      setImportData("");
    } catch (error) {
      toast.error("Failed to import assets. Please check the data format.");
      console.error("Import error:", error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        Import/Export Assets
      </h3>

      <div className="space-y-4">
        <div>
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            <FiDownload />
            <span>Export Portfolio</span>
          </button>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Download all your assets as a JSON file
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Import Portfolio Data (JSON)
          </label>
          <textarea
            value={importData}
            onChange={(e) => setImportData(e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white h-32"
            placeholder="Paste your portfolio JSON data here..."
          />
          <button
            onClick={handleImport}
            disabled={!importData.trim()}
            className="mt-2 flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:opacity-50"
          >
            <FiUpload />
            <span>Import Portfolio</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssetImportExport;
