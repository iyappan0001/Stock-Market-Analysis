import React, { useState, useEffect } from "react";
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
import "../styles/ComparisonChart.css";

function ComparisonChart({ ipo, stock }) {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // generate comparison chart data when ipo or stock changes
    const generateComparisonData = () => {
      const data = [];
      const ipoBasePrice = ipo.ipoPrice;
      const stockBasePrice = stock?.currentPrice || ipo.currentPrice;

      for (let i = 30; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);

        const ipoVariance = (Math.random() - 0.5) * 50;
        const ipoPrice = ipoBasePrice + ipoVariance;

        const stockVariance = (Math.random() - 0.5) * 100;
        const stockPrice = stockBasePrice + stockVariance;

        data.push({
          date: date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          ipoPrice: parseFloat(ipoPrice.toFixed(2)),
          stockPrice: stock ? parseFloat(stockPrice.toFixed(2)) : null,
        });
      }

      setChartData(data);
    };

    generateComparisonData();
  }, [ipo, stock]);

  return (
    <div className="comparison-chart">
      <h3>IPO vs Established Stock Comparison</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip
            formatter={(value) => (value ? `₹${value.toFixed(2)}` : "N/A")}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="ipoPrice"
            stroke="#dc2626"
            name={`${ipo.symbol} (IPO)`}
            strokeWidth={2}
          />
          {stock && (
            <Line
              type="monotone"
              dataKey="stockPrice"
              stroke="#2563eb"
              name={`${stock.symbol} (Established)`}
              strokeWidth={2}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ComparisonChart;
