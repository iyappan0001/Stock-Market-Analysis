import React, { useState, useEffect } from "react";
import axios from "axios";
import StockCard from "../components/StockCard";
import StockChart from "../components/StockChart";
import "../styles/Dashboard.css";

function Dashboard({ user }) {
  const [stocks, setStocks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStock, setSelectedStock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/stocks");
      setStocks(response.data.stocks);
      if (response.data.stocks.length > 0) {
        setSelectedStock(response.data.stocks[0]);
      }
    } catch (err) {
      setError("Failed to fetch stocks");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term === "") {
      fetchStocks();
      return;
    }

    try {
      const response = await axios.get(`/api/stocks/search/${term}`);
      setStocks(response.data.stocks);
    } catch (err) {
      console.log("Search failed");
    }
  };

  const handleSelectStock = (stock) => {
    setSelectedStock(stock);
  };

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {user?.firstName}!</h1>
        <p>Stock Market Analysis Dashboard</p>
      </div>

      <div className="dashboard-content">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search stocks by symbol or name..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="dashboard-grid">
          <div className="stocks-list">
            <h2>Top 20 Indian Companies</h2>
            <div className="stocks-container">
              {stocks.map((stock) => (
                <StockCard
                  key={stock.symbol}
                  stock={stock}
                  isSelected={selectedStock?.symbol === stock.symbol}
                  onSelect={handleSelectStock}
                />
              ))}
            </div>
          </div>

          <div className="stock-details">
            {selectedStock && (
              <div className="detail-box">
                <h2>{selectedStock.companyName}</h2>
                <p className="symbol">{selectedStock.symbol}</p>

                <div className="price-info">
                  <div className="price-large">
                    ₹{selectedStock.currentPrice.toFixed(2)}
                  </div>
                  <div className="change">
                    {(
                      selectedStock.currentPrice - selectedStock.previousClose
                    ).toFixed(2)}
                    (
                    {(
                      ((selectedStock.currentPrice -
                        selectedStock.previousClose) /
                        selectedStock.previousClose) *
                      100
                    ).toFixed(2)}
                    %)
                  </div>
                </div>

                <div className="info-grid">
                  <div className="info-item">
                    <span className="label">Day High</span>
                    <span className="value">
                      ₹{selectedStock.dayHigh.toFixed(2)}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="label">Day Low</span>
                    <span className="value">
                      ₹{selectedStock.dayLow.toFixed(2)}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="label">Market Cap</span>
                    <span className="value">{selectedStock.marketCap}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">P/E Ratio</span>
                    <span className="value">{selectedStock.peRatio}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Dividend</span>
                    <span className="value">{selectedStock.dividend}%</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Sector</span>
                    <span className="value">{selectedStock.sector}</span>
                  </div>
                </div>

                <p className="description">{selectedStock.description}</p>

                <StockChart stock={selectedStock} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
