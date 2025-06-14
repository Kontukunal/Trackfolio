import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
];

const AssetAllocationChart = ({ data }) => {
  const { theme, themeConfig } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`${themeConfig[theme].card} p-4 rounded-lg shadow-sm`}
    >
      <h3
        className={`text-lg font-semibold ${themeConfig[theme].textPrimary} mb-4`}
      >
        Asset Allocation
      </h3>
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
                `${name}: ${(percent * 100).toFixed(0)}%`
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
              contentStyle={{
                backgroundColor: theme === "dark" ? "#1F2937" : "#FFFFFF",
                borderColor: theme === "dark" ? "#374151" : "#E5E7EB",
                borderRadius: "0.5rem",
              }}
              itemStyle={{
                color: theme === "dark" ? "#F3F4F6" : "#111827",
              }}
            />
            <Legend
              wrapperStyle={{
                color: theme === "dark" ? "#F3F4F6" : "#111827",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default AssetAllocationChart;
