/**
 * ============================================================================
 * Financial Analytics & P&L Intelligence Dashboard (Analytics.js)
 * ============================================================================
 * Purpose:
 *   Comprehensive analytical visualizer and load simulation console:
 *     1. Executive KPI Cards: Total Trades, Overall Turnover, Realized P&L, Live Unrealized P&L.
 *     2. Time-Series Line Chart (Chart.js): Live valuation curve vs. invested capital.
 *     3. Bar Chart (Chart.js): Realized P&L breakdown by equity instrument.
 *     4. Quantitative Trade Table: Buy/Sell quantities, turnover, weighted prices, profits.
 *     5. Interactive Trade Simulator: "Simulate 500 trades" button triggers load test on backend.
 * ============================================================================
 */

import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import api from "../api";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const REFRESH_MS = 3000;

/**
 * Formats numerical values to Indian Rupee formatting (2 decimal places)
 */
const formatMoney = (value) =>
  Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const Analytics = () => {
  const [summary, setSummary] = useState(null);
  const [trades, setTrades] = useState([]);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const [isSimulating, setIsSimulating] = useState(false);

  /**
   * Fetches analytics summary, instrument breakdown, and valuation history concurrently
   */
  const fetchAll = useCallback(async () => {
    try {
      const [summaryRes, tradesRes, historyRes] = await Promise.all([
        api.get("/analytics/summary"),
        api.get("/analytics/trades"),
        api.get("/portfolio/history"),
      ]);
      setSummary(summaryRes.data);
      setTrades(tradesRes.data);
      setHistory(historyRes.data);
      setError("");
    } catch (err) {
      setError("Could not load analytics. Start the backend and try again.");
    }
  }, []);

  // Poll analytics endpoints every 3 seconds
  useEffect(() => {
    fetchAll();
    const timer = setInterval(fetchAll, REFRESH_MS);
    return () => clearInterval(timer);
  }, [fetchAll]);

  /**
   * Triggers background simulation of 500 orders and refreshes dashboard
   */
  const handleSimulate = async () => {
    setIsSimulating(true);
    try {
      await api.post("/simulate", { events: 500 });
      await fetchAll();
    } catch (err) {
      setError("Simulation failed. Start the backend and try again.");
    } finally {
      setIsSimulating(false);
    }
  };

  const totals = summary?.totals || {};
  const latest = history[history.length - 1];

  // Configuration for Live Portfolio Valuation Line Chart
  const historyData = {
    labels: history.map((point) =>
      new Date(point.time).toLocaleTimeString("en-IN", { hour12: false })
    ),
    datasets: [
      {
        label: "Portfolio value",
        data: history.map((point) => point.currentValue),
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.15)",
        fill: true,
        pointRadius: 0,
        tension: 0.3,
      },
      {
        label: "Investment",
        data: history.map((point) => point.investment),
        borderColor: "rgba(153, 102, 255, 1)",
        borderDash: [6, 4],
        pointRadius: 0,
        tension: 0.3,
      },
    ],
  };

  // Configuration for Realized P&L Bar Chart
  const topTrades = trades.slice(0, 10);
  const pnlData = {
    labels: topTrades.map((t) => t.symbol),
    datasets: [
      {
        label: "Realized P&L",
        data: topTrades.map((t) => t.realizedPnl),
        backgroundColor: topTrades.map((t) =>
          t.realizedPnl >= 0 ? "rgba(75, 192, 120, 0.6)" : "rgba(255, 99, 132, 0.6)"
        ),
      },
    ],
  };

  return (
    <div className="analytics">
      {/* Header and Simulation Trigger */}
      <h3 className="title">
        Analytics &amp; P&amp;L Dashboard
        <button
          className="btn btn-blue"
          style={{ marginLeft: "1rem" }}
          onClick={handleSimulate}
          disabled={isSimulating}
          type="button"
        >
          {isSimulating ? "Simulating..." : "Simulate 500 trades"}
        </button>
        <Link
          to="/powerbi"
          className="btn btn-pbix"
          style={{ marginLeft: "0.5rem", textDecoration: "none" }}
        >
          📊 Power BI Report
        </Link>
      </h3>
      {error && <p className="inline-note">{error}</p>}

      {/* KPI Metrics Row */}
      <div className="row">
        <div className="col">
          <h5>{totals.totalTrades || 0}</h5>
          <p>Total trades</p>
        </div>
        <div className="col">
          <h5>{formatMoney(totals.totalTurnover)}</h5>
          <p>Turnover</p>
        </div>
        <div className="col">
          <h5 className={(totals.realizedPnl || 0) >= 0 ? "profit" : "loss"}>
            {formatMoney(totals.realizedPnl)}
          </h5>
          <p>Realized P&amp;L</p>
        </div>
        <div className="col">
          <h5 className={(latest?.pnl || 0) >= 0 ? "profit" : "loss"}>
            {formatMoney(latest?.pnl)} ({latest ? latest.pnlPercent : 0}%)
          </h5>
          <p>Unrealized P&amp;L (live)</p>
        </div>
      </div>

      {/* Line Chart: Portfolio Value Trend */}
      <div className="chart-block">
        <Line
          data={historyData}
          options={{
            responsive: true,
            animation: false,
            plugins: {
              legend: { position: "top" },
              title: { display: true, text: "Live portfolio value" },
            },
          }}
        />
      </div>

      {/* Bar Chart: P&L by Instrument */}
      <div className="chart-block">
        <Bar
          data={pnlData}
          options={{
            responsive: true,
            plugins: {
              legend: { display: false },
              title: { display: true, text: "Realized P&L by instrument" },
            },
          }}
        />
      </div>

      {/* Trade-Level Analytics Table */}
      <h3 className="title">Trade-level analytics ({trades.length})</h3>
      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Trades</th>
              <th>Buy qty</th>
              <th>Sell qty</th>
              <th>Avg. buy</th>
              <th>Avg. sell</th>
              <th>Turnover</th>
              <th>Realized P&amp;L</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((t) => (
              <tr key={t.symbol}>
                <td>{t.symbol}</td>
                <td>{t.totalTrades}</td>
                <td>{t.buyQty}</td>
                <td>{t.sellQty}</td>
                <td>{formatMoney(t.avgBuyPrice)}</td>
                <td>{formatMoney(t.avgSellPrice)}</td>
                <td>{formatMoney(t.turnover)}</td>
                <td className={t.realizedPnl >= 0 ? "profit" : "loss"}>
                  {formatMoney(t.realizedPnl)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Analytics;
