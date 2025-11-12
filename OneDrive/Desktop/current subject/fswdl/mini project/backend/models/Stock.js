const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    unique: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  currentPrice: {
    type: Number,
    required: true,
  },
  previousClose: {
    type: Number,
    required: true,
  },
  dayHigh: {
    type: Number,
    required: true,
  },
  dayLow: {
    type: Number,
    required: true,
  },
  marketCap: {
    type: String,
    required: true,
  },
  peRatio: {
    type: Number,
  },
  dividend: {
    type: Number,
  },
  sector: {
    type: String,
  },
  description: {
    type: String,
  },
  historicalData: [
    {
      date: Date,
      price: Number,
      volume: Number,
    },
  ],
  // Price history entries for automated updates and charting
  priceHistory: [
    {
      price: { type: Number },
      date: { type: Date, default: Date.now },
      source: { type: String },
    },
  ],
  // IPO issue price (optional) used to calculate performance vs IPO
  ipoPrice: {
    type: Number,
  },
  // Timestamp of last automated price update
  lastPriceUpdate: {
    type: Date,
  },
  // Percentage performance vs IPO price
  performancePercentage: {
    type: Number,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Helper method to update price and push to history
stockSchema.methods.updatePrice = async function (newPrice, source = "manual") {
  if (!this.priceHistory) this.priceHistory = [];
  this.priceHistory.push({ price: newPrice, date: new Date(), source });
  this.currentPrice = newPrice;
  this.lastPriceUpdate = new Date();
  if (this.ipoPrice) {
    this.performancePercentage = ((this.currentPrice - this.ipoPrice) / this.ipoPrice) * 100;
  }
  return this.save();
};

module.exports = mongoose.model("Stock", stockSchema);
