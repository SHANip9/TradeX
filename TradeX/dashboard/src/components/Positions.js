/**
 * ============================================================================
 * Open Trading Positions Component (Positions.js)
 * ============================================================================
 * Purpose:
 *   Displays active CNC (Cash & Carry) and Intraday (MIS) trading positions.
 *   - Fetches positions from `/allPositions` endpoint with fallback to local mock data.
 *   - Displays Product type, Instrument name, Quantity, Entry Price, LTP, and Net P&L.
 * ============================================================================
 */

import React, { useEffect, useState } from "react";
import { positions } from "../data/data";
import api from "../api";

const Positions = () => {
  const [allPositions, setAllPositions] = useState([]);
  const [isOfflineData, setIsOfflineData] = useState(false);

  useEffect(() => {
    // Fetch open positions from backend API
    api
      .get("/allPositions")
      .then((res) => {
        setAllPositions(res.data);
        setIsOfflineData(false);
      })
      .catch(() => {
        setAllPositions(positions);
        setIsOfflineData(true);
      });
  }, []);

  return (
    <>
      <h3 className="title">Positions ({allPositions.length})</h3>
      {isOfflineData && (
        <p className="inline-note">Showing starter positions because the API is unavailable.</p>
      )}

      {/* Positions Data Table */}
      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg.</th>
              <th>LTP</th>
              <th>P&amp;L</th>
              <th>Chg.</th>
            </tr>
          </thead>

          <tbody>
            {allPositions.map((stock) => {
              const curValue = stock.price * stock.qty;
              const isProfit = curValue - stock.avg * stock.qty >= 0.0;
              const profClass = isProfit ? "profit" : "loss";
              const dayClass = stock.isLoss ? "loss" : "profit";

              return (
                <tr key={stock._id || stock.name}>
                  <td>{stock.product}</td>
                  <td>{stock.name}</td>
                  <td>{stock.qty}</td>
                  <td>{stock.avg.toFixed(2)}</td>
                  <td>{stock.price.toFixed(2)}</td>
                  <td className={profClass}>
                    {(curValue - stock.avg * stock.qty).toFixed(2)}
                  </td>
                  <td className={dayClass}>{stock.day}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Positions;
