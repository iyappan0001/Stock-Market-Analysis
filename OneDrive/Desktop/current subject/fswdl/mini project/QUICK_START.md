# 🚀 Quick Start Guide

## Step 1: Install Dependencies

### Backend Setup

```powershell
cd backend
npm install
```

### Frontend Setup

```powershell
cd frontend
npm install
```

## Step 2: Setup MongoDB

### Option A: Local MongoDB

1. Download MongoDB Community Edition from: https://www.mongodb.com/try/download/community
2. Install it following the official guide
3. Start MongoDB:
   ```powershell
   mongod
   ```
4. Verify connection - MongoDB should be running on `mongodb://localhost:27017`

### Option B: MongoDB Atlas (Cloud - Recommended)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster
4. Get your connection string
5. Update `.env` in backend folder:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/stock_market
   ```

## Step 3: Configure Backend

1. Open `backend/.env`
2. Ensure it has:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/stock_market
   JWT_SECRET=stock_market_secret_key_2025
   NODE_ENV=development
   ```

## Step 4: Start the Application

### Terminal 1: Start Backend Server

```powershell
cd backend
npm start
```

✅ You should see: `Server is running on port 5000`
✅ MongoDB connection message should appear

### Terminal 2: Start Frontend Application

```powershell
cd frontend
npm start
```

✅ Browser will open automatically at `http://localhost:3000`

## Step 5: Initialize Database (First Time Only)

1. Once both servers are running, go to browser
2. Navigate to: `http://localhost:5000/api/stocks/initialize`
3. You should see success message
4. Navigate to: `http://localhost:5000/api/ipo/initialize`
5. You should see success message

## Step 6: Test the Application

1. **Sign Up**: Create a new account

   - Go to http://localhost:3000/signup
   - Fill in details and submit

2. **Login**: Login with your credentials

   - Go to http://localhost:3000/login
   - Enter email and password

3. **Dashboard**: View stocks

   - See all 20 stocks
   - Click on any stock to view details
   - Use search to find specific stocks

4. **Stock Details**: View detailed information
   - Click on a stock card
   - See price trends in chart
   - View key metrics (P/E Ratio, Market Cap, etc.)

## 📁 Project Files Created

```
mini project/
├── backend/
│   ├── data/
│   │   ├── stocksData.js
│   │   └── ipoData.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── IPO.js
│   │   ├── Stock.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── ipo.js
│   │   └── stocks.js
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── ComparisonChart.js
│   │   │   ├── Navbar.js
│   │   │   ├── StockCard.js
│   │   │   └── StockChart.js
│   │   ├── pages/
│   │   │   ├── Dashboard.js
│   │   │   ├── IPOComparison.js
│   │   │   ├── Login.js
│   │   │   ├── SignUp.js
│   │   │   └── StockDetail.js
│   │   ├── styles/
│   │   │   ├── App.css
│   │   │   ├── Auth.css
│   │   │   ├── ComparisonChart.css
│   │   │   ├── Dashboard.css
│   │   │   ├── IPOComparison.css
│   │   │   ├── Navbar.css
│   │   │   ├── StockCard.css
│   │   │   ├── StockChart.css
│   │   │   ├── StockDetail.css
│   │   │   └── index.css
│   │   ├── App.js
│   │   └── index.js
│   ├── .gitignore
│   └── package.json
├── README.md
└── SETUP_GUIDE.md
```

## ✨ Features Included

✅ User Authentication (Signup/Login)
✅ Top 20 Indian Companies Data
✅ Real-time Stock Prices
✅ Interactive Price Charts
✅ Stock Search Functionality
✅ IPO Performance Analysis
✅ Responsive Design
✅ Secure JWT Authentication
✅ MongoDB Database Integration
✅ API Documentation

## 🔧 Troubleshooting

### "Cannot connect to MongoDB"

- Check if MongoDB is running
- Verify connection string in `.env`
- For Atlas: ensure IP whitelist includes your IP

### "Port 5000 already in use"

- Kill process on port 5000:
  ```powershell
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  ```
- Or change PORT in `.env`

### "Proxy error in frontend"

- Ensure backend is running before frontend
- Check `package.json` proxy setting: `"proxy": "http://localhost:5000"`

### "CORS error"

- Ensure backend is running
- Check CORS is enabled in `server.js`

## 📊 API Endpoints Summary

| Method | Endpoint                    | Description            |
| ------ | --------------------------- | ---------------------- |
| POST   | /api/auth/signup            | Register new user      |
| POST   | /api/auth/login             | Login user             |
| GET    | /api/auth/me                | Get current user       |
| PUT    | /api/auth/watchlist         | Update watchlist       |
| GET    | /api/stocks                 | Get all stocks         |
| GET    | /api/stocks/:symbol         | Get specific stock     |
| GET    | /api/stocks/search/:query   | Search stocks          |
| POST   | /api/stocks/initialize      | Initialize stock data  |
| GET    | /api/ipo                    | Get all IPOs           |
| GET    | /api/ipo/:symbol/comparison | Compare IPO with stock |
| POST   | /api/ipo/initialize         | Initialize IPO data    |

## 📚 Next Steps

1. Explore the dashboard and stock details
2. Add stocks to your watchlist
3. Analyze IPO performance
4. Customize the UI styling
5. Add more stocks or IPOs to the database
6. Deploy to production

## 🎓 Learning Resources

- React Documentation: https://react.dev
- Express.js Guide: https://expressjs.com
- MongoDB Tutorial: https://docs.mongodb.com
- Recharts Documentation: https://recharts.org

---

**Happy Trading! 📈**
