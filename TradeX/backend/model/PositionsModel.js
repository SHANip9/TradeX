/**
 * ============================================================================
 * Positions Mongoose Model (PositionsModel.js)
 * ============================================================================
 * Purpose:
 *   Instantiates and exports the Mongoose model for the "position" collection in MongoDB.
 *   Provides query and mutation methods for tracking open intraday/derivatives trades.
 * ============================================================================
 */

const { model } = require("mongoose");
const { PositionsSchema } = require("../schemas/PositionsSchema");

const PositionsModel = new model("position", PositionsSchema);

module.exports = { PositionsModel };
