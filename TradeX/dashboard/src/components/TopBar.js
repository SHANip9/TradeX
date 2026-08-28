/**
 * ============================================================================
 * TopBar Header Component (TopBar.js)
 * ============================================================================
 * Purpose:
 *   Renders the persistent header bar across the top of the trading application.
 *   - Displays live ticker index snapshots for NIFTY 50 and SENSEX.
 *   - Houses the primary application navigation `Menu` component.
 * ============================================================================
 */

import React from "react";
import Menu from "./Menu";

const TopBar = () => {
  return (
    <div className="topbar-container">
      {/* Benchmark Index Header Strip */}
      <div className="indices-container">
        <div className="nifty">
          <p className="index">NIFTY 50</p>
          <p className="index-points">{100.2} </p>
          <p className="percent"> </p>
        </div>
        <div className="sensex">
          <p className="index">SENSEX</p>
          <p className="index-points">{100.2}</p>
          <p className="percent"></p>
        </div>
      </div>

      {/* Main App Navigation Links and Profile Details */}
      <Menu />
    </div>
  );
};

export default TopBar;
