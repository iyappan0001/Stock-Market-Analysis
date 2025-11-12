# 🛠️ Development & Deployment Guide

## 🚀 Running the Application

### Development Mode

#### Backend (Terminal 1)

```powershell
cd backend
npm start
```

- Runs on: http://localhost:5000
- Auto-restart on file changes (if nodemon is installed)

#### Frontend (Terminal 2)

```powershell
cd frontend
npm start
```

- Runs on: http://localhost:3000
- Auto-refresh on file changes

### Development with Nodemon (Backend Auto-Reload)

```powershell
cd backend
npm install -g nodemon  # Install globally (one time)
npm run dev
```

## 📦 npm Commands

### Backend Commands

```powershell
cd backend

# Install dependencies
npm install

# Start server
npm start

# Start with auto-reload (if configured)
npm run dev

# Install specific packages
npm install express mongoose jsonwebtoken bcryptjs

# Uninstall packages
npm uninstall package-name
```

### Frontend Commands

```powershell
cd frontend

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Eject configuration (one-way operation!)
npm run eject
```

## 🔧 Managing Dependencies

### Add New Packages

#### Backend Example

```powershell
cd backend
npm install cors dotenv validator
```

#### Frontend Example

```powershell
cd frontend
npm install axios react-router-dom recharts
```

### Update Packages

```powershell
npm update
```

### Check Outdated Packages

```powershell
npm outdated
```

## 📝 Code Structure Guide

### Backend File Organization

```
backend/
├── server.js              # Entry point
├── .env                   # Environment variables
├── routes/
│   ├── auth.js           # Authentication routes
│   ├── stocks.js         # Stock routes
│   └── ipo.js            # IPO routes
├── models/
│   ├── User.js           # User schema
│   ├── Stock.js          # Stock schema
│   └── IPO.js            # IPO schema
├── middleware/
│   └── auth.js           # JWT verification
├── data/
│   ├── stocksData.js     # Stock seed data
│   └── ipoData.js        # IPO seed data
└── package.json
```

### Frontend File Organization

```
frontend/src/
├── App.js                # Main component
├── index.js              # Entry point
├── pages/
│   ├── Login.js
│   ├── SignUp.js
│   ├── Dashboard.js
│   ├── StockDetail.js
│   └── IPOComparison.js
├── components/
│   ├── Navbar.js
│   ├── StockCard.js
│   ├── StockChart.js
│   └── ComparisonChart.js
└── styles/
    ├── index.css
    ├── App.css
    ├── Auth.css
    ├── Dashboard.css
    └── ...
```

## 🐛 Debugging

### Backend Debugging

#### Check Server Status

```powershell
# Check if port 5000 is in use
netstat -ano | findstr :5000

# Kill process on port 5000
taskkill /PID <PID> /F
```

#### View Server Logs

- Check terminal output for errors
- Look for "Server is running on port 5000"
- Check MongoDB connection status

### Frontend Debugging

#### Browser Console

- Open DevTools: F12 or Right-click > Inspect
- Check Console tab for errors
- Use Network tab to see API calls

#### React Developer Tools

- Install React DevTools browser extension
- Check component hierarchy
- Inspect props and state

## 🗄️ Database Operations

### MongoDB Commands

#### Connect to Local MongoDB

```powershell
# Open MongoDB shell
mongo

# Show all databases
show databases

# Use specific database
use stock_market

# Show all collections
show collections

# View collection data
db.users.find()
db.stocks.find()
db.ipos.find()
```

### Initialize Data

#### Backend Endpoints for Initialization

```
POST http://localhost:5000/api/stocks/initialize
POST http://localhost:5000/api/ipo/initialize
```

Or using curl:

```powershell
curl -X POST http://localhost:5000/api/stocks/initialize
curl -X POST http://localhost:5000/api/ipo/initialize
```

## 🚀 Production Build

### Build Frontend for Production

```powershell
cd frontend
npm run build
```

- Creates optimized build in `build/` folder
- Ready to deploy to Netlify, Vercel, or other hosts

### Prepare Backend for Production

```powershell
cd backend
# Update .env
NODE_ENV=production
PORT=5000
MONGODB_URI=<production-mongodb-uri>
JWT_SECRET=<strong-secret-key>
```

## 📱 Testing the Application

### Test Authentication

1. Visit http://localhost:3000/signup
2. Create new account (First Name, Last Name, Email, Password)
3. Should redirect to dashboard
4. Try logging out and logging back in

### Test Stock Dashboard

1. Login successfully
2. See 20 stocks displayed
3. Search for a stock (e.g., "TCS")
4. Click on a stock to see details
5. View price chart

### Test API Directly

#### Using Postman or Curl

##### Sign Up

```powershell
curl -X POST http://localhost:5000/api/auth/signup `
  -H "Content-Type: application/json" `
  -d '{
    "firstName":"John",
    "lastName":"Doe",
    "email":"john@example.com",
    "password":"password123"
  }'
```

##### Get Stocks

```powershell
curl -X GET http://localhost:5000/api/stocks `
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 📊 Performance Optimization

### Frontend Optimization

- Code splitting with React.lazy()
- Image optimization
- CSS minification (automatic with build)
- Remove console.logs before production

### Backend Optimization

- Database indexing
- Response compression
- Connection pooling
- Caching strategies

## 🔒 Security Checklist

- [ ] Change JWT_SECRET in production
- [ ] Use HTTPS in production
- [ ] Enable CORS only for trusted domains
- [ ] Validate all user inputs
- [ ] Use strong passwords
- [ ] Keep dependencies updated
- [ ] Enable MongoDB authentication
- [ ] Use environment variables for secrets

## 🌐 Deployment Options

### Backend Deployment

#### Heroku

```powershell
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Deploy
git push heroku main
```

#### AWS/Azure

- Use EC2/App Service
- Configure environment variables
- Set up database
- Deploy from GitHub

### Frontend Deployment

#### Vercel

```powershell
npm install -g vercel
vercel
```

#### Netlify

```powershell
npm install -g netlify-cli
netlify deploy --prod
```

## 📚 Environment Variables

### Backend (.env)

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/stock_market
JWT_SECRET=stock_market_secret_key_2025
NODE_ENV=development
```

### Frontend (.env.local)

```
REACT_APP_API_URL=http://localhost:5000
```

## 🛠️ Troubleshooting Commands

```powershell
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -r node_modules
npm install

# Check npm version
npm --version

# Check Node version
node --version

# Check if port is open
netstat -an | findstr :5000

# Kill process on port
lsof -i :5000
kill -9 <PID>
```

## 📞 Getting Help

1. Check browser console for errors (F12)
2. Check terminal for backend errors
3. Verify MongoDB is running
4. Ensure ports 3000 and 5000 are available
5. Check .env file configuration
6. Look at API response in Network tab

## 🎓 Useful Resources

- Node.js Best Practices: https://nodejs.org/en/docs/guides/nodejs-web-app-without-a-framework/
- Express Security: https://expressjs.com/en/advanced/best-practice-security.html
- React Performance: https://react.dev/reference/react/useMemo
- MongoDB Indexing: https://docs.mongodb.com/manual/indexes/

---

**Happy Development! 🚀**
