const EventEmitter = require("events");

const TICK_INTERVAL_MS = Number(process.env.TICK_INTERVAL_MS || 3000);
const HISTORY_LIMIT = 500;

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

class PriceEngine extends EventEmitter {
  constructor() {
    super();
    this.quotes = new Map();
    this.timer = null;

    Object.entries(seedSymbols).forEach(([symbol, price]) => {
      this.register(symbol, price);
    });
  }

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

  getQuote(symbol) {
    return this.quotes.get(symbol);
  }

  getQuotes() {
    return Array.from(this.quotes.values());
  }

  tick() {
    const now = new Date().toISOString();
    this.quotes.forEach((quote) => {
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

  start() {
    if (this.timer) return;
    this.timer = setInterval(() => this.tick(), TICK_INTERVAL_MS);
    this.timer.unref();
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}

class PortfolioHistory {
  constructor() {
    this.samples = [];
  }

  push(sample) {
    this.samples.push(sample);
    if (this.samples.length > HISTORY_LIMIT) {
      this.samples.shift();
    }
  }

  getAll() {
    return this.samples;
  }
}

module.exports = {
  priceEngine: new PriceEngine(),
  portfolioHistory: new PortfolioHistory(),
};
