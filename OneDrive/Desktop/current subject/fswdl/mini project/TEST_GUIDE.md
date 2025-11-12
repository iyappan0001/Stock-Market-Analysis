# End-to-End Testing Guide — Stock Market Analysis Application

## Objective
Test the complete user flow: **Signup → Login → Dashboard → Search → View Stock Details → IPO Analysis**.

---

## Prerequisites

### 1. Ensure Backend is Running
- The backend server should be running on `http://localhost:5000`
- MongoDB should be connected and accessible
- If backend is not running, start it:
  ```powershell
  cd "c:\Users\iyapp\OneDrive\Desktop\current subject\fswdl\mini project\backend"
  npm start
  ```
- **Expected output:** You should see:
  ```
  Server is running on port 5000
  MongoDB connected
  ```

### 2. Ensure Frontend is Built and Ready
- Frontend build should be up-to-date (we just ran `npm run build`)
- To start the dev server:
  ```powershell
  cd "c:\Users\iyapp\OneDrive\Desktop\current subject\fswdl\mini project\frontend"
  npm start
  ```
- **Expected:** Browser opens to `http://localhost:3000` showing the login page

---

## Database Seeding (One-Time Setup)

Before testing, you must initialize the database with stock and IPO data. This is a **one-time operation**.

### Option A: Use MongoDB Compass or Direct Database Client
1. Connect to MongoDB on `mongodb://localhost:27017/stock_market`
2. Navigate to the `stocks` collection and insert the sample data from `backend/data/stocksData.js`
3. Navigate to the `ipos` collection and insert the sample data from `backend/data/ipoData.js`

### Option B: Call Initialize Endpoints via Frontend
1. Start both backend and frontend.
2. In the browser console (F12 → Console tab), paste:
   ```javascript
   // Seed stocks
   fetch('/api/stocks/initialize', {method: 'POST', headers: {'Content-Type': 'application/json'}})
     .then(r => r.json())
     .then(d => console.log('Stocks seeded:', d))
     .catch(e => console.error('Error seeding stocks:', e));

   // Seed IPOs
   fetch('/api/ipo/initialize', {method: 'POST', headers: {'Content-Type': 'application/json'}})
     .then(r => r.json())
     .then(d => console.log('IPOs seeded:', d))
     .catch(e => console.error('Error seeding IPOs:', e));
   ```
3. **Expected console output:**
   ```
   Stocks seeded: { success: true, message: "Stocks initialized successfully", count: 20 }
   IPOs seeded: { success: true, message: "IPOs initialized successfully", count: 10 }
   ```

### Option C: Restart Backend (if seeded data exists)
- If the database already has stocks and IPOs seeded, just restart the backend.
- The `/initialize` endpoints return `"Stocks already initialized"` if data exists, which is expected and safe.

---

## Test Flow (Step-by-Step)

### Step 1: Access Login Page
1. Open `http://localhost:3000` in your browser.
2. **Expected:** You should see the **Login page** with:
   - Email input field
   - Password input field
   - "Login" button
   - "Don't have an account? Sign up here" link

### Step 2: Create a New User (Sign Up)
1. Click on **"Sign up here"** link or navigate to `http://localhost:3000/signup`
2. **Expected:** You should see the **Sign Up page** with:
   - First Name input
   - Email input
   - Password input
   - "Sign Up" button

3. Fill in the form:
   - First Name: `TestUser`
   - Email: `testuser@example.com`
   - Password: `password123`

4. Click **"Sign Up"** button.
5. **Expected:** The page redirects to `/dashboard` and shows:
   ```
   Welcome, TestUser!
   Stock Market Analysis Dashboard
   ```
   - Left panel: List of 20 Indian company stock cards (TCS, Reliance, HDFC, etc.)
   - Right panel: Details of the first stock (default selected)
   - Search input: "Search stocks by symbol or name..."

---

### Step 3: Test Search Functionality
1. In the **search input** at the top of the dashboard, type: `TCS`
2. **Expected:** The left panel list updates to show only companies matching "TCS"
   - Should show the TCS card with symbol, company name, current price, and sector

3. Clear the search input (delete "TCS")
4. **Expected:** The list reverts to showing all 20 companies

5. Try another search: `Bank` or `Reliance`
6. **Expected:** Results filter in real-time based on partial matches (symbol or company name)

---

### Step 4: View Stock Details on Dashboard
1. Click on any **stock card** in the left panel (e.g., "TCS").
2. **Expected:**
   - Card background changes to light blue (selected state)
   - Right panel updates to show that stock's details:
     - Company name and symbol
     - Current price (in ₹)
     - Change % (green if up, red if down)
     - Info grid: Day High, Day Low, Market Cap, P/E Ratio, Dividend, Sector
     - Company description
     - Historical price chart showing 30-day trend

---

### Step 5: Open Full Stock Detail Page
1. In the right panel (or on the dashboard left), locate the stock card and look for the **"View Details →"** link in the card footer.
2. Click **"View Details →"**.
3. **Expected:** The page navigates to `/stock/TCS` (or whichever stock you chose) and displays:
   - Full-page header: Company name and symbol
   - Current Price section (large price display)
   - Change section (% change since previous close)
   - Historical price chart
   - Full stock information grid (Previous Close, Day High/Low, Market Cap, P/E, Dividend, Sector)
   - Company description
   - **NEW** "📊 Compare with IPO Performance" button at the bottom

---

### Step 6: Test IPO Comparison Flow
1. On the **Stock Detail page**, scroll to the bottom and click the **"📊 Compare with IPO Performance"** button.
2. **Expected:** The page navigates to `/ipo/TCS` and displays:
   - IPO Comparison page header: "IPO Comparison — TCS"
   - Two side-by-side charts:
     - Left: Historical price trend of the company (TCS)
     - Right: IPO performance data
   - Both charts render line graphs with mock data points
   - Chart legends and interactive tooltips (hover to see values)

