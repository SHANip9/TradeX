/**
 * ============================================================================
 * Live Market Price Engine & Portfolio History (priceEngine.js)
 * ============================================================================
 * Purpose:
 *   Simulates a real-time financial market exchange ticker.
 *   - Generates stochastic price oscillations (random walk / Brownian drift).
 *   - Emits live "tick" events to recalculate portfolio holdings in real-time.
 *   - Maintains in-memory time-series history of portfolio valuation for charts.
 *
 * Key Classes:
 *   1. PriceEngine: EventEmitter that updates asset quotes periodically (default 3s).
 *   2. PortfolioHistory: Ring-buffer / limited history store for valuation snapshots.
 * ============================================================================
 */

const EventEmitter = require("events");

// Interval in milliseconds between market ticks (default 3000ms)
const TICK_INTERVAL_MS = Number(process.env.TICK_INTERVAL_MS || 3000);
// Maximum number of historical price points kept in memory for graph rendering
const HISTORY_LIMIT = 500;

// Base seed stock quotes for initial market bootstrap
const seedSymbols = {
  BHARTIARTL: 541.15,
  HDFCBANK: 1522.35,
  HINDUNILVR: 2417.4,
  INFY: 1555.45,
  ITC: 207.9,
  KPITTECH: 266.45,
  "M&M": 779.8,
  RELIANCE: 2112.4,
  SBIN: 430.2,
  TATAPOWER: 124.15,
  TCS: 3194.8,
  WIPRO: 577.75,
  ONGC: 116.8,
  QUICKHEAL: 308.55,
  EVEREADY: 312.35,
  JUBLFOOD: 3082.65,
};

/**
 * PriceEngine Class
 * Manages live quotation prices for all registered stocks and triggers updates.
 */
class PriceEngine extends EventEmitter {
  constructor() {
    super();
    this.quotes = new Map();
    this.timer = null;

    // Seed market with default stocks and starting prices
    Object.entries(seedSymbols).forEach(([symbol, price]) => {
      this.register(symbol, price);
    });
  }

  /**
   * Registers a new stock symbol in the quotation map.
   * @param {string} symbol - Ticker symbol
   * @param {number} price - Initial opening price
   */
  register(symbol, price) {
    if (!symbol || this.quotes.has(symbol)) return;
    const basePrice = Number(price) > 0 ? Number(price) : 100;
    this.quotes.set(symbol, {
      symbol,
      price: basePrice,
      open: basePrice,
      dayChangePercent: 0,
      updatedAt: new Date().toISOString(),
    });
  }

  /**
   * Returns current quote for a specific ticker symbol.
   * @param {string} symbol - Ticker symbol
   */
  getQuote(symbol) {
    return this.quotes.get(symbol);
  }

  /**
   * Returns an array of all active stock quotes in the market.
   */
  getQuotes() {
    return Array.from(this.quotes.values());
  }

  /**
   * Generates a market tick: introduces realistic Brownian drift (+/- 0.8%) to stock prices
   * and recalculates day percentage changes, then emits a 'tick' event.
   */
  tick() {
    const now = new Date().toISOString();
    this.quotes.forEach((quote) => {
      // Stochastic drift simulation
      const drift = (Math.random() - 0.495) * 0.008;
      const nextPrice = Math.max(1, quote.price * (1 + drift));
      quote.price = Number(nextPrice.toFixed(2));
      quote.dayChangePercent = Number(
        (((quote.price - quote.open) / quote.open) * 100).toFixed(2)
      );
      quote.updatedAt = now;
    });
    this.emit("tick", this.getQuotes());
  }

  /**
   * Starts the background interval timer to trigger ticks.
   */
  start() {
    if (this.timer) return;
    this.timer = setInterval(() => this.tick(), TICK_INTERVAL_MS);
    this.timer.unref(); // Allows process to exit cleanly if this is the only active handle
  }

  /**
   * Stops the market ticker interval.
   */
  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}

/**
 * PortfolioHistory Class
 * Stores rolling snapshots of total portfolio value and P&L over time.
 */
class PortfolioHistory {
  constructor() {
    this.samples = [];
  }

  /**
   * Appends a new valuation snapshot, maintaining a maximum size of HISTORY_LIMIT.
   * @param {Object} sample - { time, investment, currentValue, pnl, pnlPercent }
   */
  push(sample) {
    this.samples.push(sample);
    if (this.samples.length > HISTORY_LIMIT) {
      this.samples.shift(); // Evict oldest sample to maintain sliding window
    }
  }

  /**
   * Returns all recorded history points.
   */
  getAll() {
    return this.samples;
  }
}

module.exports = {
  priceEngine: new PriceEngine(),
  portfolioHistory: new PortfolioHistory(),
};
