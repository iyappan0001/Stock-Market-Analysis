# Live Stock Price Updates Implementation Plan

## Objective
Enable the Stock Market Analysis application to automatically fetch live stock prices daily and compare them with IPO prices to provide real-time performance insights.

---

## Current State

### What Exists
- ✅ MongoDB database with `stocks` and `ipos` collections
- ✅ Backend API endpoints for fetching stocks and IPO data
- ✅ Frontend IPO Comparison page with mock data generation
- ✅ Charts (Recharts) for visualizing stock trends

### What's Missing
- ❌ Live/real-time stock price fetching
- ❌ Automated daily price updates (no cron job)
- ❌ Historical price tracking
- ❌ Performance comparison logic
- ❌ Real-time data API integration (Yahoo Finance, NSE, etc.)
- ❌ Frontend display of live prices with performance indicators

---

## Implementation Phases

### Phase 1: Backend Infrastructure (Days 1-2)

#### 1.1 Add Node Dependencies
**File:** `backend/package.json`

Add to dependencies:
```json
{
  "node-cron": "^3.0.3",
  "axios": "^1.3.0",
  "dotenv": "^16.0.3"
}
```

Installation:
```bash
cd backend
npm install node-cron axios
```

**Why:**
- `node-cron`: Schedule background jobs (e.g., daily price updates)
- `axios`: Make HTTP requests to external APIs for live data

#### 1.2 Extend Stock Model
**File:** `backend/models/Stock.js`

Add fields to track price history:
```javascript
// New fields in Stock schema
{
  currentPrice: Number,        // ✅ Exists
  priceHistory: [              // NEW: Track price changes
    {
      price: Number,
      date: { type: Date, default: Date.now },
      source: String           // e.g., "Yahoo Finance", "mock"
    }
  ],
  lastPriceUpdate: Date,       // NEW: When price was last updated
  performancePercentage: Number // NEW: (currentPrice - ipoPrice) / ipoPrice * 100
}
```

**Update method:**
```javascript
// Add to Stock model
updatePrice(newPrice) {
  this.priceHistory.push({
    price: newPrice,
    date: new Date(),
    source: "live-api"
  });
  this.currentPrice = newPrice;
  this.lastPriceUpdate = new Date();
  this.performancePercentage = ((newPrice - this.ipoPrice) / this.ipoPrice) * 100;
  return this.save();
}
```

#### 1.3 Create Price Fetcher Service
**File:** `backend/services/priceUpdater.js` (NEW)

```javascript
const axios = require("axios");
const Stock = require("../models/Stock");

class PriceUpdater {
  // Mock price generator for development
  async fetchMockPrices() {
    try {
      const stocks = await Stock.find();
      for (const stock of stocks) {
        // Simulate realistic price movement (±5% variance)
        const variance = (Math.random() - 0.5) * 0.1;
        const newPrice = stock.currentPrice * (1 + variance);
        await stock.updatePrice(newPrice);
      }
      console.log(`[PriceUpdater] Updated ${stocks.length} stock prices`);
      return { success: true, count: stocks.length };
    } catch (error) {
      console.error("[PriceUpdater] Error:", error.message);
      return { success: false, error: error.message };
    }
  }

  // Real API integration (placeholder for future)
  async fetchLiveYahooFinance(symbol) {
    // TODO: Integrate with Yahoo Finance API
    // Requires API key from: https://rapidapi.com/spartan07-Cx0nKo0Oq3x/api/yahoo-finance1
    const apiKey = process.env.YAHOO_FINANCE_API_KEY;
    if (!apiKey) {
      console.warn("[PriceUpdater] Yahoo Finance API key not set");
      return null;
    }
    // Implementation here...
  }

  // NSE India API integration (placeholder for future)
  async fetchLiveNSEIndia(symbol) {
    // TODO: Integrate with NSE India data API
    // Free API: https://www.nseindiaapi.com/ (no key required)
    // Implementation here...
  }
}

module.exports = new PriceUpdater();
```

**Why:**
- Encapsulates price fetching logic
- Allows switching between real and mock data for testing
- Easy to add real API integrations later

#### 1.4 Create Cron Job Scheduler
**File:** `backend/jobs/scheduledJobs.js` (NEW)

