# Stock Market Analysis Web Application

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Features](#features)

## 🎯 Project Overview

This is a comprehensive Stock Market Analysis Web Application built with React and Node.js that provides users with:

- **Real-time Stock Data**: Access to top 20 Indian companies
- **User Authentication**: Secure signup and login
- **Interactive Dashboards**: Visual representation of stock trends
- **IPO Analysis**: Compare IPO performance with established stocks
- **Historical Data Tracking**: Monitor stock performance over time
- **Responsive Design**: Works seamlessly on all devices

## 🛠️ Tech Stack

### Frontend

- React 18.2.0
- React Router 6.8.0
- Axios for API calls
- Recharts for data visualization
- CSS3 for styling

### Backend

- Node.js with Express 4.18.2
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- CORS for cross-origin requests

## 📦 Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas)

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file with configuration:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/stock_market
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

4. Install MongoDB locally (if not using Atlas):
   - Download from: https://www.mongodb.com/try/download/community
   - Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

## 🚀 Running the Application

### Start MongoDB

```bash
# If installed locally
mongod

# Or use MongoDB Atlas connection string in .env
```

### Start Backend Server

```bash
cd backend
npm install
npm start
```

Backend runs on: `http://localhost:5000`

### Start Frontend Application

```bash
cd frontend
npm install
npm start
```

Frontend runs on: `http://localhost:3000`

## 📊 API Documentation

### Authentication Endpoints

#### Register User

```
POST /api/auth/signup
Body: {
  firstName: string,
  lastName: string,
  email: string,
  password: string
}
Response: {
  success: true,
  token: string,
  user: { id, firstName, lastName, email }
}
```

#### Login User

```
POST /api/auth/login
Body: {
  email: string,
  password: string
}
Response: {
  success: true,
  token: string,
  user: { id, firstName, lastName, email }
}
```

### Stock Endpoints

#### Get All Stocks

```
GET /api/stocks
Headers: Authorization: Bearer {token}
Response: {
  success: true,
  count: number,
  stocks: [Stock]
}
```

#### Get Specific Stock

```
GET /api/stocks/:symbol
Headers: Authorization: Bearer {token}
Response: {
  success: true,
  stock: Stock
}
```

#### Search Stocks

```
GET /api/stocks/search/:query
Headers: Authorization: Bearer {token}
Response: {
  success: true,
  count: number,
  stocks: [Stock]
}
```

### IPO Endpoints

#### Get All IPOs

```
GET /api/ipo
Headers: Authorization: Bearer {token}
Response: {
  success: true,
  count: number,
  ipos: [IPO]
}
```

#### Get IPO Comparison

```
GET /api/ipo/:symbol/comparison
Headers: Authorization: Bearer {token}
Response: {
  success: true,
  ipo: IPO,
  establishedStock: Stock
}
```

## ✨ Features

### 1. User Authentication

- Secure signup with password validation
- Login with JWT tokens
- Protected routes
- User session management

### 2. Stock Dashboard

- Display top 20 Indian companies
- Real-time price updates
- Search functionality
- Stock information cards with key metrics

### 3. Interactive Charts

- 30-day price trends
- Volume information
- Responsive chart design
- Zoom and pan capabilities

### 4. IPO Analysis

- IPO performance tracking
- Comparison with established stocks
- Historical IPO data
- Performance percentage calculations

### 5. Watchlist

- Add/remove stocks from watchlist
- Personalized portfolio tracking

## 📱 Top 20 Indian Companies Tracked

1. **TCS** - Tata Consultancy Services
2. **INFY** - Infosys Limited
3. **HDFCBANK** - HDFC Bank
4. **RIL** - Reliance Industries
5. **ICICIBANK** - ICICI Bank
6. **SBIN** - State Bank of India
7. **BAJAJFINSV** - Bajaj Finance
8. **LT** - Larsen & Toubro
9. **HINDUNILVR** - Hindustan Unilever
10. **AXISBANK** - Axis Bank
11. **MARUTI** - Maruti Suzuki
12. **WIPRO** - Wipro Limited
13. **NTPC** - NTPC Limited
14. **POWERGRID** - Power Grid Corporation
15. **BHARTIARTL** - Bharti Airtel
16. **HCLTECH** - HCL Technologies
17. **SUNPHARMA** - Sun Pharmaceutical
18. **ASIANPAINT** - Asian Paints
19. **KOTAKBANK** - Kotak Mahindra Bank
20. **ITC** - ITC Limited

## 🔐 Security Features

- Password hashing with bcryptjs
- JWT-based authentication
- CORS protection
- Input validation and sanitization
- Secure token storage

## 📝 Project Structure

```
stock-market-app/
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── StockCard.js
│   │   │   ├── StockChart.js
│   │   │   └── ComparisonChart.js
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── SignUp.js
│   │   │   ├── Dashboard.js
│   │   │   ├── StockDetail.js
│   │   │   └── IPOComparison.js
│   │   ├── styles/
│   │   │   ├── index.css
│   │   │   ├── App.css
│   │   │   ├── Auth.css
│   │   │   ├── Dashboard.css
│   │   │   ├── Navbar.css
│   │   │   ├── StockCard.css
│   │   │   ├── StockChart.css
│   │   │   └── ...
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── backend/
│   ├── routes/
│   │   ├── auth.js
│   │   ├── stocks.js
│   │   └── ipo.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Stock.js
│   │   └── IPO.js
│   ├── middleware/
│   │   └── auth.js
│   ├── data/
│   │   ├── stocksData.js
│   │   └── ipoData.js
│   ├── server.js
│   ├── .env
│   ├── .gitignore
│   └── package.json
└── README.md
```

## 🧪 Testing

To test the application:

1. **Register a new account** at http://localhost:3000/signup
2. **Login** with your credentials
3. **Explore the dashboard** with all 20 stocks
4. **Click on stocks** to view detailed information
5. **Search stocks** using the search bar
6. **Check IPO analysis** for new companies

## 🐛 Troubleshooting

### MongoDB Connection Issues

- Ensure MongoDB is running
- Check connection string in `.env`
- Verify credentials if using MongoDB Atlas

### Port Already in Use

- Backend: Change PORT in `.env`
- Frontend: Set different port in `.env`

### CORS Errors

- Ensure backend is running
- Check proxy setting in `frontend/package.json`

## 📞 Support

For issues or questions, please check:

- Application logs in browser console
- Server logs in terminal
- MongoDB connection status

## 📄 License

MIT License - feel free to use this project for educational purposes.

---

**Developed with ❤️ for Stock Market Analysis**

**Last Updated**: November 2025
