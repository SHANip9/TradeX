/**
 * ============================================================================
 * Order Book & Trade History Component (Orders.js)
 * ============================================================================
 * Purpose:
 *   Lists all executed BUY and SELL orders in reverse chronological order.
 *   - Fetches historical orders from `/allOrders`.
 *   - Updates automatically when new orders are placed via `orderPlaced` event listener.
 *   - Allows deleting / canceling individual orders via `DELETE /orders/:id`.
 *   - Formats execution timestamp, order mode (BUY/SELL), instrument, qty, price, and status.
 * ============================================================================
 */

import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  /**
   * Fetches latest executed orders from backend API
   */
  const fetchOrders = useCallback(() => {
    setIsLoading(true);
    api
      .get("/allOrders")
      .then((res) => {
        setOrders(res.data);
        setError("");
      })
      .catch(() => {
        setError("Could not load orders. Start the backend and try again.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    fetchOrders();
    // Re-fetch orders whenever a new trade order is submitted in the app
    window.addEventListener("orderPlaced", fetchOrders);

    return () => window.removeEventListener("orderPlaced", fetchOrders);
  }, [fetchOrders]);

  /**
   * Deletes an order record from database/memory
   */
  const handleDelete = async (id) => {
    await api.delete(`/orders/${id}`);
    fetchOrders();
  };

  if (isLoading) {
    return <p className="inline-note">Loading orders...</p>;
  }

  return (
    <div className="orders">
      <h3 className="title">Orders ({orders.length})</h3>
      {error && <p className="inline-note">{error}</p>}

      {/* Empty State when no orders exist */}
      {orders.length === 0 ? (
        <div className="no-orders">
          <p>You haven't placed any orders today</p>
          <Link to="/" className="btn">
            Get started
          </Link>
        </div>
      ) : (
        /* Orders History Data Table */
        <div className="order-table">
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Type</th>
                <th>Instrument</th>
                <th>Qty.</th>
                <th>Price</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleString()
                      : "Just now"}
                  </td>
                  <td className={order.mode === "SELL" ? "loss" : "profit"}>
                    {order.mode}
                  </td>
                  <td>{order.name}</td>
                  <td>{order.qty}</td>
                  <td>{Number(order.price).toFixed(2)}</td>
                  <td>Completed</td>
                  <td>
                    <button
                      className="text-button"
                      onClick={() => handleDelete(order._id)}
                      type="button"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;
