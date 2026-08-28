/**
 * ============================================================================
 * Executive Account & Portfolio Summary (Summary.js)
 * ============================================================================
 * Purpose:
 *   Default overview landing view inside the trading dashboard.
 *   - Fetches live equity holdings from the backend API `/allHoldings` every 3 seconds.
 *   - Dynamically calculates:
 *       1. Total Capital Investment (Sum of avg * qty)
 *       2. Current Portfolio Valuation (Sum of LTP * qty)
 *       3. Net Unrealized Profit / Loss (Current Value - Investment)
 *       4. Percentage Return (%)
 *   - Displays available margin, margin utilized, and account status metrics.
 * ============================================================================
 */

import React, { useEffect, useState } from "react";
import api from "../api";
import { holdings } from "../data/data";

const Summary = () => {
  // Holdings state (initialized with offline fallback data)
  const [allHoldings, setAllHoldings] = useState(holdings);

  // Poll backend API every 3 seconds for real-time valuation updates
  useEffect(() => {
    const fetchHoldings = () => {
      api
        .get("/allHoldings")
        .then((res) => setAllHoldings(res.data))
        .catch(() => {
          setAllHoldings(holdings);
        });
    };

    fetchHoldings();
    const timer = setInterval(fetchHoldings, 3000);
    return () => clearInterval(timer);
  }, []);

  // Compute portfolio valuation aggregates
  const investment = allHoldings.reduce(
    (sum, stock) => sum + stock.avg * stock.qty,
    0
  );
  const currentValue = allHoldings.reduce(
    (sum, stock) => sum + stock.price * stock.qty,
    0
  );
  const pnl = currentValue - investment;
  const pnlPercent = investment ? (pnl / investment) * 100 : 0;

  return (
    <>
      {/* User Greeting Section */}
      <div className="username">
        <h6>Hi, User!</h6>
        <hr className="divider" />
      </div>

      {/* Margin & Available Capital Overview */}
      <div className="section">
        <span>
          <p>Equity</p>
        </span>

        <div className="data">
          <div className="first">
            <h3>3.74k</h3>
            <p>Margin available</p>
          </div>
          <hr />

          <div className="second">
            <p>
              Margins used <span>0</span>{" "}
            </p>
            <p>
              Opening balance <span>3.74k</span>{" "}
            </p>
          </div>
        </div>
        <hr className="divider" />
      </div>

      {/* Holdings & Real-time P&L Overview */}
      <div className="section">
        <span>
          <p>Holdings ({allHoldings.length})</p>
        </span>

        <div className="data">
          <div className="first">
            <h3 className={pnl >= 0 ? "profit" : "loss"}>
              {(pnl / 1000).toFixed(2)}k{" "}
              <small>{pnlPercent.toFixed(2)}%</small>{" "}
            </h3>
            <p>P&amp;L</p>
          </div>
          <hr />

          <div className="second">
            <p>
              Current Value <span>{(currentValue / 1000).toFixed(2)}k</span>{" "}
            </p>
            <p>
              Investment <span>{(investment / 1000).toFixed(2)}k</span>{" "}
            </p>
          </div>
        </div>
        <hr className="divider" />
      </div>
    </>
  );
};

export default Summary;