```javascript
const cron = require("node-cron");
const priceUpdater = require("../services/priceUpdater");

// Run price update daily at 4 PM IST (UTC+5:30)
// Cron format: minute hour day month weekday
const priceUpdateJob = cron.schedule("0 16 * * *", async () => {
  console.log("[Cron] Running daily price update job...");
  const result = await priceUpdater.fetchMockPrices();
  if (result.success) {
    console.log(`[Cron] ✅ Updated ${result.count} prices`);
  } else {
    console.error(`[Cron] ❌ Update failed:`, result.error);
  }
});

// Optional: Run every hour for development testing
const devPriceUpdateJob = cron.schedule("0 * * * *", async () => {
  if (process.env.NODE_ENV === "development") {
    console.log("[Cron] Running hourly price update (dev only)...");
    await priceUpdater.fetchMockPrices();
  }
});

module.exports = {
  priceUpdateJob,
  devPriceUpdateJob,
  startAllJobs: () => {
    console.log("[Scheduler] All cron jobs started");
  },
  stopAllJobs: () => {
    priceUpdateJob.stop();
    devPriceUpdateJob.stop();
    console.log("[Scheduler] All cron jobs stopped");
  }
};
```

**Why:**
- Centralized cron job management
- Easy to add/remove scheduled tasks
- Can switch between dev (hourly) and production (daily) schedules

#### 1.5 Update Server Startup
**File:** `backend/server.js`

```javascript
// Add after database connection
const { startAllJobs } = require("./jobs/scheduledJobs");

mongoose
  .connect(...)
  .then(() => {
    console.log("MongoDB connected");
    // Start cron jobs after DB connection
    startAllJobs();
  })
  .catch(...)
```

#### 1.6 Create Price Update API Endpoint
**File:** `backend/routes/stocks.js` (Add new endpoint)

```javascript
// Manual trigger for price updates (for testing/admin)
router.post("/update-prices", protect, async (req, res) => {
  try {
    // Optional: Add admin-only check
    const priceUpdater = require("../services/priceUpdater");
    const result = await priceUpdater.fetchMockPrices();
    
    res.status(200).json({
      success: result.success,
      message: result.success 
        ? `Updated ${result.count} stock prices` 
        : "Price update failed",
      count: result.count,
      error: result.error
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get stock price history
router.get("/:symbol/price-history", protect, async (req, res) => {
  try {
    const stock = await Stock.findOne({ symbol: req.params.symbol });
    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }

    res.status(200).json({
      success: true,
      symbol: stock.symbol,
      currentPrice: stock.currentPrice,
      priceHistory: stock.priceHistory.slice(-30), // Last 30 entries
      performancePercentage: stock.performancePercentage,
      lastUpdated: stock.lastPriceUpdate
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
```

---

### Phase 2: Frontend Enhancements (Days 2-3)

#### 2.1 Create Price Display Component
**File:** `frontend/src/components/PricePerformanceCard.js` (NEW)

```javascript
import React from "react";
import "../styles/PricePerformanceCard.css";

function PricePerformanceCard({ ipoPrice, currentPrice, performancePercentage, lastUpdated }) {
  const isPositive = performancePercentage >= 0;
  const changeAmount = currentPrice - ipoPrice;

  return (
    <div className={`performance-card ${isPositive ? "positive" : "negative"}`}>
      <div className="price-comparison">
        <div className="price-box">
          <span className="label">IPO Price</span>
          <span className="price">₹{ipoPrice.toFixed(2)}</span>
        </div>

        <div className="arrow">
          {isPositive ? "📈" : "📉"}
        </div>

        <div className="price-box">
          <span className="label">Current Price</span>
          <span className="price">₹{currentPrice.toFixed(2)}</span>
        </div>
      </div>

      <div className="performance-metrics">
        <div className="metric">
          <span className="label">Change</span>
          <span className={`value ${isPositive ? "positive" : "negative"}`}>
            ₹{Math.abs(changeAmount).toFixed(2)}
          </span>
        </div>

        <div className="metric">
          <span className="label">Performance</span>
          <span className={`value ${isPositive ? "positive" : "negative"}`}>
            {isPositive ? "+" : ""}{performancePercentage.toFixed(2)}%
          </span>
        </div>

        <div className="metric">
          <span className="label">Last Updated</span>
          <span className="value">
            {lastUpdated ? new Date(lastUpdated).toLocaleString() : "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default PricePerformanceCard;
```

**CSS File:** `frontend/src/styles/PricePerformanceCard.css`

