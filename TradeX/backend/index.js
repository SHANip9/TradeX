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

app.get("/allHoldings", async (req, res) => {
  try {
    if (!isMongoConnected) {
      return res.json(defaultHoldings);
    }

    const allHoldings = await HoldingsModel.find({});
    return res.json(allHoldings);
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

    const allOrders = await OrdersModel.find({}).sort({ createdAt: -1 });
    return res.json(allOrders);
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch orders." });
  }
});

app.post("/newOrder", async (req, res) => {
  try {
    const order = {
      name: String(req.body.name || "").trim().toUpperCase(),
      qty: Number(req.body.qty),
      price: Number(req.body.price),
      mode: String(req.body.mode || "BUY").toUpperCase(),
    };

    if (!order.name || !Number.isFinite(order.qty) || order.qty <= 0) {
      return res.status(400).json({ message: "A valid stock name and quantity are required." });
    }

    if (!Number.isFinite(order.price) || order.price < 0) {
      return res.status(400).json({ message: "A valid price is required." });
    }

    if (!["BUY", "SELL"].includes(order.mode)) {
      return res.status(400).json({ message: "Order mode must be BUY or SELL." });
    }

    if (!isMongoConnected) {
      const memoryOrder = {
        _id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        ...order,
        createdAt: new Date().toISOString(),
      };

      memoryOrders = [memoryOrder, ...memoryOrders];
      return res.status(201).json(memoryOrder);
    }

    const newOrder = await OrdersModel.create(order);
    return res.status(201).json(newOrder);
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

app.get("/health", (req, res) => {
  res.json({
    ok: true,
    database: isMongoConnected ? "mongodb" : "memory",
    mongoHost: getMongoHost(uri),
    mongoError: mongoConnectionError,
    mongoHint: mongoConnectionHint,
  });
});

connectDB().finally(() => {
  app.listen(PORT, () => {
    console.log(`API server running on http://localhost:${PORT}`);
  });
});
