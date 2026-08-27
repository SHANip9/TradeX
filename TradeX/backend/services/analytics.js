const { round2 } = require("./portfolio");

const tradeStatsPipeline = [
  {
    $addFields: {
      value: { $multiply: ["$qty", "$price"] },
    },
  },
  {
    $group: {
      _id: "$name",
      totalTrades: { $sum: 1 },
      buyQty: { $sum: { $cond: [{ $eq: ["$mode", "BUY"] }, "$qty", 0] } },
      sellQty: { $sum: { $cond: [{ $eq: ["$mode", "SELL"] }, "$qty", 0] } },
      buyValue: { $sum: { $cond: [{ $eq: ["$mode", "BUY"] }, "$value", 0] } },
      sellValue: { $sum: { $cond: [{ $eq: ["$mode", "SELL"] }, "$value", 0] } },
      avgBuyPrice: {
        $avg: { $cond: [{ $eq: ["$mode", "BUY"] }, "$price", null] },
      },
      avgSellPrice: {
        $avg: { $cond: [{ $eq: ["$mode", "SELL"] }, "$price", null] },
      },
      realizedPnl: { $sum: { $ifNull: ["$realizedPnl", 0] } },
      turnover: { $sum: "$value" },
      lastTradeAt: { $max: "$createdAt" },
    },
  },
  {
    $project: {
      _id: 0,
      symbol: "$_id",
      totalTrades: 1,
      buyQty: 1,
      sellQty: 1,
      buyValue: { $round: ["$buyValue", 2] },
      sellValue: { $round: ["$sellValue", 2] },
      avgBuyPrice: { $round: [{ $ifNull: ["$avgBuyPrice", 0] }, 2] },
      avgSellPrice: { $round: [{ $ifNull: ["$avgSellPrice", 0] }, 2] },
      realizedPnl: { $round: ["$realizedPnl", 2] },
      turnover: { $round: ["$turnover", 2] },
      lastTradeAt: 1,
    },
  },
  { $sort: { turnover: -1 } },
];

const summaryPipeline = [
  {
    $addFields: {
      value: { $multiply: ["$qty", "$price"] },
    },
  },
  {
    $facet: {
      totals: [
        {
          $group: {
            _id: null,
            totalTrades: { $sum: 1 },
            totalVolume: { $sum: "$qty" },
            totalTurnover: { $sum: "$value" },
            buyTurnover: {
              $sum: { $cond: [{ $eq: ["$mode", "BUY"] }, "$value", 0] },
            },
            sellTurnover: {
              $sum: { $cond: [{ $eq: ["$mode", "SELL"] }, "$value", 0] },
            },
            realizedPnl: { $sum: { $ifNull: ["$realizedPnl", 0] } },
          },
        },
        {
          $project: {
            _id: 0,
            totalTrades: 1,
            totalVolume: 1,
            totalTurnover: { $round: ["$totalTurnover", 2] },
            buyTurnover: { $round: ["$buyTurnover", 2] },
            sellTurnover: { $round: ["$sellTurnover", 2] },
            realizedPnl: { $round: ["$realizedPnl", 2] },
          },
        },
      ],
      topTraded: [
        { $group: { _id: "$name", trades: { $sum: 1 }, turnover: { $sum: "$value" } } },
        { $sort: { turnover: -1 } },
        { $limit: 5 },
        {
          $project: {
            _id: 0,
            symbol: "$_id",
            trades: 1,
            turnover: { $round: ["$turnover", 2] },
          },
        },
      ],
      byMode: [
        { $group: { _id: "$mode", trades: { $sum: 1 }, turnover: { $sum: "$value" } } },
        {
          $project: {
            _id: 0,
            mode: "$_id",
            trades: 1,
            turnover: { $round: ["$turnover", 2] },
          },
        },
      ],
    },
  },
];

const timelinePipeline = [
  {
    $group: {
      _id: {
        $dateTrunc: { date: "$createdAt", unit: "minute" },
      },
      trades: { $sum: 1 },
      volume: { $sum: "$qty" },
      turnover: { $sum: { $multiply: ["$qty", "$price"] } },
      realizedPnl: { $sum: { $ifNull: ["$realizedPnl", 0] } },
    },
  },
  {
    $project: {
      _id: 0,
      minute: "$_id",
      trades: 1,
      volume: 1,
      turnover: { $round: ["$turnover", 2] },
      realizedPnl: { $round: ["$realizedPnl", 2] },
    },
  },
  { $sort: { minute: 1 } },
];

