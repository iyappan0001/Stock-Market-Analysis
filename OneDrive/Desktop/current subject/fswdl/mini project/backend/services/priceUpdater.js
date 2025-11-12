const axios = require("axios");
const Stock = require("../models/Stock");

class PriceUpdater {
  /**
   * Mock price generator for development testing
   * Simulates realistic price movement (±5% variance)
   */
  async fetchMockPrices() {
    try {
      const stocks = await Stock.find();
      if (!stocks || stocks.length === 0) {
        return { success: false, error: "No stocks found in database" };
      }

      let updatedCount = 0;
      for (const stock of stocks) {
        try {
          if (!stock) {
            console.warn("[PriceUpdater] Skipping invalid stock entry (null/undefined)");
            continue;
          }
        // Simulate realistic price movement (±5% variance)
        const variance = (Math.random() - 0.5) * 0.1;
        const newPrice = Math.max(
          stock.currentPrice * (1 + variance),
          stock.currentPrice * 0.8 // Floor: don't drop below 80% of current price
        );

        // Ensure priceHistory exists
        if (!stock.priceHistory) stock.priceHistory = [];
        // Update stock with new price
        try {
          if (!stock.priceHistory) stock.priceHistory = [];
          stock.priceHistory.push({
            price: parseFloat(newPrice.toFixed(2)),
            date: new Date(),
            source: "mock-update",
          });
        } catch (err) {
          console.error(`[PriceUpdater] Failed to push history for ${stock.symbol}:`, err.message);
        }

        stock.currentPrice = parseFloat(newPrice.toFixed(2));
        stock.lastPriceUpdate = new Date();

        // Calculate performance percentage
        if (stock.ipoPrice) {
          stock.performancePercentage =
            ((stock.currentPrice - stock.ipoPrice) / stock.ipoPrice) * 100;
        }

        await stock.save();
        updatedCount++;
        } catch(innerErr) {
          console.error("[PriceUpdater] Error updating single stock:", innerErr.message);
        }
      }

      return {
        success: true,
        message: `Updated ${updatedCount} stock prices`,
        count: updatedCount,
        timestamp: new Date(),
      };
    } catch (error) {
      console.error("[PriceUpdater] Error:", error.message);
      console.error(error.stack);
      return {
        success: false,
        error: error.message,
        count: 0,
      };
    }
  }

  /**
   * Fetch live prices from Yahoo Finance (requires API key)
   * API: https://rapidapi.com/spartan07-Cx0nKo0Oq3x/api/yahoo-finance1
   */
  async fetchLiveYahooFinance(symbol) {
    const apiKey = process.env.YAHOO_FINANCE_API_KEY;
    if (!apiKey) {
      console.warn(
        "[PriceUpdater] Yahoo Finance API key not configured. Using mock data."
      );
      return null;
    }

    try {
      const options = {
        method: "GET",
        url: "https://yahoo-finance1.p.rapidapi.com/market/get-summary",
        params: {
          region: "IN",
          symbols: symbol,
        },
        headers: {
          "X-RapidAPI-Key": apiKey,
          "X-RapidAPI-Host": "yahoo-finance1.p.rapidapi.com",
        },
      };

      const response = await axios.request(options);
      if (response.data.result && response.data.result.length > 0) {
        const quoteData = response.data.result[0];
        return {
          symbol: quoteData.symbol,
          currentPrice: quoteData.regularMarketPrice,
          high: quoteData.fiftyTwoWeekHigh,
          low: quoteData.fiftyTwoWeekLow,
          source: "yahoo-finance",
          updated: new Date(),
        };
      }
    } catch (error) {
      console.error("[PriceUpdater] Yahoo Finance API error:", error.message);
    }

    return null;
  }

  /**
   * Fetch live prices from NSE India API (free, no key required)
   * API: https://www.nseindiaapi.com/
   */
  async fetchLiveNSEIndia(symbol) {
    try {
      const response = await axios.get(
        `https://www.nseindiaapi.com/api/quote-equity?symbol=${symbol}`,
        {
          timeout: 5000,
        }
      );

      if (response.data && response.data.priceInfo) {
        const data = response.data;
        return {
          symbol: data.info.symbol,
          currentPrice: data.priceInfo.lastPrice,
          high: data.priceInfo.high,
          low: data.priceInfo.low,
          source: "nse-india",
          updated: new Date(),
        };
      }
    } catch (error) {
      console.error("[PriceUpdater] NSE India API error:", error.message);
    }

    return null;
  }

  /**
   * Update all stocks with prices from configured data source
   * Falls back to mock data if real API fails
   */
  async updateAllStockPrices() {
    try {
      const dataSource = process.env.PRICE_DATA_SOURCE || "mock";
      console.log(`[PriceUpdater] Updating prices from source: ${dataSource}`);

      if (dataSource === "mock") {
        return await this.fetchMockPrices();
      }

      // If real API source configured, attempt to use it
      const stocks = await Stock.find();
      let successCount = 0;

      for (const stock of stocks) {
        try {
          if (!stock) {
            console.warn("[PriceUpdater] Skipping invalid stock entry (null/undefined)");
            continue;
          }
        let priceData = null;

        if (dataSource === "yahoo-finance") {
          priceData = await this.fetchLiveYahooFinance(stock.symbol);
        } else if (dataSource === "nse-india") {
          priceData = await this.fetchLiveNSEIndia(stock.symbol);
        }

        // Fallback to mock if real API fails
        if (!priceData) {
          const variance = (Math.random() - 0.5) * 0.1;
          priceData = {
            symbol: stock.symbol,
            currentPrice: stock.currentPrice * (1 + variance),
            source: "mock-fallback",
          };
        }

        // Ensure priceHistory exists
        if (!stock.priceHistory) stock.priceHistory = [];
        // Update stock
        try {
          if (!stock.priceHistory) stock.priceHistory = [];
          stock.priceHistory.push({
            price: parseFloat(priceData.currentPrice.toFixed(2)),
            date: new Date(),
            source: priceData.source,
          });
        } catch (err) {
          console.error(`[PriceUpdater] Failed to push history for ${stock.symbol}:`, err.message);
        }

        stock.currentPrice = parseFloat(priceData.currentPrice.toFixed(2));
        stock.lastPriceUpdate = new Date();

        if (stock.ipoPrice) {
          stock.performancePercentage =
            ((stock.currentPrice - stock.ipoPrice) / stock.ipoPrice) * 100;
        }

        await stock.save();
        successCount++;
        } catch(innerErr){
          console.error("[PriceUpdater] Error updating single stock:", innerErr.message);
        }
      }

      return {
        success: true,
        message: `Updated ${successCount} stock prices from ${dataSource}`,
        count: successCount,
        timestamp: new Date(),
      };
    } catch (error) {
      console.error("[PriceUpdater] Fatal error:", error.message);
      console.error(error.stack);
      return {
        success: false,
        error: error.message,
        count: 0,
      };
    }
  }

  /**
   * Get price history for a specific stock
   */
  async getPriceHistory(symbol, limit = 30) {
    try {
      const stock = await Stock.findOne({ symbol });
      if (!stock) {
        return {
          success: false,
          error: "Stock not found",
        };
      }

      return {
        success: true,
        symbol: stock.symbol,
        companyName: stock.companyName,
        currentPrice: stock.currentPrice,
        ipoPrice: stock.ipoPrice,
        performancePercentage: stock.performancePercentage,
        priceHistory: stock.priceHistory.slice(-limit),
        lastUpdated: stock.lastPriceUpdate,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

module.exports = new PriceUpdater();
