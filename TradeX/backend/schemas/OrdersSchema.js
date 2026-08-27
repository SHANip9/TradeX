const { Schema } = require("mongoose");

const OrdersSchema = new Schema(
  {
    name: String,
    qty: Number,
    price: Number,
    mode: String,
    avgCost: { type: Number, default: 0 },
    realizedPnl: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = { OrdersSchema };
