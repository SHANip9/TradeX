/**
 * ============================================================================
 * Trade Execution Action Window Modal (BuyActionWindow.js)
 * ============================================================================
 * Purpose:
 *   Modal popup dialog for placing real-time BUY and SELL equity orders.
 *   - Configurable order quantity and limit/execution price.
 *   - Computes required leverage margin in real time (20% margin requirement).
 *   - Submits payload to POST `/newOrder` and dispatches global `orderPlaced` event
 *     to instantly trigger UI re-renders across Holdings, Orders, and Analytics.
 * ============================================================================
 */

import React, { useState } from "react";
import api from "../api";
import "./BuyActionWindow.css";

const BuyActionWindow = ({ uid, initialPrice = 0, mode = "BUY", onClose }) => {
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(initialPrice);
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const actionLabel = mode === "SELL" ? "Sell" : "Buy";
  // Calculate 20% margin requirement
  const marginRequired =
    Number(stockQuantity || 0) * Number(stockPrice || 0) * 0.2;

  /**
   * Dispatches order execution to backend API
   */
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setStatus("");

    try {
      await api.post("/newOrder", {
        name: uid,
        qty: Number(stockQuantity),
        price: Number(stockPrice),
        mode,
      });
      // Broadcast custom event so other components refresh their data immediately
      window.dispatchEvent(new Event("orderPlaced"));
      onClose();
    } catch (error) {
      setStatus(error.response?.data?.message || "Could not place order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="trade-window" id="buy-window">
      {/* Modal Header */}
      <div className={`header ${mode === "SELL" ? "sell-header" : ""}`}>
        <h3>
          {actionLabel} {uid} <span>NSE</span>
        </h3>
        <div className="market-options">
          <label>
            <input type="radio" checked readOnly /> Regular
          </label>
          <label>
            <input type="radio" readOnly /> AMO
          </label>
        </div>
      </div>

      {/* Inputs for Quantity and Execution Price */}
      <div className="regular-order">
        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              name="qty"
              id="qty"
              min="1"
              onChange={(e) => setStockQuantity(e.target.value)}
              value={stockQuantity}
            />
          </fieldset>
          <fieldset>
            <legend>Price</legend>
            <input
              type="number"
              name="price"
              id="price"
              step="0.05"
              min="0"
              onChange={(e) => setStockPrice(e.target.value)}
              value={stockPrice}
            />
          </fieldset>
        </div>
        {status && <p className="order-status">{status}</p>}
      </div>

      {/* Margin and Action Confirmation Buttons */}
      <div className="buttons">
        <span>Margin required Rs. {marginRequired.toFixed(2)}</span>
        <div>
          <button
            className={`btn ${mode === "SELL" ? "btn-sell" : "btn-blue"}`}
            disabled={isSubmitting}
            onClick={handleSubmit}
            type="button"
          >
            {isSubmitting ? "Placing..." : actionLabel}
          </button>
          <button className="btn btn-grey" onClick={onClose} type="button">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyActionWindow;
