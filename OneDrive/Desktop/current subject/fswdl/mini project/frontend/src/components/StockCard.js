import React from "react";
import { Link } from "react-router-dom";
import "../styles/StockCard.css";

function StockCard({ stock, isSelected, onSelect }) {
  const change = stock.currentPrice - stock.previousClose;
  const changePercent = ((change / stock.previousClose) * 100).toFixed(2);

  const handleClick = () => {
    onSelect(stock);
  };

  return (
    <div
      className={`stock-card ${isSelected ? "selected" : ""} ${
        change >= 0 ? "positive" : "negative"
      }`}
      onClick={handleClick}
    >
      <div className="card-header">
        <h3>{stock.symbol}</h3>
        <span className="sector-badge">{stock.sector}</span>
      </div>

      <div className="card-body">
        <p className="company-name">{stock.companyName}</p>

        <div className="price-info">
          <div className="current-price">₹{stock.currentPrice.toFixed(2)}</div>
          <div
            className={`price-change ${change >= 0 ? "positive" : "negative"}`}
          >
            {change >= 0 ? "▲" : "▼"} {Math.abs(changePercent)}%
          </div>
        </div>

        <div className="card-footer">
          <small>Market Cap: {stock.marketCap}</small>
          <Link to={`/stock/${stock.symbol}`} className="view-details-link">
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default StockCard;
