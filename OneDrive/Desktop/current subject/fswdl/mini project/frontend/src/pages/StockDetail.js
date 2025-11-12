import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import StockChart from "../components/StockChart";
import "../styles/StockDetail.css";

function StockDetail() {
  const { symbol } = useParams();
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // fetch stock detail when symbol changes
    const fetchStockDetail = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(`/api/stocks/${symbol}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStock(response.data.stock);
      } catch (err) {
        setError("Failed to fetch stock details");
      } finally {
        setLoading(false);
      }
    };

    if (symbol) fetchStockDetail();
  }, [symbol]);

  if (loading) {
    return <div className="loading">Loading stock details...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!stock) {
    return <div className="error-message">Stock not found</div>;
  }

  return (
    <div className="stock-detail-page">
      <div className="detail-header">
        <h1>{stock.companyName}</h1>
        <p className="symbol">{stock.symbol}</p>
      </div>

      <div className="detail-content">
        <div className="price-section">
          <div className="current-price">
            <h2>Current Price</h2>
            <div className="price">₹{stock.currentPrice.toFixed(2)}</div>
          </div>

          <div className="price-change">
            <h2>Change</h2>
            <div className="change-value">
              {(stock.currentPrice - stock.previousClose).toFixed(2)}(
              {(
                ((stock.currentPrice - stock.previousClose) /
                  stock.previousClose) *
                100
              ).toFixed(2)}
              %)
            </div>
          </div>
        </div>

        <div className="chart-section">
          <StockChart stock={stock} />
        </div>

        <div className="info-section">
          <h2>Stock Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="label">Previous Close</span>
              <span className="value">₹{stock.previousClose.toFixed(2)}</span>
            </div>
            <div className="info-item">
              <span className="label">Day High</span>
              <span className="value">₹{stock.dayHigh.toFixed(2)}</span>
            </div>
            <div className="info-item">
              <span className="label">Day Low</span>
              <span className="value">₹{stock.dayLow.toFixed(2)}</span>
            </div>
            <div className="info-item">
              <span className="label">Market Cap</span>
              <span className="value">{stock.marketCap}</span>
            </div>
            <div className="info-item">
              <span className="label">P/E Ratio</span>
              <span className="value">{stock.peRatio}</span>
            </div>
            <div className="info-item">
              <span className="label">Dividend Yield</span>
              <span className="value">{stock.dividend}%</span>
            </div>
            <div className="info-item">
              <span className="label">Sector</span>
              <span className="value">{stock.sector}</span>
            </div>
          </div>
        </div>

        <div className="description-section">
          <h2>About {stock.companyName}</h2>
          <p>{stock.description}</p>
        </div>

        <div className="actions-section">
          <Link to={`/ipo/${stock.symbol}`} className="btn btn-primary">
            📊 Compare with IPO Performance
          </Link>
        </div>
      </div>
    </div>
  );
}

export default StockDetail;
