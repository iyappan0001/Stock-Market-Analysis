const mongoose = require("mongoose");

const ipoSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    unique: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  ipoDate: {
    type: Date,
    required: true,
  },
  ipoPrice: {
    type: Number,
    required: true,
  },
  currentPrice: {
    type: Number,
    required: true,
  },
  performancePercentage: {
    type: Number,
  },
  listingDate: {
    type: Date,
  },
  sector: {
    type: String,
  },
  underwriter: {
    type: String,
  },
  status: {
    type: String,
    enum: ["upcoming", "live", "listed"],
    default: "listed",
  },
  historicalData: [
    {
      date: Date,
      price: Number,
      performance: Number,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("IPO", ipoSchema);
