import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";

const AssetEditor = ({ asset, onSave, onClose }) => {
  const { theme, themeConfig } = useTheme();
  const [formData, setFormData] = useState(
    asset || {
      symbol: "",
      name: "",
      type: "Stock",
      amount: 0,
      averageCost: 0,
      purchaseDate: new Date().toISOString().split("T")[0],
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "amount" || name === "averageCost" ? parseFloat(value) : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className={`${themeConfig[theme].card} rounded-lg shadow-lg w-full max-w-md relative`}
        >
          <div className="flex justify-between items-center p-4 border-b">
            <h3
              className={`text-lg font-semibold ${themeConfig[theme].textPrimary}`}
            >
              {asset?.id ? "Edit Asset" : "Add New Asset"}
            </h3>
            <button
              onClick={onClose}
              className={`p-1 rounded-full ${themeConfig[theme].textSecondary} hover:${themeConfig[theme].bgTertiary}`}
            >
              <FiX size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-4">
              <div>
                <label
                  className={`block text-sm font-medium ${themeConfig[theme].textSecondary} mb-1`}
                >
                  Symbol
                </label>
                <input
                  type="text"
                  name="symbol"
                  value={formData.symbol}
                  onChange={handleChange}
                  className={`w-full ${themeConfig[theme].inputBg} ${themeConfig[theme].borderPrimary} rounded-md shadow-sm py-2 px-3 border`}
                  required
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-medium ${themeConfig[theme].textSecondary} mb-1`}
                >
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full ${themeConfig[theme].inputBg} ${themeConfig[theme].borderPrimary} rounded-md shadow-sm py-2 px-3 border`}
                  required
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-medium ${themeConfig[theme].textSecondary} mb-1`}
                >
                  Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className={`w-full ${themeConfig[theme].inputBg} ${themeConfig[theme].borderPrimary} rounded-md shadow-sm py-2 px-3 border`}
                >
                  <option value="Stock">Stock</option>
                  <option value="Crypto">Cryptocurrency</option>
                  <option value="ETF">ETF</option>
                  <option value="Commodity">Commodity</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-sm font-medium ${themeConfig[theme].textSecondary} mb-1`}
                  >
                    Amount
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    step="any"
                    min="0"
                    className={`w-full ${themeConfig[theme].inputBg} ${themeConfig[theme].borderPrimary} rounded-md shadow-sm py-2 px-3 border`}
                    required
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium ${themeConfig[theme].textSecondary} mb-1`}
                  >
                    Avg. Cost
                  </label>
                  <input
                    type="number"
                    name="averageCost"
                    value={formData.averageCost}
                    onChange={handleChange}
                    step="any"
                    min="0"
                    className={`w-full ${themeConfig[theme].inputBg} ${themeConfig[theme].borderPrimary} rounded-md shadow-sm py-2 px-3 border`}
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium ${themeConfig[theme].textSecondary} mb-1`}
                >
                  Purchase Date
                </label>
                <input
                  type="date"
                  name="purchaseDate"
                  value={formData.purchaseDate}
                  onChange={handleChange}
                  className={`w-full ${themeConfig[theme].inputBg} ${themeConfig[theme].borderPrimary} rounded-md shadow-sm py-2 px-3 border`}
                  required
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2 ${themeConfig[theme].buttonSecondary} rounded-md`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2 ${themeConfig[theme].button} rounded-md`}
              >
                Save Asset
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AssetEditor;
