# Stock Market Analysis Web Application

A comprehensive web application for analyzing Indian stock market data with real-time insights, user authentication, and interactive visualizations.

## 🎯 Features

- **User Authentication**: Secure signup and login with JWT tokens
- **Stock Dashboard**: Real-time display of top 20 Indian companies
- **Interactive Charts**: Visual representation of stock trends using Recharts
- **IPO Analysis**: Compare IPO performance with established companies
- **Historical Data**: Track stock performance over time
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🏗️ Project Structure

```
stock-market-app/
├── frontend/              # React application
│   ├── src/
│   │   ├── components/   # Reusable React components
│   │   ├── pages/        # Page components
│   │   ├── styles/       # CSS files
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   └── package.json
├── backend/              # Node.js/Express server
│   ├── routes/          # API routes
│   ├── models/          # Database models
│   ├── controllers/      # Business logic
│   ├── middleware/       # Authentication & validation
│   ├── data/            # Stock data
│   ├── server.js
│   ├── .env
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas)

### Backend Setup

1. Navigate to backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file with your configuration:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/stock_market
JWT_SECRET=your_secret_key_here
```

4. Start the server:

```bash
npm start
```

### Frontend Setup

1. Navigate to frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

The application will open at `http://localhost:3000`

## 📊 Top 20 Indian Companies Tracked

1. TCS (Tata Consultancy Services)
2. Infosys
3. HDFC Bank
4. Reliance Industries
5. ICICI Bank
6. State Bank of India
7. Bajaj Finance
8. LT (Larsen & Toubro)
9. Hindustan Unilever
10. Axis Bank
11. Maruti Suzuki
12. Wipro
13. NTPC
14. Power Grid Corporation
15. Bharti Airtel
16. HCL Technologies
17. Sun Pharmaceutical
18. Asian Paints
19. Kotak Mahindra Bank
20. ITC Limited

## 🔒 Security

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Input validation and sanitization

## 📝 API Endpoints

### Authentication

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Stocks

- `GET /api/stocks` - Get all stocks
- `GET /api/stocks/:symbol` - Get specific stock data
- `GET /api/stocks/history/:symbol` - Get historical data

### IPO

- `GET /api/ipo` - Get all IPO data
- `GET /api/ipo/:symbol` - Get specific IPO comparison

## 🛠️ Tech Stack

- **Frontend**: React, Recharts, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (jsonwebtoken)
- **Security**: bcryptjs

## 📄 License

MIT License

## 👨‍💼 Authors

Stock Market Analysis Team

---

**Last Updated**: November 2025
