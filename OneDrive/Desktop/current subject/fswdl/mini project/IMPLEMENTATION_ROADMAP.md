# Implementation Roadmap — Stock Market Analysis Web Application

## Project Specification Summary
**One-sentence pitch:** A full-stack stock market analysis web application that enables users to sign up, log in, search for top 20 Indian companies, view historical price trends, and compare company performance with IPO performance through interactive charts and analysis tools.

---

## Feature Spec vs. Current Implementation

### 1. Authentication & User Management ✅ DONE
**Spec requirement:** Signup → Login → JWT/session → Redirect to Dashboard

**Current implementation:**
- ✅ `frontend/src/pages/SignUp.js` — form with name, email, password validation.
- ✅ `frontend/src/pages/Login.js` — login form, token storage in localStorage.
- ✅ `backend/routes/auth.js` — POST /api/auth/register, POST /api/auth/login, GET /api/auth/me.
- ✅ `backend/models/User.js` — user schema with password hashing (bcrypt).
- ✅ `backend/middleware/auth.js` — JWT protect middleware.
- ✅ `frontend/src/App.js` — routing and token validation on app load.

**Status:** Complete and tested (user can sign up and log in).

---

### 2. Dashboard (Summary Cards, Top 20 List, Search Bar) ✅ MOSTLY DONE
**Spec requirement:** Show summary cards, top 20 companies, quick search bar.

**Current implementation:**
- ✅ `frontend/src/pages/Dashboard.js` — displays top 20 companies as cards, search bar filters by symbol/name.
- ✅ `frontend/src/components/StockCard.js` — card UI for each company (symbol, name, price, sector).
- ✅ `backend/routes/stocks.js` — GET /api/stocks returns top 20, GET /api/stocks/search/:query filters.
- ✅ Search works real-time as user types.
- ✅ Click a card to select it and show details in right-side panel.

**Status:** Core functionality complete; minor enhancement: add "View Full Details" link to open the dedicated Stock Detail page.

---

### 3. Company Detail Page (Charts, Fundamentals, IPO Analysis Button) ⚠️ PARTIAL
**Spec requirement:** Historical price chart, fundamentals (PE, market cap, sector), IPO Analysis button.

**Current implementation:**
- ✅ `frontend/src/pages/StockDetail.js` — dedicated page at /stock/:symbol.
- ✅ `frontend/src/components/StockChart.js` — line chart showing historical trend (currently generates mock data).
- ✅ `backend/models/Stock.js` — stock schema includes historicalData array, fundamentals (PE, marketCap, dividend, etc.).
- ✅ Fundamentals displayed in info grid (PE ratio, Market Cap, Dividend Yield, Sector, etc.).
- ❌ **Missing:** Real historical data (currently mock-generated in StockChart component).
- ❌ **Missing:** "IPO Analysis" button or link to open IPO comparison.

**Status:** UI complete; needs real historical data and IPO comparison button.

---

### 4. IPO Comparison / Analysis Page ⚠️ PARTIAL
**Spec requirement:** Dual charts (Company vs IPO), normalized returns, side-by-side comparison.

**Current implementation:**
- ✅ `frontend/src/pages/IPOComparison.js` — dedicated page at /ipo/:symbol.
- ✅ `frontend/src/components/ComparisonChart.js` — renders dual-line chart using Recharts.
- ✅ `backend/routes/ipo.js` — POST /api/ipo/initialize, GET /api/ipo, GET /api/ipo/:symbol, GET /api/ipo/:symbol/comparison.
- ✅ `backend/models/IPO.js` — IPO schema with performanceData.
- ❌ **Missing:** Real integration between Company and IPO selection (UI to pick IPO for comparison).
- ❌ **Missing:** Time range selector (1M, 6M, 1Y, 5Y).
- ❌ **Missing:** Normalized chart (set both to 100 at start date).
- ❌ **Missing:** Metrics display (Return %, volatility, best/worst period).
- ❌ **Missing:** CSV export functionality.

