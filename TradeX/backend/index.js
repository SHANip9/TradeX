/**
 * ============================================================================
 * TradeX Backend Main Server (index.js)
 * ============================================================================
 * Purpose:
 *   Express.js API Server providing RESTful endpoints, real-time market simulation,
 *   portfolio analytics, order execution, data exports (CSV), and health diagnostics.
 *
 * Architecture & Features:
 *   1. Dual Storage Engine:
 *      - Primary: MongoDB Atlas via Mongoose (Persistent)
 *      - Fallback: High-speed In-Memory Mock Store (Offline demo resilience)
 *   2. Real-Time Price Simulation:
 *      - `priceEngine` emits tick events every 3 seconds to update stock prices.
 *      - Dynamically updates active holdings and calculates total portfolio history.
 *   3. Financial Analytics & Pipeline:
 *      - Order aggregation, turnover calculation, realized/unrealized profit & loss.
 *   4. Export Engine:
 *      - Exports Holdings, Orders, and Trade Analytics as formatted CSVs for Power BI.
 * ============================================================================
 */

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dns = require("dns");
require("dotenv").config();

// Mongoose Models for Database Collections
const { HoldingsModel } = require("./model/HoldingsModel");
const { PositionsModel } = require("./model/PositionsModel");
const { OrdersModel } = require("./model/OrdersModel");

// Default starter seed data for initialization and fallback
const { defaultHoldings, defaultPositions } = require("./data/defaultData");

// Utility & Diagnostic modules
const {
  getMongoHost,
  getMongoTroubleshootingHint,
  redactMongoUrl,
} = require("./utils/mongoStatus");
const { toCsv } = require("./utils/csv");

// Business Logic Services
const { priceEngine, portfolioHistory } = require("./services/priceEngine");
const {
  applyOrderToMongo,
  applyOrderToMemory,
  portfolioTotals,
  round2,
  changeStrings,
} = require("./services/portfolio");
const {
  tradeStatsPipeline,
  summaryPipeline,
  timelinePipeline,
  emptySummary,
  tradeStatsFromMemory,
  summaryFromMemory,
  timelineFromMemory,
} = require("./services/analytics");

// Port Configuration (Default: 3002)
const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;

// Configure custom DNS servers (e.g. Google 8.8.8.8, Cloudflare 1.1.1.1) to resolve Atlas SRV records
const dnsServers = (process.env.DNS_SERVERS || "8.8.8.8,1.1.1.1")
  .split(",")
  .map((server) => server.trim())
  .filter(Boolean);

if (dnsServers.length > 0) {
  dns.setServers(dnsServers);
}

const app = express();

// Global Runtime State Variables
let isMongoConnected = false;
let mongoConnectionError = "";
let mongoConnectionHint = "";
let memoryOrders = [];
const memoryHoldings = defaultHoldings.map((holding, index) => ({
  _id: `memory-holding-${index}`,
  ...holding,
}));

// Express Middleware
app.use(cors());
app.use(express.json());

/**
 * Seeds initial stock holdings and positions into MongoDB if the collections are empty.
 */
const seedStarterData = async () => {
  const holdingsCount = await HoldingsModel.countDocuments();
  if (holdingsCount === 0) {
    await HoldingsModel.insertMany(defaultHoldings);
  }

  const positionsCount = await PositionsModel.countDocuments();
  if (positionsCount === 0) {
    await PositionsModel.insertMany(defaultPositions);
  }
};

/**
 * Connects to MongoDB Atlas cluster.
 * Gracefully falls back to in-memory state if connection fails or MONGO_URL is missing.
 */
const connectDB = async () => {
  if (!uri) {
    console.warn("MONGO_URL is missing. Using in-memory starter data.");
    return;
  }

  try {
    console.log(`Connecting to MongoDB at ${redactMongoUrl(uri)}`);
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    isMongoConnected = true;
    mongoConnectionError = "";
    mongoConnectionHint = "";
    await seedStarterData();
    console.log("DB connected and starter data is ready.");
  } catch (error) {
    isMongoConnected = false;
    mongoConnectionError = error.message;
    mongoConnectionHint = getMongoTroubleshootingHint(error);
    console.warn("MongoDB connection failed. Using in-memory starter data.");
    console.warn(error.message);
    console.warn(mongoConnectionHint);
  }
};

