/**
 * ============================================================================
 * Holdings Mongoose Schema (HoldingsSchema.js)
 * ============================================================================
 * Purpose:
 *   Defines the database schema for long-term equity/stock holdings in TradeX.
 *
 * Fields:
 *   - name   : Ticker symbol of the asset (e.g., "RELIANCE", "TCS", "INFY")
 *   - qty    : Total quantity of shares currently held
 *   - avg    : Weighted average purchase price (INR)
 *   - price  : Last Traded Price (LTP), updated in real-time
 *   - net    : Overall percentage return formatted with +/- sign (e.g., "+10.04%")
 *   - day    : Daily change percentage (e.g., "+0.21%")
 *   - isLoss : Boolean flag indicating if overall P&L is negative
 * ============================================================================
 */

const { Schema } = require("mongoose");

const HoldingsSchema = new Schema({
  name: { type: String, required: true },
  qty: { type: Number, required: true },
  avg: { type: Number, required: true },
  price: { type: Number, required: true },
  net: { type: String, default: "+0.00%" },
  day: { type: String, default: "+0.00%" },
  isLoss: { type: Boolean, default: false },
});

module.exports = { HoldingsSchema };