**Status:** Backend endpoints exist; frontend UI needs enhancement (selector, time range, metrics).

---

### 5. Watchlist (Save Favorites) ⚠️ PARTIAL
**Spec requirement:** Add/remove companies to watchlist for monitoring.

**Current implementation:**
- ✅ `backend/routes/auth.js` — POST /api/auth/watchlist endpoint to update user watchlist.
- ❌ **Missing:** Frontend UI to add/remove from watchlist (button on StockDetail or Dashboard).
- ❌ **Missing:** Display user's watchlist on Dashboard.

**Status:** Backend endpoint exists; frontend UI needs implementation.

---

### 6. Historical Data & Background Jobs ❌ NOT IMPLEMENTED
**Spec requirement:** Fetch historical data nightly; support time ranges (1M, 6M, 1Y, 5Y).

**Current implementation:**
- ✅ `backend/models/Stock.js` and `backend/models/IPO.js` have historicalData fields.
- ❌ **Missing:** Real historical data fetch (API integration with Yahoo Finance, AlphaVantage, NSEpy, etc.).
- ❌ **Missing:** Nightly cron job to refresh historical prices.
- ❌ **Missing:** Time range filtering logic (show only last 30 days, 6 months, etc.).

**Status:** Data structure ready; data fetching not implemented (currently mock-generated).

---

### 7. Data Export (CSV) ❌ NOT IMPLEMENTED
**Spec requirement:** Download chart data as CSV.

**Current implementation:**
- ❌ **Missing:** CSV generation and download button.

**Status:** Not started.

---

### 8. Charting Library ✅ DONE
**Spec requirement:** Interactive charts for historical trends and comparisons.

**Current implementation:**
- ✅ Recharts library installed and integrated.
- ✅ `StockChart.js` renders line chart.
- ✅ `ComparisonChart.js` renders dual-line chart.

**Status:** Charts functional; need real data and enhanced controls.

---

## Implementation Priority (Next Steps)

### Phase 1: Make it Work (Minimum Viable Product)
1. **Start backend server** and seed the database with stock/IPO data.
2. **Test end-to-end flow:** Signup → Login → Dashboard search → Click company → View StockDetail.
3. **Verify chart rendering** with mock data in StockDetail.
4. **Add "View Details" link** to StockCard for quick access to StockDetail page.

### Phase 2: Enhance User Experience
1. Add "IPO Analysis" button to StockDetail page (link to /ipo/:symbol).
2. Add watchlist UI (add/remove button on StockDetail).
3. Display watchlist on Dashboard.
4. Add time range selector to StockChart and ComparisonChart.

### Phase 3: Real Data & Advanced Features
1. Replace mock historical data with real data fetch (choose data source: Yahoo Finance, AlphaVantage, NSEpy).
2. Implement normalized chart display (set first day = 100).
3. Add metrics display (Return %, volatility, best/worst period).
4. Add CSV export for chart data.
5. Set up background jobs (cron) to fetch/update historical data nightly.

### Phase 4: Deployment & Polish
1. Fix webpack-dev-server deprecation warnings (upgrade react-scripts or switch to Vite).
2. Add error boundaries and better error handling.
3. Add loading spinners and skeletal screens.
4. Optimize bundle size and performance.
5. Deploy to production (Vercel, Heroku, or custom server).

---

## Developer Checklist (What Needs to Be "Touched")

### Backend Files
- `backend/server.js` — already set up; running on port 5000.
- `backend/routes/auth.js` — complete; signup/login/watchlist working.
- `backend/routes/stocks.js` — GET /api/stocks, /search/:query, /:symbol complete; need to add historical data fetch.
- `backend/routes/ipo.js` — GET /api/ipo, /:symbol, /:symbol/comparison complete.
- `backend/models/Stock.js`, `IPO.js`, `User.js` — schemas complete.
- `backend/middleware/auth.js` — JWT protect middleware complete.
- `backend/data/stocksData.js`, `ipoData.js` — seed data complete.
- **New files needed:**
  - `backend/jobs/fetchHistoricalData.js` — cron job for data refresh.
  - `backend/services/dataService.js` — fetch from external API.