---

### Step 7: Navigate Back to Dashboard
1. Click on the **Navbar** at the top (if visible) or use browser back button.
2. **Expected:** You return to the Dashboard.
3. The stock list and search remain as you left them.

---

### Step 8: Test Logout
1. Click the **"Logout"** button in the Navbar (top-right).
2. **Expected:** You are redirected to the login page.
3. localStorage token is cleared.
4. Attempting to access `/dashboard` without logging in redirects back to `/login`.

---

## Expected UI Behavior

### Dashboard
- ✅ Search input filters stocks by symbol and company name in real-time
- ✅ Clicking a stock card selects it and updates the right panel
- ✅ Stock card shows "View Details →" link
- ✅ Right panel shows summary info and chart for selected stock
- ✅ Navbar displays user's first name and logout button

### Stock Detail Page
- ✅ Page loads full stock record from backend
- ✅ Displays current price, change %, and information grid
- ✅ Historical chart renders with mock or real data
- ✅ "Compare with IPO Performance" button is visible at the bottom
- ✅ Clicking the button navigates to `/ipo/:symbol`

### IPO Comparison Page
- ✅ Dual charts render (company vs IPO)
- ✅ Charts display mock historical data points
- ✅ Page title shows the stock symbol being compared

---

## Common Test Scenarios

### Scenario A: User Registers and Searches for Multiple Stocks
1. Sign up with a unique email
2. Search for "TCS" → view details → click "Compare with IPO"
3. Use browser back button to return
4. Search for "Reliance" → view details → IPO comparison
5. Verify navigation and data updates correctly

### Scenario B: Session Persistence
1. Log in
2. Go to Dashboard
3. Refresh the page (F5)
4. **Expected:** Dashboard remains, user is still logged in (token persists in localStorage)

### Scenario C: Token Expiration (Optional)
1. Log in
2. Open browser DevTools (F12) → Application → LocalStorage
3. Delete the `token` key
4. Refresh or navigate to Dashboard
5. **Expected:** Redirected to login page

---

## Checking Backend Logs

While testing, monitor the backend terminal for:

### Successful Requests (Expected)
```
GET /api/stocks/search/tcs
GET /api/stocks/TCS
GET /api/ipo/TCS
```

### Errors to Watch For
- `MongoDB connection error` → Database not running
- `Cannot find stock` → Initialize endpoints not called
- `JWT validation failed` → Token issue; try logging in again
- `Port 5000 already in use` → Kill existing process and restart backend

---

## Verifying Chart Data

### Mock Data Behavior
- `StockChart` component generates random historical data if none exists in the database
- Charts should display a line graph with 30+ data points
- Y-axis shows price values; X-axis shows dates

### With Real Historical Data (Future)
- Once you integrate a real data source (Yahoo Finance, AlphaVantage), charts will display actual historical prices
- Data should update nightly via a background job

---

## Success Criteria (All Tests Pass)

- [ ] Sign up creates a new user
- [ ] Login with correct credentials succeeds; redirects to Dashboard
- [ ] Dashboard loads with 20 stock cards
- [ ] Search filters stocks by symbol and name in real-time
- [ ] Clicking a stock card selects it and updates right panel
- [ ] "View Details →" link opens full stock detail page
- [ ] Stock Detail page displays all information and chart
- [ ] "Compare with IPO Performance" button is visible and clickable
- [ ] Clicking the button navigates to IPO comparison page
- [ ] IPO comparison page displays dual charts
- [ ] Logout clears session and redirects to login
- [ ] Navigating without token redirects to login
- [ ] No console errors (apart from webpack deprecation warnings)
- [ ] Frontend build succeeds without errors

---

## Troubleshooting

### Issue: "Cannot find route /stock/:symbol"
**Solution:** Ensure frontend dev server is running and routes are registered in `App.js`.

### Issue: "Failed to fetch stocks" on Dashboard
**Solution:** 
1. Check backend is running (see "Prerequisites" → "Ensure Backend is Running")
2. Check MongoDB is connected
3. Check stocks are initialized (call `/api/stocks/initialize`)

### Issue: Charts not rendering
**Solution:** 
1. Check browser console for errors (F12 → Console)
2. Ensure Recharts library is installed (`npm list recharts`)
3. Verify stock has historicalData in the database

### Issue: Logout button not visible
**Solution:** Check Navbar component is rendered in App.js when `isAuthenticated` is true.

### Issue: Search returns no results
**Solution:** Verify stocks are seeded in the database and the search query matches a symbol or company name.

---

## Next Steps After Testing

Once all tests pass:
1. **Add watchlist UI** — button to add/remove stocks from watchlist
2. **Add time range selector** — allow filtering by 1M, 6M, 1Y, 5Y
3. **Integrate real data** — replace mock historical data with real API (Yahoo Finance, etc.)
4. **Add metrics display** — show return %, volatility, best/worst period on IPO comparison
5. **CSV export** — download chart data as CSV
6. **Background jobs** — nightly historical data refresh via cron

---

## Quick Reference

| Action | URL | Expected |
|--------|-----|----------|
| Home | `http://localhost:3000` | Redirects to `/login` or `/dashboard` |
| Login | `http://localhost:3000/login` | Login form |
| Sign Up | `http://localhost:3000/signup` | Sign up form |
| Dashboard | `http://localhost:3000/dashboard` | Stock list + search + details |
| Stock Detail | `http://localhost:3000/stock/TCS` | Full stock page with "IPO Compare" button |
| IPO Comparison | `http://localhost:3000/ipo/TCS` | Dual charts (Company vs IPO) |

---

**Happy Testing! 🚀**
