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
import "../styles/StockChart.css";

function StockChart({ stock }) {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // generate chart data whenever the stock prop changes
    const generateChartData = () => {
      // Generate mock historical data for the chart
      const data = [];
      const basePrice = stock.previousClose;

      for (let i = 30; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);

        const variance = (Math.random() - 0.5) * 100;
        const price = basePrice + variance;

        data.push({
          date: date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          price: parseFloat(price.toFixed(2)),
          volume: Math.floor(Math.random() * 1000000),
        });
      }

      setChartData(data);
    };

    // only run when stock is available
    if (stock) generateChartData();
  }, [stock]);

  return (
    <div className="stock-chart">
      <h3>30-Day Price Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip
            formatter={(value) => `₹${value.toFixed(2)}`}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#1e3a8a"
            name="Stock Price"
            dot={false}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default StockChart;
