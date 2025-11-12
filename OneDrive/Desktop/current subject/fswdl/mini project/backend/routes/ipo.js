const express = require("express");
const IPO = require("../models/IPO");
const Stock = require("../models/Stock");
const { protect } = require("../middleware/auth");
const ipoData = require("../data/ipoData");

const router = express.Router();

// Initialize IPO data
router.post("/initialize", async (req, res) => {
  try {
    const existingIPOs = await IPO.countDocuments();
    if (existingIPOs > 0) {
      return res.status(400).json({ message: "IPO data already initialized" });
    }

    const ipos = await IPO.insertMany(ipoData);
    res.status(201).json({
      success: true,
      message: "IPO data initialized successfully",
      count: ipos.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all IPOs
router.get("/", async (req, res) => {
  try {
    const ipos = await IPO.find().select("-historicalData");
    res.status(200).json({
      success: true,
      count: ipos.length,
      ipos,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get specific IPO
router.get("/:symbol", async (req, res) => {
  try {
    const ipo = await IPO.findOne({ symbol: req.params.symbol });
    if (!ipo) {
      return res.status(404).json({ message: "IPO not found" });
    }
    res.status(200).json({
      success: true,
      ipo,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get IPO vs established stock comparison
router.get("/:symbol/comparison", async (req, res) => {
  try {
    const symbol = req.params.symbol;
    const ipo = await IPO.findOne({ symbol });
    const stock = await Stock.findOne({ symbol });

    if (!ipo) {
      return res.status(404).json({ message: "IPO not found" });
    }

    res.status(200).json({
      success: true,
      ipo: {
        symbol: ipo.symbol,
        companyName: ipo.companyName,
        ipoPrice: ipo.ipoPrice,
        currentPrice: ipo.currentPrice,
        performancePercentage: ipo.performancePercentage,
        historicalData: ipo.historicalData,
      },
      establishedStock: stock
        ? {
            symbol: stock.symbol,
            companyName: stock.companyName,
            currentPrice: stock.currentPrice,
            previousClose: stock.previousClose,
            historicalData: stock.historicalData,
          }
        : null,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get IPO performance analysis
router.get("/analysis/performance", async (req, res) => {
  try {
    const ipos = await IPO.find();

    const analysis = {
      totalIPOs: ipos.length,
      bestPerformer: ipos.reduce((max, ipo) =>
        ipo.performancePercentage > (max.performancePercentage || -Infinity)
          ? ipo
          : max
      ),
      worstPerformer: ipos.reduce((min, ipo) =>
        ipo.performancePercentage < (min.performancePercentage || Infinity)
          ? ipo
          : min
      ),
      averagePerformance: (
        ipos.reduce((sum, ipo) => sum + (ipo.performancePercentage || 0), 0) /
        ipos.length
      ).toFixed(2),
    };

    res.status(200).json({
      success: true,
      analysis,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