/**
 * Helper to fetch holdings from MongoDB if connected, or memoryHoldings otherwise.
 */
const getHoldings = async () => {
  if (!isMongoConnected) {
    return memoryHoldings;
  }
  return HoldingsModel.find({}).lean();
};

/**
 * Registers all portfolio symbols with the price engine so they receive live market quotes.
 */
const registerHoldingSymbols = async () => {
  const holdings = await getHoldings();
  holdings.forEach((holding) => priceEngine.register(holding.name, holding.price));
};

/**
 * Updates prices across all holdings based on live quotation ticks from PriceEngine.
 */
const applyQuotesToHoldings = async (quotes) => {
  const quoteMap = new Map(quotes.map((quote) => [quote.symbol, quote]));

  if (!isMongoConnected) {
    memoryHoldings.forEach((holding, index) => {
      const quote = quoteMap.get(holding.name);
      if (!quote) return;
      const { net, isLoss } = changeStrings(holding.avg, quote.price);
      const sign = quote.dayChangePercent >= 0 ? "+" : "";
      memoryHoldings[index] = {
        ...holding,
        price: quote.price,
        net,
        day: `${sign}${quote.dayChangePercent.toFixed(2)}%`,
        isLoss,
      };
    });
    return memoryHoldings;
  }

  const holdings = await HoldingsModel.find({}).lean();
  const operations = [];

  holdings.forEach((holding) => {
    const quote = quoteMap.get(holding.name);
    if (!quote) return;
    const { net, isLoss } = changeStrings(holding.avg, quote.price);
    const sign = quote.dayChangePercent >= 0 ? "+" : "";
    operations.push({
      updateOne: {
        filter: { _id: holding._id },
        update: {
          $set: {
            price: quote.price,
            net,
            day: `${sign}${quote.dayChangePercent.toFixed(2)}%`,
            isLoss,
          },
        },
      },
    });
    holding.price = quote.price;
  });

  if (operations.length > 0) {
    await HoldingsModel.bulkWrite(operations, { ordered: false });
  }

  return holdings;
};

// Listen to market price ticks to recalculate portfolio value and record timeline history
priceEngine.on("tick", async (quotes) => {
  try {
    const holdings = await applyQuotesToHoldings(quotes);
    const totals = portfolioTotals(holdings);
    portfolioHistory.push({ time: new Date().toISOString(), ...totals });
  } catch (error) {
    console.warn(`Price tick failed: ${error.message}`);
  }
});

/**
 * Persists an order to either MongoDB or in-memory array,
 * simultaneously updating weighted average cost and realized P&L on holdings.
 */
const persistOrder = async (order) => {
  const quote = priceEngine.getQuote(order.name);
  if (!quote) {
    priceEngine.register(order.name, order.price);
  }

  if (!isMongoConnected) {
    const { avgCost, realizedPnl } = applyOrderToMemory(memoryHoldings, order);
    const memoryOrder = {
      _id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      ...order,
      avgCost,
      realizedPnl,
      createdAt: new Date().toISOString(),
    };
    memoryOrders = [memoryOrder, ...memoryOrders];
    return memoryOrder;
  }

  const { avgCost, realizedPnl } = await applyOrderToMongo(HoldingsModel, order);
  return OrdersModel.create({ ...order, avgCost, realizedPnl });
};

/**
 * Validates and parses incoming order payloads.
 */
const parseOrder = (body) => {
  const order = {
    name: String(body.name || "").trim().toUpperCase(),
    qty: Number(body.qty),
    price: Number(body.price),
    mode: String(body.mode || "BUY").toUpperCase(),
  };

  if (!order.name || !Number.isFinite(order.qty) || order.qty <= 0) {
    return { error: "A valid stock name and quantity are required." };
  }

  if (!Number.isFinite(order.price) || order.price < 0) {
    return { error: "A valid price is required." };
  }

  if (!["BUY", "SELL"].includes(order.mode)) {
    return { error: "Order mode must be BUY or SELL." };
  }

  return { order };
};

// ============================================================================
// API ROUTES & ENDPOINTS
// ============================================================================

/**
 * GET / - Server status dashboard & API index
 */
