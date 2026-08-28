/**
 * ============================================================================
 * Holdings Mongoose Model (HoldingsModel.js)
 * ============================================================================
 * Purpose:
 *   Instantiates and exports the Mongoose model for the "holding" collection in MongoDB.
 *   Provides query and mutation methods for managing equity holdings.
 * ============================================================================
 */

const { model } = require("mongoose");
const { HoldingsSchema } = require("../schemas/HoldingsSchema");

const HoldingsModel = new model("holding", HoldingsSchema);

module.exports = { HoldingsModel };
