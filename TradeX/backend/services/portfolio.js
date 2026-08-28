/**
 * ============================================================================
 * Portfolio Calculation & Position Tracking Engine (portfolio.js)
 * ============================================================================
 * Purpose:
 *   Core financial math engine for calculating weighted average cost,
 *   realized profit & loss (P&L), unrealized gains, day return percentages,
 *   and applying BUY / SELL transactions to database or in-memory stores.
 *
 * Key Concepts:
 *   - Weighted Average Cost: On BUY, newAvg = (oldAvg * oldQty + price * qty) / totalQty
 *   - Realized P&L: On SELL, realizedPnl = (sellPrice - avgCost) * soldQty
 *   - Hybrid Persistence: Handles both MongoDB documents and in-memory arrays.
 * ============================================================================
 */

/**
 * Rounds a number to exactly two decimal places.
 * @param {number|string} value - Numerical input
 * @returns {number} - Rounded 2-decimal number
 */
const round2 = (value) => Number(Number(value).toFixed(2));

/**
 * Computes return percentage and formatted string with positive (+) / negative sign.
 *
 * @param {number} avg - Average cost price
 * @param {number} price - Current market price
 * @returns {{ net: string, isLoss: boolean }} - Formatted percentage and loss indicator
 */
const changeStrings = (avg, price) => {
  const netPercent = avg > 0 ? ((price - avg) / avg) * 100 : 0;
  const sign = netPercent >= 0 ? "+" : "";
  return {
    net: `${sign}${netPercent.toFixed(2)}%`,
    isLoss: netPercent < 0,
  };
};

/**
 * Recalculates holding metrics after a BUY order.
 * Updates quantity, recalculates weighted average price, and updates P&L.
 *
 * @param {Object|null} holding - Existing holding object or null if new stock
 * @param {number} qty - Added quantity
 * @param {number} price - Purchase price
 * @returns {Object} - Updated holding fields
 */
const applyBuy = (holding, qty, price) => {
  const prevQty = holding ? holding.qty : 0;
  const prevAvg = holding ? holding.avg : 0;
  const newQty = prevQty + qty;
  const newAvg = round2((prevAvg * prevQty + price * qty) / newQty);
  const { net, isLoss } = changeStrings(newAvg, price);

  return {
    qty: newQty,
    avg: newAvg,
    price: round2(price),
    net,
    day: "+0.00%",
    isLoss,
  };
};

/**
 * Recalculates holding metrics after a SELL order.
 * Deducts sold quantity, computes realized P&L based on cost basis, and removes holding if qty <= 0.
 *
 * @param {Object|null} holding - Existing holding object
 * @param {number} qty - Sold quantity
 * @param {number} price - Sell price
 * @returns {Object} - Result with update instruction, soldQty, avgCost, and realizedPnl
 */
const applySell = (holding, qty, price) => {
  if (!holding) {
    return { update: null, soldQty: 0, avgCost: 0, realizedPnl: 0 };
  }

  const soldQty = Math.min(qty, holding.qty);
  const avgCost = holding.avg;
  const realizedPnl = round2((price - avgCost) * soldQty);
  const remainingQty = holding.qty - soldQty;

  if (remainingQty <= 0) {
    return { update: { remove: true }, soldQty, avgCost, realizedPnl };
  }

  const { net, isLoss } = changeStrings(holding.avg, price);
  return {
    update: {
      qty: remainingQty,
      avg: holding.avg,
      price: round2(price),
      net,
      day: holding.day,
      isLoss,
    },
    soldQty,
    avgCost,
    realizedPnl,
  };
};

/**
 * Applies a new order (BUY/SELL) directly to MongoDB collection.
 *
 * @param {Model} HoldingsModel - Mongoose Holdings Model
 * @param {Object} order - Executed order details { name, qty, price, mode }
 * @returns {Promise<{ avgCost: number, realizedPnl: number }>}
 */
const applyOrderToMongo = async (HoldingsModel, order) => {
  const holding = await HoldingsModel.findOne({ name: order.name });

  if (order.mode === "BUY") {
    const fields = applyBuy(holding, order.qty, order.price);
    if (holding) {
      await HoldingsModel.updateOne({ _id: holding._id }, { $set: fields });
    } else {
      await HoldingsModel.create({ name: order.name, ...fields });
    }
    return { avgCost: fields.avg, realizedPnl: 0 };
  }

  const { update, avgCost, realizedPnl } = applySell(
    holding,
    order.qty,
    order.price
  );

  if (update) {
    if (update.remove) {
      await HoldingsModel.deleteOne({ _id: holding._id });
    } else {
      await HoldingsModel.updateOne({ _id: holding._id }, { $set: update });
    }
  }

  return { avgCost, realizedPnl };
};

/**
 * Applies a new order (BUY/SELL) to in-memory holdings array when DB is offline.
 *
 * @param {Array<Object>} memoryHoldings - In-memory holdings list
 * @param {Object} order - Executed order details
 * @returns {{ avgCost: number, realizedPnl: number }}
 */
const applyOrderToMemory = (memoryHoldings, order) => {
  const index = memoryHoldings.findIndex((h) => h.name === order.name);
  const holding = index >= 0 ? memoryHoldings[index] : null;

  if (order.mode === "BUY") {
    const fields = applyBuy(holding, order.qty, order.price);
    if (holding) {
      memoryHoldings[index] = { ...holding, ...fields };
    } else {
      memoryHoldings.push({
        _id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        name: order.name,
        ...fields,
      });
    }
    return { avgCost: fields.avg, realizedPnl: 0 };
  }

  const { update, avgCost, realizedPnl } = applySell(
    holding,
    order.qty,
    order.price
  );

  if (update) {
    if (update.remove) {
      memoryHoldings.splice(index, 1);
    } else {
      memoryHoldings[index] = { ...holding, ...update };
    }
  }

  return { avgCost, realizedPnl };
};

/**
 * Computes portfolio valuation summary across all holdings:
 * Total Investment, Current Portfolio Value, Unrealized P&L, and Return %.
 *
 * @param {Array<Object>} holdings - Array of current stock holdings
 * @returns {{ investment: number, currentValue: number, pnl: number, pnlPercent: number }}
 */
const portfolioTotals = (holdings) => {
  const investment = holdings.reduce((sum, h) => sum + h.avg * h.qty, 0);
  const currentValue = holdings.reduce((sum, h) => sum + h.price * h.qty, 0);
  const pnl = currentValue - investment;
  return {
    investment: round2(investment),
    currentValue: round2(currentValue),
    pnl: round2(pnl),
    pnlPercent: investment > 0 ? round2((pnl / investment) * 100) : 0,
  };
};

module.exports = {
  applyOrderToMongo,
  applyOrderToMemory,
  portfolioTotals,
  round2,
  changeStrings,
};