app.get("/", (req, res) => {
  if (req.accepts("html")) {
    return res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>TradeX API Server</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; padding: 2rem; margin: 0; }
          .container { max-width: 800px; margin: 0 auto; background: #1e293b; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.5); }
          h1 { color: #38bdf8; margin-top: 0; }
          .badge { display: inline-block; padding: 0.25rem 0.75rem; border-radius: 9999px; background: #059669; color: white; font-weight: bold; font-size: 0.875rem; }
          .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 1.5rem 0; }
          .card { background: #334155; padding: 1rem; border-radius: 8px; }
          .card h3 { margin: 0 0 0.5rem 0; color: #94a3b8; font-size: 0.875rem; text-transform: uppercase; }
          .card a { color: #38bdf8; text-decoration: none; font-weight: bold; font-size: 1.1rem; }
          .card a:hover { text-decoration: underline; }
          ul { list-style: none; padding: 0; margin-top: 1rem; }
          li { padding: 0.6rem 0; border-bottom: 1px solid #334155; display: flex; justify-content: space-between; }
          li a { color: #38bdf8; font-family: monospace; text-decoration: none; font-weight: bold; }
          li a:hover { text-decoration: underline; }
          .desc { color: #94a3b8; font-size: 0.9rem; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>TradeX API Server</h1>
          <p><span class="badge">API Active</span> Running on <strong>http://localhost:${PORT}</strong></p>
          <div class="grid">
            <div class="card">
              <h3>Landing Page (Frontend)</h3>
              <a href="http://localhost:3000" target="_blank">http://localhost:3000 ↗</a>
            </div>
            <div class="card">
              <h3>Trading Dashboard</h3>
              <a href="http://localhost:3001" target="_blank">http://localhost:3001 ↗</a>
            </div>
          </div>
          <h2>Available API Endpoints</h2>
          <ul>
            <li><a href="/allHoldings">/allHoldings</a> <span class="desc">Portfolio holdings</span></li>
            <li><a href="/allPositions">/allPositions</a> <span class="desc">Trading positions</span></li>
            <li><a href="/allOrders">/allOrders</a> <span class="desc">Executed orders</span></li>
            <li><a href="/quotes">/quotes</a> <span class="desc">Live stock quotes</span></li>
            <li><a href="/portfolio/summary">/portfolio/summary</a> <span class="desc">Portfolio valuation & totals</span></li>
            <li><a href="/portfolio/history">/portfolio/history</a> <span class="desc">Portfolio history ticks</span></li>
            <li><a href="/analytics/trades">/analytics/trades</a> <span class="desc">Per-instrument trade stats</span></li>
            <li><a href="/analytics/summary">/analytics/summary</a> <span class="desc">Overall trading volume & P&L</span></li>
            <li><a href="/analytics/timeline">/analytics/timeline</a> <span class="desc">Minute-by-minute timeline</span></li>
            <li><a href="/export/holdings.csv">/export/holdings.csv</a> <span class="desc">Export holdings (CSV)</span></li>
            <li><a href="/export/orders.csv">/export/orders.csv</a> <span class="desc">Export orders (CSV)</span></li>
            <li><a href="/export/trade-analytics.csv">/export/trade-analytics.csv</a> <span class="desc">Export trade stats (CSV)</span></li>
            <li><a href="/health">/health</a> <span class="desc">Server & DB health check</span></li>
          </ul>
        </div>
      </body>
      </html>
    `);
  }
  return res.json({
    name: "TradeX API",
    status: "running",
    port: PORT,
    endpoints: [
      "/allHoldings",
      "/allPositions",
      "/allOrders",
      "/quotes",
      "/portfolio/summary",
      "/portfolio/history",
      "/analytics/trades",
      "/analytics/summary",
      "/analytics/timeline",
      "/export/holdings.csv",
      "/export/orders.csv",
      "/export/trade-analytics.csv",
      "/health"
    ]
  });
});

/**
 * GET /allHoldings - Returns all current stock holdings
 */
app.get("/allHoldings", async (req, res) => {
  try {
    const holdings = await getHoldings();
    return res.json(holdings);
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch holdings." });
  }
});

/**
 * GET /allPositions - Returns current trading positions (CNC / Intraday)
 */
app.get("/allPositions", async (req, res) => {
  try {
    if (!isMongoConnected) {
      return res.json(defaultPositions);
    }

    const allPositions = await PositionsModel.find({});
    return res.json(allPositions);
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch positions." });
  }
});

/**
 * GET /allOrders - Returns list of executed orders
 */
app.get("/allOrders", async (req, res) => {
  try {
    if (!isMongoConnected) {
      return res.json(memoryOrders);
    }

    const allOrders = await OrdersModel.find({}).sort({ createdAt: -1 }).limit(500);
    return res.json(allOrders);
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch orders." });
  }
});

/**
 * POST /newOrder - Places and executes a new stock order (BUY/SELL)
 */
app.post("/newOrder", async (req, res) => {
  try {
    const { order, error } = parseOrder(req.body);
    if (error) {
      return res.status(400).json({ message: error });
    }

    const saved = await persistOrder(order);
    return res.status(201).json(saved);
  } catch (error) {
    return res.status(500).json({ message: "Unable to save order." });
  }
});

/**
 * DELETE /orders/:id - Cancels / removes an order record by ID
 */
app.delete("/orders/:id", async (req, res) => {
  try {
    if (!isMongoConnected) {
      memoryOrders = memoryOrders.filter((order) => order._id !== req.params.id);
      return res.json({ message: "Order deleted." });
    }

    await OrdersModel.findByIdAndDelete(req.params.id);
    return res.json({ message: "Order deleted." });
  } catch (error) {
    return res.status(500).json({ message: "Unable to delete order." });
  }
});

/**
 * GET /quotes - Returns live ticker quotes for all active stocks
 */
app.get("/quotes", (req, res) => {
  res.json(priceEngine.getQuotes());
});

/**
 * GET /portfolio/summary - Computes aggregate investment, value, and P&L
 */
app.get("/portfolio/summary", async (req, res) => {
  try {
    const holdings = await getHoldings();
    return res.json(portfolioTotals(holdings));
  } catch (error) {
    return res.status(500).json({ message: "Unable to compute portfolio summary." });
  }
});

/**
 * GET /portfolio/history - Returns time-series valuation ticks for chart visualizer
 */
app.get("/portfolio/history", (req, res) => {
  res.json(portfolioHistory.getAll());
});

/**
 * GET /analytics/trades - Returns per-instrument statistics (turnover, avg prices, realized P&L)
 */
app.get("/analytics/trades", async (req, res) => {
  try {
    if (!isMongoConnected) {
      return res.json(tradeStatsFromMemory(memoryOrders));
    }

    const stats = await OrdersModel.aggregate(tradeStatsPipeline);
    return res.json(stats);
  } catch (error) {
    return res.status(500).json({ message: "Unable to compute trade analytics." });
  }
});

/**
 * GET /analytics/summary - High level summary of trade counts, turnover, and mode breakdown
 */
app.get("/analytics/summary", async (req, res) => {
  try {
    if (!isMongoConnected) {
      return res.json(summaryFromMemory(memoryOrders));
    }

    const [result] = await OrdersModel.aggregate(summaryPipeline);
    const summary = emptySummary();
    if (result) {
      summary.totals = result.totals[0] || summary.totals;
      summary.topTraded = result.topTraded;
      summary.byMode = result.byMode;
    }
    return res.json(summary);
  } catch (error) {
    return res.status(500).json({ message: "Unable to compute analytics summary." });
  }
});

/**
 * GET /analytics/timeline - Aggregates trade volume and P&L by minute
 */
app.get("/analytics/timeline", async (req, res) => {
  try {
    if (!isMongoConnected) {
      return res.json(timelineFromMemory(memoryOrders));
    }

    const timeline = await OrdersModel.aggregate(timelinePipeline);
    return res.json(timeline);
  } catch (error) {
    return res.status(500).json({ message: "Unable to compute trade timeline." });
  }
});

/**
 * POST /simulate - Stress test endpoint to trigger N randomized trade executions
 */
app.post("/simulate", async (req, res) => {
  try {
    const events = Math.min(Math.max(Number(req.body?.events) || 500, 1), 5000);
    const quotes = priceEngine.getQuotes();
    const startedAt = Date.now();

    const results = await Promise.allSettled(
      Array.from({ length: events }, () => {
        const quote = quotes[Math.floor(Math.random() * quotes.length)];
        const drift = 1 + (Math.random() - 0.5) * 0.01;
        const order = {
          name: quote.symbol,
          qty: 1 + Math.floor(Math.random() * 20),
          price: round2(quote.price * drift),
          mode: Math.random() < 0.6 ? "BUY" : "SELL",
        };
        return persistOrder(order);
      })
    );

    const durationMs = Date.now() - startedAt;
    const succeeded = results.filter((r) => r.status === "fulfilled").length;

    return res.json({
      requestedEvents: events,
      succeeded,
      failed: events - succeeded,
      durationMs,
      eventsPerSecond: round2((succeeded / Math.max(durationMs, 1)) * 1000),
    });
  } catch (error) {
    return res.status(500).json({ message: "Simulation failed." });
  }
});

/**
 * Helper to stream CSV response with attachment header
 */
const sendCsv = (res, filename, rows, columns) => {
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.send(toCsv(rows, columns));
};

/**
 * GET /export/holdings.csv - Exports current holdings table in CSV format
 */
app.get("/export/holdings.csv", async (req, res) => {
  try {
    const holdings = await getHoldings();
    const rows = holdings.map((h) => ({
      symbol: h.name,
      qty: h.qty,
      avgCost: h.avg,
      lastPrice: h.price,
      currentValue: round2(h.price * h.qty),
      investment: round2(h.avg * h.qty),
      unrealizedPnl: round2((h.price - h.avg) * h.qty),
      netChange: h.net,
      dayChange: h.day,
    }));
    return sendCsv(res, "holdings.csv", rows, [
      "symbol",
      "qty",
      "avgCost",
      "lastPrice",
      "currentValue",
      "investment",
      "unrealizedPnl",
      "netChange",
      "dayChange",
    ]);
  } catch (error) {
    return res.status(500).json({ message: "Unable to export holdings." });
  }
});

/**
 * GET /export/orders.csv - Exports order execution audit log in CSV format
 */
app.get("/export/orders.csv", async (req, res) => {
  try {
    const orders = isMongoConnected
      ? await OrdersModel.find({}).sort({ createdAt: -1 }).lean()
      : memoryOrders;
    const rows = orders.map((o) => ({
      orderId: o._id,
      symbol: o.name,
      mode: o.mode,
      qty: o.qty,
      price: o.price,
      value: round2(o.qty * o.price),
      avgCost: o.avgCost || 0,
      realizedPnl: o.realizedPnl || 0,
      createdAt: o.createdAt ? new Date(o.createdAt).toISOString() : "",
    }));
    return sendCsv(res, "orders.csv", rows, [
      "orderId",
      "symbol",
      "mode",
      "qty",
      "price",
      "value",
      "avgCost",
      "realizedPnl",
      "createdAt",
    ]);
  } catch (error) {
    return res.status(500).json({ message: "Unable to export orders." });
  }
});

/**
 * GET /export/trade-analytics.csv - Exports quantitative trade analytics summary in CSV format
 */
app.get("/export/trade-analytics.csv", async (req, res) => {
  try {
    const stats = isMongoConnected
      ? await OrdersModel.aggregate(tradeStatsPipeline)
      : tradeStatsFromMemory(memoryOrders);
    const rows = stats.map((s) => ({
      ...s,
      lastTradeAt: s.lastTradeAt ? new Date(s.lastTradeAt).toISOString() : "",
    }));
    return sendCsv(res, "trade-analytics.csv", rows, [
      "symbol",
      "totalTrades",
      "buyQty",
      "sellQty",
      "buyValue",
      "sellValue",
      "avgBuyPrice",
      "avgSellPrice",
      "realizedPnl",
      "turnover",
      "lastTradeAt",
    ]);
  } catch (error) {
    return res.status(500).json({ message: "Unable to export trade analytics." });
  }
});

/**
 * GET /health - Diagnostics endpoint reporting DB status, cluster host, and error traces
 */
app.get("/health", (req, res) => {
  res.json({
    ok: true,
    database: isMongoConnected ? "mongodb" : "memory",
    mongoHost: getMongoHost(uri),
    mongoError: mongoConnectionError,
    mongoHint: mongoConnectionHint,
  });
});

// Start Server and boot price engine
connectDB().finally(async () => {
  try {
    await registerHoldingSymbols();
  } catch (error) {
    console.warn(`Could not register holding symbols: ${error.message}`);
  }
  priceEngine.start();
  app.listen(PORT, () => {
    console.log(`TradeX API server running on http://localhost:${PORT}`);
  });
});