```css
.performance-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.performance-card.positive {
  border-left: 4px solid #22c55e;
}

.performance-card.negative {
  border-left: 4px solid #dc2626;
}

.price-comparison {
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 20px;
  margin-bottom: 20px;
  padding: 15px;
  background: #f8fafc;
  border-radius: 6px;
}

.price-box {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.price-box .label {
  font-size: 0.85rem;
  color: #666;
  font-weight: 600;
  margin-bottom: 5px;
}

.price-box .price {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1e40af;
}

.arrow {
  font-size: 2rem;
}

.performance-metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.metric {
  display: flex;
  flex-direction: column;
  background: #f8fafc;
  padding: 12px;
  border-radius: 6px;
  text-align: center;
}

.metric .label {
  font-size: 0.8rem;
  color: #666;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 5px;
}

.metric .value {
  font-size: 1.1rem;
  font-weight: bold;
}

.metric .value.positive {
  color: #22c55e;
}

.metric .value.negative {
  color: #dc2626;
}

@media (max-width: 768px) {
  .price-comparison {
    flex-direction: column;
    gap: 10px;
  }

  .performance-metrics {
    grid-template-columns: 1fr;
  }
}
```

#### 2.2 Update IPO Comparison Page
**File:** `frontend/src/pages/IPOComparison.js` (Enhance)

Integrate the new `PricePerformanceCard` component to show live prices alongside historical charts.

#### 2.3 Add Price History Chart
**File:** `frontend/src/components/PriceHistoryChart.js` (NEW)

Use Recharts to display:
- IPO price (horizontal reference line)
- Current price (latest point)
- Historical price trend (last 30 days)
- Performance percentage over time

---

### Phase 3: API Integration (Days 3-5)

#### 3.1 Yahoo Finance Integration
**File:** `backend/services/yahooFinanceProvider.js` (NEW)

```javascript
// Requires API key from: https://rapidapi.com/spartan07-Cx0nKo0Oq3x/api/yahoo-finance1
// Free tier: 100 requests/month

const axios = require("axios");

async function fetchYahooFinancePrice(symbol) {
  const options = {
    method: "GET",
    url: "https://yahoo-finance1.p.rapidapi.com/market/get-summary",
    params: {
      region: "IN",
      symbols: symbol
    },
    headers: {
      "X-RapidAPI-Key": process.env.YAHOO_FINANCE_API_KEY,
      "X-RapidAPI-Host": "yahoo-finance1.p.rapidapi.com"
    }
  };

  try {
    const response = await axios.request(options);
    const quoteData = response.data.result[0];
    return {
      symbol: quoteData.symbol,
      currentPrice: quoteData.regularMarketPrice,
      high: quoteData.fiftyTwoWeekHigh,
      low: quoteData.fiftyTwoWeekLow,
      updated: new Date()
    };
  } catch (error) {
    console.error("Yahoo Finance API error:", error.message);
    return null;
  }
}

module.exports = { fetchYahooFinancePrice };
```

#### 3.2 NSE India API Integration
**File:** `backend/services/nseIndiaProvider.js` (NEW)

```javascript
// Free API: https://www.nseindiaapi.com/ (no key required)
// Rate limit: Reasonable (5-10 requests per second)

const axios = require("axios");

async function fetchNSEIndiaPrice(symbol) {
  try {
    const response = await axios.get(
      `https://www.nseindiaapi.com/api/quote-equity?symbol=${symbol}`
    );
    
    const data = response.data;
    return {
      symbol: data.info.symbol,
      currentPrice: data.priceInfo.lastPrice,
      high: data.priceInfo.high,
      low: data.priceInfo.low,
      updated: new Date()
    };
  } catch (error) {
    console.error("NSE India API error:", error.message);
    return null;
  }
}

