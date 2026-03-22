require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const stockRoutes = require("./routes/stocks");
const ipoRoutes = require("./routes/ipo");
const { startAllJobs, stopAllJobs } = require("./jobs/scheduledJobs");
const Stock = require("./models/Stock");
const IPO = require("./models/IPO");
const stocksData = require("./data/stocksData");
const ipoData = require("./data/ipoData");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection (robust, with startup gating)
const connectDB = async () => {
  const mongoUri =
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/stock_market";

  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    console.log("MongoDB connected");
    
    // Auto-initialize data if empty
    const initializeData = async () => {
      try {
        const stockCount = await Stock.countDocuments();
        if (stockCount === 0) {
          await Stock.insertMany(stocksData);
          console.log(`✓ Initialized ${stocksData.length} stocks`);
        }
        
        const ipoCount = await IPO.countDocuments();
        if (ipoCount === 0) {
          await IPO.insertMany(ipoData);
          console.log(`✓ Initialized ${ipoData.length} IPOs`);
        }
      } catch (err) {
        console.error("Data initialization error:", err.message);
      }
    };
    
    await initializeData();
    startAllJobs();

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB disconnected");
    });
  } catch (err) {
    console.error("Database connection error:", err);
    process.exit(1);
  }
};

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/stocks", stockRoutes);
app.use("/api/ipo", ipoRoutes);

// Start server after DB connect
connectDB();

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ message: "Something went wrong!", error: err.message });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully...");
  stopAllJobs();
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully...");
  stopAllJobs();
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});
