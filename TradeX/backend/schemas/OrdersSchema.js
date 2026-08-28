/**
 * ============================================================================
 * Orders Mongoose Schema (OrdersSchema.js)
 * ============================================================================
 * Purpose:
 *   Defines the database schema for trading orders placed and executed on TradeX.
 *
 * Fields:
 *   - name        : Stock/Asset symbol (e.g. "RELIANCE", "SBIN")
 *   - qty         : Quantity executed in this order transaction
 *   - price       : Execution price per share (INR)
 *   - mode        : Transaction type ("BUY" or "SELL")
 *   - avgCost     : Weighted average cost base at the time of execution
 *   - realizedPnl : Realized profit/loss generated if this order was a SELL
 *   - timestamps  : Automatically creates `createdAt` and `updatedAt` ISO dates
 * ============================================================================
 */

const { Schema } = require("mongoose");

const OrdersSchema = new Schema(
  {
    name: { type: String, required: true },
    qty: { type: Number, required: true },
    price: { type: Number, required: true },
    mode: { type: String, enum: ["BUY", "SELL"], required: true },
    avgCost: { type: Number, default: 0 },
    realizedPnl: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = { OrdersSchema };
