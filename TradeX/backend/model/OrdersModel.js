/**
 * ============================================================================
 * Orders Mongoose Model (OrdersModel.js)
 * ============================================================================
 * Purpose:
 *   Instantiates and exports the Mongoose model for the "order" collection in MongoDB.
 *   Provides query, aggregation, and persistence methods for all trade executions.
 * ============================================================================
 */

const { model } = require("mongoose");
const { OrdersSchema } = require("../schemas/OrdersSchema");

const OrdersModel = new model("order", OrdersSchema);

module.exports = { OrdersModel };