const emptySummary = () => ({
  totals: {
    totalTrades: 0,
    totalVolume: 0,
    totalTurnover: 0,
    buyTurnover: 0,
    sellTurnover: 0,
    realizedPnl: 0,
  },
  topTraded: [],
  byMode: [],
});

const tradeStatsFromMemory = (orders) => {
  const bySymbol = new Map();

  orders.forEach((order) => {
    const value = order.qty * order.price;
    const stats = bySymbol.get(order.name) || {
      symbol: order.name,
      totalTrades: 0,
      buyQty: 0,
      sellQty: 0,
      buyValue: 0,
      sellValue: 0,
      buyPriceSum: 0,
      buyCount: 0,
      sellPriceSum: 0,
      sellCount: 0,
      realizedPnl: 0,
      turnover: 0,
      lastTradeAt: null,
    };

    stats.totalTrades += 1;
    stats.turnover += value;
    stats.realizedPnl += order.realizedPnl || 0;
    if (order.mode === "BUY") {
      stats.buyQty += order.qty;
      stats.buyValue += value;
      stats.buyPriceSum += order.price;
      stats.buyCount += 1;
    } else {
      stats.sellQty += order.qty;
      stats.sellValue += value;
      stats.sellPriceSum += order.price;
      stats.sellCount += 1;
    }
    if (!stats.lastTradeAt || order.createdAt > stats.lastTradeAt) {
      stats.lastTradeAt = order.createdAt;
    }
    bySymbol.set(order.name, stats);
  });

  return Array.from(bySymbol.values())
    .map((s) => ({
      symbol: s.symbol,
      totalTrades: s.totalTrades,
      buyQty: s.buyQty,
      sellQty: s.sellQty,
      buyValue: round2(s.buyValue),
      sellValue: round2(s.sellValue),
      avgBuyPrice: s.buyCount ? round2(s.buyPriceSum / s.buyCount) : 0,
      avgSellPrice: s.sellCount ? round2(s.sellPriceSum / s.sellCount) : 0,
      realizedPnl: round2(s.realizedPnl),
      turnover: round2(s.turnover),
      lastTradeAt: s.lastTradeAt,
    }))
    .sort((a, b) => b.turnover - a.turnover);
};

const summaryFromMemory = (orders) => {
  const result = emptySummary();
  const stats = tradeStatsFromMemory(orders);

  orders.forEach((order) => {
    const value = order.qty * order.price;
    result.totals.totalTrades += 1;
    result.totals.totalVolume += order.qty;
    result.totals.totalTurnover += value;
    result.totals.realizedPnl += order.realizedPnl || 0;
    if (order.mode === "BUY") {
      result.totals.buyTurnover += value;
    } else {
      result.totals.sellTurnover += value;
    }
  });

  Object.keys(result.totals).forEach((key) => {
    result.totals[key] = round2(result.totals[key]);
  });

  result.topTraded = stats.slice(0, 5).map((s) => ({
    symbol: s.symbol,
    trades: s.totalTrades,
    turnover: s.turnover,
  }));

  const modes = new Map();
  orders.forEach((order) => {
    const entry = modes.get(order.mode) || { mode: order.mode, trades: 0, turnover: 0 };
    entry.trades += 1;
    entry.turnover += order.qty * order.price;
    modes.set(order.mode, entry);
  });
  result.byMode = Array.from(modes.values()).map((m) => ({
    ...m,
    turnover: round2(m.turnover),
  }));

  return result;
};

const timelineFromMemory = (orders) => {
  const byMinute = new Map();

  orders.forEach((order) => {
    const created = new Date(order.createdAt || Date.now());
    created.setSeconds(0, 0);
    const key = created.toISOString();
    const entry = byMinute.get(key) || {
      minute: key,
      trades: 0,
      volume: 0,
      turnover: 0,
      realizedPnl: 0,
    };
    entry.trades += 1;
    entry.volume += order.qty;
    entry.turnover += order.qty * order.price;
    entry.realizedPnl += order.realizedPnl || 0;
    byMinute.set(key, entry);
  });

  return Array.from(byMinute.values())
    .map((e) => ({
      ...e,
      turnover: round2(e.turnover),
      realizedPnl: round2(e.realizedPnl),
    }))
    .sort((a, b) => new Date(a.minute) - new Date(b.minute));
};

module.exports = {
  tradeStatsPipeline,
  summaryPipeline,
  timelinePipeline,
  emptySummary,
  tradeStatsFromMemory,
  summaryFromMemory,
  timelineFromMemory,
};
