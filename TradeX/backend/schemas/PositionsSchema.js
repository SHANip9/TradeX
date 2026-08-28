/**
 * ============================================================================
 * Positions Mongoose Schema (PositionsSchema.js)
 * ============================================================================
 * Purpose:
 *   Defines the database schema for open intraday / derivatives / CNC positions.
 *
 * Fields:
 *   - product : Product type (e.g. "CNC" for Cash & Carry, "MIS" for Intraday)
 *   - name    : Instrument symbol (e.g. "EVEREADY", "JUBLFOOD")
 *   - qty     : Position size/quantity
 *   - avg     : Average entry price
 *   - price   : Current market price (LTP)
 *   - net     : Net P&L percentage change string
 *   - day     : Day's price change percentage string
 *   - isLoss  : Boolean flag indicating if current position is in loss
 * ============================================================================
 */

const { Schema } = require("mongoose");

const PositionsSchema = new Schema({
  product: { type: String, default: "CNC" },
  name: { type: String, required: true },
  qty: { type: Number, required: true },
  avg: { type: Number, required: true },
  price: { type: Number, required: true },
  net: { type: String, default: "+0.00%" },
  day: { type: String, default: "+0.00%" },
  isLoss: { type: Boolean, default: false },
});

module.exports = { PositionsSchema };
