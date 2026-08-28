/**
 * ============================================================================
 * TradeX Trading Dashboard Entry Point (index.js)
 * ============================================================================
 * Purpose:
 *   Initializes and mounts the React application for the TradeX Trading Dashboard.
 *   Uses `HashRouter` for robust client-side routing across static hosts and local dev.
 * ============================================================================
 */

import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import Home from "./components/Home";

// Mount the React root container
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        {/* Wildcard path delegates sub-navigation to Dashboard child routes */}
        <Route path="/*" element={<Home />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>
);
