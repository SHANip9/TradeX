/**
 * ============================================================================
 * Dashboard Home Container (Home.js)
 * ============================================================================
 * Purpose:
 *   Root layout component for the TradeX dashboard application.
 *   Composes the sticky `TopBar` navigation and the main `Dashboard` workspace.
 * ============================================================================
 */

import React from "react";
import Dashboard from "./Dashboard";
import TopBar from "./TopBar";

const Home = () => {
  return (
    <>
      {/* Top navigation header displaying market indices and user profile */}
      <TopBar />
      {/* Main trading screen containing watchlist sidebar and tab views */}
      <Dashboard />
    </>
  );
};

export default Home;
