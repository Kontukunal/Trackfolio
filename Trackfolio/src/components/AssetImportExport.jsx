import { useState } from "react";
import { FiDownload, FiUpload } from "react-icons/fi";
import { toast } from "react-toastify";
import { useTheme } from "../context/ThemeContext";

const AssetImportExport = ({ assets, onImport }) => {
  const { theme, themeConfig } = useTheme();
  const [importData, setImportData] = useState("");

  const validateAsset = (asset) => {
    const requiredFields = [
      "symbol",
      "name",
      "type",
      "amount",
      "averageCost",
      "purchaseDate",
    ];
    return requiredFields.every((field) => asset.hasOwnProperty(field));
  };

  const handleExport = () => {
    const exportData = JSON.stringify(
      {
        version: "1.0",
        generatedAt: new Date().toISOString(),
        assets: assets.map(({ id, ...rest }) => rest), // Remove Firebase ID
      },
      null,
      2
    );

    const blob = new Blob([exportData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `portfolio-export-${
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

      if (!parsedData.assets || !Array.isArray(parsedData.assets)) {
        throw new Error("Invalid data format: missing assets array");
      }

      const validatedAssets = parsedData.assets.filter(validateAsset);

      if (validatedAssets.length !== parsedData.assets.length) {
        toast.warning("Some assets were invalid and skipped");
      }

      if (validatedAssets.length === 0) {
        throw new Error("No valid assets found in import data");
      }

      onImport(validatedAssets);
      toast.success(`Successfully imported ${validatedAssets.length} assets`);
      setImportData("");
    } catch (error) {
      toast.error(`Import failed: ${error.message}`);
      console.error("Import error:", error);
    }
  };

  return (
    <div className={`${themeConfig[theme].card} p-6 rounded-lg shadow-sm`}>
      <h3
        className={`text-lg font-semibold ${themeConfig[theme].textPrimary} mb-4`}
      >
        Import/Export Assets
      </h3>

      <div className="space-y-4">
        <div>
          <button
            onClick={handleExport}
            className={`flex items-center space-x-2 px-4 py-2 ${themeConfig[theme].button} rounded-md transition`}
          >
            <FiDownload />
            <span>Export Portfolio</span>
          </button>
          <p className={`text-sm ${themeConfig[theme].textTertiary} mt-2`}>
            Download all your assets as a JSON file
          </p>
        </div>

        <div>
          <label
            className={`block text-sm font-medium ${themeConfig[theme].textSecondary} mb-2`}
          >
            Import Portfolio Data (JSON)
          </label>
          <textarea
            value={importData}
            onChange={(e) => setImportData(e.target.value)}
            className={`w-full p-3 ${themeConfig[theme].borderPrimary} rounded-md ${themeConfig[theme].inputBg} ${themeConfig[theme].textPrimary} h-32`}
            placeholder={`Paste your portfolio JSON data here...\nExample:\n{\n  "assets": [\n    {\n      "symbol": "AAPL",\n      "name": "Apple Inc.",\n      "type": "Stock",\n      "amount": 10,\n      "averageCost": 150.25,\n      "purchaseDate": "2023-01-15"\n    }\n  ]\n}`}
          />
          <button
            onClick={handleImport}
            disabled={!importData.trim()}
            className={`mt-2 flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:opacity-50`}
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
