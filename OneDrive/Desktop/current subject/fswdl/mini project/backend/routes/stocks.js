const express = require("express");
const Stock = require("../models/Stock");
const { protect } = require("../middleware/auth");
const stocksData = require("../data/stocksData");
const priceUpdater = require("../services/priceUpdater");

const router = express.Router();

// Initialize stocks data (call this once to populate database)
router.post("/initialize", async (req, res) => {
  try {
    // Check if stocks already exist
    const existingStocks = await Stock.countDocuments();
    if (existingStocks > 0) {
      return res.status(400).json({ message: "Stocks already initialized" });
    }

    // Insert stock data
    const stocks = await Stock.insertMany(stocksData);
    res.status(201).json({
      success: true,
      message: "Stocks initialized successfully",
      count: stocks.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all stocks
router.get("/", async (req, res) => {
  try {
    const stocks = await Stock.find().select("-historicalData");
    res.status(200).json({
      success: true,
      count: stocks.length,
      stocks,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get specific stock
router.get("/:symbol", async (req, res) => {
  try {
    const stock = await Stock.findOne({ symbol: req.params.symbol });
    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }
    res.status(200).json({
      success: true,
      stock,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get historical data for a stock
router.get("/:symbol/history", async (req, res) => {
  try {
    const stock = await Stock.findOne({ symbol: req.params.symbol });
    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }

    res.status(200).json({
      success: true,
      symbol: stock.symbol,
      companyName: stock.companyName,
      historicalData: stock.historicalData,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search stocks
router.get("/search/:query", async (req, res) => {
  try {
    const query = req.params.query;
    const stocks = await Stock.find({
      $or: [
        { symbol: new RegExp(query, "i") },
        { companyName: new RegExp(query, "i") },
      ],
    }).select("-historicalData");

    res.status(200).json({
      success: true,
      count: stocks.length,
      stocks,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Manually trigger price update for all stocks
router.post("/update-prices", async (req, res) => {
  try {
    const result = await priceUpdater.updateAllStockPrices();
    res.status(200).json({
      success: result.success,
      message: result.message,
      count: result.count,
      timestamp: result.timestamp,
      error: result.error || null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating prices",
      error: error.message,
    });
  }
});

// Get price history for a specific stock
router.get("/:symbol/price-history", async (req, res) => {
  try {
    const result = await priceUpdater.getPriceHistory(
      req.params.symbol,
      req.query.limit || 30
    );

    if (!result.success) {
      return res.status(404).json(result);
    }

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching price history",
      error: error.message,
    });
  }
});

module.exports = router;