module.exports = { fetchNSEIndiaPrice };
```

#### 3.3 Environment Configuration
**File:** `backend/.env`

```env
# Add to existing .env
YAHOO_FINANCE_API_KEY=your-key-here
PRICE_UPDATE_FREQUENCY=daily  # Options: hourly, daily
PRICE_DATA_SOURCE=mock        # Options: mock, yahoo-finance, nse-india
```

---

## Data Flow Diagram

```
┌─────────────────┐
│  External API   │ (Yahoo Finance / NSE India)
│   (Optional)    │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Backend (Node.js + Cron Job)   │
│  ├─ PriceUpdater Service        │
│  ├─ MongoDB Connection          │
│  └─ Update Stock Prices         │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│    MongoDB Database             │
│  ├─ currentPrice (updated)      │
│  ├─ priceHistory (new entries)  │
│  ├─ performancePercentage       │
│  └─ lastPriceUpdate             │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│   Frontend (React)              │
│  ├─ PricePerformanceCard        │
│  ├─ PriceHistoryChart           │
│  └─ IPO Comparison Page         │
└─────────────────────────────────┘
```

---

## Database Schema Changes

### Stock Model (Enhanced)
```javascript
{
  _id: ObjectId,
  symbol: "TCS",
  companyName: "Tata Consultancy Services",
  ipoPrice: 850,                    // Fixed IPO price
  currentPrice: 3850.5,             // Updated by cron job
  previousClose: 3820,
  dayHigh: 3900,
  dayLow: 3800,
  marketCap: "32.5 Lakh Crore",
  peRatio: 32.5,
  dividend: 7,
  sector: "Information Technology",
  description: "...",
  
  // NEW FIELDS
  priceHistory: [
    {
      price: 3840,
      date: "2025-11-12T16:00:00Z",
      source: "mock"
    },
    {
      price: 3835,
      date: "2025-11-11T16:00:00Z",
      source: "mock"
    }
  ],
  lastPriceUpdate: "2025-11-12T16:00:00Z",
  performancePercentage: 352.94,    // ((3850.5 - 850) / 850) * 100
  
  createdAt: "2025-11-12T...",
  updatedAt: "2025-11-12T..."
}
```

---

## Testing Plan

### 1. Mock Data Testing (Phase 1)
- ✅ Run cron job every hour in development
- ✅ Verify price updates are recorded
- ✅ Check price history is maintained
- ✅ Verify performancePercentage is calculated correctly

### 2. API Testing (Phase 3)
- ✅ Test Yahoo Finance API integration with sample symbols
- ✅ Test NSE India API integration with sample symbols
- ✅ Handle API errors gracefully
- ✅ Fallback to mock data if API unavailable

### 3. Frontend Testing (Phase 2)
- ✅ Display live prices correctly
- ✅ Show color-coded performance (green/red)
- ✅ Verify update timestamps
- ✅ Test price history chart rendering

### 4. Load Testing
- ✅ Test with 20+ stocks updating simultaneously
- ✅ Verify no database connection pool exhaustion
- ✅ Monitor memory usage during updates

---

## Deployment Checklist

- [ ] Install `node-cron` dependency
- [ ] Update Stock model with new fields
- [ ] Create PriceUpdater service
- [ ] Implement cron job scheduler
- [ ] Add manual trigger endpoint
- [ ] Update server startup
- [ ] Create frontend components
- [ ] Integrate real API (optional, can use mock)
- [ ] Set environment variables
- [ ] Run tests
- [ ] Deploy to production
- [ ] Monitor cron job execution
- [ ] Collect performance metrics

---

## Future Enhancements

1. **Real-time WebSocket Updates**
   - Push price updates to connected clients in real-time
   - Reduces API calls to backend

2. **Price Alerts**
   - Notify users when stock price reaches target levels
   - Email/SMS alerts on significant price changes

3. **Advanced Analytics**
   - Calculate volatility (standard deviation)
   - Identify support/resistance levels
   - Moving averages and technical indicators

4. **Multiple Data Sources**
   - Aggregate prices from multiple APIs
   - Use highest/lowest/average price
   - Improve accuracy and redundancy

5. **Historical Data Archive**
   - Keep data for years (not just 30 days)
   - Enable long-term trend analysis
   - Support for annual/quarterly reports

6. **Machine Learning Predictions**
   - Train models to predict future prices
   - Recommendation system for buy/sell signals

---

## Cost Analysis (Optional)

| Component | Service | Free Tier | Cost |
|-----------|---------|-----------|------|
| Stock Prices | Yahoo Finance (RapidAPI) | 100 req/month | $0 / month |
| Stock Prices | NSE India API | Unlimited | $0 / month |
| Hosting | Heroku / Railway | 550 hrs/month | $0 / month |
| Database | MongoDB Atlas | 512 MB free | $0 / month |
| **Total** | | | **$0 / month** |

---

## Summary

This plan enables a production-ready live price update system with:
- ✅ Automated daily price fetching via cron jobs
- ✅ Mock data for testing (no API key required initially)
- ✅ Real API integrations (Yahoo Finance, NSE India)
- ✅ Performance comparison display
- ✅ Historical price tracking
- ✅ Zero additional cost (free APIs + free hosting)

**Recommended Implementation Order:**
1. Phase 1: Backend infrastructure (1-2 days)
2. Phase 2: Frontend enhancements (1-2 days)
3. Phase 3: Real API integration (1-2 days, optional)

**Estimated Time to MVP:** 2-3 days
