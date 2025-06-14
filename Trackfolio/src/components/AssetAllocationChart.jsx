// src/components/AssetAllocationChart.jsx
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { FiPieChart } from "react-icons/fi";

const COLORS = ["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B", "#6B7280"];

const AssetAllocationChart = ({ data = [], isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg h-full">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-gray-700 dark:text-gray-300">
            Asset Allocation
          </h4>
          <FiPieChart className="text-gray-400" />
        </div>
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg h-full">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-gray-700 dark:text-gray-300">
            Asset Allocation
          </h4>
          <FiPieChart className="text-gray-400" />
        </div>
        <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
          No allocation data available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg h-full">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-gray-700 dark:text-gray-300">
          Asset Allocation
        </h4>
        <FiPieChart className="text-gray-400" />
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`$${value.toLocaleString()}`, "Value"]}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AssetAllocationChart;
