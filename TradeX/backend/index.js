const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dns = require("dns");
require("dotenv").config();

const { HoldingsModel } = require("./model/HoldingsModel");
const { PositionsModel } = require("./model/PositionsModel");
const { OrdersModel } = require("./model/OrdersModel");
const { defaultHoldings, defaultPositions } = require("./data/defaultData");
const {
  getMongoHost,
  getMongoTroubleshootingHint,
  redactMongoUrl,
} = require("./utils/mongoStatus");
const { toCsv } = require("./utils/csv");
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

const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;
const dnsServers = (process.env.DNS_SERVERS || "8.8.8.8,1.1.1.1")
  .split(",")
  .map((server) => server.trim())
  .filter(Boolean);

if (dnsServers.length > 0) {
  dns.setServers(dnsServers);
}

const app = express();
let isMongoConnected = false;
let mongoConnectionError = "";
let mongoConnectionHint = "";
let memoryOrders = [];
const memoryHoldings = defaultHoldings.map((holding, index) => ({
  _id: `memory-holding-${index}`,
  ...holding,
}));

app.use(cors());
app.use(express.json());

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

const getHoldings = async () => {
  if (!isMongoConnected) {
    return memoryHoldings;
  }
  return HoldingsModel.find({}).lean();
};

const registerHoldingSymbols = async () => {
  const holdings = await getHoldings();
  holdings.forEach((holding) => priceEngine.register(holding.name, holding.price));
};

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

priceEngine.on("tick", async (quotes) => {
  try {
    const holdings = await applyQuotesToHoldings(quotes);
    const totals = portfolioTotals(holdings);
    portfolioHistory.push({ time: new Date().toISOString(), ...totals });
  } catch (error) {
    console.warn(`Price tick failed: ${error.message}`);
  }
});

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

app.get("/allHoldings", async (req, res) => {
  try {
    const holdings = await getHoldings();
    return res.json(holdings);
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch holdings." });
  }
});

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

app.get("/quotes", (req, res) => {
  res.json(priceEngine.getQuotes());
});

app.get("/portfolio/summary", async (req, res) => {
  try {
    const holdings = await getHoldings();
    return res.json(portfolioTotals(holdings));
  } catch (error) {
    return res.status(500).json({ message: "Unable to compute portfolio summary." });
  }
});

app.get("/portfolio/history", (req, res) => {
  res.json(portfolioHistory.getAll());
});

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

const sendCsv = (res, filename, rows, columns) => {
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.send(toCsv(rows, columns));
};

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

app.get("/health", (req, res) => {
  res.json({
    ok: true,
    database: isMongoConnected ? "mongodb" : "memory",
    mongoHost: getMongoHost(uri),
    mongoError: mongoConnectionError,
    mongoHint: mongoConnectionHint,
  });
});

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