### Frontend Files
- `frontend/src/App.js` — routing complete.
- `frontend/src/pages/Dashboard.js` — complete; search and top 20 list working.
- `frontend/src/pages/StockDetail.js` — complete; add "IPO Analysis" button and watchlist button.
- `frontend/src/pages/IPOComparison.js` — complete; enhance with time range selector and metrics display.
- `frontend/src/components/StockCard.js` — add "View Details" link to open StockDetail.
- `frontend/src/components/StockChart.js` — working with mock data; will auto-update when real data available.
- `frontend/src/components/ComparisonChart.js` — working with mock data; add time range selector and normalized chart option.
- **New components needed:**
  - `frontend/src/components/WatchlistButton.js` — add/remove from watchlist.
  - `frontend/src/components/CSVExportButton.js` — export chart data as CSV.
  - `frontend/src/components/TimeRangeSelector.js` — 1M, 6M, 1Y, 5Y picker.

---

## Quick Wins (Easy Improvements to Start With)

1. **Add "View Details" link to StockCard** (2 min) → opens /stock/:symbol.
2. **Add "IPO Analysis" button to StockDetail** (2 min) → links to /ipo/:symbol.
3. **Add watchlist add/remove UI** (10 min) → frontend button + backend endpoint already exists.
4. **Add time range selector to StockChart** (15 min) → backend route already exists; just add UI filter.

---

## Running the Application

### Start Backend
```powershell
cd "c:\Users\iyapp\OneDrive\Desktop\current subject\fswdl\mini project\backend"
npm install
npm start
```

### Seed Database (One-Time)
```powershell
# In a separate terminal after backend is running:
curl -X POST http://localhost:5000/api/stocks/initialize
curl -X POST http://localhost:5000/api/ipo/initialize
```

### Start Frontend
```powershell
cd "c:\Users\iyapp\OneDrive\Desktop\current subject\fswdl\mini project\frontend"
npm install
npm start
```

### Test Flow
1. Open http://localhost:3000 → Sign up or log in.
2. Go to Dashboard → Search for a company (e.g., "TCS").
3. Click a stock card → View right-side details panel.
4. Click "View Details" link → Open /stock/:symbol for full page.
5. On StockDetail page, click "IPO Analysis" → Go to /ipo/:symbol comparison page.

---

## Known Issues & Limitations

1. **Mock Historical Data:** Charts currently generate random data; replace with real API data.
2. **Webpack Deprecation Warnings:** Dev server shows deprecation for `onAfterSetupMiddleware` and `util._extend`; these don't affect app but can be silenced by upgrading react-scripts or switching to Vite.
3. **No Real Data Source:** Choose and integrate with Yahoo Finance, AlphaVantage, or NSEpy for Indian market data.
4. **No Background Jobs:** Historical data is not auto-refreshed; implement cron job for nightly updates.
5. **Limited Error Handling:** Add more granular error messages and validation.

---

## Success Criteria (MVP Complete)

- [ ] User can sign up and log in.
- [ ] User can view top 20 companies on Dashboard.
- [ ] User can search for a company and filter results.
- [ ] User can click a company to view its StockDetail page.
- [ ] User can view historical price chart (with mock or real data).
- [ ] User can compare a company with an IPO on the IPOComparison page.
- [ ] User can add/remove companies from watchlist.
- [ ] No console errors or ESLint warnings (apart from deprecation warnings from dev tooling).
- [ ] Production build succeeds without errors.

---

## Next Action

**Start the backend server and seed the database, then test the end-to-end flow.**

Commands to run:
1. Start backend in one terminal.
2. Seed DB in another terminal.
3. Start frontend in a third terminal.
4. Open http://localhost:3000 and test signup → login → search → view → IPO analysis.

Once this works, we can add the quick wins and then move to Phase 2 enhancements.
