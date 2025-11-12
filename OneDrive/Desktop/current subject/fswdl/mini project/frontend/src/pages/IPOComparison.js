import React, { useState, useEffect } from "react";
import axios from "axios";
import ComparisonChart from "../components/ComparisonChart";
import "../styles/IPOComparison.css";

function IPOComparison() {
  const [ipos, setIpos] = useState([]);
  const [selectedIpoSymbol, setSelectedIpoSymbol] = useState("");
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch list of available IPOs on component mount
  useEffect(() => {
    const fetchIpos = async () => {
      try {
        const response = await axios.get("/api/ipo");
        setIpos(response.data.ipos || []);
        if (response.data.ipos && response.data.ipos.length > 0) {
          setSelectedIpoSymbol(response.data.ipos[0].symbol);
        }
      } catch (err) {
        setError("Failed to fetch IPOs");
      } finally {
        setLoading(false);
      }
    };

    fetchIpos();
  }, []);

  // Fetch comparison data when selected IPO changes
  useEffect(() => {
    const fetchComparisonData = async () => {
      if (!selectedIpoSymbol) return;

      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `/api/ipo/${selectedIpoSymbol}/comparison`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setComparisonData(response.data);
        setError("");
      } catch (err) {
        setError("Failed to fetch comparison data");
        setComparisonData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchComparisonData();
  }, [selectedIpoSymbol]);

  if (loading) {
    return <div className="loading">Loading IPOs...</div>;
  }

  if (error && !comparisonData) {
    return <div className="error-message">{error}</div>;
  }

  if (!ipos || ipos.length === 0) {
    return <div className="error-message">No IPOs available for comparison</div>;
  }

  const ipo = comparisonData?.ipo;

  return (
    <div className="ipo-comparison-page">
      <div className="comparison-header">
        <h1>IPO Performance Comparison</h1>
        <p>Compare IPO performance with established stocks</p>
      </div>

      <div className="comparison-content">
        {/* IPO Selector */}
        <div className="ipo-selector">
          <label htmlFor="ipo-select">Select an IPO:</label>
          <select
            id="ipo-select"
            value={selectedIpoSymbol}
            onChange={(e) => setSelectedIpoSymbol(e.target.value)}
            className="ipo-dropdown"
          >
            {ipos.map((ipo) => (
              <option key={ipo.symbol} value={ipo.symbol}>
                {ipo.symbol} - {ipo.companyName}
              </option>
            ))}
          </select>
        </div>

        {/* IPO Info and Comparison */}
        {ipo && (
          <>
            <div className="ipo-info">
              <h2>{ipo.companyName}</h2>
              <p className="symbol">{ipo.symbol}</p>
              <div className="info-grid">
                <div className="info-item">
                  <span className="label">IPO Price</span>
                  <span className="value">₹{ipo.ipoPrice.toFixed(2)}</span>
                </div>
                <div className="info-item">
                  <span className="label">Current Price</span>
                  <span className="value">₹{ipo.currentPrice.toFixed(2)}</span>
                </div>
                <div className="info-item">
                  <span className="label">Performance</span>
                  <span
                    className={`value ${
                      ipo.performancePercentage >= 0 ? "positive" : "negative"
                    }`}
                  >
                    {ipo.performancePercentage?.toFixed(2)}%
                  </span>
                </div>
                <div className="info-item">
                  <span className="label">IPO Date</span>
                  <span className="value">
                    {new Date(ipo.ipoDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="info-item">
                  <span className="label">Listing Date</span>
                  <span className="value">
                    {ipo.listingDate
                      ? new Date(ipo.listingDate).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
                <div className="info-item">
                  <span className="label">Sector</span>
                  <span className="value">{ipo.sector}</span>
                </div>
              </div>
            </div>

            <div className="comparison-chart">
              <ComparisonChart
                ipo={ipo}
                stock={comparisonData?.establishedStock}
              />
            </div>

            {comparisonData?.establishedStock && (
              <div className="established-stock-info">
                <h2>
                  Comparison Reference Stock:{" "}
                  {comparisonData.establishedStock.symbol}
                </h2>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="label">Stock Name</span>
                    <span className="value">
                      {comparisonData.establishedStock.companyName}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="label">Current Price</span>
                    <span className="value">
                      ₹{comparisonData.establishedStock.currentPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="label">Previous Close</span>
                    <span className="value">
                      ₹
                      {comparisonData.establishedStock.previousClose.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default IPOComparison;
