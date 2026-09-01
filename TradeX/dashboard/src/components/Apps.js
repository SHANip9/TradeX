/**
 * ============================================================================
 * Ecosystem Apps Navigation Component (Apps.js)
 * ============================================================================
 * Purpose:
 *   Displays the TradeX product ecosystem grid (Terminal, Console analytics,
 *   Coin mutual fund investments) within the user dashboard.
 * ============================================================================
 */

import React from "react";
import { Link } from "react-router-dom";

const Apps = () => {
  return (
    <div className="apps-page">
      <h3 className="title">Apps &amp; Products</h3>
      <div className="app-grid">
        <div>
          <h4>TradeX Terminal</h4>
          <p>Next-generation ultra-fast trading terminal and real-time market watch.</p>
        </div>
        <div>
          <h4>Console</h4>
          <p>Portfolio analytics, tax P&amp;L reports, and trade execution insights.</p>
        </div>
        <div>
          <h4>Coin</h4>
          <p>Direct mutual funds investment platform with zero brokerage commissions.</p>
        </div>
        <div style={{ borderLeft: "3px solid #F59E0B" }}>
          <h4>Power BI Analytics</h4>
          <p>Executive reporting, interactive PDF reports, and exported DAX business intelligence models.</p>
          <Link to="/powerbi" style={{ color: "#2563EB", textDecoration: "none", fontSize: "0.82rem", fontWeight: 500, marginTop: "8px", display: "inline-block" }}>
            Open Power BI Workspace →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Apps;
