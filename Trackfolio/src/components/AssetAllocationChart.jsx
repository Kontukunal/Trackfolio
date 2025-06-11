// src/components/AssetAllocationChart.jsx
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import PropTypes from "prop-types";

const COLORS = ["#3B82F6", "#8B5CF6", "#10B981", "#6B7280"];

// Default data when none is provided
const defaultData = [
  { name: "Stocks", value: 45 },
  { name: "Bonds", value: 25 },
  { name: "Crypto", value: 20 },
  { name: "Cash", value: 10 },
];

export const AssetAllocationChart = ({
  data = defaultData,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 h-96">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Asset Allocation
        </h3>
        <div className="h-80 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  // Ensure data is valid before rendering chart
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 h-96">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Asset Allocation
        </h3>
        <div className="h-80 flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">
            No allocation data available
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 h-96">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
        Asset Allocation
      </h3>
      <div className="h-80">
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

AssetAllocationChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.number,
    })
  ),
  isLoading: PropTypes.bool,
};

AssetAllocationChart.defaultProps = {
  data: defaultData,
  isLoading: false,
};

export default AssetAllocationChart;
