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
      </div>
    </div>
  );
};

export default Apps;
