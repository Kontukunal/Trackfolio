// src/components/PerformanceChart.jsx
import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const PerformanceChart = ({ data, timeRange }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Format data for the chart based on time range
    const rangeData = data[timeRange] || [];
    const formattedData = rangeData.map((value, index) => ({
      name: `Day ${index + 1}`,
      value,
    }));
    setChartData(formattedData);
  }, [data, timeRange]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-96">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Portfolio Performance
      </h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip
              formatter={(value) => [
                `$${value.toLocaleString()}`,
                "Portfolio Value",
              ]}
              labelFormatter={(label) => `Time: ${label}`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              name="Portfolio Value"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PerformanceChart;
